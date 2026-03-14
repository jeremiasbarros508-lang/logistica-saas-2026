import uuid
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.vehicle import VehicleCreate, VehicleRead, VehicleUpdate
from app.schemas.base import PaginatedResponse
from app.repositories.vehicle_repo import VehicleRepository
from app.utils.exceptions import AppError, NotFoundError

router = APIRouter()


@router.get("/", response_model=PaginatedResponse[VehicleRead])
async def list_vehicles(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    repo = VehicleRepository(db)
    offset = (page - 1) * page_size
    items, total = await repo.get_multi(current_user.company_id, offset=offset, limit=page_size)
    return PaginatedResponse.create(items, total, page, page_size)


@router.post("/", response_model=VehicleRead, status_code=201)
async def create_vehicle(
    data: VehicleCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    repo = VehicleRepository(db)
    vehicle = await repo.create({"company_id": current_user.company_id, **data.model_dump()})
    await db.commit()
    return vehicle


@router.get("/{vehicle_id}", response_model=VehicleRead)
async def get_vehicle(
    vehicle_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    repo = VehicleRepository(db)
    v = await repo.get_by_company(vehicle_id, current_user.company_id)
    if v is None:
        raise NotFoundError(f"Vehicle {vehicle_id} not found").to_http()
    return v


@router.put("/{vehicle_id}", response_model=VehicleRead)
async def update_vehicle(
    vehicle_id: uuid.UUID,
    data: VehicleUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    repo = VehicleRepository(db)
    v = await repo.get_by_company(vehicle_id, current_user.company_id)
    if v is None:
        raise NotFoundError(f"Vehicle {vehicle_id} not found").to_http()
    updated = await repo.update(v, data.model_dump(exclude_none=True))
    await db.commit()
    return updated


@router.delete("/{vehicle_id}", status_code=204)
async def delete_vehicle(
    vehicle_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    repo = VehicleRepository(db)
    v = await repo.get_by_company(vehicle_id, current_user.company_id)
    if v is None:
        raise NotFoundError(f"Vehicle {vehicle_id} not found").to_http()
    await repo.delete(v)
    await db.commit()
