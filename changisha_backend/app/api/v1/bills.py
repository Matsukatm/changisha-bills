from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app import schemas
from app.database.connection import get_db
from app.models import Bill
from app.services.bill_service import get_bills, create_bill, update_bill, delete_bill
from app.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[schemas.Bill])
def read_bills(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    bills = get_bills(db=db, user_id=current_user.id, skip=skip, limit=limit)
    return bills

@router.post("/", response_model=schemas.Bill)
def create_new_bill(bill: schemas.BillCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return create_bill(db=db, bill=bill, user_id=current_user.id)

@router.get("/{bill_id}", response_model=schemas.Bill)
def read_bill(bill_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_bill = db.query(Bill).filter(Bill.id == bill_id, Bill.user_id == current_user.id).first()
    if db_bill is None:
        raise HTTPException(status_code=404, detail="Bill not found")
    return db_bill

@router.put("/{bill_id}", response_model=schemas.Bill)
def update_existing_bill(bill_id: int, bill: schemas.BillUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return update_bill(db=db, bill_id=bill_id, bill=bill, user_id=current_user.id)

@router.delete("/{bill_id}")
def delete_existing_bill(bill_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    delete_bill(db=db, bill_id=bill_id, user_id=current_user.id)
    return {"message": "Bill deleted"}