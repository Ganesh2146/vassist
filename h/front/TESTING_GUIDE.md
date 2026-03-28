# Testing Guide - Vassist Application

## Overview

The Vassist application is now fully functional with a Sign Up page and localStorage integration. You can test the entire application without a backend server.

---

## How to Test the Application

### Step 1: Start the Development Server

```bash
npm run dev
```

The app will start at `http://localhost:5175`

---

### Step 2: Navigate Through the Application

#### A. Landing Page
- **URL:** `http://localhost:5175/`
- **What to test:**
  - Click "Home" button (stays on landing page)
  - Click "Chat Bot" button (goes to /login)
  - Service cards are displayed

#### B. Sign Up Page
- **URL:** `http://localhost:5175/signup`
- **What to test:**
  - Fill in First Name, Last Name, Email, Password, Confirm Password
  - Click "Create Account" button
  - Data is stored in localStorage
  - Automatically redirects to `/dashboard`

**Test Data:**
```
First Name: John
Last Name: Doe
Email: john@university.edu
Password: password123
Confirm Password: password123
```

#### C. Sign In Page
- **URL:** `http://localhost:5175/login`
- **What to test:**
  - Fill in Email and Password (from any user)
  - Click "Login" button
  - Automatically redirects to `/dashboard`
  - Data is stored in localStorage

**Test Data:**
```
Email: test@university.edu
Password: test123
```

#### D. Dashboard (Protected)
- **URL:** `http://localhost:5175/dashboard`
- **Requirements:** Must be logged in (redirects to /login if not)
- **What to test:**
  - User welcome message shows name
  - Quick access buttons (Counseling, Stress MGMT, etc.)
  - Mental health support banner
  - 4 functional modules (Admissions, Academic, Financial, Campus)
  - Bottom navigation works:
    - Home (active)
    - Services → goes to /chat
    - Support → goes to /care
    - Logout → clears localStorage and goes to /

#### E. Chat Page (Protected)
- **URL:** `http://localhost:5175/chat`
- **Requirements:** Must be logged in (redirects to /login if not)
- **What to test:**
  - AI greeting message appears
  - Quick questions section shows 4 questions
  - Type a message and click send
  - AI responds (demo response)
  - Click quick questions → AI responds
  - Bottom navigation works:
    - CHAT (active)
    - HISTORY → goes to /dashboard
    - TOOLS → goes to /care
    - LOGOUT → clears localStorage

#### F. Care Page (Protected)
- **URL:** `http://localhost:5175/care`
- **Requirements:** Must be logged in (redirects to /login if not)
- **What to test:**
  - Calendar shows with selectable dates
  - Click different dates
  - Available time slots appear
  - Click "Confirm Appointment" button
  - Stress Management resources display (3 cards)
  - Crisis hotline section with number 988
  - Bottom navigation works:
    - Home → goes to /dashboard
    - Support (active)
    - Journal → goes to /chat
    - Logout → clears localStorage

---

## Testing localStorage Data

### View Stored Data

Open **Developer Tools** → **Application** → **LocalStorage** → **http://localhost:5175**

You should see:
```
Key: authToken
Value: demo-token-1710428934566

Key: userName
Value: John Doe

Key: userData
Value: {
  "token": "demo-token-1710428934566",
  "userName": "John Doe",
  "email": "john@university.edu",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2026-03-14T10:15:34.566Z"
}
```

### Clear Data

To test the sign up/login flow again:
1. Open Developer Tools
2. Application → LocalStorage
3. Right-click and delete all entries
4. Or execute in console:
```javascript
localStorage.clear();
location.reload();
```

---

## Testing Console Logs

All API calls and authentication actions are logged to console.

### View Logs

1. Open **Developer Tools** → **Console** tab
2. Look for logs with these indicators:

**Sign Up:**
```
📝 Sign Up Attempt:
  First Name: John
  Last Name: Doe
  Email: john@university.edu
  Timestamp: 2026-03-14T10:15:34.566Z

✅ Demo Sign Up Successful:
  Token: demo-token-1710428934566
  User: John Doe
  Email: john@university.edu
  Stored in localStorage
```

**Sign In:**
```
🔐 Sign In Attempt:
  Email: test@university.edu
  Timestamp: 2026-03-14T10:15:34.566Z

✅ Demo Sign In Successful:
  Token: demo-token-1710428934566
  User: test
```

**Dashboard:**
```
📊 Dashboard Data Fetch Started
  Timestamp: 2026-03-14T10:15:34.566Z
✅ Dashboard Data Fetch Complete
```

**Chat Messages:**
```
💬 Sending Chat Message:
  Message: "Hello AI"
  Timestamp: 2026-03-14T10:15:34.566Z

🎭 Running in DEMO MODE - generating AI response
✅ Demo AI Response generated: "Our multilingual support..."
```

---

## Test Flow Scenarios

### Scenario 1: New User Sign Up
1. Go to `/signup`
2. Fill in signup form
3. Click "Create Account"
4. Redirected to `/dashboard`
5. Check localStorage for user data
6. Navigate through dashboard, chat, care pages
7. Click logout
8. Redirected to `/` (landing page)

### Scenario 2: Returning User Login
1. Go to `/login`
2. Enter any email and password
3. Click "Login"
4. Redirected to `/dashboard`
5. Check localStorage for auth token
6. Verify user name displays on header

### Scenario 3: Protected Route Access
1. Clear localStorage
2. Try to access `/dashboard` directly
3. Should redirect to `/login`
4. Sign in
5. Should now access `/dashboard`

### Scenario 4: Logout & Re-login
1. Login to dashboard
2. Click logout button
3. Redirected to landing page
4. localStorage cleared
5. Login again with different credentials
6. Should log in successfully

---

## localStorage Schema

### authToken
- **Type:** String
- **Value:** `demo-token-{timestamp}`
- **Purpose:** Store authentication token
- **Cleared on:** Logout

### userName
- **Type:** String
- **Value:** `{firstName} {lastName}`
- **Purpose:** Store user display name
- **Cleared on:** Logout

### userData
- **Type:** JSON String
- **Value:** User profile object with firstName, lastName, email, etc.
- **Purpose:** Store full user data for testing
- **Cleared on:** Logout

---

## Feature Testing Checklist

### Authentication
- [ ] Sign up with valid data
- [ ] Sign up with invalid email
- [ ] Sign up with mismatched passwords
- [ ] Sign up with empty fields
- [ ] Sign in with any credentials
- [ ] Logout clears localStorage
- [ ] Protected routes redirect to login
- [ ] Tokens persist across page refresh

### Navigation
- [ ] All links use React Router
- [ ] Bottom navigation works on all pages
- [ ] Browser back/forward buttons work
- [ ] Direct URL access works
- [ ] Active states show correctly

### UI/UX
- [ ] Same styling as login on signup page
- [ ] Form validation shows error messages
- [ ] Loading states work (buttons disabled)
- [ ] Hover effects on buttons
- [ ] Responsive layout

### Console Logging
- [ ] Sign up logs user data
- [ ] Sign in logs credentials
- [ ] Navigation logs route changes
- [ ] All API calls logged with timestamps
- [ ] Errors logged with details

---

## Troubleshooting

### Issue: App stuck on loading screen
**Solution:** 
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`
- Reload page

### Issue: localStorage data not persisting
**Solution:**
- Check if browser allows localStorage
- Open DevTools → Application → Storage → check settings
- Try incognito/private mode

### Issue: Redirect not working after login
**Solution:**
- Check console for JavaScript errors
- Verify localStorage has authToken
- Check that `onLoginSuccess` is being called

### Issue: Cannot access protected routes
**Solution:**
- Make sure you're logged in (authToken in localStorage)
- Clear localStorage and login again
- Check browser console for errors

---

## Next Steps

When Flask backend is ready:
1. Uncomment API calls in components (marked with `// API ENDPOINT:` comments)
2. Update endpoint URLs if different from defaults
3. Remove demo mode setTimeout blocks
4. Test with real backend responses
5. Implement error handling for network failures

---

## Component Files

| Component | File | Route | Type |
|-----------|------|-------|------|
| Landing | SignUp.jsx | `/signup` | Public |
| Sign In | SignIn.jsx | `/login` | Public |
| Sign Up | SignUp.jsx | `/signup` | Public |
| Dashboard | Dashboard.jsx | `/dashboard` | Protected |
| Chat | Chat.jsx | `/chat` | Protected |
| Care | Care.jsx | `/care` | Protected |

---

## Notes

- All form data is validated before submission
- Passwords must match on signup
- Email format validation included
- Password minimum 6 characters
- All timestamps logged in ISO format
- Console logs include emoji indicators for easy scanning
