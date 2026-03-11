from celery import Celery
from celery.schedules import crontab

from app.core.config import settings

celery_app = Celery(
    "changisha_bills",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.workers.tasks"]
)

celery_app.conf.update(
    result_expires=3600,
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)

celery_app.conf.beat_schedule = {
    'check-upcoming-bills-daily': {
        'task': 'app.workers.tasks.check_upcoming_bills',
        'schedule': crontab(hour=9, minute=0),  # Every day at 9 AM
    },
    'cleanup-failed-payments': {
        'task': 'app.workers.tasks.cleanup_failed_payments',
        'schedule': crontab(hour=2, minute=0),  # Every day at 2 AM
    },
}