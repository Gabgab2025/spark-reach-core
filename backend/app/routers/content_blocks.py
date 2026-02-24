"""
Content blocks routes.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud, models, schemas
from ..database import get_db
from ..auth import require_admin
from ..main_helpers import sanitize_html

router = APIRouter(tags=["content_blocks"])


@router.get("/content_blocks", response_model=List[schemas.ContentBlock])
def read_content_blocks(
    skip: int = 0, limit: int = 100,
    block_type: Optional[str] = None, status: Optional[str] = None, page_slug: Optional[str] = None,
    sort_by: Optional[str] = None, order: Optional[str] = "asc",
    db: Session = Depends(get_db),
):
    return crud.get_content_blocks(db, skip=skip, limit=limit, block_type=block_type, status=status, page_slug=page_slug, sort_by=sort_by, order=order)


@router.get("/content_blocks/{block_id}", response_model=schemas.ContentBlock)
def read_content_block(block_id: str, db: Session = Depends(get_db)):
    db_block = crud.get_content_block(db, block_id=block_id)
    if db_block is None:
        raise HTTPException(status_code=404, detail="Content block not found")
    return db_block


@router.post("/content_blocks", response_model=schemas.ContentBlock)
def create_content_block(block: schemas.ContentBlockCreate, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    return crud.create_content_block(db=db, block=block, sanitize_fn=sanitize_html)


@router.put("/content_blocks/{block_id}", response_model=schemas.ContentBlock)
def update_content_block(block_id: str, block: schemas.ContentBlockUpdate, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    db_block = crud.update_content_block(db, block_id=block_id, block=block, sanitize_fn=sanitize_html)
    if db_block is None:
        raise HTTPException(status_code=404, detail="Content block not found")
    return db_block


@router.delete("/content_blocks/{block_id}")
def delete_content_block(block_id: str, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    db_block = crud.delete_content_block(db, block_id=block_id)
    if db_block is None:
        raise HTTPException(status_code=404, detail="Content block not found")
    return {"ok": True}
