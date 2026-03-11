from sqlalchemy.orm import Session
import uuid

from app.models.payment import Payment
from app.models.bill import Bill
from app.schemas.payment import PaymentCreate

def get_payments(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Payment).filter(Payment.user_id == user_id).offset(skip).limit(limit).all()

def create_payment(db: Session, payment: PaymentCreate, user_id: int):
    transaction_id = str(uuid.uuid4())
    db_payment = Payment(**payment.dict(), user_id=user_id, transaction_id=transaction_id)
    db.add(db_payment)
    
    # If payment is for the full amount, mark bill as paid
    bill = db.query(Bill).filter(Bill.id == payment.bill_id).first()
    if bill and payment.amount >= bill.target_amount - bill.current_balance:
        bill.is_paid = True
        bill.current_balance = bill.target_amount
    
    db.commit()
    db.refresh(db_payment)
    return db_payment