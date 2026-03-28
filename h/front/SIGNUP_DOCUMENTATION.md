# Sign Up Page Documentation

## Overview

The Sign Up page (`SignUp.jsx`) allows new users to create an account in the Vassist application. It mirrors the styling and functionality of the Sign In page while including additional form fields for user information.

---

## Component Details

### File Location
- **Path:** `src/components/SignUp.jsx`
- **Route:** `/signup`
- **Type:** Public route (no authentication required)

---

## Form Fields

### 1. First Name
- **Type:** Text input
- **Required:** Yes
- **Validation:** Not empty
- **Example:** John

### 2. Last Name
- **Type:** Text input
- **Required:** Yes
- **Validation:** Not empty
- **Example:** Doe

### 3. Email Address
- **Type:** Email input
- **Required:** Yes
- **Validation:** Valid email format (regex)
- **Example:** john@university.edu

### 4. Password
- **Type:** Password input
- **Required:** Yes
- **Validation:** Minimum 6 characters
- **Example:** password123

### 5. Confirm Password
- **Type:** Password input
- **Required:** Yes
- **Validation:** Must match password field
- **Example:** password123

---

## Form Validation

### Validation Rules (in order):
1. ✅ All fields filled
2. ✅ Passwords match
3. ✅ Password minimum 6 characters
4. ✅ Valid email format

### Error Messages:
- "Please fill in all fields" - Missing required field
- "Passwords do not match" - Password fields don't match
- "Password must be at least 6 characters" - Password too short
- "Please enter a valid email address" - Invalid email format

---

## Data Storage in localStorage

### Storage Method
All user data is stored in browser's localStorage for testing without a backend.

### Stored Keys

#### 1. authToken
```javascript
localStorage.getItem('authToken')
// Returns: "demo-token-1710428934566"
```
- **Purpose:** Authentication token for identifying user
- **Format:** String
- **Value:** `demo-token-{timestamp}`
- **Cleared on:** Logout

#### 2. userName
```javascript
localStorage.getItem('userName')
// Returns: "John Doe"
```
- **Purpose:** User's display name (firstName + lastName)
- **Format:** String
- **Value:** `{firstName} {lastName}`
- **Cleared on:** Logout

#### 3. userData
```javascript
localStorage.getItem('userData')
// Returns: JSON string
```
- **Purpose:** Complete user profile data
- **Format:** JSON string
- **Value:** 
```json
{
  "token": "demo-token-1710428934566",
  "userName": "John Doe",
  "email": "john@university.edu",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2026-03-14T10:15:34.566Z"
}
```
- **Cleared on:** Logout

---

## Console Logging

### Registration Attempt
```
📝 Sign Up Attempt:
  First Name: John
  Last Name: Doe
  Email: john@university.edu
  Timestamp: 2026-03-14T10:15:34.566Z
```

### Success Response
```
✅ Demo Sign Up Successful:
  Token: demo-token-1710428934566
  User: John Doe
  Email: john@university.edu
  Stored in localStorage
```

### Error Response
```
❌ Sign Up Error:
  message: "Passwords do not match"
  status: undefined
  data: undefined
  timestamp: 2026-03-14T10:15:34.566Z
```

---

## User Flow

```
1. User clicks "Create an account" on login page
   ↓
2. Redirected to /signup
   ↓
3. User fills signup form
   - First Name: John
   - Last Name: Doe
   - Email: john@university.edu
   - Password: password123
   - Confirm Password: password123
   ↓
4. User clicks "Create Account"
   ↓
5. Form validation
   - Check all fields filled ✅
   - Check passwords match ✅
   - Check password length ✅
   - Check email format ✅
   ↓
6. Demo signup (no backend)
   - Generate token: demo-token-{timestamp}
   - Store in localStorage
   - Log to console
   ↓
7. Automatic redirect to /dashboard
   ↓
8. User logged in and authenticated
```

---

## Code Structure

### Form Submission Handler
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // 1. Validation checks
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    setError('Please fill in all fields');
    return;
  }
  
  if (password !== confirmPassword) {
    setError('Passwords do not match');
    return;
  }
  
  // 2. Log attempt
  console.log('📝 Sign Up Attempt:', { firstName, lastName, email });
  
  // 3. Demo signup (replace with API call when backend ready)
  const userData = {
    token: 'demo-token-' + Date.now(),
    userName: firstName + ' ' + lastName,
    email: email,
    firstName: firstName,
    lastName: lastName,
    createdAt: new Date().toISOString()
  };
  
  // 4. Store in localStorage
  localStorage.setItem('authToken', userData.token);
  localStorage.setItem('userName', userData.userName);
  localStorage.setItem('userData', JSON.stringify(userData));
  
  // 5. Redirect to dashboard
  navigate('/dashboard');
}
```

---

## Styling Details

### Design System
- **Primary Color:** #0066FF (Blue)
- **Font Family:** Poppins
- **Border Radius:** 8px, 10px, 20px
- **Box Shadow:** 0 4px 6px rgba(0,0,0,0.07)

### Key Style Elements
- Header with Vassist logo (blue)
- White form card on light gray background
- Blue submit button with hover effect
- Red error message box
- Footer with copyright

### Responsive Design
- Form max-width: 500px
- Padding responsive to screen size
- Mobile-friendly input fields
- Proper spacing between elements

---

## Integration with App.jsx

### Route Configuration
```javascript
<Route 
  path="/signup" 
  element={<SignUp onSignUpSuccess={handleSignInSuccess} />} 
/>
```

### Props
- **onSignUpSuccess:** Function called after successful signup
  - Sets `isLoggedIn` to true
  - Stores userName in state
  - Used for transitioning to dashboard

---

## API Integration (Future)

### Uncomment When Backend Ready

**Location:** Line ~80-85 in SignUp.jsx

**Current Code (Demo):**
```javascript
// API ENDPOINT: POST /api/auth/signup
// Uncomment below when Flask backend is ready:
// const response = await authAPI.signUp(firstName, lastName, email, password);
// localStorage.setItem('authToken', response.data.token);
// localStorage.setItem('userName', response.data.user.name);
```

**Expected Backend Response:**
```json
{
  "token": "actual-jwt-token",
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "john@university.edu",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

## Testing Scenarios

### Scenario 1: Successful Signup
1. Navigate to `/signup`
2. Enter valid data
3. Click "Create Account"
4. Redirected to `/dashboard`
5. Check localStorage for saved data
6. User name visible on dashboard

### Scenario 2: Validation Errors
1. Leave fields empty → "Please fill in all fields"
2. Mismatched passwords → "Passwords do not match"
3. Password "abc" → "Password must be at least 6 characters"
4. Email "invalid" → "Please enter a valid email address"

### Scenario 3: Multiple Signups
1. Sign up with User A
2. Logout
3. Sign up with User B
4. Logout
5. Sign up with User C
6. Each signup overwrites previous localStorage data

### Scenario 4: Signup to Logout
1. Sign up with valid data
2. See user name on dashboard
3. Navigate to Chat and Care pages
4. Click logout
5. localStorage cleared
6. Redirected to landing page

---

## Browser DevTools Inspection

### View Signup Storage

**Steps:**
1. Open DevTools (F12)
2. Go to Application tab
3. Left sidebar → LocalStorage
4. Click `http://localhost:5175`

**View Data:**
```
Key                 Value
---                 -----
authToken           demo-token-1710428934566
userName            John Doe
userData            {"token":"demo-token-1710428934566",...}
```

### Clear Signup Data

**Method 1:** DevTools
- Right-click on key → Delete
- Or delete all: Clear All

**Method 2:** Console
```javascript
localStorage.clear();
location.reload();
```

---

## Error Handling

### Client-Side Validation
- All errors caught before trying to submit
- Error message displayed in red box
- Input fields not cleared (allow correction)

### Demo Mode
- No network errors (no backend calls)
- Automatic success after 800ms delay
- Loading state shown during submission

### API Errors (Future)
```javascript
catch (err) {
  const errorMsg = err.response?.data?.message || 'Sign up failed';
  setError(errorMsg);
  console.error('❌ Sign Up Error:', {
    message: errorMsg,
    status: err.response?.status,
    data: err.response?.data
  });
}
```

---

## Comparison: SignUp vs SignIn

| Feature | SignUp | SignIn |
|---------|--------|--------|
| First Name | ✅ Yes | ❌ No |
| Last Name | ✅ Yes | ❌ No |
| Email | ✅ Yes | ✅ Yes |
| Password | ✅ Yes | ✅ Yes |
| Confirm Password | ✅ Yes | ❌ No |
| Styling | Same | Same |
| Route | `/signup` | `/login` |
| localStorage keys | 3 | 2 |
| Validation | More strict | Basic |
| Console logs | Detailed | Detailed |

---

## Notes

- Passwords stored in localStorage are for DEMO ONLY (not secure)
- In production, passwords should NEVER be stored in localStorage
- Use secure HTTP-only cookies with JWT tokens instead
- Demo mode useful for UI/UX testing without backend
- Easy to switch to real API by uncommenting backend calls
