"""Seed header and footer content blocks."""
from app.database import SessionLocal
from app import schemas, crud

db = SessionLocal()

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

count = 0
for block in blocks:
    crud.create_content_block(db=db, block=block)
    count += 1
    print('  + ' + block.name)

print('Seeded ' + str(count) + ' header/footer blocks.')
db.close()
