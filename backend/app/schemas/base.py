import uuid
from datetime import datetime
from typing import Generic, TypeVar, Any
from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class TimestampSchema(BaseSchema):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class PaginationParams(BaseSchema):
    page: int = 1
    page_size: int = 20

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        return self.page_size


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    page_size: int
    pages: int

    @classmethod
    def create(cls, items: list[T], total: int, page: int, page_size: int) -> "PaginatedResponse[T]":
        pages = (total + page_size - 1) // page_size if page_size > 0 else 1
        return cls(items=items, total=total, page=page, page_size=page_size, pages=pages)


class MessageResponse(BaseModel):
    message: str
    data: Any = None
