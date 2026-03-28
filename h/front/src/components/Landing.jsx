import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiMessageSquare, FiBook, FiDollarSign, FiUsers, FiTwitter, FiInstagram, FiLinkedin, FiFacebook, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function Landing() {
  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {/* Header - Modern & Professional */}
      <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 1000, margin: '16px 24px', padding: '16px 32px' }}>
        <div className="container-fluid d-flex justify-content-between align-items-center p-0">
          <Link to="/" className="text-decoration-none">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-gradient-primary rounded-3 d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style={{ width: '48px', height: '48px', fontSize: '24px' }}>
                V
              </div>
              <h1 className="mb-0 fw-bold fs-4 text-dark">V-Assist</h1>
            </div>
          </Link>
          <div className="d-flex gap-3 align-items-center">
            <Link to="/" className="btn btn-link fw-semibold text-muted text-decoration-none d-none d-md-block">
              Home
            </Link>
            <Link to="/admin-login" className="btn btn-outline-primary rounded-pill px-4 fw-semibold d-none d-sm-block">
              Admin
            </Link>
            <Link to="/login" className="btn btn-primary-gradient rounded-pill px-4 fw-semibold shadow-sm animate-pulse-soft">
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Modern Gradient with Creative Elements */}
      <section className="position-relative overflow-hidden flex-grow-1 d-flex align-items-center section-padding hero-gradient" style={{ borderRadius: '12px', margin: '16px', marginTop: '8px' }}>
        {/* Animated Background Blobs */}
        <div className="blob-shape blob-primary animate-float" style={{ top: '-10%', right: '-5%', width: '400px', height: '400px' }}></div>
        <div className="blob-shape blob-secondary animate-float stagger-3" style={{ bottom: '-10%', left: '-5%', width: '500px', height: '500px' }}></div>
        <div className="blob-shape blob-primary animate-float stagger-5" style={{ top: '20%', left: '10%', width: '250px', height: '250px', opacity: 0.1 }}></div>
        
        <div className="page-container position-relative z-1 w-100">
          <div className="row align-items-center min-vh-75">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="col-12 col-lg-6 text-center text-lg-start mb-5 mb-lg-0"
            >
              {/* Animated Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="d-inline-block mb-4"
              >
                <div className="glass-panel text-primary fw-bold text-uppercase px-4 py-2 shadow-sm d-flex align-items-center gap-2" style={{ fontSize: '14px', letterSpacing: '2px', borderRadius: '50px' }}>
                  <span className="position-relative flex-center" style={{ width: '8px', height: '8px' }}>
                    <span className="position-absolute w-100 h-100 bg-primary rounded-circle animate-pulse-soft"></span>
                  </span>
                  V-Assist 2.0 is Live
                </div>
              </motion.div>
              
              {/* Main Heading with Animation */}
              <h2 className="fw-900 text-dark mb-4 drop-shadow-sm" style={{ fontSize: 'clamp(40px, 6vw, 76px)', lineHeight: '1.2' }}>
                Your AI-Powered <br className="d-none d-lg-block" />
                <span className="gradient-text" style={{ fontSize: 'clamp(44px, 7vw, 84px)' }}>University Portal</span>
              </h2>
              
              {/* Subheading */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-muted mb-5 fs-5 mx-auto mx-lg-0" 
                style={{ maxWidth: '600px', lineHeight: '1.6' }}
              >
                Experience the easiest way to manage your campus life. From real-time academic counseling to comprehensive support services, AI is at your fingertips.
              </motion.p>

              {/* CTA Buttons with Creative Effects */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start mb-5"
              >
                <Link to="/signup" className="btn-modern btn-primary-gradient px-5 py-3 fs-5 d-flex align-items-center gap-2">
                  Get Started <FiArrowRight />
                </Link>
                <Link to="/login" className="btn-modern btn-outline-primary bg-white px-5 py-3 fs-5 border-2 shadow-sm">
                  Sign In
                </Link>
              </motion.div>

              {/* Checkmarks */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-4 text-muted fs-7 fw-semibold"
              >
                <div className="d-flex align-items-center gap-2"><FiCheckCircle className="text-success" /> 24/7 AI Support</div>
                <div className="d-flex align-items-center gap-2"><FiCheckCircle className="text-success" /> Secure Portal</div>
                <div className="d-flex align-items-center gap-2"><FiCheckCircle className="text-success" /> Personalized Feed</div>
              </motion.div>
            </motion.div>

            {/* 3D Floating Mockup Layout */}
            <motion.div 
              initial={{ opacity: 0, x: 50, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="col-12 col-lg-6 d-none d-lg-block position-relative"
            >
              <div className="position-relative w-100" style={{ height: '550px' }}>
                {/* Main Mockup Card */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="glass-panel-heavy p-4 position-absolute shadow-lg z-2 w-100"
                  style={{ top: '50px', right: '0', maxWidth: '450px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.8)' }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-subtle">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary bg-opacity-10 text-primary rounded-circle flex-center" style={{ width: 48, height: 48 }}>
                        <FiMessageSquare size={24} />
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0 text-dark">V-Assist AI</h6>
                        <span className="text-success fs-7 fw-semibold">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-column gap-3 mb-4">
                    <div className="bg-light p-3 rounded-4" style={{ maxWidth: '85%', alignSelf: 'flex-start', borderBottomLeftRadius: 4 }}>
                      <p className="mb-0 fs-6 text-dark fw-medium">Hi there! How can I help you with your semester planning today?</p>
                    </div>
                    <div className="bg-primary text-white p-3 rounded-4 shadow-sm" style={{ maxWidth: '85%', alignSelf: 'flex-end', borderBottomRightRadius: 4 }}>
                      <p className="mb-0 fs-6">I need to check my remaining credits for graduation.</p>
                    </div>
                  </div>
                  <div className="bg-light rounded-pill p-2 px-3 text-muted fs-6 d-flex justify-content-between align-items-center">
                    Type your message...
                    <div className="bg-primary text-white rounded-circle flex-center" style={{ width: 32, height: 32 }}><FiArrowRight size={16} /></div>
                  </div>
                </motion.div>

                {/* Floating Element 1 - Notification */}
                <motion.div 
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="glass-panel p-3 position-absolute shadow-md z-3 d-flex align-items-center gap-3"
                  style={{ bottom: '80px', left: '-50px', borderRadius: '16px' }}
                >
                  <div className="bg-success text-white rounded-circle flex-center" style={{ width: 40, height: 40 }}>
                    <FiCheckCircle size={20} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark fs-7">Scholarship Approved</h6>
                    <span className="text-muted fs-8">Just now</span>
                  </div>
                </motion.div>

                {/* Floating Element 2 - Stats */}
                <motion.div 
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="glass-panel p-3 position-absolute shadow-md z-1"
                  style={{ top: '20px', right: '-40px', borderRadius: '16px', width: '200px' }}
                >
                  <h6 className="fw-bold text-dark fs-7 mb-3">Credits Progress</h6>
                  <div className="progress mb-2" style={{ height: 8 }}>
                    <div className="progress-bar bg-primary" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-muted fs-8 fw-semibold">90 / 120 Units</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Services Grid - Enhanced with Creative Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mt-5 pt-5 pb-4 border-top border-subtle"
          >
            <p className="gradient-text fw-bold text-uppercase mb-4 text-center text-lg-start" style={{ fontSize: '14px', letterSpacing: '2px' }}>
              Why Choose V-Assist
            </p>
            <div className="grid-auto-fit text-start">
              {[
                { title: 'Admission Assistance', desc: 'Personalized guidance on applications and requirements', icon: FiHome, color: 'var(--secondary)' },
                { title: 'Academic Support', desc: 'Course selection, tutoring, and study resources', icon: FiBook, color: 'var(--success)' },
                { title: 'Financial Guidance', desc: 'Scholarships, grants, and payment information', icon: FiDollarSign, color: 'var(--warning)' },
                { title: 'Campus Services', desc: 'Housing, dining, and student organizations', icon: FiUsers, color: 'var(--primary)' }
              ].map((service, idx) => (
                <div key={idx} className="surface-card gradient-bg-subtle p-4 h-100 d-flex flex-column hover-lift gradient-glow" style={{ position: 'relative' }}>
                  <div className="mb-4 rounded-4 flex-center shadow-sm" style={{ width: '64px', height: '64px', backgroundColor: `${service.color}15`, color: service.color, transition: 'all var(--transition-bounce)' }}>
                    <service.icon size={28} />
                  </div>
                  <h5 className="fw-bold text-dark mb-3 fs-5">{service.title}</h5>
                  <p className="text-muted mb-0 fs-6">{service.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Modern & Social Media Integration */}
      <footer className="bg-white py-4 mt-auto border-top border-subtle">
        <div className="page-container text-center">
            <div className="d-flex justify-content-center gap-4 mb-3">
            <a href="#" className="text-muted hover-primary transition-normal"><FiTwitter size={20} /></a>
            <a href="#" className="text-muted hover-primary transition-normal"><FiInstagram size={20} /></a>
            <a href="#" className="text-muted hover-primary transition-normal"><FiLinkedin size={20} /></a>
            <a href="#" className="text-muted hover-primary transition-normal"><FiFacebook size={20} /></a>
          </div>
          <p className="text-dark fw-medium mb-1 fs-6">© 2026 V-Assist University Portal</p>
          <p className="text-muted mb-1 fs-6">
            Email: <a href="mailto:vassist.vignan@gmail.com" className="text-primary text-decoration-none fw-medium">vassist.vignan@gmail.com</a>
          </p>
          <p className="text-light mb-0" style={{ fontSize: '13px' }}>Building the future of student support with AI</p>
        </div>
      </footer>
    </div>
  );
}
