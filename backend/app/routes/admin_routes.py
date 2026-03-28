import os
import tempfile
from urllib.parse import urlparse

from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.models.user import User
from app.services.knowledge_base import ingest_excel, get_knowledge_base_count


admin_routes = Blueprint("admin_routes", __name__)


def _mask_db_url(raw_url: str) -> str:
    if not raw_url:
        return "<empty>"
    try:
        parsed = urlparse(raw_url)
        db_name = (parsed.path or "").lstrip("/")
        user = parsed.username or ""
        host = parsed.hostname or ""
        port = f":{parsed.port}" if parsed.port else ""
        scheme = parsed.scheme or ""
        auth = f"{user}:***@" if user else ""
        return f"{scheme}://{auth}{host}{port}/{db_name}"
    except Exception:
        return "<unparseable>"


def _require_admin():
    email = (get_jwt_identity() or "").lower()
    print(f"DEBUG: _require_admin called. JWT Identity: {email}")
    user = User.query.filter_by(email=email).first()
    if not user:
        print("DEBUG: _require_admin failed. User not found.")
        return None
    if user.user_type != "admin":
        print(f"DEBUG: _require_admin failed. User type is {user.user_type}")
        return None
    return user


@admin_routes.post("/admin/knowledge-base/upload")
@jwt_required()
def upload_knowledge_base():
    user = _require_admin()
    if not user:
        return jsonify({"status": "error", "message": "Admin access required"}), 403

    if "file" not in request.files:
        return jsonify({"status": "error", "message": "Excel file is required"}), 400

    uploaded = request.files["file"]
    if not uploaded or uploaded.filename == "":
        return jsonify({"status": "error", "message": "Excel file is required"}), 400

    ext = os.path.splitext(uploaded.filename)[1].lower()
    if ext not in {".xlsx", ".xls"}:
        return jsonify({"status": "error", "message": "Only .xlsx or .xls files are supported"}), 400

    try:
        temp_dir = tempfile.gettempdir()
        temp_path = os.path.join(temp_dir, f"knowledge_base_temp_{os.urandom(4).hex()}{ext}")
        uploaded.save(temp_path)
        count = ingest_excel(temp_path)
        
        # Clean up safely
        if os.path.exists(temp_path):
            os.remove(temp_path)
    except Exception as exc:
        current_app.logger.exception("Knowledge base upload failed")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "Failed to process Excel file",
                    "details": str(exc) if current_app.config.get("DEBUG") else None,
                }
            ),
            400,
        )

    return jsonify(
        {
            "status": "success",
            "message": "Knowledge base updated",
            "data": {"questions_loaded": count},
        }
    )

from app.services.timetable_service import ingest_timetable, get_timetable_status

@admin_routes.post("/admin/timetable/upload")
@jwt_required()
def upload_timetable():
    user = _require_admin()
    if not user:
        return jsonify({"status": "error", "message": "Admin access required"}), 403

    current_app.logger.info(
        "Timetable upload target DB: %s",
        _mask_db_url(current_app.config.get("SQLALCHEMY_DATABASE_URI", "")),
    )

    if "file" not in request.files:
        return jsonify({"status": "error", "message": "Timetable file is required"}), 400

    uploaded = request.files["file"]
    if not uploaded or uploaded.filename == "":
        return jsonify({"status": "error", "message": "Timetable file is required"}), 400

    ext = os.path.splitext(uploaded.filename)[1].lower()
    if ext not in {".xlsx", ".xls", ".csv", ".txt"}:
        return jsonify({"status": "error", "message": "Only .xlsx, .xls, .csv or .txt files are supported"}), 400

    try:
        temp_dir = tempfile.gettempdir()
        temp_path = os.path.join(temp_dir, f"timetable_temp_{os.urandom(4).hex()}{ext}")
        uploaded.save(temp_path)
        count = ingest_timetable(temp_path, ext)
        
        # Clean up safely
        if os.path.exists(temp_path):
            os.remove(temp_path)
    except Exception as exc:
        current_app.logger.exception("Timetable upload failed")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "Failed to process Timetable file",
                    "details": str(exc) if current_app.config.get("DEBUG") else None,
                }
            ),
            400,
        )

    return jsonify(
        {
            "status": "success",
            "message": "Timetable updated",
            "data": {"rows_processed": count},
        }
    )

@admin_routes.get("/admin/timetable/status")
@jwt_required()
def timetable_status():
    user = _require_admin()
    if not user:
        return jsonify({"status": "error", "message": "Admin access required"}), 403

    return jsonify(
        {
            "status": "success",
            "data": {"available": get_timetable_status()},
        }
    )


@admin_routes.get("/admin/knowledge-base/status")
@jwt_required()
def knowledge_base_status():
    user = _require_admin()
    if not user:
        return jsonify({"status": "error", "message": "Admin access required"}), 403

    return jsonify(
        {
            "status": "success",
            "message": "Knowledge base status",
            "data": {"questions_loaded": get_knowledge_base_count()},
        }
    )
