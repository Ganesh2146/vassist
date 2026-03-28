from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from google.api_core import exceptions as google_exceptions
from datetime import datetime
import openai

from app.database import db
from app.models.user import User
from app.models.chat import Conversation, Message
from app.services.chatbot_service import generate_ai_response, _truncate_response, _wants_timetable, _local_fallback_response
from app.services.knowledge_base import find_answer
from app.services.whisper_service import transcribe_audio

chat_routes = Blueprint("chat_routes", __name__)

@chat_routes.post("/chat/message")
@jwt_required(optional=True)
def chat_message():
    payload = request.get_json(silent=True) or {}
    message = (payload.get("message") or "").strip()
    conversation_id = payload.get("conversationId")

    if not message:
        return jsonify({"status": "error", "message": "message is required"}), 400

    # User Auth Context
    email = (get_jwt_identity() or "").lower()
    user = None
    conv = None

    try:
        user = User.query.filter_by(email=email).first()
        if user:
            if conversation_id:
                conv = Conversation.query.filter_by(id=conversation_id, user_id=user.id).first()
            if not conv:
                conv = Conversation(user_id=user.id, title=message[:40] + "...")
                db.session.add(conv)
                db.session.commit()
                conversation_id = conv.id
            
            # Save user message
            user_msg = Message(conversation_id=conv.id, role="user", content=message)
            conv.updated_at = datetime.utcnow()
            db.session.add(user_msg)
            db.session.commit()
    except Exception as exc:
        current_app.logger.exception("Chat persistence failed; continuing without DB save")
        db.session.rollback()
        user = None
        conv = None

    try:
        kb_answer = find_answer(message)
    except Exception:
        current_app.logger.exception("Knowledge base lookup failed; falling back to AI response")
        kb_answer = None
    if kb_answer:
        response_text = kb_answer
        model_used = "knowledge_base"
    else:
        try:
            history = []
            if conv:
                recent_msgs = Message.query.filter_by(conversation_id=conv.id).order_by(Message.created_at.desc()).limit(11).all()
                recent_msgs.reverse()
                # Exclude the current user message which is the last one
                for m in recent_msgs[:-1]:
                    if getattr(m, 'content', None) and getattr(m, 'role', None):
                        history.append({"role": m.role, "content": m.content})
            response_text = generate_ai_response(message, history=history)
            model_used = current_app.config.get("GEMINI_MODEL", "gemini-pro")
        except google_exceptions.ResourceExhausted as exc:
            current_app.logger.error(f"Gemini API quota exceeded: {exc}")
            return jsonify({
                "status": "error",
                "message": "Gemini AI quota exceeded. Please check your API key billing/usage.",
                "details": str(exc) if current_app.config.get("DEBUG") else None,
            }), 429
        except Exception as exc:
            current_app.logger.exception("Chatbot response generation failed")
            return jsonify({
                "status": "error",
                "message": "Failed to generate AI response",
                "details": str(exc) if current_app.config.get("DEBUG") else None,
            }), 500

    # If the user didn't ask for timetable but the model returned it, replace with a friendly fallback.
    if not _wants_timetable(message) and response_text:
        timetable_markers = ("timetable data", "--- sheet:", "current timetable information")
        if any(marker in response_text.lower() for marker in timetable_markers):
            response_text = _local_fallback_response(message, "")

    max_chars = int(current_app.config.get("CHAT_RESPONSE_MAX_CHARS", 800))
    response_text = _truncate_response(response_text, max_chars)

    if user and conv:
        # Save AI message
        try:
            ai_msg = Message(conversation_id=conv.id, role="ai", content=response_text)
            conv.updated_at = datetime.utcnow()
            db.session.add(ai_msg)
            db.session.commit()
        except Exception:
            current_app.logger.exception("Failed to save AI message; continuing without DB save")
            db.session.rollback()

    return jsonify({
        "status": "success",
        "message": "AI response generated",
        "data": {
            "response": response_text,
            "conversation_id": conversation_id,
            "model": model_used,
        },
    })


@chat_routes.post("/chat/speech-to-text")
def speech_to_text():
    if "file" not in request.files:
        return jsonify({"status": "error", "message": "Audio file is required"}), 400

    uploaded = request.files["file"]
    if not uploaded or uploaded.filename == "":
        return jsonify({"status": "error", "message": "Audio file is required"}), 400

    try:
        transcript = transcribe_audio(uploaded)
    except ValueError as exc:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": str(exc),
                }
            ),
            400,
        )
    except openai.RateLimitError as exc:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "OpenAI quota exceeded. Please update your billing or API plan.",
                    "details": str(exc) if current_app.config.get("DEBUG") else None,
                }
            ),
            429,
        )
    except openai.AuthenticationError as exc:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "OpenAI API key is invalid or missing.",
                    "details": str(exc) if current_app.config.get("DEBUG") else None,
                }
            ),
            401,
        )
    except openai.APIError as exc:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "OpenAI API error. Please try again later.",
                    "details": str(exc) if current_app.config.get("DEBUG") else None,
                }
            ),
            502,
        )
    except Exception as exc:
        current_app.logger.exception("Speech-to-text failed")
        message = "Failed to transcribe audio"
        error_text = str(exc).lower()
        status_code = 500
        if "insufficient_quota" in error_text or "quota" in error_text:
            message = "OpenAI quota exceeded. Please update your billing or API plan."
            status_code = 429
        if "api key" in error_text or "authentication" in error_text or "unauthorized" in error_text:
            message = "OpenAI API key is invalid or missing"
            status_code = 401
        return (
            jsonify(
                {
                    "status": "error",
                    "message": message,
                    "details": str(exc) if current_app.config.get("DEBUG") else None,
                }
            ),
            status_code,
        )

    return jsonify(
        {
            "status": "success",
            "message": "Transcription successful",
            "data": {"text": transcript},
        }
    )
