import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSettings, FiPhone, FiBell, FiArrowRight, FiAward, FiBook, FiTrendingUp, FiShield, FiUsers, FiSmile, FiWind, FiMessageCircle, FiTarget, FiFeather } from 'react-icons/fi';
import TopNav from './TopNav';
import Skeleton from './Skeleton';
import PageTransition from './PageTransition';
import { dashboardAPI } from '../api/config';

export default function Dashboard({ userName, onLogout }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('📊 Dashboard Data Fetch Started');
      console.log('  Timestamp:', new Date().toISOString());
      setLoading(true);
      
      // API ENDPOINT: GET /api/dashboard/user
      console.log('📡 Fetching user info from GET /api/dashboard/user...');
      const userResponse = await dashboardAPI.getUserInfo();
      console.log('✅ User data received:', userResponse.data);
      setUserInfo(userResponse.data);
      
      // API ENDPOINT: GET /api/dashboard/modules
      console.log('📡 Fetching modules from GET /api/dashboard/modules...');
      const modulesResponse = await dashboardAPI.getModules();
      console.log('✅ Modules data received:', modulesResponse.data);
      
      // API ENDPOINT: GET /api/dashboard/quick-access
      console.log('📡 Fetching quick access items from GET /api/dashboard/quick-access...');
      const quickAccessResponse = await dashboardAPI.getQuickAccess();
      console.log('✅ Quick access data received:', quickAccessResponse.data);
      
      console.log('✅ Dashboard Data Fetch Complete');
      setLoading(false);
    } catch (error) {
      console.error('❌ Dashboard Data Fetch Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        timestamp: new Date().toISOString()
      });
      setLoading(false);
    }
  };

  const userFirstName = userName || 'Alex';
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userType = localStorage.getItem('userType') || 'student';
  const profilePhoto = localStorage.getItem('userProfilePhoto') || '';
  
  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return (first + last).slice(0, 2);
  };

  return (
    <PageTransition>
      <div className="d-flex flex-column" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', paddingTop: '80px' }}>
        <TopNav />

        {/* Main Content */}
      <main className="flex-grow-1 position-relative overflow-hidden pt-5 px-3 px-md-5">
        {/* Main Layer */}
        <div className="page-container position-relative z-1">
          {loading ? (
            <div className="animate-slide-up">
              <Skeleton height="200px" borderRadius="24px" className="mb-5" />
              <Skeleton width="30%" height="32px" className="mb-4" />
              <div className="grid-auto-fit mb-5">
                 <Skeleton height="160px" borderRadius="16px" />
                 <Skeleton height="160px" borderRadius="16px" />
                 <Skeleton height="160px" borderRadius="16px" />
                 <Skeleton height="160px" borderRadius="16px" />
              </div>
              <Skeleton height="120px" borderRadius="24px" className="mb-5" />
            </div>
          ) : (
            <>
              {/* Welcome Card - Enhanced */}
              <div className="surface-card rounded-4 p-4 p-md-5 mb-5 position-relative overflow-hidden shadow-sm d-flex align-items-center border border-subtle animate-slide-up" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(99, 102, 241, 0.02) 100%)' }}>
                <div className="position-relative z-2">
                  <h2 className="fw-900 mb-2 animate-slide-up stagger-1 fs-2 text-dark">
                    Welcome back, {userFirstName}!
                  </h2>
                  <p className="mb-0 fs-6 text-muted fw-medium animate-slide-up stagger-2" style={{ maxWidth: '600px', lineHeight: '1.7' }}>
                    {userType === 'student' ? 'You\'re making great progress. Continue exploring resources to support your academic journey.' :
                     userType === 'counselor' ? 'Your student appointments and mental health management dashboard are ready.' :
                     'Manage student queries, evaluate sentiment trends, and update academic calendars here.'}
                  </p>
                </div>
              </div>

              {/* PORTAL-SPECIFIC CONTENT */}
              {userType === 'counselor' && (
                <div className="mb-5 animate-slide-up stagger-3">
                  <h3 className="fw-bold text-dark mb-4 fs-4">
                    Counselor Dashboard
                  </h3>
                  <div className="grid-auto-fit">
                    <div className="surface-card p-4 d-flex flex-column h-100">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="rounded-3 p-3 bg-secondary bg-opacity-10 text-secondary"><FiTarget size={24} /></div>
                        <h4 className="mb-0 fw-bold fs-5">Today's Appointments</h4>
                      </div>
                      <p className="text-muted fs-6 mb-4 flex-grow-1">You have 3 scheduled student counseling sessions today.</p>
                      <button onClick={() => navigate('/care')} className="btn btn-light w-100 fw-semibold text-dark border-subtle">View Schedule</button>
                    </div>
                    <div className="surface-card p-4 d-flex flex-column h-100">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="rounded-3 p-3 bg-success bg-opacity-10 text-success"><FiFeather size={24} /></div>
                        <h4 className="mb-0 fw-bold fs-5">Manage Resources</h4>
                      </div>
                      <p className="text-muted fs-6 mb-4 flex-grow-1">Upload new stress management or mindfulness guides.</p>
                      <button onClick={() => navigate('/chat')} className="btn btn-light w-100 fw-semibold text-dark border-subtle">AI Suggest Resources</button>
                    </div>
                    <div className="surface-card p-4 d-flex flex-column h-100">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="rounded-3 p-3 bg-warning bg-opacity-10 text-warning"><FiTrendingUp size={24} /></div>
                        <h4 className="mb-0 fw-bold fs-5">Student Sentiment Logs</h4>
                      </div>
                      <p className="text-muted fs-6 mb-4 flex-grow-1">AI overview of recent distressed queries across the campus.</p>
                      <button className="btn btn-light w-100 fw-semibold text-dark border-subtle">Review Alert Logs</button>
                    </div>
                  </div>
                </div>
              )}

              {userType === 'staff' && (
                <div className="mb-5 animate-slide-up stagger-3">
                  <h3 className="fw-bold text-dark mb-4 fs-4">
                    Faculty / Staff Portal
                  </h3>
                  <div className="grid-auto-fit">
                    <div className="surface-card p-4 d-flex flex-column h-100">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="rounded-3 p-3 bg-primary bg-opacity-10 text-primary"><FiAward size={24} /></div>
                        <h4 className="mb-0 fw-bold fs-5">Academic Query Inbox</h4>
                      </div>
                      <p className="text-muted fs-6 mb-4 flex-grow-1">Review escalated questions from the AI assistant.</p>
                      <button onClick={() => navigate('/chat')} className="btn btn-light w-100 fw-semibold text-dark border-subtle">Generate AI Reply</button>
                    </div>
                    <div className="surface-card p-4 d-flex flex-column h-100">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="rounded-3 p-3 bg-danger bg-opacity-10 text-danger" style={{ color: '#8B5CF6', backgroundColor: '#F3E8FF' }}><FiSettings size={24} /></div>
                        <h4 className="mb-0 fw-bold fs-5">Update FAQs (AI Gen)</h4>
                      </div>
                      <p className="text-muted fs-6 mb-4 flex-grow-1">Approve AI-generated FAQs based on recent student trends.</p>
                      <button className="btn btn-light w-100 fw-semibold text-dark border-subtle">Review generated FAQs</button>
                    </div>
                    <div className="surface-card p-4 d-flex flex-column h-100">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="rounded-3 p-3 bg-warning bg-opacity-10 text-warning"><FiBook size={24} /></div>
                        <h4 className="mb-0 fw-bold fs-5">Manage Calendar</h4>
                      </div>
                      <p className="text-muted fs-6 mb-4 flex-grow-1">Upload event logs or semester dates for students.</p>
                      <button className="btn btn-light w-100 fw-semibold text-dark border-subtle">Update Dates</button>
                    </div>
                  </div>
                </div>
              )}

              {userType === 'student' && (
                <>
                  {/* Quick Access Buttons - Enhanced Sleek Design */}
              <div className="mb-5 animate-slide-up stagger-2">
                <h3 className="fw-bold text-dark mb-4 fs-5">
                  Quick Access
                </h3>
                <div className="row g-4">
                  {[
                    { label: 'Counseling', icon: FiUsers, route: '/chat', colorClass: 'text-secondary', bgClass: 'bg-secondary bg-opacity-10 border-secondary' },
                    { label: 'Stress Mgmt', icon: FiSmile, route: '/chat', colorClass: 'text-success', bgClass: 'bg-success bg-opacity-10 border-success' },
                    { label: 'Mindfulness', icon: FiWind, route: '/chat', colorClass: 'text-warning', bgClass: 'bg-warning bg-opacity-10 border-warning' },
                    { label: 'Help Line', icon: FiMessageCircle, route: '/chat', colorClass: 'text-primary', bgClass: 'bg-primary bg-opacity-10 border-primary' }
                  ].map((btn, idx) => {
                    const IconComponent = btn.icon;
                    return (
                      <div key={idx} className="col-6 col-md-3">
                        <button
                          onClick={() => navigate(btn.route)}
                          className="surface-card w-100 p-4 rounded-4 text-start h-100 hover-lift border border-subtle bg-transparent transition-normal group"
                        >
                          <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-3 p-3 ${btn.bgClass} ${btn.colorClass} transition-normal group-hover:scale-110`}>
                            <IconComponent size={24} />
                          </div>
                          <h4 className="fw-bold text-dark mb-1 fs-6 transition-normal group-hover:text-primary">{btn.label}</h4>
                          <p className="text-muted fs-8 mb-0 fw-medium">Access details <FiArrowRight className="ms-1" size={12} style={{ display: 'inline' }} /></p>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mental Health Support Section */}
              <div className="surface-card rounded-4 p-4 p-md-5 mb-5 d-flex flex-column flex-md-row align-items-center gap-4 shadow-sm animate-slide-up stagger-4 position-relative border border-subtle" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(99, 102, 241, 0.02) 100%)' }}>
                <div className="flex-grow-1 position-relative z-1">
                  <h3 className="fw-900 mb-3 fs-3 text-dark">
                    Professional Counseling & Stress Care
                  </h3>
                  <p className="fs-6 mb-4 text-muted fw-medium">
                    Access 24/7 confidential support and mental wellness resources tailored for your academic journey.
                  </p>
                  <button 
                    onClick={() => navigate('/care')}
                    className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm hover-scale d-inline-flex align-items-center gap-2"
                  >
                    Get Support <FiArrowRight />
                  </button>
                </div>
              </div>

              {/* Functional Modules */}
              <div className="animate-slide-up stagger-5">
                <h3 className="fw-bold text-dark mb-4 fs-4">
                  Functional Modules
                </h3>
                <div className="d-flex flex-column gap-3">
                  {[
                    { title: 'Admissions', desc: 'Track application & eligibility status', icon: FiTarget },
                    { title: 'Academic', desc: 'Registration, grades & calendar', icon: FiSettings },
                    { title: 'Financial', desc: 'Fees, payments & scholarships', icon: FiPhone },
                    { title: 'Campus', desc: 'Hostel booking & transport schedules', icon: FiBell }
                  ].map((module, idx) => {
                    const IconComponent = module.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => navigate('/chat')}
                        className="surface-card w-100 p-4 border-0 text-start d-flex justify-content-between align-items-center transition-normal hover-lift group"
                        style={{ transition: 'all 0.3s ease' }}
                      >
                        <div className="d-flex align-items-center gap-4">
                          <div className="text-primary rounded-circle bg-primary bg-opacity-10 p-3 flex-center" style={{ width: '50px', height: '50px' }}>
                            <IconComponent size={24} />
                          </div>
                          <div>
                            <h5 className="fw-bold text-dark mb-1 fs-5">{module.title}</h5>
                            <p className="text-muted mb-0 fw-medium fs-6">{module.desc}</p>
                          </div>
                        </div>
                        <div className="text-muted transition-normal group-hover:translate-x-1">
                          <FiArrowRight size={24} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
                </>
              )}
            </>
          )}

          {/* Bottom Scroll Spacer for Navbar clearance */}
          <div style={{ height: '120px', width: '100%' }}></div>
        </div>
      </main>


      </div>
    </PageTransition>
  );
}
