"""
Auth routes: login, session, signup, logout, user role.
"""
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from typing import Optional

from .. import crud, models, schemas
from ..database import get_db
from ..auth import (
    create_access_token,
    get_current_user,
    get_current_user_optional,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from ..main_helpers import limiter

router = APIRouter(tags=["auth"])


@router.post("/auth/login", response_model=schemas.SessionResponse)
@limiter.limit("10/minute")
def login(request: Request, login_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})
    token_response = schemas.TokenResponse(
        access_token=token,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=schemas.User.model_validate(user),
    )
    return schemas.SessionResponse(session=token_response)


@router.get("/auth/session", response_model=schemas.SessionResponse)
def get_session(current_user: Optional[models.User] = Depends(get_current_user_optional)):
    if current_user is None:
        return schemas.SessionResponse(session=None)
    token = create_access_token(data={"sub": current_user.id, "email": current_user.email, "role": current_user.role})
    token_response = schemas.TokenResponse(
        access_token=token,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=schemas.User.model_validate(current_user),
    )
    return schemas.SessionResponse(session=token_response)


@router.post("/auth/signup", response_model=schemas.SessionResponse)
def signup(signup_data: schemas.SignupRequest, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email(db, email=signup_data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = crud.create_user(db, schemas.UserCreate(
        email=signup_data.email,
        password=signup_data.password,
        full_name=signup_data.full_name,
        role="user",
    ))
    token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})
    token_response = schemas.TokenResponse(
        access_token=token,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=schemas.User.model_validate(user),
    )
    return schemas.SessionResponse(session=token_response)


@router.post("/auth/logout")
def logout():
    return {"message": "Logged out successfully"}


@router.get("/user_roles/me")
def get_my_role(current_user: models.User = Depends(get_current_user)):
    return {"role": current_user.role, "user_id": current_user.id}


@router.put("/auth/me", response_model=schemas.User)
def update_my_profile(
    update_data: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Let the logged-in user update their own profile (name, avatar). Role changes are ignored."""
    # Prevent self-role-escalation — strip role from payload
    safe_data = schemas.UserUpdate(
        full_name=update_data.full_name,
        avatar_url=update_data.avatar_url,
        role=None,
    )
    updated = crud.update_user(db, user_id=current_user.id, data=safe_data)
    if updated is None:
        raise HTTPException(status_code=404, detail="User not found")
    return updated
