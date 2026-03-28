# Admin Dashboard - Quick Start Guide

## Access Admin Portal

### Via Login:
1. Sign in with admin credentials
2. User type must be set to: `admin`
3. You'll be automatically redirected to `/admin`

### Direct URL:
- Admin Dashboard: `http://localhost:5173/admin`
- Only accessible if logged in as admin user

## Testing Admin Access

To test the admin dashboard, sign up/login with:
- **User Type**: Select "Admin" during signup OR set in backend as admin
- **Email**: any@example.com
- **Password**: Any password meeting requirements

## Admin Dashboard Features

### 1. Overview Section (Top Metrics)
- **Total Users**: Current count with growth percentage
- **Active Users**: Users currently active with trend
- **Total Sessions**: Session count with growth
- **Chat Messages**: Message volume with trend
- **Appointments**: Booked appointments with trend

### 2. Analytics Charts
- **User Growth Trend**: Line chart showing user growth over time
  - Displays user count and active users
  - Shows trend from selected period start to now

### 3. User Analytics
- **User Breakdown**: Horizontal bar chart by type
  - Students
  - Counselors
  - Staff
  - Admins
  - Others

### 4. Chat Metrics
- Total messages sent
- AI responses vs human support
- Average response time
- User satisfaction rate

### 5. Care & Counseling Metrics
- Total appointments
- Booked appointments
- Completed appointments
- Cancelled appointments
- Average counselor rating

### 6. Top User Questions
- Shows 5 most frequently asked questions
- Asks count for each question
- Helps identify knowledge gaps

### 7. System Health
- **Uptime**: System availability percentage
- **API Latency**: Response time in milliseconds
- **Error Rate**: Percentage of failed requests
- **DB Health**: Database status (healthy/warning)

## Time Period Selection

Dropdown menu to select analytics period:
- Last 7 Days
- Last 30 Days (default)
- Last 90 Days
- Last Year

Changes refresh analytics data based on selection.

## Admin Navigation

### Bottom Navigation (Admin View):
- **Analytics** (FiBarChart2) - Current page indicator
- **Logout** (FiLogOut) - Logout button

### Regular User Navigation:
- **Dashboard** (FiHome)
- **Chat** (FiMessageSquare)
- **Care** (FiHeart)
- **Logout** (FiLogOut)

## API Endpoints

All admin endpoints are defined in `src/api/config.js`:

```javascript
adminAPI.getAnalyticsOverview()  // Overview metrics
adminAPI.getUserAnalytics()      // User statistics
adminAPI.getSessionAnalytics()   // Session data
adminAPI.getChatAnalytics()      // Chat metrics
adminAPI.getCareAnalytics()      // Care metrics
adminAPI.getAllUsers()           // User list
adminAPI.getUserBreakdown()      // User type breakdown
adminAPI.getSupportTickets()     // Support tickets
adminAPI.getSystemHealth()       // System status
```

## Styling & Design

- **Color Scheme**: Blue (#1E40AF) primary with accent colors
- **Layout**: Responsive grid layout for cards
- **Icons**: React Icons (FiXxx icons)
- **Charts**: Custom SVG-based visualizations

No external charting library needed - all charts built with SVG for lightweight implementation.

## Security & Access Control

- Admin route (`/admin`) protected by `isLoggedIn && isAdmin` check
- Non-admin users cannot access admin portal
- Admin redirect happens automatically on login
- User type stored in localStorage and validated on app load

## File Locations

- **Main Component**: `src/components/AdminDashboard.jsx` (850+ lines)
- **Updated Files**:
  - `src/App.jsx` - Admin route + user type tracking
  - `src/api/config.js` - Admin endpoints
  - `src/components/SignUp.jsx` - Store user type
  - `src/components/SignIn.jsx` - Auto-redirect + user type
  - `src/components/BottomNav.jsx` - Conditional admin nav

## Next Steps

1. **Add More Metrics**: Implement additional analytics sections
2. **Real-time Updates**: Add WebSocket for live metrics
3. **Export Reports**: Add PDF export functionality
4. **Advanced Filters**: More granular date range and category filters
5. **User Management**: Admin tools to manage users directly
