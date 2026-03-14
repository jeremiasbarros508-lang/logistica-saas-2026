from app.algorithms.distance_matrix import DistanceMatrix


def calculate_route_fitness(route: list[int], matrix: DistanceMatrix) -> float:
    """Lower is better — returns total route distance in km."""
    return matrix.route_distance(route)


def compare_routes(
    route_a: list[int],
    route_b: list[int],
    matrix: DistanceMatrix,
) -> int:
    """
    Compare two routes by fitness.
    Returns -1 if route_a is better, 1 if route_b is better, 0 if equal.
    """
    fa = calculate_route_fitness(route_a, matrix)
    fb = calculate_route_fitness(route_b, matrix)
    if fa < fb:
        return -1
    if fa > fb:
        return 1
    return 0
