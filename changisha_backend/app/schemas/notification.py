from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NotificationBase(BaseModel):
    message: str
    type: str
    bill_id: Optional[int]

class NotificationCreate(NotificationBase):
    pass

class NotificationInDBBase(NotificationBase):
    id: int
    user_id: int
    is_sent: bool
    sent_at: Optional[datetime]
    created_at: datetime

    class Config:
        orm_mode = True

class Notification(NotificationInDBBase):
    pass