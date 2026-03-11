from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.connection import Base

class Contribution(Base):
    __tablename__ = "contributions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    bill_id = Column(Integer, ForeignKey("bills.id"))
    amount = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    bill = relationship("Bill", back_populates="contributions")