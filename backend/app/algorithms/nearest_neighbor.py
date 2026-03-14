from app.algorithms.distance_matrix import DistanceMatrix


class NearestNeighborAlgorithm:
    """Greedy nearest-neighbor heuristic for TSP-like routing."""

    def solve(
        self,
        matrix: DistanceMatrix,
        start: int = 0,
    ) -> tuple[list[int], float]:
        """
        Return (ordered_route, total_distance_km).
        The route is an open path (does NOT return to start).
        """
        n = matrix.size
        unvisited = set(range(n))
        route = [start]
        unvisited.remove(start)

        while unvisited:
            current = route[-1]
            nearest = min(unvisited, key=lambda j: matrix.distance(current, j))
            route.append(nearest)
            unvisited.remove(nearest)

        return route, matrix.route_distance(route)
