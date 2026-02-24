"""
Gallery items routes.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud, schemas
from ..database import get_db
from ..auth import require_admin
from ..main_helpers import sanitize_html

router = APIRouter(tags=["gallery"])


@router.get("/gallery_items", response_model=List[schemas.GalleryItem])
def read_gallery_items(
    skip: int = 0,
    limit: int = 200,
    status: Optional[str] = None,
    category: Optional[str] = None,
    sort_by: Optional[str] = None,
    order: Optional[str] = "asc",
    db: Session = Depends(get_db),
):
    return crud.get_gallery_items(
        db, skip=skip, limit=limit, status=status, category=category,
        sort_by=sort_by, order=order,
    )


@router.get("/gallery_items/{item_id}", response_model=schemas.GalleryItem)
def read_gallery_item(item_id: str, db: Session = Depends(get_db)):
    item = crud.get_gallery_item(db, item_id=item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return item


@router.post("/gallery_items", response_model=schemas.GalleryItem)
def create_gallery_item(
    item: schemas.GalleryItemCreate,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    return crud.create_gallery_item(db, item, sanitize_fn=sanitize_html)


@router.put("/gallery_items/{item_id}", response_model=schemas.GalleryItem)
def update_gallery_item(
    item_id: str,
    item: schemas.GalleryItemUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    db_item = crud.update_gallery_item(db, item_id, item, sanitize_fn=sanitize_html)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return db_item


@router.delete("/gallery_items/{item_id}")
def delete_gallery_item(
    item_id: str,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    db_item = crud.delete_gallery_item(db, item_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return {"message": "Gallery item deleted"}
