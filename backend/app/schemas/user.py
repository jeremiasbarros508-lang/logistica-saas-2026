import uuid
from pydantic import EmailStr, field_validator
from app.schemas.base import BaseSchema, TimestampSchema
from app.core.constants import UserRole


class UserCreate(BaseSchema):
    email: EmailStr
    name: str
    password: str
    role: UserRole = UserRole.OPERATOR

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class UserUpdate(BaseSchema):
    name: str | None = None
    email: EmailStr | None = None
    role: UserRole | None = None
    is_active: bool | None = None
    password: str | None = None


class UserRead(TimestampSchema):
    company_id: uuid.UUID
    email: str
    name: str
    role: str
    is_active: bool
