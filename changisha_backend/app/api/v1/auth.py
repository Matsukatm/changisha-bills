from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address

from app import schemas
from app.core import security
from app.database.connection import get_db
from app.models import User
from app.services.auth_service import authenticate_user, create_user

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.post("/register", response_model=schemas.User)
@limiter.limit("5/minute")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db=db, user=user)

@router.post("/login", response_model=schemas.Token)
@limiter.limit("10/minute")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = security.create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
def logout():
    # For JWT, logout is handled client-side by discarding the token
    return {"message": "Successfully logged out"}