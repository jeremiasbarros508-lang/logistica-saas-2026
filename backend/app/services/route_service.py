import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.route_repo import RouteRepository, RouteStopRepository
from app.repositories.delivery_repo import DeliveryRepository
from app.models.route import Route, RouteStop
from app.models.delivery import Delivery
from app.schemas.route import RouteCreate, RouteUpdate
from app.core.constants import RouteStatus, DeliveryStatus
from app.utils.exceptions import NotFoundError
from app.algorithms.route_optimizer import RouteOptimizer


async def create_route(
    db: AsyncSession, company_id: uuid.UUID, data: RouteCreate
) -> Route:
    route_repo = RouteRepository(db)
    delivery_repo = DeliveryRepository(db)

    route = await route_repo.create(
        {
            "company_id": company_id,
            "name": data.name,
            "vehicle_id": data.vehicle_id,
            "driver_id": data.driver_id,
            "status": RouteStatus.PENDING,
            "stops_count": len(data.delivery_ids),
        }
    )

    stop_repo = RouteStopRepository(db)
    for i, d_id in enumerate(data.delivery_ids):
        await stop_repo.create(
            {
                "route_id": route.id,
                "delivery_id": d_id,
                "sequence_order": i,
            }
        )
        delivery = await delivery_repo.get_by_company(d_id, company_id)
        if delivery:
            await delivery_repo.update(delivery, {"route_id": route.id, "status": DeliveryStatus.IN_ROUTE})

    await db.commit()
    return route


async def get_route(db: AsyncSession, route_id: uuid.UUID, company_id: uuid.UUID) -> Route:
    route_repo = RouteRepository(db)
    route = await route_repo.get_with_stops(route_id, company_id)
    if route is None:
        raise NotFoundError(f"Route {route_id} not found")
    return route


async def list_routes(
    db: AsyncSession, company_id: uuid.UUID, offset: int = 0, limit: int = 20
) -> tuple[list[Route], int]:
    repo = RouteRepository(db)
    return await repo.get_multi(company_id, offset=offset, limit=limit)


async def optimize_route(db: AsyncSession, route_id: uuid.UUID, company_id: uuid.UUID) -> Route:
    route_repo = RouteRepository(db)
    stop_repo = RouteStopRepository(db)
    delivery_repo = DeliveryRepository(db)

    route = await route_repo.get_with_stops(route_id, company_id)
    if route is None:
        raise NotFoundError(f"Route {route_id} not found")

    await route_repo.update(route, {"status": RouteStatus.PROCESSING})
    await db.flush()

    # Gather deliveries with coordinates
    deliveries: list[Delivery] = []
    for stop in route.stops:
        d = await delivery_repo.get(stop.delivery_id)
        if d and d.lat is not None and d.lng is not None:
            deliveries.append(d)

    if len(deliveries) < 2:
        await route_repo.update(route, {"status": RouteStatus.COMPLETED})
        await db.commit()
        return route

    coords = [(d.lat, d.lng) for d in deliveries]  # type: ignore[arg-type]
    optimizer = RouteOptimizer()
    optimized_indices, total_distance = optimizer.optimize(coords)

    # Update stops order
    for seq, idx in enumerate(optimized_indices):
        d = deliveries[idx]
        for stop in route.stops:
            if stop.delivery_id == d.id:
                await stop_repo.update(stop, {"sequence_order": seq})
                break

    await route_repo.update(
        route,
        {
            "status": RouteStatus.COMPLETED,
            "total_distance_km": total_distance,
            "optimization_score": _compute_score(total_distance, len(deliveries)),
        },
    )
    await db.commit()
    return await route_repo.get_with_stops(route_id, company_id)  # type: ignore[return-value]


def _compute_score(distance_km: float, stops: int) -> float:
    if stops == 0 or distance_km == 0:
        return 100.0
    avg = distance_km / stops
    return max(0.0, min(100.0, 100.0 - avg))
