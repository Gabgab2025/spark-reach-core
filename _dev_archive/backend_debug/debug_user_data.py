from app.database import SessionLocal
from app import models

def check_user_data():
    print("Checking User Data...")
    db = SessionLocal()
    try:
        user = db.query(models.User).filter(models.User.email == "admin@jdgkbsi.ph").first()
        if user:
            print(f"User Found: {user.id}")
            print(f"Role: {user.role}")
            print(f"Created At: {user.created_at}")
            print(f"Updated At: {user.updated_at}")
            
            if user.created_at is None:
                print("CRITICAL: created_at is None! This will cause schema validation errors.")
                # Fix it
                from sqlalchemy import func
                user.created_at = func.now()
                db.commit()
                print("Fixed: Set created_at to now()")
        else:
            print("User admin@jdgkbsi.ph NOT FOUND.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_user_data()
