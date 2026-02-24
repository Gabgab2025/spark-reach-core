"""
main.py — Application factory for JDGK Business Solutions API.

Responsibilities:
  - App creation and configuration
  - Middleware registration (CORS, request logging, rate limiting)
  - Startup: DB table creation + seed
  - Static file mount for uploads
  - Domain router registration

All business logic lives in app/routers/ and app/crud.py.
"""
import logging
import os
import time

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from .database import SessionLocal, engine
from . import models, seed
from .main_helpers import limiter
from .routers import all_routers

# ── Environment ───────────────────────────────────────────────────────────────
# Explicitly look for .env in the backend directory to avoid root collision
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(base_dir, ".env"))

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("jdgk-api")

# ── Database bootstrap ────────────────────────────────────────────────────────
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()
try:
    seed.init_db(db)
finally:
    db.close()

# ── Uploads directory ─────────────────────────────────────────────────────────
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ── App factory ───────────────────────────────────────────────────────────────
app = FastAPI(title="JDGK Business Solutions API")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# ── CORS ──────────────────────────────────────────────────────────────────────
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:8080,http://localhost:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in ALLOWED_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Security headers middleware (XSS / clickjacking / MIME-sniff protection) ──
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Strict-Transport-Security"] = (
        "max-age=31536000; includeSubDomains; preload"
    )
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com; "
        "img-src 'self' data: blob: https:; "
        "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com; "
        "frame-src 'self' https://www.googletagmanager.com; "
        "object-src 'none'; "
        "base-uri 'self';"
    )
    return response

# ── Request logging middleware ────────────────────────────────────────────────
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration_ms = round((time.time() - start) * 1000)
    logger.info(f"{request.method} {request.url.path} → {response.status_code} ({duration_ms}ms)")
    return response

# ── Register all domain routers ───────────────────────────────────────────────
for router in all_routers:
    app.include_router(router, prefix="/api")

# ── Health / version ──────────────────────────────────────────────────────────
BUILD_COMMIT = os.getenv("SOURCE_COMMIT", "dev")

@app.get("/")
def read_root():
    return {"message": "JDGK Business Solutions API", "commit": BUILD_COMMIT}

@app.get("/api/version")
def api_version():
    return {"commit": BUILD_COMMIT, "status": "ok"}
