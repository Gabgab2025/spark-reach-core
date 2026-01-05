from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, JSON, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, nullable=True)
    role = Column(String, default="user") # admin, user
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
    employment_type = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    requirements = Column(JSON, nullable=True)
    benefits = Column(JSON, nullable=True)
    salary_range = Column(String, nullable=True)
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
    role = Column(String) # ceo, cto, etc
    title = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)
    is_leadership = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Setting(Base):
    __tablename__ = "settings"

    key = Column(String, primary_key=True)
    value = Column(Text, nullable=True)
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
