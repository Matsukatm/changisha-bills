from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.connection import Base

class Bill(Base):
    __tablename__ = "bills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    target_amount = Column(Float)
    current_balance = Column(Float, default=0.0)
    due_date = Column(DateTime)
    payment_method = Column(String)  # e.g., "M-Pesa", "Bank Transfer"
    recipient_account = Column(String)
    is_paid = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User")
    contributions = relationship("Contribution", back_populates="bill")
    payments = relationship("Payment", back_populates="bill")