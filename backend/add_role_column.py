from app import create_app
from app.database import db
from sqlalchemy import text

app = create_app()

with app.app_context():
    try:
        # Try to add the role column if it doesn't exist
        db.session.execute(text("ALTER TABLE messages ADD COLUMN `role` VARCHAR(50) NOT NULL DEFAULT 'user'"))
        db.session.commit()
        print("✓ Added 'role' column to messages table")
    except Exception as e:
        if "Duplicate column" in str(e) or "1060" in str(e):
            print("✓ 'role' column already exists")
        else:
            print(f"Error adding column: {e}")
            db.session.rollback()
