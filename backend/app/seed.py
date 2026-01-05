from sqlalchemy.orm import Session
from . import models, schemas, crud

def init_db(db: Session):
    # Check if admin exists
    admin = crud.get_user_by_email(db, "admin@jdgkbsi.ph")
    if not admin:
        print("Creating default admin user...")
        crud.create_user(db, schemas.UserCreate(
            email="admin@jdgkbsi.ph",
            password="admin", # Change this in production!
            full_name="System Admin",
            role="admin"
        ))

    # Check if pages exist
    home_page = crud.get_pages(db, slug="home")
    if not home_page:
        print("Creating default Home page...")
        crud.create_page(db, schemas.PageCreate(
            title="Home",
            slug="home",
            status="published",
            page_type="system",
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
