from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Dict, Any

from app.models.bill import Bill
from app.schemas.bill import BillCreate, BillUpdate
from app.core.cache import cache_service

def get_bills(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    # Try to get from cache first
    cache_key = cache_service.user_bills_key(user_id)
    cached_bills = cache_service.get(cache_key)
    
    if cached_bills:
        return cached_bills[skip:skip + limit]
    
    # If not in cache, query database
    bills = db.query(Bill).filter(Bill.user_id == user_id).offset(skip).limit(limit).all()
    
    # Cache the result for 5 minutes
    bills_data = [
        {
            "id": bill.id,
            "name": bill.name,
            "target_amount": bill.target_amount,
            "current_balance": bill.current_balance,
            "due_date": bill.due_date,
            "payment_method": bill.payment_method,
            "recipient_account": bill.recipient_account,
            "is_paid": bill.is_paid,
            "created_at": bill.created_at,
            "updated_at": bill.updated_at
        }
        for bill in bills
    ]
    cache_service.set(cache_key, bills_data, expire=300)
    
    return bills

def get_bill_progress(bill_id: int, db: Session) -> Dict[str, Any]:
    # Try to get from cache first
    cache_key = cache_service.bill_progress_key(bill_id)
    cached_progress = cache_service.get(cache_key)
    
    if cached_progress:
        return cached_progress
    
    # Calculate progress from database
    bill = db.query(Bill).filter(Bill.id == bill_id).first()
    if not bill:
        return None
    
    progress_data = {
        "bill_id": bill.id,
        "current_balance": bill.current_balance,
        "target_amount": bill.target_amount,
        "progress_percentage": round((bill.current_balance / bill.target_amount) * 100, 2) if bill.target_amount > 0 else 0,
        "is_paid": bill.is_paid,
        "remaining_amount": max(0, bill.target_amount - bill.current_balance)
    }
    
    # Cache for 1 minute
    cache_service.set(cache_key, progress_data, expire=60)
    
    return progress_data

def create_bill(db: Session, bill: BillCreate, user_id: int):
    db_bill = Bill(**bill.dict(), user_id=user_id)
    db.add(db_bill)
    db.commit()
    db.refresh(db_bill)
    
    # Invalidate cache for user bills
    cache_key = cache_service.user_bills_key(user_id)
    cache_service.delete(cache_key)
    
    return db_bill

def update_bill(db: Session, bill_id: int, bill: BillUpdate, user_id: int):
    db_bill = db.query(Bill).filter(Bill.id == bill_id, Bill.user_id == user_id).first()
    if not db_bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    update_data = bill.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_bill, field, value)
    db.commit()
    db.refresh(db_bill)
    
    # Invalidate relevant caches
    cache_service.delete(cache_service.user_bills_key(user_id))
    cache_service.delete(cache_service.bill_progress_key(bill_id))
    
    return db_bill

def delete_bill(db: Session, bill_id: int, user_id: int):
    db_bill = db.query(Bill).filter(Bill.id == bill_id, Bill.user_id == user_id).first()
    if not db_bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    db.delete(db_bill)
    db.commit()
    
    # Invalidate relevant caches
    cache_service.delete(cache_service.user_bills_key(user_id))
    cache_service.delete(cache_service.bill_progress_key(bill_id))