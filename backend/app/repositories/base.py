import uuid
from typing import Any, Generic, TypeVar, Type
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import ModelBase

ModelT = TypeVar("ModelT", bound=ModelBase)


class BaseRepository(Generic[ModelT]):
    def __init__(self, model: Type[ModelT], db: AsyncSession) -> None:
        self.model = model
        self.db = db

    async def get(self, id: uuid.UUID) -> ModelT | None:
        result = await self.db.execute(select(self.model).where(self.model.id == id))
        return result.scalar_one_or_none()

    async def get_by_company(self, id: uuid.UUID, company_id: uuid.UUID) -> ModelT | None:
        result = await self.db.execute(
            select(self.model).where(
                self.model.id == id,
                self.model.company_id == company_id,  # type: ignore[attr-defined]
            )
        )
        return result.scalar_one_or_none()

    async def get_multi(
        self,
        company_id: uuid.UUID,
        *,
        offset: int = 0,
        limit: int = 20,
        filters: list[Any] | None = None,
    ) -> tuple[list[ModelT], int]:
        conditions = [self.model.company_id == company_id]  # type: ignore[attr-defined]
        if filters:
            conditions.extend(filters)

        count_q = select(func.count()).select_from(self.model).where(*conditions)
        count_result = await self.db.execute(count_q)
        total = count_result.scalar_one()

        q = select(self.model).where(*conditions).offset(offset).limit(limit)
        result = await self.db.execute(q)
        return list(result.scalars().all()), total

    async def create(self, obj_in: dict[str, Any]) -> ModelT:
        obj = self.model(**obj_in)
        self.db.add(obj)
        await self.db.flush()
        await self.db.refresh(obj)
        return obj

    async def update(self, obj: ModelT, obj_in: dict[str, Any]) -> ModelT:
        for key, value in obj_in.items():
            if hasattr(obj, key):
                setattr(obj, key, value)
        self.db.add(obj)
        await self.db.flush()
        await self.db.refresh(obj)
        return obj

    async def delete(self, obj: ModelT) -> None:
        await self.db.delete(obj)
        await self.db.flush()
