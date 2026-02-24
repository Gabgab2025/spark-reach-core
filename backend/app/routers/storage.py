"""
Storage routes: file upload endpoint.
"""
import os
import shutil
import time
import pathlib

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile
from sqlalchemy.orm import Session
from typing import Optional

from .. import models
from ..database import get_db
from ..auth import get_current_user
from ..main_helpers import limiter

router = APIRouter(tags=["storage"])

UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".pdf", ".ico"}
ALLOWED_MIMES = {
    "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
    "image/x-icon", "image/vnd.microsoft.icon", "application/pdf",
}


@router.post("/storage/upload")
@limiter.limit("20/minute")
async def upload_file(
    request: Request,
    file: UploadFile = File(...),
    path: Optional[str] = Form(None),
    bucket: Optional[str] = Form(None),
    current_user: models.User = Depends(get_current_user),
):
    try:
        ext = pathlib.Path(file.filename or "").suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail=f"File type '{ext}' not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}")

        if file.content_type and file.content_type not in ALLOWED_MIMES:
            raise HTTPException(status_code=400, detail=f"MIME type '{file.content_type}' not allowed")

        if not path or path.endswith("/"):
            timestamp = int(time.time())
            filename = f"{timestamp}_{file.filename}"
            file_path = os.path.join(UPLOAD_DIR, path or "", filename)
        else:
            clean_path = path.replace("..", "").lstrip("/")
            file_path = os.path.join(UPLOAD_DIR, clean_path)

        resolved = os.path.realpath(file_path)
        upload_root = os.path.realpath(UPLOAD_DIR)
        if not resolved.startswith(upload_root):
            raise HTTPException(status_code=400, detail="Invalid file path")

        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        relative_path = os.path.relpath(file_path, UPLOAD_DIR).replace("\\", "/")
        return {"publicUrl": f"/uploads/{relative_path}"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
