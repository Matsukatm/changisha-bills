from pydantic import BaseModel
from datetime import datetime

class ContributionBase(BaseModel):
    amount: float
    bill_id: int

class ContributionCreate(ContributionBase):
    pass

class ContributionInDBBase(ContributionBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class Contribution(ContributionInDBBase):
    pass