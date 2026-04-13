"""
Job Applications routes: public apply endpoint + admin management.
"""
import html as html_lib
import json
import logging
import os
import pathlib
import time

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, HTTPException, Request, UploadFile
from fastapi_mail import FastMail, MessageSchema, MessageType
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud, models, schemas
from ..auth import require_admin
from ..database import get_db
from ..main_helpers import limiter, build_mail_config

logger = logging.getLogger(__name__)

router = APIRouter(tags=["job_applications"])

UPLOAD_DIR = "uploads/resumes"
ALLOWED_RESUME_EXTENSIONS = {".pdf", ".doc", ".docx"}
ALLOWED_RESUME_MIMES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}
MAX_RESUME_BYTES = 5 * 1024 * 1024  # 5 MB


# ── Public: submit application ────────────────────────────────────────────────

@router.post("/job_applications", response_model=schemas.JobApplicationResponse)
@limiter.limit("5/minute")
async def submit_job_application(
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    job_id: Optional[str] = Form(None),
    applicant_data: str = Form(...),
    resume: Optional[UploadFile] = File(None),
):
    # Parse applicant JSON payload
    try:
        payload = json.loads(applicant_data)
    except (json.JSONDecodeError, ValueError):
        logger.warning("Job application: invalid JSON in applicant_data")
        raise HTTPException(status_code=422, detail="Invalid applicant_data JSON")

    # Override job_id in payload if provided as form field
    if job_id:
        payload["job_id"] = job_id

    # Clear job_id if it references a non-existent listing (e.g. fallback jobs)
    if payload.get("job_id"):
        exists = db.query(models.JobListing).filter(
            models.JobListing.id == payload["job_id"]
        ).first()
        if not exists:
            logger.info("Job application: job_id '%s' not found, setting to null", payload["job_id"])
            payload["job_id"] = None

    try:
        app_schema = schemas.JobApplicationCreate(**payload)
    except Exception as exc:
        logger.warning("Job application: schema validation failed: %s", exc)
        raise HTTPException(status_code=422, detail=str(exc))

    # Sanitize nested dicts (previous_employment, certifications) that bypass field validators
    if app_schema.previous_employment:
        for emp in app_schema.previous_employment:
            for k, v in emp.items():
                if isinstance(v, str):
                    emp[k] = schemas._strip_injection(v, max_len=500)
    if app_schema.certifications:
        for cert in app_schema.certifications:
            for k, v in cert.items():
                if isinstance(v, str):
                    cert[k] = schemas._strip_injection(v, max_len=300)

    # Handle resume file
    resume_url: Optional[str] = None
    if resume and resume.filename:
        ext = pathlib.Path(resume.filename).suffix.lower()
        if ext not in ALLOWED_RESUME_EXTENSIONS:
            logger.warning("Job application: bad resume ext '%s' (file: %s)", ext, resume.filename)
            raise HTTPException(
                status_code=400,
                detail=f"Resume must be PDF, DOC, or DOCX. Got '{ext}'",
            )
        # Only reject obviously wrong MIME types; browsers often send
        # application/octet-stream for .doc/.docx files
        if resume.content_type and resume.content_type not in (
            *ALLOWED_RESUME_MIMES, "application/octet-stream",
        ):
            logger.warning("Job application: unexpected MIME '%s' (file: %s, ext: %s)", resume.content_type, resume.filename, ext)
        contents = await resume.read()
        if len(contents) > MAX_RESUME_BYTES:
            logger.warning("Job application: resume too large (%d bytes)", len(contents))
            raise HTTPException(status_code=400, detail="Resume must be 5 MB or less")

        os.makedirs(UPLOAD_DIR, exist_ok=True)
        timestamp = int(time.time())
        safe_name = pathlib.Path(resume.filename).name.replace(" ", "_")
        filename = f"{timestamp}_{safe_name}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as f:
            f.write(contents)
        resume_url = f"/{file_path}"

    db_app = crud.create_job_application(db, data=app_schema, resume_url=resume_url)

    # Send email notification to admin (fire-and-forget)
    try:
        mail_conf = build_mail_config(db)
        recipient_row = db.query(models.Setting).filter(
            models.Setting.key == "smtp_recipient_email"
        ).first()
        recipient = (
            (recipient_row.value if recipient_row and recipient_row.value else None)
            or os.getenv("MAIL_FROM", "info@jdgkbsi.ph")
        )
        applicant_name = f"{app_schema.first_name} {app_schema.last_name}"
        html_body = f"""
        <h3>New Job Application Received</h3>
        <p><strong>Applicant:</strong> {html_lib.escape(applicant_name)}</p>
        <p><strong>Email:</strong> {html_lib.escape(app_schema.email)}</p>
        <p><strong>Mobile:</strong> {html_lib.escape(app_schema.mobile)}</p>
        <p><strong>Job ID:</strong> {html_lib.escape(app_schema.job_id or 'N/A')}</p>
        <p><strong>Resume:</strong> {'Attached' if resume_url else 'Not provided'}</p>
        <br>
        <p>Log into the admin panel to review the full application.</p>
        """
        message = MessageSchema(
            subject=f"New Job Application from {applicant_name}",
            recipients=[recipient],
            body=html_body,
            subtype=MessageType.html,
        )
        fm = FastMail(mail_conf)
        background_tasks.add_task(fm.send_message, message)
    except Exception:
        pass  # Email failure must never block the applicant's submission

    return db_app


# ── Admin: list applications ──────────────────────────────────────────────────

@router.get("/job_applications", response_model=List[schemas.JobApplicationResponse])
def list_job_applications(
    job_id: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return crud.get_job_applications(db, job_id=job_id, status=status, skip=skip, limit=limit)


# ── Admin: get single application ────────────────────────────────────────────

@router.get("/job_applications/{app_id}", response_model=schemas.JobApplicationResponse)
def get_job_application(
    app_id: str,
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    db_app = crud.get_job_application(db, app_id)
    if not db_app:
        raise HTTPException(status_code=404, detail="Application not found")
    return db_app


# ── Admin: update status / notes ─────────────────────────────────────────────

@router.put("/job_applications/{app_id}", response_model=schemas.JobApplicationResponse)
def update_job_application(
    app_id: str,
    update: schemas.JobApplicationUpdate,
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    db_app = crud.update_job_application(db, app_id, update)
    if not db_app:
        raise HTTPException(status_code=404, detail="Application not found")
    return db_app


# ── Admin: delete application ────────────────────────────────────────────────

@router.delete("/job_applications/{app_id}")
def delete_job_application(
    app_id: str,
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    db_app = crud.delete_job_application(db, app_id)
    if not db_app:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"ok": True}
