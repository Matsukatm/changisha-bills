from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app import schemas
from app.database.connection import get_db
from app.models import Contribution
from app.services.contribution_service import get_contributions, create_contribution
from app.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[schemas.Contribution])
def read_contributions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    contributions = get_contributions(db=db, user_id=current_user.id, skip=skip, limit=limit)
    return contributions

@router.post("/", response_model=schemas.Contribution)
def create_new_contribution(contribution: schemas.ContributionCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return create_contribution(db=db, contribution=contribution, user_id=current_user.id)