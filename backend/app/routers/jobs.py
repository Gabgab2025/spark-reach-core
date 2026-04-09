"""
Jobs routes: job listing management.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud, models, schemas
from ..database import get_db
from ..auth import require_admin
from ..main_helpers import sanitize_html

router = APIRouter(tags=["jobs"])


@router.get("/job_listings", response_model=List[schemas.JobListing])
def read_job_listings(
    skip: int = 0, limit: int = 100,
    id: Optional[str] = None,
    status: Optional[str] = None, sort_by: Optional[str] = None, order: Optional[str] = "desc",
    db: Session = Depends(get_db),
):
    return crud.get_job_listings(db, skip=skip, limit=limit, id=id, status=status, sort_by=sort_by, order=order)


@router.post("/job_listings", response_model=schemas.JobListing)
def create_job_listing(job: schemas.JobListingCreate, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    return crud.create_job_listing(db=db, job=job, sanitize_fn=sanitize_html)


@router.put("/job_listings/{job_id}", response_model=schemas.JobListing)
def update_job_listing(job_id: str, job: schemas.JobListingUpdate, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    db_job = crud.update_job_listing(db, job_id=job_id, job=job, sanitize_fn=sanitize_html)
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job listing not found")
    return db_job


@router.delete("/job_listings/{job_id}")
def delete_job_listing(job_id: str, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    db_job = crud.delete_job_listing(db, job_id=job_id)
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job listing not found")
    return {"ok": True}
