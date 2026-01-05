from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# --- Users ---
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

# --- Pages ---
def get_pages(db: Session, skip: int = 0, limit: int = 100, status: str = None, slug: str = None):
    query = db.query(models.Page)
    if status:
        query = query.filter(models.Page.status == status)
    if slug:
        query = query.filter(models.Page.slug == slug)
    return query.offset(skip).limit(limit).all()

def create_page(db: Session, page: schemas.PageCreate):
    db_page = models.Page(**page.model_dump())
    db.add(db_page)
    db.commit()
    db.refresh(db_page)
    return db_page

def update_page(db: Session, page_id: str, page: schemas.PageUpdate):
    db_page = db.query(models.Page).filter(models.Page.id == page_id).first()
    if db_page:
        update_data = page.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_page, key, value)
        db.commit()
        db.refresh(db_page)
    return db_page

def delete_page(db: Session, page_id: str):
    db_page = db.query(models.Page).filter(models.Page.id == page_id).first()
    if db_page:
        db.delete(db_page)
        db.commit()
    return db_page

# --- Services ---
def get_services(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Service).offset(skip).limit(limit).all()

def create_service(db: Session, service: schemas.ServiceCreate):
    db_service = models.Service(**service.model_dump())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

# --- Blog Posts ---
def get_blog_posts(db: Session, skip: int = 0, limit: int = 100, status: str = None):
    query = db.query(models.BlogPost)
    if status:
        query = query.filter(models.BlogPost.status == status)
    return query.offset(skip).limit(limit).all()

def create_blog_post(db: Session, post: schemas.BlogPostCreate):
    db_post = models.BlogPost(**post.model_dump())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

# --- Job Listings ---
def get_job_listings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.JobListing).offset(skip).limit(limit).all()

def create_job_listing(db: Session, job: schemas.JobListingCreate):
    db_job = models.JobListing(**job.model_dump())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

# --- Testimonials ---
def get_testimonials(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Testimonial).offset(skip).limit(limit).all()

def create_testimonial(db: Session, testimonial: schemas.TestimonialCreate):
    db_testimonial = models.Testimonial(**testimonial.model_dump())
    db.add(db_testimonial)
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial

# --- Team Members ---
def get_team_members(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.TeamMember).offset(skip).limit(limit).all()

def create_team_member(db: Session, member: schemas.TeamMemberCreate):
    db_member = models.TeamMember(**member.model_dump())
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

# --- Settings ---
def get_settings(db: Session):
    return db.query(models.Setting).all()

def update_settings_bulk(db: Session, settings: list[schemas.SettingBase]):
    for setting in settings:
        db_setting = db.query(models.Setting).filter(models.Setting.key == setting.key).first()
        if db_setting:
            db_setting.value = setting.value
        else:
            db_setting = models.Setting(key=setting.key, value=setting.value)
            db.add(db_setting)
    db.commit()
    return get_settings(db)

# --- Analytics ---
def get_analytics_data(db: Session, category: str = None):
    query = db.query(models.AnalyticsData)
    if category:
        query = query.filter(models.AnalyticsData.category == category)
    return query.all()
