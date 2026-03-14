import uuid
import pytest
import pytest_asyncio


pytestmark = pytest.mark.asyncio


async def test_register_creates_tokens(client):
    payload = {
        "company_name": "Auth Test Corp",
        "email": f"authtest-{uuid.uuid4()}@example.com",
        "password": "securepass123",
        "name": "Auth Tester",
    }
    resp = await client.post("/api/v1/auth/register", json=payload)
    assert resp.status_code == 201
    data = resp.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


async def test_login_success(client):
    email = f"login-{uuid.uuid4()}@example.com"
    reg_payload = {
        "company_name": "Login Corp",
        "email": email,
        "password": "loginpass123",
        "name": "Login User",
    }
    await client.post("/api/v1/auth/register", json=reg_payload)

    resp = await client.post(
        "/api/v1/auth/login", json={"email": email, "password": "loginpass123"}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data


async def test_login_wrong_password(client):
    email = f"wrong-{uuid.uuid4()}@example.com"
    reg_payload = {
        "company_name": "Wrong Corp",
        "email": email,
        "password": "correctpass123",
        "name": "Wrong User",
    }
    await client.post("/api/v1/auth/register", json=reg_payload)

    resp = await client.post(
        "/api/v1/auth/login", json={"email": email, "password": "wrongpass"}
    )
    assert resp.status_code == 401


async def test_login_nonexistent_user(client):
    resp = await client.post(
        "/api/v1/auth/login",
        json={"email": "nobody@nowhere.com", "password": "anything"},
    )
    assert resp.status_code == 401


async def test_refresh_token(client):
    email = f"refresh-{uuid.uuid4()}@example.com"
    reg_payload = {
        "company_name": "Refresh Corp",
        "email": email,
        "password": "refreshpass123",
        "name": "Refresh User",
    }
    reg_resp = await client.post("/api/v1/auth/register", json=reg_payload)
    tokens = reg_resp.json()

    resp = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]}
    )
    assert resp.status_code == 200
    new_tokens = resp.json()
    assert "access_token" in new_tokens


async def test_refresh_invalid_token(client):
    resp = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": "invalid.token.value"}
    )
    assert resp.status_code == 401


async def test_logout_requires_auth(client):
    resp = await client.post("/api/v1/auth/logout")
    assert resp.status_code == 401


async def test_logout_success(client, auth_headers):
    resp = await client.post("/api/v1/auth/logout", headers=auth_headers)
    assert resp.status_code == 200
