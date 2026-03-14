from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, RefreshRequest, LogoutRequest
from app.services import auth_service
from app.utils.exceptions import AppError

router = APIRouter()


def _handle(exc: AppError):
    raise exc.to_http()


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    try:
        return await auth_service.register(db, data)
    except AppError as e:
        _handle(e)


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    try:
        return await auth_service.login(db, data)
    except AppError as e:
        _handle(e)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(data: RefreshRequest, db: AsyncSession = Depends(get_db)):
    try:
        return await auth_service.refresh_token(db, data)
    except AppError as e:
        _handle(e)


@router.post("/logout")
async def logout(
    data: LogoutRequest | None = None,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        return await auth_service.logout(db, current_user)
    except AppError as e:
        _handle(e)
