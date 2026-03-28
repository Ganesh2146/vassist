#!/usr/bin/env python3
"""
Direct database schema patch script for fixing appointments table.
Run with: python fix_appointments_schema.py
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
        print("Applying Database Schema Patch for Appointments")
        print("=" * 60)

        operations = [
            {
                "name": "Modify appointments.id to be appointment_id and autoincrement",
                "sql": "ALTER TABLE appointments CHANGE COLUMN id appointment_id INT NOT NULL AUTO_INCREMENT;",
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
                if "already has" in error_msg or "duplicate column name" in error_msg:
                    print(f"✓ Already applied (skipped)")
                else:
                    # Check if the column is already renamed
                    inspector = db.inspect(db.engine)
                    columns = [col['name'] for col in inspector.get_columns('appointments')]
                    if 'appointment_id' in columns and 'id' not in columns:
                         print(f"✓ Already applied (skipped)")
                    else:
                        print(f"✗ Error: {e}")


        print("\n" + "=" * 60)
        print("Database schema patch complete!")
        print("=" * 60)

except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
