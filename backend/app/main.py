from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, BackgroundTasks
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
from . import crud, models, schemas, seed
from .database import SessionLocal, engine, get_db
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import time

# Create tables
models.Base.metadata.create_all(bind=engine)

# Seed database
db = SessionLocal()
try:
    seed.init_db(db)
finally:
    db.close()

app = FastAPI()

# Ensure uploads directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount static files
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, specify the frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Router
from fastapi import APIRouter
api_router = APIRouter(prefix="/api")

# --- Mail Config ---
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME", "user"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", "password"),
    MAIL_FROM=os.getenv("MAIL_FROM", "info@jdgkbsi.ph"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

@api_router.post("/contact")
async def send_contact_email(contact: schemas.ContactCreate, background_tasks: BackgroundTasks):
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

    message = MessageSchema(
        subject=f"New Inquiry from {contact.name}",
        recipients=[os.getenv("MAIL_FROM", "info@jdgkbsi.ph")],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    background_tasks.add_task(fm.send_message, message)
    return {"message": "Email sent successfully"}

# --- Storage ---
@api_router.post("/storage/upload")
async def upload_file(
    file: UploadFile = File(...),
    path: Optional[str] = Form(None),
    bucket: Optional[str] = Form(None)
):
    try:
        # Generate a unique filename if path is not provided or just a folder
        if not path or path.endswith('/'):
            timestamp = int(time.time())
            filename = f"{timestamp}_{file.filename}"
            if path:
                file_path = os.path.join(UPLOAD_DIR, path, filename)
            else:
                file_path = os.path.join(UPLOAD_DIR, filename)
        else:
            # Sanitize path to prevent directory traversal
            clean_path = path.replace("..", "").lstrip("/")
            file_path = os.path.join(UPLOAD_DIR, clean_path)

        # Ensure directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Return public URL
        # In production, this should be the full URL or relative path handled by frontend
        # For local dev, we return /uploads/...
        relative_path = os.path.relpath(file_path, UPLOAD_DIR).replace("\\", "/")
        public_url = f"/uploads/{relative_path}"

        return {"publicUrl": public_url}
    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Users ---
@api_router.post("/admin/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@api_router.get("/users", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_users(db, skip=skip, limit=limit)

# --- Pages ---
@api_router.get("/pages", response_model=List[schemas.Page])
def read_pages(skip: int = 0, limit: int = 100, status: Optional[str] = None, slug: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.get_pages(db, skip=skip, limit=limit, status=status, slug=slug)

@api_router.post("/pages", response_model=schemas.Page)
def create_page(page: schemas.PageCreate, db: Session = Depends(get_db)):
    return crud.create_page(db=db, page=page)

@api_router.put("/pages/{page_id}", response_model=schemas.Page)
def update_page(page_id: str, page: schemas.PageUpdate, db: Session = Depends(get_db)):
    db_page = crud.update_page(db, page_id=page_id, page=page)
    if db_page is None:
        raise HTTPException(status_code=404, detail="Page not found")
    return db_page

@api_router.delete("/pages/{page_id}")
def delete_page(page_id: str, db: Session = Depends(get_db)):
    db_page = crud.delete_page(db, page_id=page_id)
    if db_page is None:
        raise HTTPException(status_code=404, detail="Page not found")
    return {"ok": True}

# --- Services ---
@api_router.get("/services", response_model=List[schemas.Service])
def read_services(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_services(db, skip=skip, limit=limit)

@api_router.post("/services", response_model=schemas.Service)
def create_service(service: schemas.ServiceCreate, db: Session = Depends(get_db)):
    return crud.create_service(db=db, service=service)

# --- Blog Posts ---
@api_router.get("/blog_posts", response_model=List[schemas.BlogPost])
def read_blog_posts(skip: int = 0, limit: int = 100, status: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.get_blog_posts(db, skip=skip, limit=limit, status=status)

@api_router.post("/blog_posts", response_model=schemas.BlogPost)
def create_blog_post(post: schemas.BlogPostCreate, db: Session = Depends(get_db)):
    return crud.create_blog_post(db=db, post=post)

# --- Job Listings ---
@api_router.get("/job_listings", response_model=List[schemas.JobListing])
def read_job_listings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_job_listings(db, skip=skip, limit=limit)

@api_router.post("/job_listings", response_model=schemas.JobListing)
def create_job_listing(job: schemas.JobListingCreate, db: Session = Depends(get_db)):
    return crud.create_job_listing(db=db, job=job)

# --- Testimonials ---
@api_router.get("/testimonials", response_model=List[schemas.Testimonial])
def read_testimonials(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_testimonials(db, skip=skip, limit=limit)

@api_router.post("/testimonials", response_model=schemas.Testimonial)
def create_testimonial(testimonial: schemas.TestimonialCreate, db: Session = Depends(get_db)):
    return crud.create_testimonial(db=db, testimonial=testimonial)

# --- Team Members ---
@api_router.get("/team_members", response_model=List[schemas.TeamMember])
def read_team_members(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_team_members(db, skip=skip, limit=limit)

@api_router.post("/team_members", response_model=schemas.TeamMember)
def create_team_member(member: schemas.TeamMemberCreate, db: Session = Depends(get_db)):
    return crud.create_team_member(db=db, member=member)

# --- Settings ---
@api_router.get("/settings", response_model=List[schemas.Setting])
def read_settings(db: Session = Depends(get_db)):
    return crud.get_settings(db)

@api_router.post("/settings/bulk_update", response_model=List[schemas.Setting])
def update_settings(bulk_update: schemas.SettingsBulkUpdate, db: Session = Depends(get_db)):
    return crud.update_settings_bulk(db, bulk_update.settings)

# --- Analytics ---
@api_router.get("/analytics_data", response_model=List[schemas.AnalyticsData])
def read_analytics(category: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.get_analytics_data(db, category=category)

app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "JDGK Business Solutions API"}
