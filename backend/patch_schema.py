from sqlalchemy import text
from app import create_app
from app.database import db

app = create_app()

with app.app_context():
    try:
        db.session.execute(text("ALTER TABLE timetables MODIFY COLUMN content LONGTEXT;"))
        db.session.commit()
        print("Successfully updated the 'content' column to LONGTEXT.")
    except Exception as e:
        db.session.rollback()
        print(f"Failed to update column: {e}")
