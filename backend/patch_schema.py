from sqlalchemy import text
from app import create_app
from app.database import db

app = create_app()

with app.app_context():
    operations = [
        ("ALTER TABLE timetables MODIFY COLUMN content LONGTEXT;", "Updated 'content' column to LONGTEXT."),
        ("ALTER TABLE appointments ADD COLUMN counselor_id INT DEFAULT 1;", "Added 'counselor_id' column to appointments table."),
    ]
    
    for sql, message in operations:
        try:
            db.session.execute(text(sql))
            db.session.commit()
            print(f"✓ {message}")
        except Exception as e:
            db.session.rollback()
            if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                print(f"⚠ {message} (already exists)")
            else:
                print(f"✗ Failed: {e}")
