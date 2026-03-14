import uuid
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.company_repo import CompanyRepository
from app.models.company import Company
from app.models.delivery import Delivery
from app.models.route import Route
from app.models.user import User
from app.schemas.company import CompanyUpdate
from app.utils.exceptions import NotFoundError
from app.core.constants import DeliveryStatus, RouteStatus


async def get_company(db: AsyncSession, company_id: uuid.UUID) -> Company:
    repo = CompanyRepository(db)
    company = await repo.get(company_id)
    if company is None:
        raise NotFoundError(f"Company {company_id} not found")
    return company


async def update_company(
    db: AsyncSession, company_id: uuid.UUID, data: CompanyUpdate
) -> Company:
    repo = CompanyRepository(db)
    company = await repo.get(company_id)
    if company is None:
        raise NotFoundError(f"Company {company_id} not found")
    updated = await repo.update(company, data.model_dump(exclude_none=True))
    await db.commit()
    return updated


async def get_stats(db: AsyncSession, company_id: uuid.UUID) -> dict:
    deliveries_total = (
        await db.execute(
            select(func.count()).select_from(Delivery).where(Delivery.company_id == company_id)
        )
    ).scalar_one()

    delivered_count = (
        await db.execute(
            select(func.count())
            .select_from(Delivery)
            .where(
                Delivery.company_id == company_id,
                Delivery.status == DeliveryStatus.DELIVERED,
            )
        )
    ).scalar_one()

    routes_count = (
        await db.execute(
            select(func.count()).select_from(Route).where(Route.company_id == company_id)
        )
    ).scalar_one()

    users_count = (
        await db.execute(
            select(func.count()).select_from(User).where(User.company_id == company_id)
        )
    ).scalar_one()

    return {
        "deliveries_total": deliveries_total,
        "deliveries_delivered": delivered_count,
        "routes_total": routes_count,
        "users_total": users_count,
    }
