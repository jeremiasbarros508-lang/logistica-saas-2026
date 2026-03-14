import uuid
from datetime import datetime
from pydantic import field_validator
from app.schemas.base import BaseSchema, TimestampSchema
from app.core.constants import DeliveryStatus


class DeliveryCreate(BaseSchema):
    customer_name: str
    address: str
    lat: float | None = None
    lng: float | None = None
    phone: str | None = None
    product: str | None = None
    quantity: int = 1
    priority: int = 0
    time_window_start: datetime | None = None
    time_window_end: datetime | None = None
    notes: str | None = None
    weight_kg: float = 0.0


class DeliveryUpdate(BaseSchema):
    customer_name: str | None = None
    address: str | None = None
    lat: float | None = None
    lng: float | None = None
    phone: str | None = None
    product: str | None = None
    quantity: int | None = None
    priority: int | None = None
    time_window_start: datetime | None = None
    time_window_end: datetime | None = None
    notes: str | None = None
    status: DeliveryStatus | None = None
    weight_kg: float | None = None


class DeliveryRead(TimestampSchema):
    company_id: uuid.UUID
    customer_name: str
    address: str
    lat: float | None
    lng: float | None
    phone: str | None
    product: str | None
    quantity: int
    priority: int
    time_window_start: datetime | None
    time_window_end: datetime | None
    notes: str | None
    status: str
    route_id: uuid.UUID | None
    weight_kg: float


class DeliveryImportRow(BaseSchema):
    customer_name: str
    address: str
    phone: str | None = None
    product: str | None = None
    quantity: int = 1
    priority: int = 0
    notes: str | None = None
    weight_kg: float = 0.0
