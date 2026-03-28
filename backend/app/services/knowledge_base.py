import json
import os
import pandas as pd
from typing import Optional, List, Dict
from app.database import db
from app.models.admin_data import KnowledgeBase

_FILE_CACHE: List[Dict[str, str]] | None = None


def _load_file_kb() -> List[Dict[str, str]]:
    global _FILE_CACHE
    if _FILE_CACHE is not None:
        return _FILE_CACHE

    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    kb_path = os.path.join(base_dir, "data", "knowledge_base.json")
    try:
        with open(kb_path, "r", encoding="utf-8") as handle:
            data = json.load(handle)
            if isinstance(data, list):
                _FILE_CACHE = [
                    {
                        "question": str(item.get("question", "")).strip(),
                        "answer": str(item.get("answer", "")).strip(),
                    }
                    for item in data
                    if item.get("question") and item.get("answer")
                ]
            else:
                _FILE_CACHE = []
    except Exception:
        _FILE_CACHE = []

    return _FILE_CACHE

def _normalize(text: str) -> str:
    return " ".join((text or "").strip().lower().split())

def save_knowledge_base(pairs) -> int:
    try:
        # Clear existing knowledge base completely before replacing
        KnowledgeBase.query.delete()
        db.session.commit()
        
        # Add the new ones
        for pair in pairs:
            # We enforce saving all normalized into the DB natively
            new_kb = KnowledgeBase(question=pair["question"], answer=pair["answer"])
            db.session.add(new_kb)
        db.session.commit()
        return len(pairs)
    except Exception as e:
        db.session.rollback()
        raise e

def ingest_excel(file_path: str) -> int:
    df = pd.read_excel(file_path)
    
    # Normalize column names to lowercase and strip whitespace
    df.columns = [str(col).strip().lower() for col in df.columns]
    
    if "question" not in df.columns or "answer" not in df.columns:
        raise ValueError("Excel must include 'Question' and 'Answer' columns (case insensitive)")

    pairs = []
    for _, row in df.iterrows():
        question = str(row.get("question", "")).strip()
        answer = str(row.get("answer", "")).strip()
        if question and answer and question.lower() != "nan" and answer.lower() != "nan":
            pairs.append({"question": question, "answer": answer})

    return save_knowledge_base(pairs)

def find_answer(query: str) -> Optional[str]:
    records = None
    try:
        records = KnowledgeBase.query.all()
    except Exception:
        records = None

    if not records:
        file_records = _load_file_kb()
        if not file_records:
            return None
        normalized_query = _normalize(query)
        for record in file_records:
            if _normalize(record["question"]) == normalized_query:
                return record["answer"]
        for record in file_records:
            if _normalize(record["question"]) in normalized_query:
                return record["answer"]
        return None

    normalized_query = _normalize(query)
    
    # 1st Pass: Direct match
    for record in records:
        if _normalize(record.question) == normalized_query:
            return record.answer
    
    # 2nd Pass: Includes text
    for record in records:
        if _normalize(record.question) in normalized_query:
            return record.answer

    return None

def get_knowledge_base_count() -> int:
    return KnowledgeBase.query.count()
