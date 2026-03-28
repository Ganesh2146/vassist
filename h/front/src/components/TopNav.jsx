import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiBell, FiMenu, FiSun, FiMoon, FiLogOut } from 'react-icons/fi';

export default function TopNav({ onToggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = JSON.parse(localStorage.getItem('userData') || '{}');
  const userEmail = storedUser.email || 'student@vassist.edu';
  const userName = storedUser.first_name ? `${storedUser.first_name} ${storedUser.last_name}` : (localStorage.getItem('userName') || 'User');
  const profilePhoto = storedUser.profile_photo_url || null;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  const navLinks = [
    { path: '/dashboard', label: 'Work' }, /* Changed to Work to match screenshot loosely, or keep Dashboard? User wants "in this style... matching colors" */
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/chat', label: 'Chat' },
    { path: '/profile', label: 'Profile' }
  ];

  const [theme, setTheme] = useState(localStorage.getItem('uiTheme') || 'light');

  // Apply theme to HTML root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('uiTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    window.location.href = '/login';
  };

  const storedUserType = localStorage.getItem('userType') || 'student';
  const actualNavLinks = storedUserType === 'admin' 
    ? [ { path: '/admin', label: 'Admin Console' } ]
    : storedUserType === 'counselor'
    ? [
        { path: '/counselor-bookings', label: 'My Bookings' },
        { path: '/chat', label: 'Chat' },
        { path: '/profile', label: 'Profile' }
      ]
    : [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/chat', label: 'Chat' },
        { path: '/profile', label: 'Profile' }
      ];

  return (
    <div className="position-fixed top-0 start-0 end-0 z-3 pt-2 pt-sm-3 px-2 px-sm-3 w-100" style={{ pointerEvents: 'none', zIndex: 100 }}>
      {/* Dark Pill Navbar Container */}
      <header className="mx-auto shadow-lg d-flex justify-content-between align-items-center px-1 py-1 px-sm-2 py-sm-2" 
              style={{ width: '100%', maxWidth: '850px', borderRadius: '50px', pointerEvents: 'auto', backgroundColor: 'rgba(26, 26, 26, 0.95)', border: '1px solid rgba(255,255,255, 0.08)', backdropFilter: 'blur(10px)' }}>
        
        {/* Left: Logo/Avatar & Sidebar Toggle */}
        <div className="d-flex align-items-center gap-1 gap-sm-2">
          {onToggleSidebar && (
            <button onClick={onToggleSidebar} className="btn btn-icon-only text-white d-md-none bg-white bg-opacity-10 rounded-circle ms-1" style={{ width: '32px', height: '32px', padding: '0' }}>
              <i className="fa-solid fa-bars"></i>
            </button>
          )}
          
          <div className="rounded-circle d-flex align-items-center justify-content-center bg-white text-dark shadow-sm fw-bold ms-1"
               style={{
                 width: '36px', height: '36px', fontSize: '14px',
                 backgroundImage: profilePhoto ? `url(${profilePhoto})` : 'none',
                 backgroundSize: 'cover', backgroundPosition: 'center',
                 border: '2px solid white'
               }}>
            {!profilePhoto && getInitials(userName)}
          </div>
          <h3 className="mb-0 fw-bold text-white d-none d-lg-block ms-1 me-2" style={{ letterSpacing: '0.5px', fontSize: '15px' }}>V-Assist</h3>
        </div>

        {/* Center Links (Mobile and Desktop) */}
        <div className="d-flex align-items-center gap-0 gap-sm-1 flex-grow-1 justify-content-center">
          {actualNavLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button 
                key={link.path}
                onClick={() => navigate(link.path)} 
                className={`btn btn-link text-decoration-none fw-medium px-2 px-sm-3 px-md-4 py-1 py-sm-2 rounded-pill transition-normal border-0 ${isActive ? 'text-white flex-grow-0' : 'text-white text-opacity-50'}`}
                style={{
                   backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                   boxShadow: 'none',
                   fontSize: 'clamp(12px, 2.5vw, 15px)',
                   whiteSpace: 'nowrap',
                   minWidth: 'fit-content'
                }}
                onMouseOver={(e) => { if(!isActive) e.target.style.color = 'white'; e.target.style.backgroundColor = 'rgba(255,255,255,0.05)' }}
                onMouseOut={(e) => { if(!isActive) e.target.style.color = 'rgba(255,255,255,0.5)'; e.target.style.backgroundColor = 'transparent' }}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Right Action / Email pill */}
        <div className="d-flex align-items-center pe-1">
          <div className="bg-white text-dark fw-bold px-3 px-sm-4 py-1 py-sm-2 rounded-pill shadow-sm transition-normal cursor-pointer text-truncate me-1" 
               style={{ maxWidth: '120px', fontSize: 'clamp(11px, 2vw, 14px)', letterSpacing: '0.2px' }} 
               title={userEmail}
               onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
               onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
            {userEmail || 'student@vassist.edu'}
          </div>
          <button onClick={toggleTheme} className="btn btn-icon-only text-white bg-white bg-opacity-10 rounded-circle me-1 transition-normal" style={{ width: '36px', height: '36px', padding: '0' }} title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
            {theme === 'light' ? <i className="fa-solid fa-moon"></i> : <i className="fa-solid fa-sun"></i>}
          </button>
          <button onClick={handleLogout} className="btn btn-icon-only text-white bg-danger bg-opacity-75 rounded-circle hover-scale transition-normal" style={{ width: '36px', height: '36px', padding: '0' }} title="Logout">
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </header>
    </div>
  );
}
