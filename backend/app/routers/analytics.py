"""
Analytics routes — admin only.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud, models, schemas
from ..database import get_db
from ..auth import require_admin

router = APIRouter(tags=["analytics"])


@router.get("/analytics_data", response_model=List[schemas.AnalyticsData])
def read_analytics(
    category: Optional[str] = None,
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return crud.get_analytics_data(db, category=category)
