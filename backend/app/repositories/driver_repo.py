import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.base import BaseRepository
from app.models.driver import Driver


class DriverRepository(BaseRepository[Driver]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Driver, db)

    async def get_active(self, company_id: uuid.UUID) -> list[Driver]:
        result = await self.db.execute(
            select(Driver).where(
                Driver.company_id == company_id,
                Driver.is_active.is_(True),
            )
        )
        return list(result.scalars().all())
