import pytest
import pytest_asyncio
from unittest.mock import AsyncMock, MagicMock, patch
import uuid

from app.schemas.auth import LoginRequest, RegisterRequest, RefreshRequest
from app.schemas.delivery import DeliveryCreate, DeliveryUpdate
from app.core.constants import DeliveryStatus
from app.utils.exceptions import UnauthorizedError, ConflictError, NotFoundError


# ---------------------------------------------------------------------------
# auth_service
# ---------------------------------------------------------------------------

class TestAuthService:
    @pytest.mark.asyncio
    async def test_login_wrong_password(self):
        from app.services.auth_service import login

        mock_db = AsyncMock()
        with patch("app.services.auth_service.UserRepository") as MockRepo:
            mock_user = MagicMock()
            mock_user.hashed_password = "hashed"
            mock_user.is_active = True
            MockRepo.return_value.get_by_email = AsyncMock(return_value=mock_user)

            with patch("app.services.auth_service.verify_password", return_value=False):
                with pytest.raises(UnauthorizedError):
                    await login(mock_db, LoginRequest(email="a@b.com", password="wrong"))

    @pytest.mark.asyncio
    async def test_login_user_not_found(self):
        from app.services.auth_service import login

        mock_db = AsyncMock()
        with patch("app.services.auth_service.UserRepository") as MockRepo:
            MockRepo.return_value.get_by_email = AsyncMock(return_value=None)
            with pytest.raises(UnauthorizedError):
                await login(mock_db, LoginRequest(email="x@y.com", password="pass"))

    @pytest.mark.asyncio
    async def test_register_duplicate_email(self):
        from app.services.auth_service import register

        mock_db = AsyncMock()
        with patch("app.services.auth_service.UserRepository") as MockRepo:
            mock_user = MagicMock()
            MockRepo.return_value.get_by_email = AsyncMock(return_value=mock_user)
            with pytest.raises(ConflictError):
                await register(
                    mock_db,
                    RegisterRequest(
                        company_name="Test",
                        email="a@b.com",
                        password="password123",
                        name="User",
                    ),
                )

    @pytest.mark.asyncio
    async def test_refresh_invalid_token(self):
        from app.services.auth_service import refresh_token

        mock_db = AsyncMock()
        with pytest.raises(UnauthorizedError):
            await refresh_token(mock_db, RefreshRequest(refresh_token="invalid.token.here"))


# ---------------------------------------------------------------------------
# delivery_service
# ---------------------------------------------------------------------------

class TestDeliveryService:
    @pytest.mark.asyncio
    async def test_get_delivery_not_found(self):
        from app.services.delivery_service import get_delivery

        mock_db = AsyncMock()
        company_id = uuid.uuid4()
        delivery_id = uuid.uuid4()

        with patch("app.services.delivery_service.DeliveryRepository") as MockRepo:
            MockRepo.return_value.get_by_company = AsyncMock(return_value=None)
            with pytest.raises(NotFoundError):
                await get_delivery(mock_db, delivery_id, company_id)

    @pytest.mark.asyncio
    async def test_create_delivery(self):
        from app.services.delivery_service import create_delivery

        mock_db = AsyncMock()
        company_id = uuid.uuid4()
        data = DeliveryCreate(customer_name="João", address="Rua A, 1")

        mock_delivery = MagicMock()
        mock_delivery.id = uuid.uuid4()

        with patch("app.services.delivery_service.DeliveryRepository") as MockRepo:
            MockRepo.return_value.create = AsyncMock(return_value=mock_delivery)
            result = await create_delivery(mock_db, company_id, data)
            assert result == mock_delivery
            mock_db.commit.assert_called_once()

    @pytest.mark.asyncio
    async def test_delete_delivery_not_found(self):
        from app.services.delivery_service import delete_delivery

        mock_db = AsyncMock()
        company_id = uuid.uuid4()
        delivery_id = uuid.uuid4()

        with patch("app.services.delivery_service.DeliveryRepository") as MockRepo:
            MockRepo.return_value.get_by_company = AsyncMock(return_value=None)
            with pytest.raises(NotFoundError):
                await delete_delivery(mock_db, delivery_id, company_id)
