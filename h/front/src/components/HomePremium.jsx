import React, { useState, useEffect } from 'react';
import { FiArrowRight, FiBookOpen, FiMessageCircle, FiAward, FiUsers, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

export default function HomePremium() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: FiMessageCircle,
      title: '24/7 AI Chatbot',
      description: 'Get instant answers to your questions about admissions, academics, and campus life anytime, anywhere.'
    },
    {
      icon: FiBookOpen,
      title: 'Smart Learning Paths',
      description: 'Personalized course recommendations tailored to your goals and interests.'
    },
    {
      icon: FiAward,
      title: 'Track Progress',
      description: 'Monitor your learning journey with achievements, badges, and performance analytics.'
    },
    {
      icon: FiUsers,
      title: 'Community Support',
      description: 'Connect with peers, join study groups, and build meaningful relationships.'
    },
    {
      icon: FiTrendingUp,
      title: 'Career Guidance',
      description: 'Get guidance on internships, job placements, and professional development.'
    },
    {
      icon: FiCheckCircle,
      title: 'Mental Wellness',
      description: 'Access resources for stress management and mental health support.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      message: 'V-Assist helped me navigate my college journey with confidence. The personalized guidance was game-changing!',
      avatar: '👩‍🎓'
    },
    {
      name: 'Mike Chen',
      role: 'Business Major',
      message: 'The career guidance module helped me land my dream internship. Highly recommend!',
      avatar: '👨‍💼'
    },
    {
      name: 'Emma Wilson',
      role: 'Engineering Student',
      message: 'Best tool for college support. The AI is smart and the interface is super intuitive.',
      avatar: '👩‍🔬'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Students' },
    { number: '100+', label: 'Universities' },
    { number: '1M+', label: 'Questions Answered' },
    { number: '98%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="home-premium-container">
      {/* Hero Section */}
      <section className="hero-premium" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
        <div className="hero-background"></div>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Your AI-Powered University Companion</h1>
            <p className="hero-subtitle">
              Navigate your college journey with confidence. Get personalized guidance on admissions, academics, careers, and wellness.
            </p>
            
            <div className="hero-cta">
              <button className="btn btn-primary btn-lg">
                Get Started <FiArrowRight />
              </button>
              <button className="btn btn-secondary btn-lg">
                Learn More
              </button>
            </div>

            <div className="hero-stats">
              {stats.map((stat, idx) => (
                <div key={idx} className="hero-stat">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-text">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-card card-premium">
              <FiMessageCircle size={48} className="gradient-text" />
              <h3>Smart Chat</h3>
              <p>AI-powered conversations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-premium">
        <h2 className="section-title">Why Choose V-Assist?</h2>
        <div className="features-grid">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="feature-card card-premium hover-lift"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="feature-icon">
                  <Icon />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-premium">
        <h2 className="section-title">What Our Students Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="testimonial-card glass-card"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="testimonial-avatar">{testimonial.avatar}</div>
              <p className="testimonial-text">"{testimonial.message}"</p>
              <div className="testimonial-author">
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </div>
              <div className="testimonial-stars">
                {'★'.repeat(5)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-premium glass-card">
        <div className="cta-content">
          <h2>Ready to Transform Your University Experience?</h2>
          <p>Start your free trial today. No credit card required.</p>
          <div className="cta-buttons">
            <button className="btn btn-primary btn-lg">Start Free Trial</button>
            <button className="btn btn-secondary btn-lg">Schedule Demo</button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-premium">
        <div className="footer-content">
          <div className="footer-section">
            <h4>V-Assist</h4>
            <p>Your AI-powered university companion</p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#careers">Careers</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#privacy">Privacy</a></li>
              <li><a href="#terms">Terms</a></li>
              <li><a href="#security">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 V-Assist. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
