import uuid
from datetime import datetime
from pydantic import EmailStr
from app.schemas.base import BaseSchema, TimestampSchema


class CompanyCreate(BaseSchema):
    name: str
    email: EmailStr
    cnpj: str | None = None
    phone: str | None = None
    address: str | None = None


class CompanyUpdate(BaseSchema):
    name: str | None = None
    email: EmailStr | None = None
    cnpj: str | None = None
    phone: str | None = None
    address: str | None = None


class CompanyRead(TimestampSchema):
    name: str
    email: str
    cnpj: str | None
    phone: str | None
    address: str | None
    plan: str
    is_active: bool


class SubscriptionRead(TimestampSchema):
    company_id: uuid.UUID
    plan: str
    status: str
    started_at: datetime | None
    ends_at: datetime | None
