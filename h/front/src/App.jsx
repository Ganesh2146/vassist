import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Landing from './components/Landing';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import Care from './components/Care';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('student');
  const [loading, setLoading] = useState(true);

  // Check authentication on app mount
  useEffect(() => {
    console.log('🔍 App mounted - Checking authentication');
    const token = localStorage.getItem('authToken');
    const name = localStorage.getItem('userName');
    const type = localStorage.getItem('userType') || 'student';
    
    if (token && name) {
      console.log('Authentication token found');
      console.log('  Token:', token);
      console.log('  User:', name);
      console.log('  Type:', type);
      setIsLoggedIn(true);
      setUserName(name);
      setUserType(type);
    } else {
      console.log('No authentication token found');
      setIsLoggedIn(false);
    }
    setLoading(false);
  }, []);

  const handleSignInSuccess = () => {
    console.log('Sign In Success - Updating app state');
    const name = localStorage.getItem('userName') || 'User';
    const type = localStorage.getItem('userType') || 'student';
    console.log('  User name set to:', name);
    console.log('  User type:', type);
    setIsLoggedIn(true);
    setUserName(name);
    setUserType(type);
  };

  const handleLogout = () => {
    console.log('🚪 Logout - Clearing authentication');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserName('');
    setUserType('student');
    console.log('Authentication cleared');
  };

  if (loading) {
    return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>Loading...</div>;
  }

  const isAdmin = userType === 'admin';

  return (
    <Router>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'var(--bg-surface)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-md)'
          }
        }} 
      />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<SignIn onSignInSuccess={handleSignInSuccess} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin-login" element={<AdminLogin onSignInSuccess={handleSignInSuccess} />} />
        <Route path="/signup" element={<SignUp onSignUpSuccess={handleSignInSuccess} />} />
        
        {/* ADMIN ROUTES */}
        <Route 
          path="/admin" 
          element={isLoggedIn && isAdmin ? <AdminDashboard userName={userName} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        
        {/* PROTECTED ROUTES */}
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? <Dashboard userName={userName} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/chat" 
          element={isLoggedIn ? <Chat userName={userName} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/profile" 
          element={isLoggedIn ? <Profile userName={userName} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/care" 
          element={isLoggedIn ? <Care onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />

        {/* CATCH ALL - Redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
