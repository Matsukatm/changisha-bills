from sqlalchemy.orm import Session

from app.models.notification import Notification

def create_notification(db: Session, user_id: int, message: str, type: str, bill_id: int = None):
    notification = Notification(
        user_id=user_id,
        message=message,
        type=type,
        bill_id=bill_id
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification