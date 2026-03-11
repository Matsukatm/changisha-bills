from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app import schemas
from app.database.connection import get_db
from app.models.user_payment_method import UserPaymentMethod
from app.services.user_payment_method_service import (
    get_user_payment_methods,
    get_user_payment_method,
    get_default_payment_method,
    create_user_payment_method,
    update_user_payment_method,
    delete_user_payment_method,
    set_default_payment_method
)
from app.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[schemas.UserPaymentMethod])
def read_payment_methods(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    """Get all payment methods for the current user"""
    return get_user_payment_methods(db=db, user_id=current_user.id, skip=skip, limit=limit)

@router.get("/default", response_model=schemas.UserPaymentMethod)
def read_default_payment_method(
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    """Get the default payment method for the current user"""
    payment_method = get_default_payment_method(db=db, user_id=current_user.id)
    if not payment_method:
        raise HTTPException(status_code=404, detail="No default payment method found")
    return payment_method

@router.get("/{payment_method_id}", response_model=schemas.UserPaymentMethod)
def read_payment_method(
    payment_method_id: int, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    """Get a specific payment method"""
    payment_method = get_user_payment_method(db=db, payment_method_id=payment_method_id, user_id=current_user.id)
    if not payment_method:
        raise HTTPException(status_code=404, detail="Payment method not found")
    return payment_method

@router.post("/", response_model=schemas.UserPaymentMethod)
def create_payment_method(
    payment_method: schemas.UserPaymentMethodCreate, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    """Create a new payment method"""
    return create_user_payment_method(db=db, payment_method=payment_method, user_id=current_user.id)

@router.put("/{payment_method_id}", response_model=schemas.UserPaymentMethod)
def update_payment_method(
    payment_method_id: int, 
    payment_method: schemas.UserPaymentMethodUpdate, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    """Update a payment method"""
    return update_user_payment_method(db=db, payment_method_id=payment_method_id, payment_method=payment_method, user_id=current_user.id)

@router.delete("/{payment_method_id}")
def delete_payment_method(
    payment_method_id: int, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    """Delete a payment method"""
    delete_user_payment_method(db=db, payment_method_id=payment_method_id, user_id=current_user.id)
    return {"message": "Payment method deleted successfully"}

@router.post("/{payment_method_id}/set-default", response_model=schemas.UserPaymentMethod)
def set_default(
    payment_method_id: int, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    """Set a payment method as default"""
    return set_default_payment_method(db=db, payment_method_id=payment_method_id, user_id=current_user.id)
