from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import time
import structlog

from app.workers.celery_app import celery_app
from app.database.connection import SessionLocal
from app.models import Bill, Notification, Payment, AnalyticsEvent
from app.services.notification_service import create_notification
from app.integrations.mpesa import initiate_mpesa_payment

logger = structlog.get_logger()

@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def check_upcoming_bills(self):
    db: Session = SessionLocal()
    try:
        now = datetime.utcnow()
        seven_days = now + timedelta(days=7)
        three_days = now + timedelta(days=3)
        one_day = now + timedelta(days=1)
        
        # Bills due in 7 days
        bills_7 = db.query(Bill).filter(Bill.due_date <= seven_days, Bill.due_date > three_days, Bill.is_paid == False).all()
        for bill in bills_7:
            create_notification(db, bill.user_id, f"Your bill '{bill.name}' is due in 7 days.", "reminder", bill.id)
            logger.info("7_day_reminder_sent", bill_id=bill.id, user_id=bill.user_id)
        
        # Bills due in 3 days
        bills_3 = db.query(Bill).filter(Bill.due_date <= three_days, Bill.due_date > one_day, Bill.is_paid == False).all()
        for bill in bills_3:
            create_notification(db, bill.user_id, f"Your bill '{bill.name}' is due in 3 days.", "reminder", bill.id)
            logger.info("3_day_reminder_sent", bill_id=bill.id, user_id=bill.user_id)
        
        # Bills due in 1 day
        bills_1 = db.query(Bill).filter(Bill.due_date <= one_day, Bill.due_date > now, Bill.is_paid == False).all()
        for bill in bills_1:
            create_notification(db, bill.user_id, f"Your bill '{bill.name}' is due tomorrow.", "reminder", bill.id)
            logger.info("1_day_reminder_sent", bill_id=bill.id, user_id=bill.user_id)
        
        # Bills due today
        bills_today = db.query(Bill).filter(Bill.due_date <= now, Bill.is_paid == False).all()
        for bill in bills_today:
            create_notification(db, bill.user_id, f"Your bill '{bill.name}' is due today.", "reminder", bill.id)
            logger.info("due_today_reminder_sent", bill_id=bill.id, user_id=bill.user_id)
        
        db.commit()
    except Exception as exc:
        logger.error("check_upcoming_bills_failed", error=str(exc))
        raise self.retry(exc=exc, countdown=60)
    finally:
        db.close()

@celery_app.task(bind=True, max_retries=5, default_retry_delay=30)
def trigger_payment(self, bill_id: int, user_id: int, amount: float, phone_number: str):
    db: Session = SessionLocal()
    try:
        bill = db.query(Bill).filter(Bill.id == bill_id).first()
        if not bill:
            logger.error("bill_not_found", bill_id=bill_id)
            return {"status": "failed", "error": "Bill not found"}
        
        # Create payment record
        from app.services.payment_service import create_payment
        from app.schemas.payment import PaymentCreate
        
        payment_data = PaymentCreate(
            bill_id=bill_id,
            amount=amount,
            payment_method="M-Pesa"
        )
        
        payment = create_payment(db, payment_data, user_id)
        
        # Log analytics event
        analytics = AnalyticsEvent(
            user_id=user_id,
            event_type="payment_initiated",
            event_data=f'{{"bill_id": {bill_id}, "amount": {amount}, "payment_id": {payment.id}}}'
        )
        db.add(analytics)
        
        try:
            # Initiate M-Pesa payment
            result = initiate_mpesa_payment(
                phone_number=phone_number,
                amount=amount,
                account_reference=f"Bill {bill_id}",
                transaction_desc=f"Payment for bill {bill.name}"
            )
            
            if result.get("ResponseCode") == "0":
                # Success
                payment.status = "completed"
                payment.completed_at = datetime.utcnow()
                create_notification(
                    db, 
                    user_id, 
                    f"Payment of KES {amount} for bill '{bill.name}' initiated successfully.", 
                    "payment_success", 
                    bill_id
                )
                logger.info("payment_initiated_success", bill_id=bill_id, payment_id=payment.id, amount=amount)
            else:
                # Payment failed
                payment.status = "failed"
                error_msg = result.get("errorMessage", "Unknown error")
                create_notification(
                    db, 
                    user_id, 
                    f"Payment failed for bill '{bill.name}': {error_msg}", 
                    "payment_failed", 
                    bill_id
                )
                logger.error("payment_initiated_failed", bill_id=bill_id, payment_id=payment.id, error=error_msg)
                
                # Retry if it's a temporary failure
                if "timeout" in error_msg.lower() or "network" in error_msg.lower():
                    raise Exception(f"Temporary payment failure: {error_msg}")
            
        except Exception as payment_exc:
            payment.status = "failed"
            logger.error("payment_exception", bill_id=bill_id, payment_id=payment.id, error=str(payment_exc))
            raise self.retry(exc=payment_exc, countdown=60)
        
        db.commit()
        return {"status": payment.status, "payment_id": payment.id}
        
    except Exception as exc:
        logger.error("trigger_payment_failed", bill_id=bill_id, user_id=user_id, error=str(exc))
        raise self.retry(exc=exc, countdown=60)
    finally:
        db.close()

@celery_app.task
def cleanup_failed_payments():
    """Clean up old failed payments and retry if needed"""
    db: Session = SessionLocal()
    try:
        # Find payments that failed more than 24 hours ago
        cutoff_time = datetime.utcnow() - timedelta(hours=24)
        old_failed_payments = db.query(Payment).filter(
            Payment.status == "failed",
            Payment.created_at < cutoff_time
        ).all()
        
        for payment in old_failed_payments:
            # Log for manual review
            logger.warning("old_failed_payment", payment_id=payment.id, bill_id=payment.bill_id, amount=payment.amount)
            
            # Create analytics event
            analytics = AnalyticsEvent(
                user_id=payment.user_id,
                event_type="payment_cleanup",
                event_data=f'{{"payment_id": {payment.id}, "status": "failed", "age_hours": 24}}'
            )
            db.add(analytics)
        
        db.commit()
        logger.info("cleanup_completed", failed_payments_count=len(old_failed_payments))
        
    except Exception as exc:
        logger.error("cleanup_failed_payments_error", error=str(exc))
    finally:
        db.close()