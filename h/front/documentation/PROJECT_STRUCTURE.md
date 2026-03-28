# AI-based Student Support System - Project Structure

## Overview
This document outlines the complete project structure for the AI-based Student Support and Communication System using React (Vite) frontend, Flask backend, and MySQL database.

---

## 1. Frontend Project Structure (React + Vite)

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── admission/
│   │   │   ├── ProgramInfo.jsx
│   │   │   ├── EligibilityChecker.jsx
│   │   │   ├── ApplicationTracker.jsx
│   │   │   └── ApplicationForm.jsx
│   │   ├── academic/
│   │   │   ├── CourseRegistration.jsx
│   │   │   ├── CreditRequirements.jsx
│   │   │   ├── AcademicCalendar.jsx
│   │   │   └── CourseDetail.jsx
│   │   ├── financial/
│   │   │   ├── FeeInformation.jsx
│   │   │   ├── ScholarshipSearch.jsx
│   │   │   ├── LoanAssistance.jsx
│   │   │   └── FinancialAid.jsx
│   │   ├── campus/
│   │   │   ├── HostelInfo.jsx
│   │   │   ├── TransportationSchedule.jsx
│   │   │   ├── CampusNavigation.jsx
│   │   │   └── CampusMap.jsx
│   │   ├── mental-health/
│   │   │   ├── CounselingBooking.jsx
│   │   │   ├── StressManagement.jsx
│   │   │   ├── CounselorList.jsx
│   │   │   └── SessionHistory.jsx
│   │   ├── chatbot/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   ├── VoiceInput.jsx
│   │   │   ├── LanguageSelector.jsx
│   │   │   └── ChatInterface.jsx
│   │   └── faq/
│   │       ├── FAQList.jsx
│   │       ├── FAQSearch.jsx
│   │       └── FAQCategory.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── AdmissionPortal.jsx
│   │   ├── AcademicPortal.jsx
│   │   ├── FinancialPortal.jsx
│   │   ├── CampusPortal.jsx
│   │   ├── MentalHealthPortal.jsx
│   │   ├── ChatbotPage.jsx
│   │   ├── FAQPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── NotFoundPage.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── admissionService.js
│   │   ├── academicService.js
│   │   ├── financialService.js
│   │   ├── campusService.js
│   │   ├── mentalHealthService.js
│   │   ├── chatbotService.js
│   │   ├── voiceService.js
│   │   └── translationService.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── useVoiceInput.js
│   │   └── useNotification.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── LanguageContext.jsx
│   │   └── NotificationContext.jsx
│   ├── utils/
│   │   ├── constants.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── localStorage.js
│   │   └── logger.js
│   ├── styles/
│   │   ├── index.css
│   │   ├── variables.css
│   │   ├── components.css
│   │   └── responsive.css
│   ├── App.jsx
│   └── main.jsx
├── public/
│   ├── images/
│   ├── icons/
│   └── favicon.ico
├── .env.example
├── .gitignore
├── vite.config.js
├── package.json
└── README.md
```

---

## 2. Backend Project Structure (Flask + Python)

```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── student.py
│   │   ├── program.py
│   │   ├── application.py
│   │   ├── course.py
│   │   ├── enrollment.py
│   │   ├── fee.py
│   │   ├── scholarship.py
│   │   ├── hostel.py
│   │   ├── transportation.py
│   │   ├── counselor.py
│   │   ├── counseling_session.py
│   │   ├── faq.py
│   │   ├── chat_message.py
│   │   └── sentiment_analysis.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth_routes.py
│   │   ├── admission_routes.py
│   │   ├── academic_routes.py
│   │   ├── financial_routes.py
│   │   ├── campus_routes.py
│   │   ├── mental_health_routes.py
│   │   ├── chatbot_routes.py
│   │   ├── user_routes.py
│   │   └── faq_routes.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── admission_service.py
│   │   ├── academic_service.py
│   │   ├── financial_service.py
│   │   ├── campus_service.py
│   │   ├── mental_health_service.py
│   │   ├── chatbot_service.py
│   │   ├── ai_service.py
│   │   ├── sentiment_service.py
│   │   ├── translation_service.py
│   │   ├── voice_service.py
│   │   └── email_service.py
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── decorators.py
│   │   ├── validators.py
│   │   ├── helpers.py
│   │   ├── constants.py
│   │   ├── jwt_handler.py
│   │   └── logger.py
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── auth_middleware.py
│   │   ├── error_handler.py
│   │   └── request_validator.py
│   └── database.py
├── migrations/
│   └── versions/
│       └── (Alembic migration files)
├── tests/
│   ├── __init__.py
│   ├── test_auth.py
│   ├── test_admission.py
│   ├── test_academic.py
│   ├── test_financial.py
│   ├── test_campus.py
│   ├── test_mental_health.py
│   └── test_chatbot.py
├── requirements.txt
├── .env.example
├── .gitignore
├── run.py
├── wsgi.py
└── README.md
```

---

## 3. Database Structure (MySQL)

### Tables Overview
1. **users** - Authentication and user information
2. **students** - Student-specific information
3. **programs** - Degree/certification programs
4. **applications** - Student applications
5. **courses** - Course information
6. **enrollments** - Student-course enrollments
7. **fees** - Fee structures
8. **scholarships** - Scholarship information
9. **hostels** - Hostel information
10. **transportation** - Transportation schedules
11. **counselors** - Mental health counselors
12. **counseling_sessions** - Counseling appointments
13. **faqs** - FAQ database
14. **chat_messages** - Chat history
15. **sentiment_analysis** - Sentiment records

---

## 4. Root Project Files

```
V-Assist/
├── backend/
│   ├── app/
│   ├── migrations/
│   ├── tests/
│   ├── requirements.txt
│   ├── .env.example
│   ├── run.py
│   └── README.md
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── README.md
├── documentation/
│   ├── PROJECT_STRUCTURE.md
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── SETUP_GUIDE.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── CONFIGURATION.md
├── .gitignore
└── README.md
```

---

## 5. Configuration Files

### .env Example (Backend)
```
FLASK_ENV=development
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=mysql+pymysql://user:password@localhost/v_assist_db
JWT_SECRET_KEY=your-jwt-secret-key
JWT_EXPIRATION_HOURS=24

# Email Configuration (SMTP for Password Reset)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-password
MAIL_DEFAULT_SENDER=noreply@v-assist.com

# External APIs (Required)
# 1. OpenAI Whisper (Speech-to-Text)
OPENAI_API_KEY=sk-your-key
WHISPER_MODEL=whisper-1

# 2. Google Gemini (Advanced AI Chatbot)
GOOGLE_GEMINI_API_KEY=your-key
GEMINI_MODEL=gemini-pro

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/app.log
```

### .env Example (Frontend)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_CHATBOT_API_URL=http://localhost:5000/api/chatbot
VITE_APP_NAME=V-Assist
VITE_APP_VERSION=1.0.0
VITE_VOICE_ENABLED=true
VITE_DEFAULT_LANGUAGE=en
```

---

## 6. Key Principles

- **Modularity**: Each feature has separate routes, services, and components
- **Scalability**: Services layer abstracts business logic from routes
- **Maintainability**: Clear separation of concerns
- **Testing**: Each module has corresponding test files
- **Documentation**: Inline comments and comprehensive docs
- **Error Handling**: Centralized middleware for error handling
- **Security**: JWT-based authentication, input validation
- **Performance**: Caching, efficient queries, pagination

---

## 7. Development Workflow

1. **Development Environment Setup**
   - Install dependencies (Backend: pip, Frontend: npm)
   - Configure environment variables
   - Set up MySQL database

2. **Database Setup**
   - Run migrations
   - Seed initial data

3. **Backend Development**
   - Start Flask server (port 5000)
   - Implement APIs according to specification

4. **Frontend Development**
   - Start Vite dev server (port 5173)
   - Consume backend APIs

5. **Testing**
   - Unit tests for services
   - Integration tests for routes
   - End-to-end tests for workflows

---

## 8. Deployment Structure

```
production/
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
├── nginx.conf
└── scripts/
    ├── deploy.sh
    ├── backup.sh
    └── monitoring.sh
```

This structure ensures clean separation between frontend, backend, and documentation while maintaining scalability and maintainability.
