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

def generate_ai_response(prompt: str, history: list | None = None) -> str:
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

    sys_prompt = (
        "You are V-Assist, an intelligent student support chatbot for a university. "
        "Keep answers concise, helpful, and friendly. "
        "IMPORTANT RULES:\n"
        "1. Multilingual Support: Always reply in the same language the user uses.\n"
        "2. Sentiment Analysis: If the user sounds distressed, explicitly offer the crisis hotline (988).\n"
        "3. Timetable: If the user asks for the timetable or schedule, YOU MUST provide the timetable details clearly from the context provided below."
    )
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
