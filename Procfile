web: cd backend && gunicorn main:app --bind 0.0.0.0:$PORT --workers ${WEB_CONCURRENCY:-4} --worker-class uvicorn.workers.UvicornWorker --timeout 120
worker: cd backend && celery -A app.tasks worker --loglevel=info
release: cd backend && alembic upgrade head
