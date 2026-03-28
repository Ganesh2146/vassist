# Setup Guide - V-Assist

## Prerequisites

### System Requirements
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM**: Minimum 8GB
- **Disk Space**: 10GB free
- **Internet**: Required for package installation

---

## 1. BACKEND SETUP (Flask + Python)

### 1.1 Install Python

**Windows:**
- Download Python 3.10+ from [python.org](https://www.python.org)
- Run installer and check "Add Python to PATH"
- Verify: `python --version`

**macOS:**
```bash
brew install python3
python3 --version
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
python3 --version
```

---

### 1.2 Clone/Setup Project

```bash
# Navigate to project directory
cd V-Assist/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

---

### 1.3 Install Dependencies

```bash
# Upgrade pip
pip install --upgrade pip

# Install requirements
pip install -r requirements.txt

# Verify installation
pip list
```

### 1.4 Backend Requirements.txt

Create `requirements.txt` with:

```
Flask==3.0.0
Flask-SQLAlchemy==3.1.1
Flask-Migrate==4.0.5
Flask-JWT-Extended==4.5.3
Flask-CORS==4.0.0
Flask-Mail==0.9.1
python-dotenv==1.0.0
PyMySQL==1.1.0
cryptography==41.0.7
mysql-connector-python==8.2.0
requests==2.31.0
nltk==3.8.1
textblob==0.17.1
google-generativeai==0.3.0
openai==1.3.0
gunicorn==21.2.0
python-mysql-connector==2.1.7
werkzeug==3.0.1
marshmallow==3.20.1
python-email-validator==2.1.0
```

---

### 1.5 Setup Environment Variables

Create `.env` file in `backend/` directory:

```env
# Flask Configuration
FLASK_ENV=development
DEBUG=True
SECRET_KEY=your-super-secret-key-change-in-production

# Database Configuration
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/v_assist_db
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DB=v_assist_db

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key-change-in-production
JWT_ACCESS_TOKEN_EXPIRES=86400  # 24 hours
JWT_REFRESH_TOKEN_EXPIRES=2592000  # 30 days

# Email Configuration (SMTP - For Password Reset OTP)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_DEFAULT_SENDER=noreply@v-assist.com
MAIL_SUPPRESS_SEND=False

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/app.log
LOG_MAX_BYTES=10485760
LOG_BACKUP_COUNT=10

# External APIs
# 1. OpenAI API (Whisper for Speech-to-Text)
OPENAI_API_KEY=sk-your-openai-api-key-here
WHISPER_MODEL=whisper-1

# 2. Google Gemini API (Advanced AI Chatbot)
GOOGLE_GEMINI_API_KEY=your-google-gemini-api-key-here
GEMINI_MODEL=gemini-pro

# Application
APP_NAME=V-Assist
APP_VERSION=1.0.0
```

---

### 1.6 Setup MySQL Database

**Windows (using MySQL Community Server):**

1. Download from [MySQL](https://dev.mysql.com/downloads/mysql/)
2. Run installer
3. Follow setup wizard
4. Configure MySQL Server service

**macOS:**
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

**Linux (Ubuntu):**
```bash
sudo apt install mysql-server
sudo mysql_secure_installation
sudo systemctl start mysql
```

---

### 1.7 Create Database

```bash
# Connect to MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE v_assist_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user
CREATE USER 'v_assist'@'localhost' IDENTIFIED BY 'SecurePassword123!';

# Grant privileges
GRANT ALL PRIVILEGES ON v_assist_db.* TO 'v_assist'@'localhost';
FLUSH PRIVILEGES;

# Exit
EXIT;
```

---

### 1.8 Initialize Database Schema

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment if not already active
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Create migrations directory (first time only)
flask db init

# Create initial migration
flask db migrate -m "Initial schema"

# Apply migrations
flask db upgrade

# Verify database tables
mysql -u v_assist -p v_assist_db -e "SHOW TABLES;"
```

---

### 1.9 Start Backend Server

```bash
# Make sure virtual environment is activated
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Run development server
flask run

# Output should show:
# * Serving Flask app 'app'
# * Debug mode: on
# * Running on http://127.0.0.1:5000

# Or use Gunicorn for production
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

---

## 2. FRONTEND SETUP (React + Vite)

### 2.1 Install Node.js

**Windows/macOS:**
- Download from [nodejs.org](https://nodejs.org) (LTS version)
- Run installer and follow wizard
- Verify: `node --version` and `npm --version`

**Linux (Ubuntu):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs
node --version
npm --version
```

---

### 2.2 Create Vite Project

```bash
# Navigate to project root
cd V-Assist

# Create frontend with Vite
npm create vite@latest frontend -- --template react

# Navigate to frontend
cd frontend

# Install dependencies
npm install
```

---

### 2.3 Install Frontend Dependencies

In `frontend/` directory, create or update `package.json`:

```json
{
  "name": "v-assist-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0",
    "react-router-dom": "^6.20.0",
    "date-fns": "^2.30.0",
    "recharts": "^2.10.0",
    "react-quill": "^2.0.0",
    "react-select": "^5.8.0",
    "react-toastify": "^9.1.3",
    "react-calendar": "^4.2.1",
    "framer-motion": "^10.16.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "eslint": "^8.54.0",
    "eslint-plugin-react": "^7.33.2"
  }
}
```

Install these packages:

```bash
npm install
```

---

### 2.4 Setup Vite Configuration

Create/update `frontend/vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})
```

---

### 2.5 Setup Environment Variables

Create `frontend/.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=V-Assist
VITE_APP_VERSION=1.0.0
VITE_VOICE_ENABLED=true
VITE_DEFAULT_LANGUAGE=en
VITE_FEATURES_MULTILINGUAL=true
VITE_FEATURES_VOICE=true
```

Also create `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=V-Assist
VITE_APP_VERSION=1.0.0
VITE_VOICE_ENABLED=true
VITE_DEFAULT_LANGUAGE=en
```

---

### 2.6 Start Frontend Development Server

```bash
# Navigate to frontend directory
cd frontend

# Start Vite dev server
npm run dev

# Output should show:
# VITE v5.0.0  ready in 500 ms
# ➜  Local:   http://localhost:5173/
# ➜  Press q to quit
```

---

## 3. DATABASE MANAGEMENT

### 3.1 Backup Database

**Windows (Command Prompt):**
```cmd
mysqldump -u root -p v_assist_db > backup.sql
```

**macOS/Linux:**
```bash
mysqldump -u root -p v_assist_db > backup.sql
```

### 3.2 Restore Database

```bash
# Drop existing database (optional)
mysql -u root -p -e "DROP DATABASE v_assist_db;"

# Create new database
mysql -u root -p -e "CREATE DATABASE v_assist_db CHARACTER SET utf8mb4;"

# Restore from backup
mysql -u root -p v_assist_db < backup.sql
```

### 3.3 Seed Initial Data

Create `backend/app/seeds.py`:

```python
from app import create_app
from app.models import (
    db, User, Program, Course, FAQ, Counselor,
    Scholarship, Hostel, Transportation,
    TransportationSchedule, AcademicCalendar
)
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

def seed_database():
    """Seed database with initial data"""
    
    # Clear existing data
    db.drop_all()
    db.create_all()
    
    # Create admin user
    admin = User(
        email='admin@university.edu',
        password_hash=generate_password_hash('Admin@123'),
        first_name='Admin',
        last_name='User',
        user_type='admin',
        email_verified=True
    )
    db.session.add(admin)
    
    # Create programs
    programs = [
        Program(
            name='Bachelor of Engineering',
            description='4-year engineering program',
            code='BTech-ENG',
            duration_years=4,
            total_credits=120,
            minimum_gpa=2.5,
            fees_per_semester=50000,
            level='bachelor'
        ),
        # Add more programs...
    ]
    db.session.add_all(programs)
    
    # Commit changes
    db.session.commit()
    print("Database seeded successfully!")

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        seed_database()
```

Run seeding:
```bash
python -m app.seeds
```

---

## 4. PROJECT STRUCTURE VALIDATION

### 4.1 Verify Backend Structure

```bash
cd backend
tree -I '__pycache__|*.pyc|venv'
```

Expected output:
```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── middleware/
│   └── database.py
├── migrations/
├── tests/
├── requirements.txt
├── .env.example
├── run.py
└── README.md
```

### 4.2 Verify Frontend Structure

```bash
cd frontend
tree -I 'node_modules|dist'
```

Expected output:
```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── context/
│   ├── utils/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
├── vite.config.js
├── .env.example
└── README.md
```

---

## 5. TESTING SETUP

### 5.1 Backend Testing

```bash
# Activate virtual environment
source venv/bin/activate  # or venv\Scripts\activate

# Install pytest
pip install pytest pytest-cov

# Create test file: backend/tests/test_auth.py
# Run tests
pytest tests/ -v --cov=app

# Run specific test
pytest tests/test_auth.py -v
```

### 5.2 Frontend Testing

```bash
# Install testing library
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Create test file: src/__tests__/components/LoginForm.test.jsx
# Run tests
npm run test
```

---

## 6. COMMON COMMANDS

### Backend Commands

```bash
# Activate virtual environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate  # Windows

# Run development server
flask run

# Create database migration
flask db migrate -m "Description"

# Apply migrations
flask db upgrade

# Rollback migration
flask db downgrade

# Run tests
pytest tests/ -v
```

### Frontend Commands

```bash
# Start development server
npm run dev

# Build for production
npm build

# Preview production build
npm run preview

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

---

## 7. TROUBLESHOOTING

### Issue: "ModuleNotFoundError: No module named 'flask'"
**Solution:**
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: "Error 1045 (28000): Access denied for user"
**Solution:**
```bash
mysql -u root -p
UPDATE mysql.user SET authentication_string=PASSWORD('new_password') WHERE User='root';
FLUSH PRIVILEGES;
```

### Issue: "CORS policy: Cross-Origin Request Blocked"
**Solution:**
- Check CORS_ORIGINS in `.env`
- Verify frontend URL matches CORS configuration
- Restart backend server

### Issue: "404 Not Found" when accessing API endpoints
**Solution:**
- Check if backend server is running on port 5000
- Verify API endpoint path in frontend service
- Check route configuration in backend

### Issue: "Port 5000/5173 already in use"
**Solution:**
```bash
# Find process using port
# Windows:
netstat -ano | findstr :5000

# macOS/Linux:
lsof -i :5000

# Kill process
# Windows:
taskkill /PID <PID> /F

# macOS/Linux:
kill -9 <PID>
```

---

## 8. QUICK START SCRIPT

Create `quick-start.sh` (macOS/Linux) or `quick-start.bat` (Windows):

**quick-start.sh:**
```bash
#!/bin/bash

# Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask db upgrade
flask run &

# Frontend setup
cd ../frontend
npm install
npm run dev &

echo "V-Assist is running!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
```

**quick-start.bat:**
```batch
@echo off

REM Backend setup
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
flask db upgrade
start flask run

REM Frontend setup
cd ../frontend
call npm install
start npm run dev

echo V-Assist is running!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
```

---

## 9. PRODUCTION DEPLOYMENT

### 9.1 Backend Production Settings

Update `backend/app/config.py` for production:

```python
class ProductionConfig:
    FLASK_ENV = 'production'
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.environ.get('SECRET_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_POOL_SIZE = 20
    SQLALCHEMY_POOL_TIMEOUT = 30
    SQLALCHEMY_POOL_RECYCLE = 1800
    SQLALCHEMY_ECHO = False
```

### 9.2 Frontend Production Build

```bash
# Create optimized production build
npm run build

# Output: dist/ folder (deploy this to web server)
```

### 9.3 Using Gunicorn

```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn (4 workers)
gunicorn -w 4 -b 0.0.0.0:8000 app:app

# Or with nginx as reverse proxy
# Configure nginx to forward requests to Gunicorn
```

---

## 10. NEXT STEPS

1. ✅ Complete database schema implementation
2. ✅ Model definitions matching schema
3. ✅ API route implementation
4. ✅ Service layer business logic
5. ✅ Frontend component development
6. ✅ API integration testing
7. ✅ End-to-end testing
8. ✅ Deployment pipeline
9. ✅ Monitoring and logging setup
10. ✅ Performance optimization

---

**Setup Complete!** Your V-Assist system is ready for development.

For more detailed information, refer to:
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

