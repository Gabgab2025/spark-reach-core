from pydantic import BaseModel, ConfigDict, EmailStr, field_validator
from typing import List, Literal, Optional, Any, Dict
from datetime import datetime
import re


# ── Shared sanitization helpers ──────────────────────────────────────────────

_SCRIPT_RE = re.compile(r'<script|javascript:|on\w+\s*=', re.IGNORECASE)
_HTML_TAG_RE = re.compile(r'<[^>]*>')


def _strip_injection(value: str | None, max_len: int = 0) -> str | None:
    """Strip HTML tags, script patterns, and optionally truncate."""
    if value is None:
        return None
    value = _HTML_TAG_RE.sub('', value)           # strip all HTML tags
    value = _SCRIPT_RE.sub('', value)             # remove residual patterns
    value = value.replace('\x00', '')             # remove null bytes
    if max_len and len(value) > max_len:
        value = value[:max_len]
    return value.strip()


# --- Base Schemas ---

class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: Optional[str] = "user"

    @field_validator("role", mode="before")
    @classmethod
    def normalize_role(cls, v: Optional[str]) -> str:
        """Always store and return role in lowercase to prevent case-mismatch bugs."""
        return (v or "user").lower()

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: Optional[str] = None


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
    meta_keywords: Optional[str] = None
    canonical_url: Optional[str] = None
    og_image: Optional[str] = None
    featured_image: Optional[str] = None
    status: Literal["draft", "published", "archived"] = "draft"
    page_type: Literal["system", "custom"] = "custom"

class PageCreate(PageBase):
    pass

class PageUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[Dict[str, Any]] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    canonical_url: Optional[str] = None
    og_image: Optional[str] = None
    featured_image: Optional[str] = None
    status: Optional[Literal["draft", "published", "archived"]] = None
    page_type: Optional[Literal["system", "custom"]] = None

class Page(PageBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class ServiceBase(BaseModel):
    title: str
    slug: str
    description: Optional[str] = None
    category: str = "consulting"
    features: Optional[List[str]] = None
    pricing_info: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: Optional[int] = 0
    is_featured: Optional[bool] = False

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    features: Optional[List[str]] = None
    pricing_info: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: Optional[int] = None
    is_featured: Optional[bool] = None

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
    meta_keywords: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Literal["draft", "published", "archived"] = "draft"
    author_id: Optional[str] = None
    view_count: Optional[int] = 0
    published_at: Optional[datetime] = None

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    featured_image: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[Literal["draft", "published", "archived"]] = None
    author_id: Optional[str] = None
    view_count: Optional[int] = None
    published_at: Optional[datetime] = None

class BlogPost(BlogPostBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class JobListingBase(BaseModel):
    title: str
    department: Optional[str] = None
    location: Optional[str] = None
    address: Optional[str] = None
    employment_type: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = None
    benefits: Optional[List[str]] = None
    salary_range: Optional[str] = None
    salary_type: Optional[Literal["fixed_monthly", "commission_based"]] = None
    status: Literal["open", "closed", "on_hold"] = "open"
    applications_count: Optional[int] = 0
    expires_at: Optional[datetime] = None

class JobListingCreate(JobListingBase):
    pass

class JobListingUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    address: Optional[str] = None
    employment_type: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = None
    benefits: Optional[List[str]] = None
    salary_range: Optional[str] = None
    salary_type: Optional[Literal["fixed_monthly", "commission_based"]] = None
    status: Optional[Literal["open", "closed", "on_hold"]] = None
    applications_count: Optional[int] = None
    expires_at: Optional[datetime] = None

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

class TestimonialUpdate(BaseModel):
    client_name: Optional[str] = None
    client_title: Optional[str] = None
    company_name: Optional[str] = None
    content: Optional[str] = None
    rating: Optional[int] = None
    avatar_url: Optional[str] = None
    is_featured: Optional[bool] = None
    sort_order: Optional[int] = None

class Testimonial(TestimonialBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class TeamMemberBase(BaseModel):
    name: str
    slug: Optional[str] = None
    role: str
    title: Optional[str] = None
    tagline: Optional[str] = None
    bio: Optional[str] = None
    quote: Optional[str] = None
    expertise: Optional[list[str]] = None
    achievements: Optional[list[str]] = None
    avatar_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    website_url: Optional[str] = None
    github_url: Optional[str] = None
    twitter_url: Optional[str] = None
    sort_order: Optional[int] = 0
    is_leadership: Optional[bool] = False

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    role: Optional[str] = None
    title: Optional[str] = None
    tagline: Optional[str] = None
    bio: Optional[str] = None
    quote: Optional[str] = None
    expertise: Optional[list[str]] = None
    achievements: Optional[list[str]] = None
    avatar_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    website_url: Optional[str] = None
    github_url: Optional[str] = None
    twitter_url: Optional[str] = None
    sort_order: Optional[int] = None
    is_leadership: Optional[bool] = None

class TeamMember(TeamMemberBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class SettingBase(BaseModel):
    key: str
    value: Optional[str] = None

# --- Gallery Items ---

class GalleryItemBase(BaseModel):
    title: str
    image_url: str
    alt_text: Optional[str] = None
    caption: Optional[str] = None
    category: Optional[str] = None
    sort_order: Optional[int] = 0
    is_featured: Optional[bool] = False
    status: Literal["draft", "published", "archived"] = "published"

class GalleryItemCreate(GalleryItemBase):
    pass

class GalleryItemUpdate(BaseModel):
    title: Optional[str] = None
    image_url: Optional[str] = None
    alt_text: Optional[str] = None
    caption: Optional[str] = None
    category: Optional[str] = None
    sort_order: Optional[int] = None
    is_featured: Optional[bool] = None
    status: Optional[Literal["draft", "published", "archived"]] = None

class GalleryItem(GalleryItemBase):
    id: str
    slug: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

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

# --- Content Blocks ---

class ContentBlockBase(BaseModel):
    name: str
    label: str
    block_type: Optional[str] = "custom"
    content: Optional[Dict[str, Any]] = None
    status: Literal["draft", "published", "archived"] = "draft"
    sort_order: Optional[int] = 0
    page_assignments: Optional[List[str]] = None

class ContentBlockCreate(ContentBlockBase):
    pass

class ContentBlockUpdate(BaseModel):
    name: Optional[str] = None
    label: Optional[str] = None
    block_type: Optional[str] = None
    content: Optional[Dict[str, Any]] = None
    status: Optional[Literal["draft", "published", "archived"]] = None
    sort_order: Optional[int] = None
    page_assignments: Optional[List[str]] = None

class ContentBlock(ContentBlockBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# Bulk update schema for settings
class SettingsBulkUpdate(BaseModel):
    settings: List[SettingBase]

class ContactCreate(BaseModel):
    full_name: str
    contact_number: Optional[str] = None
    email: EmailStr
    message: str
    honeypot: Optional[str] = ""  # Anti-spam: must be empty on legitimate submissions

    @field_validator("full_name")
    @classmethod
    def sanitize_full_name(cls, v: str) -> str:
        v = _strip_injection(v, max_len=100)
        if not v:
            raise ValueError("Full name is required")
        if not re.match(r"^[a-zA-Z\s\-'.]+$", v):
            raise ValueError("Full name can only contain letters, spaces, hyphens, apostrophes, and periods")
        return v

    @field_validator("contact_number")
    @classmethod
    def sanitize_contact_number(cls, v: str | None) -> str | None:
        if v is None:
            return None
        v = _strip_injection(v, max_len=20)
        if v and not re.match(r"^[\d\s\-+().]+$", v):
            raise ValueError("Contact number can only contain numbers and basic punctuation")
        return v

    @field_validator("message")
    @classmethod
    def sanitize_message(cls, v: str) -> str:
        v = _strip_injection(v, max_len=2000)
        if not v or len(v) < 10:
            raise ValueError("Message must be at least 10 characters")
        return v

class ContactMessageResponse(BaseModel):
    id: str
    full_name: str
    contact_number: Optional[str] = None
    email: str
    message: str
    is_read: bool
    submitted_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Auth Schemas ---

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return v

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: User

class SessionResponse(BaseModel):
    session: Optional[TokenResponse] = None

class RoleUpdate(BaseModel):
    role: str


# --- Job Applications ---

class JobApplicationCreate(BaseModel):
    job_id: Optional[str] = None
    suffix: Optional[str] = None
    first_name: str
    last_name: str
    mobile: str
    alternate_mobile: Optional[str] = None
    email: EmailStr
    address: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    highest_graduation: Optional[str] = None
    gender: Optional[str] = None
    languages: Optional[List[str]] = None
    job_alert: Optional[bool] = False
    previous_employment: Optional[List[Dict[str, Any]]] = None
    certifications: Optional[List[Dict[str, Any]]] = None
    willing_to_relocate: Optional[str] = None
    preferred_locations: Optional[str] = None
    open_to_remote: Optional[str] = None
    travel_percentage: Optional[str] = None
    cover_letter: Optional[str] = None
    expected_salary: Optional[str] = None
    notice_period: Optional[str] = None
    referral: Optional[str] = None
    how_did_you_hear: Optional[str] = None

    @field_validator("first_name", "last_name")
    @classmethod
    def sanitize_name(cls, v: str) -> str:
        v = _strip_injection(v, max_len=100)
        if not v:
            raise ValueError("Name is required")
        return v

    @field_validator("mobile")
    @classmethod
    def sanitize_mobile(cls, v: str) -> str:
        v = _strip_injection(v, max_len=20)
        if not v or not re.match(r"^[\d\s\-+().]+$", v):
            raise ValueError("Mobile must contain only numbers and basic punctuation")
        return v

    @field_validator("alternate_mobile")
    @classmethod
    def sanitize_alt_mobile(cls, v: str | None) -> str | None:
        if v is None:
            return None
        v = _strip_injection(v, max_len=20)
        if v and not re.match(r"^[\d\s\-+().]+$", v):
            raise ValueError("Alternate mobile must contain only numbers and basic punctuation")
        return v or None

    @field_validator("address", "state", "city", "country", "suffix",
                     "highest_graduation", "expected_salary", "notice_period",
                     "referral", "how_did_you_hear", "willing_to_relocate",
                     "preferred_locations", "open_to_remote", "travel_percentage")
    @classmethod
    def sanitize_text_field(cls, v: str | None) -> str | None:
        if v is None:
            return None
        return _strip_injection(v, max_len=300) or None

    @field_validator("cover_letter")
    @classmethod
    def sanitize_cover_letter(cls, v: str | None) -> str | None:
        if v is None:
            return None
        return _strip_injection(v, max_len=5000) or None


class JobApplicationUpdate(BaseModel):
    status: Optional[Literal["new", "reviewing", "shortlisted", "rejected", "hired"]] = None
    notes: Optional[str] = None

    @field_validator("notes")
    @classmethod
    def sanitize_notes(cls, v: str | None) -> str | None:
        if v is None:
            return None
        return _strip_injection(v, max_len=2000) or None


class JobApplicationResponse(JobApplicationCreate):
    id: str
    resume_url: Optional[str] = None
    status: str = "new"
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
