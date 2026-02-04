
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: 'fa-house', label: 'Dashboard' },
    { path: '/courses', icon: 'fa-book-medical', label: 'My Courses' },
    { path: '/practice', icon: 'fa-stethoscope', label: 'AI Practice' },
    { path: '/notes', icon: 'fa-file-lines', label: 'Study Notes' },
    { path: '/community', icon: 'fa-users', label: 'Community' },
    { path: '/analytics', icon: 'fa-chart-line', label: 'Analytics' },
    { path: '/planner', icon: 'fa-calendar-check', label: 'Study Planner' },
    { path: '/tutor', icon: 'fa-robot', label: 'AI Tutor' },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 fixed left-0 top-0 hidden lg:flex flex-col z-20">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
          <i className="fa-solid fa-staff-snake text-xl"></i>
        </div>
        <span className="text-xl font-bold tracking-tight text-indigo-900">MedAI Portal</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-600 font-semibold border-l-4 border-indigo-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5`}></i>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white">
          <p className="text-xs font-medium uppercase tracking-wider opacity-80 mb-1">Upgrade to Pro</p>
          <p className="text-sm font-bold mb-3">Get 2.5K+ MCQ Insights</p>
          <button className="w-full py-2 bg-white text-indigo-600 text-xs font-bold rounded-lg hover:bg-opacity-90 transition-colors">
            Go Premium
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
