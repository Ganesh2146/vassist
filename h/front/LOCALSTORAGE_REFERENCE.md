# localStorage Quick Reference

## Browser Console Commands

### View All localStorage Data
```javascript
// View all keys and values
console.table(localStorage);
```

### View Specific Keys

```javascript
// Get authentication token
localStorage.getItem('authToken');
// Returns: "demo-token-1710428934566"

// Get user name
localStorage.getItem('userName');
// Returns: "John Doe"

// Get full user data (as JSON)
const userData = JSON.parse(localStorage.getItem('userData'));
console.log(userData);
// Returns: { token: "...", userName: "...", email: "...", ... }
```

### Set Data Manually

```javascript
// Manually set auth token
localStorage.setItem('authToken', 'test-token-123');

// Manually set user name
localStorage.setItem('userName', 'Test User');

// Manually set user data
localStorage.setItem('userData', JSON.stringify({
  token: 'test-token-123',
  userName: 'Test User',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  createdAt: new Date().toISOString()
}));
```

### Delete Data

```javascript
// Remove specific key
localStorage.removeItem('authToken');
localStorage.removeItem('userName');
localStorage.removeItem('userData');

// Clear ALL localStorage
localStorage.clear();

// After clearing, reload page
location.reload();
```

### Check Authentication Status

```javascript
// Check if user is logged in
const isLoggedIn = !!localStorage.getItem('authToken');
console.log('Logged in:', isLoggedIn);

// Get current user name
const currentUser = localStorage.getItem('userName') || 'Not logged in';
console.log('Current user:', currentUser);
```

---

## Common Test Scenarios

### Scenario 1: Verify Signup Data
```javascript
// After signing up, run this
const userData = JSON.parse(localStorage.getItem('userData'));
console.log('User Data:', userData);
console.log('Email:', userData.email);
console.log('Full Name:', userData.userName);
console.log('Created At:', userData.createdAt);
```

### Scenario 2: Simulate Logout
```javascript
// Clear all auth data (same as clicking logout)
localStorage.removeItem('authToken');
localStorage.removeItem('userName');
localStorage.removeItem('userData');
location.reload();  // Reload to update UI
```

### Scenario 3: Create Multiple Test Users
```javascript
// User 1
localStorage.setItem('authToken', 'token-user-1');
localStorage.setItem('userName', 'Alice Johnson');
localStorage.setItem('userData', JSON.stringify({
  token: 'token-user-1',
  userName: 'Alice Johnson',
  email: 'alice@university.edu',
  firstName: 'Alice',
  lastName: 'Johnson',
  createdAt: new Date().toISOString()
}));
// Now visit dashboard and check

// Later, switch to User 2
localStorage.clear();
localStorage.setItem('authToken', 'token-user-2');
localStorage.setItem('userName', 'Bob Smith');
localStorage.setItem('userData', JSON.stringify({
  token: 'token-user-2',
  userName: 'Bob Smith',
  email: 'bob@university.edu',
  firstName: 'Bob',
  lastName: 'Smith',
  createdAt: new Date().toISOString()
}));
location.reload();
```

### Scenario 4: Test Force Login
```javascript
// Skip signup/login and force login
const now = Date.now();
localStorage.setItem('authToken', 'force-token-' + now);
localStorage.setItem('userName', 'Test User');
localStorage.setItem('userData', JSON.stringify({
  token: 'force-token-' + now,
  userName: 'Test User',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  createdAt: new Date().toISOString()
}));
location.href = '/dashboard';  // Go to dashboard
```

### Scenario 5: Store Test User List
```javascript
// Save multiple test accounts for quick switching
const testUsers = [
  {
    name: 'John Doe',
    email: 'john@university.edu',
    firstName: 'John',
    lastName: 'Doe'
  },
  {
    name: 'Jane Smith',
    email: 'jane@university.edu',
    firstName: 'Jane',
    lastName: 'Smith'
  },
  {
    name: 'Bob Johnson',
    email: 'bob@university.edu',
    firstName: 'Bob',
    lastName: 'Johnson'
  }
];

// Login as specific test user
function loginAs(index) {
  const user = testUsers[index];
  const token = 'token-' + Date.now();
  localStorage.setItem('authToken', token);
  localStorage.setItem('userName', user.name);
  localStorage.setItem('userData', JSON.stringify({
    token,
    userName: user.name,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: new Date().toISOString()
  }));
  location.reload();
}

// Usage: loginAs(0) for John, loginAs(1) for Jane, etc.
```

---

## DevTools Navigation

### View localStorage in Browser DevTools

1. **Open DevTools:** F12 or Right-click → Inspect
2. **Go to Application tab** (Chrome/Edge) or Storage tab (Firefox)
3. **Left Sidebar → LocalStorage**
4. **Select:** http://localhost:5175
5. **View:** All keys and values displayed as table

### Export localStorage

```javascript
// Copy this to clipboard
JSON.stringify(JSON.parse(JSON.stringify(localStorage)), null, 2);

// Or create downloadable JSON
const blob = new Blob([JSON.stringify(localStorage)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'localStorage-backup.json';
a.click();
```

### Import Test Data

```javascript
// If you have a backup JSON
const testData = {
  authToken: 'demo-token-1234567',
  userName: 'John Doe',
  userData: '{"token":"demo-token-1234567","userName":"John Doe"}'
};

// Set all at once
Object.entries(testData).forEach(([key, value]) => {
  localStorage.setItem(key, value);
});

location.reload();
```

---

## Debugging Tips

### Check Signup Process
```javascript
// 1. Check if data was stored
console.log('Auth Token:', localStorage.getItem('authToken'));
console.log('User Name:', localStorage.getItem('userName'));

// 2. If empty, signup failed or wasn't completed
// Look in Console tab for error messages

// 3. Check form validation
// Open Console while filling signup form
// Watch for validation error messages

// 4. Check demo mode setTimeout
// Should see "✅ Demo Sign Up Successful" after 800ms
```

### Check Login Process
```javascript
// 1. Check if redirect is working
if (localStorage.getItem('authToken')) {
  console.log('✅ Login successful - token found');
} else {
  console.log('❌ Login failed - no token');
}

// 2. Check if dashboard loads
if (window.location.href.includes('/dashboard')) {
  console.log('✅ Redirected to dashboard');
} else {
  console.log('❌ Not on dashboard');
}
```

### Monitor Network (Future)
```javascript
// When backend API is ready, check Network tab
// DevTools → Network tab
// 1. Fill signup form
// 2. Click Create Account
// 3. Watch for POST /api/auth/signup request
// 4. Check Response tab for returned data
// 5. Verify localStorage is updated from response
```

---

## localStorage Limits

- **Storage Size:** ~5-10 MB per domain
- **Browser:** Specific to each domain
- **Persistence:** Until manually cleared or cache cleared
- **Security:** Vulnerable to XSS (use localStorage for demo only)

---

## Important Notes

⚠️ **Security Warning:**
- localStorage is NOT secure for production
- Never store passwords in localStorage in production
- Use HTTP-only cookies with JWT tokens instead
- This is for TESTING ONLY

✅ **Best Practices:**
- Use localStorage for demo/testing purposes only
- Clear localStorage before switching users
- Always validate data before using from localStorage
- Check browser console for detailed logs
- Use DevTools Application tab to inspect data

---

## Quick Command Reference

| Task | Command |
|------|---------|
| View all data | `console.table(localStorage)` |
| Get token | `localStorage.getItem('authToken')` |
| Get user name | `localStorage.getItem('userName')` |
| Get user data | `JSON.parse(localStorage.getItem('userData'))` |
| Clear all | `localStorage.clear(); location.reload();` |
| Check logged in | `!!localStorage.getItem('authToken')` |
| Set token | `localStorage.setItem('authToken', 'token')` |
| Remove all data | `['authToken','userName','userData'].forEach(k => localStorage.removeItem(k))` |

---

## Keyboard Shortcut

**Open Console in DevTools:**
- Windows/Linux: Ctrl + Shift + J
- Mac: Cmd + Option + J

**Reload page:**
- All: F5 or Ctrl+R

**Hard refresh (clear cache):**
- Windows/Linux: Ctrl + Shift + R
- Mac: Cmd + Shift + R
