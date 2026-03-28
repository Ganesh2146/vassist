import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMoreVertical, FiCalendar, FiClock, FiPhone, FiMusic, FiBook, FiVideo } from 'react-icons/fi';
import { careAPI } from '../api/config';
import TopNav from './TopNav';
import PageTransition from './PageTransition';

export default function Care({ onLogout }) {
  const navigate = useNavigate();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedCounselor, setSelectedCounselor] = useState('');
  const [bookedToday, setBookedToday] = useState(false);
  const [bookingSuccessful, setBookingSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [resources, setResources] = useState([
    { type: 'GUIDED EXERCISE', title: '5-Minute Box Breathing', desc: 'Regulate your nervous system...', img: 'video' },
    { type: 'ARTICLE', title: 'Managing Work Anxiety', desc: 'Practical tips for a calmer workday.', img: 'book' },
    { type: 'SOUNDSCAPE', title: 'Rainfall for Deep Sleep', desc: 'Ambient sounds to quiet the mind.', img: 'music' }
  ]);
  const [loading, setLoading] = useState(false);

  const [counselors, setCounselors] = useState([]);

  useEffect(() => {
    fetchCareResources();
    fetchCounselors();
    checkExistingBooking();
  }, []);

  const fetchCounselors = async () => {
    try {
      const response = await careAPI.getCounselors();
      if (response.data.status === 'success') {
        setCounselors(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch counselors", error);
    }
  };

  const checkExistingBooking = () => {
    // Check if user already has a booking for today
    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const today = new Date().toDateString();
    const hasBookingToday = existingBookings.some(booking => 
      new Date(booking.date).toDateString() === today
    );
    setBookedToday(hasBookingToday);
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

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

  const handleScheduleAppointment = async (date, time, counselor) => {
    // Check if user already booked for today
    if (bookedToday) {
      setErrorMessage('❌ You have already booked a counseling slot for today. Only 1 slot per day is allowed.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    if (!time) {
      setErrorMessage('Please select a time slot first.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    if (!counselor) {
      setErrorMessage('Please select a counselor.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    try {
      const selectedCounselorName = counselors.find(c => c.id === parseInt(counselor))?.name;
      
      // Format date as YYYY-MM-DD
      const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
      
      console.log('📅 Scheduling Appointment:');
      console.log('  Date:', formattedDate);
      console.log('  Time:', time);
      console.log('  Counselor:', selectedCounselorName);
      console.log('  Timestamp:', new Date().toISOString());
      
      // API ENDPOINT: POST /api/care/schedule-appointment
      console.log('📡 Sending appointment request to backend...');
      const response = await careAPI.scheduleAppointment({
        date: formattedDate,
        time: time,
        counselorId: counselor,
        notes: ''
      });
      console.log('✅ Appointment scheduled successfully:', response.data);
      
      // Save booking to localStorage
      const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      const bookingData = { 
        date: new Date().toISOString(), 
        time, 
        counselor: selectedCounselorName,
        bookedFor: `${date} ${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`
      };
      existingBookings.push(bookingData);
      localStorage.setItem('userBookings', JSON.stringify(existingBookings));
      
      setBookedToday(true);
      setBookingSuccessful(true);
      setBookingDetails(bookingData);
      setErrorMessage('');
      setSelectedTime(null);
      setSelectedCounselor('');
      
      setTimeout(() => {
        setBookingSuccessful(false);
      }, 5000);
      
      console.log('✅ Appointment scheduled successfully');
    } catch (error) {
      console.error('❌ Schedule Appointment Error:', {
        message: error.message,
        endpoint: 'POST /api/care/schedule-appointment',
        timestamp: new Date().toISOString()
      });
      setErrorMessage('Failed to book appointment. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
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
          {/* Section Title with Appointments Link */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px'}}>
            <div>
              <h2 style={{fontSize: '28px', fontWeight: 800, color: '#111827', marginBottom: '15px', fontFamily: 'Poppins'}}>
                How are you feeling today?
              </h2>
              <p style={{color: '#4B5563', marginBottom: 0, fontSize: '15px', fontWeight: '500'}}>
                We're here to support your mental well-being.
              </p>
            </div>
            <button 
              onClick={() => navigate('/my-appointments')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#EFF6FF',
                color: '#1E40AF',
                border: '1px solid #BFDBFE',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#DBEAFE';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#EFF6FF';
              }}
            >
              View My Appointments
            </button>
          </div>

          {/* Schedule Counseling */}
          <div style={{backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px'}}>
              <span style={{fontSize: '24px', color: '#1E40AF'}}>
                <FiCalendar size={24} />
              </span>
              <h4 style={{fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Poppins'}}>Schedule Counseling</h4>
            </div>

            {/* Select Counselor */}
            <div style={{marginBottom: '20px'}}>
              <label style={{fontSize: '14px', color: '#4B5563', fontWeight: '600', marginBottom: '8px', display: 'block', fontFamily: 'Poppins'}}>Select Counselor</label>
              <select 
                value={selectedCounselor}
                onChange={(e) => setSelectedCounselor(e.target.value)}
                disabled={bookedToday || counselors.length === 0}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #E0E7FF',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'Poppins',
                  backgroundColor: '#FFFFFF',
                  cursor: (bookedToday || counselors.length === 0) ? 'not-allowed' : 'pointer',
                  opacity: (bookedToday || counselors.length === 0) ? 0.5 : 1,
                  color: '#111827'
                }}
              >
                <option value="">
                  {counselors.length > 0 ? '-- Select a Counselor --' : 'No counselors available'}
                </option>
                {counselors.map((counselor) => (
                  <option key={counselor.id} value={counselor.id}>
                    {counselor.first_name} {counselor.last_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Calendar */}
            <div style={{marginBottom: '20px', backgroundColor: '#F9FAFB', padding: '15px', borderRadius: '8px', border: '1px solid #E5E7EB'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                <button 
                  onClick={() => setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1) || (currentMonth === 0 && setCurrentYear(currentYear - 1))}
                  style={{background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#1E40AF', fontWeight: 'bold', padding: '8px'}}>
                  ‹
                </button>
                <p style={{fontWeight: 700, color: '#111827', fontSize: '15px', margin: 0, fontFamily: 'Poppins', minWidth: '180px', textAlign: 'center'}}>
                  {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </p>
                <button 
                  onClick={() => setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1) || (currentMonth === 11 && setCurrentYear(currentYear + 1))}
                  style={{background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#1E40AF', fontWeight: 'bold', padding: '8px'}}>
                  ›
                </button>
              </div>

              {/* Calendar Grid - IMPROVED STYLE */}
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '15px'}}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                  <div key={idx} style={{fontWeight: 700, color: '#1E40AF', fontSize: '12px', padding: '8px 0', backgroundColor: '#EFF6FF', borderRadius: '6px'}}>
                    {day}
                  </div>
                ))}
                
                {/* Empty cells for days before month starts */}
                {[...Array(getFirstDayOfMonth(currentMonth, currentYear))].map((_, idx) => (
                  <div key={`empty-${idx}`}></div>
                ))}
                
                {/* Calendar days */}
                {[...Array(getDaysInMonth(currentMonth, currentYear))].map((_, idx) => {
                  const day = idx + 1;
                  const isSelected = selectedDate === day;
                  const isPastDate = new Date(currentYear, currentMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                  
                  return (
                    <button
                      key={day}
                      onClick={() => !isPastDate && setSelectedDate(day)}
                      disabled={isPastDate || bookedToday}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? '#1E40AF' : isPastDate ? '#F3F4F6' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : isPastDate ? '#9CA3AF' : '#111827',
                        fontWeight: '600',
                        cursor: isPastDate || bookedToday ? 'not-allowed' : 'pointer',
                        border: isSelected ? '2px solid #1E40AF' : '1px solid #E5E7EB',
                        fontFamily: 'Poppins',
                        fontSize: '13px',
                        transition: 'all 0.2s ease',
                        opacity: isPastDate ? 0.5 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!isPastDate && !bookedToday && !isSelected) {
                          e.currentTarget.style.backgroundColor = '#EFF6FF';
                          e.currentTarget.style.borderColor = '#1E40AF';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isPastDate && !bookedToday && !isSelected) {
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                          e.currentTarget.style.borderColor = '#E5E7EB';
                        }
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Available Slots */}
            <div style={{marginBottom: '20px'}}>
              <p style={{fontSize: '13px', color: '#4B5563', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <FiClock size={16} />
                Available Time Slots
              </p>
              {bookedToday && (
                <div style={{backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px', marginBottom: '15px', color: '#DC2626', fontSize: '13px', fontWeight: '600'}}>
                  ✓ You already have a booking today. You can only book 1 slot per day.
                </div>
              )}
              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                {['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM', '04:30 PM'].map((time, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTime(time)}
                    disabled={bookedToday}
                    style={{
                      padding: '10px 16px',
                      border: selectedTime === time ? '2px solid #1E40AF' : '1px solid #E0E7FF',
                      backgroundColor: selectedTime === time ? '#EFF6FF' : '#FFFFFF',
                      borderRadius: '8px',
                      cursor: bookedToday ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 600,
                      fontFamily: 'Poppins',
                      opacity: bookedToday ? 0.5 : 1,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!bookedToday && selectedTime !== time) {
                        e.currentTarget.style.borderColor = '#1E40AF';
                        e.currentTarget.style.backgroundColor = '#F0F9FF';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!bookedToday && selectedTime !== time) {
                        e.currentTarget.style.borderColor = '#E0E7FF';
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Messages */}
            {bookingSuccessful && (
              <div style={{backgroundColor: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '16px', marginBottom: '15px'}}>
                <p style={{color: '#15803D', fontSize: '13px', fontWeight: '600', margin: '0 0 12px'}}>
                  ✓ Appointment booked successfully! {bookingDetails?.counselor} will contact you on {bookingDetails?.bookedFor} at {bookingDetails?.time}.
                </p>
                <button 
                  onClick={() => navigate('/my-appointments')}
                  style={{
                    backgroundColor: '#16A34A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#15803D';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#16A34A';
                  }}
                >
                  View My Appointments
                </button>
              </div>
            )}
            {errorMessage && (
              <div style={{backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px', marginBottom: '15px', color: '#DC2626', fontSize: '13px', fontWeight: '600'}}>
                {errorMessage}
              </div>
            )}

            <button 
              onClick={() => handleScheduleAppointment(selectedDate, selectedTime, selectedCounselor)}
              disabled={bookedToday}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: bookedToday ? '#CCCCCC' : '#1E40AF',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '16px',
                fontFamily: 'Poppins',
                cursor: bookedToday ? 'not-allowed' : 'pointer',
                marginTop: '15px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!bookedToday) {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (!bookedToday) {
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {bookedToday ? 'Already Booked Today' : 'Confirm Appointment'}
            </button>
          </div>
        </div>
      </main>
    </div>
    </PageTransition>
  );
}
