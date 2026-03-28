import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function Header({ onNavClick, isDarkTheme, toggleTheme }) {
  return (
    <header className={isDarkTheme ? 'dark-theme' : ''}>
      {/* Branding Header */}
      <div 
        className="text-white py-4 px-3"
        style={{
          background: isDarkTheme 
            ? 'linear-gradient(135deg, #0066FF 0%, #6366F1 100%)' 
            : 'linear-gradient(135deg, #0066FF 0%, #6366F1 100%)'
        }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div>
            <h1 className="mb-0 fw-800" style={{fontSize: '2.5rem', fontFamily: '"Poppins", sans-serif', fontWeight: 800}}>V-Assist</h1>
            <p className="mb-0 mt-1" style={{fontSize: '0.95rem', opacity: 0.95}}>AI-Powered Student Support</p>
          </div>
          <button
            onClick={toggleTheme}
            className="btn btn-light rounded-circle"
            style={{width: '50px', height: '50px'}}
            title={isDarkTheme ? 'Light Theme' : 'Dark Theme'}
          >
            {isDarkTheme ? <FiSun size={24} /> : <FiMoon size={24} />}
          </button>
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <nav className={isDarkTheme ? 'navbar navbar-dark' : 'navbar navbar-light'} style={{backgroundColor: isDarkTheme ? '#1F2937' : '#FFFFFF', borderBottom: `2px solid var(--primary-color)`}}>
        <div className="container-fluid d-flex gap-3">
          <button
            onClick={() => onNavClick('home')}
            className="btn fw-600"
            style={{
              backgroundColor: 'var(--primary-color)',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.6rem 1.5rem'
            }}
          >
            Home
          </button>
          <button
            onClick={() => onNavClick('chatbot')}
            className="btn fw-600"
            style={{
              backgroundColor: 'var(--secondary-color)',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.6rem 1.5rem'
            }}
          >
            Chat Bot
          </button>
        </div>
      </nav>
    </header>
  );
}
