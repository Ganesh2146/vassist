import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiArrowLeft, FiShield, FiKey, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import PageTransition from './PageTransition';
import { authAPI } from '../api/config';

export default function ForgotPassword({ isDarkTheme }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Enter email, 2: Reset code, 3: New password
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Sending reset code...');
    try {
      await authAPI.forgotPassword(email);
      toast.success('OTP sent to your email. Please check inbox/spam and enter the code.', { id: loadingToast });
      setStep(2);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.userMessage || 'Failed to send reset code';
      toast.error(errorMsg, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    
    if (!resetCode || resetCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Verifying code...');
    try {
      await authAPI.verifyResetCode(email, resetCode);
      toast.success('Code verified! Enter your new password', { id: loadingToast });
      setStep(3);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.userMessage || 'Invalid reset code';
      toast.error(errorMsg, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Resetting password...');
    try {
      await authAPI.resetPassword(email, resetCode, newPassword);
      toast.success('Password reset successful! Redirecting to login...', { id: loadingToast });
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.userMessage || 'Password reset failed';
      toast.error(errorMsg, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-main)' }}>
        {/* Header */}
        <header className="bg-surface border-bottom border-subtle px-4 py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
              <FiArrowLeft size={20} className="text-primary" />
              <h1 className="mb-0 fs-4 fw-bold text-primary" style={{ letterSpacing: '0.5px' }}>V-Assist</h1>
            </Link>
            <Link to="/" className="text-muted fw-semibold text-decoration-none hover-link">
              Home
            </Link>
          </div>
        </header>

        {/* Form Container */}
        <div className="flex-grow-1 flex-center p-4">
          <div className="w-100" style={{ maxWidth: '500px' }}>
            <div className="surface-card gradient-bg-subtle p-4 p-md-5 rounded-4 shadow-lg text-center position-relative overflow-hidden" style={{ position: 'relative' }}>
              {/* Background accent */}
              <div className="position-absolute bg-primary bg-opacity-10 rounded-circle w-50 h-50" style={{ top: '-10%', left: '-10%', filter: 'blur(30px)' }}></div>
              <div className="position-absolute bg-info bg-opacity-10 rounded-circle w-50 h-50" style={{ bottom: '-10%', right: '-10%', filter: 'blur(30px)' }}></div>
              
              <div className="position-relative z-1">
                <div className="bg-primary bg-opacity-10 text-primary mx-auto rounded-circle flex-center mb-4" style={{ width: '64px', height: '64px' }}>
                  {step === 1 ? <FiMail size={32} /> : step === 2 ? <FiKey size={32} /> : <FiShield size={32} />}
                </div>
                
                <h2 className="gradient-text fs-3 fw-bold mb-2">
                  Reset Password
                </h2>
                <p className="text-muted fw-medium mb-4 pb-2 fs-6">
                  {step === 1 && 'Enter your email to receive a reset code'}
                  {step === 2 && 'Enter the 6-digit code sent to your email'}
                  {step === 3 && 'Create a new secure password'}
                </p>

                {/* Step 1: Email Verification */}
                {step === 1 && (
                  <form onSubmit={handleEmailSubmit} className="text-start">
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark fs-7">Email Address</label>
                      <div className="input-group input-modern bg-main rounded-3 overflow-hidden border border-subtle transition-normal focus-ring">
                        <span className="input-group-text bg-transparent border-0 pe-2 ps-3">
                          <FiMail size={18} className="text-muted" />
                        </span>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-control bg-transparent border-0 ps-2 py-3"
                          placeholder="name@vassist.edu"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-modern btn-primary w-100 py-3 fs-6 d-flex flex-center gap-2"
                      style={{ opacity: loading ? 0.7 : 1 }}
                    >
                      {loading ? (
                        <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...</>
                      ) : (
                        'Send Reset Code'
                      )}
                    </button>
                  </form>
                )}

                {/* Step 2: Code Verification */}
                {step === 2 && (
                  <form onSubmit={handleCodeSubmit} className="text-start">
                    <div className="mb-4 text-center">
                      <label className="form-label fw-semibold text-dark fs-7 mb-3">6-Digit Reset Code</label>
                      <input
                        type="text"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength="6"
                        className="form-control bg-main border-subtle text-center fw-bold text-primary focus-ring transition-normal rounded-3 mx-auto"
                        placeholder="000000"
                        style={{ fontSize: '28px', letterSpacing: '12px', padding: '16px', maxWidth: '300px' }}
                      />
                      <p className="text-muted fs-8 mt-3 mb-0 fw-medium">
                        Check your email (and spam folder) for the code.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-modern btn-primary w-100 py-3 fs-6 d-flex flex-center gap-2 mb-3"
                      style={{ opacity: loading ? 0.7 : 1 }}
                    >
                      {loading ? (
                        <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Verifying...</>
                      ) : (
                        'Verify Code'
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn btn-modern btn-outline-primary w-100 py-3 fs-6 bg-transparent"
                    >
                      Back to Email
                    </button>
                  </form>
                )}

                {/* Step 3: Password Reset */}
                {step === 3 && (
                  <form onSubmit={handlePasswordSubmit} className="text-start">
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark fs-7">New Password</label>
                      <div className="input-group input-modern bg-main rounded-3 overflow-hidden border border-subtle transition-normal focus-ring">
                        <span className="input-group-text bg-transparent border-0 pe-2 ps-3">
                          <FiLock size={18} className="text-muted" />
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
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

                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark fs-7">Confirm Password</label>
                      <div className="input-group input-modern bg-main rounded-3 overflow-hidden border border-subtle transition-normal focus-ring">
                        <span className="input-group-text bg-transparent border-0 pe-2 ps-3">
                          <FiLock size={18} className="text-muted" />
                        </span>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="form-control bg-transparent border-0 ps-2 py-3"
                          placeholder="••••••••"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="btn border-0 text-muted px-3 d-flex align-items-center"
                        >
                          {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-modern btn-primary w-100 py-3 fs-6 d-flex flex-center gap-2 mb-3"
                      style={{ opacity: loading ? 0.7 : 1 }}
                    >
                      {loading ? (
                        <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Resetting...</>
                      ) : (
                        'Reset Password'
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn btn-modern btn-outline-primary w-100 py-3 fs-6 bg-transparent"
                    >
                      Back to Code Verification
                    </button>
                  </form>
                )}

                <p className="text-center text-muted mt-4 pt-3 fs-7 fw-medium border-top border-subtle">
                  Remember your password?{' '}
                  <Link to="/login" className="text-primary fw-bold text-decoration-none ms-1 hover-link">
                    Back to Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
