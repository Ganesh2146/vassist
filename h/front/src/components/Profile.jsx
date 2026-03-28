import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiPhone, FiLock, FiSettings, FiLogOut, FiSave, FiAlertCircle, FiMessageSquare, FiShield, FiBell, FiTrendingUp, FiEdit2, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import TopNav from './TopNav';
import PageTransition from './PageTransition';

export default function Profile({ userName, onLogout }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Get initial user data from localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('userProfilePhoto') || '');
  
  const [formData, setFormData] = useState({
    first_name: userData.first_name || '',
    last_name: userData.last_name || '',
    email: userData.email || '',
    user_type: userData.user_type || 'student',
    phone: localStorage.getItem('userPhone') || '',
    bio: localStorage.getItem('userBio') || '',
    notifications_enabled: JSON.parse(localStorage.getItem('notificationsEnabled') || 'true'),
    two_factor_auth: JSON.parse(localStorage.getItem('twoFactorAuth') || 'false')
  });

  // Handle profile photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get initials from first and last name
  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return (first + last).slice(0, 2);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      // Update userData in localStorage
      const updatedUserData = {
        ...userData,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        user_type: formData.user_type
      };
      
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      localStorage.setItem('userName', `${formData.first_name} ${formData.last_name}`);
      localStorage.setItem('userPhone', formData.phone);
      localStorage.setItem('userBio', formData.bio);
      localStorage.setItem('notificationsEnabled', JSON.stringify(formData.notifications_enabled));
      localStorage.setItem('twoFactorAuth', JSON.stringify(formData.two_factor_auth));
      localStorage.setItem('userProfilePhoto', profilePhoto);
      
      toast.success('Profile updated successfully!');
      console.log('Profile updated:', updatedUserData);
      
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      email: userData.email || '',
      user_type: userData.user_type || 'student',
      phone: localStorage.getItem('userPhone') || '',
      bio: localStorage.getItem('userBio') || '',
      notifications_enabled: JSON.parse(localStorage.getItem('notificationsEnabled') || 'true'),
      two_factor_auth: JSON.parse(localStorage.getItem('twoFactorAuth') || 'false')
    });
    setIsEditing(false);
  };

  return (
    <PageTransition>
      <div className="d-flex flex-column" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', paddingTop: '80px' }}>
        <TopNav />

        {/* Main Content */}
        <main className="flex-grow-1 pt-4 px-4 position-relative overflow-hidden" style={{ backgroundColor: 'var(--bg-main)' }}>
          
          <div className="container-fluid mx-auto position-relative z-1 animate-slide-up" style={{ maxWidth: '800px' }}>
          {/* Profile Card */}
          <div className="surface-card overflow-hidden border border-subtle animate-slide-up">
            {/* Profile Header */}
            <div className="p-4 p-md-5 d-flex flex-column flex-sm-row align-items-center gap-4 position-relative" style={{ background: 'var(--bs-body-bg)' }}>
              <div className="position-relative flex-shrink-0">
                <div className="flex-center border-3 border-subtle rounded-4 shadow-sm" style={{
                  width: '120px',
                  height: '120px',
                  fontSize: '48px',
                  fontWeight: 900,
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  backgroundImage: profilePhoto ? `url(${profilePhoto})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: 'var(--bs-body-color)'
                }}>
                  {!profilePhoto && getInitials(formData.first_name, formData.last_name)}
                </div>
                {isEditing && (
                  <label className="position-absolute bottom-0 end-0 border border-subtle rounded-circle flex-center shadow-md transition-normal hover-scale cursor-pointer" style={{
                    width: '40px', height: '40px', right: '-8px', bottom: '-8px',
                    backgroundColor: 'var(--bs-body-bg)',
                    color: 'var(--bs-body-color)'
                  }} title="Upload profile photo">
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="d-none" />
                    <FiEdit2 size={18} />
                  </label>
                )}
              </div>
              
              <div className="flex-grow-1 d-flex flex-column flex-sm-row justify-content-between align-items-center align-items-sm-start text-center text-sm-start gap-3 w-100 w-sm-auto">
                <div>
                  <h2 className="fs-2 fw-bold mb-2" style={{ color: 'var(--bs-body-color)' }}>
                    {formData.first_name} {formData.last_name}
                  </h2>
                  <p className="mb-0 fs-6 text-muted fw-medium">
                    <span className="fw-semibold text-capitalize badge bg-secondary bg-opacity-10 text-dark px-3 py-2" style={{ color: 'var(--bs-body-color)' }}>
                      {formData.user_type}
                    </span>
                  </p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-sm fw-semibold d-flex align-items-center gap-2 rounded-pill px-4 py-2 border border-subtle transition-normal hover-scale"
                    style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--bs-body-color)' }}
                  >
                    <FiEdit2 size={16} /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-4 p-md-5">
              {/* Personal Information Section */}
              <div className="mb-5">
                <h3 className="fs-5 fw-bold text-dark mb-4">
                  Personal Information
                </h3>
                <div className="row g-4">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark fs-6">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`form-control input-modern ${!isEditing ? 'bg-secondary bg-opacity-10 border-0' : 'bg-transparent'}`}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark fs-6">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`form-control input-modern ${!isEditing ? 'bg-secondary bg-opacity-10 border-0' : 'bg-transparent'}`}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark fs-6">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`form-control input-modern ${!isEditing ? 'bg-secondary bg-opacity-10 border-0' : 'bg-transparent'}`}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark fs-6">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      disabled={!isEditing}
                      className={`form-control input-modern ${!isEditing ? 'bg-secondary bg-opacity-10 border-0' : 'bg-transparent'}`}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark fs-6">Bio / About You</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      disabled={!isEditing}
                      rows="4"
                      className={`form-control input-modern ${!isEditing ? 'bg-secondary bg-opacity-10 border-0' : 'bg-transparent'}`}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                </div>
              </div>

              {/* Account Settings Section */}
              <div className="pt-4 border-top border-subtle mb-4">
                <h3 className="fs-5 fw-bold text-dark mb-4">
                  Account Settings
                </h3>
                <div className="d-flex flex-column gap-4">
                  <div className="flex-between">
                    <div>
                      <h5 className="mb-1 fw-semibold text-dark fs-6 d-flex align-items-center gap-2">
                        <FiBell className="text-secondary" /> Email Notifications
                      </h5>
                      <p className="mb-0 fs-7 text-muted">Receive updates about your account</p>
                    </div>
                    <div className="form-check form-switch fs-4">
                      <input
                        className="form-check-input cursor-pointer"
                        type="checkbox"
                        role="switch"
                        name="notifications_enabled"
                        checked={formData.notifications_enabled}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="flex-between">
                    <div>
                      <h5 className="mb-1 fw-semibold text-dark fs-6 d-flex align-items-center gap-2">
                        <FiShield className="text-secondary" /> Two-Factor Authentication
                      </h5>
                      <p className="mb-0 fs-7 text-muted">Enhance your account security</p>
                    </div>
                    <div className="form-check form-switch fs-4">
                      <input
                        className="form-check-input cursor-pointer"
                        type="checkbox"
                        role="switch"
                        name="two_factor_auth"
                        checked={formData.two_factor_auth}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="d-flex gap-3 justify-content-end pt-3">
                  <button
                    onClick={handleCancel}
                    className="btn btn-light px-4 py-2 fw-semibold d-flex align-items-center gap-2"
                  >
                    <FiX size={18} /> Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    disabled={loading}
                    className="btn btn-primary px-4 py-2 fw-semibold d-flex align-items-center gap-2 rounded-pill shadow-sm hover-scale transition-normal"
                  >
                    <FiSave size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Account Stats */}
          <div className="row g-3 mt-4">
            <div className="col-12 col-sm-4">
              <div className="surface-card p-4 text-center h-100 hover-lift transition-normal">
                <p className="text-muted fs-7 fw-semibold text-uppercase letter-spacing-1 mb-2">Account Created</p>
                <p className="mb-0 fs-4 fw-bold text-dark">2026</p>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="surface-card p-4 text-center h-100 hover-lift transition-normal">
                <p className="text-muted fs-7 fw-semibold text-uppercase letter-spacing-1 mb-2">Chat Sessions</p>
                <p className="mb-0 fs-4 fw-bold text-dark">Active</p>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="surface-card p-4 text-center h-100 hover-lift transition-normal">
                <p className="text-muted fs-7 fw-semibold text-uppercase letter-spacing-1 mb-2">Account Status</p>
                <p className="mb-0 fs-4 fw-bold text-dark">Verified</p>
              </div>
            </div>
          </div>

          {/* Bottom Scroll Spacer for Navbar clearance */}
          <div style={{ height: '120px', width: '100%' }}></div>
        </div>
      </main>
      </div>
    </PageTransition>
  );
}
