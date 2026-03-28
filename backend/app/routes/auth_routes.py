from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime, timedelta, timezone
import secrets
import socket
import threading
import queue
from flask_mail import Message
import requests

from app.database import db
from app.database import mail
from app.models.user import User


auth_routes = Blueprint("auth_routes", __name__)
PASSWORD_RESET_CODES = {}


def _utcnow():
    return datetime.now(timezone.utc)


def _generate_reset_code():
    return f"{secrets.randbelow(10**6):06d}"


def _send_reset_otp_email(email, reset_code):
    app_name = current_app.config.get("APP_NAME", "V-Assist")
    subject = f"{app_name} Password Reset OTP"
    body = (
        f"Hello,\n\n"
        f"Your {app_name} password reset OTP is: {reset_code}\n\n"
        "This OTP is valid for 10 minutes.\n"
        "If you did not request a password reset, please ignore this email.\n\n"
        f"- {app_name} Team"
    )

    resend_api_key = current_app.config.get("RESEND_API_KEY")
    resend_from_email = current_app.config.get("RESEND_FROM_EMAIL")

    # Prefer HTTPS email provider if configured (more reliable than SMTP on many PaaS).
    if resend_api_key:
        if not resend_from_email:
            raise RuntimeError("RESEND_FROM_EMAIL is required when RESEND_API_KEY is set")

        response = requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {resend_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "from": resend_from_email,
                "to": [email],
                "subject": subject,
                "text": body,
            },
            timeout=(5, 15),
        )
        response.raise_for_status()
        return

    # SMTP via Flask-Mail (with fail-fast behavior).
    msg = Message(subject=subject, recipients=[email], body=body)

    socket_timeout_seconds = float(current_app.config.get("MAIL_SOCKET_TIMEOUT", 10.0))
    total_timeout_seconds = float(current_app.config.get("MAIL_SEND_TIMEOUT", 12.0))

    result_queue: "queue.Queue[Exception | None]" = queue.Queue(maxsize=1)

    def _send_smtp_email():
        previous_timeout = socket.getdefaulttimeout()
        try:
            socket.setdefaulttimeout(socket_timeout_seconds)
            mail.send(msg)
            result_queue.put(None)
        except Exception as exc:  # noqa: BLE001
            result_queue.put(exc)
        finally:
            socket.setdefaulttimeout(previous_timeout)

    worker = threading.Thread(target=_send_smtp_email, daemon=True)
    worker.start()
    worker.join(timeout=total_timeout_seconds)

    if worker.is_alive():
        raise TimeoutError(
            f"Email send timed out after {total_timeout_seconds}s. "
            "Verify SMTP settings or use an HTTPS email provider."
        )

    try:
        maybe_exc = result_queue.get_nowait()
    except queue.Empty:
        maybe_exc = None
    if maybe_exc is not None:
        raise maybe_exc


def _sanitize_user(user):
    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "user_type": user.user_type,
    }


@auth_routes.post("/auth/register")
def register():
    payload = request.get_json(silent=True) or {}

    first_name = (payload.get("first_name") or "").strip()
    last_name = (payload.get("last_name") or "").strip()
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""
    user_type = (payload.get("user_type") or "student").strip().lower()

    if not first_name or not last_name or not email or not password:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "first_name, last_name, email, and password are required",
                }
            ),
            400,
        )

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"status": "error", "message": "User already exists"}), 409

    user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        user_type=user_type,
        password_hash=generate_password_hash(password),
    )
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=email)

    return (
        jsonify(
            {
                "status": "success",
                "message": "Registration successful",
                "data": {
                    "user_id": user.id,
                    "user": _sanitize_user(user),
                    "access_token": access_token,
                },
            }
        ),
        201,
    )


@auth_routes.post("/auth/login")
def login():
    payload = request.get_json(silent=True) or {}

    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    if not email or not password:
        return jsonify({"status": "error", "message": "email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=email)
    return jsonify(
        {
            "status": "success",
            "message": "Login successful",
            "data": {
                "access_token": access_token,
                "user": _sanitize_user(user),
            },
        }
    )


@auth_routes.post("/auth/forgot-password")
def forgot_password():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip().lower()

    if not email:
        return jsonify({"status": "error", "message": "email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"status": "error", "message": "Email not found in our system"}), 404

    reset_code = _generate_reset_code()
    expires_at = _utcnow() + timedelta(minutes=10)
    PASSWORD_RESET_CODES[email] = {
        "code": reset_code,
        "expires_at": expires_at,
        "attempts": 0,
    }

    try:
        _send_reset_otp_email(email, reset_code)
    except Exception as exc:
        current_app.logger.exception("Failed to send OTP email to %s", email)
        PASSWORD_RESET_CODES.pop(email, None)
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "Failed to send OTP email. Please verify email settings and try again.",
                    "details": str(exc) if current_app.config.get("DEBUG") else None,
                }
            ),
            500,
        )

    response_data = {
        "email": email,
        "expires_in_seconds": 600,
    }

    return jsonify(
        {
            "status": "success",
            "message": "OTP sent successfully to your email",
            "data": response_data,
        }
    )


@auth_routes.post("/auth/verify-reset-code")
def verify_reset_code():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip().lower()
    reset_code = (payload.get("reset_code") or "").strip()

    if not email or not reset_code:
        return (
            jsonify({"status": "error", "message": "email and reset_code are required"}),
            400,
        )

    record = PASSWORD_RESET_CODES.get(email)
    if not record:
        return jsonify({"status": "error", "message": "No active reset request found"}), 404

    if record["expires_at"] < _utcnow():
        PASSWORD_RESET_CODES.pop(email, None)
        return jsonify({"status": "error", "message": "Reset code expired"}), 400

    if record["attempts"] >= 5:
        PASSWORD_RESET_CODES.pop(email, None)
        return jsonify({"status": "error", "message": "Too many invalid attempts"}), 429

    if reset_code != record["code"]:
        record["attempts"] += 1
        return jsonify({"status": "error", "message": "Invalid reset code"}), 400

    return jsonify({"status": "success", "message": "Reset code verified"})


@auth_routes.post("/auth/reset-password")
def reset_password():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip().lower()
    reset_code = (payload.get("reset_code") or "").strip()
    new_password = payload.get("new_password") or ""

    if not email or not reset_code or not new_password:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "email, reset_code, and new_password are required",
                }
            ),
            400,
        )

    if len(new_password) < 6:
        return (
            jsonify({"status": "error", "message": "Password must be at least 6 characters"}),
            400,
        )

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"status": "error", "message": "Email not found in our system"}), 404

    record = PASSWORD_RESET_CODES.get(email)
    if not record:
        return jsonify({"status": "error", "message": "No active reset request found"}), 404

    if record["expires_at"] < _utcnow():
        PASSWORD_RESET_CODES.pop(email, None)
        return jsonify({"status": "error", "message": "Reset code expired"}), 400

    if reset_code != record["code"]:
        record["attempts"] += 1
        return jsonify({"status": "error", "message": "Invalid reset code"}), 400

    user.password_hash = generate_password_hash(new_password)
    db.session.commit()
    PASSWORD_RESET_CODES.pop(email, None)

    return jsonify({"status": "success", "message": "Password reset successful"})


@auth_routes.get("/auth/profile")
@jwt_required()
def profile():
    email = get_jwt_identity()
    user = User.query.filter_by(email=(email or "").lower()).first()

    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    return jsonify(
        {
            "status": "success",
            "message": "Profile retrieved",
            "data": _sanitize_user(user),
        }
    )
