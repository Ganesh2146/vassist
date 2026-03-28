from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

dashboard_routes = Blueprint("dashboard_routes", __name__)

@dashboard_routes.get("/dashboard/user")
@jwt_required()
def get_user_info():
    user = get_jwt_identity()
    return jsonify({
        "status": "success",
        "data": {
            "email": user
        }
    })

@dashboard_routes.get("/dashboard/modules")
@jwt_required()
def get_modules():
    return jsonify({
        "status": "success",
        "data": [
            {"title": "Admissions", "desc": "Track application status"},
            {"title": "Academic", "desc": "Course registration & calendar"},
            {"title": "Financial", "desc": "Fee payments & scholarships"},
            {"title": "Campus", "desc": "Hostel & navigation"}
        ]
    })

@dashboard_routes.get("/dashboard/quick-access")
@jwt_required()
def get_quick_access():
    return jsonify({
        "status": "success",
        "data": [
            {"name": "Counseling"},
            {"name": "Stress Mgmt"},
            {"name": "Help Line"}
        ]
    })
