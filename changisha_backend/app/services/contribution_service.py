from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Dict, Any
import structlog

from app.models.contribution import Contribution
from app.models.bill import Bill
from app.schemas.contribution import ContributionCreate
from app.core.cache import cache_service

logger = structlog.get_logger()

def get_contributions(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Contribution).filter(Contribution.user_id == user_id).offset(skip).limit(limit).all()

def create_contribution(db: Session, contribution: ContributionCreate, user_id: int):
    # Get the bill to check current balance and target
    bill = db.query(Bill).filter(Bill.id == contribution.bill_id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    
    # Check if bill is already paid
    if bill.is_paid:
        raise HTTPException(status_code=400, detail="Cannot contribute to an already paid bill")
    
    # Calculate remaining amount
    remaining_amount = bill.target_amount - bill.current_balance
    contribution_amount = contribution.amount
    
    # Validate contribution amount
    if contribution_amount <= 0:
        raise HTTPException(status_code=400, detail="Contribution amount must be positive")
    
    # Check for over-contribution
    if contribution_amount > remaining_amount:
        logger.warning("over_contribution_attempted", 
                      bill_id=bill.id, 
                      user_id=user_id, 
                      contribution_amount=contribution_amount, 
                      remaining_amount=remaining_amount)
        
        # Option 1: Reject the transaction
        raise HTTPException(
            status_code=400, 
            detail=f"Contribution amount (KES {contribution_amount}) exceeds remaining balance (KES {remaining_amount:.2f}). "
                   f"Maximum allowed contribution is KES {remaining_amount:.2f}."
        )
        
        # Option 2: Allow partial contribution (uncomment if preferred)
        # contribution_amount = remaining_amount
        # logger.info("partial_contribution_adjusted", 
        #            bill_id=bill.id, 
        #            user_id=user_id, 
        #            original_amount=contribution.amount,
        #            adjusted_amount=contribution_amount)
    
    # Create contribution with validated amount
    db_contribution = Contribution(
        bill_id=contribution.bill_id,
        amount=contribution_amount,
        user_id=user_id
    )
    db.add(db_contribution)
    
    # Update bill balance
    bill.current_balance += contribution_amount
    
    # Check if bill is now fully paid
    if bill.current_balance >= bill.target_amount:
        bill.is_paid = True
        bill.current_balance = bill.target_amount  # Ensure exact match
        
        # Log completion
        logger.info("bill_fully_paid", 
                   bill_id=bill.id, 
                   user_id=user_id, 
                   final_amount=bill.current_balance,
                   target_amount=bill.target_amount)
        
        # Trigger payment processing
        from app.workers.tasks import trigger_payment
        # This would be triggered asynchronously
        # trigger_payment.delay(bill.id, user_id, bill.target_amount, user.phone_number)
    
    # Invalidate cache
    cache_service.delete(cache_service.bill_progress_key(bill.id))
    cache_service.delete(cache_service.user_bills_key(user_id))
    
    db.commit()
    db.refresh(db_contribution)
    
    # Log analytics event
    from app.models.analytics_event import AnalyticsEvent
    analytics = AnalyticsEvent(
        user_id=user_id,
        event_type="contribution_made",
        event_data=f'{{"bill_id": {bill.id}, "amount": {contribution_amount}, "remaining_before": {remaining_amount}}}'
    )
    db.add(analytics)
    db.commit()
    
    return db_contribution

def get_contribution_summary(db: Session, bill_id: int) -> Dict[str, Any]:
    """Get summary of contributions for a bill"""
    cache_key = cache_service.contribution_summary_key(bill_id)
    cached_summary = cache_service.get(cache_key)
    
    if cached_summary:
        return cached_summary
    
    contributions = db.query(Contribution).filter(Contribution.bill_id == bill_id).all()
    
    summary = {
        "bill_id": bill_id,
        "total_contributions": len(contributions),
        "total_amount": sum(c.amount for c in contributions),
        "contributions": [
            {
                "id": c.id,
                "amount": c.amount,
                "created_at": c.created_at,
                "user_id": c.user_id
            }
            for c in contributions
        ]
    }
    
    # Cache for 2 minutes
    cache_service.set(cache_key, summary, expire=120)
    
    return summary