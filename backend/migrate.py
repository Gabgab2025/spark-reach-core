#!/usr/bin/env python3
"""
migrate.py — Runs schema migrations before uvicorn starts.
Handles column renames, missing columns, and missing tables gracefully.
Handles case-sensitive (quoted) column names for legacy schemas.
"""
import os
import sys
from sqlalchemy import create_engine, text

DATABASE_URL = os.environ.get("DATABASE_URL", "")

# SQLAlchemy requires postgresql:// not postgres://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

if not DATABASE_URL:
    print("❌ ERROR: DATABASE_URL not set!")
    sys.exit(1)

engine = create_engine(DATABASE_URL)


def column_exists(conn, table: str, column: str) -> bool:
    # Use exact match for column name (case sensitive)
    result = conn.execute(text(
        "SELECT 1 FROM information_schema.columns "
        "WHERE table_name = :t AND column_name = :c"
    ), {"t": table, "c": column})
    return result.first() is not None


def table_exists(conn, table: str) -> bool:
    result = conn.execute(text(
        "SELECT 1 FROM information_schema.tables WHERE table_name = :t"
    ), {"t": table})
    return result.first() is not None


def get_column_type(conn, table: str, column: str) -> str:
    result = conn.execute(text(
        "SELECT data_type FROM information_schema.columns "
        "WHERE table_name = :t AND column_name = :c"
    ), {"t": table, "c": column})
    row = result.first()
    return row[0] if row else None


def add_column_if_missing(conn, table: str, column: str, col_type: str, default: str = None):
    if not column_exists(conn, table, column):
        default_clause = f" DEFAULT {default}" if default else ""
        print(f"  ➕ Adding {table}.\"{column}\" ({col_type})")
        conn.execute(text(f"ALTER TABLE {table} ADD COLUMN \"{column}\" {col_type}{default_clause}"))
        conn.commit()
    else:
        print(f"  ✅ {table}.\"{column}\" exists")


def make_others_nullable(conn, table: str, excluded_columns: list):
    """
    Finds all columns in 'table' that are NOT NULL and don't have a default,
    excluding those in 'excluded_columns', and makes them nullable.
    """
    query = text("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = :t 
        AND is_nullable = 'NO' 
        AND column_default IS NULL
    """)
    result = conn.execute(query, {"t": table})
    columns = [row[0] for row in result]
    
    for col in columns:
        if col not in excluded_columns:
            print(f"  🔓 Making legacy column \"{col}\" nullable (was NOT NULL)")
            try:
                conn.execute(text(f"ALTER TABLE {table} ALTER COLUMN \"{col}\" DROP NOT NULL"))
                conn.commit()
            except Exception as e:
                print(f"  ⚠️ Could not make \"{col}\" nullable: {e}")
                conn.rollback()


def migrate():
    print("🔄 Running schema migrations...")

    with engine.connect() as conn:

        # ── users table ──────────────────────────────────────────────────────
        if table_exists(conn, "users"):
            print("📋 Checking users table columns...")

            # List of columns our app explicitly provides. 
            # Any other legacy columns that are NOT NULL will be made nullable.
            managed_cols = ["id", "email", "hashed_password", "full_name", "role", "created_at", "updated_at"]

            # Rename password → hashed_password if needed
            if not column_exists(conn, "users", "hashed_password"):
                for old_name in ("password", "password_hash", "passwordHash"):
                    if column_exists(conn, "users", old_name):
                        print(f"  🔄 Renaming users.\"{old_name}\" → users.hashed_password")
                        conn.execute(text(f"ALTER TABLE users RENAME COLUMN \"{old_name}\" TO hashed_password"))
                        conn.commit()
                        break
                else:
                    add_column_if_missing(conn, "users", "hashed_password", "VARCHAR")

            # Add all other managed columns
            add_column_if_missing(conn, "users", "full_name", "VARCHAR")
            add_column_if_missing(conn, "users", "avatar_url", "VARCHAR")
            add_column_if_missing(conn, "users", "role", "VARCHAR", "'user'")
            add_column_if_missing(conn, "users", "created_at", "TIMESTAMP WITH TIME ZONE", "NOW()")
            add_column_if_missing(conn, "users", "updated_at", "TIMESTAMP WITH TIME ZONE")

            # Final safety check: Make all other NOT NULL columns nullable
            managed_cols.append("avatar_url")
            make_others_nullable(conn, "users", managed_cols)

        # ── team_members table ── Add portfolio columns ──────────────────────
        if table_exists(conn, "team_members"):
            print("📋 Checking team_members table for portfolio columns...")
            add_column_if_missing(conn, "team_members", "slug", "VARCHAR")
            add_column_if_missing(conn, "team_members", "tagline", "VARCHAR")
            add_column_if_missing(conn, "team_members", "quote", "TEXT")
            add_column_if_missing(conn, "team_members", "expertise", "JSON")
            add_column_if_missing(conn, "team_members", "achievements", "JSON")
            add_column_if_missing(conn, "team_members", "cover_image_url", "VARCHAR")
            add_column_if_missing(conn, "team_members", "website_url", "VARCHAR")
            add_column_if_missing(conn, "team_members", "github_url", "VARCHAR")
            add_column_if_missing(conn, "team_members", "twitter_url", "VARCHAR")

            # Convert expertise/achievements from TEXT to JSON if they were previously added as TEXT
            for col in ("expertise", "achievements"):
                if column_exists(conn, "team_members", col) and get_column_type(conn, "team_members", col) == "text":
                    print(f"  🔄 Converting team_members.\"{col}\" from TEXT to JSON")
                    try:
                        conn.execute(text(
                            f'ALTER TABLE team_members ALTER COLUMN "{col}" TYPE JSON '
                            f'USING CASE WHEN "{col}" IS NULL OR "{col}" = \'\' THEN NULL ELSE "{col}"::json END'
                        ))
                        conn.commit()
                    except Exception as e:
                        print(f"  ⚠️ Could not convert {col} to JSON: {e}")
                        conn.rollback()

        # ── gallery_items table ── Ensure table and columns exist ────────────
        if table_exists(conn, "gallery_items"):
            print("📋 Checking gallery_items table columns...")
            add_column_if_missing(conn, "gallery_items", "slug", "VARCHAR")
            add_column_if_missing(conn, "gallery_items", "alt_text", "VARCHAR")
            add_column_if_missing(conn, "gallery_items", "caption", "TEXT")
            add_column_if_missing(conn, "gallery_items", "category", "VARCHAR")
            add_column_if_missing(conn, "gallery_items", "sort_order", "INTEGER", "0")
            add_column_if_missing(conn, "gallery_items", "is_featured", "BOOLEAN", "false")
            add_column_if_missing(conn, "gallery_items", "status", "VARCHAR", "'published'")

        # ── pages table ── Add SEO meta columns ──────────────────────────────
        if table_exists(conn, "pages"):
            print("📋 Checking pages table for SEO columns...")
            add_column_if_missing(conn, "pages", "meta_keywords", "VARCHAR")
            add_column_if_missing(conn, "pages", "canonical_url", "VARCHAR")
            add_column_if_missing(conn, "pages", "og_image", "VARCHAR")

        # ── blog_posts table ── Add meta_keywords column ─────────────────────
        if table_exists(conn, "blog_posts"):
            print("📋 Checking blog_posts table for SEO columns...")
            add_column_if_missing(conn, "blog_posts", "meta_keywords", "VARCHAR")

        # ── users table ── Add login lockout columns ──────────────────────
        if table_exists(conn, "users"):
            print("📋 Checking users table for login lockout columns...")
            add_column_if_missing(conn, "users", "failed_login_attempts", "INTEGER", "0")
            add_column_if_missing(conn, "users", "locked_until", "TIMESTAMPTZ")

        # ── Normalize user roles to lowercase ────────────────────────────────
        print("📋 Normalizing user roles to lowercase...")
        result = conn.execute(text(
            "UPDATE users SET role = LOWER(role) WHERE role IS DISTINCT FROM LOWER(role)"
        ))
        conn.commit()
        if result.rowcount > 0:
            print(f"  🔄 Normalized {result.rowcount} user role(s) to lowercase")
        else:
            print("  ✅ All user roles already lowercase")

        # ── contact_messages table ──────────────────────────────────────────
        if table_exists(conn, "contact_messages"):
            print("📋 Checking contact_messages table columns...")
            add_column_if_missing(conn, "contact_messages", "full_name", "VARCHAR")
            add_column_if_missing(conn, "contact_messages", "contact_number", "VARCHAR")
            add_column_if_missing(conn, "contact_messages", "email", "VARCHAR")
            add_column_if_missing(conn, "contact_messages", "message", "TEXT")
            add_column_if_missing(conn, "contact_messages", "is_read", "BOOLEAN", "false")
            add_column_if_missing(conn, "contact_messages", "submitted_at", "TIMESTAMP WITH TIME ZONE", "NOW()")

        # ── job_listings table ── Add address column ────────────────────────
        if table_exists(conn, "job_listings"):
            print("📋 Checking job_listings table columns...")
            add_column_if_missing(conn, "job_listings", "address", "VARCHAR")

        # ── Create any missing tables using SQLAlchemy metadata ─────────────
        print("  📋 Ensuring all tables exist (create_all)...")

    # Run create_all outside the connection block
    from app.database import Base
    # No need to import models here as they are imported in main.py usually, 
    # but create_all uses metadata bound to Base.
    # To be safe, ensure models are loaded.
    import app.models # noqa
    Base.metadata.create_all(bind=engine)
    print("✅ Migrations complete.")


if __name__ == "__main__":
    migrate()
