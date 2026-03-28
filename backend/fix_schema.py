from app import create_app
from app.database import db
from sqlalchemy import text

app = create_app()

with app.app_context():
    # List of columns to add
    alterations = [
        ("messages", "role", "VARCHAR(50) NOT NULL DEFAULT 'user'"),
        ("appointments", "user_id", "INT NOT NULL"),
        ("appointments", "counselor_id", "INT"),
        ("appointments", "date", "VARCHAR(50) NOT NULL DEFAULT ''"),
        ("appointments", "time", "VARCHAR(50) NOT NULL DEFAULT ''"),
        ("appointments", "status", "VARCHAR(50) DEFAULT 'scheduled'"),
        ("appointments", "notes", "LONGTEXT"),
        ("appointments", "created_at", "DATETIME DEFAULT CURRENT_TIMESTAMP"),
        ("appointments", "updated_at", "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
    ]
    
    for table, column, col_def in alterations:
        try:
            db.session.execute(text(f"ALTER TABLE `{table}` ADD COLUMN `{column}` {col_def}"))
            db.session.commit()
            print(f"✓ Added '{column}' column to {table} table")
        except Exception as e:
            if "Duplicate column" in str(e) or "1060" in str(e):
                print(f"✓ '{column}' column already exists in {table}")
            else:
                print(f"Error adding {column} to {table}: {e}")
            db.session.rollback()

print("\nDatabase schema update complete!")
