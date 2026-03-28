from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

care_routes = Blueprint("care_routes", __name__)

@care_routes.get("/care/resources")
@jwt_required()
def get_care_resources():
    return jsonify({
        "status": "success",
        "resources": [
            { "type": 'GUIDED EXERCISE', "title": '5-Minute Box Breathing', "desc": 'Regulate your nervous system and find calm instantly.', "img": 'video' },
            { "type": 'ARTICLE', "title": 'Managing Work Anxiety', "desc": 'Practical tips for a calmer workday and better focus.', "img": 'book' },
            { "type": 'SOUNDSCAPE', "title": 'Rainfall for Deep Sleep', "desc": 'Ambient sounds to quiet the mind before bed.', "img": 'music' }
        ]
    })

@care_routes.get("/care/crisis-hotline")
@jwt_required()
def get_crisis_hotline():
    return jsonify({
        "status": "success",
        "data": {
            "number": "988",
            "message": "Available 24/7 for immediate help"
        }
    })

@care_routes.post("/care/schedule-appointment")
@jwt_required()
def schedule_appointment():
    data = request.get_json(silent=True) or {}
    date = data.get("date")
    time = data.get("time")

    if not date or not time:
        return jsonify({"status": "error", "message": "Date and Time are required"}), 400

    from app.database import db
    from app.models.care import Appointment
    from app.models.user import User

    email = (get_jwt_identity() or "").lower()
    user = User.query.filter_by(email=email).first()
    
    if user:
        new_app = Appointment(user_id=user.id, date=str(date), time=str(time))
        db.session.add(new_app)
        db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"Appointment securely scheduled for {date} at {time}.",
        "data": data
    })
