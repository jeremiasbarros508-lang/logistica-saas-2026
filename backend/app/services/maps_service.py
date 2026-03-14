from typing import Any
import httpx
from app.core.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

_DIRECTIONS_URL = "https://maps.googleapis.com/maps/api/directions/json"
_DISTANCE_URL = "https://maps.googleapis.com/maps/api/distancematrix/json"


async def get_route_polyline(
    origin: tuple[float, float],
    destination: tuple[float, float],
    waypoints: list[tuple[float, float]] | None = None,
) -> str | None:
    """Return encoded polyline from Google Directions API."""
    if not settings.GOOGLE_MAPS_API_KEY:
        return None

    params: dict[str, Any] = {
        "origin": f"{origin[0]},{origin[1]}",
        "destination": f"{destination[0]},{destination[1]}",
        "key": settings.GOOGLE_MAPS_API_KEY,
    }
    if waypoints:
        params["waypoints"] = "|".join(f"{lat},{lng}" for lat, lng in waypoints)

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(_DIRECTIONS_URL, params=params)
            resp.raise_for_status()
            data = resp.json()
            routes = data.get("routes", [])
            if routes:
                return routes[0]["overview_polyline"]["points"]
    except Exception as exc:
        logger.warning("Google Directions API error: %s", exc)
    return None


async def get_distance_matrix(
    origins: list[tuple[float, float]],
    destinations: list[tuple[float, float]],
) -> list[list[float]] | None:
    """Return distance matrix in km using Google Distance Matrix API."""
    if not settings.GOOGLE_MAPS_API_KEY:
        return None

    origins_str = "|".join(f"{lat},{lng}" for lat, lng in origins)
    dests_str = "|".join(f"{lat},{lng}" for lat, lng in destinations)

    params = {
        "origins": origins_str,
        "destinations": dests_str,
        "key": settings.GOOGLE_MAPS_API_KEY,
        "units": "metric",
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(_DISTANCE_URL, params=params)
            resp.raise_for_status()
            data = resp.json()
            matrix = []
            for row in data.get("rows", []):
                matrix.append(
                    [
                        elem["distance"]["value"] / 1000.0  # meters → km
                        for elem in row["elements"]
                    ]
                )
            return matrix
    except Exception as exc:
        logger.warning("Google Distance Matrix API error: %s", exc)
    return None
