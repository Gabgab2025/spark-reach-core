from sqlalchemy.orm import Session
from . import models, schemas, crud
from sqlalchemy.exc import IntegrityError
import os
import uuid


def init_db(db: Session):
    # Check if admin exists
    admin = crud.get_user_by_email(db, "admin@jdgkbsi.ph")
    if not admin:
        default_password = os.getenv("ADMIN_DEFAULT_PASSWORD", "JdgkAdmin2026!")
        print("Creating default admin user...")
        print("⚠️  SECURITY: Change the admin password after first login!")
        try:
            crud.create_user(db, schemas.UserCreate(
                email="admin@jdgkbsi.ph",
                password=default_password,
                full_name="System Admin",
                role="admin"
            ))
            db.commit()
        except IntegrityError:
            db.rollback()
            print("Admin user already created by another worker.")

    # Check if pages exist
    home_page = crud.get_pages(db, slug="home")
    if not home_page:
        print("Creating default Home page...")
        crud.create_page(db, schemas.PageCreate(
            title="Home",
            slug="home",
            status="published",
            page_type="system",
            meta_title="JDGK Business Solutions Inc. | Premier BPO in the Philippines",
            meta_description="JDGK Business Solutions Inc. is a premier BPO in the Philippines specializing in debt collection, call center services, and business process outsourcing.",
            meta_keywords="BPO Philippines, call center, debt collection, business process outsourcing, JDGK",
            content={
                "hero": {
                    "title": "Professional Call Center Solutions",
                    "subtitle": "Excellence in Service",
                    "description": "Transforming customer service with dedicated professionals and cutting-edge technology.",
                    "cta_text": "Get Started",
                    "cta_link": "/contact"
                },
                "services": {
                    "title": "Our Services",
                    "description": "Comprehensive BPO solutions tailored to your needs."
                }
            }
        ))

    about_page = crud.get_pages(db, slug="about")
    if not about_page:
        print("Creating default About page...")
        crud.create_page(db, schemas.PageCreate(
            title="About Us",
            slug="about",
            status="published",
            page_type="system",
            meta_title="About JDGK Business Solutions | Our Story & Mission",
            meta_description="Learn about JDGK Business Solutions Inc., our mission, vision, values, and the dedicated team behind our premier BPO services in the Philippines.",
            meta_keywords="about JDGK, BPO company Philippines, our mission, our team, business solutions",
            content={
                "hero": {
                    "title": "About JDGK Business Solutions",
                    "description": "Your trusted partner in business process outsourcing."
                },
                "mission": {
                    "title": "Our Mission",
                    "description": "To provide exceptional service that drives growth for our clients."
                },
                "vision": {
                    "title": "Our Vision",
                    "description": "To be the leading BPO provider in the Philippines."
                },
                "values": [
                    {"title": "Integrity", "description": "We act with honesty and transparency."},
                    {"title": "Excellence", "description": "We strive for perfection in everything we do."},
                    {"title": "Innovation", "description": "We embrace new technologies and methods."},
                    {"title": "Teamwork", "description": "We achieve more together."}
                ]
            }
        ))

    contact_page = crud.get_pages(db, slug="contact")
    if not contact_page:
        print("Creating default Contact page...")
        crud.create_page(db, schemas.PageCreate(
            title="Contact Us",
            slug="contact",
            status="published",
            page_type="system",
            meta_title="Contact JDGK Business Solutions | Get in Touch",
            meta_description="Contact JDGK Business Solutions Inc. for inquiries about our BPO services, debt collection, and call center solutions. We're here to help.",
            meta_keywords="contact JDGK, BPO inquiries, call center contact, Philippines BPO",
            content={
                "hero": {
                    "title": "Contact Us",
                    "description": "Get in touch with our team today."
                },
                "contact_info": {
                    "phone": {"main": "+63 2 1234 5678", "sales": "+63 2 1234 5679", "support": "+63 2 1234 5680"},
                    "email": {"general": "info@jdgkbsi.ph", "sales": "sales@jdgkbsi.ph", "support": "support@jdgkbsi.ph"},
                    "address": {"street": "123 Business Ave", "city": "Makati City", "hours": "Mon-Fri 9AM-6PM"}
                },
                "form": {
                    "title": "Send us a message",
                    "description": "We'll get back to you within 24 hours."
                }
            }
        ))

    # ── Seed additional system pages if missing ──────────────────────────────
    services_page = crud.get_pages(db, slug="services")
    if not services_page:
        print("Creating default Services page...")
        crud.create_page(db, schemas.PageCreate(
            title="Services",
            slug="services",
            status="published",
            page_type="system",
            meta_title="Our Services | JDGK Business Solutions",
            meta_description="Explore JDGK Business Solutions' comprehensive BPO services including call center operations, debt collection, bank collections, and consulting.",
            meta_keywords="BPO services, call center services, debt collection, bank collections, consulting, Philippines",
            content={
                "hero": {
                    "title": "Our Services",
                    "description": "Comprehensive BPO solutions tailored to your business needs."
                }
            }
        ))

    blog_page = crud.get_pages(db, slug="blog")
    if not blog_page:
        print("Creating default Blog page...")
        crud.create_page(db, schemas.PageCreate(
            title="Blog",
            slug="blog",
            status="published",
            page_type="system",
            meta_title="Blog | JDGK Business Solutions - Industry Insights",
            meta_description="Stay updated with the latest call center industry insights, tips, and best practices from JDGK Business Solutions experts.",
            meta_keywords="BPO blog, call center insights, industry news, business tips, JDGK blog",
            content={
                "hero": {
                    "title": "Our Blog",
                    "description": "Latest insights and updates from JDGK Business Solutions."
                }
            }
        ))

    careers_page = crud.get_pages(db, slug="careers")
    if not careers_page:
        print("Creating default Careers page...")
        crud.create_page(db, schemas.PageCreate(
            title="Careers",
            slug="careers",
            status="published",
            page_type="system",
            meta_title="Careers at JDGK Business Solutions | Join Our Team",
            meta_description="Join the JDGK Business Solutions team. Browse open positions in our call center, collections, and administrative departments.",
            meta_keywords="BPO careers, call center jobs, Philippines jobs, JDGK careers, hiring",
            content={
                "hero": {
                    "title": "Join Our Team",
                    "description": "Explore exciting career opportunities at JDGK Business Solutions."
                }
            }
        ))

    gallery_page = crud.get_pages(db, slug="gallery")
    if not gallery_page:
        print("Creating default Gallery page...")
        crud.create_page(db, schemas.PageCreate(
            title="Gallery",
            slug="gallery",
            status="published",
            page_type="system",
            meta_title="Gallery | JDGK Business Solutions - Our Workspace & Events",
            meta_description="Browse photos of JDGK Business Solutions' modern office, team events, equipment, and workspace in the Philippines.",
            meta_keywords="JDGK gallery, office photos, team events, BPO workspace, Philippines office",
            content={
                "hero": {
                    "title": "Our Gallery",
                    "description": "See our modern facilities and team in action."
                }
            }
        ))

    # ── Seed Leadership (from seed_leadership.py) ─────────────────────────────
    leaders = [
        {"name": "Donna Bucad Dealca", "title": "Chief Executive Officer / President", "role": "ceo", "bio": "Visionary leader driving strategic direction and business growth with integrity and innovation"},
        {"name": "Kristofferson Doctor Dealca", "title": "Vice President", "role": "manager", "bio": "Dynamic leader focused on operational excellence and business expansion"},
        {"name": "Jaime Doblado Bucad Jr.", "title": "Board of Directors", "role": "admin", "bio": "Expertise in business management and sustainable growth opportunities"},
        {"name": "Joan Bucad Landeza", "title": "Board of Directors", "role": "admin", "bio": "Supports corporate initiatives and business planning"},
        {"name": "Erwin Landeza", "title": "Board of Directors", "role": "admin", "bio": "Strengthens governance framework and promotes business sustainability"},
        {"name": "Randy Magauay Rodriguez", "title": "Board of Directors", "role": "admin", "bio": "Provides insights in corporate governance and strategic decision-making"},
        {"name": "Von Jaime Horlador Barro", "title": "Board of Directors", "role": "admin", "bio": "Shapes company policies and strategies aligned with JDGK mission"},
        {"name": "Geraldine Bucad Barro", "title": "Corporate Secretary", "role": "admin", "bio": "Oversees corporate compliance, documentation, and governance"},
        {"name": "Zandy Lyn Jesalva Laid", "title": "Admin Head", "role": "manager", "bio": "Manages administrative operations and daily business functions"},
        {"name": "Joshell Tuliao Rodriguez", "title": "Auditor", "role": "admin", "bio": "Ensures financial transparency, compliance, and accountability"}
    ]

    for i, l in enumerate(leaders):
        if not db.query(models.TeamMember).filter(models.TeamMember.name == l["name"]).first():
            print(f"Adding leadership member: {l['name']}")
            db.add(models.TeamMember(
                id=str(uuid.uuid4()),
                name=l["name"],
                title=l["title"],
                role=l["role"],
                bio=l["bio"],
                is_leadership=True,
                sort_order=i + 1
            ))

    # ── Seed Header/Footer Blocks (from seed_hf_blocks.py) ─────────────────────
    blocks = [
        schemas.ContentBlockCreate(
            name='header-branding',
            label='Header - Branding',
            block_type='text',
            status='published',
            sort_order=100,
            page_assignments=['header'],
            content={
                'company_name': 'JDGK BUSINESS SOLUTIONS INC.',
                'tagline': 'RESULTS DRIVEN, CLIENT FOCUSED',
                'phone': '02-8252-0584',
            },
        ),
        schemas.ContentBlockCreate(
            name='header-navigation',
            label='Header - Navigation Links',
            block_type='navigation',
            status='published',
            sort_order=101,
            page_assignments=['header'],
            content={
                'items': [
                    {'label': 'Home', 'href': '/'},
                    {'label': 'About', 'href': '/about'},
                    {'label': 'Services', 'href': '/services'},
                    {'label': 'Blog', 'href': '/blog'},
                    {'label': 'Careers', 'href': '/careers'},
                    {'label': 'Gallery', 'href': '/gallery'},
                    {'label': 'Contact', 'href': '/contact'},
                ],
            },
        ),
        schemas.ContentBlockCreate(
            name='footer-cta',
            label='Footer - Call to Action',
            block_type='cta',
            status='published',
            sort_order=200,
            page_assignments=['footer'],
            content={
                'title': 'Ready to Transform Your Operations?',
                'description': 'Partner with us for comprehensive business solutions including credit recovery, asset management, and professional virtual assistance services.',
                'primary_button_text': "Let's Work Together",
                'primary_button_link': '/contact',
                'secondary_button_text': 'View Our Services',
                'secondary_button_link': '/services',
            },
        ),
        schemas.ContentBlockCreate(
            name='footer-company',
            label='Footer - Company Info',
            block_type='text',
            status='published',
            sort_order=201,
            page_assignments=['footer'],
            content={
                'company_name': 'JDGK BUSINESS SOLUTIONS INC.',
                'tagline': 'RESULTS DRIVEN, CLIENT FOCUSED',
                'description': 'Empowering businesses through efficient and innovative solutions. We provide comprehensive business strategies including credit collection recovery, asset management, and virtual assistance services.',
            },
        ),
        schemas.ContentBlockCreate(
            name='footer-links',
            label='Footer - Quick Links',
            block_type='navigation',
            status='published',
            sort_order=202,
            page_assignments=['footer'],
            content={
                'items': [
                    {'label': 'Home', 'href': '/'},
                    {'label': 'About Us', 'href': '/about'},
                    {'label': 'Services', 'href': '/services'},
                    {'label': 'Blog', 'href': '/blog'},
                    {'label': 'Contact', 'href': '/contact'},
                ],
            },
        ),
        schemas.ContentBlockCreate(
            name='footer-bottom',
            label='Footer - Bottom Bar',
            block_type='text',
            status='published',
            sort_order=203,
            page_assignments=['footer'],
            content={
                'company_name': 'JDGK BUSINESS SOLUTIONS INC.',
                'registration_label': 'Registered with SEC',
                'registration_date': 'March 3, 2025',
            },
        ),
    ]

    for block in blocks:
        if not db.query(models.ContentBlock).filter(models.ContentBlock.name == block.name).first():
            print(f"Adding content block: {block.name}")
            crud.create_content_block(db=db, block=block)

    # ── Seed Services ─────────────────────────────────────────────────────────
    services_data = [
        {
            "title": "Credit Collection Recovery",
            "slug": "credit-collection-recovery",
            "description": "Comprehensive credit recovery services designed to optimize cash flow and minimize bad debts using proven, ethical strategies.",
            "category": "bank_collections",
            "icon": "Headphones",
            "features": ["Debt Collection & Negotiation", "Account Reconciliation", "Skip Tracing", "Legal Referrals"],
            "is_featured": True,
            "sort_order": 1,
        },
        {
            "title": "Repossession",
            "slug": "repossession",
            "description": "Professional and discreet asset recovery operations that ensure compliance and protect client interests.",
            "category": "bank_collections",
            "icon": "Shield",
            "features": ["Asset Tracing & Retrieval", "Secure Asset Storage", "Detailed Condition Reporting"],
            "is_featured": True,
            "sort_order": 2,
        },
        {
            "title": "Skip Tracing",
            "slug": "skip-tracing",
            "description": "Specialized investigative service for locating individuals or assets with precision and discretion. Used in collections, legal, finance, and real estate industries.",
            "category": "consulting",
            "icon": "Search",
            "features": ["Advanced Location Services", "Confidential Investigations", "Industry-Specific Solutions"],
            "is_featured": False,
            "sort_order": 3,
        },
        {
            "title": "Credit Investigation",
            "slug": "credit-investigation",
            "description": "Verification of credit and financial background for loan applications, collections, or client vetting.",
            "category": "consulting",
            "icon": "FileCheck",
            "features": ["Comprehensive Background Checks", "Financial History Analysis", "Risk Assessment"],
            "is_featured": False,
            "sort_order": 4,
        },
        {
            "title": "Tele Sales",
            "slug": "tele-sales",
            "description": "Outbound and inbound calling solutions for lead generation, follow-ups, and debt recovery support.",
            "category": "call_center",
            "icon": "Phone",
            "features": ["Lead Generation", "Customer Follow-ups", "Sales Campaign Management"],
            "is_featured": True,
            "sort_order": 5,
        },
        {
            "title": "Virtual Assistance",
            "slug": "virtual-assistance",
            "description": "Reliable and streamlined administrative and operational support to help clients focus on their core business priorities.",
            "category": "consulting",
            "icon": "Users",
            "features": ["Administrative Support", "Customer Service", "Data Entry", "Scheduling & Calendar Management", "Bookkeeping"],
            "is_featured": False,
            "sort_order": 6,
        },
    ]

    existing_slugs = {s.slug for s in db.query(models.Service.slug).all()}
    new_services = [svc for svc in services_data if svc["slug"] not in existing_slugs]
    if new_services:
        print(f"Seeding {len(new_services)} services (skipping {len(existing_slugs)} existing)...")
        for svc in new_services:
            db.add(models.Service(
                id=str(uuid.uuid4()),
                title=svc["title"],
                slug=svc["slug"],
                description=svc["description"],
                category=svc["category"],
                icon=svc["icon"],
                features=svc["features"],
                is_featured=svc["is_featured"],
                sort_order=svc["sort_order"],
            ))

    # ── Seed Home Hero Block ──────────────────────────────────────────────────
    if not db.query(models.ContentBlock).filter(models.ContentBlock.name == 'home-hero').first():
        print("Adding content block: home-hero")
        crud.create_content_block(db=db, block=schemas.ContentBlockCreate(
            name='home-hero',
            label='Home - Hero Section',
            block_type='hero',
            status='published',
            sort_order=1,
            page_assignments=['home'],
            content={
                'badge': 'Premier BPO Partner',
                'title': 'Professional Call Center Solutions',
                'subtitle': 'Excellence in Service',
                'description': 'Transforming customer service with dedicated professionals and cutting-edge technology. JDGK Business Solutions delivers results-driven BPO services.',
                'background_images': ['/hero/office-1.jpg', '/hero/office-2.jpg'],
                'cta_text': "Let's Work Together",
            },
        ))

    # ── Seed Home License Gallery Block ───────────────────────────────────────
    if not db.query(models.ContentBlock).filter(models.ContentBlock.name == 'home-licenses').first():
        print("Adding content block: home-licenses")
        crud.create_content_block(db=db, block=schemas.ContentBlockCreate(
            name='home-licenses',
            label='Home - Licenses & Certificates',
            block_type='gallery',
            status='published',
            sort_order=2,
            page_assignments=['home'],
            content={
                'title': 'Our Business License',
                'images': [
                    {'src': '/licenses/business-permits-wall.jpg', 'alt': 'Business Permits & Registrations', 'category': 'license'},
                    {'src': '/licenses/award-rookie.jpg', 'alt': 'Top Shining Rookie Award 2024', 'category': 'license'},
                    {'src': '/licenses/certificate-appreciation.jpg', 'alt': 'Certificate of Appreciation', 'category': 'license'},
                    {'src': '/licenses/circle-gold-franchisee.jpg', 'alt': 'Circle of Gold Franchisee', 'category': 'license'},
                ],
            },
        ))

    # ── Seed Gallery Items ──────────────────────────────────────────────────────
    gallery_items = [
        {"title": "Gallery Image 1", "image_url": "/gallery/A7C05991.jpg", "alt_text": "Gallery Image 1", "category": "office", "sort_order": 1},
        {"title": "Gallery Image 2", "image_url": "/gallery/A7C05996.jpg", "alt_text": "Gallery Image 2", "category": "office", "sort_order": 2},
        {"title": "Gallery Image 3", "image_url": "/gallery/A7C05835.jpg", "alt_text": "Gallery Image 3", "category": "office", "sort_order": 3},
        {"title": "Gallery Image 4", "image_url": "/gallery/A7C05841.jpg", "alt_text": "Gallery Image 4", "category": "office", "sort_order": 4},
        {"title": "Gallery Image 5", "image_url": "/gallery/A7C05833.jpg", "alt_text": "Gallery Image 5", "category": "office", "sort_order": 5},
        {"title": "Gallery Image 6", "image_url": "/gallery/A7C05836.jpg", "alt_text": "Gallery Image 6", "category": "office", "sort_order": 6},
        {"title": "Gallery Image 7", "image_url": "/gallery/A7C05840.jpg", "alt_text": "Gallery Image 7", "category": "office", "sort_order": 7},
        {"title": "Gallery Image 8", "image_url": "/gallery/A7C05998.jpg", "alt_text": "Gallery Image 8", "category": "office", "sort_order": 8},
        {"title": "Gallery Image 9", "image_url": "/gallery/A7C06098.jpg", "alt_text": "Gallery Image 9", "category": "office", "sort_order": 9},
        {"title": "Gallery Image 10", "image_url": "/gallery/A7C06104.jpg", "alt_text": "Gallery Image 10", "category": "office", "sort_order": 10},
        {"title": "Gallery Image 11", "image_url": "/gallery/A7C06105.jpg", "alt_text": "Gallery Image 11", "category": "office", "sort_order": 11},
        {"title": "Gallery Image 12", "image_url": "/gallery/A7C05868.jpg", "alt_text": "Gallery Image 12", "category": "events", "sort_order": 12},
        {"title": "Gallery Image 13", "image_url": "/gallery/A7C05923.jpg", "alt_text": "Gallery Image 13", "category": "events", "sort_order": 13},
        {"title": "Gallery Image 14", "image_url": "/gallery/A7C05934.jpg", "alt_text": "Gallery Image 14", "category": "events", "sort_order": 14},
        {"title": "Gallery Image 15", "image_url": "/gallery/A7C05963.jpg", "alt_text": "Gallery Image 15", "category": "events", "sort_order": 15},
        {"title": "Gallery Image 16", "image_url": "/gallery/A7C05992.jpg", "alt_text": "Gallery Image 16", "category": "events", "sort_order": 16},
        {"title": "Gallery Image 17", "image_url": "/gallery/A7C05994.jpg", "alt_text": "Gallery Image 17", "category": "events", "sort_order": 17},
        {"title": "Call Center Agent", "image_url": "/gallery/call-center-agent.jpg", "alt_text": "Call Center Agent", "category": "team", "sort_order": 18},
        {"title": "Modern Office Space", "image_url": "/gallery/A7C06108.jpg", "alt_text": "Modern Office Space", "category": "office", "sort_order": 19},
        {"title": "Telecommunications Equipment 1", "image_url": "/gallery/equipment-1.jpg", "alt_text": "Telecommunications Equipment", "category": "equipment", "sort_order": 20},
        {"title": "Telecommunications Equipment 2", "image_url": "/gallery/equipment-2.jpg", "alt_text": "Telecommunications Equipment", "category": "equipment", "sort_order": 21},
        {"title": "Telecommunications Equipment 3", "image_url": "/gallery/equipment-3.jpg", "alt_text": "Telecommunications Equipment", "category": "equipment", "sort_order": 22},
        {"title": "SMS Blast System Interface", "image_url": "/gallery/sms-blast-system.jpg", "alt_text": "SMS Blast System Interface", "category": "equipment", "sort_order": 23},
        {"title": "VICIphone Web Phone", "image_url": "/gallery/vici-phone.jpg", "alt_text": "VICIphone Web Phone Interface", "category": "equipment", "sort_order": 24},
        {"title": "VICIdial Admin Dashboard", "image_url": "/gallery/vici-admin.jpg", "alt_text": "VICIdial Administration Dashboard", "category": "equipment", "sort_order": 25},
        {"title": "EasyPhone GoIP32 System", "image_url": "/gallery/easyphone-dashboard.jpg", "alt_text": "EasyPhone GoIP32 System", "category": "equipment", "sort_order": 26},
        {"title": "VICIdial Script Interface", "image_url": "/gallery/vici-script.jpg", "alt_text": "VICIdial Script Interface", "category": "equipment", "sort_order": 27},
        {"title": "VICIdial Campaign Login", "image_url": "/gallery/vici-login.jpg", "alt_text": "VICIdial Campaign Login", "category": "equipment", "sort_order": 28},
    ]

    existing_gallery_count = db.query(models.GalleryItem).count()
    if existing_gallery_count == 0:
        print(f"Seeding {len(gallery_items)} gallery items...")
        for item in gallery_items:
            db.add(models.GalleryItem(
                id=str(uuid.uuid4()),
                title=item["title"],
                image_url=item["image_url"],
                alt_text=item["alt_text"],
                category=item["category"],
                sort_order=item["sort_order"],
                status="published",
                is_featured=False,
            ))

    db.commit()
