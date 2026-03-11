import pytest
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.services.bill_service import create_bill
from app.schemas.bill import BillCreate

def test_create_bill(db: Session):
    bill_data = BillCreate(
        name="Test Bill",
        target_amount=100.0,
        due_date=datetime.utcnow() + timedelta(days=30),
        payment_method="M-Pesa",
        recipient_account="123456"
    )
    bill = create_bill(db=db, bill=bill_data, user_id=1)
    assert bill.name == "Test Bill"
    assert bill.target_amount == 100.0