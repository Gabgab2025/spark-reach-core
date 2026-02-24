"""
Testimonials routes.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud, models, schemas
from ..database import get_db
from ..auth import require_admin
from ..main_helpers import sanitize_html

router = APIRouter(tags=["testimonials"])


@router.get("/testimonials", response_model=List[schemas.Testimonial])
def read_testimonials(
    skip: int = 0, limit: int = 100,
    sort_by: Optional[str] = None, order: Optional[str] = "asc",
    db: Session = Depends(get_db),
):
    return crud.get_testimonials(db, skip=skip, limit=limit, sort_by=sort_by, order=order)


@router.post("/testimonials", response_model=schemas.Testimonial)
def create_testimonial(testimonial: schemas.TestimonialCreate, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    return crud.create_testimonial(db=db, testimonial=testimonial, sanitize_fn=sanitize_html)


@router.put("/testimonials/{testimonial_id}", response_model=schemas.Testimonial)
def update_testimonial(testimonial_id: str, testimonial: schemas.TestimonialUpdate, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    db_testimonial = crud.update_testimonial(db, testimonial_id=testimonial_id, testimonial=testimonial, sanitize_fn=sanitize_html)
    if db_testimonial is None:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return db_testimonial


@router.delete("/testimonials/{testimonial_id}")
def delete_testimonial(testimonial_id: str, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    db_testimonial = crud.delete_testimonial(db, testimonial_id=testimonial_id)
    if db_testimonial is None:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"ok": True}
