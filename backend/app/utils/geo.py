import math


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Return great-circle distance in km between two GPS points."""
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def calculate_bounding_box(
    coords: list[tuple[float, float]], padding_km: float = 1.0
) -> dict[str, float]:
    """Return {min_lat, max_lat, min_lng, max_lng} bounding box for a list of coords."""
    if not coords:
        return {"min_lat": 0.0, "max_lat": 0.0, "min_lng": 0.0, "max_lng": 0.0}

    padding_deg = padding_km / 111.0  # ~111 km per degree
    lats = [c[0] for c in coords]
    lngs = [c[1] for c in coords]
    return {
        "min_lat": min(lats) - padding_deg,
        "max_lat": max(lats) + padding_deg,
        "min_lng": min(lngs) - padding_deg,
        "max_lng": max(lngs) + padding_deg,
    }


def coordinates_to_address(lat: float, lng: float) -> str:
    """Return a formatted coordinate string (reverse geocoding placeholder)."""
    return f"{lat:.6f}, {lng:.6f}"
