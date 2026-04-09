from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, JSON, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

# Login security constants
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 10

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    role = Column(String, default="user") # admin, user
    failed_login_attempts = Column(Integer, default=0, nullable=False, server_default="0")
    locked_until = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Page(Base):
    __tablename__ = "pages"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String)
    slug = Column(String, unique=True, index=True)
    content = Column(JSON, nullable=True)
    meta_title = Column(String, nullable=True)
    meta_description = Column(String, nullable=True)
    meta_keywords = Column(String, nullable=True)
    canonical_url = Column(String, nullable=True)
    og_image = Column(String, nullable=True)
    featured_image = Column(String, nullable=True)
    status = Column(String, default="draft") # draft, published, archived
    page_type = Column(String, default="custom") # system, custom
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Service(Base):
    __tablename__ = "services"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String)
    slug = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)
    category = Column(String) # call_center, bank_collections, consulting
    features = Column(JSON, nullable=True) # Array of strings
    pricing_info = Column(String, nullable=True)
    icon = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String)
    slug = Column(String, unique=True, index=True)
    excerpt = Column(Text, nullable=True)
    content = Column(Text, nullable=True) # HTML or Markdown
    featured_image = Column(String, nullable=True)
    meta_title = Column(String, nullable=True)
    meta_description = Column(String, nullable=True)
    meta_keywords = Column(String, nullable=True)
    tags = Column(JSON, nullable=True) # Array of strings
    status = Column(String, default="draft")
    author_id = Column(String, ForeignKey("users.id"), nullable=True)
    view_count = Column(Integer, default=0)
    published_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    author = relationship("User")

class JobListing(Base):
    __tablename__ = "job_listings"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String)
    department = Column(String, nullable=True)
    location = Column(String, nullable=True)
    address = Column(String, nullable=True)
    employment_type = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    requirements = Column(JSON, nullable=True)
    benefits = Column(JSON, nullable=True)
    salary_range = Column(String, nullable=True)
    salary_type = Column(String, nullable=True)  # fixed_monthly, commission_based
    status = Column(String, default="open") # open, closed, on_hold
    applications_count = Column(Integer, default=0)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(String, primary_key=True, default=generate_uuid)
    client_name = Column(String)
    client_title = Column(String, nullable=True)
    company_name = Column(String, nullable=True)
    content = Column(Text)
    rating = Column(Integer, default=5)
    avatar_url = Column(String, nullable=True)
    is_featured = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String)
    slug = Column(String, nullable=True, unique=True)
    role = Column(String) # ceo, cto, etc
    title = Column(String, nullable=True)
    tagline = Column(String, nullable=True)  # Short one-liner under name
    bio = Column(Text, nullable=True)
    quote = Column(Text, nullable=True)  # Personal quote
    expertise = Column(JSON, nullable=True)  # Array of strings
    achievements = Column(JSON, nullable=True)  # Array of strings
    avatar_url = Column(String, nullable=True)
    cover_image_url = Column(String, nullable=True)  # Portfolio hero background
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    website_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    twitter_url = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)
    is_leadership = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class GalleryItem(Base):
    __tablename__ = "gallery_items"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String)
    slug = Column(String, unique=True, index=True, nullable=True)
    image_url = Column(String)
    alt_text = Column(String, nullable=True)
    caption = Column(Text, nullable=True)
    category = Column(String, nullable=True)  # e.g. office, events, team, equipment
    sort_order = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    status = Column(String, default="published")  # draft, published, archived
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Setting(Base):
    __tablename__ = "settings"

    key = Column(String, primary_key=True)
    value = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ContentBlock(Base):
    __tablename__ = "content_blocks"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, unique=True, index=True)  # unique slug e.g. 'hero-about'
    label = Column(String)  # display name e.g. 'About Hero'
    block_type = Column(String, default="custom")  # hero, text, gallery, cta, form, stats, custom
    content = Column(JSON, nullable=True)  # block payload
    status = Column(String, default="draft")  # draft, published, archived
    sort_order = Column(Integer, default=0)
    page_assignments = Column(JSONB, nullable=True)  # ["home", "about"] — pages this block is assigned to
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class AnalyticsData(Base):
    __tablename__ = "analytics_data"

    id = Column(String, primary_key=True, default=generate_uuid)
    metric_name = Column(String)
    metric_value = Column(Integer) # Or Float if needed, but frontend seems to use numbers
    metric_date = Column(DateTime(timezone=True), server_default=func.now())
    category = Column(String, nullable=True)
    metadata_json = Column(JSON, nullable=True) # 'metadata' is reserved in some contexts
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(String, primary_key=True, default=generate_uuid)
    job_id = Column(String, ForeignKey("job_listings.id", ondelete="SET NULL"), nullable=True, index=True)

    # Applicant profile
    suffix = Column(String, nullable=True)
    first_name = Column(String)
    last_name = Column(String)
    mobile = Column(String)
    alternate_mobile = Column(String, nullable=True)
    email = Column(String)
    address = Column(String, nullable=True)
    state = Column(String, nullable=True)
    city = Column(String, nullable=True)
    country = Column(String, nullable=True)
    highest_graduation = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    languages = Column(JSON, nullable=True)          # list[str]
    job_alert = Column(Boolean, default=False)

    # Rich structured data stored as JSON
    previous_employment = Column(JSON, nullable=True)  # list of employment objects
    certifications = Column(JSON, nullable=True)        # list of cert objects

    # Geographic mobility
    willing_to_relocate = Column(String, nullable=True)
    preferred_locations = Column(String, nullable=True)
    open_to_remote = Column(String, nullable=True)
    travel_percentage = Column(String, nullable=True)

    # Job-specific
    cover_letter = Column(Text, nullable=True)
    expected_salary = Column(String, nullable=True)
    notice_period = Column(String, nullable=True)
    referral = Column(String, nullable=True)
    how_did_you_hear = Column(String, nullable=True)

    # File
    resume_url = Column(String, nullable=True)          # path relative to /uploads

    # Workflow
    status = Column(String, default="new")  # new, reviewing, shortlisted, rejected, hired
    notes = Column(Text, nullable=True)     # admin notes

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    job = relationship("JobListing")


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(String, primary_key=True, default=generate_uuid)
    full_name = Column(String, nullable=False)
    contact_number = Column(String, nullable=True)
    email = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
