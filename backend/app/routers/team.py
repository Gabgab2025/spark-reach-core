"""
Team members routes.
"""
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud, models, schemas
from ..database import get_db
from ..auth import require_admin
from ..main_helpers import sanitize_html

router = APIRouter(tags=["team"])


def _deserialize_json_arrays(member):
    """Convert JSON-string columns (expertise, achievements) to Python lists for response."""
    if member is None:
        return member
    for field in ('expertise', 'achievements'):
        val = getattr(member, field, None)
        if isinstance(val, str):
            try:
                setattr(member, field, json.loads(val))
            except (json.JSONDecodeError, TypeError):
                setattr(member, field, [])
        elif val is None:
            setattr(member, field, [])
    return member


def _serialize_json_arrays(data: dict) -> dict:
    """Convert list fields to JSON strings for DB storage."""
    for field in ('expertise', 'achievements'):
        val = data.get(field)
        if isinstance(val, list):
            data[field] = json.dumps(val)
    return data


@router.get("/team_members", response_model=List[schemas.TeamMember])
def read_team_members(
    skip: int = 0, limit: int = 100,
    sort_by: Optional[str] = None, order: Optional[str] = "asc",
    db: Session = Depends(get_db),
):
    members = crud.get_team_members(db, skip=skip, limit=limit, sort_by=sort_by, order=order)
    return [_deserialize_json_arrays(m) for m in members]


@router.get("/team_members/{member_id}", response_model=schemas.TeamMember)
def read_team_member(member_id: str, db: Session = Depends(get_db)):
    """Get a single team member by ID or slug."""
    member = crud.get_team_member(db, member_id=member_id)
    if member is None:
        raise HTTPException(status_code=404, detail="Team member not found")
    return _deserialize_json_arrays(member)


@router.post("/team_members", response_model=schemas.TeamMember)
def create_team_member(member: schemas.TeamMemberCreate, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    return _deserialize_json_arrays(
        crud.create_team_member(db=db, member=member, sanitize_fn=sanitize_html, serialize_fn=_serialize_json_arrays)
    )


@router.put("/team_members/{member_id}", response_model=schemas.TeamMember)
def update_team_member(member_id: str, member: schemas.TeamMemberUpdate, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    db_member = crud.update_team_member(db, member_id=member_id, member=member, sanitize_fn=sanitize_html, serialize_fn=_serialize_json_arrays)
    if db_member is None:
        raise HTTPException(status_code=404, detail="Team member not found")
    return _deserialize_json_arrays(db_member)


@router.delete("/team_members/{member_id}")
def delete_team_member(member_id: str, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    db_member = crud.delete_team_member(db, member_id=member_id)
    if db_member is None:
        raise HTTPException(status_code=404, detail="Team member not found")
    return {"ok": True}
