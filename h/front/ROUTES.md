# Application Routes

## Route Overview

This application uses **React Router (v6)** for client-side routing. Each route is a separate page with its own URL.

---

## Public Routes (No Authentication Required)

### 🏠 Landing Page
- **Route:** `/`
- **Component:** `Landing.jsx`
- **Location:** `src/components/Landing.jsx`
- **Description:** Home page with service overview
- **Features:**
  - Hero section with "POWERED BY AI" messaging
  - 4 service cards (Admissions, Academics, Financial, Campus)
  - Links to Signin and Home
  - Footer with copyright

---

### 🔐 Login / Sign In
- **Route:** `/login`
- **Component:** `SignIn.jsx`
- **Location:** `src/components/SignIn.jsx`
- **Description:** User authentication page
- **Features:**
  - Email and password form
  - Error handling and validation
  - Demo mode (works without backend)
  - Loading state
  - Links to home and signup
- **API Endpoint:** `POST /api/auth/signin`

---

## Protected Routes (Authentication Required)

If user is not authenticated, they are redirected to `/login`

### 📊 Dashboard / Home
- **Route:** `/dashboard`
- **Component:** `Dashboard.jsx`
- **Location:** `src/components/Dashboard.jsx`
- **Description:** Main user dashboard
- **Features:**
  - User welcome with avatar
  - Quick access buttons (Counseling, Stress MGMT, etc.)
  - Mental health support banner
  - 4 functional modules (Admissions, Academic, Financial, Campus)
  - Bottom navigation with Home, Services, Support, Logout
- **API Endpoints:**
  - `GET /api/dashboard/user`
  - `GET /api/dashboard/modules`
  - `GET /api/dashboard/quick-access`

---

### 💬 Chat / AI Assistant
- **Route:** `/chat`
- **Component:** `Chat.jsx`
- **Location:** `src/components/Chat.jsx`
- **Description:** AI conversation interface
- **Features:**
  - Message display (User & AI)
  - Quick questions section
  - Voice button and attachments
  - Bottom navigation (Chat, History, Tools, Logout)
  - Loading state for AI responses
- **API Endpoints:**
  - `GET /api/chat/quick-questions`
  - `POST /api/chat/message`
  - `POST /api/chat/quick-response`
  - `GET /api/chat/history`

---

### ❤️ Care / Mental Health Support
- **Route:** `/care`
- **Component:** `Care.jsx`
- **Location:** `src/components/Care.jsx`
- **Description:** Mental health support and appointment scheduling
- **Features:**
  - Calendar for date selection
  - Available appointment slots
  - Stress management resources (3 cards)
  - Crisis hotline section with emergency number
  - Bottom navigation (Home, Support, Journal, Logout)
- **API Endpoints:**
  - `GET /api/care/available-slots`
  - `POST /api/care/schedule-appointment`
  - `GET /api/care/resources`
  - `GET /api/care/crisis-hotline`

---

## Catch-All Route

- **Route:** `*` (any unmatched URL)
- **Action:** Redirected to `/` (Landing page)

---

## Navigation Flow

```
Landing (/)
   ↓
Sign In (/login)
   ↓
Dashboard (/dashboard) ← Protected
   ├→ Chat (/chat) ← Protected
   ├→ Care (/care) ← Protected
   └→ Logout (back to /)
```

---

## Key Features

✅ **URL-Based Routing:** Each page has its own URL
✅ **Protected Routes:** Authenticated users only access dashboard, chat, care
✅ **Authentication:**
  - Stored in localStorage (authToken, userName)
  - Checked on app mount
  - Automatic redirect to login if not authenticated
  - Logout clears tokens and redirects to home

✅ **Bottom Navigation:** Easy switching between pages on mobile
✅ **Proper Links:** All navigation uses React Router's `<Link>` component
✅ **Console Logging:** All route changes and API calls logged

---

## How to Use Routes

### From Navigation Links
```javascript
// Import Link from react-router-dom
import { Link } from 'react-router-dom';

// Use Link for navigation (no page reload)
<Link to="/dashboard">Go to Dashboard</Link>
```

### From JavaScript
```javascript
// Import useNavigate from react-router-dom
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/dashboard');  // Programmatic navigation
```

---

## Current URL Scheme

| Page | URL | Status |
|------|-----|--------|
| Landing | `/` | Public |
| Sign In | `/login` | Public |
| Dashboard | `/dashboard` | Protected |
| Chat | `/chat` | Protected |
| Care | `/care` | Protected |

---

## Notes

- All protected routes check authentication status
- If not authenticated, user is redirected to `/login`
- localStorage persists authentication across page refreshes
- Demo mode works without Flask backend
- Console shows detailed routing logs

See [src/App.jsx](src/App.jsx) for routing configuration.
