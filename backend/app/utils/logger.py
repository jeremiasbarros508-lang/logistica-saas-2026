import logging
import sys
from app.core.config import settings

_LOG_LEVEL = logging.DEBUG if settings.ENVIRONMENT == "development" else logging.INFO

logging.basicConfig(
    level=_LOG_LEVEL,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
    stream=sys.stdout,
)


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
