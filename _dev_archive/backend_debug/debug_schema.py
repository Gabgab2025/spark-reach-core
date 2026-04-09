from app.database import SessionLocal, engine
from app import models
from sqlalchemy import inspect, text

def check_schema():
    print("Checking DB Schema...")
    inspector = inspect(engine)
    
    # Check settings table
    if not inspector.has_table("settings"):
        print("ERROR: Table 'settings' does not exist!")
        return

    columns = [c['name'] for c in inspector.get_columns("settings")]
    print(f"Columns in 'settings': {columns}")

    required = ['created_at', 'updated_at', 'value', 'key']
    missing = [c for c in required if c not in columns]
    
    if missing:
        print(f"CRITICAL: Missing columns in 'settings': {missing}")
        # Attempt to patch
        with engine.connect() as conn:
            for col in missing:
                print(f"Attempting to add missing column: {col}")
                try:
                    # simplistic migration
                    if col in ['created_at', 'updated_at']:
                        conn.execute(text(f"ALTER TABLE settings ADD COLUMN {col} TIMESTAMP WITH TIME ZONE DEFAULT NOW()"))
                    conn.commit()
                    print(f"Added {col} successfully.")
                except Exception as e:
                    print(f"Failed to add {col}: {e}")
    else:
        print("Schema looks correct.")

    # Try Query
    db = SessionLocal()
    try:
        print("Attempting full query...")
        settings = db.query(models.Setting).all()
        print(f"Query successful. Found {len(settings)} settings.")
    except Exception as e:
        print(f"Query FAILED: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_schema()
