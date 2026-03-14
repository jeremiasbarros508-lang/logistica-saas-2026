import uuid
from app.schemas.base import BaseSchema, TimestampSchema
from app.core.constants import RouteStatus


class RouteCreate(BaseSchema):
    name: str
    vehicle_id: uuid.UUID | None = None
    driver_id: uuid.UUID | None = None
    delivery_ids: list[uuid.UUID] = []


class RouteUpdate(BaseSchema):
    name: str | None = None
    vehicle_id: uuid.UUID | None = None
    driver_id: uuid.UUID | None = None
    status: RouteStatus | None = None


class RouteStopRead(TimestampSchema):
    route_id: uuid.UUID
    delivery_id: uuid.UUID
    sequence_order: int
    distance_from_prev_km: float


class RouteRead(TimestampSchema):
    company_id: uuid.UUID
    name: str
    status: str
    total_distance_km: float
    estimated_time_minutes: int
    vehicle_id: uuid.UUID | None
    driver_id: uuid.UUID | None
    optimization_score: float
    stops_count: int
    stops: list[RouteStopRead] = []
