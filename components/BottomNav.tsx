
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: 'fa-house', label: 'Home' },
    { path: '/live-list', icon: 'fa-tower-broadcast', label: 'Live' },
    { path: '/practice', icon: 'fa-square-check', label: 'Practice' },
    { path: '/tutor', icon: 'fa-robot', label: 'AI Core' },
    { path: '/tracker', icon: 'fa-chart-simple', label: 'Tracker' },
  ];

  return (
    <nav 
      className="shrink-0 max-w-[430px] mx-auto bg-white border-t border-synapse-border-soft px-2 pt-2 flex justify-around items-start z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]"
      style={{ 
        height: 'calc(80px + var(--safe-area-bottom))', 
        paddingBottom: 'var(--safe-area-bottom)' 
      }}
      aria-label="Main Navigation"
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`Navigate to ${item.label}`}
            className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl transition-all duration-500 ${
              isActive ? 'text-synapse-blue-primary' : 'text-slate-400'
            }`}
          >
            <div className={`w-12 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
              isActive ? 'bg-synapse-blue-primary/10' : ''
            }`}>
              <i className={`fa-solid ${item.icon} text-lg transition-transform ${isActive ? 'scale-110' : 'scale-100 opacity-60'}`}></i>
            </div>
            <span className={`text-[9px] tracking-widest uppercase transition-all ${isActive ? 'font-black' : 'font-bold'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
