from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app import schemas
from app.database.connection import get_db
from app.models import Payment
from app.services.payment_service import get_payments, create_payment
from app.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[schemas.Payment])
def read_payments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    payments = get_payments(db=db, user_id=current_user.id, skip=skip, limit=limit)
    return payments

@router.post("/", response_model=schemas.Payment)
def create_new_payment(payment: schemas.PaymentCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return create_payment(db=db, payment=payment, user_id=current_user.id)