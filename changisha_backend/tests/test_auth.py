import pytest
from sqlalchemy.orm import Session

from app.services.auth_service import authenticate_user, create_user
from app.schemas.user import UserCreate

def test_create_user(db: Session):
    user_data = UserCreate(email="test@example.com", password="password", full_name="Test User")
    user = create_user(db=db, user=user_data)
    assert user.email == "test@example.com"
    assert user.full_name == "Test User"

def test_authenticate_user(db: Session):
    user = authenticate_user(db, "test@example.com", "password")
    assert user is not None
    assert user.email == "test@example.com"