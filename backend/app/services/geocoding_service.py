import httpx
from app.utils.logger import get_logger

logger = get_logger(__name__)

_NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"


async def geocode_address(address: str) -> tuple[float, float] | None:
    """Return (lat, lng) for address using Nominatim as fallback."""
    params = {"q": address, "format": "json", "limit": 1}
    headers = {"User-Agent": "LogisticaSaaS/1.0"}
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(_NOMINATIM_URL, params=params, headers=headers)
            response.raise_for_status()
            data = response.json()
            if data:
                return float(data[0]["lat"]), float(data[0]["lon"])
    except Exception as exc:
        logger.warning("Geocoding failed for '%s': %s", address, exc)
    return None
