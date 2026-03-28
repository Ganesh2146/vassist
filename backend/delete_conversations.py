import os
from dotenv import load_dotenv
from app import create_app
from app.database import db
from app.models.chat import Conversation, Message

load_dotenv(override=True)
app = create_app()

with app.app_context():
    count_m = db.session.query(Message).delete()
    count_c = db.session.query(Conversation).delete()
    db.session.commit()
    print(f"SUCCESS: Deleted {count_c} conversations and {count_m} messages.")
