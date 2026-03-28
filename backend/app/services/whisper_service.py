import os
import tempfile

from flask import current_app
from openai import OpenAI


def transcribe_audio(file_storage) -> str:
    api_key = current_app.config.get("OPENAI_API_KEY")
    model = current_app.config.get("WHISPER_MODEL", "whisper-1")

    if not api_key:
        raise ValueError("OPENAI_API_KEY is not configured")

    try:
        file_storage.stream.seek(0, os.SEEK_END)
        size = file_storage.stream.tell()
        file_storage.stream.seek(0)
    except OSError:
        size = None

    if size == 0:
        raise ValueError("Audio file is empty")

    client = OpenAI(api_key=api_key)

    suffix = os.path.splitext(file_storage.filename or "audio")[1] or ".webm"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        file_storage.save(temp_file.name)
        temp_path = temp_file.name

    try:
        with open(temp_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model=model,
                file=audio_file,
                response_format="text",
            )
    finally:
        try:
            os.remove(temp_path)
        except OSError:
            pass

    if hasattr(transcript, "text"):
        text = transcript.text
    else:
        text = transcript

    return (text or "").strip()
