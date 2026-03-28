import React from 'react';

export default function Footer({ isDarkTheme }) {
  return (
    <footer className="text-light py-4 mt-5" style={{backgroundColor: isDarkTheme ? '#0F172A' : '#1F2937'}}>
      <div className="container-fluid">
        <div className="row mb-4">
          {/* About Section */}
          <div className="col-12 col-md-4 mb-3">
            <h6 className="fw-bold text-white">About V-Assist</h6>
            <p className="small" style={{color: '#D1D5DB'}}>
              V-Assist is an AI-powered student support system designed to help students navigate their university journey with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-12 col-md-4 mb-3">
            <h6 className="fw-bold text-white">Quick Links</h6>
            <ul className="list-unstyled small">
              <li><a href="#" className="text-decoration-none" style={{color: '#D1D5DB'}}>Privacy Policy</a></li>
              <li><a href="#" className="text-decoration-none" style={{color: '#D1D5DB'}}>Terms of Service</a></li>
              <li><a href="/contact" className="text-decoration-none" style={{color: '#D1D5DB'}}>Contact Us</a></li>
              <li><a href="#" className="text-decoration-none" style={{color: '#D1D5DB'}}>FAQ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-12 col-md-4 mb-3">
            <h6 className="fw-bold text-white">Contact</h6>
            <p className="small mb-1" style={{color: '#D1D5DB'}}>Email: support@vassist.edu</p>
            <p className="small mb-1" style={{color: '#D1D5DB'}}>Phone: +1 (555) 123-4567</p>
            <p className="small" style={{color: '#D1D5DB'}}>Available 24/7</p>
          </div>
        </div>

        <div className="border-top pt-3 text-center small" style={{borderColor: '#374151'}}>
          <p className="mb-0" style={{color: '#D1D5DB'}}>&copy; 2024 V-Assist - AI Student Support System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
