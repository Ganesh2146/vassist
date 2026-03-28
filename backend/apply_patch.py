#!/usr/bin/env python3
"""
Direct database schema patch script
Run with: python apply_patch.py
"""
import os
import sys

# Set up environment
os.environ['FLASK_ENV'] = 'development'

try:
    from sqlalchemy import text
    from app import create_app
    from app.database import db

    app = create_app()

    with app.app_context():
        print("=" * 60)
        print("Applying Database Schema Patches")
        print("=" * 60)

        operations = [
            {
                "name": "Add counselor_id to appointments",
                "sql": "ALTER TABLE appointments ADD COLUMN counselor_id INT DEFAULT 1 AFTER user_id;",
            },
        ]

        for op in operations:
            try:
                print(f"\n▸ {op['name']}...", end=" ")
                db.session.execute(text(op['sql']))
                db.session.commit()
                print("✓ Success")
            except Exception as e:
                db.session.rollback()
                error_msg = str(e).lower()
                if "already exists" in error_msg or "duplicate" in error_msg or "existing" in error_msg:
                    print(f"✓ Already exists (skipped)")
                else:
                    print(f"✗ Error: {e}")

        print("\n" + "=" * 60)
        print("Database schema patch complete!")
        print("=" * 60)

except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
