import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.base import BaseRepository
from app.models.delivery import Delivery
from app.core.constants import DeliveryStatus


class DeliveryRepository(BaseRepository[Delivery]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Delivery, db)

    async def get_pending(self, company_id: uuid.UUID) -> list[Delivery]:
        result = await self.db.execute(
            select(Delivery).where(
                Delivery.company_id == company_id,
                Delivery.status == DeliveryStatus.PENDING,
            )
        )
        return list(result.scalars().all())

    async def get_by_status(self, company_id: uuid.UUID, status: DeliveryStatus) -> list[Delivery]:
        result = await self.db.execute(
            select(Delivery).where(
                Delivery.company_id == company_id,
                Delivery.status == status,
            )
        )
        return list(result.scalars().all())
