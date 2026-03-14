from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security.jwt import decode_token
from app.core.constants import UserRole
from app.utils.exceptions import UnauthorizedError, ForbiddenError

bearer_scheme = HTTPBearer(auto_error=False)

DbDep = Annotated[AsyncSession, Depends(get_db)]


async def get_current_user(
    db: DbDep,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)] = None,
):
    if credentials is None:
        raise UnauthorizedError("Missing authentication token")

    payload = decode_token(credentials.credentials)
    if payload is None or payload.get("type") != "access":
        raise UnauthorizedError("Invalid or expired token")

    from app.repositories.user_repo import UserRepository
    import uuid as _uuid

    user_repo = UserRepository(db)
    try:
        user_id = _uuid.UUID(payload["sub"])
    except (ValueError, KeyError):
        raise UnauthorizedError("Invalid token subject")

    user = await user_repo.get(user_id)
    if user is None or not user.is_active:
        raise UnauthorizedError("User not found or inactive")

    return user


CurrentUser = Annotated[object, Depends(get_current_user)]


def require_role(*roles: UserRole):
    async def _checker(current_user=Depends(get_current_user)):
        if current_user.role not in roles:
            raise ForbiddenError(
                f"Required role(s): {[r.value for r in roles]}"
            )
        return current_user

    return _checker
