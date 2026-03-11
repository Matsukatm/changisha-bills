from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime

class UserPaymentMethodBase(BaseModel):
    payment_type: str
    provider_name: str
    account_number: str
    account_holder_name: str
    is_default: Optional[bool] = False

class UserPaymentMethodCreate(UserPaymentMethodBase):
    pass

class UserPaymentMethodUpdate(BaseModel):
    payment_type: Optional[str] = None
    provider_name: Optional[str] = None
    account_number: Optional[str] = None
    account_holder_name: Optional[str] = None
    is_default: Optional[bool] = None
    is_active: Optional[bool] = None

class UserPaymentMethodInDBBase(UserPaymentMethodBase):
    id: int
    user_id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

class UserPaymentMethod(UserPaymentMethodInDBBase):
    pass

# Validators
@validator('payment_type')
def validate_payment_type(cls, v):
    allowed_types = ['M-Pesa', 'Bank Transfer', 'Paybill', 'Mobile Money']
    if v not in allowed_types:
        raise ValueError(f'Payment type must be one of: {allowed_types}')
    return v

@validator('account_number')
def validate_account_number(cls, v):
    if not v or len(v.strip()) == 0:
        raise ValueError('Account number is required')
    return v.strip()

@validator('account_holder_name')
def validate_account_holder_name(cls, v):
    if not v or len(v.strip()) == 0:
        raise ValueError('Account holder name is required')
    return v.strip()
