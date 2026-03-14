import uuid
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.base import BaseRepository
from app.models.route import Route, RouteStop


class RouteRepository(BaseRepository[Route]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Route, db)

    async def get_with_stops(self, route_id: uuid.UUID, company_id: uuid.UUID) -> Route | None:
        result = await self.db.execute(
            select(Route)
            .options(selectinload(Route.stops))
            .where(Route.id == route_id, Route.company_id == company_id)
        )
        return result.scalar_one_or_none()


class RouteStopRepository(BaseRepository[RouteStop]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(RouteStop, db)
