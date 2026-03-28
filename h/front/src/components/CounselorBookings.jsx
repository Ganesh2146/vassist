import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiUser, FiCheckCircle, FiXCircle, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { careAPI } from '../api/config';
import TopNav from './TopNav';
import PageTransition from './PageTransition';

export default function CounselorBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const [editingNotes, setEditingNotes] = useState({});

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log('📅 Fetching counselor bookings...');
      const response = await careAPI.getCounselorBookings();
      console.log('✅ Bookings fetched:', response.data);
      setBookings(response.data.data || []);
      // Initialize notes state
      const notesState = {};
      (response.data.data || []).forEach(booking => {
        notesState[booking.id] = booking.notes || '';
      });
      setEditingNotes(notesState);
      setError('');
    } catch (err) {
      console.error('❌ Error fetching bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAppointment = async (appointmentId, newStatus, newNotes) => {
    try {
      setUpdatingId(appointmentId);
      const payload = {};
      if (newStatus) payload.status = newStatus;
      if (newNotes !== undefined) payload.notes = newNotes;

      console.log(`🔄 Updating appointment ${appointmentId} with:`, payload);
      await careAPI.updateAppointment(appointmentId, payload);
      console.log('✅ Appointment updated');
      
      setBookings(prev => prev.map(booking =>
        booking.id === appointmentId 
          ? { ...booking, status: newStatus || booking.status, notes: newNotes !== undefined ? newNotes : booking.notes } 
          : booking
      ));
    } catch (err) {
      console.error('❌ Error updating appointment:', err);
      setError('Failed to update appointment');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleNoteChange = (appointmentId, value) => {
    setEditingNotes(prev => ({ ...prev, [appointmentId]: value }));
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

  const filteredBookings = filterStatus === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus);

  const statusCounts = {
    all: bookings.length,
    scheduled: bookings.filter(b => b.status === 'scheduled').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
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
                Student Bookings
              </h2>
              <p style={{color: '#6B7280', fontSize: '15px', fontWeight: '500', margin: 0}}>
                Manage counseling appointments with your students
              </p>
            </div>

            {/* Stats Cards */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '30px'}}>
              {[
                { label: 'Total', value: statusCounts.all, color: '#6B7280' },
                { label: 'Scheduled', value: statusCounts.scheduled, color: '#3B82F6' },
                { label: 'Confirmed', value: statusCounts.confirmed, color: '#10B981' },
                { label: 'Completed', value: statusCounts.completed, color: '#8B5CF6' },
                { label: 'Cancelled', value: statusCounts.cancelled, color: '#EF4444' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '16px',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    border: filterStatus === stat.label.toLowerCase() || (filterStatus === 'all' && stat.label === 'Total') ? `2px solid ${stat.color}` : '2px solid transparent',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setFilterStatus(stat.label.toLowerCase())}
                >
                  <p style={{color: '#6B7280', fontSize: '13px', fontWeight: '500', margin: '0 0 8px'}}>{stat.label}</p>
                  <p style={{color: stat.color, fontSize: '24px', fontWeight: '800', margin: 0}}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Refresh Button */}
            <div style={{marginBottom: '20px'}}>
              <button
                onClick={fetchBookings}
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
                <p style={{color: '#6B7280', fontSize: '15px'}}>Loading bookings...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                padding: '40px 20px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <FiCalendar size={48} style={{color: '#D1D5DB', margin: '0 auto 16px'}} />
                <h3 style={{color: '#4B5563', fontWeight: '600', marginBottom: '8px'}}>No bookings found</h3>
                <p style={{color: '#9CA3AF', fontSize: '14px'}}>
                  {filterStatus === 'all' ? 'Students haven\'t scheduled appointments yet' : `No ${filterStatus} appointments`}
                </p>
              </div>
            ) : (
              <div style={{display: 'grid', gap: '16px'}}>
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      padding: '20px',
                      borderRadius: '12px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      border: `2px solid ${getStatusColor(booking.status)}`,
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
                              {new Date(booking.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
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
                              {booking.time}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Student Info and Status */}
                      <div>
                        {booking.student && (
                          <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                            <FiUser size={20} style={{color: '#F59E0B'}} />
                            <div>
                              <p style={{color: '#6B7280', fontSize: '13px', margin: 0, fontWeight: '500'}}>Student</p>
                              <p style={{color: '#111827', fontSize: '15px', fontWeight: '600', margin: 0}}>
                                {booking.student.name}
                              </p>
                              <p style={{color: '#9CA3AF', fontSize: '12px', margin: '4px 0 0'}}>{booking.student.email}</p>
                            </div>
                          </div>
                        )}

                        <div>
                          <p style={{color: '#6B7280', fontSize: '13px', margin: '0 0 8px', fontWeight: '500'}}>Status</p>
                          <p style={{color: getStatusColor(booking.status), fontSize: '13px', fontWeight: '600', margin: 0, textTransform: 'capitalize'}}>
                            {booking.status}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {booking.notes && (
                      <div style={{
                        backgroundColor: '#F3F4F6',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '16px'
                      }}>
                        <p style={{color: '#6B7280', fontSize: '13px', fontWeight: '500', margin: '0 0 4px'}}>Notes</p>
                        <p style={{color: '#4B5563', fontSize: '14px', margin: 0}}>{booking.notes}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {booking.status === 'scheduled' && (
                      <div style={{display: 'flex', gap: '12px'}}>
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                          disabled={updatingId === booking.id}
                          style={{
                            flex: 1,
                            padding: '10px 16px',
                            backgroundColor: '#DBEAFE',
                            color: '#1E40AF',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            opacity: updatingId === booking.id ? 0.6 : 1,
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <FiCheckCircle size={16} />
                          {updatingId === booking.id ? 'Confirming...' : 'Confirm'}
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                          disabled={updatingId === booking.id}
                          style={{
                            flex: 1,
                            padding: '10px 16px',
                            backgroundColor: '#FEE2E2',
                            color: '#DC2626',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            opacity: updatingId === booking.id ? 0.6 : 1,
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <FiXCircle size={16} />
                          {updatingId === booking.id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      </div>
                    )}

                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'completed')}
                        disabled={updatingId === booking.id}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          backgroundColor: '#DBEAFE',
                          color: '#1E40AF',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          opacity: updatingId === booking.id ? 0.6 : 1,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <FiCheckCircle size={16} />
                        {updatingId === booking.id ? 'Marking Complete...' : 'Mark as Completed'}
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
