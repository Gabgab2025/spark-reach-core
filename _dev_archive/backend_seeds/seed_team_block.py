import json
import uuid
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Database connection
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/jdgk_cms"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_team_block():
    db = SessionLocal()
    try:
        # Check if block already exists
        result = db.execute(text("SELECT id FROM content_blocks WHERE name = 'about-leadership'"))
        if result.fetchone():
            print("Block 'about-leadership' already exists. Skipping.")
            return

        print("Seeding 'about-leadership' block...")

        # Data from FALLBACK_LEADERSHIP in About.tsx
        members = [
            { 
                "name": "Donna Bucad Dealca", 
                "role": "Chief Executive Officer / President", 
                "bio": "Visionary leader driving strategic direction and business growth with integrity and innovation", 
                "avatar": "" 
            },
            { 
                "name": "Kristofferson Doctor Dealca", 
                "role": "Vice President", 
                "bio": "Dynamic leader focused on operational excellence and business expansion", 
                "avatar": "" 
            },
            { 
                "name": "Jaime Doblado Bucad Jr.", 
                "role": "Board of Directors", 
                "bio": "Expertise in business management and sustainable growth opportunities", 
                "avatar": "" 
            },
            { 
                "name": "Joan Bucad Landeza", 
                "role": "Board of Directors", 
                "bio": "Supports corporate initiatives and business planning", 
                "avatar": "" 
            },
            { 
                "name": "Erwin Landeza", 
                "role": "Board of Directors", 
                "bio": "Strengthens governance framework and promotes business sustainability", 
                "avatar": "" 
            },
            { 
                "name": "Randy Magauay Rodriguez", 
                "role": "Board of Directors", 
                "bio": "Provides insights in corporate governance and strategic decision-making", 
                "avatar": "" 
            },
            { 
                "name": "Von Jaime Horlador Barro", 
                "role": "Board of Directors", 
                "bio": "Shapes company policies and strategies aligned with JDGK mission", 
                "avatar": "" 
            },
            { 
                "name": "Geraldine Bucad Barro", 
                "role": "Corporate Secretary", 
                "bio": "Oversees corporate compliance, documentation, and governance", 
                "avatar": "" 
            },
            { 
                "name": "Zandy Lyn Jesalva Laid", 
                "role": "Admin Head", 
                "bio": "Manages administrative operations and daily business functions", 
                "avatar": "" 
            },
            { 
                "name": "Joshell Tuliao Rodriguez", 
                "role": "Auditor", 
                "bio": "Ensures financial transparency, compliance, and accountability", 
                "avatar": "" 
            }
        ]

        content = {
            "title": "Leadership Team",
            "members": members
        }

        # Insert the block
        # Note: page_assignments is JSONB, so we pass it as a list that SQLAlchemy/psycopg2 will adapt
        sql = text("""
            INSERT INTO content_blocks (id, name, label, block_type, content, page_assignments, status, created_at, updated_at)
            VALUES (:id, :name, :label, :block_type, :content, :page_assignments, 'published', NOW(), NOW())
        """)
        
        db.execute(sql, {
            "id": str(uuid.uuid4()),
            "name": "about-leadership",
            "label": "Leadership Team",
            "block_type": "team",
            "content": json.dumps(content),
            "page_assignments": json.dumps(["about"]) 
        })
        
        db.commit()
        print("Successfully created 'about-leadership' block.")

    except Exception as e:
        print(f"Error seeding block: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_team_block()
