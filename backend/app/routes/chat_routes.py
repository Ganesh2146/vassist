from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from google.api_core import exceptions as google_exceptions
from datetime import datetime
import openai

from app.database import db
from app.models.user import User
from app.models.chat import Conversation, Message
from app.services.chatbot_service import generate_ai_response, _truncate_response, _wants_timetable, _local_fallback_response, generate_dynamic_mental_health_question
from app.services.knowledge_base import find_answer
from app.services.whisper_service import transcribe_audio

chat_routes = Blueprint("chat_routes", __name__)

@chat_routes.post("/chat/message")
@jwt_required(optional=True)
def chat_message():
    payload = request.get_json(silent=True) or {}
    message = (payload.get("message") or "").strip()
    conversation_id = payload.get("conversationId")
    mode = payload.get("mode", "general")  # general, mental_health_analysis

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
        # Skip knowledge base for mental health analysis mode
        if mode == "mental_health_analysis":
            kb_answer = None
        else:
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
            
            # Prepare user data for the AI
            user_data = None
            if user and mode != "mental_health_analysis":
                user_data = {
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'user_type': user.user_type
                }
                
                # Fetch completed counseling appointments with reports
                try:
                    from app.models.care import Appointment
                    completed_appointments = Appointment.query.filter_by(
                        user_id=user.id,
                        status='completed'
                    ).filter(Appointment.counselor_report != None).order_by(Appointment.updated_at.desc()).all()
                    
                    counseling_reports = []
                    for appt in completed_appointments:
                        counselor_name = f"{appt.counselor.first_name} {appt.counselor.last_name}" if appt.counselor else "Unknown"
                        report_entry = {
                            'date': appt.date,
                            'time': appt.time,
                            'counselor': counselor_name,
                            'report': appt.counselor_report,
                            'feedback': appt.student_feedback
                        }
                        counseling_reports.append(report_entry)
                    
                    if counseling_reports:
                        user_data['counseling_reports'] = counseling_reports
                except Exception as exc:
                    current_app.logger.exception("Failed to fetch counseling reports")
            
            response_text = generate_ai_response(message, history=history, user_data=user_data, mode=mode)
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


@chat_routes.post("/chat/mental-health/next-question")
@jwt_required(optional=True)
def get_next_mental_health_question():
    """Generate the next dynamic mental health assessment question based on conversation history."""
    payload = request.get_json(silent=True) or {}
    conversation_id = payload.get("conversationId")
    question_count = payload.get("questionCount", 0)

    if not conversation_id:
        return jsonify({"status": "error", "message": "conversationId is required"}), 400

    try:
        email = (get_jwt_identity() or "").lower()
        user = User.query.filter_by(email=email).first() if email else None
        
        # Fetch conversation
        conv = None
        if user:
            conv = Conversation.query.filter_by(id=conversation_id, user_id=user.id).first()
        
        if not conv:
            return jsonify({"status": "error", "message": "Conversation not found"}), 404

        # Get recent messages for context
        recent_msgs = Message.query.filter_by(conversation_id=conv.id).order_by(Message.created_at.asc()).all()
        
        conversation_history = []
        for m in recent_msgs:
            if getattr(m, 'content', None) and getattr(m, 'role', None):
                conversation_history.append({"role": m.role, "content": m.content})

        # Generate next question
        next_question = generate_dynamic_mental_health_question(conversation_history, question_count)

        return jsonify({
            "status": "success",
            "message": "Next question generated",
            "data": {
                "question": next_question,
                "questionCount": question_count + 1
            }
        })
    except Exception as exc:
        current_app.logger.exception("Error generating next mental health question")
        return jsonify({
            "status": "error",
            "message": "Failed to generate next question",
            "details": str(exc) if current_app.config.get("DEBUG") else None
        }), 500


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
