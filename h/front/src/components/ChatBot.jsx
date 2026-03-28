import React, { useState } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import ConversationHistory from './ConversationHistory';

export default function ChatBot({ isDarkTheme }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Sign In Fields
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  
  // Sign Up Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newStudentId, setNewStudentId] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (signInEmail && signInPassword && studentId) {
      setTimeout(() => {
        setIsLoggedIn(true);
        setLoading(false);
      }, 800);
    } else {
      setError('Please fill in all fields');
      setLoading(false);
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setError('');
    
    if (!firstName || !lastName || !signUpEmail || !signUpPassword || !confirmPassword || !newStudentId) {
      setError('Please fill in all fields');
      return;
    }
    
    if (signUpPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSignInEmail('');
    setSignInPassword('');
    setStudentId('');
    setFirstName('');
    setLastName('');
    setSignUpEmail('');
    setSignUpPassword('');
    setConfirmPassword('');
    setNewStudentId('');
    setError('');
    setIsSignUp(false);
  };

  if (isLoggedIn) {
    return <ConversationHistory isDarkTheme={isDarkTheme} onLogout={handleLogout} />;
  }

  return (
    <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5 px-3" style={{backgroundColor: isDarkTheme ? '#0F172A' : '#F9FAFB'}}>
      <div className="w-100" style={{maxWidth: '500px'}}>
        
        {/* Form Container */}
        <div className="card shadow-lg" style={{backgroundColor: isDarkTheme ? '#1F2937' : '#FFFFFF', border: 'none', borderTop: '5px solid var(--primary-color)', borderRadius: '15px'}}>
          
          {/* Animated Background Header */}
          <div 
            className="card-header text-white text-center py-4"
            style={{
              backgroundImage: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
              border: 'none',
              borderRadius: '12px 12px 0 0'
            }}
          >
            <h3 className="mb-0 fw-800" style={{fontSize: '2rem'}}>V-Assist</h3>
            <p className="mb-0 mt-1 small" style={{opacity: 0.95}}>Student Portal</p>
          </div>

          <div className="card-body p-0">
            
            {/* Tab Buttons */}
            <div className="d-flex gap-1 p-3 border-bottom" style={{backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB', borderColor: isDarkTheme ? '#374151' : '#E5E7EB'}}>
              <button
                onClick={() => {setIsSignUp(false); setError('');}}
                className={`flex-grow-1 py-2 fw-600 rounded`}
                style={{
                  backgroundColor: !isSignUp ? 'var(--primary-color)' : 'transparent',
                  color: !isSignUp ? '#FFFFFF' : isDarkTheme ? '#D1D5DB' : '#6B7280',
                  border: 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => {setIsSignUp(true); setError('');}}
                className={`flex-grow-1 py-2 fw-600 rounded`}
                style={{
                  backgroundColor: isSignUp ? 'var(--secondary-color)' : 'transparent',
                  color: isSignUp ? '#FFFFFF' : isDarkTheme ? '#D1D5DB' : '#6B7280',
                  border: 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                Sign Up
              </button>
            </div>

            {/* Form Content */}
            <div className="p-5">
              
              {!isSignUp ? (
                // SIGN IN FORM
                <form onSubmit={handleSignIn}>
                  <h5 className="fw-700 mb-1" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>Welcome Back</h5>
                  <p className="small mb-4" style={{color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>Sign in to your account to continue</p>

                  {/* Student ID */}
                  <div className="mb-3">
                    <label className="form-label fw-600 small" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>
                      Student ID
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="STU123456"
                      style={{
                        backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB',
                        borderColor: 'var(--primary-color)',
                        color: isDarkTheme ? '#F1F5F9' : '#1F2937',
                        borderWidth: '2px'
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-600 small" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="student@university.edu"
                      style={{
                        backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB',
                        borderColor: 'var(--primary-color)',
                        color: isDarkTheme ? '#F1F5F9' : '#1F2937',
                        borderWidth: '2px'
                      }}
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label className="form-label fw-600 small" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB',
                        borderColor: 'var(--primary-color)',
                        color: isDarkTheme ? '#F1F5F9' : '#1F2937',
                        borderWidth: '2px'
                      }}
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="alert alert-danger mb-4 fw-600 small" style={{backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'var(--danger-color)', color: 'var(--danger-color)', borderLeft: '4px solid var(--danger-color)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <FiAlertCircle size={18} />
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-lg w-100 fw-700"
                    style={{
                      backgroundColor: 'var(--primary-color)',
                      color: '#FFFFFF',
                      border: 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Signing in...
                      </>
                    ) : (
                      '🔓 Sign In'
                    )}
                  </button>
                </form>
              ) : (
                // SIGN UP FORM
                <form onSubmit={handleSignUp}>
                  <h5 className="fw-700 mb-1" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>Create Account</h5>
                  <p className="small mb-4" style={{color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>Join V-Assist to access student support</p>

                  {/* First Name & Last Name */}
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-600 small" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>First Name</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        style={{
                          backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB',
                          borderColor: 'var(--primary-color)',
                          color: isDarkTheme ? '#F1F5F9' : '#1F2937',
                          borderWidth: '2px'
                        }}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-600 small" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>Last Name</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        style={{
                          backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB',
                          borderColor: 'var(--primary-color)',
                          color: isDarkTheme ? '#F1F5F9' : '#1F2937',
                          borderWidth: '2px'
                        }}
                      />
                    </div>
                  </div>

                  {/* Student ID */}
                  <div className="mb-3">
                    <label className="form-label fw-600 small" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>Student ID</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={newStudentId}
                      onChange={(e) => setNewStudentId(e.target.value)}
                      placeholder="STU123456"
                      style={{
                        backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB',
                        borderColor: 'var(--primary-color)',
                        color: isDarkTheme ? '#F1F5F9' : '#1F2937',
                        borderWidth: '2px'
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-600 small" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>Email Address</label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="student@university.edu"
                      style={{
                        backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB',
                        borderColor: 'var(--primary-color)',
                        color: isDarkTheme ? '#F1F5F9' : '#1F2937',
                        borderWidth: '2px'
                      }}
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label fw-600 small" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>Password</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB',
                        borderColor: 'var(--primary-color)',
                        color: isDarkTheme ? '#F1F5F9' : '#1F2937',
                        borderWidth: '2px'
                      }}
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label className="form-label fw-600 small" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>Confirm Password</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB',
                        borderColor: 'var(--primary-color)',
                        color: isDarkTheme ? '#F1F5F9' : '#1F2937',
                        borderWidth: '2px'
                      }}
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="alert alert-danger mb-4 fw-600 small" style={{backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'var(--danger-color)', color: 'var(--danger-color)', borderLeft: '4px solid var(--danger-color)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <FiAlertCircle size={18} />
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-lg w-100 fw-700"
                    style={{
                      backgroundColor: 'var(--secondary-color)',
                      color: '#FFFFFF',
                      border: 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Creating account...
                      </>
                    ) : (
                      '✓ Create Account'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-4 small" style={{color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>
          V-Assist © 2024 | Your AI-Powered Student Support
        </p>
      </div>
    </main>
  );
}
