from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.connection import Base

class UserPaymentMethod(Base):
    __tablename__ = "user_payment_methods"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    payment_type = Column(String)  # e.g., "M-Pesa", "Bank Transfer", "Paybill"
    provider_name = Column(String)  # e.g., "Safaricom", "Equity Bank"
    account_number = Column(String)  # Phone number for M-Pesa, account number for bank
    account_holder_name = Column(String)
    is_default = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User")

    def __repr__(self):
        return f"<UserPaymentMethod(id={self.id}, user_id={self.user_id}, type={self.payment_type}, default={self.is_default})>"
