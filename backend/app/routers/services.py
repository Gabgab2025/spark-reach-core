"""
Services routes: business service management.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud, models, schemas
from ..database import get_db
from ..auth import require_admin
from ..main_helpers import sanitize_html

router = APIRouter(tags=["services"])


@router.get("/services", response_model=List[schemas.Service])
def read_services(
    skip: int = 0, limit: int = 100,
    sort_by: Optional[str] = None, order: Optional[str] = "asc",
    db: Session = Depends(get_db),
):
    return crud.get_services(db, skip=skip, limit=limit, sort_by=sort_by, order=order)


@router.post("/services", response_model=schemas.Service)
def create_service(service: schemas.ServiceCreate, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    return crud.create_service(db=db, service=service, sanitize_fn=sanitize_html)


@router.put("/services/{service_id}", response_model=schemas.Service)
def update_service(service_id: str, service: schemas.ServiceUpdate, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    db_service = crud.update_service(db, service_id=service_id, service=service, sanitize_fn=sanitize_html)
    if db_service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    return db_service


@router.delete("/services/{service_id}")
def delete_service(service_id: str, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    db_service = crud.delete_service(db, service_id=service_id)
    if db_service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"ok": True}
