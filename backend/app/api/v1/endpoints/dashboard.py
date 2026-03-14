from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.delivery import Delivery
from app.models.route import Route
from app.models.vehicle import Vehicle
from app.models.driver import Driver
from app.core.constants import DeliveryStatus, RouteStatus

router = APIRouter()


@router.get("/kpis")
async def get_kpis(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    cid = current_user.company_id

    async def count(model, *conditions):
        q = select(func.count()).select_from(model).where(model.company_id == cid, *conditions)
        return (await db.execute(q)).scalar_one()

    return {
        "deliveries": {
            "total": await count(Delivery),
            "pending": await count(Delivery, Delivery.status == DeliveryStatus.PENDING),
            "in_route": await count(Delivery, Delivery.status == DeliveryStatus.IN_ROUTE),
            "delivered": await count(Delivery, Delivery.status == DeliveryStatus.DELIVERED),
            "problem": await count(Delivery, Delivery.status == DeliveryStatus.PROBLEM),
        },
        "routes": {
            "total": await count(Route),
            "completed": await count(Route, Route.status == RouteStatus.COMPLETED),
            "processing": await count(Route, Route.status == RouteStatus.PROCESSING),
        },
        "vehicles": {
            "total": await count(Vehicle),
            "active": await count(Vehicle, Vehicle.is_active.is_(True)),
        },
        "drivers": {
            "total": await count(Driver),
            "active": await count(Driver, Driver.is_active.is_(True)),
        },
    }


@router.get("/metrics")
async def get_metrics(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    cid = current_user.company_id

    avg_distance = (
        await db.execute(
            select(func.avg(Route.total_distance_km)).where(
                Route.company_id == cid,
                Route.status == RouteStatus.COMPLETED,
            )
        )
    ).scalar_one()

    avg_score = (
        await db.execute(
            select(func.avg(Route.optimization_score)).where(
                Route.company_id == cid,
                Route.status == RouteStatus.COMPLETED,
            )
        )
    ).scalar_one()

    return {
        "avg_route_distance_km": round(float(avg_distance or 0), 2),
        "avg_optimization_score": round(float(avg_score or 0), 2),
    }


@router.get("/chart-data")
async def get_chart_data(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    cid = current_user.company_id

    # Deliveries grouped by status
    rows = (
        await db.execute(
            select(Delivery.status, func.count().label("count"))
            .where(Delivery.company_id == cid)
            .group_by(Delivery.status)
        )
    ).all()

    return {
        "deliveries_by_status": [{"status": r.status, "count": r.count} for r in rows]
    }
