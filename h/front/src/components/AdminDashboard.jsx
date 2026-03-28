import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiBarChart2, FiMessageSquare, FiHeart, FiLogOut, FiArrowUp, FiArrowDown, FiActivity, FiStar } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import TopNav from './TopNav';
import PageTransition from './PageTransition';
import Skeleton from './Skeleton';
import { adminAPI } from '../api/config';

export default function AdminDashboard({ userName, onLogout }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const kbInputRef = React.useRef(null);
  const [kbFile, setKbFile] = useState(null);
  const [kbStatus, setKbStatus] = useState(null);
  const [kbUploading, setKbUploading] = useState(false);

  const ttInputRef = React.useRef(null);
  const [ttFile, setTtFile] = useState(null);
  const [ttStatus, setTtStatus] = useState(null);
  const [ttUploading, setTtUploading] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  useEffect(() => {
    fetchKnowledgeBaseStatus();
    fetchTimetableStatus();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      console.log('Fetching Admin Analytics');
      setLoading(true);

      // Fetch analytics data from backend APIs
      const [
        overviewResponse,
        userBreakdownResponse,
        userAnalyticsResponse,
        chatAnalyticsResponse,
        careAnalyticsResponse,
        systemHealthResponse
      ] = await Promise.all([
        adminAPI.getAnalyticsOverview(),
        adminAPI.getUserBreakdown(),
        adminAPI.getUserAnalytics(selectedPeriod),
        adminAPI.getChatAnalytics(selectedPeriod),
        adminAPI.getCareAnalytics(selectedPeriod),
        adminAPI.getSystemHealth()
      ]);

      // Construct analytics data from API responses
      const analyticsData = {
        overview: overviewResponse?.data?.data || {
          totalUsers: 0,
          activeUsers: 0,
          totalSessions: 0,
          totalChats: 0,
          appointmentsBokked: 0,
          userGrowth: 0,
          sessionGrowth: 0,
          chatGrowth: 0
        },
        userBreakdown: userBreakdownResponse?.data?.data || {
          students: 0,
          counselors: 0,
          staff: 0,
          admins: 0,
          others: 0
        },
        userTrend: userAnalyticsResponse?.data?.data?.trend || [],
        chatMetrics: chatAnalyticsResponse?.data?.data || {
          totalMessages: 0,
          averageResponseTime: 0,
          aiResponses: 0,
          humanSupport: 0,
          satisfactionRate: 0
        },
        careMetrics: careAnalyticsResponse?.data?.data || {
          totalAppointments: 0,
          bookedAppointments: 0,
          completedAppointments: 0,
          cancelledAppointments: 0,
          avgCounselorRating: 0
        },
        topQuestions: chatAnalyticsResponse?.data?.data?.topQuestions || [],
        systemHealth: systemHealthResponse?.data?.data || {
          uptime: 0,
          apiLatency: 0,
          dbHealth: 'unknown',
          errorRate: 0
        }
      };

      setAnalyticsData(analyticsData);
      console.log('Admin Analytics loaded from API:', analyticsData);
      setLoading(false);
    } catch (error) {
      console.error('Analytics Fetch Error:', error);
      toast.error('Failed to load analytics data');
      setLoading(false);
    }
  };

  const fetchKnowledgeBaseStatus = async () => {
    try {
      const response = await adminAPI.getKnowledgeBaseStatus();
      setKbStatus(response?.data?.data || null);
    } catch (error) {
      console.error('Knowledge base status error:', error);
    }
  };

  const fetchTimetableStatus = async () => {
    try {
      const response = await adminAPI.getTimetableStatus();
      setTtStatus(response?.data?.data || null);
    } catch (error) {
      console.error('Timetable status error:', error);
    }
  };

  const handleKnowledgeBaseUpload = async () => {
    if (!kbFile) {
      toast.error('Please select an Excel file with Question and Answer columns.');
      return;
    }

    setKbUploading(true);
    const loadingToast = toast.loading('Uploading Knowledge Base...');
    try {
      const response = await adminAPI.uploadKnowledgeBase(kbFile);
      const count = response?.data?.data?.questions_loaded;
      toast.success(`Knowledge base updated. Loaded ${count ?? 0} questions.`, { id: loadingToast });
      await fetchKnowledgeBaseStatus();
      setKbFile(null);
      if (kbInputRef.current) kbInputRef.current.value = '';
    } catch (error) {
      const fallback = error?.response?.data?.message || 'Failed to upload knowledge base.';
      toast.error(fallback, { id: loadingToast });
      console.error('Knowledge base upload error:', error);
    } finally {
      setKbUploading(false);
    }
  };

  const handleTimetableUpload = async () => {
    if (!ttFile) {
      toast.error('Please select a timetable file (.xlsx, .csv, .txt).');
      return;
    }

    setTtUploading(true);
    const loadingToast = toast.loading('Uploading Timetable...');
    try {
      const response = await adminAPI.uploadTimetable(ttFile);
      const rows = response?.data?.data?.rows_processed;
      toast.success(`Timetable updated successfully. Processed ${rows ?? 0} entries.`, { id: loadingToast });
      await fetchTimetableStatus();
      setTtFile(null);
      if (ttInputRef.current) ttInputRef.current.value = '';
    } catch (error) {
      const fallback = error?.response?.data?.message || 'Failed to upload timetable.';
      toast.error(fallback, { id: loadingToast });
      console.error('Timetable upload error:', error);
    } finally {
      setTtUploading(false);
    }
  };

  const MetricCard = ({ title, value, change, icon: Icon, colorClass = 'text-primary', bgClass = 'bg-primary bg-opacity-10' }) => (
    <div className="surface-card p-4 transition-normal hover-lift h-100 flex-column d-flex">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <p className="mb-2 text-muted fs-7 fw-semibold text-uppercase letter-spacing-1">
            {title}
          </p>
          <h3 className="mb-0 fs-2 fw-bold text-dark">
            {value.toLocaleString()}
          </h3>
        </div>
        <div className={`rounded-3 flex-center shadow-sm ${bgClass} ${colorClass}`} style={{ width: '48px', height: '48px' }}>
          <Icon size={24} />
        </div>
      </div>
      {change !== undefined && (
        <div className="d-flex align-items-center gap-2 mt-auto">
          <div className={`d-flex align-items-center gap-1 fs-7 fw-bold ${change >= 0 ? 'text-success' : 'text-danger'}`}>
            {change >= 0 ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
            {Math.abs(change)}%
          </div>
          <p className="mb-0 text-muted fs-8">vs last month</p>
        </div>
      )}
    </div>
  );

  const ChartBar = ({ label, value, maxValue, colorClass = 'bg-primary' }) => {
    const percentage = (value / maxValue) * 100;
    return (
      <div className="mb-3">
        <div className="flex-between mb-2">
          <p className="mb-0 fw-semibold text-dark fs-6">{label}</p>
          <p className="mb-0 fw-bold fs-6">{value.toLocaleString()}</p>
        </div>
        <div className="progress" style={{ height: '8px', backgroundColor: 'var(--border-subtle)' }}>
          <div className={`progress-bar ${colorClass}`} role="progressbar" style={{ width: `${percentage}%` }} aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
    );
  };

  const SimpleLineChart = ({ data, title }) => {
    // Handle empty or insufficient data
    if (!data || data.length === 0) {
      return (
        <div className="surface-card p-4 mb-4">
          <h3 className="fs-5 fw-bold text-dark mb-4">{title}</h3>
          <div className="text-center text-muted py-5">No data available</div>
        </div>
      );
    }

    const maxValue = Math.max(...data.map(d => d.users || 0), 1);
    const points = data.length === 1 
      ? [{...data[0], x: 50, y: 100 - (data[0].users / maxValue) * 80}]
      : data.map((d, i) => ({
        ...d,
        x: (i / (data.length - 1)) * 100,
        y: 100 - (d.users / maxValue) * 80
      }));

    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
      <div className="surface-card p-4 mb-4">
        <h3 className="gradient-text fs-5 fw-bold mb-4">
          {title}
        </h3>
        <svg width="100%" height="250" style={{overflow: 'visible', minHeight: '250px'}} viewBox="0 0 100 250">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: 'var(--primary-color)', stopOpacity: 0.3}} />
              <stop offset="100%" style={{stopColor: 'var(--primary-color)', stopOpacity: 0}} />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0, 20, 40, 60, 80, 100].map((y, i) => (
            <line key={i} x1="0" y1={y} x2="100" y2={y} stroke="var(--border-subtle)" strokeWidth="0.5" />
          ))}
          {/* Area under curve */}
          {pathData && pathData.startsWith('M') && (
            <path d={pathData + ' L 100 100 L 0 100 Z'} fill="url(#gradient)" />
          )}
          {/* Line */}
          {pathData && pathData.startsWith('M') && (
            <path d={pathData} stroke="var(--primary-color)" strokeWidth="1.5" fill="none" />
          )}
          {/* Points */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2" fill="var(--primary-color)" />
          ))}
          {/* X-axis labels */}
          {points.map((p, i) => (
            <text key={`label-${i}`} x={p.x} y="120" textAnchor="middle" fontSize="8" fill="var(--text-muted)">
              {data[i]?.date || ''}
            </text>
          ))}
        </svg>
      </div>
    );
  };

  if (loading || !analyticsData) {
    return (
      <PageTransition>
        <div className="d-flex flex-column" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
          <TopNav />
          <main className="flex-grow-1 pt-5 px-3 px-md-5">
            <div className="container-fluid mx-auto" style={{ maxWidth: '1400px' }}>
              <Skeleton width="200px" height="30px" className="mb-4" />
              <div className="row g-4 mb-4">
                <div className="col-12 col-xl-6"><Skeleton height="250px" className="rounded-4" /></div>
                <div className="col-12 col-xl-6"><Skeleton height="250px" className="rounded-4" /></div>
              </div>
              <Skeleton width="150px" height="30px" className="mb-4 mt-5" />
              <div className="grid-auto-fit mb-5">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} height="120px" className="rounded-4" />)}
              </div>
              <Skeleton height="350px" className="rounded-4 w-100" />
            </div>
            <div style={{ height: '100px' }}></div>
          </main>
        </div>
      </PageTransition>
    );
  }

  const { overview, userBreakdown, userTrend, chatMetrics, careMetrics, topQuestions, systemHealth } = analyticsData;

  return (
    <PageTransition>
      <div className="d-flex flex-column" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', paddingTop: '80px' }}>
        <TopNav />
        <div className="container-fluid mx-auto px-4 mt-3 mb-2" style={{ maxWidth: '1400px' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="gradient-text mb-1 fw-bold fs-4">Admin Console</h2>
              <p className="mb-0 text-muted fs-7">Manage system settings and view global analytics</p>
            </div>
            <select
              className="form-select bg-surface input-modern shadow-sm border-subtle"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{ minWidth: '150px', width: 'auto' }}
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
        </div>

      {/* Main Content */}
      <main className="flex-grow-1 p-4 position-relative overflow-hidden">
        <div className="container-fluid mx-auto position-relative z-1" style={{ maxWidth: '1400px' }}>
          
          <div className="row g-4 mb-4">
            <div className="col-12 col-xl-6">
              <div className="surface-card p-4 h-100">
                <h3 className="gradient-text fs-5 fw-bold mb-2">Knowledge Base Upload</h3>
                <p className="text-muted fs-7 mb-4">Upload an Excel file with columns: <strong>Question</strong> and <strong>Answer</strong>.</p>
                
                <div className="d-flex flex-column flex-sm-row gap-3 align-items-sm-center">
                  <input
                    type="file"
                    ref={kbInputRef}
                    accept=".xlsx,.xls"
                    onChange={(e) => setKbFile(e.target.files?.[0] || null)}
                    className="form-control input-modern flex-grow-1"
                  />
                  <button
                    onClick={handleKnowledgeBaseUpload}
                    disabled={kbUploading}
                    className="btn btn-modern btn-primary flex-shrink-0"
                  >
                    {kbUploading ? 'Uploading...' : 'Upload Excel'}
                  </button>
                </div>
                
                {kbStatus && (
                  <p className="text-muted fs-7 mt-3 mb-0 fw-medium">
                    Loaded: {kbStatus.questions_loaded ?? 0} questions
                  </p>
                )}
              </div>
            </div>
            
            <div className="col-12 col-xl-6">
              <div className="surface-card p-4 h-100">
                <h3 className="gradient-text fs-5 fw-bold mb-2">Timetable Upload</h3>
                <p className="text-muted fs-7 mb-4">Upload a timetable file <strong>(.xlsx, .csv, .txt)</strong> for the AI Chatbot to answer user questions about schedules.</p>
                
                <div className="d-flex flex-column flex-sm-row gap-3 align-items-sm-center">
                  <input
                    type="file"
                    ref={ttInputRef}
                    accept=".xlsx,.xls,.csv,.txt"
                    onChange={(e) => setTtFile(e.target.files?.[0] || null)}
                    className="form-control input-modern flex-grow-1"
                  />
                  <button
                    onClick={handleTimetableUpload}
                    disabled={ttUploading}
                    className="btn btn-modern btn-primary flex-shrink-0"
                  >
                    {ttUploading ? 'Uploading...' : 'Upload Timetable'}
                  </button>
                </div>
                
                {ttStatus && (
                   <p className="text-muted fs-7 mt-3 mb-0 fw-medium d-flex align-items-center gap-2">
                    <span className={`d-inline-block rounded-circle ${ttStatus.available ? 'bg-success' : 'bg-danger'}`} style={{ width: '8px', height: '8px' }}></span>
                    {ttStatus.available ? 'Timetable Active' : 'No Timetable'}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-5">
            <h2 className="gradient-text fs-4 fw-bold mb-4">Overview</h2>
            <div className="grid-auto-fit">
              <MetricCard title="Total Users" value={overview.totalUsers} change={overview.userGrowth} icon={FiUsers} colorClass="text-primary" bgClass="bg-primary bg-opacity-10" />
              <MetricCard title="Active Users" value={overview.activeUsers} change={7.2} icon={FiActivity} colorClass="text-success" bgClass="bg-success bg-opacity-10" />
              <MetricCard title="Total Sessions" value={overview.totalSessions} change={overview.sessionGrowth} icon={FiBarChart2} colorClass="text-warning" bgClass="bg-warning bg-opacity-10" />
              <MetricCard title="Chat Messages" value={overview.totalChats} change={overview.chatGrowth} icon={FiMessageSquare} colorClass="text-purple" bgClass="bg-purple bg-opacity-10" />
              <MetricCard title="Appointments" value={overview.appointmentsBokked} change={5.8} icon={FiHeart} colorClass="text-danger" bgClass="bg-danger bg-opacity-10" />
            </div>
          </div>

          <div className="mb-5">
            <h2 className="gradient-text fs-4 fw-bold mb-4">Analytics</h2>
            <SimpleLineChart data={userTrend} title="User Growth Trend" />
          </div>

          <div className="row g-4 mb-5">
            {/* User Breakdown */}
            <div className="col-12 col-lg-6 col-xl-4">
              <div className="surface-card p-4 h-100">
                <h3 className="gradient-text fs-5 fw-bold text-dark mb-4">User Breakdown</h3>
                <ChartBar label="Students" value={userBreakdown.students} maxValue={Math.max(...Object.values(userBreakdown))} colorClass="bg-primary" />
                <ChartBar label="Counselors" value={userBreakdown.counselors} maxValue={Math.max(...Object.values(userBreakdown))} colorClass="bg-success" />
                <ChartBar label="Staff" value={userBreakdown.staff} maxValue={Math.max(...Object.values(userBreakdown))} colorClass="bg-warning" />
                <ChartBar label="Admins" value={userBreakdown.admins} maxValue={Math.max(...Object.values(userBreakdown))} colorClass="bg-purple" />
                <ChartBar label="Others" value={userBreakdown.others} maxValue={Math.max(...Object.values(userBreakdown))} colorClass="bg-danger" />
              </div>
            </div>

            {/* Chat Metrics */}
            <div className="col-12 col-lg-6 col-xl-4">
              <div className="surface-card p-4 h-100">
                <h3 className="gradient-text fs-5 fw-bold text-dark mb-4">Chat Metrics</h3>
                <div className="d-flex flex-column gap-3">
                  <div className="flex-between border-bottom border-subtle pb-2">
                    <p className="mb-0 text-muted fs-6 fw-medium">Total Messages</p>
                    <p className="mb-0 text-primary fw-bold fs-5">{chatMetrics.totalMessages.toLocaleString()}</p>
                  </div>
                  <div className="flex-between border-bottom border-subtle pb-2">
                    <p className="mb-0 text-muted fs-6 fw-medium">AI Responses</p>
                    <p className="mb-0 text-success fw-bold fs-5">{chatMetrics.aiResponses.toLocaleString()}</p>
                  </div>
                  <div className="flex-between border-bottom border-subtle pb-2">
                    <p className="mb-0 text-muted fs-6 fw-medium">Human Support</p>
                    <p className="mb-0 text-warning fw-bold fs-5">{chatMetrics.humanSupport.toLocaleString()}</p>
                  </div>
                  <div className="flex-between border-bottom border-subtle pb-2">
                    <p className="mb-0 text-muted fs-6 fw-medium">Avg Response Time</p>
                    <p className="mb-0 text-purple fw-bold fs-5">{chatMetrics.averageResponseTime}s</p>
                  </div>
                  <div className="flex-between pb-2">
                    <p className="mb-0 text-muted fs-6 fw-medium">Satisfaction Rate</p>
                    <p className="mb-0 text-danger fw-bold fs-5">{chatMetrics.satisfactionRate}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Care Metrics */}
             <div className="col-12 col-lg-12 col-xl-4">
              <div className="surface-card p-4 h-100">
                <h3 className="gradient-text fs-5 fw-bold text-dark mb-4">Care & Counseling</h3>
                <div className="d-flex flex-column gap-3">
                  <div className="flex-between border-bottom border-subtle pb-2">
                    <p className="mb-0 text-muted fs-6 fw-medium">Total Appointments</p>
                    <p className="mb-0 text-primary fw-bold fs-5">{careMetrics.totalAppointments}</p>
                  </div>
                  <div className="flex-between border-bottom border-subtle pb-2">
                    <p className="mb-0 text-muted fs-6 fw-medium">Booked</p>
                    <p className="mb-0 text-success fw-bold fs-5">{careMetrics.bookedAppointments}</p>
                  </div>
                  <div className="flex-between border-bottom border-subtle pb-2">
                    <p className="mb-0 text-muted fs-6 fw-medium">Completed</p>
                    <p className="mb-0 text-warning fw-bold fs-5">{careMetrics.completedAppointments}</p>
                  </div>
                  <div className="flex-between border-bottom border-subtle pb-2">
                    <p className="mb-0 text-muted fs-6 fw-medium">Cancelled</p>
                    <p className="mb-0 text-danger fw-bold fs-5">{careMetrics.cancelledAppointments}</p>
                  </div>
                  <div className="flex-between pb-2">
                    <p className="mb-0 text-muted fs-6 fw-medium">Avg Rating</p>
                    <p className="mb-0 text-warning fw-bold fs-5 d-flex align-items-center gap-1">
                      <FiStar className="text-warning fill-current text-white" /> {careMetrics.avgCounselorRating}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Questions & System Health */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-xl-8">
              <div className="surface-card p-4 h-100">
                <h3 className="gradient-text fs-5 fw-bold text-dark mb-4">Top User Questions</h3>
                <div className="d-flex flex-column gap-3">
                  {topQuestions.map((q, idx) => (
                    <div key={idx} className="bg-secondary bg-opacity-10 p-3 rounded-3 border-start border-4 border-primary flex-between hover-lift transition-normal">
                      <p className="mb-0 text-dark fw-semibold fs-6">
                        {idx + 1}. {q.question}
                      </p>
                      <div className="bg-white text-primary px-3 py-1 rounded-pill fw-bold fs-7 shadow-sm">
                        {q.count} asks
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-4">
              <div className="surface-card p-4 h-100">
                <h3 className="gradient-text fs-5 fw-bold text-dark mb-4">System Health</h3>
                <div className="d-flex flex-column gap-3">
                  <div className="bg-success bg-opacity-10 p-3 rounded-3 border-start border-4 border-success">
                    <p className="text-muted fs-8 fw-bold text-uppercase letter-spacing-1 mb-1">Uptime</p>
                    <p className="mb-0 text-success fs-3 fw-bold">{systemHealth.uptime}%</p>
                  </div>
                  <div className="bg-warning bg-opacity-10 p-3 rounded-3 border-start border-4 border-warning">
                     <p className="text-muted fs-8 fw-bold text-uppercase letter-spacing-1 mb-1">API Latency</p>
                    <p className="mb-0 text-warning fs-3 fw-bold">{systemHealth.apiLatency}ms</p>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-3 rounded-3 border-start border-4 border-primary">
                    <p className="text-muted fs-8 fw-bold text-uppercase letter-spacing-1 mb-1">Error Rate</p>
                    <p className="mb-0 text-primary fs-3 fw-bold">{systemHealth.errorRate}%</p>
                  </div>
                  <div className="bg-purple bg-opacity-10 p-3 rounded-3 border-start border-4 border-purple">
                     <p className="text-muted fs-8 fw-bold text-uppercase letter-spacing-1 mb-1">DB Health</p>
                    <p className="mb-0 text-purple fs-5 fw-bold text-capitalize">{systemHealth.dbHealth}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      </div>
    </PageTransition>
  );
}
