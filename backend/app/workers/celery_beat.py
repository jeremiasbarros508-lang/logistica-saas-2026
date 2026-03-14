from celery.schedules import crontab
from app.workers.celery_app import celery_app

celery_app.conf.beat_schedule = {
    # Example: clean up stale processing routes every hour
    "cleanup-stale-routes-every-hour": {
        "task": "route_tasks.optimize_route_task",
        "schedule": crontab(minute=0),
        "kwargs": {},
        "enabled": False,
    },
}

celery_app.conf.timezone = "UTC"
