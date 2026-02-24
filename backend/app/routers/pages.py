"""
Pages routes: CMS page management.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud, models, schemas
from ..database import get_db
from ..auth import require_admin
from ..main_helpers import sanitize_html

router = APIRouter(tags=["pages"])


@router.get("/pages", response_model=List[schemas.Page])
def read_pages(
    skip: int = 0, limit: int = 100,
    status: Optional[str] = None, slug: Optional[str] = None,
    sort_by: Optional[str] = None, order: Optional[str] = "asc",
    db: Session = Depends(get_db),
):
    return crud.get_pages(db, skip=skip, limit=limit, status=status, slug=slug, sort_by=sort_by, order=order)


@router.post("/pages", response_model=schemas.Page)
def create_page(page: schemas.PageCreate, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    return crud.create_page(db=db, page=page, sanitize_fn=sanitize_html)


@router.put("/pages/{page_id}", response_model=schemas.Page)
def update_page(page_id: str, page: schemas.PageUpdate, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    db_page = crud.update_page(db, page_id=page_id, page=page, sanitize_fn=sanitize_html)
    if db_page is None:
        raise HTTPException(status_code=404, detail="Page not found")
    return db_page


@router.delete("/pages/{page_id}")
def delete_page(page_id: str, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    db_page = crud.delete_page(db, page_id=page_id)
    if db_page is None:
        raise HTTPException(status_code=404, detail="Page not found")
    return {"ok": True}
