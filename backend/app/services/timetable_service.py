import pandas as pd
from app.database import db
from app.models.admin_data import Timetable

def _df_to_markdown_table(df) -> str:
    lines = []
    for row in df.itertuples(index=False):
        cleaned = [str(x).strip() if pd.notna(x) and str(x).strip() != "" else "-" for x in row]
        if all(x == "-" for x in cleaned):
            continue
        lines.append(" | ".join(cleaned))
    return "\n".join(lines)

def ingest_timetable(file_path: str, ext: str) -> int:
    text_content = ""
    try:
        row_count = 0
        if ext in {".xlsx", ".xls"}:
            dfs = pd.read_excel(file_path, sheet_name=None, header=None)
            text_parts = []
            for sheet_name, df in dfs.items():
                df = df.dropna(how='all').dropna(axis=1, how='all').fillna("")
                formatted_table = _df_to_markdown_table(df)
                text_parts.append(f"--- Sheet: {sheet_name} ---\n" + formatted_table)
                row_count += len(df)
            text_content = "Timetable Data (Formatted Data):\n\n" + "\n\n".join(text_parts)
        elif ext == ".csv":
            df = pd.read_csv(file_path, header=None)
            df = df.dropna(how='all').dropna(axis=1, how='all').fillna("")
            text_content = "Timetable Data (Formatted Data):\n\n" + _df_to_markdown_table(df)
            row_count = len(df)
        elif ext == ".txt":
            with open(file_path, "r", encoding="utf-8") as f:
                text_content = f.read()
            row_count = len(text_content.splitlines())
        else:
            raise ValueError(f"Unsupported file format: {ext}")
            
        # Securely wipe old and write new to the Database!
        Timetable.query.delete()
        db.session.commit()

        new_tbl = Timetable(filename=file_path.split("/")[-1].split("\\")[-1], content=text_content)
        db.session.add(new_tbl)
        db.session.commit()

        return row_count
    except Exception as e:
        db.session.rollback()
        raise ValueError(f"Failed to process timetable: {str(e)}")

def get_timetable_status() -> bool:
    count = Timetable.query.count()
    return count > 0

def get_timetable_text() -> str:
    tbl = Timetable.query.order_by(Timetable.created_at.desc()).first()
    return tbl.content if tbl else ""
