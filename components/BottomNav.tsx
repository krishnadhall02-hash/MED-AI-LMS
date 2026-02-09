
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: 'fa-house', label: 'Home' },
    { path: '/live-list', icon: 'fa-tower-broadcast', label: 'Live' },
    { path: '/practice', icon: 'fa-stethoscope', label: 'Practice' },
    { path: '/tutor', icon: 'fa-robot', label: 'AI Tutor' },
    { path: '/tracker', icon: 'fa-chart-simple', label: 'Status' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-oneui-footer-bg border-t border-black/5 px-2 pb-6 pt-2 flex justify-around items-center z-50 shadow-[0_-8px_20px_rgba(0,0,0,0.05)] backdrop-blur-md bg-opacity-95">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl transition-all duration-300 ${
              isActive ? 'text-slate-900' : 'text-slate-500'
            }`}
          >
            <div className={`w-12 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
              isActive ? 'bg-slate-900/10 shadow-inner' : ''
            }`}>
              <i className={`fa-solid ${item.icon} text-lg transition-transform ${isActive ? 'scale-110' : 'scale-100'}`}></i>
            </div>
            <span className={`text-[10px] tracking-tight uppercase transition-all ${isActive ? 'font-black' : 'font-bold opacity-70'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
