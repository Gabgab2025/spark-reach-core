from typing import Callable, Optional
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
from . import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Fields that may contain user-authored HTML and need sanitization
_HTML_FIELDS = frozenset({"content", "description", "bio", "excerpt", "body"})

def _sanitize_data(data: dict, sanitize_fn: Optional[Callable] = None) -> dict:
    """Apply sanitize_fn to HTML-bearing fields in a model data dict."""
    if sanitize_fn is None:
        return data
    for key in _HTML_FIELDS:
        if key in data and isinstance(data[key], str):
            data[key] = sanitize_fn(data[key])
    return data

def _apply_sort(query, model, sort_by: str, order: str):
    """Apply safe column sorting — ignores invalid column names."""
    col = getattr(model, sort_by, None)
    if col is None:
        col = getattr(model, "created_at", None)
    if col is not None:
        query = query.order_by(desc(col) if order == "desc" else asc(col))
    return query

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# --- Users ---
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()

def authenticate_user(db: Session, email: str, password: str):
    """
    Verify email/password and return user if valid.
    Tracks failed attempts and enforces account lockout.
    Returns:
        user  — on success (resets counter)
        None  — wrong credentials (increments counter)
    Raises:
        ValueError — account is locked (message contains remaining minutes)
    """
    from datetime import datetime, timezone, timedelta
    from .models import MAX_FAILED_ATTEMPTS, LOCKOUT_MINUTES

    user = get_user_by_email(db, email)
    if not user:
        return None  # Don't reveal whether email exists

    # ── Check lockout ─────────────────────────────────────────────────────
    now = datetime.now(timezone.utc)
    if user.locked_until and user.locked_until > now:
        remaining = (user.locked_until - now).total_seconds()
        minutes_left = max(1, int(remaining // 60) + 1)
        raise ValueError(
            f"Account locked due to too many failed attempts. "
            f"Try again in {minutes_left} minute{'s' if minutes_left != 1 else ''}."
        )

    # ── Verify password ───────────────────────────────────────────────────
    if not verify_password(password, user.hashed_password):
        user.failed_login_attempts = (user.failed_login_attempts or 0) + 1
        if user.failed_login_attempts >= MAX_FAILED_ATTEMPTS:
            user.locked_until = now + timedelta(minutes=LOCKOUT_MINUTES)
            db.commit()
            raise ValueError(
                f"Account locked after {MAX_FAILED_ATTEMPTS} failed attempts. "
                f"Try again in {LOCKOUT_MINUTES} minutes."
            )
        remaining_attempts = MAX_FAILED_ATTEMPTS - user.failed_login_attempts
        db.commit()
        return None  # Caller shows generic "invalid credentials" message

    # ── Success — reset counters ──────────────────────────────────────────
    user.failed_login_attempts = 0
    user.locked_until = None
    db.commit()
    return user

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

def update_user_role(db: Session, user_id: str, role: str):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db_user.role = role
        db.commit()
        db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: str, data: schemas.UserUpdate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        return None
    if data.full_name is not None:
        db_user.full_name = data.full_name
    if data.avatar_url is not None:
        db_user.avatar_url = data.avatar_url
    if data.role is not None:
        db_user.role = data.role
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: str) -> bool:
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        return False
    db.delete(db_user)
    db.commit()
    return True


# --- Pages ---
def get_pages(db: Session, skip: int = 0, limit: int = 100, status: str = None, slug: str = None, sort_by: str = None, order: str = "asc"):
    query = db.query(models.Page)
    if status:
        query = query.filter(models.Page.status == status)
    if slug:
        query = query.filter(models.Page.slug == slug)
    query = _apply_sort(query, models.Page, sort_by or "created_at", order)
    return query.offset(skip).limit(limit).all()

def create_page(db: Session, page: schemas.PageCreate, sanitize_fn: Optional[Callable] = None):
    db_page = models.Page(**_sanitize_data(page.model_dump(), sanitize_fn))
    db.add(db_page)
    db.commit()
    db.refresh(db_page)
    return db_page

def update_page(db: Session, page_id: str, page: schemas.PageUpdate, sanitize_fn: Optional[Callable] = None):
    db_page = db.query(models.Page).filter(models.Page.id == page_id).first()
    if db_page:
        update_data = _sanitize_data(page.model_dump(exclude_unset=True), sanitize_fn)
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
def get_services(db: Session, skip: int = 0, limit: int = 100, slug: str = None, sort_by: str = None, order: str = "asc"):
    query = db.query(models.Service)
    if slug:
        query = query.filter(models.Service.slug == slug)
    query = _apply_sort(query, models.Service, sort_by or "sort_order", order)
    return query.offset(skip).limit(limit).all()

def create_service(db: Session, service: schemas.ServiceCreate, sanitize_fn: Optional[Callable] = None):
    db_service = models.Service(**_sanitize_data(service.model_dump(), sanitize_fn))
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

def update_service(db: Session, service_id: str, service: schemas.ServiceUpdate, sanitize_fn: Optional[Callable] = None):
    db_service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if db_service:
        update_data = _sanitize_data(service.model_dump(exclude_unset=True), sanitize_fn)
        for key, value in update_data.items():
            setattr(db_service, key, value)
        db.commit()
        db.refresh(db_service)
    return db_service

def delete_service(db: Session, service_id: str):
    db_service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if db_service:
        db.delete(db_service)
        db.commit()
    return db_service

# --- Blog Posts ---
def get_blog_posts(db: Session, skip: int = 0, limit: int = 100, slug: str = None, status: str = None, sort_by: str = None, order: str = "desc"):
    query = db.query(models.BlogPost)
    if slug:
        query = query.filter(models.BlogPost.slug == slug)
    if status:
        query = query.filter(models.BlogPost.status == status)
    query = _apply_sort(query, models.BlogPost, sort_by or "created_at", order)
    return query.offset(skip).limit(limit).all()

def create_blog_post(db: Session, post: schemas.BlogPostCreate, sanitize_fn: Optional[Callable] = None):
    db_post = models.BlogPost(**_sanitize_data(post.model_dump(), sanitize_fn))
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

def update_blog_post(db: Session, post_id: str, post: schemas.BlogPostUpdate, sanitize_fn: Optional[Callable] = None):
    db_post = db.query(models.BlogPost).filter(models.BlogPost.id == post_id).first()
    if db_post:
        update_data = _sanitize_data(post.model_dump(exclude_unset=True), sanitize_fn)
        for key, value in update_data.items():
            setattr(db_post, key, value)
        db.commit()
        db.refresh(db_post)
    return db_post

def delete_blog_post(db: Session, post_id: str):
    db_post = db.query(models.BlogPost).filter(models.BlogPost.id == post_id).first()
    if db_post:
        db.delete(db_post)
        db.commit()
    return db_post

# --- Job Listings ---
def get_job_listings(db: Session, skip: int = 0, limit: int = 100, id: str = None, status: str = None, sort_by: str = None, order: str = "desc"):
    query = db.query(models.JobListing)
    if id:
        query = query.filter(models.JobListing.id == id)
    if status:
        query = query.filter(models.JobListing.status == status)
    query = _apply_sort(query, models.JobListing, sort_by or "created_at", order)
    return query.offset(skip).limit(limit).all()

def create_job_listing(db: Session, job: schemas.JobListingCreate, sanitize_fn: Optional[Callable] = None):
    db_job = models.JobListing(**_sanitize_data(job.model_dump(), sanitize_fn))
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

def update_job_listing(db: Session, job_id: str, job: schemas.JobListingUpdate, sanitize_fn: Optional[Callable] = None):
    db_job = db.query(models.JobListing).filter(models.JobListing.id == job_id).first()
    if db_job:
        update_data = _sanitize_data(job.model_dump(exclude_unset=True), sanitize_fn)
        for key, value in update_data.items():
            setattr(db_job, key, value)
        db.commit()
        db.refresh(db_job)
    return db_job

def delete_job_listing(db: Session, job_id: str):
    db_job = db.query(models.JobListing).filter(models.JobListing.id == job_id).first()
    if db_job:
        db.delete(db_job)
        db.commit()
    return db_job

# --- Testimonials ---
def get_testimonials(db: Session, skip: int = 0, limit: int = 100, sort_by: str = None, order: str = "asc"):
    query = db.query(models.Testimonial)
    query = _apply_sort(query, models.Testimonial, sort_by or "sort_order", order)
    return query.offset(skip).limit(limit).all()

def create_testimonial(db: Session, testimonial: schemas.TestimonialCreate, sanitize_fn: Optional[Callable] = None):
    db_testimonial = models.Testimonial(**_sanitize_data(testimonial.model_dump(), sanitize_fn))
    db.add(db_testimonial)
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial

def update_testimonial(db: Session, testimonial_id: str, testimonial: schemas.TestimonialUpdate, sanitize_fn: Optional[Callable] = None):
    db_testimonial = db.query(models.Testimonial).filter(models.Testimonial.id == testimonial_id).first()
    if db_testimonial:
        update_data = _sanitize_data(testimonial.model_dump(exclude_unset=True), sanitize_fn)
        for key, value in update_data.items():
            setattr(db_testimonial, key, value)
        db.commit()
        db.refresh(db_testimonial)
    return db_testimonial

def delete_testimonial(db: Session, testimonial_id: str):
    db_testimonial = db.query(models.Testimonial).filter(models.Testimonial.id == testimonial_id).first()
    if db_testimonial:
        db.delete(db_testimonial)
        db.commit()
    return db_testimonial

# --- Team Members ---
def _generate_slug(name: str) -> str:
    """Generate URL-friendly slug from name."""
    import re
    slug = name.lower().strip()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s_]+', '-', slug)
    slug = re.sub(r'-+', '-', slug).strip('-')
    return slug

def get_team_members(db: Session, skip: int = 0, limit: int = 100, sort_by: str = None, order: str = "asc"):
    query = db.query(models.TeamMember)
    query = _apply_sort(query, models.TeamMember, sort_by or "sort_order", order)
    return query.offset(skip).limit(limit).all()

def get_team_member(db: Session, member_id: str):
    """Get a single team member by ID, slug, or name-derived slug."""
    # Try by exact ID
    member = db.query(models.TeamMember).filter(models.TeamMember.id == member_id).first()
    if member:
        return member
    # Try by stored slug
    member = db.query(models.TeamMember).filter(models.TeamMember.slug == member_id).first()
    if member:
        return member
    # Fallback: match by generating slug from each member's name
    # This handles existing records that don't have a slug column populated yet
    all_members = db.query(models.TeamMember).all()
    for m in all_members:
        if m.name and _generate_slug(m.name) == member_id:
            # Backfill the slug so future lookups are faster
            m.slug = _generate_slug(m.name)
            db.commit()
            db.refresh(m)
            return m
    return None

def create_team_member(db: Session, member: schemas.TeamMemberCreate, sanitize_fn: Optional[Callable] = None, serialize_fn: Optional[Callable] = None):
    data = _sanitize_data(member.model_dump(), sanitize_fn)
    # Auto-generate slug from name if not provided
    if not data.get('slug') and data.get('name'):
        data['slug'] = _generate_slug(data['name'])
    if serialize_fn:
        data = serialize_fn(data)
    db_member = models.TeamMember(**data)
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

def update_team_member(db: Session, member_id: str, member: schemas.TeamMemberUpdate, sanitize_fn: Optional[Callable] = None, serialize_fn: Optional[Callable] = None):
    db_member = db.query(models.TeamMember).filter(models.TeamMember.id == member_id).first()
    if db_member:
        update_data = _sanitize_data(member.model_dump(exclude_unset=True), sanitize_fn)
        # Auto-generate slug if name changed and slug not provided
        if 'name' in update_data and 'slug' not in update_data:
            update_data['slug'] = _generate_slug(update_data['name'])
        if serialize_fn:
            update_data = serialize_fn(update_data)
        for key, value in update_data.items():
            setattr(db_member, key, value)
        db.commit()
        db.refresh(db_member)
    return db_member

def delete_team_member(db: Session, member_id: str):
    db_member = db.query(models.TeamMember).filter(models.TeamMember.id == member_id).first()
    if db_member:
        db.delete(db_member)
        db.commit()
    return db_member

# --- Gallery Items ---
def get_gallery_items(db: Session, skip: int = 0, limit: int = 200, status: str = None, category: str = None, sort_by: str = None, order: str = "asc"):
    query = db.query(models.GalleryItem)
    if status:
        query = query.filter(models.GalleryItem.status == status)
    if category:
        query = query.filter(models.GalleryItem.category == category)
    query = _apply_sort(query, models.GalleryItem, sort_by or "sort_order", order)
    return query.offset(skip).limit(limit).all()

def get_gallery_item(db: Session, item_id: str):
    item = db.query(models.GalleryItem).filter(models.GalleryItem.id == item_id).first()
    if item:
        return item
    return db.query(models.GalleryItem).filter(models.GalleryItem.slug == item_id).first()

def create_gallery_item(db: Session, item: schemas.GalleryItemCreate, sanitize_fn: Optional[Callable] = None):
    data = _sanitize_data(item.model_dump(), sanitize_fn)
    if not data.get('slug') and data.get('title'):
        data['slug'] = _generate_slug(data['title'])
    db_item = models.GalleryItem(**data)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_gallery_item(db: Session, item_id: str, item: schemas.GalleryItemUpdate, sanitize_fn: Optional[Callable] = None):
    db_item = db.query(models.GalleryItem).filter(models.GalleryItem.id == item_id).first()
    if db_item:
        update_data = _sanitize_data(item.model_dump(exclude_unset=True), sanitize_fn)
        if 'title' in update_data and 'slug' not in update_data:
            update_data['slug'] = _generate_slug(update_data['title'])
        for key, value in update_data.items():
            setattr(db_item, key, value)
        db.commit()
        db.refresh(db_item)
    return db_item

def delete_gallery_item(db: Session, item_id: str):
    db_item = db.query(models.GalleryItem).filter(models.GalleryItem.id == item_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
    return db_item

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

# --- Content Blocks ---
def get_content_blocks(db: Session, skip: int = 0, limit: int = 100, block_type: str = None, status: str = None, page_slug: str = None, sort_by: str = None, order: str = "asc"):
    query = db.query(models.ContentBlock)
    if block_type:
        query = query.filter(models.ContentBlock.block_type == block_type)
    if status:
        query = query.filter(models.ContentBlock.status == status)
    # Filter by page assignment (JSONB array contains)
    if page_slug:
        query = query.filter(models.ContentBlock.page_assignments.contains([page_slug]))
    query = _apply_sort(query, models.ContentBlock, sort_by or "sort_order", order)
    return query.offset(skip).limit(limit).all()

def get_content_block(db: Session, block_id: str):
    return db.query(models.ContentBlock).filter(models.ContentBlock.id == block_id).first()

def create_content_block(db: Session, block: schemas.ContentBlockCreate, sanitize_fn: Optional[Callable] = None):
    db_block = models.ContentBlock(**_sanitize_data(block.model_dump(), sanitize_fn))
    db.add(db_block)
    db.commit()
    db.refresh(db_block)
    return db_block

def update_content_block(db: Session, block_id: str, block: schemas.ContentBlockUpdate, sanitize_fn: Optional[Callable] = None):
    db_block = db.query(models.ContentBlock).filter(models.ContentBlock.id == block_id).first()
    if db_block:
        update_data = _sanitize_data(block.model_dump(exclude_unset=True), sanitize_fn)
        for key, value in update_data.items():
            setattr(db_block, key, value)
        db.commit()
        db.refresh(db_block)
    return db_block

def delete_content_block(db: Session, block_id: str):
    db_block = db.query(models.ContentBlock).filter(models.ContentBlock.id == block_id).first()
    if db_block:
        db.delete(db_block)
        db.commit()
    return db_block

# --- Analytics ---
def get_analytics_data(db: Session, category: str = None):
    query = db.query(models.AnalyticsData)
    if category:
        query = query.filter(models.AnalyticsData.category == category)
    return query.all()


# --- Job Applications ---

def create_job_application(
    db: Session,
    data: schemas.JobApplicationCreate,
    resume_url: Optional[str] = None,
) -> models.JobApplication:
    db_app = models.JobApplication(
        **data.model_dump(),
        resume_url=resume_url,
    )
    db.add(db_app)
    # Increment applications_count on the job listing
    if data.job_id:
        db_job = db.query(models.JobListing).filter(models.JobListing.id == data.job_id).first()
        if db_job:
            db_job.applications_count = (db_job.applications_count or 0) + 1
    db.commit()
    db.refresh(db_app)
    return db_app


def get_job_applications(
    db: Session,
    job_id: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
):
    query = db.query(models.JobApplication)
    if job_id:
        query = query.filter(models.JobApplication.job_id == job_id)
    if status:
        query = query.filter(models.JobApplication.status == status)
    return query.order_by(desc(models.JobApplication.created_at)).offset(skip).limit(limit).all()


def get_job_application(db: Session, app_id: str) -> Optional[models.JobApplication]:
    return db.query(models.JobApplication).filter(models.JobApplication.id == app_id).first()


def update_job_application(
    db: Session,
    app_id: str,
    update: schemas.JobApplicationUpdate,
) -> Optional[models.JobApplication]:
    db_app = db.query(models.JobApplication).filter(models.JobApplication.id == app_id).first()
    if db_app:
        for key, value in update.model_dump(exclude_unset=True).items():
            setattr(db_app, key, value)
        db.commit()
        db.refresh(db_app)
    return db_app


def delete_job_application(db: Session, app_id: str) -> Optional[models.JobApplication]:
    db_app = db.query(models.JobApplication).filter(models.JobApplication.id == app_id).first()
    if db_app:
        db.delete(db_app)
        db.commit()
    return db_app
