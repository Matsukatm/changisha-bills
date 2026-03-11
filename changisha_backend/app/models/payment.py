from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.connection import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    bill_id = Column(Integer, ForeignKey("bills.id"))
    amount = Column(Float)
    transaction_id = Column(String, unique=True)
    status = Column(String, default="pending")  # pending, completed, failed
    payment_method = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User")
    bill = relationship("Bill", back_populates="payments")