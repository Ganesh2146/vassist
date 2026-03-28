# API Documentation - V-Assist

## Base URL
- **Backend Server**: `http://localhost:5000`
- **API Base Path**: `http://localhost:5000/api`
- **Frontend Server**: `http://localhost:5173`

---

## 1. AUTHENTICATION ENDPOINTS

### 1.1 User Registration
**Frontend Request:**
```
POST /api/auth/register
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "phone": "+1234567890",
  "date_of_birth": "2000-05-15",
  "user_type": "student"  // student, admin, counselor, staff
}
```

**Backend Endpoint:**
```python
@auth_routes.route('/register', methods=['POST'])
def register()
```

**Backend Response (Success - 201):**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user_id": 1,
    "email": "john@example.com",
    "user_type": "student",
    "created_at": "2026-03-14T10:30:00Z"
  }
}
```

**Backend Response (Error - 400):**
```json
{
  "status": "error",
  "message": "Email already exists",
  "errors": {
    "email": "Email already registered"
  }
}
```

---

### 1.2 User Login
**Frontend Request:**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Backend Endpoint:**
```python
@auth_routes.route('/login', methods=['POST'])
def login()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "user_id": 1,
      "email": "john@example.com",
      "first_name": "John",
      "user_type": "student",
      "profile_complete": true
    },
    "expires_in": 86400
  }
}
```

---

### 1.3 Logout
**Frontend Request:**
```
POST /api/auth/logout
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@auth_routes.route('/logout', methods=['POST'])
@token_required
def logout()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

---

### 1.4 Refresh Token
**Frontend Request:**
```
POST /api/auth/refresh
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@auth_routes.route('/refresh', methods=['POST'])
@token_required
def refresh_token()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 86400
  }
}
```

---

### 1.5 Forgot Password (Request OTP)
**Frontend Request:**
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Backend Endpoint:**
```python
@auth_routes.route('/forgot-password', methods=['POST'])
def forgot_password()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "message": "OTP sent to your email",
  "data": {
    "email": "john@example.com",
    "otp_expires_in": 600,
    "message": "Check your email for 6-digit OTP"
  }
}
```

**Backend Service:**
- Generates 6-digit OTP
- Sends OTP via SMTP email
- OTP expires in 10 minutes
- Stores OTP in database with timestamp

---

### 1.6 Verify OTP
**Frontend Request:**
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Backend Endpoint:**
```python
@auth_routes.route('/verify-otp', methods=['POST'])
def verify_otp()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "message": "OTP verified successfully",
  "data": {
    "reset_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 1800,
    "message": "Use this token to reset password"
  }
}
```

**Backend Response (Error - 400):**
```json
{
  "status": "error",
  "message": "Invalid or expired OTP"
}
```

---

### 1.7 Reset Password
**Frontend Request:**
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "reset_token": "eyJhbGciOiJIUzI1NiIs...",
  "new_password": "NewPassword123!",
  "confirm_password": "NewPassword123!"
}
```

**Backend Endpoint:**
```python
@auth_routes.route('/reset-password', methods=['POST'])
def reset_password()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "message": "Password reset successfully",
  "data": {
    "email": "john@example.com",
    "message": "You can now login with your new password"
  }
}
```

**Backend Service:**
- Validates reset token
- Checks password strength
- Hashes new password with bcrypt
- Updates user record
- Invalidates all existing tokens

---

## 2. ADMISSION ENDPOINTS

### 2.1 Get All Programs
**Frontend Request:**
```
GET /api/admission/programs?page=1&limit=10&search=engineering
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@admission_routes.route('/programs', methods=['GET'])
@token_required
def get_programs()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "programs": [
      {
        "program_id": 1,
        "name": "Bachelor of Engineering",
        "description": "4-year engineering program",
        "duration_years": 4,
        "total_credits": 120,
        "entry_qualification": "12th Pass",
        "minimum_gpa": 3.0,
        "intake": 100,
        "available_seats": 45,
        "department": "Engineering",
        "fees_per_semester": 50000
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 10
  }
}
```

---

### 2.2 Get Program Details
**Frontend Request:**
```
GET /api/admission/programs/{program_id}
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@admission_routes.route('/programs/<int:program_id>', methods=['GET'])
@token_required
def get_program_details(program_id)
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "program_id": 1,
    "name": "Bachelor of Engineering",
    "description": "4-year engineering program",
    "duration_years": 4,
    "total_credits": 120,
    "entry_qualification": "12th Pass",
    "minimum_gpa": 3.0,
    "intake": 100,
    "available_seats": 45,
    "department": "Engineering",
    "fees_per_semester": 50000,
    "curriculum": [
      {
        "semester": 1,
        "courses": [
          {
            "course_code": "ENG101",
            "course_name": "Physics-I",
            "credits": 4
          }
        ]
      }
    ]
  }
}
```

---

### 2.3 Check Eligibility
**Frontend Request:**
```
POST /api/admission/eligibility-check
Authorization: Bearer {token}
Content-Type: application/json

{
  "program_id": 1,
  "qualification": "12th Pass",
  "gpa": 3.5,
  "passing_year": 2024
}
```

**Backend Endpoint:**
```python
@admission_routes.route('/eligibility-check', methods=['POST'])
@token_required
def check_eligibility()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "eligible": true,
    "program_id": 1,
    "program_name": "Bachelor of Engineering",
    "reason": "You meet all eligibility criteria",
    "matching_criteria": {
      "qualification": true,
      "gpa": true,
      "age": true
    }
  }
}
```

---

### 2.4 Submit Application
**Frontend Request:**
```
POST /api/admission/applications
Authorization: Bearer {token}
Content-Type: application/json

{
  "program_id": 1,
  "personal_statement": "I am interested in engineering...",
  "expected_graduation_year": 2028,
  "high_school_gpa": 3.7,
  "test_scores": {
    "entrance_exam": "JEE",
    "score": 95,
    "percentile": 85
  },
  "documents": {
    "transcript_url": "https://storage.example.com/transcript_1.pdf",
    "id_proof_url": "https://storage.example.com/id_1.pdf",
    "recommendation_letters": ["https://storage.example.com/rec1.pdf"]
  }
}
```

**Backend Endpoint:**
```python
@admission_routes.route('/applications', methods=['POST'])
@token_required
def submit_application()
```

**Backend Response (Success - 201):**
```json
{
  "status": "success",
  "message": "Application submitted successfully",
  "data": {
    "application_id": 101,
    "student_id": 5,
    "program_id": 1,
    "status": "submitted",
    "submission_date": "2026-03-14T10:30:00Z",
    "expected_decision_date": "2026-04-14T10:30:00Z"
  }
}
```

---

### 2.5 Track Application
**Frontend Request:**
```
GET /api/admission/applications/{application_id}
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@admission_routes.route('/applications/<int:application_id>', methods=['GET'])
@token_required
def track_application(application_id)
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "application_id": 101,
    "program_name": "Bachelor of Engineering",
    "status": "under_review",
    "submission_date": "2026-03-14T10:30:00Z",
    "timeline": [
      {
        "status": "submitted",
        "timestamp": "2026-03-14T10:30:00Z"
      },
      {
        "status": "under_review",
        "timestamp": "2026-03-15T14:00:00Z"
      }
    ],
    "current_stage": "application_review",
    "estimated_completion": "2026-04-14T10:30:00Z"
  }
}
```

---

### 2.6 Get Student Applications
**Frontend Request:**
```
GET /api/admission/my-applications?status=all
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@admission_routes.route('/my-applications', methods=['GET'])
@token_required
def get_student_applications()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "applications": [
      {
        "application_id": 101,
        "program_name": "Bachelor of Engineering",
        "status": "accepted",
        "submission_date": "2026-03-14T10:30:00Z"
      }
    ],
    "total": 3
  }
}
```

---

## 3. ACADEMIC ENDPOINTS

### 3.1 Get Available Courses
**Frontend Request:**
```
GET /api/academic/courses?semester=1&limit=20&page=1
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@academic_routes.route('/courses', methods=['GET'])
@token_required
def get_courses()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "courses": [
      {
        "course_id": 1,
        "course_code": "ENG101",
        "course_name": "Physics-I",
        "description": "Introduction to Physics",
        "credits": 4,
        "semester": 1,
        "instructor": "Dr. Smith",
        "schedule": {
          "days": ["Monday", "Wednesday", "Friday"],
          "time": "09:00-10:30",
          "location": "Building A, Room 101"
        },
        "capacity": 60,
        "enrolled_students": 58,
        "prerequisites": [],
        "grading_scheme": "Letter Grade"
      }
    ],
    "total": 25,
    "page": 1
  }
}
```

---

### 3.2 Get Course Details
**Frontend Request:**
```
GET /api/academic/courses/{course_id}
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@academic_routes.route('/courses/<int:course_id>', methods=['GET'])
@token_required
def get_course_details(course_id)
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "course_id": 1,
    "course_code": "ENG101",
    "course_name": "Physics-I",
    "description": "Introduction to Physics",
    "credits": 4,
    "semester": 1,
    "instructor": {
      "instructor_id": 10,
      "name": "Dr. Smith",
      "email": "smith@university.edu",
      "office_hours": "Monday 2-4 PM"
    },
    "schedule": {
      "days": ["Monday", "Wednesday", "Friday"],
      "time": "09:00-10:30",
      "location": "Building A, Room 101"
    },
    "capacity": 60,
    "enrolled_students": 58,
    "prerequisites": [],
    "learning_outcomes": [
      "Understand basic physics concepts"
    ],
    "textbooks": [],
    "assessment": {
      "assignments": 20,
      "midterm": 30,
      "final": 50
    }
  }
}
```

---

### 3.3 Enroll in Course
**Frontend Request:**
```
POST /api/academic/enrollments
Authorization: Bearer {token}
Content-Type: application/json

{
  "course_id": 1,
  "semester": 1
}
```

**Backend Endpoint:**
```python
@academic_routes.route('/enrollments', methods=['POST'])
@token_required
def enroll_in_course()
```

**Backend Response (Success - 201):**
```json
{
  "status": "success",
  "message": "Enrolled successfully",
  "data": {
    "enrollment_id": 50,
    "course_id": 1,
    "course_name": "Physics-I",
    "enrollment_date": "2026-03-14T10:30:00Z",
    "status": "active",
    "grade": null
  }
}
```

---

### 3.4 Get Student Enrollments
**Frontend Request:**
```
GET /api/academic/my-enrollments?semester=1
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@academic_routes.route('/my-enrollments', methods=['GET'])
@token_required
def get_student_enrollments()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "enrollments": [
      {
        "enrollment_id": 50,
        "course_id": 1,
        "course_code": "ENG101",
        "course_name": "Physics-I",
        "instructor": "Dr. Smith",
        "semester": 1,
        "credits": 4,
        "enrollment_date": "2026-03-14T10:30:00Z",
        "status": "active",
        "grade": null,
        "attendance": 95
      }
    ],
    "total_credits": 16,
    "total_enrolled": 4
  }
}
```

---

### 3.5 Get Credit Requirements
**Frontend Request:**
```
GET /api/academic/credit-requirements?program_id=1
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@academic_routes.route('/credit-requirements', methods=['GET'])
@token_required
def get_credit_requirements()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "program_id": 1,
    "program_name": "Bachelor of Engineering",
    "total_credits_required": 120,
    "credits_completed": 45,
    "credits_enrolled": 16,
    "credits_remaining": 59,
    "completion_percentage": 37.5,
    "core_credits_required": 80,
    "core_credits_completed": 35,
    "elective_credits_required": 20,
    "elective_credits_completed": 10,
    "progress": [
      {
        "semester": 1,
        "credits": 16,
        "gpa": 3.8
      },
      {
        "semester": 2,
        "credits": 16,
        "gpa": 3.7
      },
      {
        "semester": 3,
        "credits": 13,
        "gpa": 3.6
      }
    ]
  }
}
```

---

### 3.6 Get Academic Calendar
**Frontend Request:**
```
GET /api/academic/calendar?year=2026&semester=1
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@academic_routes.route('/calendar', methods=['GET'])
@token_required
def get_academic_calendar()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "year": 2026,
    "semester": 1,
    "events": [
      {
        "event_id": 1,
        "title": "Semester Start",
        "date": "2026-01-15",
        "description": "Spring Semester begins",
        "event_type": "academic"
      },
      {
        "event_id": 2,
        "title": "Mid-term Exam",
        "date": "2026-03-01",
        "event_type": "exam"
      },
      {
        "event_id": 3,
        "title": "Final Exam",
        "date": "2026-05-15",
        "event_type": "exam"
      }
    ],
    "important_dates": {
      "semester_start": "2026-01-15",
      "semester_end": "2026-05-30",
      "last_enrollment_date": "2026-01-22",
      "last_drop_date": "2026-02-01"
    }
  }
}
```

---

## 4. FINANCIAL ENDPOINTS

### 4.1 Get Fee Information
**Frontend Request:**
```
GET /api/financial/fee-information?program_id=1
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@financial_routes.route('/fee-information', methods=['GET'])
@token_required
def get_fee_information()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "program_id": 1,
    "program_name": "Bachelor of Engineering",
    "total_program_cost": 800000,
    "fees_per_semester": 50000,
    "fee_structure": [
      {
        "fee_type": "Tuition",
        "amount": 40000,
        "percentage": 80
      },
      {
        "fee_type": "Lab Fee",
        "amount": 5000,
        "percentage": 10
      },
      {
        "fee_type": "Registration",
        "amount": 5000,
        "percentage": 10
      }
    ],
    "payment_schedule": [
      {
        "semester": 1,
        "due_date": "2026-01-20",
        "amount": 50000
      }
    ],
    "accepted_payment_methods": ["Bank Transfer", "Online Portal", "Check"],
    "installation_available": true,
    "late_fee_percentage": 2
  }
}
```

---

### 4.2 Get Student Fee Status
**Frontend Request:**
```
GET /api/financial/fee-status
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@financial_routes.route('/fee-status', methods=['GET'])
@token_required
def get_fee_status()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "student_id": 5,
    "total_fee_due": 150000,
    "total_paid": 50000,
    "pending_amount": 100000,
    "fee_breakdown": [
      {
        "semester": 1,
        "due_date": "2026-01-20",
        "amount": 50000,
        "paid": 50000,
        "status": "paid",
        "payment_date": "2026-01-15"
      },
      {
        "semester": 2,
        "due_date": "2026-06-20",
        "amount": 50000,
        "paid": 0,
        "status": "pending",
        "days_until_due": 98
      }
    ],
    "payment_history": [
      {
        "transaction_id": "TXN123",
        "amount": 50000,
        "date": "2026-01-15",
        "method": "Bank Transfer",
        "receipt_url": "https://storage.example.com/receipt_1.pdf"
      }
    ]
  }
}
```

---

### 4.3 Search Scholarships
**Frontend Request:**
```
GET /api/financial/scholarships?search=merit&page=1&limit=10
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@financial_routes.route('/scholarships', methods=['GET'])
@token_required
def search_scholarships()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "scholarships": [
      {
        "scholarship_id": 1,
        "name": "Merit Scholarship",
        "description": "For students with excellent academic records",
        "amount": 50000,
        "currency": "INR",
        "duration": "Full 4 years",
        "eligibility": {
          "minimum_gpa": 3.8,
          "test_score": "Above 90%",
          "family_income": "No limit"
        },
        "deadline": "2026-04-15",
        "coverage": "Tuition + Hostel",
        "number_of_awards": 10,
        "application_url": "#",
        "contact_email": "scholarships@university.edu"
      }
    ],
    "total": 25,
    "page": 1
  }
}
```

---

### 4.4 Get Loan Assistance Information
**Frontend Request:**
```
GET /api/financial/loan-assistance
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@financial_routes.route('/loan-assistance', methods=['GET'])
@token_required
def get_loan_assistance()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "loan_programs": [
      {
        "loan_id": 1,
        "name": "Education Loan",
        "lender": "SBI",
        "loan_amount_max": 1000000,
        "interest_rate": 6.5,
        "repayment_period_years": 15,
        "processing_fee": 2000,
        "moratorium_period_months": 6,
        "eligibility": {
          "minimum_gpa": 2.5,
          "age": "18-35 years",
          "parent_income": "No limit"
        },
        "required_documents": [
          "Identity Proof",
          "Income Certificate",
          "Academic Records",
          "Co-applicant Details"
        ],
        "application_process": "Online or Offline",
        "contact_phone": "+91-XXXXXXXXXX"
      }
    ]
  }
}
```

---

## 5. CAMPUS ENDPOINTS

### 5.1 Get Hostel Information
**Frontend Request:**
```
GET /api/campus/hostels?gender=coed&page=1&limit=10
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@campus_routes.route('/hostels', methods=['GET'])
@token_required
def get_hostels()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "hostels": [
      {
        "hostel_id": 1,
        "name": "Boys Hostel A",
        "gender": "male",
        "total_capacity": 200,
        "available_rooms": 15,
        "room_types": [
          {
            "type": "Single Occupancy",
            "capacity": 1,
            "cost_per_month": 5000,
            "available": 5
          },
          {
            "type": "Double Occupancy",
            "capacity": 2,
            "cost_per_month": 7500,
            "available": 10
          }
        ],
        "amenities": [
          "WiFi",
          "Water Supply",
          "Electricity",
          "Laundry",
          "Common Hall"
        ],
        "mess_available": true,
        "mess_cost_per_month": 3000,
        "check_in_date": "2026-01-15",
        "visiting_hours": "9:00 AM - 9:00 PM",
        "video_tour_url": "https://youtube.example.com/hostel"
      }
    ],
    "total": 8,
    "page": 1
  }
}
```

---

### 5.2 Apply for Hostel
**Frontend Request:**
```
POST /api/campus/hostel-applications
Authorization: Bearer {token}
Content-Type: application/json

{
  "hostel_id": 1,
  "room_type": "Double Occupancy",
  "roommate_preference": null,
  "special_requirements": "Ground floor due to medical reasons",
  "check_in_date": "2026-01-15"
}
```

**Backend Endpoint:**
```python
@campus_routes.route('/hostel-applications', methods=['POST'])
@token_required
def apply_for_hostel()
```

**Backend Response (Success - 201):**
```json
{
  "status": "success",
  "message": "Hostel application submitted",
  "data": {
    "application_id": 201,
    "hostel_id": 1,
    "hostel_name": "Boys Hostel A",
    "room_type": "Double Occupancy",
    "status": "under_review",
    "submission_date": "2026-03-14T10:30:00Z",
    "monthly_cost": 7500,
    "estimated_decision_date": "2026-03-25T10:30:00Z"
  }
}
```

---

### 5.3 Get Transportation Schedules
**Frontend Request:**
```
GET /api/campus/transportation?from=city_center&to=campus&date=2026-03-14
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@campus_routes.route('/transportation', methods=['GET'])
@token_required
def get_transportation_schedules()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "routes": [
      {
        "route_id": 1,
        "name": "City Center to Campus",
        "from": "City Center Bus Stand",
        "to": "Main Campus Gate",
        "distance_km": 15,
        "schedules": [
          {
            "schedule_id": 1,
            "departure_time": "06:00 AM",
            "arrival_time": "06:45 AM",
            "duration_minutes": 45,
            "vehicle_type": "Bus",
            "capacity": 50,
            "available_seats": 20,
            "cost_per_trip": 50,
            "monthly_pass": 1000
          },
          {
            "schedule_id": 2,
            "departure_time": "07:00 AM",
            "arrival_time": "07:45 AM",
            "duration_minutes": 45,
            "vehicle_type": "Bus",
            "capacity": 50,
            "available_seats": 15,
            "cost_per_trip": 50,
            "monthly_pass": 1000
          }
        ]
      }
    ]
  }
}
```

---

### 5.4 Get Campus Map
**Frontend Request:**
```
GET /api/campus/map?building=all
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@campus_routes.route('/map', methods=['GET'])
@token_required
def get_campus_map()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "buildings": [
      {
        "building_id": 1,
        "name": "Engineering Block",
        "coordinates": {
          "latitude": 28.5355,
          "longitude": 77.1910
        },
        "departments": ["Civil", "Mechanical", "Electrical"],
        "facilities": ["Classrooms", "Labs", "Library"],
        "map_image_url": "https://storage.example.com/building_1.png"
      }
    ],
    "map_image_url": "https://storage.example.com/campus_map.png"
  }
}
```

---

## 6. MENTAL HEALTH ENDPOINTS

### 6.1 Get Counselors
**Frontend Request:**
```
GET /api/mental-health/counselors?specialization=stress&page=1&limit=10
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@mental_health_routes.route('/counselors', methods=['GET'])
@token_required
def get_counselors()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "counselors": [
      {
        "counselor_id": 1,
        "name": "Dr. Sarah Watson",
        "title": "M.Sc. Counseling Psychology",
        "specialization": ["Stress Management", "Academic Anxiety", "Career Guidance"],
        "experience_years": 8,
        "email": "sarah.watson@university.edu",
        "phone": "+91-XXXXXXXXXX",
        "bio": "Experienced counselor specializing in student mental health",
        "availability": {
          "monday": ["10:00-12:00", "14:00-16:00"],
          "wednesday": ["10:00-12:00", "14:00-16:00"],
          "friday": ["10:00-12:00", "14:00-16:00"]
        },
        "languages": ["English", "Hindi"],
        "profile_image_url": "https://storage.example.com/counselor_1.jpg",
        "next_available_slot": "2026-03-16T10:00:00Z"
      }
    ],
    "total": 12,
    "page": 1
  }
}
```

---

### 6.2 Book Counseling Session
**Frontend Request:**
```
POST /api/mental-health/sessions
Authorization: Bearer {token}
Content-Type: application/json

{
  "counselor_id": 1,
  "preferred_date": "2026-03-16",
  "preferred_time": "10:00",
  "session_type": "online",  // online, in-person
  "issue_type": "stress_management",
  "description": "Feeling stressed about upcoming exams"
}
```

**Backend Endpoint:**
```python
@mental_health_routes.route('/sessions', methods=['POST'])
@token_required
def book_counseling_session()
```

**Backend Response (Success - 201):**
```json
{
  "status": "success",
  "message": "Counseling session booked successfully",
  "data": {
    "session_id": 301,
    "counselor_name": "Dr. Sarah Watson",
    "session_date": "2026-03-16",
    "session_time": "10:00-10:50",
    "session_type": "online",
    "meeting_link": "https://zoom.us/meeting_id",
    "status": "confirmed",
    "booking_date": "2026-03-14T10:30:00Z",
    "reminder_sent": true
  }
}
```

---

### 6.3 Get Counseling Sessions
**Frontend Request:**
```
GET /api/mental-health/my-sessions?status=all&limit=10
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@mental_health_routes.route('/my-sessions', methods=['GET'])
@token_required
def get_student_sessions()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "sessions": [
      {
        "session_id": 301,
        "counselor_name": "Dr. Sarah Watson",
        "session_date": "2026-03-16",
        "session_time": "10:00-10:50",
        "session_type": "online",
        "status": "confirmed",
        "issue_type": "stress_management",
        "notes": null
      },
      {
        "session_id": 300,
        "counselor_name": "Dr. John Smith",
        "session_date": "2026-03-10",
        "session_time": "14:00-14:50",
        "session_type": "in-person",
        "status": "completed",
        "issue_type": "academic_anxiety",
        "notes": "Good progress. Continue with relaxation techniques."
      }
    ],
    "total": 5
  }
}
```

---

### 6.4 Get Stress Management Resources
**Frontend Request:**
```
GET /api/mental-health/resources?category=stress_management
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@mental_health_routes.route('/resources', methods=['GET'])
@token_required
def get_mental_health_resources()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "resources": [
      {
        "resource_id": 1,
        "title": "Deep Breathing Techniques",
        "category": "stress_management",
        "description": "Learn effective breathing exercises",
        "content_type": "video",
        "url": "https://youtube.example.com/breathing",
        "duration_minutes": 15,
        "created_date": "2025-01-10"
      },
      {
        "resource_id": 2,
        "title": "Meditation for Students",
        "category": "stress_management",
        "description": "Guided meditation sessions",
        "content_type": "article",
        "url": "https://storage.example.com/meditation.pdf",
        "created_date": "2025-02-15"
      }
    ],
    "total": 20
  }
}
```

---

## 7. CHATBOT ENDPOINTS

### 7.1 Send Chat Message
**Frontend Request:**
```
POST /api/chatbot/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "What is the eligibility for the engineering program?",
  "language": "en",
  "session_id": "sess_12345",
  "context": "admission"  // Optional: admission, academic, financial, campus, mental-health
}
```

**Backend Endpoint:**
```python
@chatbot_routes.route('/messages', methods=['POST'])
@token_required
def send_chat_message()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "message_id": 501,
    "user_message": "What is the eligibility for the engineering program?",
    "bot_response": "The Engineering program requires 12th pass with minimum 3.0 GPA. You need to have studied physics and mathematics in 12th grade. Is there anything specific about eligibility you'd like to know?",
    "language": "en",
    "sentiment": "neutral",
    "confidence": 0.95,
    "session_id": "sess_12345",
    "timestamp": "2026-03-14T10:30:00Z",
    "suggestions": [
      "Tell me about admission process",
      "Show application deadlines",
      "Connect with admission counselor"
    ]
  }
}
```

---

### 7.2 Get Chat History
**Frontend Request:**
```
GET /api/chatbot/history?session_id=sess_12345&limit=20
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@chatbot_routes.route('/history', methods=['GET'])
@token_required
def get_chat_history()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "messages": [
      {
        "message_id": 500,
        "user_message": "Hello, I need help with admission",
        "bot_response": "Hello! Welcome to V-Assist. I'm here to help you...",
        "timestamp": "2026-03-14T10:20:00Z",
        "sentiment": "positive"
      },
      {
        "message_id": 501,
        "user_message": "What is the eligibility for the engineering program?",
        "bot_response": "The Engineering program requires...",
        "timestamp": "2026-03-14T10:30:00Z",
        "sentiment": "neutral"
      }
    ],
    "total": 15,
    "session_id": "sess_12345"
  }
}
```

---

### 7.3 Send Voice Message
**Frontend Request:**
```
POST /api/chatbot/voice-message
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "audio": <audio_file>,
  "language": "en",
  "session_id": "sess_12345"
}
```

**Backend Endpoint:**
```python
@chatbot_routes.route('/voice-message', methods=['POST'])
@token_required
def send_voice_message()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "message_id": 502,
    "detected_text": "What programs do you offer?",
    "bot_response": "We offer various programs including...",
    "audio_response_url": "https://storage.example.com/response_502.mp3",
    "session_id": "sess_12345",
    "timestamp": "2026-03-14T10:35:00Z",
    "language": "en"
  }
}
```

---

### 7.4 Translate Message
**Frontend Request:**
```
POST /api/chatbot/translate
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "What is the eligibility for the engineering program?",
  "source_language": "en",
  "target_language": "hi"
}
```

**Backend Endpoint:**
```python
@chatbot_routes.route('/translate', methods=['POST'])
@token_required
def translate_message()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "original_message": "What is the eligibility for the engineering program?",
    "translated_message": "इंजीनियरिंग कार्यक्रम के लिए पात्रता क्या है?",
    "source_language": "en",
    "target_language": "hi"
  }
}
```

---

## 8. FAQ ENDPOINTS

### 8.1 Get FAQs
**Frontend Request:**
```
GET /api/faq?category=admission&search=&page=1&limit=10
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@faq_routes.route('/', methods=['GET'])
@token_required
def get_faqs()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "faqs": [
      {
        "faq_id": 1,
        "question": "What documents do I need for admission?",
        "answer": "You need: Marksheet of 12th grade, Identity proof, Admit card, etc.",
        "category": "admission",
        "helpful_count": 125,
        "created_date": "2025-01-10",
        "updated_date": "2026-01-15"
      }
    ],
    "total": 45,
    "categories": ["admission", "academic", "financial", "campus", "mental-health"]
  }
}
```

---

### 8.2 Search FAQs
**Frontend Request:**
```
GET /api/faq/search?query=fees&limit=10
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@faq_routes.route('/search', methods=['GET'])
@token_required
def search_faqs()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "faqs": [
      {
        "faq_id": 5,
        "question": "How much are the fees?",
        "answer": "Fees are 50,000 per semester...",
        "category": "financial"
      }
    ],
    "total": 8
  }
}
```

---

## 9. USER PROFILE ENDPOINTS

### 9.1 Get User Profile
**Frontend Request:**
```
GET /api/user/profile
Authorization: Bearer {token}
```

**Backend Endpoint:**
```python
@user_routes.route('/profile', methods=['GET'])
@token_required
def get_user_profile()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "data": {
    "user_id": 1,
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "date_of_birth": "2000-05-15",
    "user_type": "student",
    "profile_image_url": "https://storage.example.com/profile_1.jpg",
    "created_at": "2026-01-15T10:30:00Z",
    "last_login": "2026-03-14T09:00:00Z"
  }
}
```

---

### 9.2 Update User Profile
**Frontend Request:**
```
PUT /api/user/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "first_name": "John",
  "phone": "+1234567890",
  "date_of_birth": "2000-05-15"
}
```

**Backend Endpoint:**
```python
@user_routes.route('/profile', methods=['PUT'])
@token_required
def update_user_profile()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "user_id": 1,
    "email": "john@example.com",
    "first_name": "John",
    "phone": "+1234567890",
    "updated_at": "2026-03-14T10:30:00Z"
  }
}
```

---

### 9.3 Change Password
**Frontend Request:**
```
PUT /api/user/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "old_password": "OldPassword123!",
  "new_password": "NewPassword123!",
  "confirm_password": "NewPassword123!"
}
```

**Backend Endpoint:**
```python
@user_routes.route('/change-password', methods=['PUT'])
@token_required
def change_password()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "message": "Password changed successfully"
}
```

---

### 9.4 Delete Account
**Frontend Request:**
```
DELETE /api/user/account
Authorization: Bearer {token}
Content-Type: application/json

{
  "password": "CurrentPassword123!"
}
```

**Backend Endpoint:**
```python
@user_routes.route('/account', methods=['DELETE'])
@token_required
def delete_account()
```

**Backend Response (Success - 200):**
```json
{
  "status": "success",
  "message": "Account deleted successfully. You will be logged out in 5 seconds."
}
```

---

## 10. ERROR RESPONSE FORMAT

All errors follow this standardized format:

```json
{
  "status": "error",
  "message": "Human-readable error message",
  "error_code": "ERROR_CODE",
  "errors": {
    "field_name": "Field-specific error message"
  },
  "timestamp": "2026-03-14T10:30:00Z"
}
```

### Common HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200  | Success | Request completed successfully |
| 201  | Created | Resource created successfully |
| 400  | Bad Request | Invalid input data |
| 401  | Unauthorized | Missing/invalid token |
| 403  | Forbidden | Insufficient permissions |
| 404  | Not Found | Resource not found |
| 409  | Conflict | Resource already exists |
| 422  | Unprocessable | Validation error |
| 500  | Server Error | Internal server error |

---

## 11. AUTHENTICATION

All endpoints (except login/register) require Bearer token in Authorization header:

```
Authorization: Bearer {access_token}
```

Token is obtained from login endpoint and is valid for 24 hours. Use refresh endpoint to get new token.

---

## 12. PAGINATION

For endpoints returning lists, pagination parameters are:

```
?page=1&limit=10
```

Response includes:
- `data`: Array of items
- `total`: Total number of items
- `page`: Current page number
- `limit`: Items per page

---

## 13. FILTERING & SORTING

Common filter parameters:
- `search`: Text search across searchable fields
- `status`: Filter by status
- `category`: Filter by category
- `date_from` / `date_to`: Date range filters
- `sort`: Sort field (prefix with `-` for descending)

Example:
```
GET /api/academic/courses?semester=1&sort=-created_date&limit=20
```

---

## 14. EXTERNAL API INTEGRATIONS

### Email SMTP Service (Password Reset)
**Purpose**: Send OTP emails for password recovery

```python
# Backend Implementation
from flask_mail import Mail, Message
import os
import random

mail = Mail()

def send_otp_email(email, otp):
    """Send OTP via SMTP"""
    msg = Message(
        subject='V-Assist - Password Reset OTP',
        recipients=[email],
        html=f'''
        <h2>Password Reset Request</h2>
        <p>Your OTP for password reset is:</p>
        <h1 style="color: #007bff;">{otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        '''
    )
    mail.send(msg)
```

**Configuration (.env):**
```env
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_DEFAULT_SENDER=noreply@v-assist.com
```

---

### OpenAI Whisper API (Speech-to-Text)
**Purpose**: Convert user voice input to text for hands-free chatbot interaction

```python
# Backend Implementation
import openai
import os

openai.api_key = os.getenv('OPENAI_API_KEY')

def transcribe_audio(audio_file_path):
    """Transcribe audio using Whisper"""
    with open(audio_file_path, 'rb') as audio_file:
        transcript = openai.Audio.transcribe(
            model="whisper-1",
            file=audio_file,
            language="en"
        )
    return transcript['text']
```

**Features:**
- Supports 99 languages
- Handles various audio formats (mp3, wav, m4a, flac, pcm)
- High accuracy (>95%)
- Cost: ~$0.006 per minute

**Configuration (.env):**
```env
OPENAI_API_KEY=sk-your-api-key
WHISPER_MODEL=whisper-1
```

---

### Google Gemini API (Advanced AI Chatbot)
**Purpose**: Generate intelligent, context-aware responses to student queries

```python
# Backend Implementation
import google.generativeai as genai
import os

genai.configure(api_key=os.getenv('GOOGLE_GEMINI_API_KEY'))

def generate_ai_response(user_message, context):
    """Generate response using Google Gemini"""
    model = genai.GenerativeModel('gemini-pro')
    
    system_prompt = f"""
    You are V-Assist, an intelligent student support chatbot for a university.
    Context: {context}
    Provide helpful, accurate responses about admissions, academics, finance, campus, or mental health.
    Keep responses concise and professional.
    """
    
    response = model.generate_content(
        f"{system_prompt}\n\nStudent Question: {user_message}",
        generation_config={
            'max_output_tokens': 500,
            'temperature': 0.7,
            'top_p': 0.9
        }
    )
    
    return response.text
```

**Features:**
- Advanced natural language understanding
- Context-aware responses
- Multi-turn conversations
- Sentiment analysis capability
- Cost: Free tier available, pay-as-you-go

**Configuration (.env):**
```env
GOOGLE_GEMINI_API_KEY=your-google-api-key
GEMINI_MODEL=gemini-pro
```

---

### Service Integration Summary

| API | Purpose | Endpoint | Integration |
|-----|---------|----------|-------------|
| **SMTP** | Password reset OTP | `/api/auth/forgot-password` | Flask-Mail |
| **Whisper** | Voice-to-text | `/api/chatbot/speech-to-text` | OpenAI SDK |
| **Gemini** | AI responses | `/api/chatbot/ai-response` | Google AI SDK |

---

## 14. API SUMMARY TABLE

| Feature | Methods | Endpoints | Description |
|---------|---------|-----------|-------------|
| **AUTH** | POST | /api/auth/register, /login, /logout, /refresh | User authentication |
| **ADMISSION** | GET, POST | /api/admission/programs, /applications, /eligibility-check | Admission management |
| **ACADEMIC** | GET, POST | /api/academic/courses, /enrollments, /credit-requirements | Academic information |
| **FINANCIAL** | GET | /api/financial/fee-information, /scholarships, /loan-assistance | Financial aid |
| **CAMPUS** | GET, POST | /api/campus/hostels, /transportation, /map | Campus services |
| **MENTAL HEALTH** | GET, POST | /api/mental-health/counselors, /sessions, /resources | Mental health support |
| **CHATBOT** | POST, GET | /api/chatbot/messages, /voice-message, /translate | AI chatbot |
| **FAQ** | GET | /api/faq, /search | FAQ management |
| **USER** | GET, PUT, DELETE | /api/user/profile, /change-password, /account | User management |

