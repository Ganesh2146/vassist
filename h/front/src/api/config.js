import axios from 'axios';

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://127.0.0.1:5000/api' : 'https://vassist-02.onrender.com/api');

// Backend routes are mounted under `/api/*`.
// If the env var is set to a bare origin like `https://<service>.onrender.com`,
// requests will miss the `/api` prefix and fail due to missing CORS headers.
const normalizeApiBaseUrl = (value) => {
  if (!value) return value;
  const trimmed = String(value).trim().replace(/\/+$/, '');

  // If user provided a URL that already contains `/api` (possibly with extra path),
  // reduce it to the API base: `.../api`.
  const lower = trimmed.toLowerCase();
  const lastApiIndex = lower.lastIndexOf('/api');
  if (lastApiIndex !== -1) {
    const tail = lower.slice(lastApiIndex);
    if (tail === '/api' || tail.startsWith('/api/')) {
      return `${trimmed.slice(0, lastApiIndex)}/api`;
    }
  }

  // Otherwise, append `/api`.
  return `${trimmed}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl(RAW_API_BASE_URL);

if (RAW_API_BASE_URL !== API_BASE_URL) {
  console.warn(
    `[api] VITE_API_BASE_URL was '${RAW_API_BASE_URL}'. ` +
      `Normalized to '${API_BASE_URL}'. Prefer setting it to '<backend>/api'.`
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== REQUEST INTERCEPTOR ====================
// Logs all outgoing request details
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Log request details
  console.log('📤 API REQUEST:');
  console.log('  Method:', config.method.toUpperCase());
  console.log('  URL:', config.baseURL + config.url);
  console.log('  Headers:', config.headers);
  if (config.data) {
    console.log('  Request Body:', config.data);
  }
  console.log('  Timestamp:', new Date().toISOString());
  console.log('---');
  
  return config;
});

// ==================== RESPONSE INTERCEPTOR ====================
// Logs all incoming response details
api.interceptors.response.use(
  (response) => {
    // Success response
    console.log('📥 API RESPONSE (SUCCESS):');
    console.log('  Status:', response.status, response.statusText);
    console.log('  URL:', response.config.url);
    console.log('  Response Data:', response.data);
    console.log('  Timestamp:', new Date().toISOString());
    console.log('---');
    return response;
  },
  (error) => {
    // Error response
    const isNetworkError = !error.response;
    const status = error.response?.status;
    if (isNetworkError) {
      error.userMessage = `Cannot connect to backend API at ${API_BASE_URL}. Please verify the backend is running and VITE_API_BASE_URL is set correctly.`;
    } else if (status === 429) {
      const backendMessage = error.response?.data?.message;
      error.userMessage = backendMessage || 'Too many requests. Please wait a moment and try again.';
    }

    console.error('❌ API RESPONSE (ERROR):');
    console.error('  Status:', error.response?.status, error.response?.statusText);
    console.error('  URL:', error.config?.url);
    console.error('  Error Message:', error.message);
    console.error('  Error Data:', error.response?.data);
    if (isNetworkError) {
      console.error('  Suggestion: Start backend server and verify /api/health is reachable.');
    }
    console.error('  Timestamp:', new Date().toISOString());
    console.error('---');
    return Promise.reject(error);
  }
);

// ==================== AUTHENTICATION ENDPOINTS ====================
// Connected to backend Flask APIs

export const authAPI = {
  // POST /api/auth/register
  signUp: (first_name, last_name, email, password, user_type = 'student') =>
    api.post('/auth/register', { first_name, last_name, email, password, user_type }),

  // POST /api/auth/login
  signIn: (email, password) =>
    api.post('/auth/login', { email, password }),

  // POST /api/auth/forgot-password
  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }),

  // POST /api/auth/verify-reset-code
  verifyResetCode: (email, reset_code) =>
    api.post('/auth/verify-reset-code', { email, reset_code }),

  // POST /api/auth/reset-password
  resetPassword: (email, reset_code, new_password) =>
    api.post('/auth/reset-password', { email, reset_code, new_password }),

  // Logout - Clear auth data
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
  },

  // GET /api/auth/profile
  getProfile: () => api.get('/auth/profile')
};

// ==================== LANDING PAGE ENDPOINTS ====================
export const landingAPI = {
  // GET /api/landing/services
  getServices: () => 
    api.get('/landing/services'),
};

// ==================== DASHBOARD ENDPOINTS ====================
export const dashboardAPI = {
  // GET /api/dashboard/user
  getUserInfo: () => 
    api.get('/dashboard/user'),
  
  // GET /api/dashboard/modules
  getModules: () => 
    api.get('/dashboard/modules'),
  
  // GET /api/dashboard/pending
  getPendingItems: () => 
    api.get('/dashboard/pending'),

  // GET /api/dashboard/quick-access
  getQuickAccess: () => 
    api.get('/dashboard/quick-access'),
};

// ==================== CHAT/AI ENDPOINTS ====================
export const chatAPI = {
  // POST /api/chat/message
  sendMessage: (message, conversationId = null, mode = 'general') => 
    api.post('/chat/message', { message, conversationId, mode }),
  
  // GET /api/chat/history
  getHistory: () => 
    api.get('/chat/history'),
  
  // GET /api/chat/quick-questions
  getQuickQuestions: () => 
    api.get('/chat/quick-questions'),

  // POST /api/chat/quick-response
  getQuickResponse: (question) => 
    api.post('/chat/quick-response', { question }),

  // GET /api/chat/conversations
  getConversations: () => 
    api.get('/chat/conversations'),

  // POST /api/chat/conversations/:id/messages
  sendConversationMessage: (conversationId, message) => 
    api.post(`/chat/conversations/${conversationId}/messages`, { message }),

  // POST /api/chat/speech-to-text
  speechToText: (audioBlob, filename = 'speech.webm') => {
    const formData = new FormData();
    formData.append('file', audioBlob, filename);
    return api.post('/chat/speech-to-text', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // POST /api/chat/mental-health/next-question
  getNextMentalHealthQuestion: (conversationId, questionCount) =>
    api.post('/chat/mental-health/next-question', { conversationId, questionCount }),
};

// ==================== CARE/MENTAL HEALTH ENDPOINTS ====================
export const careAPI = {
  // GET /api/care/available-slots
  getAvailableSlots: (date) => 
    api.get('/care/available-slots', { params: { date } }),
  
  // POST /api/care/schedule-appointment
  scheduleAppointment: (params) => {
    // Handle both old format (date, time, counselorId) and new format (object)
    if (typeof params === 'string') {
      // Old format: scheduleAppointment(date, time, counselorId)
      const [date, time, counselorId] = arguments;
      return api.post('/care/schedule-appointment', { date, time, counselorId });
    }
    // New format: scheduleAppointment({date, time, counselorId, notes})
    return api.post('/care/schedule-appointment', params);
  },
  
  // GET /api/care/resources
  getResources: (category = 'all') => 
    api.get('/care/resources', { params: { category } }),
  
  // GET /api/care/resources/guided-exercises
  getGuidedExercises: () => 
    api.get('/care/resources/guided-exercises'),

  // GET /api/care/resources/articles
  getArticles: () => 
    api.get('/care/resources/articles'),

  // GET /api/care/resources/soundscapes
  getSoundscapes: () => 
    api.get('/care/resources/soundscapes'),

  // GET /api/care/my-appointments
  getAppointments: () => 
    api.get('/care/my-appointments'),

  // GET /api/care/counselor/bookings
  getCounselorBookings: () => 
    api.get('/care/counselor/bookings'),

  // PATCH /api/care/appointment/:id
  updateAppointment: (appointmentId, data) => 
    api.patch(`/care/appointment/${appointmentId}`, data),

  // DELETE /api/care/appointment/:id
  cancelAppointment: (appointmentId) => 
    api.delete(`/care/appointment/${appointmentId}`),

  // GET /api/care/crisis-hotline
  getCrisisHotline: () => 
    api.get('/care/crisis-hotline'),

  // GET /api/care/counselors
  getCounselors: () => 
    api.get('/care/counselors'),
};

// ==================== CONVERSATION HISTORY ENDPOINTS ====================
export const conversationAPI = {
  // GET /api/conversations
  getConversations: () => 
    api.get('/conversations'),
  
  // GET /api/conversations/:id
  getConversationById: (conversationId) => 
    api.get(`/conversations/${conversationId}`),
  
  // POST /api/conversations
  createConversation: (title) => 
    api.post('/conversations', { title }),
  
  // POST /api/conversations/:id/messages
  sendMessage: (conversationId, message) => 
    api.post(`/conversations/${conversationId}/messages`, { message }),

  // DELETE /api/conversations/:id
  deleteConversation: (conversationId) => 
    api.delete(`/conversations/${conversationId}`),
};

// ==================== ADMIN ENDPOINTS ====================
export const adminAPI = {
  // GET /api/admin/analytics/overview
  getAnalyticsOverview: () => 
    api.get('/admin/analytics/overview'),

  // GET /api/admin/analytics/users
  getUserAnalytics: (period = '30days') => 
    api.get('/admin/analytics/users', { params: { period } }),

  // GET /api/admin/analytics/sessions
  getSessionAnalytics: (period = '30days') => 
    api.get('/admin/analytics/sessions', { params: { period } }),

  // GET /api/admin/analytics/chat
  getChatAnalytics: (period = '30days') => 
    api.get('/admin/analytics/chat', { params: { period } }),

  // GET /api/admin/analytics/care
  getCareAnalytics: (period = '30days') => 
    api.get('/admin/analytics/care', { params: { period } }),

  // GET /api/admin/users
  getAllUsers: (limit = 50, offset = 0) => 
    api.get('/admin/users', { params: { limit, offset } }),

  // GET /api/admin/users/breakdown
  getUserBreakdown: () => 
    api.get('/admin/users/breakdown'),

  // GET /api/admin/support-tickets
  getSupportTickets: () => 
    api.get('/admin/support-tickets'),

  // GET /api/admin/system-health
  getSystemHealth: () => 
    api.get('/admin/system-health'),

  // POST /api/admin/knowledge-base/upload
  uploadKnowledgeBase: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/knowledge-base/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // GET /api/admin/knowledge-base/status
  getKnowledgeBaseStatus: () =>
    api.get('/admin/knowledge-base/status'),
    
  // POST /api/admin/timetable/upload
  uploadTimetable: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/timetable/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // GET /api/admin/timetable/status
  getTimetableStatus: () =>
    api.get('/admin/timetable/status'),
};

export default api;
