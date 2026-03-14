import uuid
from fastapi import APIRouter, Depends, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.delivery import DeliveryCreate, DeliveryRead, DeliveryUpdate
from app.schemas.base import PaginatedResponse
from app.services import delivery_service
from app.utils.exceptions import AppError

router = APIRouter()


@router.get("/", response_model=PaginatedResponse[DeliveryRead])
async def list_deliveries(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    offset = (page - 1) * page_size
    items, total = await delivery_service.list_deliveries(
        db, current_user.company_id, offset=offset, limit=page_size, status=status
    )
    return PaginatedResponse.create(items, total, page, page_size)


@router.post("/", response_model=DeliveryRead, status_code=201)
async def create_delivery(
    data: DeliveryCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        return await delivery_service.create_delivery(db, current_user.company_id, data)
    except AppError as e:
        raise e.to_http()


@router.get("/{delivery_id}", response_model=DeliveryRead)
async def get_delivery(
    delivery_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        return await delivery_service.get_delivery(db, delivery_id, current_user.company_id)
    except AppError as e:
        raise e.to_http()


@router.put("/{delivery_id}", response_model=DeliveryRead)
async def update_delivery(
    delivery_id: uuid.UUID,
    data: DeliveryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        return await delivery_service.update_delivery(db, delivery_id, current_user.company_id, data)
    except AppError as e:
        raise e.to_http()


@router.delete("/{delivery_id}", status_code=204)
async def delete_delivery(
    delivery_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        await delivery_service.delete_delivery(db, delivery_id, current_user.company_id)
    except AppError as e:
        raise e.to_http()


@router.post("/import", response_model=list[DeliveryRead], status_code=201)
async def import_deliveries(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        return await delivery_service.import_deliveries(db, current_user.company_id, file)
    except (AppError, ValueError) as e:
        if isinstance(e, AppError):
            raise e.to_http()
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{delivery_id}/map")
async def delivery_map(
    delivery_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        delivery = await delivery_service.get_delivery(db, delivery_id, current_user.company_id)
        return {
            "delivery_id": str(delivery.id),
            "lat": delivery.lat,
            "lng": delivery.lng,
            "address": delivery.address,
            "customer_name": delivery.customer_name,
        }
    except AppError as e:
        raise e.to_http()
