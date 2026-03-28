import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiCheckCircle, FiBook, FiAward, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { authAPI } from '../api/config';

export default function SignUp({ onSignUpSuccess }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password strength checker function
  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'var(--border-subtle)' };
    
    let score = 0;
    
    // Length check
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    
    // Uppercase letters
    if (/[A-Z]/.test(pass)) score += 1;
    
    // Lowercase letters
    if (/[a-z]/.test(pass)) score += 1;
    
    // Numbers
    if (/[0-9]/.test(pass)) score += 1;
    
    // Special characters
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass)) score += 1;
    
    let label = '';
    let color = 'var(--border-subtle)';
    
    if (score <= 2) {
      label = 'Weak';
      color = 'var(--danger)';
    } else if (score <= 4) {
      label = 'Fair';
      color = 'var(--warning)';
    } else if (score <= 5) {
      label = 'Good';
      color = 'var(--success)';
    } else {
      label = 'Strong';
      color = 'var(--success-dark, #059669)';
    }
    
    return { score: Math.min(score, 7), label, color };
  };

  const passwordStrength = calculatePasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      console.warn('Sign Up Validation Failed: Missing required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      console.warn('Sign Up Validation Failed: Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      console.warn('Sign Up Validation Failed: Password too short');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      console.warn('Sign Up Validation Failed: Invalid email format');
      return;
    }
    
    console.log('Sign Up Attempt:');
    console.log('  First Name:', firstName);
    console.log('  Last Name:', lastName);
    console.log('  Email:', email);
    console.log('  User Type:', userType);
    console.log('  Timestamp:', new Date().toISOString());
    
    setLoading(true);
    try {
      // API ENDPOINT: POST /api/auth/register
      console.log('Sending Sign Up request to backend...');
      const response = await authAPI.signUp(firstName, lastName, email, password, userType);
      console.log('Sign Up successful:', response.data);
      
      // Store auth token - use user_id as token if no access_token is provided
      const token = response.data.data.access_token || response.data.data.user_id.toString();
      const userData = response.data.data.user || {
        id: response.data.data.user_id,
        first_name: firstName,
        last_name: lastName,
        email,
        user_type: userType,
      };
      const userName = [userData.first_name, userData.last_name].filter(Boolean).join(' ') || firstName + ' ' + lastName;
      const userTypeValue = userData.user_type || userType;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', String(userData.id || userData.user_id || response.data.data.user_id || ''));
      localStorage.setItem('userName', userName);
      localStorage.setItem('userType', userTypeValue);
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('lastLoginAt', new Date().toISOString());
      
      console.log('Auth data stored successfully');
      console.log('  Token:', token);
      console.log('  User:', userName);
      console.log('  Type:', userTypeValue);
      
      setLoading(false);
      onSignUpSuccess();
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.userMessage || (err.message === 'Network Error' ? 'Cannot connect to backend server. Please start backend and try again.' : 'Sign up failed');
      setError(errorMsg);
      console.error('Sign Up Error:', {
        message: errorMsg,
        status: err.response?.status,
        data: err.response?.data,
        timestamp: new Date().toISOString()
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

      {/* Sign Up Form */}
      <div className="flex-grow-1 flex-center py-5 px-3 px-md-4 position-relative overflow-hidden" style={{ backgroundColor: 'var(--bg-main)' }}>
        {/* Background Icons */}
        <div className="position-absolute opacity-10 text-primary animate-float" style={{ top: '12%', left: '8%' }}><FiBook size={120} /></div>
        <div className="position-absolute opacity-10 text-primary animate-float stagger-2" style={{ bottom: '18%', right: '10%' }}><FiAward size={110} /></div>
        <div className="position-absolute opacity-10 text-primary animate-float stagger-1" style={{ top: '35%', right: '8%' }}><FiCheckCircle size={130} /></div>
        <div className="position-absolute opacity-10 text-primary animate-float stagger-3" style={{ bottom: '12%', left: '12%' }}><FiUser size={100} /></div>
        
        <div className="w-100 position-relative z-1" style={{ maxWidth: '520px' }}>
          <div className="surface-card p-4 p-md-5 animate-slide-up">
            <div className="mb-4">
              <h2 className="fs-2 fw-bold text-dark mb-2">
                Join V-Assist
              </h2>
              <p className="text-muted mb-0 fs-6 fw-medium">
                Create your account in seconds
              </p>
            </div>

            {error && (
              <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-3 mb-4 fs-6 fw-medium d-flex align-items-center gap-2">
                <FiAlertCircle size={20} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                {/* First Name */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-dark fs-6">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control bg-transparent input-modern"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                  />
                </div>

                {/* Last Name */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-dark fs-6">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control bg-transparent input-modern"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark fs-6">
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

              {/* User Type */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark fs-6">
                  Account Type
                </label>
                <select
                  className="form-select bg-transparent input-modern"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="counselor">Counselor</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark fs-6">
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0 border-subtle text-muted">
                    <FiLock size={18} />
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0 border-subtle bg-transparent input-modern ps-0"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                
                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-3">
                    <div className="d-flex gap-1 mb-2">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className="flex-grow-1 rounded-pill transition-normal"
                          style={{
                            height: '6px',
                            backgroundColor: i < passwordStrength.score ? passwordStrength.color : 'var(--border-subtle)',
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex-between">
                      <span className="fs-7 text-muted fw-medium">
                        Strength: <span className="fw-bold" style={{color: passwordStrength.color}}>{passwordStrength.label}</span>
                      </span>
                      <span className="fs-7 text-muted fw-medium">
                        {passwordStrength.score}/7
                      </span>
                    </div>
                    <ul className="list-unstyled fs-7 mt-2 d-flex flex-wrap gap-2">
                      <li className="d-flex align-items-center gap-1 w-100" style={{color: /[a-z]/.test(password) ? 'var(--success)' : 'var(--text-muted)'}}>
                        <FiCheck size={12} opacity={/[a-z]/.test(password) ? 1 : 0.3} /> Lowercase letters
                      </li>
                      <li className="d-flex align-items-center gap-1 w-100" style={{color: /[A-Z]/.test(password) ? 'var(--success)' : 'var(--text-muted)'}}>
                        <FiCheck size={12} opacity={/[A-Z]/.test(password) ? 1 : 0.3} /> Uppercase letters
                      </li>
                      <li className="d-flex align-items-center gap-1 w-100" style={{color: /[0-9]/.test(password) ? 'var(--success)' : 'var(--text-muted)'}}>
                        <FiCheck size={12} opacity={/[0-9]/.test(password) ? 1 : 0.3} /> Numbers
                      </li>
                      <li className="d-flex align-items-center gap-1 w-100" style={{color: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'var(--success)' : 'var(--text-muted)'}}>
                        <FiCheck size={12} opacity={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 1 : 0.3} /> Special characters
                      </li>
                      <li className="d-flex align-items-center gap-1 w-100" style={{color: password.length >= 8 ? 'var(--success)' : 'var(--text-muted)'}}>
                        <FiCheck size={12} opacity={password.length >= 8 ? 1 : 0.3} /> At least 8 characters
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-dark fs-6">
                  Confirm Password
                </label>
                 <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0 border-subtle text-muted">
                    <FiLock size={18} />
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0 border-subtle bg-transparent input-modern ps-0"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-modern btn-primary-gradient w-100 py-3 fs-5"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-muted mt-4 mb-0 fs-6 fw-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-primary fw-bold text-decoration-none hover-scale d-inline-block transition-normal">
                Sign In
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
