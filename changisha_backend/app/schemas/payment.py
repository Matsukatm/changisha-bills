from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PaymentBase(BaseModel):
    amount: float
    bill_id: int
    payment_method: str

class PaymentCreate(PaymentBase):
    pass

class PaymentInDBBase(PaymentBase):
    id: int
    user_id: int
    transaction_id: str
    status: str
    created_at: datetime
    completed_at: Optional[datetime]

    class Config:
        orm_mode = True

class Payment(PaymentInDBBase):
    pass