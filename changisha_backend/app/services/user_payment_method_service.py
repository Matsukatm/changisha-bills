from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List, Optional
import structlog

from app.models.user_payment_method import UserPaymentMethod
from app.schemas.user_payment_method import UserPaymentMethodCreate, UserPaymentMethodUpdate
from app.core.logging import log_user_action

logger = structlog.get_logger()

def get_user_payment_methods(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[UserPaymentMethod]:
    """Get all payment methods for a user"""
    return db.query(UserPaymentMethod).filter(
        UserPaymentMethod.user_id == user_id,
        UserPaymentMethod.is_active == True
    ).offset(skip).limit(limit).all()

def get_user_payment_method(db: Session, payment_method_id: int, user_id: int) -> Optional[UserPaymentMethod]:
    """Get a specific payment method for a user"""
    return db.query(UserPaymentMethod).filter(
        UserPaymentMethod.id == payment_method_id,
        UserPaymentMethod.user_id == user_id,
        UserPaymentMethod.is_active == True
    ).first()

def get_default_payment_method(db: Session, user_id: int) -> Optional[UserPaymentMethod]:
    """Get the default payment method for a user"""
    return db.query(UserPaymentMethod).filter(
        UserPaymentMethod.user_id == user_id,
        UserPaymentMethod.is_default == True,
        UserPaymentMethod.is_active == True
    ).first()

def create_user_payment_method(db: Session, payment_method: UserPaymentMethodCreate, user_id: int) -> UserPaymentMethod:
    """Create a new payment method for a user"""
    
    # If this is set as default, unset other default methods
    if payment_method.is_default:
        db.query(UserPaymentMethod).filter(
            UserPaymentMethod.user_id == user_id,
            UserPaymentMethod.is_default == True
        ).update({"is_default": False})
    
    # Create new payment method
    db_payment_method = UserPaymentMethod(**payment_method.dict(), user_id=user_id)
    db.add(db_payment_method)
    db.commit()
    db.refresh(db_payment_method)
    
    # Log the action
    log_user_action(
        user_id=user_id,
        action="payment_method_created",
        details={
            "payment_method_id": db_payment_method.id,
            "payment_type": payment_method.payment_type,
            "provider": payment_method.provider_name,
            "is_default": payment_method.is_default
        }
    )
    
    logger.info("payment_method_created", 
                user_id=user_id, 
                payment_method_id=db_payment_method.id,
                payment_type=payment_method.payment_type)
    
    return db_payment_method

def update_user_payment_method(db: Session, payment_method_id: int, payment_method: UserPaymentMethodUpdate, user_id: int) -> UserPaymentMethod:
    """Update a payment method for a user"""
    
    db_payment_method = db.query(UserPaymentMethod).filter(
        UserPaymentMethod.id == payment_method_id,
        UserPaymentMethod.user_id == user_id,
        UserPaymentMethod.is_active == True
    ).first()
    
    if not db_payment_method:
        raise HTTPException(status_code=404, detail="Payment method not found")
    
    # If setting as default, unset other defaults
    update_data = payment_method.dict(exclude_unset=True)
    if update_data.get("is_default") is True:
        db.query(UserPaymentMethod).filter(
            UserPaymentMethod.user_id == user_id,
            UserPaymentMethod.id != payment_method_id,
            UserPaymentMethod.is_default == True
        ).update({"is_default": False})
    
    # Update the payment method
    for field, value in update_data.items():
        setattr(db_payment_method, field, value)
    
    db.commit()
    db.refresh(db_payment_method)
    
    # Log the action
    log_user_action(
        user_id=user_id,
        action="payment_method_updated",
        details={
            "payment_method_id": payment_method_id,
            "updated_fields": list(update_data.keys())
        }
    )
    
    logger.info("payment_method_updated", 
                user_id=user_id, 
                payment_method_id=payment_method_id,
                updated_fields=list(update_data.keys()))
    
    return db_payment_method

def delete_user_payment_method(db: Session, payment_method_id: int, user_id: int) -> bool:
    """Soft delete a payment method for a user"""
    
    db_payment_method = db.query(UserPaymentMethod).filter(
        UserPaymentMethod.id == payment_method_id,
        UserPaymentMethod.user_id == user_id,
        UserPaymentMethod.is_active == True
    ).first()
    
    if not db_payment_method:
        raise HTTPException(status_code=404, detail="Payment method not found")
    
    # Soft delete
    db_payment_method.is_active = False
    db_payment_method.is_default = False
    db.commit()
    
    # Log the action
    log_user_action(
        user_id=user_id,
        action="payment_method_deleted",
        details={
            "payment_method_id": payment_method_id,
            "payment_type": db_payment_method.payment_type
        }
    )
    
    logger.info("payment_method_deleted", 
                user_id=user_id, 
                payment_method_id=payment_method_id,
                payment_type=db_payment_method.payment_type)
    
    return True

def set_default_payment_method(db: Session, payment_method_id: int, user_id: int) -> UserPaymentMethod:
    """Set a payment method as default for a user"""
    
    # Get the payment method
    db_payment_method = db.query(UserPaymentMethod).filter(
        UserPaymentMethod.id == payment_method_id,
        UserPaymentMethod.user_id == user_id,
        UserPaymentMethod.is_active == True
    ).first()
    
    if not db_payment_method:
        raise HTTPException(status_code=404, detail="Payment method not found")
    
    # Unset all other defaults
    db.query(UserPaymentMethod).filter(
        UserPaymentMethod.user_id == user_id,
        UserPaymentMethod.is_default == True
    ).update({"is_default": False})
    
    # Set this as default
    db_payment_method.is_default = True
    db.commit()
    db.refresh(db_payment_method)
    
    # Log the action
    log_user_action(
        user_id=user_id,
        action="payment_method_set_default",
        details={
            "payment_method_id": payment_method_id,
            "payment_type": db_payment_method.payment_type
        }
    )
    
    logger.info("payment_method_set_default", 
                user_id=user_id, 
                payment_method_id=payment_method_id,
                payment_type=db_payment_method.payment_type)
    
    return db_payment_method
