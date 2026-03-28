from app import create_app
from app.database import db
from app.models.user import User
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    counselors = [
        {
            "first_name": "Rajesh",
            "last_name": "Kumar",
            "email": "rajesh.kumar@university.edu",
            "password": "Counselor@123"
        },
        {
            "first_name": "Priya",
            "last_name": "Sharma",
            "email": "priya.sharma@university.edu",
            "password": "Counselor@456"
        }
    ]
    
    for counselor_data in counselors:
        email = counselor_data["email"]
        password = counselor_data["password"]
        
        # Check if counselor already exists
        counselor = User.query.filter_by(email=email).first()
        if not counselor:
            counselor = User(
                first_name=counselor_data["first_name"],
                last_name=counselor_data["last_name"],
                email=email,
                user_type="counselor",
                password_hash=generate_password_hash(password)
            )
            db.session.add(counselor)
            print(f"Counselor {email} successfully seeded.")
        else:
            # Update existing counselor
            counselor.password_hash = generate_password_hash(password)
            counselor.user_type = "counselor"
            print(f"Counselor {email} updated.")
            
    db.session.commit()
    print("Counselor seeding process complete.")
