# Database Schema - V-Assist

## Overview
This document defines the MySQL database schema for the AI-based Student Support System. All tables use InnoDB engine with UTF8MB4 charset for better Unicode support.

---

## 1. USERS TABLE

**Purpose**: Store authentication and core user information

```sql
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  user_type ENUM('student', 'admin', 'counselor', 'staff', 'instructor') NOT NULL DEFAULT 'student',
  status ENUM('active', 'inactive', 'suspended', 'deleted') NOT NULL DEFAULT 'active',
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP NULL,
  last_login TIMESTAMP NULL,
  profile_image_url VARCHAR(500),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_user_type (user_type),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| user_id | INT | PK, Auto | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email for login |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password (bcrypt) |
| first_name | VARCHAR(100) | NOT NULL | User first name |
| last_name | VARCHAR(100) | NOT NULL | User last name |
| phone | VARCHAR(20) | | Contact phone number |
| date_of_birth | DATE | | User birthday |
| user_type | ENUM | NOT NULL, DEFAULT 'student' | Role/type of user |
| status | ENUM | NOT NULL, DEFAULT 'active' | Account status |
| email_verified | BOOLEAN | DEFAULT FALSE | Email verification flag |
| profile_image_url | VARCHAR(500) | | URL to profile photo |
| bio | TEXT | | User biography |
| created_at | TIMESTAMP | DEFAULT CURRENT | Account creation time |
| updated_at | TIMESTAMP | Auto-update | Last profile update |

---

## 2. STUDENTS TABLE

**Purpose**: Store student-specific information extended from users

```sql
CREATE TABLE students (
  student_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  enrollment_number VARCHAR(50) UNIQUE NOT NULL,
  registration_number VARCHAR(50) UNIQUE ,
  program_id INT,
  admission_date DATE,
  expected_graduation_date DATE,
  current_semester INT,
  current_cgpa DECIMAL(3, 2) DEFAULT 0.00,
  total_credits_completed INT DEFAULT 0,
  status ENUM('active', 'on_leave', 'graduated', 'withdrawn') DEFAULT 'active',
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  father_name VARCHAR(100),
  father_phone VARCHAR(20),
  mother_name VARCHAR(100),
  mother_phone VARCHAR(20),
  disability_status BOOLEAN DEFAULT FALSE,
  disability_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (program_id) REFERENCES programs(program_id),
  INDEX idx_enrollment_number (enrollment_number),
  INDEX idx_program_id (program_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| student_id | INT | PK, Auto | Unique student identifier |
| user_id | INT | FK, UNIQUE | Reference to users table |
| enrollment_number | VARCHAR(50) | UNIQUE, NOT NULL | Unique enrollment ID |
| registration_number | VARCHAR(50) | UNIQUE | University registration number |
| program_id | INT | FK | Reference to programs table |
| admission_date | DATE | | Date of admission |
| expected_graduation_date | DATE | | Expected graduation date |
| current_semester | INT | | Current semester number |
| current_cgpa | DECIMAL(3,2) | DEFAULT 0.00 | Cumulative GPA |
| total_credits_completed | INT | DEFAULT 0 | Total credits earned |
| status | ENUM | DEFAULT 'active' | Academic status |
| address | TEXT | | Residential address |
| disability_status | BOOLEAN | DEFAULT FALSE | Disability flag |

---

## 3. PROGRAMS TABLE

**Purpose**: Store degree/certification program information

```sql
CREATE TABLE programs (
  program_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  department VARCHAR(100),
  code VARCHAR(50) UNIQUE,
  duration_years INT NOT NULL DEFAULT 4,
  total_credits INT NOT NULL DEFAULT 120,
  entry_qualification VARCHAR(100),
  minimum_gpa DECIMAL(3, 2) DEFAULT 2.0,
  intake INT DEFAULT 100,
  available_seats INT DEFAULT 100,
  fees_per_semester DECIMAL(10, 2),
  level ENUM('diploma', 'bachelor', 'master', 'phd') DEFAULT 'bachelor',
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_department (department),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| program_id | INT | PK, Auto | Unique program identifier |
| name | VARCHAR(255) | NOT NULL | Program name |
| description | TEXT | | Program description |
| department | VARCHAR(100) | | Department offering |
| code | VARCHAR(50) | UNIQUE | Program code (e.g., BTech-ECE) |
| duration_years | INT | DEFAULT 4 | Program duration in years |
| total_credits | INT | DEFAULT 120 | Total credits required |
| entry_qualification | VARCHAR(100) | | Required qualification |
| minimum_gpa | DECIMAL(3,2) | DEFAULT 2.0 | Minimum GPA required |
| intake | INT | DEFAULT 100 | Total student capacity |
| available_seats | INT | DEFAULT 100 | Currently available seats |
| fees_per_semester | DECIMAL(10,2) | | Semester fees |
| level | ENUM | DEFAULT 'bachelor' | Program level |

---

## 4. APPLICATIONS TABLE

**Purpose**: Track student applications to programs

```sql
CREATE TABLE applications (
  application_id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT,
  user_id INT NOT NULL,
  program_id INT NOT NULL,
  status ENUM('draft', 'submitted', 'under_review', 'accepted', 'rejected', 'withdrawn') DEFAULT 'draft',
  submission_date TIMESTAMP NULL,
  decision_date TIMESTAMP NULL,
  decision_notes TEXT,
  personal_statement TEXT,
  expected_graduation_year INT,
  high_school_gpa DECIMAL(3, 2),
  entrance_exam_name VARCHAR(100),
  entrance_exam_score INT,
  entrance_exam_percentile DECIMAL(5, 2),
  test_date DATE,
  other_qualifications TEXT,
  special_requirements TEXT,
  transcript_url VARCHAR(500),
  id_proof_url VARCHAR(500),
  reference_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (program_id) REFERENCES programs(program_id),
  INDEX idx_status (status),
  INDEX idx_submission_date (submission_date),
  INDEX idx_program_id (program_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| application_id | INT | PK, Auto | Unique application ID |
| user_id | INT | FK, NOT NULL | Applicant reference |
| program_id | INT | FK, NOT NULL | Program applied to |
| status | ENUM | DEFAULT 'draft' | Application status |
| submission_date | TIMESTAMP | | Date of submission |
| decision_date | TIMESTAMP | | Decision date |
| personal_statement | TEXT | | Applicant statement |
| high_school_gpa | DECIMAL(3,2) | | Applicant GPA |
| entrance_exam_name | VARCHAR(100) | | Name of entrance exam |
| entrance_exam_score | INT | | Exam score |
| entrance_exam_percentile | DECIMAL(5,2) | | Exam percentile |

---

## 5. COURSES TABLE

**Purpose**: Store course information

```sql
CREATE TABLE courses (
  course_id INT PRIMARY KEY AUTO_INCREMENT,
  course_code VARCHAR(50) UNIQUE NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  description TEXT,
  program_id INT,
  department VARCHAR(100),
  credits INT NOT NULL DEFAULT 4,
  semester INT DEFAULT 1,
  instructor_id INT,
  capacity INT DEFAULT 60,
  enrolled_count INT DEFAULT 0,
  schedule_days VARCHAR(100),
  schedule_time_start TIME,
  schedule_time_end TIME,
  classroom_location VARCHAR(100),
  prerequisite_courses VARCHAR(500),
  grading_scheme VARCHAR(50),
  learning_outcomes TEXT,
  textbooks TEXT,
  status ENUM('active', 'inactive', 'archived') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES programs(program_id),
  FOREIGN KEY (instructor_id) REFERENCES users(user_id),
  INDEX idx_course_code (course_code),
  INDEX idx_program_id (program_id),
  INDEX idx_semester (semester),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| course_id | INT | PK, Auto | Unique course identifier |
| course_code | VARCHAR(50) | UNIQUE, NOT NULL | Unique course code |
| course_name | VARCHAR(255) | NOT NULL | Course name |
| credits | INT | DEFAULT 4 | Credit hours |
| semester | INT | DEFAULT 1 | Semester offered |
| instructor_id | INT | FK | Course instructor |
| capacity | INT | DEFAULT 60 | Max student capacity |
| enrolled_count | INT | DEFAULT 0 | Current enrolled |
| schedule_days | VARCHAR(100) | | Days (e.g., MWF) |
| schedule_time_start | TIME | | Class start time |
| schedule_time_end | TIME | | Class end time |
| classroom_location | VARCHAR(100) | | Room/location |
| prerequisite_courses | VARCHAR(500) | | Prerequisite codes |
| grading_scheme | VARCHAR(50) | | Grading method |

---

## 6. ENROLLMENTS TABLE

**Purpose**: Track student course enrollments

```sql
CREATE TABLE enrollments (
  enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  semester INT NOT NULL,
  status ENUM('active', 'completed', 'withdrawn', 'dropped') DEFAULT 'active',
  enrollment_date TIMESTAMP NOT NULL,
  grade VARCHAR(2),
  gpa_points DECIMAL(3, 2),
  attendance_percentage DECIMAL(5, 2) DEFAULT 0,
  midterm_score DECIMAL(5, 2),
  final_score DECIMAL(5, 2),
  assignment_score DECIMAL(5, 2),
  total_score DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(course_id),
  UNIQUE KEY unique_enrollment (student_id, course_id, semester),
  INDEX idx_student_id (student_id),
  INDEX idx_course_id (course_id),
  INDEX idx_semester (semester),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| enrollment_id | INT | PK, Auto | Unique enrollment ID |
| student_id | INT | FK, NOT NULL | Student reference |
| course_id | INT | FK, NOT NULL | Course reference |
| semester | INT | NOT NULL | Enrollment semester |
| status | ENUM | DEFAULT 'active' | Enrollment status |
| enrollment_date | TIMESTAMP | NOT NULL | Enrollment date |
| grade | VARCHAR(2) | | Letter grade (A, B, C...) |
| gpa_points | DECIMAL(3,2) | | Grade point value |
| attendance_percentage | DECIMAL(5,2) | DEFAULT 0 | Class attendance % |
| midterm_score | DECIMAL(5,2) | | Midterm exam score |
| final_score | DECIMAL(5,2) | | Final exam score |
| assignment_score | DECIMAL(5,2) | | Assignment score |
| total_score | DECIMAL(5,2) | | Total accumulated score |

---

## 7. FEES TABLE

**Purpose**: Track student fee records

```sql
CREATE TABLE fees (
  fee_id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  program_id INT NOT NULL,
  semester INT NOT NULL,
  fee_type ENUM('tuition', 'lab', 'library', 'registration', 'misc') DEFAULT 'tuition',
  amount DECIMAL(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  paid_amount DECIMAL(10, 2) DEFAULT 0,
  status ENUM('pending', 'partial', 'paid', 'overdue', 'waived') DEFAULT 'pending',
  payment_method VARCHAR(50),
  transaction_id VARCHAR(100) UNIQUE,
  receipt_url VARCHAR(500),
  late_fee DECIMAL(10, 2) DEFAULT 0,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id),
  FOREIGN KEY (program_id) REFERENCES programs(program_id),
  INDEX idx_student_id (student_id),
  INDEX idx_status (status),
  INDEX idx_due_date (due_date),
  INDEX idx_semester (semester)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| fee_id | INT | PK, Auto | Unique fee record ID |
| student_id | INT | FK, NOT NULL | Student reference |
| program_id | INT | FK, NOT NULL | Program reference |
| semester | INT | NOT NULL | Semester for fee |
| fee_type | ENUM | DEFAULT 'tuition' | Type of fee |
| amount | DECIMAL(10,2) | NOT NULL | Fee amount |
| due_date | DATE | NOT NULL | Payment due date |
| payment_date | DATE | | Actual payment date |
| paid_amount | DECIMAL(10,2) | DEFAULT 0 | Amount paid |
| status | ENUM | DEFAULT 'pending' | Payment status |
| payment_method | VARCHAR(50) | | Payment method |
| transaction_id | VARCHAR(100) | UNIQUE | Transaction reference |

---

## 8. SCHOLARSHIPS TABLE

**Purpose**: Store scholarship information

```sql
CREATE TABLE scholarships (
  scholarship_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  scholarship_amount DECIMAL(10, 2),
  currency VARCHAR(10) DEFAULT 'INR',
  duration VARCHAR(50),
  scholarship_type ENUM('merit', 'need_based', 'talent', 'reserved', 'disability', 'other') DEFAULT 'merit',
  coverage VARCHAR(100),
  minimum_gpa DECIMAL(3, 2),
  minimum_test_score INT,
  maximum_family_income DECIMAL(12, 2),
  eligibility_criteria TEXT,
  required_documents TEXT,
  application_deadline DATE,
  decision_date DATE,
  number_of_awards INT DEFAULT 1,
  application_url VARCHAR(500),
  contact_email VARCHAR(100),
  status ENUM('active', 'inactive', 'archived') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_scholarship_type (scholarship_type),
  INDEX idx_application_deadline (application_deadline)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| scholarship_id | INT | PK, Auto | Unique scholarship ID |
| name | VARCHAR(255) | NOT NULL | Scholarship name |
| description | TEXT | | Scholarship details |
| scholarship_amount | DECIMAL(10,2) | | Award amount |
| currency | VARCHAR(10) | DEFAULT 'INR' | Currency type |
| duration | VARCHAR(50) | | Duration period |
| scholarship_type | ENUM | DEFAULT 'merit' | Type of scholarship |
| coverage | VARCHAR(100) | | Coverage (tuition, hostel...) |
| minimum_gpa | DECIMAL(3,2) | | Min GPA requirement |
| eligibility_criteria | TEXT | | Detailed eligibility |
| application_deadline | DATE | | Application deadline |
| number_of_awards | INT | DEFAULT 1 | Awards available |

---

## 9. HOSTELS TABLE

**Purpose**: Store hostel information

```sql
CREATE TABLE hostels (
  hostel_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  gender ENUM('male', 'female', 'coed') DEFAULT 'coed',
  total_capacity INT DEFAULT 100,
  available_rooms INT DEFAULT 100,
  room_types TEXT,
  amenities TEXT,
  mess_available BOOLEAN DEFAULT TRUE,
  mess_cost_per_month DECIMAL(10, 2),
  check_in_date DATE,
  check_out_date DATE,
  visiting_hours VARCHAR(100),
  rules TEXT,
  admin_name VARCHAR(100),
  admin_phone VARCHAR(20),
  admin_email VARCHAR(100),
  video_tour_url VARCHAR(500),
  status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_gender (gender),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| hostel_id | INT | PK, Auto | Unique hostel ID |
| name | VARCHAR(255) | NOT NULL | Hostel name |
| gender | ENUM | DEFAULT 'coed' | Hostel accommodation |
| total_capacity | INT | DEFAULT 100 | Total capacity |
| available_rooms | INT | DEFAULT 100 | Available rooms |
| room_types | TEXT | | Room configurations |
| amenities | TEXT | | Available amenities |
| mess_available | BOOLEAN | DEFAULT TRUE | Mess facility |
| mess_cost_per_month | DECIMAL(10,2) | | Monthly mess fee |
| admin_name | VARCHAR(100) | | Hostel administrator |
| admin_phone | VARCHAR(20) | | Admin phone |
| visiting_hours | VARCHAR(100) | | Visiting hours |

---

## 10. TRANSPORTATION TABLE

**Purpose**: Store transportation route and schedule information

```sql
CREATE TABLE transportation (
  route_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  from_location VARCHAR(100) NOT NULL,
  to_location VARCHAR(100) NOT NULL,
  distance_km DECIMAL(5, 2),
  route_map_url VARCHAR(500),
  schedules TEXT,
  status ENUM('active', 'inactive', 'seasonal') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_from_location (from_location),
  INDEX idx_to_location (to_location),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE transportation_schedules (
  schedule_id INT PRIMARY KEY AUTO_INCREMENT,
  route_id INT NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  duration_minutes INT,
  vehicle_type VARCHAR(50),
  vehicle_capacity INT,
  driver_name VARCHAR(100),
  driver_phone VARCHAR(20),
  cost_per_trip DECIMAL(10, 2),
  monthly_pass_cost DECIMAL(10, 2),
  seats_available INT,
  status ENUM('active', 'inactive', 'cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (route_id) REFERENCES transportation(route_id) ON DELETE CASCADE,
  INDEX idx_route_id (route_id),
  INDEX idx_departure_time (departure_time),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 11. COUNSELORS TABLE

**Purpose**: Store mental health counselor information

```sql
CREATE TABLE counselors (
  counselor_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  title VARCHAR(100),
  specialization TEXT,
  experience_years INT DEFAULT 0,
  bio TEXT,
  qualifications TEXT,
  office_location VARCHAR(100),
  office_phone VARCHAR(20),
  availability_details TEXT,
  languages TEXT,
  profile_image_url VARCHAR(500),
  status ENUM('active', 'inactive', 'on_leave') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| counselor_id | INT | PK, Auto | Unique counselor ID |
| user_id | INT | FK, UNIQUE, NOT NULL | User reference |
| title | VARCHAR(100) | | Professional title |
| specialization | TEXT | | Areas of expertise |
| experience_years | INT | DEFAULT 0 | Years of experience |
| bio | TEXT | | Professional biography |
| qualifications | TEXT | | Degrees/certifications |
| office_location | VARCHAR(100) | | Office location |
| office_phone | VARCHAR(20) | | Contact phone |
| availability_details | TEXT | | Available time slots |
| languages | TEXT | | Languages spoken |
| profile_image_url | VARCHAR(500) | | Profile photo URL |

---

## 12. COUNSELING_SESSIONS TABLE

**Purpose**: Track counseling appointment bookings and history

```sql
CREATE TABLE counseling_sessions (
  session_id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  counselor_id INT NOT NULL,
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  session_end_time TIME,
  session_type ENUM('online', 'in-person', 'phone') DEFAULT 'online',
  issue_type VARCHAR(100),
  issue_description TEXT,
  status ENUM('scheduled', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
  meeting_link VARCHAR(500),
  meeting_room VARCHAR(100),
  notes TEXT,
  outcome TEXT,
  follow_up_needed BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (counselor_id) REFERENCES counselors(counselor_id),
  INDEX idx_session_date (session_date),
  INDEX idx_student_id (student_id),
  INDEX idx_counselor_id (counselor_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| session_id | INT | PK, Auto | Unique session ID |
| student_id | INT | FK, NOT NULL | Student reference |
| counselor_id | INT | FK, NOT NULL | Counselor reference |
| session_date | DATE | NOT NULL | Session date |
| session_time | TIME | NOT NULL | Session start time |
| session_end_time | TIME | | Session end time |
| session_type | ENUM | DEFAULT 'online' | Session mode |
| issue_type | VARCHAR(100) | | Category of issue |
| issue_description | TEXT | | Issue details |
| status | ENUM | DEFAULT 'scheduled' | Session status |
| meeting_link | VARCHAR(500) | | Zoom/Teams link |
| meeting_room | VARCHAR(100) | | Physical room |
| notes | TEXT | | Counselor notes |
| follow_up_needed | BOOLEAN | DEFAULT FALSE | Needs follow-up |
| follow_up_date | DATE | | Next session date |

---

## 13. FAQS TABLE

**Purpose**: Store AI-generated and manually curated FAQs

```sql
CREATE TABLE faqs (
  faq_id INT PRIMARY KEY AUTO_INCREMENT,
  question VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  category ENUM('admission', 'academic', 'financial', 'campus', 'mental-health', 'general') DEFAULT 'general',
  tags VARCHAR(500),
  related_faq_ids VARCHAR(500),
  helpful_count INT DEFAULT 0,
  unhelpful_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  created_by_user_id INT,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  ai_confidence DECIMAL(3, 2),
  status ENUM('published', 'draft', 'archived') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by_user_id) REFERENCES users(user_id),
  INDEX idx_category (category),
  INDEX idx_status (status),
  FULLTEXT INDEX ft_question (question),
  FULLTEXT INDEX ft_answer (answer)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| faq_id | INT | PK, Auto | Unique FAQ ID |
| question | VARCHAR(500) | NOT NULL | FAQ question |
| answer | TEXT | NOT NULL | FAQ answer |
| category | ENUM | DEFAULT 'general' | Question category |
| tags | VARCHAR(500) | | Search tags |
| helpful_count | INT | DEFAULT 0 | Helpful votes |
| unhelpful_count | INT | DEFAULT 0 | Unhelpful votes |
| views_count | INT | DEFAULT 0 | View count |
| is_ai_generated | BOOLEAN | DEFAULT FALSE | AI-generated flag |
| ai_confidence | DECIMAL(3,2) | | AI confidence score |
| status | ENUM | DEFAULT 'draft' | Publication status |

---

## 14. CHAT_MESSAGES TABLE

**Purpose**: Store chatbot conversation history

```sql
CREATE TABLE chat_messages (
  message_id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT,
  session_id VARCHAR(100) NOT NULL,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  message_language VARCHAR(10) DEFAULT 'en',
  context VARCHAR(50),
  sentiment ENUM('positive', 'neutral', 'negative') DEFAULT 'neutral',
  confidence_score DECIMAL(3, 2),
  faq_matched_id INT,
  helpful_vote BOOLEAN,
  user_feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE SET NULL,
  FOREIGN KEY (faq_matched_id) REFERENCES faqs(faq_id),
  INDEX idx_session_id (session_id),
  INDEX idx_student_id (student_id),
  INDEX idx_created_at (created_at),
  INDEX idx_sentiment (sentiment),
  INDEX idx_context (context)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| message_id | INT | PK, Auto | Unique message ID |
| student_id | INT | FK | Student reference |
| session_id | VARCHAR(100) | NOT NULL | Chat session ID |
| user_message | TEXT | NOT NULL | User's message |
| bot_response | TEXT | NOT NULL | AI's response |
| message_language | VARCHAR(10) | DEFAULT 'en' | Message language |
| context | VARCHAR(50) | | Query context |
| sentiment | ENUM | DEFAULT 'neutral' | User sentiment |
| confidence_score | DECIMAL(3,2) | | Response confidence |
| faq_matched_id | INT | FK | Matched FAQ |
| helpful_vote | BOOLEAN | | User feedback |
| user_feedback | TEXT | | Additional feedback |

---

## 15. SENTIMENT_ANALYSIS TABLE

**Purpose**: Store sentiment analysis records for monitoring student well-being

```sql
CREATE TABLE sentiment_analysis (
  analysis_id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT,
  source_type ENUM('chat', 'feedback', 'email', 'session_notes') DEFAULT 'chat',
  source_id INT,
  text_content TEXT NOT NULL,
  sentiment ENUM('very_positive', 'positive', 'neutral', 'negative', 'very_negative') DEFAULT 'neutral',
  confidence_score DECIMAL(3, 2),
  keywords TEXT,
  emotion_detected VARCHAR(100),
  risk_level ENUM('low', 'medium', 'high', 'critical') DEFAULT 'low',
  intervention_needed BOOLEAN DEFAULT FALSE,
  intervention_type VARCHAR(100),
  counselor_assigned_id INT,
  follow_up_status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (counselor_assigned_id) REFERENCES counselors(counselor_id),
  INDEX idx_student_id (student_id),
  INDEX idx_sentiment (sentiment),
  INDEX idx_risk_level (risk_level),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| analysis_id | INT | PK, Auto | Unique analysis ID |
| student_id | INT | FK | Student reference |
| source_type | ENUM | DEFAULT 'chat' | Data source |
| text_content | TEXT | NOT NULL | Analyzed content |
| sentiment | ENUM | DEFAULT 'neutral' | Sentiment category |
| confidence_score | DECIMAL(3,2) | | Analysis confidence |
| keywords | TEXT | | Extracted keywords |
| emotion_detected | VARCHAR(100) | | Detected emotion |
| risk_level | ENUM | DEFAULT 'low' | Wellbeing risk level |
| intervention_needed | BOOLEAN | DEFAULT FALSE | Intervention flag |
| counselor_assigned_id | INT | FK | Assigned counselor |

---

## 16. ACADEMIC_CALENDAR TABLE

**Purpose**: Store academic calendar events and important dates

```sql
CREATE TABLE academic_calendar (
  event_id INT PRIMARY KEY AUTO_INCREMENT,
  academic_year INT NOT NULL,
  semester INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  event_type ENUM('academic', 'exam', 'holiday', 'administrative', 'cultural') DEFAULT 'academic',
  description TEXT,
  start_time TIME,
  end_time TIME,
  location VARCHAR(100),
  affected_programs TEXT,
  importance ENUM('low', 'medium', 'high') DEFAULT 'medium',
  notify_students BOOLEAN DEFAULT TRUE,
  status ENUM('scheduled', 'ongoing', 'completed', 'cancelled') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_event_date (event_date),
  INDEX idx_event_type (event_type),
  INDEX idx_semester (semester)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 17. ENTITY RELATIONSHIPS DIAGRAM

```
users (1) ---> (many) students
users (1) ---> (many) applications
users (1) ---> (many) counselors
users (1) ---> (many) chat_messages
users (1) ---> (many) courses (as instructor)

programs (1) ---> (many) students
programs (1) ---> (many) applications
programs (1) ---> (many) courses
programs (1) ---> (many) fees

students (1) ---> (many) applications
students (1) ---> (many) enrollments
students (1) ---> (many) fees
students (1) ---> (many) counseling_sessions
students (1) ---> (many) chat_messages
students (1) ---> (many) sentiment_analysis

courses (1) ---> (many) enrollments
courses (1) ---> (many) academic_calendar (referenced)

enrollments (many) ---> (1) students
enrollments (many) ---> (1) courses

counselors (1) ---> (many) counseling_sessions
counseling_sessions (many) ---> (1) students
counseling_sessions (many) ---> (1) counselors

faqs (1) ---> (many) chat_messages (optional reference)
```

---

## 18. INDEXING STRATEGY

### Primary Indexes (Mandatory)
- All Primary Keys (PK)
- All Foreign Keys (FK)

### Search Indexes
- `users.email` - For login/search
- `students.enrollment_number` - For student lookup
- `courses.course_code` - For course search
- `programs.name` - For program search
- `faqs.question`, `faqs.answer` - Full-text search

### Time-based Indexes
- `created_at` - For date range queries
- `submission_date` - For deadline tracking
- `event_date` - For calendar queries

### Status Indexes
- `status` fields - For filtering active records

---

## 19. NAMING CONVENTIONS

- Table names: `snake_case` (e.g., `user_profiles`)
- Column names: `snake_case`
- Primary Key: `{table_name}_id`
- Foreign Key: `{referenced_table}_id`
- Boolean columns: prefix with `is_` or `has_`
- Timestamps: `created_at`, `updated_at`, `deleted_at`
- Soft delete flags: `is_deleted` or `deleted_at`

---

## 20. DATABASE INITIALIZATION SCRIPT

To initialize the database, the order of table creation should be:

1. `users` - Base table
2. `programs` - Standalone table
3. `students` - References users, programs
4. `applications` - References users, programs
5. `courses` - References programs, users (instructor)
6. `enrollments` - References students, courses
7. `fees` - References students, programs
8. `scholarships` - Standalone table
9. `hostels` - Standalone table
10. `transportation` - Standalone table
11. `transportation_schedules` - References transportation
12. `counselors` - References users
13. `counseling_sessions` - References students, counselors
14. `faqs` - References users
15. `chat_messages` - References students, faqs
16. `sentiment_analysis` - References students, counselors
17. `academic_calendar` - Standalone table

*Note: This order ensures all foreign key constraints are satisfied during table creation.*

---

## 21. BACKUP AND MIGRATION CONSIDERATIONS

- Backup frequency: Daily
- Retention: 30 days
- Disaster recovery: Replicate to secondary server
- Migration strategy: Blue-green deployment
- Data archival: Move old records to archive database after 5 years

