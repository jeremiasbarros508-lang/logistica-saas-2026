from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.models.company import Company, Subscription


class CompanyRepository(BaseRepository[Company]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Company, db)


class SubscriptionRepository(BaseRepository[Subscription]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Subscription, db)
