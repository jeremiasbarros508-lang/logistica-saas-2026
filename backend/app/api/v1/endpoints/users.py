import uuid
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_role
from app.core.constants import UserRole
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.schemas.base import PaginatedResponse
from app.services import user_service
from app.utils.exceptions import AppError

router = APIRouter()


@router.get("/", response_model=PaginatedResponse[UserRead])
async def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_role(UserRole.ADMIN)),
):
    offset = (page - 1) * page_size
    users, total = await user_service.get_users(db, current_user.company_id, offset=offset, limit=page_size)
    return PaginatedResponse.create(users, total, page, page_size)


@router.post("/", response_model=UserRead, status_code=201)
async def create_user(
    data: UserCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_role(UserRole.ADMIN)),
):
    try:
        return await user_service.create_user(db, current_user.company_id, data)
    except AppError as e:
        raise e.to_http()


@router.get("/{user_id}", response_model=UserRead)
async def get_user(
    user_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        return await user_service.get_user(db, user_id, current_user.company_id)
    except AppError as e:
        raise e.to_http()


@router.put("/{user_id}", response_model=UserRead)
async def update_user(
    user_id: uuid.UUID,
    data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_role(UserRole.ADMIN)),
):
    try:
        return await user_service.update_user(db, user_id, current_user.company_id, data)
    except AppError as e:
        raise e.to_http()


@router.delete("/{user_id}", status_code=204)
async def delete_user(
    user_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_role(UserRole.ADMIN)),
):
    try:
        await user_service.delete_user(db, user_id, current_user.company_id)
    except AppError as e:
        raise e.to_http()
