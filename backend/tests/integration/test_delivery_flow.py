import uuid
import pytest

pytestmark = pytest.mark.asyncio


async def test_create_delivery(client, auth_headers):
    payload = {
        "customer_name": "Maria Silva",
        "address": "Rua das Flores, 123",
        "phone": "11999999999",
        "product": "Pacote",
        "quantity": 1,
        "priority": 0,
        "weight_kg": 2.5,
    }
    resp = await client.post("/api/v1/deliveries/", json=payload, headers=auth_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["customer_name"] == "Maria Silva"
    assert data["status"] == "pending"
    return data


async def test_list_deliveries(client, auth_headers):
    resp = await client.get("/api/v1/deliveries/", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert "total" in data


async def test_get_delivery(client, auth_headers):
    # Create first
    create_resp = await client.post(
        "/api/v1/deliveries/",
        json={"customer_name": "João", "address": "Av. Paulista, 1"},
        headers=auth_headers,
    )
    delivery_id = create_resp.json()["id"]

    resp = await client.get(f"/api/v1/deliveries/{delivery_id}", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["id"] == delivery_id


async def test_update_delivery(client, auth_headers):
    create_resp = await client.post(
        "/api/v1/deliveries/",
        json={"customer_name": "Ana", "address": "Rua B, 2"},
        headers=auth_headers,
    )
    delivery_id = create_resp.json()["id"]

    resp = await client.put(
        f"/api/v1/deliveries/{delivery_id}",
        json={"status": "delivered"},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "delivered"


async def test_delete_delivery(client, auth_headers):
    create_resp = await client.post(
        "/api/v1/deliveries/",
        json={"customer_name": "Pedro", "address": "Rua C, 3"},
        headers=auth_headers,
    )
    delivery_id = create_resp.json()["id"]

    del_resp = await client.delete(
        f"/api/v1/deliveries/{delivery_id}", headers=auth_headers
    )
    assert del_resp.status_code == 204

    get_resp = await client.get(
        f"/api/v1/deliveries/{delivery_id}", headers=auth_headers
    )
    assert get_resp.status_code == 404


async def test_get_nonexistent_delivery(client, auth_headers):
    resp = await client.get(
        f"/api/v1/deliveries/{uuid.uuid4()}", headers=auth_headers
    )
    assert resp.status_code == 404


async def test_deliveries_require_auth(client):
    resp = await client.get("/api/v1/deliveries/")
    assert resp.status_code == 401
