from app.algorithms.distance_matrix import DistanceMatrix


class TwoOptAlgorithm:
    """2-opt local search improvement for route optimization."""

    def __init__(self, max_iterations: int = 1000) -> None:
        self.max_iterations = max_iterations

    def improve(
        self,
        route: list[int],
        matrix: DistanceMatrix,
    ) -> tuple[list[int], float]:
        """
        Perform 2-opt swaps until no improvement is found or max_iterations reached.
        Returns (improved_route, total_distance_km).
        """
        best = list(route)
        best_dist = matrix.route_distance(best)
        improved = True
        iterations = 0

        while improved and iterations < self.max_iterations:
            improved = False
            iterations += 1
            for i in range(1, len(best) - 1):
                for j in range(i + 1, len(best)):
                    new_route = best[:i] + best[i:j + 1][::-1] + best[j + 1:]
                    new_dist = matrix.route_distance(new_route)
                    if new_dist < best_dist - 1e-9:
                        best = new_route
                        best_dist = new_dist
                        improved = True
                        break
                if improved:
                    break

        return best, best_dist
