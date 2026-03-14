import asyncio
import uuid

from app.workers.celery_app import celery_app
from app.core.database import SessionLocal
from app.utils.logger import get_logger

logger = get_logger(__name__)


@celery_app.task(bind=True, name="route_tasks.optimize_route_task")
def optimize_route_task(self, route_id: str, company_id: str) -> dict:
    """Celery task to run route optimization asynchronously."""
    from app.services.route_service import optimize_route

    async def _run():
        async with SessionLocal() as db:
            route = await optimize_route(
                db,
                uuid.UUID(route_id),
                uuid.UUID(company_id),
            )
            return {
                "route_id": str(route.id),
                "status": route.status,
                "total_distance_km": route.total_distance_km,
                "optimization_score": route.optimization_score,
            }

    try:
        return asyncio.run(_run())
    except RuntimeError:
        # Celery may run in a thread that already has an event loop
        loop = asyncio.new_event_loop()
        try:
            return loop.run_until_complete(_run())
        finally:
            loop.close()
    except Exception as exc:
        logger.error("optimize_route_task failed for route %s: %s", route_id, exc)
        self.retry(exc=exc, countdown=30, max_retries=3)
