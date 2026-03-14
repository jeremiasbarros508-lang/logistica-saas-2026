import uuid
from pydantic import EmailStr
from app.schemas.base import BaseSchema, TimestampSchema


class DriverCreate(BaseSchema):
    name: str
    email: str | None = None
    phone: str | None = None
    license_number: str | None = None
    user_id: uuid.UUID | None = None


class DriverUpdate(BaseSchema):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    license_number: str | None = None
    is_active: bool | None = None
    user_id: uuid.UUID | None = None


class DriverRead(TimestampSchema):
    company_id: uuid.UUID
    name: str
    email: str | None
    phone: str | None
    license_number: str | None
    is_active: bool
    user_id: uuid.UUID | None
