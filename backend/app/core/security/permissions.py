import uuid
from app.core.constants import UserRole
from app.utils.exceptions import ForbiddenError


def check_company_access(current_user, company_id: uuid.UUID) -> None:
    """Ensure the current user belongs to the given company."""
    if str(current_user.company_id) != str(company_id):
        raise ForbiddenError("Access to this company's data is not allowed")


def require_admin(current_user) -> None:
    if current_user.role != UserRole.ADMIN:
        raise ForbiddenError("Admin role required")


def require_operator(current_user) -> None:
    if current_user.role not in (UserRole.ADMIN, UserRole.OPERATOR):
        raise ForbiddenError("Operator or Admin role required")
