"""
main_helpers.py — Shared utilities used across routers.

Centralizes: rate-limiter, HTML sanitization, mail config builder.
Imported by main.py and all router modules.
"""
import os
import bleach
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi_mail import ConnectionConfig

# ── Rate limiter (shared instance) ───────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)

# ── HTML sanitization ─────────────────────────────────────────────────────────
ALLOWED_TAGS = list(bleach.ALLOWED_TAGS) + [
    "h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "div", "span",
    "img", "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td",
    "ul", "ol", "li", "pre", "code", "blockquote", "strong", "em", "u", "s",
]
ALLOWED_ATTRS = {
    **bleach.ALLOWED_ATTRIBUTES,
    "img": ["src", "alt", "width", "height"],
    "*": ["class", "style"],
}


def sanitize_html(text: str | None) -> str | None:
    """Strip dangerous HTML tags/attributes (script, iframe, on* handlers)."""
    if text is None:
        return None
    return bleach.clean(text, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRS, strip=True)


# ── Mail config builder ───────────────────────────────────────────────────────
def build_mail_config(db: Session | None = None) -> ConnectionConfig:
    """Build SMTP config from DB settings, falling back to environment variables."""
    s: dict = {}
    if db:
        try:
            from . import models
            rows = db.query(models.Setting).filter(
                models.Setting.key.in_([
                    "smtp_host", "smtp_port", "smtp_username", "smtp_password",
                    "smtp_from_email", "smtp_from_name", "smtp_use_tls", "smtp_use_ssl",
                ])
            ).all()
            for row in rows:
                s[row.key] = row.value
        except Exception:
            pass

    use_tls = s.get("smtp_use_tls", "").lower() not in ("false", "0", "") if s.get("smtp_use_tls") else True
    use_ssl = s.get("smtp_use_ssl", "").lower() in ("true", "1") if s.get("smtp_use_ssl") else False

    try:
        mail_port = int(s.get("smtp_port") or os.getenv("MAIL_PORT", 587))
    except ValueError:
        mail_port = 587

    return ConnectionConfig(
        MAIL_USERNAME=s.get("smtp_username") or os.getenv("MAIL_USERNAME", "user"),
        MAIL_PASSWORD=s.get("smtp_password") or os.getenv("MAIL_PASSWORD", "password"),
        MAIL_FROM=s.get("smtp_from_email") or os.getenv("MAIL_FROM", "info@jdgkbsi.ph"),
        MAIL_FROM_NAME=s.get("smtp_from_name") or os.getenv("MAIL_FROM_NAME", ""),
        MAIL_PORT=mail_port,
        MAIL_SERVER=s.get("smtp_host") or os.getenv("MAIL_SERVER", "smtp.gmail.com"),
        MAIL_STARTTLS=use_tls,
        MAIL_SSL_TLS=use_ssl,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True,
    )
