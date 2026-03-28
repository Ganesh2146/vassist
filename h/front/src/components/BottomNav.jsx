import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiMessageSquare, FiLogOut, FiBarChart2, FiUser } from 'react-icons/fi';

export default function BottomNav({ onLogout, isAdmin = false }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  
  // Base classes for nav items to keep it clean
  const navItemClass = "d-flex flex-column align-items-center justify-content-center flex-grow-1 text-decoration-none transition-normal py-2 rounded-3";
  
  const getIconClass = (path) => `mb-1 transition-bounce ${isActive(path) ? 'text-primary' : 'text-muted'}`;
  const getLabelClass = (path) => `m-0 fw-bold transition-normal ${isActive(path) ? 'text-primary' : 'text-muted'}`;
  
  // Custom styles for active state scaling
  const getIconStyle = (path) => ({
    transform: isActive(path) ? 'scale(1.15) translateY(-2px)' : 'scale(1)',
  });

  const adminNav = (
    <nav className="fixed-bottom bg-glass-strong border-top border-subtle shadow-lg d-flex justify-content-around align-items-center w-100 d-md-none"
         style={{ minHeight: 'var(--bottom-nav-height)', zIndex: 1000 }}>
      <Link 
        to="/admin" 
        className={`${navItemClass} hover-bg-subtle mx-2`}
        title="Admin Dashboard"
      >
        <div className={getIconClass('/admin')} style={getIconStyle('/admin')}>
          <i className="fa-solid fa-chart-column fa-lg"></i>
        </div>
        <p className={getLabelClass('/admin')} style={{ fontSize: '12px' }}>Analytics</p>
      </Link>
      
      <button 
        onClick={onLogout} 
        className={`btn border-0 ${navItemClass} hover-bg-subtle mx-2`}
        title="Logout"
      >
        <div className="mb-1 text-muted transition-bounce">
          <i className="fa-solid fa-right-from-bracket fa-lg"></i>
        </div>
        <p className="m-0 fw-bold text-muted transition-normal" style={{ fontSize: '12px' }}>Logout</p>
      </button>
    </nav>
  );

  const userNav = (
    <nav className="fixed-bottom bg-glass-strong border-top border-subtle shadow-lg d-flex justify-content-around align-items-center w-100 px-2 d-md-none"
         style={{ minHeight: 'var(--bottom-nav-height)', zIndex: 1000 }}>
      <Link 
        to="/dashboard" 
        className={`${navItemClass} hover-bg-subtle mx-1`}
        title="Dashboard"
      >
        <div className={getIconClass('/dashboard')} style={getIconStyle('/dashboard')}>
          <i className="fa-solid fa-house fa-lg"></i>
        </div>
        <p className={getLabelClass('/dashboard')} style={{ fontSize: '11px' }}>Dashboard</p>
      </Link>

      <Link 
        to="/chat" 
        className={`${navItemClass} hover-bg-subtle mx-1`}
        title="Chat"
      >
        <div className={getIconClass('/chat')} style={getIconStyle('/chat')}>
          <i className="fa-solid fa-message fa-lg"></i>
        </div>
        <p className={getLabelClass('/chat')} style={{ fontSize: '11px' }}>Chat</p>
      </Link>

      <Link 
        to="/profile" 
        className={`${navItemClass} hover-bg-subtle mx-1`}
        title="Profile"
      >
        <div className={getIconClass('/profile')} style={getIconStyle('/profile')}>
          <i className="fa-solid fa-user fa-lg"></i>
        </div>
        <p className={getLabelClass('/profile')} style={{ fontSize: '11px' }}>Profile</p>
      </Link>

      <button 
        onClick={onLogout} 
        className={`btn border-0 ${navItemClass} hover-bg-subtle mx-1`}
        title="Logout"
      >
        <div className="mb-1 text-muted transition-bounce">
          <i className="fa-solid fa-right-from-bracket fa-lg"></i>
        </div>
        <p className="m-0 fw-bold text-muted transition-normal" style={{ fontSize: '11px' }}>Logout</p>
      </button>
    </nav>
  );

  return isAdmin ? adminNav : userNav;
}
