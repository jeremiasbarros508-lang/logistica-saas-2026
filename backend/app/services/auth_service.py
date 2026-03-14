import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.user_repo import UserRepository
from app.repositories.company_repo import CompanyRepository
from app.models.company import Company
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, RefreshRequest
from app.core.security.jwt import create_access_token, create_refresh_token, decode_token
from app.core.security.password import hash_password, verify_password
from app.core.constants import UserRole, REFRESH_TOKEN_TYPE
from app.utils.exceptions import UnauthorizedError, ConflictError


async def login(db: AsyncSession, data: LoginRequest) -> TokenResponse:
    user_repo = UserRepository(db)
    user = await user_repo.get_by_email(data.email)
    if user is None or not verify_password(data.password, user.hashed_password):
        raise UnauthorizedError("Invalid email or password")
    if not user.is_active:
        raise UnauthorizedError("Account is deactivated")

    access_token = create_access_token(
        str(user.id),
        {"company_id": str(user.company_id), "role": user.role},
    )
    refresh_token = create_refresh_token(str(user.id))
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


async def register(db: AsyncSession, data: RegisterRequest) -> TokenResponse:
    user_repo = UserRepository(db)
    company_repo = CompanyRepository(db)

    existing = await user_repo.get_by_email(data.email)
    if existing:
        raise ConflictError("Email already registered")

    company = await company_repo.create(
        {"name": data.company_name, "email": data.email}
    )

    user = await user_repo.create(
        {
            "company_id": company.id,
            "email": data.email,
            "name": data.name,
            "hashed_password": hash_password(data.password),
            "role": UserRole.ADMIN,
        }
    )
    await db.commit()

    access_token = create_access_token(
        str(user.id),
        {"company_id": str(user.company_id), "role": user.role},
    )
    refresh_token = create_refresh_token(str(user.id))
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


async def refresh_token(db: AsyncSession, data: RefreshRequest) -> TokenResponse:
    payload = decode_token(data.refresh_token)
    if payload is None or payload.get("type") != REFRESH_TOKEN_TYPE:
        raise UnauthorizedError("Invalid or expired refresh token")

    user_repo = UserRepository(db)
    user = await user_repo.get(uuid.UUID(payload["sub"]))
    if user is None or not user.is_active:
        raise UnauthorizedError("User not found or inactive")

    access_token = create_access_token(
        str(user.id),
        {"company_id": str(user.company_id), "role": user.role},
    )
    new_refresh = create_refresh_token(str(user.id))
    return TokenResponse(access_token=access_token, refresh_token=new_refresh)


async def logout(db: AsyncSession, user: User) -> dict:
    # In a production system, add the refresh token to a blocklist in Redis
    return {"message": "Logged out successfully"}
