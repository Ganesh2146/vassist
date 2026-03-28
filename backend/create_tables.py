from app import create_app
from app.database import db
from app.models.admin_data import KnowledgeBase, Timetable
from app.models.care import Appointment
from app.models.user import User
from app.models.chat import Conversation

app = create_app()

with app.app_context():
    db.create_all()
    print("✅ Successfully created all tables in the Database!")
    print("   - Users")
    print("   - Appointments") 
    print("   - Conversations")
    print("   - KnowledgeBase")
    print("   - Timetable")
