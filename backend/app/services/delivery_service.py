import uuid
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.delivery_repo import DeliveryRepository
from app.models.delivery import Delivery
from app.schemas.delivery import DeliveryCreate, DeliveryUpdate
from app.utils.exceptions import NotFoundError
from app.services.import_service import import_from_csv, import_from_excel


async def create_delivery(
    db: AsyncSession, company_id: uuid.UUID, data: DeliveryCreate
) -> Delivery:
    repo = DeliveryRepository(db)
    delivery = await repo.create({"company_id": company_id, **data.model_dump()})
    await db.commit()
    return delivery


async def list_deliveries(
    db: AsyncSession, company_id: uuid.UUID, offset: int = 0, limit: int = 20, status: str | None = None
) -> tuple[list[Delivery], int]:
    repo = DeliveryRepository(db)
    filters = []
    if status:
        filters.append(Delivery.status == status)
    return await repo.get_multi(company_id, offset=offset, limit=limit, filters=filters or None)


async def get_delivery(db: AsyncSession, delivery_id: uuid.UUID, company_id: uuid.UUID) -> Delivery:
    repo = DeliveryRepository(db)
    delivery = await repo.get_by_company(delivery_id, company_id)
    if delivery is None:
        raise NotFoundError(f"Delivery {delivery_id} not found")
    return delivery


async def update_delivery(
    db: AsyncSession, delivery_id: uuid.UUID, company_id: uuid.UUID, data: DeliveryUpdate
) -> Delivery:
    repo = DeliveryRepository(db)
    delivery = await repo.get_by_company(delivery_id, company_id)
    if delivery is None:
        raise NotFoundError(f"Delivery {delivery_id} not found")
    updated = await repo.update(delivery, data.model_dump(exclude_none=True))
    await db.commit()
    return updated


async def delete_delivery(
    db: AsyncSession, delivery_id: uuid.UUID, company_id: uuid.UUID
) -> None:
    repo = DeliveryRepository(db)
    delivery = await repo.get_by_company(delivery_id, company_id)
    if delivery is None:
        raise NotFoundError(f"Delivery {delivery_id} not found")
    await repo.delete(delivery)
    await db.commit()


async def import_deliveries(
    db: AsyncSession, company_id: uuid.UUID, file: UploadFile
) -> list[Delivery]:
    content = await file.read()
    filename = file.filename or ""

    if filename.endswith(".csv"):
        rows = import_from_csv(content)
    elif filename.endswith((".xlsx", ".xls")):
        rows = import_from_excel(content)
    else:
        raise ValueError("Unsupported file format. Use CSV or Excel.")

    repo = DeliveryRepository(db)
    created = []
    for row in rows:
        d = await repo.create({"company_id": company_id, **row})
        created.append(d)
    await db.commit()
    return created
