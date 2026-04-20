from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

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
    try:
        data = request.get_json(silent=True) or {}
        date = data.get("date")
        time = data.get("time")
        counselor_id = data.get("counselorId")
        notes = data.get("notes", "")

        if not date or not time:
            return jsonify({"status": "error", "message": "Date and Time are required"}), 400

        from app.database import db
        from app.models.care import Appointment
        from app.models.user import User

        email = (get_jwt_identity() or "").lower()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404
        
        # RULE 1: Check if student already has an active booking (scheduled or confirmed)
        existing_active_appointment = Appointment.query.filter(
            Appointment.user_id == user.id,
            Appointment.status.in_(['scheduled', 'confirmed'])
        ).first()
        
        if existing_active_appointment:
            return jsonify({
                "status": "error", 
                "message": "You already have an active counseling booking. Please cancel your existing booking before booking a new slot.",
                "error_code": "active_booking_exists"
            }), 400
        
        # Validate counselor exists if provided
        if counselor_id:
            counselor = User.query.get(int(counselor_id))
            if not counselor or counselor.user_type != 'counselor':
                return jsonify({"status": "error", "message": "Invalid counselor"}), 400
            
            # RULE 2: Check if counselor already has a booking at the same date and time
            counselor_booking_at_time = Appointment.query.filter(
                Appointment.counselor_id == int(counselor_id),
                Appointment.date == str(date),
                Appointment.time == str(time),
                Appointment.status.in_(['scheduled', 'confirmed'])
            ).first()
            
            if counselor_booking_at_time:
                return jsonify({
                    "status": "error", 
                    "message": "This counselor is already booked for this time slot. Please select another time or counselor.",
                    "error_code": "counselor_slot_unavailable"
                }), 400
        
        new_appointment = Appointment(
            user_id=user.id, 
            date=str(date), 
            time=str(time),
            counselor_id=int(counselor_id) if counselor_id else None,
            notes=notes,
            status="scheduled"
        )
        db.session.add(new_appointment)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": f"Appointment successfully scheduled for {date} at {time}.",
            "data": new_appointment.to_dict(include_counselor=True)
        }), 201
    except Exception as e:
        db.session.rollback()
        import traceback
        traceback.print_exc()
        return jsonify({
            "status": "error", 
            "message": "Failed to schedule appointment",
            "error": str(e)
        }), 500

@care_routes.get("/care/my-appointments")
@jwt_required()
def get_student_appointments():
    try:
        from app.database import db
        from app.models.user import User
        from app.models.care import Appointment
        
        email = (get_jwt_identity() or "").lower()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404
        
        appointments = Appointment.query.filter_by(user_id=user.id).order_by(Appointment.created_at.desc()).all()
        
        return jsonify({
            "status": "success",
            "data": [apt.to_dict(include_counselor=True) for apt in appointments]
        }), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500

@care_routes.get("/care/counselor/bookings")
@jwt_required()
def get_counselor_bookings():
    try:
        from app.database import db
        from app.models.user import User
        from app.models.care import Appointment
        
        email = (get_jwt_identity() or "").lower()
        counselor = User.query.filter_by(email=email).first()
        
        if not counselor:
            return jsonify({"status": "error", "message": "Counselor not found"}), 404
        
        if counselor.user_type != 'counselor':
            return jsonify({"status": "error", "message": "You are not a counselor"}), 403
        
        # Get all appointments assigned to this counselor
        appointments = Appointment.query.filter_by(counselor_id=counselor.id).order_by(Appointment.date.desc()).all()
        
        return jsonify({
            "status": "success",
            "data": [apt.to_dict(include_user=True) for apt in appointments]
        }), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500

@care_routes.patch("/care/appointment/<int:appointment_id>")
@jwt_required()
def update_appointment(appointment_id):
    try:
        from app.database import db
        from app.models.user import User
        from app.models.care import Appointment
        
        data = request.get_json(silent=True) or {}
        status = data.get("status")
        notes = data.get("notes")
        cancellation_reason = data.get("cancellation_reason")
        counselor_report = data.get("counselor_report")
        student_feedback = data.get("student_feedback")
        
        email = (get_jwt_identity() or "").lower()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404
        
        appointment = Appointment.query.get(appointment_id)
        
        if not appointment:
            return jsonify({"status": "error", "message": "Appointment not found"}), 404
        
        # Only student or assigned counselor can update
        if user.id != appointment.user_id and user.id != appointment.counselor_id:
            return jsonify({"status": "error", "message": "Unauthorized"}), 403
        
        # VALIDATION: Only students can cancel, and only if appointment is 'scheduled'
        if status == 'cancelled':
            # Only the student (not counselor) can cancel
            if user.id != appointment.user_id:
                return jsonify({
                    "status": "error", 
                    "message": "Only the student can cancel an appointment"
                }), 403
            
            # Only allow cancelling if appointment is 'scheduled'
            if appointment.status != 'scheduled':
                return jsonify({
                    "status": "error", 
                    "message": f"Cannot cancel a {appointment.status} appointment. Only scheduled appointments can be cancelled.",
                    "error_code": "invalid_status_for_cancellation",
                    "current_status": appointment.status
                }), 400
        
        if status:
            appointment.status = status
        if notes is not None:
            appointment.notes = notes
        if cancellation_reason is not None:
            appointment.cancellation_reason = cancellation_reason
        if counselor_report is not None:
            appointment.counselor_report = counselor_report
        if student_feedback is not None:
            appointment.student_feedback = student_feedback
        
        appointment.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Appointment updated successfully",
            "data": appointment.to_dict(include_user=True, include_counselor=True)
        }), 200
    except Exception as e:
        db.session.rollback()
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500

@care_routes.delete("/care/appointment/<int:appointment_id>")
@jwt_required()
def cancel_appointment(appointment_id):
    try:
        from app.database import db
        from app.models.user import User
        from app.models.care import Appointment
        
        email = (get_jwt_identity() or "").lower()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404
        
        appointment = Appointment.query.get(appointment_id)
        
        if not appointment:
            return jsonify({"status": "error", "message": "Appointment not found"}), 404
        
        # Only student or assigned counselor can cancel
        if user.id != appointment.user_id and user.id != appointment.counselor_id:
            return jsonify({"status": "error", "message": "Unauthorized"}), 403
        
        appointment.status = "cancelled"
        appointment.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Appointment cancelled successfully"
        }), 200
    except Exception as e:
        db.session.rollback()
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500

@care_routes.get("/care/counselors")
@jwt_required()
def get_counselors():
    try:
        from app.models.user import User
        
        counselors = User.query.filter_by(user_type='counselor').all()
        
        return jsonify({
            "status": "success",
            "data": [c.to_dict() for c in counselors]
        }), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500
