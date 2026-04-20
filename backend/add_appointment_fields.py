"""
Script to add missing columns to the appointments table.
This fixes the 500 error when fetching/scheduling appointments.
"""
from app import create_app
from app.database import db
from sqlalchemy import text

app = create_app()

with app.app_context():
    try:
        # Get the database dialect
        dialect = db.engine.dialect
        inspector = db.inspect(db.engine)
        
        # Get existing columns in appointments table
        existing_columns = [col['name'] for col in inspector.get_columns('appointments')]
        
        print("📋 Existing columns in appointments table:")
        for col in existing_columns:
            print(f"   - {col}")
        
        # Check which columns need to be added
        needed_columns = {
            'cancellation_reason': 'db.Text',
            'counselor_report': 'db.Text', 
            'student_feedback': 'db.Text'
        }
        
        columns_to_add = {k: v for k, v in needed_columns.items() if k not in existing_columns}
        
        if not columns_to_add:
            print("\n✅ All required columns already exist!")
        else:
            print(f"\n📝 Adding {len(columns_to_add)} missing column(s)...")
            
            for column_name in columns_to_add:
                try:
                    # Use raw SQL to add columns
                    if dialect.name == 'sqlite':
                        query = f"ALTER TABLE appointments ADD COLUMN {column_name} TEXT"
                    elif dialect.name == 'postgresql':
                        query = f"ALTER TABLE appointments ADD COLUMN {column_name} TEXT"
                    elif dialect.name in ['mysql', 'mariadb']:
                        query = f"ALTER TABLE appointments ADD COLUMN {column_name} LONGTEXT"
                    else:
                        query = f"ALTER TABLE appointments ADD COLUMN {column_name} TEXT"
                    
                    db.session.execute(text(query))
                    db.session.commit()
                    print(f"   ✅ Added column: {column_name}")
                except Exception as e:
                    print(f"   ⚠️  Could not add {column_name}: {str(e)}")
                    db.session.rollback()
            
            print("\n✅ Migration complete!")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
