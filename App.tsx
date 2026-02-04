
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Practice from './pages/Practice';
import AITutorPanel from './components/AITutorPanel';

const App: React.FC = () => {
  return (
    <Router>
      <div className="mobile-frame flex flex-col">
        {/* Top Status Bar Simulation */}
        <div className="sticky top-0 z-50 px-6 py-3 flex justify-between items-center text-slate-800 bg-oneui-bg">
          <span className="font-bold text-sm">9:41</span>
          <div className="flex gap-2 text-xs">
            <i className="fa-solid fa-signal"></i>
            <i className="fa-solid fa-wifi"></i>
            <i className="fa-solid fa-battery-full"></i>
          </div>
        </div>

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/tutor" element={<AITutorPanel />} />
            <Route path="/analytics" element={
              <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
                 <h1 className="text-4xl font-light text-slate-900 leading-tight">My<br/><span className="font-bold">Analytics</span></h1>
                 <p className="mt-10 text-slate-400 font-medium">Coming soon in next update.</p>
              </div>
            } />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </Router>
  );
};

export default App;
