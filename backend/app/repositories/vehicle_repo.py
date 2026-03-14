import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.base import BaseRepository
from app.models.vehicle import Vehicle


class VehicleRepository(BaseRepository[Vehicle]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Vehicle, db)

    async def get_active(self, company_id: uuid.UUID) -> list[Vehicle]:
        result = await self.db.execute(
            select(Vehicle).where(
                Vehicle.company_id == company_id,
                Vehicle.is_active.is_(True),
            )
        )
        return list(result.scalars().all())
