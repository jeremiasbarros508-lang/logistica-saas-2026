import uuid
from app.schemas.base import BaseSchema, TimestampSchema


class VehicleCreate(BaseSchema):
    name: str
    plate: str
    model: str | None = None
    capacity_kg: float = 1000.0
    fuel_type: str | None = None
    fuel_consumption_per_km: float = 0.0


class VehicleUpdate(BaseSchema):
    name: str | None = None
    plate: str | None = None
    model: str | None = None
    capacity_kg: float | None = None
    fuel_type: str | None = None
    fuel_consumption_per_km: float | None = None
    is_active: bool | None = None


class VehicleRead(TimestampSchema):
    company_id: uuid.UUID
    name: str
    plate: str
    model: str | None
    capacity_kg: float
    fuel_type: str | None
    fuel_consumption_per_km: float
    is_active: bool
