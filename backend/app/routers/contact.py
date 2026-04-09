"""
Contact routes: public contact form with DB storage + email dispatch.
"""
import html as html_lib
import os
from typing import List

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from fastapi_mail import FastMail, MessageSchema, MessageType

from .. import models, schemas
from ..database import get_db
from ..main_helpers import limiter, build_mail_config
from ..auth import require_admin

router = APIRouter(tags=["contact"])


@router.post("/contact", response_model=schemas.ContactMessageResponse)
@limiter.limit("5/minute")
async def submit_contact_message(
    request: Request,
    contact: schemas.ContactCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    # Silently reject bot submissions (honeypot field was filled)
    if contact.honeypot:
        return {"message": "Message received successfully"}

    # Save to database
    db_message = models.ContactMessage(
        full_name=contact.full_name,
        contact_number=contact.contact_number,
        email=contact.email,
        message=contact.message,
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)

    # Send email notification in background
    html = f"""
    <h3>New Message from Website</h3>
    <p><strong>Full Name:</strong> {html_lib.escape(contact.full_name)}</p>
    <p><strong>Email:</strong> {html_lib.escape(contact.email)}</p>
    <p><strong>Contact Number:</strong> {html_lib.escape(contact.contact_number or '—')}</p>
    <br>
    <p><strong>Message:</strong></p>
    <p>{html_lib.escape(contact.message)}</p>
    """

    try:
        mail_conf = build_mail_config(db)
        recipient_row = db.query(models.Setting).filter(models.Setting.key == "smtp_recipient_email").first()
        recipient = (recipient_row.value if recipient_row and recipient_row.value else None) or os.getenv("MAIL_FROM", "info@jdgkbsi.ph")

        email_message = MessageSchema(
            subject=f"New Message from {contact.full_name}",
            recipients=[recipient],
            body=html,
            subtype=MessageType.html,
        )
        fm = FastMail(mail_conf)
        background_tasks.add_task(fm.send_message, email_message)
    except Exception:
        pass  # Email failure should not prevent DB save from succeeding

    return db_message


# ── Admin endpoints ──────────────────────────────────────────────────────────

@router.get("/contact_messages", response_model=List[schemas.ContactMessageResponse])
def list_contact_messages(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    return db.query(models.ContactMessage).order_by(models.ContactMessage.submitted_at.desc()).all()


@router.get("/contact_messages/{message_id}", response_model=schemas.ContactMessageResponse)
def get_contact_message(
    message_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    msg = db.query(models.ContactMessage).filter(models.ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    return msg


@router.patch("/contact_messages/{message_id}/read", response_model=schemas.ContactMessageResponse)
def mark_message_read(
    message_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    msg = db.query(models.ContactMessage).filter(models.ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_read = not msg.is_read
    db.commit()
    db.refresh(msg)
    return msg


@router.delete("/contact_messages/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact_message(
    message_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    msg = db.query(models.ContactMessage).filter(models.ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()

