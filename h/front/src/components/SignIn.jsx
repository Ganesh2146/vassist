import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiUser, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { authAPI } from '../api/config';

export default function SignIn({ onSignInSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      console.warn('Sign In Validation Failed: Missing email or password');
      return;
    }
    
    console.log('Sign In Attempt:');
    console.log('  Email:', email);
    console.log('  Timestamp:', new Date().toISOString());
    
    setLoading(true);
    try {
      // API ENDPOINT: POST /api/auth/login
      console.log('Sending Sign In request to backend...');
      const response = await authAPI.signIn(email, password);
      console.log('Sign In successful:', response.data);
      const userData = response.data.data.user;
      
      // Store auth token
      const token = response.data.data.access_token || `token-${Date.now()}`;
      const userName = [userData.first_name, userData.last_name].filter(Boolean).join(' ') || userData.first_name || email.split('@')[0];
      const userTypeValue = userData.user_type || 'student';
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', String(userData.id || userData.user_id || ''));
      localStorage.setItem('userName', userName);
      localStorage.setItem('userType', userTypeValue);
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('lastLoginAt', new Date().toISOString());
      
      console.log('Auth data stored successfully');
      console.log('  Token:', token);
      console.log('  User:', userName);
      console.log('  Type:', userTypeValue);
      
      setLoading(false);
      onSignInSuccess();
      
      // Redirect based on user type
      if (userTypeValue === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.userMessage || (err.message === 'Network Error' ? 'Cannot connect to backend server. Please start backend and try again.' : 'Sign in failed');
      setError(errorMsg);
      console.error('Sign In Error:', {
        message: errorMsg,
        status: err.response?.status,
        data: err.response?.data
      });
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column page-container">
      {/* Header */}
      <header className="bg-surface border-bottom border-subtle px-4 py-3">
        <div className="container-fluid flex-between px-0">
          <Link to="/" className="text-decoration-none">
            <h1 className="mb-0 fw-bold fs-3 text-primary">V-Assist</h1>
          </Link>
          <Link to="/" className="btn btn-link text-muted fw-semibold text-decoration-none">
            Home
          </Link>
        </div>
      </header>

      {/* Sign In Form */}
      <div className="flex-grow-1 flex-center py-5 px-3 px-md-4 position-relative overflow-hidden" style={{ backgroundColor: 'var(--bg-main)' }}>
        {/* Background Icons */}
        <div className="position-absolute opacity-10 text-primary animate-float" style={{ top: '10%', left: '5%' }}><FiShield size={120} /></div>
        <div className="position-absolute opacity-10 text-primary animate-float stagger-2" style={{ bottom: '15%', right: '8%' }}><FiLock size={100} /></div>
        <div className="position-absolute opacity-10 text-primary animate-float stagger-1" style={{ top: '30%', right: '10%' }}><FiUser size={140} /></div>
        <div className="position-absolute opacity-10 text-primary animate-float stagger-3" style={{ bottom: '10%', left: '15%' }}><FiCheck size={110} /></div>
        
        <div className="w-100 position-relative z-1" style={{ maxWidth: '450px' }}>
          <div className="surface-card p-4 p-md-5 animate-slide-up">
            <h2 className="fs-2 fw-bold text-dark mb-2">
              Welcome Back
            </h2>
            <p className="text-muted mb-4 fs-6 fw-medium">
              Sign in to your V-Assist account
            </p>

            {error && (
              <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-3 mb-4 fs-6 fw-medium d-flex align-items-center gap-2">
                <FiAlertCircle size={20} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0 border-subtle text-muted">
                    <FiMail size={18} />
                  </span>
                  <input
                    type="email"
                    className="form-control border-start-0 border-subtle bg-transparent input-modern ps-0"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@university.edu"
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex-between mb-2">
                  <label className="form-label mb-0 fw-semibold text-dark">Password</label>
                  <Link to="/forgot-password" className="text-primary text-decoration-none fs-6 fw-semibold">Forgot?</Link>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0 border-subtle text-muted">
                    <FiLock size={18} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control border-start-0 border-end-0 border-subtle bg-transparent input-modern px-0"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="btn border border-start-0 border-subtle bg-transparent text-muted px-3 transition-normal hover-bg-subtle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-modern btn-primary-gradient w-100 py-3 fs-5"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="text-center text-muted mt-4 mb-0 fs-6 fw-medium">
              New to V-Assist?{' '}
              <Link to="/signup" className="text-primary fw-bold text-decoration-none hover-scale d-inline-block transition-normal">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-modern py-3 text-center border-top border-subtle" style={{ backgroundColor: 'var(--bg-card)' }}>
        <p className="text-muted mb-0 fs-6">© 2026 V-Assist University Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}
