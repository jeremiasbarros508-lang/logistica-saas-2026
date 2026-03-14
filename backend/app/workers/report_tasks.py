import asyncio
import uuid

from app.workers.celery_app import celery_app
from app.core.database import SessionLocal
from app.utils.logger import get_logger

logger = get_logger(__name__)


@celery_app.task(bind=True, name="report_tasks.generate_report_task")
def generate_report_task(self, route_id: str, company_id: str, report_format: str = "pdf") -> dict:
    """Celery task to generate a route report asynchronously."""
    from app.services.route_service import get_route
    from app.services.report_service import generate_pdf_report, generate_excel_report
    from app.repositories.delivery_repo import DeliveryRepository

    async def _run():
        async with SessionLocal() as db:
            route = await get_route(db, uuid.UUID(route_id), uuid.UUID(company_id))
            delivery_repo = DeliveryRepository(db)
            deliveries = []
            for stop in route.stops:
                d = await delivery_repo.get(stop.delivery_id)
                if d:
                    deliveries.append(d)

            if report_format == "excel":
                report_bytes = generate_excel_report(route, deliveries)
                content_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                filename = f"route_{route_id}.xlsx"
            else:
                report_bytes = generate_pdf_report(route, deliveries)
                content_type = "application/pdf"
                filename = f"route_{route_id}.pdf"

            # In a real system, upload to S3/GCS and return the URL
            return {
                "route_id": route_id,
                "format": report_format,
                "filename": filename,
                "size_bytes": len(report_bytes),
                "status": "completed",
            }

    try:
        return asyncio.run(_run())
    except RuntimeError:
        loop = asyncio.new_event_loop()
        try:
            return loop.run_until_complete(_run())
        finally:
            loop.close()
    except Exception as exc:
        logger.error("generate_report_task failed for route %s: %s", route_id, exc)
        self.retry(exc=exc, countdown=30, max_retries=3)
