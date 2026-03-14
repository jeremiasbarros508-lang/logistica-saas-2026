import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.services.delivery_service import get_delivery
from app.services.route_service import get_route
from app.repositories.delivery_repo import DeliveryRepository
from app.utils.exceptions import AppError
from app.utils.geo import calculate_bounding_box

router = APIRouter()


@router.get("/deliveries/{delivery_id}/map")
async def delivery_map(
    delivery_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        delivery = await get_delivery(db, delivery_id, current_user.company_id)
        return {
            "delivery_id": str(delivery.id),
            "customer_name": delivery.customer_name,
            "address": delivery.address,
            "lat": delivery.lat,
            "lng": delivery.lng,
            "status": delivery.status,
        }
    except AppError as e:
        raise e.to_http()


@router.get("/routes/{route_id}/map")
async def route_map(
    route_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        route = await get_route(db, route_id, current_user.company_id)
        delivery_repo = DeliveryRepository(db)

        stops = []
        coords = []
        for stop in route.stops:
            d = await delivery_repo.get(stop.delivery_id)
            if d:
                stops.append(
                    {
                        "sequence": stop.sequence_order,
                        "delivery_id": str(d.id),
                        "customer_name": d.customer_name,
                        "address": d.address,
                        "lat": d.lat,
                        "lng": d.lng,
                        "status": d.status,
                    }
                )
                if d.lat is not None and d.lng is not None:
                    coords.append((d.lat, d.lng))

        bbox = calculate_bounding_box(coords) if coords else None
        return {
            "route_id": str(route_id),
            "route_name": route.name,
            "total_distance_km": route.total_distance_km,
            "stops": stops,
            "bounding_box": bbox,
        }
    except AppError as e:
        raise e.to_http()
