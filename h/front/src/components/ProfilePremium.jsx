import React, { useState } from 'react';
import { FiEdit2, FiSave, FiX, FiUser, FiMail, FiPhone, FiMapPin, FiBook, FiAward, FiSettings, FiLogOut, FiCamera, FiDownload } from 'react-icons/fi';

export default function ProfilePremium({ userName, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@university.edu',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    university: 'UC Berkeley',
    major: 'Computer Science',
    graduationYear: 2025,
    bio: 'Passionate about technology and learning'
  });

  const [tempData, setTempData] = useState(profileData);

  const achievements = [
    { id: 1, name: 'Quick Learner', icon: '⚡', description: 'Completed 5 modules in a week' },
    { id: 2, name: 'Chat Champion', icon: '💬', description: '100 successful conversations' },
    { id: 3, name: 'Rising Star', icon: '⭐', description: 'Achieved 90%+ score' },
    { id: 4, name: 'Community Leader', icon: '👨‍💼', description: 'Helped 10+ peers' }
  ];

  const stats = [
    { label: 'Total Chats', value: 145 },
    { label: 'Learning Hours', value: '234h' },
    { label: 'Achievements', value: 12 },
    { label: 'Study Streak', value: '21 days' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="profile-premium-container">
      {/* Profile Header */}
      <div className="profile-header glass-card card-premium">
        <div className="profile-banner"></div>
        
        <div className="profile-main">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <span>{profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}</span>
            </div>
            <button className="btn-avatar-edit">
              <FiCamera />
            </button>
          </div>

          <div className="profile-info">
            <h1 className="gradient-text">
              {profileData.firstName} {profileData.lastName}
            </h1>
            <p className="profile-role">{profileData.major} • {profileData.university}</p>
            <p className="profile-bio">{profileData.bio}</p>
          </div>

          <div className="profile-actions">
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <FiX /> : <FiEdit2 />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            {isEditing && (
              <button className="btn btn-secondary" onClick={handleSave}>
                <FiSave /> Save Changes
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-section">
        <h2>Your Statistics</h2>
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card glass-card hover-lift">
              <div className="stat-value gradient-text">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Details */}
      <div className="profile-details-section glass-card">
        <h2>Personal Information</h2>
        
        {isEditing ? (
          <form className="profile-form">
            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label"><FiUser /> First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={tempData.firstName}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group flex-1">
                <label className="form-label"><FiUser /> Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={tempData.lastName}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label"><FiMail /> Email</label>
              <input
                type="email"
                name="email"
                value={tempData.email}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label"><FiPhone /> Phone</label>
              <input
                type="tel"
                name="phone"
                value={tempData.phone}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label"><FiMapPin /> Location</label>
                <input
                  type="text"
                  name="location"
                  value={tempData.location}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group flex-1">
                <label className="form-label"><FiBook /> Major</label>
                <input
                  type="text"
                  name="major"
                  value={tempData.major}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                name="bio"
                value={tempData.bio}
                onChange={handleInputChange}
                className="form-input"
                rows="4"
              ></textarea>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="detail-item">
              <FiUser /> <span className="detail-label">Full Name:</span>
              <span className="detail-value">{profileData.firstName} {profileData.lastName}</span>
            </div>
            <div className="detail-item">
              <FiMail /> <span className="detail-label">Email:</span>
              <span className="detail-value">{profileData.email}</span>
            </div>
            <div className="detail-item">
              <FiPhone /> <span className="detail-label">Phone:</span>
              <span className="detail-value">{profileData.phone}</span>
            </div>
            <div className="detail-item">
              <FiMapPin /> <span className="detail-label">Location:</span>
              <span className="detail-value">{profileData.location}</span>
            </div>
            <div className="detail-item">
              <FiBook /> <span className="detail-label">University:</span>
              <span className="detail-value">{profileData.university}</span>
            </div>
            <div className="detail-item">
              <FiBook /> <span className="detail-label">Major:</span>
              <span className="detail-value">{profileData.major}</span>
            </div>
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h2>Achievements</h2>
        <div className="achievements-grid">
          {achievements.map((achievement, idx) => (
            <div key={achievement.id} className="achievement-card glass-card hover-lift">
              <div className="achievement-icon">{achievement.icon}</div>
              <h3>{achievement.name}</h3>
              <p>{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Settings & Actions */}
      <div className="settings-section">
        <h2>Settings & Actions</h2>
        <div className="settings-list">
          <div className="setting-item glass-card">
            <FiSettings /> <span>Account Settings</span>
            <button className="btn btn-secondary btn-sm">Manage</button>
          </div>
          <div className="setting-item glass-card">
            <FiDownload /> <span>Download My Data</span>
            <button className="btn btn-secondary btn-sm">Export</button>
          </div>
          <div className="setting-item glass-card">
            <FiLogOut /> <span>Sign Out</span>
            <button className="btn btn-secondary btn-sm" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
