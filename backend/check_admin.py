from app import create_app
from app.database import db
from app.models.user import User

app = create_app()

with app.app_context():
    users = User.query.filter_by(email="admin@university.edu").all()
    for user in users:
        print(f"ID: {user.id}, Email: {user.email}, Type: {user.user_type}")
