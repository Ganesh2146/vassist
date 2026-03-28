from app import create_app
from app.database import db
from app.models.user import User
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    email = "admin@university.edu"
    password = "Admin@123"
    
    # Check if admin already exists
    admin = User.query.filter_by(email=email).first()
    if not admin:
        admin = User(
            first_name="Admin",
            last_name="User",
            email=email,
            user_type="admin",
            password_hash=generate_password_hash(password)
        )
        db.session.add(admin)
        db.session.commit()
        print("Admin user successfully seeded into the database.")
    else:
        # Update existing admin
        admin.password_hash = generate_password_hash(password)
        admin.user_type = "admin"
        db.session.commit()
        print("Admin user updated with specified credentials.")
