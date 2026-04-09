import sys
import os
import uuid

# Add the current directory to sys.path so we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app import models

def seed_leadership():
    db = SessionLocal()
    
    # Data from About.tsx FALLBACK_LEADERSHIP
    leaders = [
        { 
            "name": "Donna Bucad Dealca", 
            "title": "Chief Executive Officer / President", 
            "role": "ceo",
            "bio": "Visionary leader driving strategic direction and business growth with integrity and innovation" 
        },
        { 
            "name": "Kristofferson Doctor Dealca", 
            "title": "Vice President", 
            "role": "manager", # specific role enum not fully known, defaulting to manager
            "bio": "Dynamic leader focused on operational excellence and business expansion" 
        },
        { 
            "name": "Jaime Doblado Bucad Jr.", 
            "title": "Board of Directors", 
            "role": "admin",
            "bio": "Expertise in business management and sustainable growth opportunities" 
        },
        { 
            "name": "Joan Bucad Landeza", 
            "title": "Board of Directors", 
            "role": "admin",
            "bio": "Supports corporate initiatives and business planning" 
        },
        { 
            "name": "Erwin Landeza", 
            "title": "Board of Directors", 
            "role": "admin",
            "bio": "Strengthens governance framework and promotes business sustainability" 
        },
        { 
            "name": "Randy Magauay Rodriguez", 
            "title": "Board of Directors", 
            "role": "admin",
            "bio": "Provides insights in corporate governance and strategic decision-making" 
        },
        { 
            "name": "Von Jaime Horlador Barro", 
            "title": "Board of Directors", 
            "role": "admin",
            "bio": "Shapes company policies and strategies aligned with JDGK mission" 
        },
        { 
            "name": "Geraldine Bucad Barro", 
            "title": "Corporate Secretary", 
            "role": "admin",
            "bio": "Oversees corporate compliance, documentation, and governance" 
        },
        { 
            "name": "Zandy Lyn Jesalva Laid", 
            "title": "Admin Head", 
            "role": "manager",
            "bio": "Manages administrative operations and daily business functions" 
        },
        { 
            "name": "Joshell Tuliao Rodriguez", 
            "title": "Auditor", 
            "role": "admin",
            "bio": "Ensures financial transparency, compliance, and accountability" 
        }
    ]

    print(f"Checking {len(leaders)} leadership members...")
    added_count = 0

    for i, l in enumerate(leaders):
        # Check if exists by name
        exists = db.query(models.TeamMember).filter(models.TeamMember.name == l["name"]).first()
        if not exists:
            print(f"Adding: {l['name']}")
            tm = models.TeamMember(
                id=str(uuid.uuid4()),
                name=l["name"],
                title=l["title"],
                role=l["role"],
                bio=l["bio"],
                is_leadership=True,
                sort_order=i + 1,
                avatar_url=None # User will upload manually
            )
            db.add(tm)
            added_count += 1
        else:
            print(f"Skipping (already exists): {l['name']}")
            # Optional: Update is_leadership if it was false?
            if not exists.is_leadership:
                print(f"  -> Updating {l['name']} to be is_leadership=True")
                exists.is_leadership = True
                added_count += 1 # Treat as 'added' or 'modified'

    if added_count > 0:
        db.commit()
    
    print(f"Done. Added/Updated {added_count} members.")
    db.close()

if __name__ == "__main__":
    seed_leadership()
