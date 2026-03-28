import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiArrowLeft, FiShield, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import PageTransition from './PageTransition';
import { authAPI } from '../api/config';

export default function AdminLogin({ onSignInSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      console.warn('Admin Login Validation Failed: Missing email or password');
      return;
    }
    
    console.log('Admin Login Attempt:');
    console.log('  Email:', email);
    console.log('  Timestamp:', new Date().toISOString());
    
    setLoading(true);
    try {
      // API ENDPOINT: POST /api/auth/login
      console.log('📡 Sending Admin Login request to backend...');
      const response = await authAPI.signIn(email, password);
      console.log('Admin Login successful:', response.data);
      const userData = response.data.data.user;
      
      if (userData.user_type !== 'admin') {
        toast.error('This account is not an admin account');
        console.error('User is not admin');
        setLoading(false);
        return;
      }
      
      // Store auth data
      const token = response.data.data.access_token || `token-${Date.now()}`;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', String(userData.id || userData.user_id || ''));
      localStorage.setItem('userName', [userData.first_name, userData.last_name].filter(Boolean).join(' ') || userData.first_name || email.split('@')[0]);
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('lastLoginAt', new Date().toISOString());
      
      console.log('Admin Authentication stored');
      setLoading(false);
      onSignInSuccess?.();
      navigate('/admin');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.userMessage || (err.message === 'Network Error' ? 'Cannot connect to backend server. Please start backend and try again.' : 'Admin login failed');
      toast.error(errorMsg);
      console.error('Admin Login Error:', {
        message: errorMsg,
        status: err.response?.status,
        data: err.response?.data,
        timestamp: new Date().toISOString()
      });
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-main)' }}>
        {/* Header */}
        <header className="bg-surface border-bottom border-subtle px-4 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
              <FiArrowLeft size={20} className="text-primary" />
              <h1 className="mb-0 fs-4 fw-bold text-primary" style={{ letterSpacing: '0.5px' }}>V-Assist</h1>
            </Link>
            <Link to="/" className="text-muted fw-semibold text-decoration-none hover-link">
              Home
            </Link>
          </div>
        </header>

        {/* Login Form */}
        <div className="flex-grow-1 flex-center p-4">
          <div className="w-100" style={{ maxWidth: '500px' }}>
            <div className="surface-card p-4 p-md-5 rounded-4 shadow-lg text-center position-relative overflow-hidden">
              {/* Background accent */}
              <div className="position-absolute bg-warning bg-opacity-10 rounded-circle w-50 h-50" style={{ top: '-10%', left: '-10%', filter: 'blur(30px)' }}></div>
              <div className="position-absolute bg-primary bg-opacity-10 rounded-circle w-50 h-50" style={{ bottom: '-10%', right: '-10%', filter: 'blur(30px)' }}></div>
              
              <div className="position-relative z-1">
                <div className="bg-warning bg-opacity-10 text-warning mx-auto rounded-circle flex-center mb-4" style={{ width: '64px', height: '64px' }}>
                  <FiShield size={32} />
                </div>
                
                <h2 className="fs-3 fw-bold text-dark mb-2">
                  Admin Portal
                </h2>
                <p className="text-muted fw-medium mb-4 pb-2 fs-6">
                  Secure access for administrators
                </p>

                <form onSubmit={handleSubmit} className="text-start">
                  {/* Email */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark fs-7">Admin Email</label>
                    <div className="input-group input-modern bg-main rounded-3 overflow-hidden border border-subtle transition-normal focus-ring">
                      <span className="input-group-text bg-transparent border-0 pe-2 ps-3">
                        <FiMail size={18} className="text-muted" />
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control bg-transparent border-0 ps-2 py-3"
                        placeholder="admin@vassist.edu"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark fs-7">Password</label>
                    <div className="input-group input-modern bg-main rounded-3 overflow-hidden border border-subtle transition-normal focus-ring">
                      <span className="input-group-text bg-transparent border-0 pe-2 ps-3">
                        <FiLock size={18} className="text-muted" />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control bg-transparent border-0 ps-2 py-3"
                        placeholder="••••••••"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="btn border-0 text-muted px-3 d-flex align-items-center"
                      >
                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-modern w-100 py-3 fs-6 d-flex justify-content-center align-items-center gap-2"
                    style={{ backgroundColor: 'var(--warning)', color: 'white', opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Signing In...</>
                    ) : (
                      'Sign In as Admin'
                    )}
                  </button>
                </form>

                <p className="text-center text-muted mt-4 pt-3 fs-7 fw-medium border-top border-subtle">
                  Not an admin?{' '}
                  <Link to="/login" className="text-primary fw-bold text-decoration-none ms-1 hover-link">
                    User Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-surface text-muted p-4 text-center border-top border-subtle fs-8 fw-semibold">
          <p className="mb-0">© 2026 V-Assist Admin Portal. All rights reserved.</p>
        </footer>
      </div>
    </PageTransition>
  );
}
