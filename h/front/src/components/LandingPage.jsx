import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Assistant',
      description: 'Intelligent chatbot that understands your needs and provides personalized guidance.'
    },
    {
      icon: '🎯',
      title: 'Smart Counseling',
      description: 'Connect with professional counselors and get the support you need, anytime.'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Track your progress and get insights into your growth journey.'
    },
    {
      icon: '🔐',
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected with enterprise-grade security.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Instant responses with cutting-edge technology infrastructure.'
    },
    {
      icon: '📱',
      title: 'Mobile Optimized',
      description: 'Perfect experience on any device, anywhere, anytime.'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '5K+' },
    { label: 'Monthly Queries', value: '50K+' },
    { label: 'Satisfaction Rate', value: '98%' },
    { label: 'Support Team', value: '24/7' }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
        <div className="hero-background">
          <div className="hero-gradient-1"></div>
          <div className="hero-gradient-2"></div>
        </div>

        <div className="hero-content reveal">
          <h1 className="hero-title">Welcome to V-Assist</h1>
          <p className="hero-subtitle">
            Your AI-powered university companion for counseling, academic support, and personal growth
          </p>

          <div className="hero-cta">
            <Link to="/chat" className="btn btn-primary btn-lg">
              <i className="fas fa-comments"></i>
              Start Chatting
            </Link>
            <Link to="/auth/signup" className="btn btn-outline btn-lg">
              <i className="fas fa-user-plus"></i>
              Join Now
            </Link>
          </div>

          <div className="hero-stats">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-item reveal-scale">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="gradient-text">Powerful Features</h2>
            <p className="section-subtitle">Everything you need for a better university experience</p>
          </div>

          <div className="features-grid stagger-children">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card glass-card hover-lift">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-section">
        <div className="container">
          <div className="why-content">
            <div className="why-text reveal">
              <h2>Why Choose V-Assist?</h2>
              <p>
                V-Assist combines cutting-edge AI technology with human expertise to create the most
                comprehensive student support platform available. We're committed to your success.
              </p>

              <ul className="benefits-list">
                <li>
                  <i className="fas fa-check-circle"></i>
                  <span>24/7 Available support whenever you need it</span>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <span>Professional counselors and mentors</span>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <span>Personalized recommendations</span>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <span>Complete privacy and security</span>
                </li>
              </ul>

              <Link to="/chat" className="btn btn-primary">
                Get Started Today
              </Link>
            </div>

            <div className="why-visual reveal-blur">
              <div className="morph-shape float"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="gradient-text">What Users Say</h2>
            <p className="section-subtitle">Real stories from real students</p>
          </div>

          <div className="testimonials-grid stagger-children">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Computer Science Student',
                text: 'V-Assist has been incredibly helpful with my academic journey. The AI recommendations are spot on!',
                avatar: '👩‍🎓'
              },
              {
                name: 'Michael Chen',
                role: 'Business Student',
                text: 'The counselor feature helped me navigate my career choices. Highly recommended!',
                avatar: '👨‍💼'
              },
              {
                name: 'Emma Williams',
                role: 'Psychology Student',
                text: 'Amazing platform. The support is always there when I need it. 5 stars!',
                avatar: '👩‍🔬'
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="testimonial-card glass-card">
                <div className="testimonial-content">
                  <p className="testimonial-text">"{testimonial.text}"</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-role">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content gradient-border">
            <h2>Ready to Transform Your University Experience?</h2>
            <p>Join thousands of students already using V-Assist for success.</p>
            <Link to="/auth/signup" className="btn btn-primary btn-lg">
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
