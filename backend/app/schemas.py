from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Any, Dict
from datetime import datetime

# --- Base Schemas ---

class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    role: Optional[str] = "user"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class PageBase(BaseModel):
    title: str
    slug: str
    content: Optional[Dict[str, Any]] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    featured_image: Optional[str] = None
    status: Optional[str] = "draft"
    page_type: Optional[str] = "custom"

class PageCreate(PageBase):
    pass

class PageUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[Dict[str, Any]] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    featured_image: Optional[str] = None
    status: Optional[str] = None
    page_type: Optional[str] = None

class Page(PageBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class ServiceBase(BaseModel):
    title: str
    slug: str
    description: Optional[str] = None
    category: str
    features: Optional[List[str]] = None
    pricing_info: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: Optional[int] = 0
    is_featured: Optional[bool] = False

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(ServiceBase):
    title: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    # ... allow partial updates for all fields ideally, but for now this is enough

class Service(ServiceBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class BlogPostBase(BaseModel):
    title: str
    slug: str
    excerpt: Optional[str] = None
    content: Optional[str] = None
    featured_image: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = "draft"
    author_id: Optional[str] = None
    view_count: Optional[int] = 0
    published_at: Optional[datetime] = None

class BlogPostCreate(BlogPostBase):
    pass

class BlogPost(BlogPostBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class JobListingBase(BaseModel):
    title: str
    department: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = None
    benefits: Optional[List[str]] = None
    salary_range: Optional[str] = None
    status: Optional[str] = "open"
    applications_count: Optional[int] = 0
    expires_at: Optional[datetime] = None

class JobListingCreate(JobListingBase):
    pass

class JobListing(JobListingBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class TestimonialBase(BaseModel):
    client_name: str
    client_title: Optional[str] = None
    company_name: Optional[str] = None
    content: str
    rating: Optional[int] = 5
    avatar_url: Optional[str] = None
    is_featured: Optional[bool] = False
    sort_order: Optional[int] = 0

class TestimonialCreate(TestimonialBase):
    pass

class Testimonial(TestimonialBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class TeamMemberBase(BaseModel):
    name: str
    role: str
    title: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    sort_order: Optional[int] = 0
    is_leadership: Optional[bool] = False

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMember(TeamMemberBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class SettingBase(BaseModel):
    key: str
    value: Optional[str] = None

class SettingCreate(SettingBase):
    pass

class Setting(SettingBase):
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class AnalyticsDataBase(BaseModel):
    metric_name: str
    metric_value: int
    category: Optional[str] = None
    metadata_json: Optional[Dict[str, Any]] = None

class AnalyticsData(AnalyticsDataBase):
    id: str
    metric_date: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Bulk update schema for settings
class SettingsBulkUpdate(BaseModel):
    settings: List[SettingBase]

class ContactCreate(BaseModel):
    name: str
    email: str
    company: Optional[str] = None
    phone: Optional[str] = None
    service: Optional[str] = None
    message: str
