
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
    <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-oneui-surface/80 backdrop-blur-xl border-t border-oneui-border px-2 pb-6 pt-2 flex justify-around items-center z-50 shadow-[0_-1px_10px_rgba(0,0,0,0.02)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all ${
              isActive ? 'text-oneui-blue' : 'text-oneui-text-secondary'
            }`}
          >
            <div className={`w-12 h-8 flex items-center justify-center rounded-full transition-all ${
              isActive ? 'bg-blue-50' : ''
            }`}>
              <i className={`fa-solid ${item.icon} text-lg`}></i>
            </div>
            <span className="text-[10px] font-bold tracking-tight uppercase">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
