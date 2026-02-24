"""
Settings routes: site configuration management.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, models, schemas
from ..database import get_db
from ..auth import require_admin
from ..main_helpers import build_mail_config

import os

router = APIRouter(tags=["settings"])

# Sensitive keys never returned to unauthenticated users
SENSITIVE_SETTING_KEYS = {
    "recaptcha_secret_key",
    "google_maps_api_key",
    "smtp_password",
    "smtp_username",
}


@router.get("/settings/public", response_model=List[schemas.Setting])
def read_public_settings(db: Session = Depends(get_db)):
    """Return only non-sensitive settings for public consumption."""
    all_settings = crud.get_settings(db)
    return [s for s in all_settings if s.key not in SENSITIVE_SETTING_KEYS]


@router.get("/settings", response_model=List[schemas.Setting])
def read_settings(admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    """Return all settings including sensitive ones — admin only."""
    return crud.get_settings(db)


@router.post("/settings/bulk_update", response_model=List[schemas.Setting])
def update_settings(bulk_update: schemas.SettingsBulkUpdate, admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    return crud.update_settings_bulk(db, bulk_update.settings)


@router.post("/settings/test_email")
async def send_test_email(admin: models.User = Depends(require_admin), db: Session = Depends(get_db)):
    """Send a test email using the current SMTP settings to verify configuration."""
    from fastapi_mail import FastMail, MessageSchema, MessageType
    mail_conf = build_mail_config(db)

    recipient_row = db.query(models.Setting).filter(models.Setting.key == "smtp_recipient_email").first()
    recipient = (recipient_row.value if recipient_row and recipient_row.value else None) or mail_conf.MAIL_FROM

    html = """
    <h3>SMTP Test Email</h3>
    <p>If you are reading this, your SMTP configuration is working correctly.</p>
    <p><em>Sent from JDGK CMS Settings panel.</em></p>
    """
    message = MessageSchema(
        subject="JDGK CMS — SMTP Test Email",
        recipients=[recipient],
        body=html,
        subtype=MessageType.html,
    )
    try:
        fm = FastMail(mail_conf)
        await fm.send_message(message)
        return {"message": "Test email sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send test email: {str(e)}")
