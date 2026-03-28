import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiUser, FiCheckCircle, FiAlertCircle, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { careAPI } from '../api/config';
import TopNav from './TopNav';
import PageTransition from './PageTransition';

export default function StudentAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log('📅 Fetching student appointments...');
      const response = await careAPI.getAppointments();
      console.log('✅ Appointments fetched:', response.data);
      setAppointments(response.data.data || []);
      setError('');
    } catch (err) {
      console.error('❌ Error fetching appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      setCancellingId(appointmentId);
      console.log('🔄 Cancelling appointment:', appointmentId);
      await careAPI.updateAppointment(appointmentId, { status: 'cancelled' });
      console.log('✅ Appointment cancelled');
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
      ));
    } catch (err) {
      console.error('❌ Error cancelling appointment:', err);
      setError('Failed to cancel appointment');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return '#10B981';
      case 'scheduled': return '#3B82F6';
      case 'cancelled': return '#EF4444';
      case 'completed': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed':
      case 'completed':
        return <FiCheckCircle size={16} />;
      case 'cancelled':
        return <FiAlertCircle size={16} />;
      default:
        return <FiCalendar size={16} />;
    }
  };

  return (
    <PageTransition>
      <div style={{minHeight: '100vh', backgroundColor: 'var(--bg-main)', paddingTop: '80px'}}>
        <TopNav />

        <main style={{padding: '30px', paddingBottom: '120px'}}>
          <div className="container-fluid">
            {/* Header */}
            <div style={{marginBottom: '30px'}}>
              <h2 className="gradient-text" style={{fontSize: '28px', fontWeight: 800, marginBottom: '8px', fontFamily: 'Poppins'}}>
                My Appointments
              </h2>
              <p style={{color: '#6B7280', fontSize: '15px', fontWeight: '500', margin: 0}}>
                View and manage your counseling appointments
              </p>
            </div>

            {/* Refresh Button */}
            <div style={{marginBottom: '20px'}}>
              <button
                onClick={fetchAppointments}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}
              >
                <FiRefreshCw size={16} style={{animation: loading ? 'spin 1s linear infinite' : 'none'}} />
                Refresh
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                backgroundColor: '#FEE2E2',
                border: '1px solid #FCA5A5',
                color: '#DC2626',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <FiAlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div style={{textAlign: 'center', padding: '60px 20px'}}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid #E5E7EB',
                  borderTop: '3px solid #3B82F6',
                  borderRadius: '50%',
                  margin: '0 auto 20px',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{color: '#6B7280', fontSize: '15px'}}>Loading appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                padding: '40px 20px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <FiCalendar size={48} style={{color: '#D1D5DB', margin: '0 auto 16px'}} />
                <h3 style={{color: '#4B5563', fontWeight: '600', marginBottom: '8px'}}>No appointments yet</h3>
                <p style={{color: '#9CA3AF', fontSize: '14px', marginBottom: '20px'}}>
                  Schedule your first counseling appointment to get started
                </p>
                <button
                  onClick={() => navigate('/care')}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Schedule Appointment
                </button>
              </div>
            ) : (
              <div style={{display: 'grid', gap: '16px'}}>
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      padding: '20px',
                      borderRadius: '12px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      border: `2px solid ${getStatusColor(appointment.status)}`,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px'}}>
                      {/* Date and Time */}
                      <div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                          <FiCalendar size={20} style={{color: '#3B82F6'}} />
                          <div>
                            <p style={{color: '#6B7280', fontSize: '13px', margin: 0, fontWeight: '500'}}>Date</p>
                            <p style={{color: '#111827', fontSize: '15px', fontWeight: '600', margin: 0}}>
                              {new Date(appointment.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                          <FiClock size={20} style={{color: '#8B5CF6'}} />
                          <div>
                            <p style={{color: '#6B7280', fontSize: '13px', margin: 0, fontWeight: '500'}}>Time</p>
                            <p style={{color: '#111827', fontSize: '15px', fontWeight: '600', margin: 0}}>
                              {appointment.time}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Counselor and Status */}
                      <div>
                        {appointment.counselor_info && (
                          <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                            <FiUser size={20} style={{color: '#F59E0B'}} />
                            <div>
                              <p style={{color: '#6B7280', fontSize: '13px', margin: 0, fontWeight: '500'}}>Counselor</p>
                              <p style={{color: '#111827', fontSize: '15px', fontWeight: '600', margin: 0}}>
                                {appointment.counselor_info.name}
                              </p>
                            </div>
                          </div>
                        )}

                        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                          <div style={{color: getStatusColor(appointment.status)}}>
                            {getStatusIcon(appointment.status)}
                          </div>
                          <div>
                            <p style={{color: '#6B7280', fontSize: '13px', margin: 0, fontWeight: '500'}}>Status</p>
                            <p style={{color: getStatusColor(appointment.status), fontSize: '15px', fontWeight: '600', margin: 0, textTransform: 'capitalize'}}>
                              {appointment.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {appointment.notes && (
                      <div style={{
                        backgroundColor: '#F3F4F6',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '16px'
                      }}>
                        <p style={{color: '#6B7280', fontSize: '13px', fontWeight: '500', margin: '0 0 4px', marginBottom: '8px'}}>Notes</p>
                        <p style={{color: '#4B5563', fontSize: '14px', margin: 0}}>{appointment.notes}</p>
                      </div>
                    )}

                    {/* Cancel Button */}
                    {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        disabled={cancellingId === appointment.id}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#FEE2E2',
                          color: '#DC2626',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          opacity: cancellingId === appointment.id ? 0.6 : 1,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <FiTrash2 size={14} />
                        {cancellingId === appointment.id ? 'Cancelling...' : 'Cancel Appointment'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </PageTransition>
  );
}
