"""
Users routes: admin user management.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, models, schemas
from ..database import get_db
from ..auth import require_admin

router = APIRouter(tags=["users"])


@router.post("/admin/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@router.get("/admin/users", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    return crud.get_users(db, skip=skip, limit=limit)


# Backwards-compatibility alias
@router.get("/users", response_model=List[schemas.User])
def read_users_compat(skip: int = 0, limit: int = 100, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    return crud.get_users(db, skip=skip, limit=limit)


@router.put("/admin/users/{user_id}/role")
def update_user_role(user_id: str, role_update: schemas.RoleUpdate, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    db_user = crud.update_user_role(db, user_id=user_id, role=role_update.role)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"ok": True, "role": db_user.role}


@router.put("/admin/users/{user_id}", response_model=schemas.User)
def update_user(user_id: str, user_update: schemas.UserUpdate, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    db_user = crud.update_user(db, user_id=user_id, data=user_update)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.delete("/admin/users/{user_id}")
def delete_user(user_id: str, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    # Self-delete guard — admin cannot remove their own account
    if str(admin.id) == str(user_id):
        raise HTTPException(status_code=400, detail="You cannot delete your own account")
    deleted = crud.delete_user(db, user_id=user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"ok": True}
