import google.generativeai as genai
from flask import current_app
from google.api_core import exceptions as google_exceptions


from app.services.timetable_service import get_timetable_text


def _truncate_response(text: str, max_chars: int) -> str:
    if not text:
        return text
    if max_chars <= 0:
        return text
    if len(text) <= max_chars:
        return text

    # Prefer truncating at sentence boundaries for readability.
    snippet = text[: max_chars + 1]
    sentence_breaks = [". ", "! ", "? ", "\n"]
    cut_index = -1
    for marker in sentence_breaks:
        idx = snippet.rfind(marker)
        if idx > cut_index:
            cut_index = idx + len(marker)

    trimmed = text[:cut_index].strip() if cut_index > 0 else text[:max_chars].strip()
    if not trimmed:
        trimmed = text[:max_chars].strip()

    return f"{trimmed}… If you want more details, ask a specific question."


def _wants_timetable(prompt: str) -> bool:
    normalized = (prompt or "").strip().lower()
    return any(
        keyword in normalized
        for keyword in ("timetable", "schedule", "class time", "class schedule", "time table")
    )


def _local_fallback_response(prompt: str, timetable_text: str) -> str:
    normalized = (prompt or "").strip().lower()
    if not normalized:
        return "Hi! How can I help you today?"

    greetings = ("hi", "hello", "hey", "good morning", "good afternoon", "good evening")
    if any(normalized.startswith(g) for g in greetings):
        return "Hello! I'm here to help with admissions, academics, campus life, or wellness support. What do you need?"

    if _wants_timetable(prompt) or "class" in normalized:
        if timetable_text:
            return f"Here is the current timetable information:\n\n{timetable_text}"
        return "I don't have the latest timetable yet. Please check back later or contact the admin office."

    if "help" in normalized or "support" in normalized:
        return "Sure — tell me what you need help with (admissions, academics, campus services, or wellness)."

    return (
        "I'm running in offline mode without an AI API key, so my replies are limited. "
        "If you want full AI responses, please add a Gemini API key."
    )

def generate_ai_response(prompt: str, history: list | None = None, user_data: dict | None = None, mode: str = "general") -> str:
    api_key = current_app.config.get("GOOGLE_GEMINI_API_KEY")
    model_name = current_app.config.get("GEMINI_MODEL", "gemini-2.5-flash")

    # Grab Dynamic Timetable direct from Database.
    try:
        timetable_text = get_timetable_text()
    except Exception:
        timetable_text = ""

    if not api_key:
        return _local_fallback_response(prompt, timetable_text)

    genai.configure(api_key=api_key)

    wants_timetable = _wants_timetable(prompt)

    # Different system prompts based on mode
    if mode == "mental_health_analysis":
        sys_prompt = (
            "You are a compassionate mental health assessment AI assistant trained to analyze student mental wellness. "
            "Your role is to provide insightful, supportive, and non-judgmental analysis based on student responses. "
            "IMPORTANT RULES:\n"
            "1. Be empathetic and supportive in tone\n"
            "2. Provide clear, organized analysis\n"
            "3. Identify key stress factors and positive coping mechanisms\n"
            "4. Offer practical, actionable recommendations\n"
            "5. Always encourage seeking professional help when needed\n"
            "6. Maintain confidentiality and non-diagnostic stance\n"
            "7. Suggest campus resources or crisis hotlines if concerning indicators appear"
        )
    else:
        sys_prompt = (
            "You are V-Assist, an intelligent student support chatbot for a university. "
            "Keep answers concise, helpful, and friendly. "
            "IMPORTANT RULES:\n"
            "1. Multilingual Support: Always reply in the same language the user uses.\n"
            "2. Sentiment Analysis: If the user sounds distressed, explicitly offer the crisis hotline (988).\n"
            "3. Timetable: If the user asks for the timetable or schedule, YOU MUST provide the timetable details clearly from the context provided below."
        )
    
    # Include user information in the system prompt
    if user_data and mode != "mental_health_analysis":
        user_name = f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}".strip()
        user_email = user_data.get('email', '')
        user_type = user_data.get('user_type', 'student')
        
        sys_prompt += f"\n\n--- CURRENT USER INFORMATION ---\n"
        sys_prompt += f"Name: {user_name}\n"
        sys_prompt += f"Email: {user_email}\n"
        sys_prompt += f"User Type: {user_type}\n"
        
        # Include counseling reports if available
        counseling_reports = user_data.get('counseling_reports', [])
        if counseling_reports:
            sys_prompt += f"\n--- COUNSELING SESSION REPORTS ---\n"
            for idx, report in enumerate(counseling_reports, 1):
                sys_prompt += f"\nSession {idx}:\n"
                sys_prompt += f"  Date: {report.get('date', 'N/A')}\n"
                sys_prompt += f"  Time: {report.get('time', 'N/A')}\n"
                sys_prompt += f"  Counselor: {report.get('counselor', 'N/A')}\n"
                if report.get('report'):
                    sys_prompt += f"  Report: {report.get('report')}\n"
                if report.get('feedback'):
                    sys_prompt += f"  Student Feedback: {report.get('feedback')}\n"
        
        sys_prompt += f"\n-----------------------------------"
    
    if timetable_text and wants_timetable:
        sys_prompt += f"\n\n--- CURRENT TIMETABLE INFORMATION ---\n{timetable_text}\n--------------------------------------"

    try:
        # Pass system_instruction to GenerativeModel if supported (gemini-1.5 supports it)
        model = genai.GenerativeModel(
            model_name=model_name,
            system_instruction=sys_prompt
        )
    except Exception:
        # Fallback if the SDK is old
        model = genai.GenerativeModel(model_name)
        prompt = f"{sys_prompt}\n\nUser: {prompt}"

    # Build history for chat
    formatted_history = []
    if history:
        for msg in history:
            role = "user" if msg['role'] == "user" else "model"
            formatted_history.append({"role": role, "parts": [msg['content']]})

    try:
        if formatted_history:
            chat = model.start_chat(history=formatted_history)
            result = chat.send_message(prompt)
        else:
            result = model.generate_content(prompt)
    except google_exceptions.ResourceExhausted as exc:
        current_app.logger.error(f"Gemini API quota exceeded; using offline fallback: {exc}")
        return _local_fallback_response(prompt, timetable_text)
    except Exception as exc:
        current_app.logger.exception(f"Gemini generation error: {exc}")
        # If it's a context window/too long issue, try without history or fallback
        return _local_fallback_response(prompt, timetable_text)

    response_text = getattr(result, "text", None)
    if not response_text:
        raise RuntimeError("No response text returned from Gemini")

    return response_text.strip()


def generate_dynamic_mental_health_question(conversation_history: list | None = None, question_count: int = 0) -> str:
    """
    Generate a dynamic follow-up question for mental health assessment based on conversation history.
    
    Args:
        conversation_history: List of previous messages in format [{"role": "user"/"ai", "content": "..."}]
        question_count: Number of questions asked so far (for variety)
    
    Returns:
        A dynamic follow-up question as a string
    """
    api_key = current_app.config.get("GOOGLE_GEMINI_API_KEY")
    model_name = current_app.config.get("GEMINI_MODEL", "gemini-2.5-flash")

    if not api_key:
        # Fallback static questions
        fallback_questions = [
            "How have you been feeling lately?",
            "How are you managing stress in your daily life?",
            "Tell me about your sleep patterns and rest.",
            "Do you have a support system you can rely on?",
            "What brings you joy or helps you relax?",
            "How are your current energy levels?",
        ]
        return fallback_questions[min(question_count, len(fallback_questions) - 1)]

    genai.configure(api_key=api_key)

    sys_prompt = (
        "You are a compassionate mental health interviewer. Your role is to generate the next thoughtful, "
        "supportive follow-up question for a mental health assessment.\n\n"
        "IMPORTANT RULES:\n"
        "1. Generate ONE question only (no preamble, no explanation)\n"
        "2. Make it conversational and warm\n"
        "3. Base it on what the person has already shared\n"
        "4. Avoid repeating previous questions\n"
        "5. Go deeper into areas they mentioned or explore new relevant areas\n"
        "6. If they seem stressed, ask about coping mechanisms\n"
        "7. If they mentioned sleep, ask about rest habits\n"
        "8. If they mentioned relationships, ask about support\n"
        "9. Keep it concise and direct (1-2 sentences)\n"
        "10. End with a question mark"
    )

    # Build conversation context
    conversation_text = "Previous conversation:\n"
    if conversation_history:
        for msg in conversation_history:
            role = "Person" if msg['role'] == "user" else "Assessment"
            conversation_text += f"\n{role}: {msg['content']}"
    else:
        conversation_text += "\n(No previous responses yet - this is the first question)"

    prompt = f"{conversation_text}\n\nNow generate the next follow-up question based on what they've shared. Remember: ONE question only, no extra text."

    try:
        model = genai.GenerativeModel(
            model_name=model_name,
            system_instruction=sys_prompt
        )
        result = model.generate_content(prompt)
        response_text = getattr(result, "text", None)
        
        if response_text:
            return response_text.strip()
        else:
            raise RuntimeError("No response text returned")
            
    except google_exceptions.ResourceExhausted:
        current_app.logger.error("Gemini API quota exceeded for question generation")
        fallback_questions = [
            "How have you been feeling lately?",
            "How are you managing stress in your daily life?",
            "Tell me about your sleep patterns and rest.",
            "Do you have a support system you can rely on?",
            "What brings you joy or helps you relax?",
            "How are your current energy levels?",
        ]
        return fallback_questions[min(question_count, len(fallback_questions) - 1)]
    except Exception as exc:
        current_app.logger.exception(f"Error generating dynamic question: {exc}")
        fallback_questions = [
            "How have you been feeling lately?",
            "How are you managing stress in your daily life?",
            "Tell me about your sleep patterns and rest.",
            "Do you have a support system you can rely on?",
            "What brings you joy or helps you relax?",
            "How are your current energy levels?",
        ]
        return fallback_questions[min(question_count, len(fallback_questions) - 1)]
