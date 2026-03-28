import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMoreVertical, FiCalendar, FiClock, FiPhone, FiMusic, FiBook, FiVideo } from 'react-icons/fi';
import { careAPI } from '../api/config';
import TopNav from './TopNav';
import PageTransition from './PageTransition';

export default function Care({ onLogout }) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(14);
  const [resources, setResources] = useState([
    { type: 'GUIDED EXERCISE', title: '5-Minute Box Breathing', desc: 'Regulate your nervous system...', img: 'video' },
    { type: 'ARTICLE', title: 'Managing Work Anxiety', desc: 'Practical tips for a calmer workday.', img: 'book' },
    { type: 'SOUNDSCAPE', title: 'Rainfall for Deep Sleep', desc: 'Ambient sounds to quiet the mind.', img: 'music' }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCareResources();
  }, []);

  const fetchCareResources = async () => {
    try {
      console.log('🏥 Fetching Care Resources');
      console.log('  Endpoints:');
      console.log('    - GET /api/care/resources');
      console.log('    - GET /api/care/crisis-hotline');
      console.log('  Timestamp:', new Date().toISOString());

      setLoading(true);
      // API ENDPOINT: GET /api/care/resources
      console.log('📡 Fetching resources from GET /api/care/resources...');
      const response = await careAPI.getResources('all');
      console.log('✅ Resources received:', response.data.resources);
      setResources(response.data.resources);
      
      // API ENDPOINT: GET /api/care/crisis-hotline
      console.log('📡 Fetching crisis hotline info...');
      const hotlineResponse = await careAPI.getCrisisHotline();
      console.log('✅ Crisis hotline info received:', hotlineResponse.data);
      
      console.log('✅ Care Resources Fetch Complete');
      setLoading(false);
    } catch (error) {
      console.error('❌ Care Resources Fetch Error:', {
        message: error.message,
        endpoints: ['GET /api/care/resources', 'GET /api/care/crisis-hotline'],
        timestamp: new Date().toISOString()
      });
      setLoading(false);
    }
  };

  const handleScheduleAppointment = async (date, time) => {
    try {
      console.log('📅 Scheduling Appointment:');
      console.log('  Date:', date);
      console.log('  Time:', time);
      console.log('  Endpoint: POST /api/care/schedule-appointment');
      console.log('  Timestamp:', new Date().toISOString());
      
      // API ENDPOINT: POST /api/care/schedule-appointment
      console.log('📡 Sending appointment request to backend...');
      const response = await careAPI.scheduleAppointment(date, time);
      console.log('✅ Appointment scheduled successfully:', response.data);
      alert(`Success! ${response.data.message}`);
      
      console.log('✅ Appointment scheduled for', date, 'at', time);
    } catch (error) {
      console.error('❌ Schedule Appointment Error:', {
        message: error.message,
        endpoint: 'POST /api/care/schedule-appointment',
        date: date,
        time: time,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <PageTransition>
      <div style={{minHeight: '100vh', backgroundColor: 'var(--bg-main)', paddingTop: '80px'}}>
        <TopNav />
        {/* Old Header Removed - TopNav is used instead */}

      {/* Main Content */}
      <main style={{padding: '30px', paddingBottom: '120px'}}>
        <div className="container-fluid">
          {/* Section Title */}
          <h2 style={{fontSize: '28px', fontWeight: 800, color: '#111827', marginBottom: '15px', fontFamily: 'Poppins'}}>
            How are you feeling today?
          </h2>
          <p style={{color: '#4B5563', marginBottom: '30px', fontSize: '15px', fontWeight: '500'}}>
            We're here to support your mental well-being.
          </p>

          {/* Schedule Counseling */}
          <div style={{backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px'}}>
              <span style={{fontSize: '24px', color: '#1E40AF'}}>
                <FiCalendar size={24} />
              </span>
              <h4 style={{fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Poppins'}}>Schedule Counseling</h4>
            </div>

            {/* Calendar */}
            <div style={{marginBottom: '20px'}}>
                <button 
                  onClick={() => console.log('Previous month')}
                  style={{background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#4B5563', fontWeight: 'bold'}}>
                  ‹
                </button>
                <p style={{fontWeight: 700, color: '#4B5563', fontSize: '14px', textTransform: 'uppercase', margin: 0}}>November 2025</p>
                <button 
                  onClick={() => console.log('Next month')}
                  style={{background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#4B5563', fontWeight: 'bold'}}>
                  ›
                </button>

              {/* Calendar Grid */}
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '20px'}}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                  <div key={idx} style={{fontWeight: 600, color: '#9CA3AF', fontSize: '12px', padding: '8px 0'}}>
                    {day}
                  </div>
                ))}
                {[...Array(11)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(12 + idx)}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: selectedDate === 12 + idx ? '#1E40AF' : 'transparent',
                      color: selectedDate === 12 + idx ? '#FFFFFF' : '#111827',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: 'none',
                      fontFamily: 'Poppins',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedDate !== 12 + idx) {
                        e.currentTarget.style.backgroundColor = '#F3F4F6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedDate !== 12 + idx) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {12 + idx}
                  </button>
                ))}
              </div>

              {/* Available Slots */}
              <div>
                <p style={{fontSize: '13px', color: '#4B5563', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <FiClock size={16} />
                  Available Slots (Nov {selectedDate})
                </p>
                <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                  {['09:00 AM', '10:30 AM', '02:00 PM'].map((time, idx) => (
                    <button
                      key={idx}
                      style={{
                        padding: '10px 16px',
                      border: '1px solid #E0E7FF',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 600,
                      fontFamily: 'Poppins'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#1E40AF';
                      e.currentTarget.style.backgroundColor = '#F0F9FF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E0E7FF';
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleScheduleAppointment(selectedDate, '09:00 AM')}
                style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#1E40AF',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '16px',
                fontFamily: 'Poppins',
                cursor: 'pointer',
                marginTop: '15px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Confirm Appointment
              </button>
            </div>
          </div>

          {/* Stress Management */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h4 style={{fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Poppins', fontSize: '18px'}}>Stress Management</h4>
            <a href="#" onClick={(e) => {e.preventDefault(); console.log('View library');}} style={{color: '#1E40AF', textDecoration: 'none', fontWeight: 600, fontSize: '14px', cursor: 'pointer'}}>View Library</a>
          </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              {resources.map((resource, idx) => {
                const iconMap = {
                  'video': <FiVideo size={40} />,
                  'book': <FiBook size={40} />,
                  'music': <FiMusic size={40} />
                };
                return (
                  <button
                    key={idx}
                    onClick={() => console.log('Open resource:', resource.title)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      padding: '15px',
                      display: 'flex',
                      gap: '15px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: 'none',
                      width: '100%',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{
                      width: '100px',
                      height: '100px',
                      backgroundColor: '#F0F9FF',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '40px',
                      flexShrink: 0,
                      color: '#1E40AF'
                    }}>
                      {iconMap[resource.img]}
                    </div>
                    <div style={{flex: 1, textAlign: 'left'}}>
                      <p style={{color: '#1E40AF', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 5px'}}>
                        {resource.type}
                      </p>
                      <h5 style={{fontWeight: 700, color: '#111827', margin: '0 0 5px', fontFamily: 'Poppins'}}>
                        {resource.title}
                      </h5>
                      <p style={{color: '#4B5563', fontSize: '14px', margin: 0, fontWeight: '500'}}>{resource.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

          {/* Crisis Hotline */}
          <div style={{
            backgroundColor: '#F0F9FF',
            borderRadius: '12px',
            padding: '25px',
            marginTop: '30px',
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            border: '2px solid #1E40AF'
          }}>
            <div style={{fontSize: '50px', color: '#1E40AF'}}>
              <FiPhone size={50} />
            </div>
            <div>
              <h5 style={{fontWeight: 700, color: '#111827', margin: '0 0 8px', fontFamily: 'Poppins'}}>
                Need immediate help?
              </h5>
              <p style={{color: '#4B5563', margin: '0 0 10px', fontSize: '14px', fontWeight: '500'}}>
                Our crisis hotline is available 24/7.
              </p>
              <button 
                onClick={() => console.log('Calling 988')}
                style={{color: '#1E40AF', fontWeight: 700, fontSize: '18px', margin: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Poppins'}}
              >
                Call Now: 988
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
    </PageTransition>
  );
}
