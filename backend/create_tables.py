from app import create_app
from app.database import db
from app.models.admin_data import KnowledgeBase, Timetable

app = create_app()

with app.app_context():
    db.create_all()
    print("Successfully created the KnowledgeBase and Timetable tables in the Database!")
