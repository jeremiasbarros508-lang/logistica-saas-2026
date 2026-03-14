import math
from functools import lru_cache


def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Return great-circle distance in km between two GPS points."""
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


class DistanceMatrix:
    """Builds and caches a full distance matrix for a list of coordinates."""

    def __init__(self, coords: list[tuple[float, float]]) -> None:
        self._coords = coords
        self._n = len(coords)
        self._cache: dict[tuple[int, int], float] = {}

    def distance(self, i: int, j: int) -> float:
        if i == j:
            return 0.0
        key = (min(i, j), max(i, j))
        if key not in self._cache:
            lat1, lon1 = self._coords[i]
            lat2, lon2 = self._coords[j]
            self._cache[key] = haversine(lat1, lon1, lat2, lon2)
        return self._cache[key]

    def build_full(self) -> list[list[float]]:
        """Build and return the full n×n matrix."""
        return [[self.distance(i, j) for j in range(self._n)] for i in range(self._n)]

    def route_distance(self, route: list[int]) -> float:
        """Total distance of an ordered route (open path)."""
        return sum(self.distance(route[i], route[i + 1]) for i in range(len(route) - 1))

    @property
    def size(self) -> int:
        return self._n
