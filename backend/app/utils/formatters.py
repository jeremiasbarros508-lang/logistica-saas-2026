def format_distance(km: float) -> str:
    """Return a human-readable distance string."""
    if km < 1.0:
        return f"{km * 1000:.0f} m"
    return f"{km:.2f} km"


def format_duration(minutes: int) -> str:
    """Return a human-readable duration string."""
    if minutes < 60:
        return f"{minutes} min"
    hours, mins = divmod(minutes, 60)
    if mins == 0:
        return f"{hours}h"
    return f"{hours}h {mins}min"


def format_currency(value: float, currency: str = "BRL") -> str:
    """Return a simple currency string."""
    return f"{currency} {value:,.2f}"
