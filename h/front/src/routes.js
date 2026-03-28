// ==================== ROUTE CONFIGURATION ====================
// Each page has its own route for easy debugging and navigation

export const ROUTES = {
  // Public routes (no auth required)
  LANDING: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Protected routes (auth required)
  DASHBOARD: '/dashboard',
  CHAT: '/chat',
  CARE: '/care',
  PROFILE: '/profile',
  JOURNAL: '/journal',
  APPOINTMENTS: '/my-appointments',
  COUNSELOR_BOOKINGS: '/counselor-bookings',
};

// Route-to-Component mapping for easy lookup
export const ROUTE_COMPONENTS = {
  [ROUTES.LANDING]: { name: 'Landing', path: '/src/components/Landing.jsx' },
  [ROUTES.LOGIN]: { name: 'SignIn', path: '/src/components/SignIn.jsx' },
  [ROUTES.SIGNUP]: { name: 'SignUp', path: '/src/components/SignUp.jsx' },
  [ROUTES.FORGOT_PASSWORD]: { name: 'ForgotPassword', path: '/src/components/ForgotPassword.jsx' },
  [ROUTES.DASHBOARD]: { name: 'Dashboard', path: '/src/components/Dashboard.jsx' },
  [ROUTES.CHAT]: { name: 'Chat', path: '/src/components/Chat.jsx' },
  [ROUTES.CARE]: { name: 'Care', path: '/src/components/Care.jsx' },
  [ROUTES.PROFILE]: { name: 'Profile', path: '/src/components/Profile.jsx' },
  [ROUTES.JOURNAL]: { name: 'Journal', path: '/src/components/Journal.jsx' },
  [ROUTES.APPOINTMENTS]: { name: 'StudentAppointments', path: '/src/components/StudentAppointments.jsx' },
  [ROUTES.COUNSELOR_BOOKINGS]: { name: 'CounselorBookings', path: '/src/components/CounselorBookings.jsx' },
};

// Page internal state mapping (for current page state in App.jsx)
export const PAGE_NAMES = {
  landing: 'landing',
  signin: 'signin',
  signup: 'signup',
  forgotpassword: 'forgotpassword',
  dashboard: 'dashboard',
  chat: 'chat',
  care: 'care',
  profile: 'profile',
  journal: 'journal',
  appointments: 'appointments',
  counselor_bookings: 'counselor_bookings',
};
