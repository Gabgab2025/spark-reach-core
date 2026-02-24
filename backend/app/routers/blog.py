"""
Blog routes: blog post management.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud, models, schemas
from ..database import get_db
from ..auth import require_admin
from ..main_helpers import sanitize_html

router = APIRouter(tags=["blog"])


@router.get("/blog_posts", response_model=List[schemas.BlogPost])
def read_blog_posts(
    skip: int = 0, limit: int = 100,
    status: Optional[str] = None, sort_by: Optional[str] = None, order: Optional[str] = "desc",
    db: Session = Depends(get_db),
):
    return crud.get_blog_posts(db, skip=skip, limit=limit, status=status, sort_by=sort_by, order=order)


@router.post("/blog_posts", response_model=schemas.BlogPost)
def create_blog_post(post: schemas.BlogPostCreate, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    return crud.create_blog_post(db=db, post=post, sanitize_fn=sanitize_html)


@router.put("/blog_posts/{post_id}", response_model=schemas.BlogPost)
def update_blog_post(post_id: str, post: schemas.BlogPostUpdate, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    db_post = crud.update_blog_post(db, post_id=post_id, post=post, sanitize_fn=sanitize_html)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return db_post


@router.delete("/blog_posts/{post_id}")
def delete_blog_post(post_id: str, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    db_post = crud.delete_blog_post(db, post_id=post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"ok": True}
