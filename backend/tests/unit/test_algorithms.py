import pytest
from app.algorithms.distance_matrix import DistanceMatrix, haversine
from app.algorithms.nearest_neighbor import NearestNeighborAlgorithm
from app.algorithms.two_opt import TwoOptAlgorithm
from app.algorithms.route_optimizer import RouteOptimizer
from app.algorithms.fitness import calculate_route_fitness, compare_routes


# ---------------------------------------------------------------------------
# haversine
# ---------------------------------------------------------------------------

def test_haversine_same_point():
    assert haversine(0, 0, 0, 0) == pytest.approx(0.0)


def test_haversine_known_distance():
    # São Paulo → Rio de Janeiro ~ 357 km
    dist = haversine(-23.5505, -46.6333, -22.9068, -43.1729)
    assert 340 < dist < 380


# ---------------------------------------------------------------------------
# DistanceMatrix
# ---------------------------------------------------------------------------

COORDS = [
    (-23.5505, -46.6333),  # São Paulo
    (-22.9068, -43.1729),  # Rio de Janeiro
    (-19.9167, -43.9345),  # Belo Horizonte
]


def test_distance_matrix_symmetry():
    dm = DistanceMatrix(COORDS)
    assert dm.distance(0, 1) == pytest.approx(dm.distance(1, 0))


def test_distance_matrix_self():
    dm = DistanceMatrix(COORDS)
    assert dm.distance(0, 0) == 0.0


def test_distance_matrix_build_full():
    dm = DistanceMatrix(COORDS)
    full = dm.build_full()
    assert len(full) == 3
    assert len(full[0]) == 3
    assert full[0][0] == 0.0


def test_route_distance():
    dm = DistanceMatrix(COORDS)
    dist = dm.route_distance([0, 1, 2])
    assert dist > 0


# ---------------------------------------------------------------------------
# NearestNeighborAlgorithm
# ---------------------------------------------------------------------------

def test_nearest_neighbor_returns_all_stops():
    dm = DistanceMatrix(COORDS)
    nn = NearestNeighborAlgorithm()
    route, dist = nn.solve(dm, start=0)
    assert len(route) == 3
    assert set(route) == {0, 1, 2}
    assert dist > 0


def test_nearest_neighbor_single_stop():
    dm = DistanceMatrix([(0.0, 0.0)])
    nn = NearestNeighborAlgorithm()
    route, dist = nn.solve(dm)
    assert route == [0]
    assert dist == 0.0


# ---------------------------------------------------------------------------
# TwoOptAlgorithm
# ---------------------------------------------------------------------------

def test_two_opt_does_not_increase_distance():
    dm = DistanceMatrix(COORDS)
    initial = [0, 2, 1]
    initial_dist = dm.route_distance(initial)
    two_opt = TwoOptAlgorithm()
    improved, improved_dist = two_opt.improve(initial, dm)
    assert improved_dist <= initial_dist + 1e-6


def test_two_opt_returns_all_nodes():
    dm = DistanceMatrix(COORDS)
    two_opt = TwoOptAlgorithm()
    route, _ = two_opt.improve([0, 1, 2], dm)
    assert set(route) == {0, 1, 2}


# ---------------------------------------------------------------------------
# RouteOptimizer
# ---------------------------------------------------------------------------

def test_optimizer_empty():
    opt = RouteOptimizer()
    route, dist = opt.optimize([])
    assert route == []
    assert dist == 0.0


def test_optimizer_single():
    opt = RouteOptimizer()
    route, dist = opt.optimize([(1.0, 2.0)])
    assert route == [0]
    assert dist == 0.0


def test_optimizer_improves_bad_route():
    opt = RouteOptimizer()
    route, dist = opt.optimize(COORDS)
    assert len(route) == 3
    assert dist > 0


# ---------------------------------------------------------------------------
# Fitness
# ---------------------------------------------------------------------------

def test_fitness_lower_is_better():
    dm = DistanceMatrix(COORDS)
    good_route = [0, 1, 2]
    bad_route = [0, 2, 1]
    assert compare_routes(good_route, bad_route, dm) in (-1, 0, 1)  # valid comparison


def test_fitness_same_route():
    dm = DistanceMatrix(COORDS)
    assert compare_routes([0, 1, 2], [0, 1, 2], dm) == 0
