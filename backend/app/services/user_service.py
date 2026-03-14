import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.user_repo import UserRepository
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security.password import hash_password
from app.utils.exceptions import NotFoundError, ConflictError


async def create_user(db: AsyncSession, company_id: uuid.UUID, data: UserCreate) -> User:
    repo = UserRepository(db)
    existing = await repo.get_by_email(data.email)
    if existing:
        raise ConflictError("Email already registered")

    user = await repo.create(
        {
            "company_id": company_id,
            "email": data.email,
            "name": data.name,
            "hashed_password": hash_password(data.password),
            "role": data.role,
        }
    )
    await db.commit()
    return user


async def get_users(
    db: AsyncSession, company_id: uuid.UUID, offset: int = 0, limit: int = 20
) -> tuple[list[User], int]:
    repo = UserRepository(db)
    return await repo.get_multi(company_id, offset=offset, limit=limit)


async def get_user(db: AsyncSession, user_id: uuid.UUID, company_id: uuid.UUID) -> User:
    repo = UserRepository(db)
    user = await repo.get_by_company(user_id, company_id)
    if user is None:
        raise NotFoundError(f"User {user_id} not found")
    return user


async def update_user(
    db: AsyncSession, user_id: uuid.UUID, company_id: uuid.UUID, data: UserUpdate
) -> User:
    repo = UserRepository(db)
    user = await repo.get_by_company(user_id, company_id)
    if user is None:
        raise NotFoundError(f"User {user_id} not found")

    update_data = data.model_dump(exclude_none=True)
    if "password" in update_data:
        update_data["hashed_password"] = hash_password(update_data.pop("password"))

    updated = await repo.update(user, update_data)
    await db.commit()
    return updated


async def delete_user(db: AsyncSession, user_id: uuid.UUID, company_id: uuid.UUID) -> None:
    repo = UserRepository(db)
    user = await repo.get_by_company(user_id, company_id)
    if user is None:
        raise NotFoundError(f"User {user_id} not found")
    await repo.delete(user)
    await db.commit()
