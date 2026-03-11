from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BillBase(BaseModel):
    name: str
    target_amount: float
    due_date: datetime
    payment_method: str
    recipient_account: str

class BillCreate(BillBase):
    pass

class BillUpdate(BillBase):
    current_balance: Optional[float]
    is_paid: Optional[bool]

class BillInDBBase(BillBase):
    id: int
    user_id: int
    current_balance: float
    is_paid: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

class Bill(BillInDBBase):
    pass