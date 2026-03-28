import React from 'react';
import { FiPhone, FiMail, FiBriefcase, FiArrowRight } from 'react-icons/fi';
import TopNav from './TopNav';
import PageTransition from './PageTransition';

export default function Contact() {
  const counselors = [
    {
      id: 1,
      name: 'Dr. Priya Sharma',
      designation: 'Head of Counseling Services',
      phone: '+91 9876543210',
      email: 'priya.sharma@vignan.ac.in'
    },
    {
      id: 2,
      name: 'Mr. Rajesh Kumar',
      designation: 'Senior Academic Counselor',
      phone: '+91 8765432109',
      email: 'rajesh.kumar@vignan.ac.in'
    },
    {
      id: 3,
      name: 'Ms. Anjali Patel',
      designation: 'Career Guidance Specialist',
      phone: '+91 7654321098',
      email: 'anjali.patel@vignan.ac.in'
    },
    {
      id: 4,
      name: 'Dr. Vikram Singh',
      designation: 'Mental Health Counselor',
      phone: '+91 6543210987',
      email: 'vikram.singh@vignan.ac.in'
    },
    {
      id: 5,
      name: 'Ms. Neha Gupta',
      designation: 'Student Support Coordinator',
      phone: '+91 7780770159',
      email: 'neha.gupta@vignan.ac.in'
    }
  ];

  const admissions = [
    {
      id: 1,
      name: 'Prof. K.V. Krishna Kishore',
      designation: 'Dean of Admissions',
      phone: '+91 8632344777',
      email: 'dean_adm@vignan.ac.in'
    },
    {
      id: 2,
      name: 'Mr. A. Gouri Sankar Rao',
      designation: 'Director of Admissions',
      phone: '+91 7799427427',
      email: 'director_admissions@vignan.ac.in'
    },
    {
      id: 3,
      name: 'International Admissions Cell',
      designation: 'International Student Coordinator',
      phone: '+91 8632344777',
      email: 'ufs@vignan.ac.in'
    },
    {
      id: 4,
      name: 'Directorate of Admissions',
      designation: 'B.Tech Admissions Hub',
      phone: '+91 8632344777',
      email: 'admissions@vignan.ac.in'
    },
    {
      id: 5,
      name: 'Public Relations Desk',
      designation: 'General Inquiries & Campus Information',
      phone: '+91 8632344777',
      email: 'admissions@vignan.ac.in'
    }
  ];

  return (
    <PageTransition>
      <div style={{minHeight: '100vh', backgroundColor: 'var(--bg-main)', paddingTop: '80px'}}>
        <TopNav />

        {/* Main Content */}
        <main style={{padding: '40px 30px', paddingBottom: '80px'}}>
          <div className="container-fluid">
            {/* Page Header */}
            <div style={{marginBottom: '40px'}}>
              <h2 className="gradient-text" style={{fontSize: '32px', fontWeight: 800, marginBottom: '12px', fontFamily: 'Poppins'}}>
                Contact Us
              </h2>
              <p style={{color: '#4B5563', fontSize: '16px', fontWeight: '500', maxWidth: '600px'}}>
                Reach out to our counseling and B.Tech admissions team at Vignan University. We're here to help you with your academic journey and answer all your admissions questions.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div style={{marginBottom: '40px'}}>
              <h3 className="gradient-text" style={{fontSize: '20px', fontWeight: 700, marginBottom: '20px', fontFamily: 'Poppins'}}>
                Our Counseling Team
              </h3>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px'}}>
                {counselors.map((counselor) => (
                  <div
                    key={counselor.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      padding: '24px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      border: '1px solid #E5E7EB',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Name */}
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#111827',
                      margin: '0 0 8px',
                      fontFamily: 'Poppins'
                    }}>
                      {counselor.name}
                    </h4>

                    {/* Designation */}
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px'}}>
                      <FiBriefcase size={16} style={{color: '#1E40AF'}}/>
                      <p style={{
                        fontSize: '13px',
                        color: '#1E40AF',
                        fontWeight: '600',
                        margin: 0,
                        fontFamily: 'Poppins'
                      }}>
                        {counselor.designation}
                      </p>
                    </div>

                    {/* Divider */}
                    <div style={{height: '1px', backgroundColor: '#E5E7EB', margin: '16px 0'}}></div>

                    {/* Contact Info */}
                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                      {/* Phone */}
                      <a
                        href={`tel:${counselor.phone.replace(/\s+/g, '')}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          textDecoration: 'none',
                          color: '#111827',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#1E40AF';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#111827';
                        }}
                      >
                        <div style={{
                          width: '36px',
                          height: '36px',
                          backgroundColor: '#EFF6FF',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#1E40AF'
                        }}>
                          <FiPhone size={16}/>
                        </div>
                        <div>
                          <p style={{fontSize: '11px', color: '#9CA3AF', margin: '0 0 2px', fontWeight: '500'}}>Phone</p>
                          <p style={{fontSize: '14px', fontWeight: '600', margin: 0, fontFamily: 'Poppins'}}>
                            {counselor.phone}
                          </p>
                        </div>
                      </a>

                      {/* Email */}
                      <a
                        href={`mailto:${counselor.email}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          textDecoration: 'none',
                          color: '#111827',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#1E40AF';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#111827';
                        }}
                      >
                        <div style={{
                          width: '36px',
                          height: '36px',
                          backgroundColor: '#EFF6FF',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#1E40AF'
                        }}>
                          <FiMail size={16}/>
                        </div>
                        <div>
                          <p style={{fontSize: '11px', color: '#9CA3AF', margin: '0 0 2px', fontWeight: '500'}}>Email</p>
                          <p style={{fontSize: '14px', fontWeight: '600', margin: 0, fontFamily: 'Poppins', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                            {counselor.email}
                          </p>
                        </div>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admissions Team Section */}
            <div style={{marginBottom: '40px'}}>
              <h3 style={{fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '20px', fontFamily: 'Poppins'}}>
                Admissions Department
              </h3>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px'}}>
                {admissions.map((admin) => (
                  <div
                    key={admin.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      padding: '24px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      border: '1px solid #E5E7EB',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Name */}
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#111827',
                      margin: '0 0 8px',
                      fontFamily: 'Poppins'
                    }}>
                      {admin.name}
                    </h4>

                    {/* Designation */}
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px'}}>
                      <FiBriefcase size={16} style={{color: '#059669'}}/>
                      <p style={{
                        fontSize: '13px',
                        color: '#059669',
                        fontWeight: '600',
                        margin: 0,
                        fontFamily: 'Poppins'
                      }}>
                        {admin.designation}
                      </p>
                    </div>

                    {/* Divider */}
                    <div style={{height: '1px', backgroundColor: '#E5E7EB', margin: '16px 0'}}></div>

                    {/* Contact Info */}
                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                      {/* Phone */}
                      <a
                        href={`tel:${admin.phone.replace(/\s+/g, '')}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          textDecoration: 'none',
                          color: '#111827',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#059669';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#111827';
                        }}
                      >
                        <div style={{
                          width: '36px',
                          height: '36px',
                          backgroundColor: '#ECFDF5',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#059669'
                        }}>
                          <FiPhone size={16}/>
                        </div>
                        <div>
                          <p style={{fontSize: '11px', color: '#9CA3AF', margin: '0 0 2px', fontWeight: '500'}}>Phone</p>
                          <p style={{fontSize: '14px', fontWeight: '600', margin: 0, fontFamily: 'Poppins'}}>
                            {admin.phone}
                          </p>
                        </div>
                      </a>

                      {/* Email */}
                      <a
                        href={`mailto:${admin.email}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          textDecoration: 'none',
                          color: '#111827',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#059669';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#111827';
                        }}
                      >
                        <div style={{
                          width: '36px',
                          height: '36px',
                          backgroundColor: '#ECFDF5',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#059669'
                        }}>
                          <FiMail size={16}/>
                        </div>
                        <div>
                          <p style={{fontSize: '11px', color: '#9CA3AF', margin: '0 0 2px', fontWeight: '500'}}>Email</p>
                          <p style={{fontSize: '14px', fontWeight: '600', margin: 0, fontFamily: 'Poppins', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                            {admin.email}
                          </p>
                        </div>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Card */}
            <div style={{
              backgroundColor: '#F0F9FF',
              borderRadius: '12px',
              padding: '32px',
              border: '2px solid #1E40AF',
              marginBottom: '30px'
            }}>
              <h3 style={{fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '16px', fontFamily: 'Poppins'}}>
                Vignan University - B.Tech Admissions
              </h3>
              <p style={{color: '#4B5563', fontSize: '15px', fontWeight: '500', margin: '0 0 12px', lineHeight: '1.6'}}>
                Vignan's Foundation for Science, Technology and Research (VFSTR)<br/>
                Vadlamudi, Guntur<br/>
                Andhra Pradesh, India
              </p>

              {/* B.Tech Departments Info */}
              <div style={{marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #BFDBFE'}}>
                <p style={{color: '#111827', fontSize: '14px', fontWeight: '700', margin: '0 0 12px', fontFamily: 'Poppins'}}>
                  📍 Key Admission Departments:
                </p>
                <ul style={{color: '#4B5563', fontSize: '13px', fontWeight: '500', margin: '0', paddingLeft: '20px', lineHeight: '1.8'}}>
                  <li><strong>Directorate of Admissions:</strong> Central hub for all B.Tech admission-related queries and entrance exam information (V-SAT)</li>
                  <li><strong>International Admissions Cell:</strong> For students applying from outside India</li>
                  <li><strong>Public Relations Desk:</strong> First point of contact for general inquiries and campus information</li>
                </ul>
              </div>

              <p style={{color: '#4B5563', fontSize: '15px', fontWeight: '500', margin: '16px 0 0'}}>
                <strong>Main Campus Phone:</strong> +91 863 2397555<br/>
                <strong>Email:</strong> <a href="mailto:counseling@vignan.ac.in" style={{color: '#1E40AF', textDecoration: 'none'}}>counseling@vignan.ac.in</a>
              </p>

              {/* Admissions Support Section */}
              <div style={{marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #BFDBFE'}}>
                <p style={{color: '#111827', fontSize: '16px', fontWeight: '700', margin: '0 0 12px', fontFamily: 'Poppins'}}>
                  📞 B.Tech Admissions Support
                </p>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px'}}>
                  <a href="tel:+918632344777" style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#1E40AF', textDecoration: 'none', fontWeight: '600', fontSize: '14px'}}>
                    <FiPhone size={16}/> +91-863-2344-777
                  </a>
                  <a href="tel:+917799427427" style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#1E40AF', textDecoration: 'none', fontWeight: '600', fontSize: '14px'}}>
                    <FiPhone size={16}/> +91 7799 427 427
                  </a>
                  <a href="tel:18004252529" style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#1E40AF', textDecoration: 'none', fontWeight: '600', fontSize: '14px'}}>
                    <FiPhone size={16}/> 1800-425-2529 (Toll-free)
                  </a>
                  <a href="https://wa.me/916281826720" target="_blank" rel="noopener noreferrer" style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#1E40AF', textDecoration: 'none', fontWeight: '600', fontSize: '14px'}}>
                    💬 WhatsApp: 62818 26720
                  </a>
                </div>
                <p style={{color: '#4B5563', fontSize: '14px', fontWeight: '500', margin: '12px 0 0'}}>
                  <strong>Email:</strong> <a href="mailto:admissions@vignan.ac.in" style={{color: '#1E40AF', textDecoration: 'none'}}>admissions@vignan.ac.in</a>
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #E5E7EB'
            }}>
              <h3 style={{fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '16px', fontFamily: 'Poppins'}}>
                Need Quick Help?
              </h3>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px'}}>
                <a
                  href="/care"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    backgroundColor: '#EFF6FF',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#1E40AF',
                    transition: 'all 0.2s ease',
                    border: '1px solid #1E40AF'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1E40AF';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#EFF6FF';
                    e.currentTarget.style.color = '#1E40AF';
                  }}
                >
                  <div>
                    <p style={{fontSize: '14px', fontWeight: '700', margin: 0, fontFamily: 'Poppins'}}>Book a Counseling Session</p>
                    <p style={{fontSize: '12px', fontWeight: '500', margin: '4px 0 0', opacity: 0.8}}>Schedule an appointment with our counselors</p>
                  </div>
                  <FiArrowRight size={20} style={{marginLeft: 'auto'}} />
                </a>

                <a
                  href="/chat"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    backgroundColor: '#F3E8FF',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#7C3AED',
                    transition: 'all 0.2s ease',
                    border: '1px solid #7C3AED'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#7C3AED';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3E8FF';
                    e.currentTarget.style.color = '#7C3AED';
                  }}
                >
                  <div>
                    <p style={{fontSize: '14px', fontWeight: '700', margin: 0, fontFamily: 'Poppins'}}>Chat with AI Assistant</p>
                    <p style={{fontSize: '12px', fontWeight: '500', margin: '4px 0 0', opacity: 0.8}}>Get instant answers to your questions</p>
                  </div>
                  <FiArrowRight size={20} style={{marginLeft: 'auto'}} />
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
