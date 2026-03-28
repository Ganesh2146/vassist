import React from 'react';
import { FiBook, FiAward, FiGraduationCap, FiStar, FiBriefcase, FiTrendingUp, FiMail } from 'react-icons/fi';

export default function Home({ isDarkTheme }) {
  return (
    <main className="flex-grow-1 d-flex flex-column" style={{backgroundColor: isDarkTheme ? '#0F172A' : '#F8FAFC', position: 'relative', overflowY: 'auto'}}>
      {/* Background Icons */}
      <div style={{position: 'absolute', top: '10%', left: '5%', opacity: isDarkTheme ? 0.05 : 0.07, fontSize: '140px', zIndex: 0}} className="text-primary">
        <FiBook size={140} color="#1E40AF" />
      </div>
      <div style={{position: 'absolute', bottom: '15%', right: '8%', opacity: isDarkTheme ? 0.05 : 0.08, fontSize: '130px', zIndex: 0}} className="text-primary">
        <FiAward size={130} color="#1E40AF" />
      </div>
      <div style={{position: 'absolute', top: '45%', right: '3%', opacity: isDarkTheme ? 0.04 : 0.06, fontSize: '120px', zIndex: 0}} className="text-primary">
        <FiGraduationCap size={120} color="#1E40AF" />
      </div>
      <div style={{position: 'absolute', bottom: '5%', left: '15%', opacity: isDarkTheme ? 0.05 : 0.07, fontSize: '110px', zIndex: 0}} className="text-primary">
        <FiBriefcase size={110} color="#1E40AF" />
      </div>
      <div style={{position: 'absolute', top: '20%', right: '25%', opacity: isDarkTheme ? 0.04 : 0.06, fontSize: '100px', zIndex: 0}} className="text-primary">
        <FiTrendingUp size={100} color="#1E40AF" />
      </div>
      
      <div className="container-fluid py-5" style={{position: 'relative', zIndex: 2}}>
        
        {/* Welcome Section with Gradient Background */}
        <section className="mb-5 rounded-4 p-5" style={{
          background: isDarkTheme 
            ? 'linear-gradient(135deg, #1E40AF 0%, #312E81 50%, #1E40AF 100%)'
            : 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #2563EB 100%)',
          color: '#FFFFFF'
        }}>
          <h2 className="display-4 fw-bold mb-4">Welcome to V-Assist</h2>
          <p className="fs-5">
            Your AI-powered companion for navigating university life. Get instant support with admissions, academics, financial aid, and campus services.
          </p>
        </section>

        {/* University Information Cards */}
        <section className="row g-4 mb-5">
          
          {/* Admissions Card */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 shadow-sm" style={{
              backgroundColor: isDarkTheme ? '#1F2937' : '#FFFFFF', 
              border: 'none', 
              borderTop: '4px solid #1E40AF',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 15px 30px rgba(30, 64, 175, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}>
              <div className="card-body">
                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '50px', height: '50px', backgroundColor: '#E0E7FF' }}>
                  <span className="fs-3">🎓</span>
                </div>
                <h5 className="card-title fs-5 fw-bold" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>Admissions</h5>
                <p className="card-text" style={{color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>
                  Get guidance on the application process, admission requirements, and deadlines. Our AI assistant helps you at every step.
                </p>
              </div>
            </div>
          </div>

          {/* Academics Card */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 shadow-sm" style={{
              backgroundColor: isDarkTheme ? '#1F2937' : '#FFFFFF', 
              border: 'none', 
              borderTop: '4px solid #10B981',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 15px 30px rgba(16, 185, 129, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}>
              <div className="card-body">
                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '50px', height: '50px', backgroundColor: '#D1FAE5'}}>
                  <span className="fs-3">📚</span>
                </div>
                <h5 className="card-title fs-5 fw-bold" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>Academics</h5>
                <p className="card-text" style={{color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>
                  Explore course offerings, curriculum information, and academic support resources available to students.
                </p>
              </div>
            </div>
          </div>

          {/* Financial Aid Card */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 shadow-sm" style={{
              backgroundColor: isDarkTheme ? '#1F2937' : '#FFFFFF', 
              border: 'none', 
              borderTop: '4px solid #F59E0B',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 15px 30px rgba(245, 158, 11, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}>
              <div className="card-body">
                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '50px', height: '50px', backgroundColor: '#FEF3C7'}}>
                  <span className="fs-3">💰</span>
                </div>
                <h5 className="card-title fs-5 fw-bold" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>Financial Aid</h5>
                <p className="card-text" style={{color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>
                  Learn about scholarships, grants, loans, and financial assistance programs available to you.
                </p>
              </div>
            </div>
          </div>

          {/* Campus Services Card */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 shadow-sm" style={{
              backgroundColor: isDarkTheme ? '#1F2937' : '#FFFFFF', 
              border: 'none', 
              borderTop: '4px solid #06B6D4',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 15px 30px rgba(6, 182, 212, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}>
              <div className="card-body">
                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '50px', height: '50px', backgroundColor: '#CFFAFE'}}>
                  <span className="fs-3">🏫</span>
                </div>
                <h5 className="card-title fs-5 fw-bold" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>Campus Services</h5>
                <p className="card-text" style={{color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>
                  Discover student services, housing information, health services, and other campus facilities.
                </p>
              </div>
            </div>
          </div>

        </section>

        {/* Features Section */}
        <section className="rounded-4 shadow-sm p-5 mb-5" style={{
          backgroundColor: isDarkTheme ? '#1F2937' : '#FFFFFF',
          background: isDarkTheme
            ? 'linear-gradient(135deg, #1F2937 0%, #374151 100%)'
            : 'linear-gradient(135deg, #F8FAFC 0%, #F0F4FF 100%)'
        }}>
          <h3 className="fs-3 fw-bold mb-4" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>Why Choose V-Assist?</h3>
          <div className="row g-4">
            <div className="col-12 col-md-6 d-flex gap-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{width: '50px', height: '50px', minWidth: '50px', backgroundColor: '#1E40AF'}}>
                <span className="text-white fw-bold fs-5">✓</span>
              </div>
              <div>
                <h5 className="fw-bold mb-2" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>24/7 Availability</h5>
                <p style={{color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>Get support anytime, anywhere with our AI-powered chatbot.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 d-flex gap-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{width: '50px', height: '50px', minWidth: '50px', backgroundColor: '#1E40AF'}}>
                <span className="text-white fw-bold fs-5">✓</span>
              </div>
              <div>
                <h5 className="fw-bold mb-2" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>Instant Responses</h5>
                <p style={{color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>Get quick answers to your questions without waiting for staff.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 d-flex gap-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{width: '50px', height: '50px', minWidth: '50px', backgroundColor: '#1E40AF'}}>
                <span className="text-white fw-bold fs-5">✓</span>
              </div>
              <div>
                <h5 className="fw-bold mb-2" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>Personalized Support</h5>
                <p style={{color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>Receive tailored recommendations based on your specific needs.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 d-flex gap-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{width: '50px', height: '50px', minWidth: '50px', backgroundColor: '#1E40AF'}}>
                <span className="text-white fw-bold fs-5">✓</span>
              </div>
              <div>
                <h5 className="fw-bold mb-2" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>Easy to Use</h5>
                <p style={{color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>Simple and intuitive interface designed for students.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="row g-4 mb-5">
          <div className="col-12 col-md-4">
            <div className="card text-white text-center shadow-sm" style={{
              background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
              border: 'none'
            }}>
              <div className="card-body py-5">
                <p className="display-5 fw-bold mb-2">0</p>
                <p className="fs-5">Students Helped</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card text-white text-center shadow-sm" style={{
              background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
              border: 'none'
            }}>
              <div className="card-body py-5">
                <p className="display-5 fw-bold mb-2">0</p>
                <p className="fs-5">Satisfaction Rate</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card text-white text-center shadow-sm" style={{
              background: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)',
              border: 'none'
            }}>
              <div className="card-body py-5">
                <p className="display-5 fw-bold mb-2">8</p>
                <p className="fs-5">FAQs Available</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="rounded-4 shadow-sm p-5 mb-5" style={{
          backgroundColor: isDarkTheme ? '#1F2937' : '#FFFFFF',
          background: isDarkTheme
            ? 'linear-gradient(135deg, #1F2937 0%, #374151 100%)'
            : 'linear-gradient(135deg, #F8FAFC 0%, #F3E8FF 100%)'
        }}>
          <h3 className="fs-3 fw-bold mb-4" style={{color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>Frequently Asked Questions</h3>
          <div className="accordion" id="faqAccordion">
            
            {/* FAQ 1 */}
            <div className="accordion-item" style={{backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB', border: 'none', marginBottom: '12px', borderRadius: '8px', overflow: 'hidden'}}>
              <h2 className="accordion-header">
                <button className="accordion-button collapsed fw-600" type="button" data-bs-toggle="collapse" data-bs-target="#faq1" style={{backgroundColor: isDarkTheme ? '#1F2937' : '#F9FAFB', color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>
                  What is V-Assist?
                </button>
              </h2>
              <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body" style={{backgroundColor: isDarkTheme ? '#111827' : '#FFFFFF', color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>
                  V-Assist is an AI-powered virtual assistant designed specifically for students. It provides 24/7 support on admissions, academics, financial aid, campus services, and more. Our intelligent chatbot understands your unique needs and provides personalized guidance throughout your university journey.
                </div>
              </div>
            </div>

            {/* FAQ 2 */}
            <div className="accordion-item" style={{backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB', border: 'none', marginBottom: '12px', borderRadius: '8px', overflow: 'hidden'}}>
              <h2 className="accordion-header">
                <button className="accordion-button collapsed fw-600" type="button" data-bs-toggle="collapse" data-bs-target="#faq2" style={{backgroundColor: isDarkTheme ? '#1F2937' : '#F9FAFB', color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>
                  Is V-Assist available 24/7?
                </button>
              </h2>
              <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body" style={{backgroundColor: isDarkTheme ? '#111827' : '#FFFFFF', color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>
                  Yes! V-Assist is available 24/7, 365 days a year. You can get instant answers to your questions anytime, day or night, without waiting for staff office hours. This makes it convenient for students in different time zones and with different schedules.
                </div>
              </div>
            </div>

            {/* FAQ 3 */}
            <div className="accordion-item" style={{backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB', border: 'none', marginBottom: '12px', borderRadius: '8px', overflow: 'hidden'}}>
              <h2 className="accordion-header">
                <button className="accordion-button collapsed fw-600" type="button" data-bs-toggle="collapse" data-bs-target="#faq3" style={{backgroundColor: isDarkTheme ? '#1F2937' : '#F9FAFB', color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>
                  How do I create an account?
                </button>
              </h2>
              <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body" style={{backgroundColor: isDarkTheme ? '#111827' : '#FFFFFF', color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>
                  Creating an account is simple! Click the "Sign Up" button, fill in your basic information (name, email, password), select your user type (student, counselor, or admin), and you're ready to go. It takes less than a minute.
                </div>
              </div>
            </div>

            {/* FAQ 4 */}
            <div className="accordion-item" style={{backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB', border: 'none', marginBottom: '12px', borderRadius: '8px', overflow: 'hidden'}}>
              <h2 className="accordion-header">
                <button className="accordion-button collapsed fw-600" type="button" data-bs-toggle="collapse" data-bs-target="#faq4" style={{backgroundColor: isDarkTheme ? '#1F2937' : '#F9FAFB', color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>
                  Is my data secure with V-Assist?
                </button>
              </h2>
              <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body" style={{backgroundColor: isDarkTheme ? '#111827' : '#FFFFFF', color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>
                  Yes, your privacy and security are our top priorities. All your data is encrypted and stored securely. We follow industry best practices and comply with data protection regulations to ensure your information is safe.
                </div>
              </div>
            </div>

            {/* FAQ 5 */}
            <div className="accordion-item" style={{backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB', border: 'none', marginBottom: '12px', borderRadius: '8px', overflow: 'hidden'}}>
              <h2 className="accordion-header">
                <button className="accordion-button collapsed fw-600" type="button" data-bs-toggle="collapse" data-bs-target="#faq5" style={{backgroundColor: isDarkTheme ? '#1F2937' : '#F9FAFB', color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>
                  What topics can V-Assist help with?
                </button>
              </h2>
              <div id="faq5" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body" style={{backgroundColor: isDarkTheme ? '#111827' : '#FFFFFF', color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>
                  V-Assist can help with a wide range of topics including admissions process, course selection, academic planning, financial aid and scholarships, housing and campus facilities, health and wellness services, registration and enrollment, and general university policies and procedures.
                </div>
              </div>
            </div>

            {/* FAQ 6 */}
            <div className="accordion-item" style={{backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB', border: 'none', marginBottom: '12px', borderRadius: '8px', overflow: 'hidden'}}>
              <h2 className="accordion-header">
                <button className="accordion-button collapsed fw-600" type="button" data-bs-toggle="collapse" data-bs-target="#faq6" style={{backgroundColor: isDarkTheme ? '#1F2937' : '#F9FAFB', color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>
                  Can I connect with a human representative?
                </button>
              </h2>
              <div id="faq6" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body" style={{backgroundColor: isDarkTheme ? '#111827' : '#FFFFFF', color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>
                  Absolutely! If you need assistance from a human representative, V-Assist can connect you with the appropriate staff member or department. You can also reach out to us directly through the contact information provided below.
                </div>
              </div>
            </div>

            {/* FAQ 7 */}
            <div className="accordion-item" style={{backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB', border: 'none', marginBottom: '12px', borderRadius: '8px', overflow: 'hidden'}}>
              <h2 className="accordion-header">
                <button className="accordion-button collapsed fw-600" type="button" data-bs-toggle="collapse" data-bs-target="#faq7" style={{backgroundColor: isDarkTheme ? '#1F2937' : '#F9FAFB', color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>
                  How do I reset my password?
                </button>
              </h2>
              <div id="faq7" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body" style={{backgroundColor: isDarkTheme ? '#111827' : '#FFFFFF', color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>
                  If you forget your password, click the "Forgot?" link on the login page. Enter your email address, and we'll send you a link to reset your password. Follow the instructions in the email to create a new password.
                </div>
              </div>
            </div>

            {/* FAQ 8 */}
            <div className="accordion-item" style={{backgroundColor: isDarkTheme ? '#111827' : '#F9FAFB', border: 'none', marginBottom: '12px', borderRadius: '8px', overflow: 'hidden'}}>
              <h2 className="accordion-header">
                <button className="accordion-button collapsed fw-600" type="button" data-bs-toggle="collapse" data-bs-target="#faq8" style={{backgroundColor: isDarkTheme ? '#1F2937' : '#F9FAFB', color: isDarkTheme ? '#F1F5F9' : '#1F2937'}}>
                  How can I provide feedback about V-Assist?
                </button>
              </h2>
              <div id="faq8" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body" style={{backgroundColor: isDarkTheme ? '#111827' : '#FFFFFF', color: isDarkTheme ? '#D1D5DB' : '#6B7280'}}>
                  We'd love to hear your feedback! You can provide suggestions and report issues directly through the dashboard. Additionally, you can email us at vassist.vignan@gmail.com with any comments or concerns. Your feedback helps us improve the service.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section - PROMINENT */}
        <section className="rounded-4 shadow-lg p-5" style={{
          background: isDarkTheme
            ? 'linear-gradient(135deg, #EC4899 0%, #D946EF 50%, #8B5CF6 100%)'
            : 'linear-gradient(135deg, #EC4899 0%, #F43F5E 50%, #E11D48 100%)',
          color: '#FFFFFF',
          marginBottom: 0
        }}>
          <div className="row align-items-center">
            <div className="col-12 col-md-8 mb-4 mb-md-0">
              <h2 className="fs-3 fw-bold mb-3">Get in Touch</h2>
              <p className="fs-5 mb-4">Have questions or need assistance? We're here to help! Reach out to us anytime.</p>
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)'}}>
                    <div style={{fontSize: '24px', color: '#FFFFFF'}}>
                      <FiMail size={32} />
                    </div>
                    <div>
                      <p style={{fontSize: '12px', margin: 0, opacity: 0.9}}>Email Us</p>
                      <a href="mailto:vassist.vignan@gmail.com" style={{color: '#FFFFFF', textDecoration: 'none', fontSize: '16px', fontWeight: 700}}>
                        vassist.vignan@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)'}}>
                    <div className="fs-3">💬</div>
                    <div>
                      <p style={{fontSize: '12px', margin: 0, opacity: 0.9}}>Live Chat</p>
                      <p style={{color: '#FFFFFF', fontSize: '16px', fontWeight: 700, margin: 0}}>
                        Available in Dashboard
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <p style={{fontSize: '13px', marginTop: '20px', marginBottom: 0, opacity: 0.9}}>
                📞 We typically respond to emails within 24 hours | Live chat support during business hours
              </p>
            </div>
            <div className="col-12 col-md-4 text-center">
              <div className="p-4 rounded-3" style={{backgroundColor: 'rgba(255, 255, 255, 0.15)', border: '2px solid rgba(255, 255, 255, 0.3)'}}>
              <div className="fs-1 mb-3">Partnership</div>
                <h4 className="fw-bold mb-2">Quick Response</h4>
                <p style={{margin: 0}}>We value your time and commitment to helping you succeed!</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
    </main>
  );
}
