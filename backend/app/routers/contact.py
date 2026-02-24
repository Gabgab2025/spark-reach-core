"""
Contact routes: public contact form with email dispatch.
"""
from fastapi import APIRouter, BackgroundTasks, Depends, Request
from sqlalchemy.orm import Session
from fastapi_mail import FastMail, MessageSchema, MessageType

from .. import models, schemas
from ..database import get_db
from ..main_helpers import limiter, build_mail_config

import os

router = APIRouter(tags=["contact"])


@router.post("/contact")
@limiter.limit("5/minute")
async def send_contact_email(
    request: Request,
    contact: schemas.ContactCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    html = f"""
    <h3>New Contact Form Submission</h3>
    <p><strong>Name:</strong> {contact.name}</p>
    <p><strong>Email:</strong> {contact.email}</p>
    <p><strong>Company:</strong> {contact.company}</p>
    <p><strong>Phone:</strong> {contact.phone}</p>
    <p><strong>Service:</strong> {contact.service}</p>
    <br>
    <p><strong>Message:</strong></p>
    <p>{contact.message}</p>
    """

    mail_conf = build_mail_config(db)

    recipient_row = db.query(models.Setting).filter(models.Setting.key == "smtp_recipient_email").first()
    recipient = (recipient_row.value if recipient_row and recipient_row.value else None) or os.getenv("MAIL_FROM", "info@jdgkbsi.ph")

    message = MessageSchema(
        subject=f"New Inquiry from {contact.name}",
        recipients=[recipient],
        body=html,
        subtype=MessageType.html,
    )

    fm = FastMail(mail_conf)
    background_tasks.add_task(fm.send_message, message)
    return {"message": "Email sent successfully"}
