from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.database import db
from app.models.user import User
from app.models.chat import Conversation, Message

conversation_routes = Blueprint("conversation_routes", __name__)

def _get_user():
    email = (get_jwt_identity() or "").lower()
    return User.query.filter_by(email=email).first()

@conversation_routes.get("/conversations")
@jwt_required()
def get_conversations():
    user = _get_user()
    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    conversations = Conversation.query.filter_by(user_id=user.id).order_by(Conversation.updated_at.desc()).all()
    return jsonify({
        "status": "success",
        "data": [conv.to_dict() for conv in conversations]
    })

@conversation_routes.get("/conversations/<int:conversation_id>")
@jwt_required()
def get_conversation_by_id(conversation_id):
    user = _get_user()
    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    conv = Conversation.query.filter_by(id=conversation_id, user_id=user.id).first()
    if not conv:
        return jsonify({"status": "error", "message": "Conversation not found"}), 404

    messages = Message.query.filter_by(conversation_id=conv.id).order_by(Message.created_at.asc()).all()
    
    data = conv.to_dict()
    data["messages"] = [msg.to_dict() for msg in messages]
    
    return jsonify({
        "status": "success",
        "data": data
    })

@conversation_routes.post("/conversations")
@jwt_required()
def create_conversation():
    user = _get_user()
    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    payload = request.get_json(silent=True) or {}
    title = payload.get("title", "New Conversation")

    new_conv = Conversation(user_id=user.id, title=title)
    db.session.add(new_conv)
    db.session.commit()

    return jsonify({
        "status": "success",
        "data": new_conv.to_dict()
    })

@conversation_routes.delete("/conversations/<int:conversation_id>")
@jwt_required()
def delete_conversation(conversation_id):
    user = _get_user()
    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    conv = Conversation.query.filter_by(id=conversation_id, user_id=user.id).first()
    if not conv:
        return jsonify({"status": "error", "message": "Conversation not found"}), 404

    db.session.delete(conv)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Conversation deleted"
    })
