import uuid
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.driver import DriverCreate, DriverRead, DriverUpdate
from app.schemas.base import PaginatedResponse
from app.repositories.driver_repo import DriverRepository
from app.utils.exceptions import NotFoundError

router = APIRouter()


@router.get("/", response_model=PaginatedResponse[DriverRead])
async def list_drivers(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    repo = DriverRepository(db)
    offset = (page - 1) * page_size
    items, total = await repo.get_multi(current_user.company_id, offset=offset, limit=page_size)
    return PaginatedResponse.create(items, total, page, page_size)


@router.post("/", response_model=DriverRead, status_code=201)
async def create_driver(
    data: DriverCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    repo = DriverRepository(db)
    driver = await repo.create({"company_id": current_user.company_id, **data.model_dump()})
    await db.commit()
    return driver


@router.get("/{driver_id}", response_model=DriverRead)
async def get_driver(
    driver_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    repo = DriverRepository(db)
    d = await repo.get_by_company(driver_id, current_user.company_id)
    if d is None:
        raise NotFoundError(f"Driver {driver_id} not found").to_http()
    return d


@router.put("/{driver_id}", response_model=DriverRead)
async def update_driver(
    driver_id: uuid.UUID,
    data: DriverUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    repo = DriverRepository(db)
    d = await repo.get_by_company(driver_id, current_user.company_id)
    if d is None:
        raise NotFoundError(f"Driver {driver_id} not found").to_http()
    updated = await repo.update(d, data.model_dump(exclude_none=True))
    await db.commit()
    return updated


@router.delete("/{driver_id}", status_code=204)
async def delete_driver(
    driver_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    repo = DriverRepository(db)
    d = await repo.get_by_company(driver_id, current_user.company_id)
    if d is None:
        raise NotFoundError(f"Driver {driver_id} not found").to_http()
    await repo.delete(d)
    await db.commit()
