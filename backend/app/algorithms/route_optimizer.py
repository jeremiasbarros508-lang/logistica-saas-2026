from app.algorithms.distance_matrix import DistanceMatrix
from app.algorithms.nearest_neighbor import NearestNeighborAlgorithm
from app.algorithms.two_opt import TwoOptAlgorithm


class RouteOptimizer:
    """Orchestrates nearest-neighbor + 2-opt for best route."""

    def __init__(self, two_opt_iterations: int = 500) -> None:
        self._nn = NearestNeighborAlgorithm()
        self._two_opt = TwoOptAlgorithm(max_iterations=two_opt_iterations)

    def optimize(
        self,
        coords: list[tuple[float, float]],
        start: int = 0,
    ) -> tuple[list[int], float]:
        """
        Return (optimized_order_indices, total_distance_km).
        Runs nearest-neighbor then 2-opt improvement.
        """
        if len(coords) == 0:
            return [], 0.0
        if len(coords) == 1:
            return [0], 0.0

        matrix = DistanceMatrix(coords)
        nn_route, _ = self._nn.solve(matrix, start=start)
        final_route, final_dist = self._two_opt.improve(nn_route, matrix)
        return final_route, final_dist
