import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBarChart3, FiTrendingUp, FiAward, FiBook, FiUsers, FiCalendar, FiClock, FiCheckCircle, FiArrowRight, FiSettings, FiBell, FiMessageCircle } from 'react-icons/fi';

export default function DashboardPremium({ userName, onLogout }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [userStats, setUserStats] = useState({
    totalChats: 45,
    coursesEnrolled: 8,
    averageScore: 87,
    hoursLearned: 124,
    achievements: 12,
    daysStreak: 7
  });

  const modules = [
    {
      id: 1,
      name: 'Admissions Support',
      icon: FiBook,
      progress: 65,
      description: 'Career guidance and college preparation',
      stats: { chats: 12, score: 94 }
    },
    {
      id: 2,
      name: 'Academic Success',
      icon: FiAward,
      progress: 82,
      description: 'Course selection and study resources',
      stats: { chats: 28, score: 91 }
    },
    {
      id: 3,
      name: 'Financial Planning',
      icon: FiTrendingUp,
      progress: 45,
      description: 'Aid options and budgeting tools',
      stats: { chats: 5, score: 78 }
    },
    {
      id: 4,
      name: 'Campus Life',
      icon: FiUsers,
      progress: 88,
      description: 'Clubs, events, and community',
      stats: { chats: 18, score: 85 }
    },
    {
      id: 5,
      name: 'Career Development',
      icon: FiBarChart3,
      progress: 54,
      description: 'Internships and job preparation',
      stats: { chats: 8, score: 82 }
    },
    {
      id: 6,
      name: 'Wellness Resources',
      icon: FiCheckCircle,
      progress: 71,
      description: 'Mental health and support services',
      stats: { chats: 4, score: 90 }
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Completed admissions course', time: '2 hours ago', icon: FiCheckCircle },
    { id: 2, action: 'Financial aid consultation', time: '5 hours ago', icon: FiMessageCircle },
    { id: 3, action: 'Achieved "Quick Learner" badge', time: '1 day ago', icon: FiAward },
    { id: 4, action: 'Joined study group', time: '2 days ago', icon: FiUsers }
  ];

  return (
    <div className="dashboard-premium-container">
      {/* Dashboard Header */}
      <div className="dashboard-header glass-card">
        <div className="header-content">
          <div>
            <h1 className="gradient-text">Welcome back, {userName || 'Student'}!</h1>
            <p className="header-subtitle">Your learning dashboard is ready.</p>
          </div>
          <div className="header-actions">
            <button className="btn-icon hover-lift" title="Notifications">
              <FiBell />
            </button>
            <button className="btn-icon hover-lift" title="Settings">
              <FiSettings />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-section">
        <h2>Your Progress</h2>
        <div className="stats-grid">
          <div className="stat-card hover-lift">
            <div className="stat-icon">
              <FiMessageCircle />
            </div>
            <div className="stat-info">
              <div className="stat-value">{userStats.totalChats}</div>
              <div className="stat-label">Total Chats</div>
            </div>
          </div>

          <div className="stat-card hover-lift">
            <div className="stat-icon">
              <FiBook />
            </div>
            <div className="stat-info">
              <div className="stat-value">{userStats.coursesEnrolled}</div>
              <div className="stat-label">Courses Enrolled</div>
            </div>
          </div>

          <div className="stat-card hover-lift">
            <div className="stat-icon">
              <FiTrendingUp />
            </div>
            <div className="stat-info">
              <div className="stat-value">{userStats.averageScore}%</div>
              <div className="stat-label">Average Score</div>
            </div>
          </div>

          <div className="stat-card hover-lift">
            <div className="stat-icon">
              <FiClock />
            </div>
            <div className="stat-info">
              <div className="stat-value">{userStats.hoursLearned}h</div>
              <div className="stat-label">Hours Learned</div>
            </div>
          </div>

          <div className="stat-card hover-lift">
            <div className="stat-icon">
              <FiAward />
            </div>
            <div className="stat-info">
              <div className="stat-value">{userStats.achievements}</div>
              <div className="stat-label">Achievements</div>
            </div>
          </div>

          <div className="stat-card hover-lift">
            <div className="stat-icon">
              <FiCalendar />
            </div>
            <div className="stat-info">
              <div className="stat-value">{userStats.daysStreak}</div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="modules-section">
        <h2>Learning Modules</h2>
        <div className="modules-grid">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <div
                key={module.id}
                className="module-card glass-card hover-lift"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setSelectedModule(module)}
              >
                <div className="module-header">
                  <div className="module-icon">
                    <Icon />
                  </div>
                  <h3>{module.name}</h3>
                </div>

                <p className="module-description">{module.description}</p>

                <div className="module-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${module.progress}%`,
                        background: `linear-gradient(90deg, #A855F7, #06B6D4)`
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">{module.progress}%</span>
                </div>

                <div className="module-stats">
                  <div className="stat-item">
                    <FiMessageCircle size={16} />
                    <span>{module.stats.chats} chats</span>
                  </div>
                  <div className="stat-item">
                    <FiTrendingUp size={16} />
                    <span>{module.stats.score}% score</span>
                  </div>
                </div>

                <button className="btn-continue">
                  Continue <FiArrowRight />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentActivities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="activity-item glass-card"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="activity-icon">
                  <Icon />
                </div>
                <div className="activity-content">
                  <p>{activity.action}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
