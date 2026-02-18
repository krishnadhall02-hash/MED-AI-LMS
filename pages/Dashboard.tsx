
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from '../components/HamburgerMenu';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [unreadNotifs] = useState(2);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quizAttempted, setQuizAttempted] = useState(false);

  useEffect(() => {
    const attempted = localStorage.getItem('daily_quiz_attempted');
    if (attempted === 'true') {
      setQuizAttempted(true);
    }
  }, []);

  return (
    <div className="pb-40 min-h-screen relative overflow-x-hidden">
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Header with standardized safe padding */}
      <div className="pt-12 px-8 pb-8 relative">
        <div className="absolute top-8 right-8 flex gap-3">
           <button 
             onClick={() => navigate('/notifications')}
             className="w-12 h-12 bg-synapse-surface/50 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center text-oneui-text-primary border border-synapse-border relative active:scale-90 transition-all"
           >
              <i className="fa-solid fa-bell"></i>
              {unreadNotifs > 0 && (
                <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 bg-synapse-aqua text-synapse-deep text-[8px] font-black rounded-full flex items-center justify-center border-2 border-synapse-deep">
                  {unreadNotifs}
                </div>
              )}
           </button>
           <button 
             onClick={() => setIsMenuOpen(true)}
             className="w-12 h-12 bg-synapse-surface/50 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center text-oneui-text-primary border border-synapse-border active:scale-90 transition-all"
           >
              <i className="fa-solid fa-bars"></i>
           </button>
        </div>
        <h1 className="text-4xl font-light text-oneui-text-primary leading-tight tracking-tight">Syncing,<br/><span className="font-black text-synapse-aqua">Dr. Sarah</span></h1>
      </div>

      <div className="px-5 space-y-8 pb-12">
        {/* Analytics Card */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black text-oneui-text-muted uppercase tracking-[0.2em]">Neural Analytics</h3>
          </div>
          <div onClick={() => navigate('/analytics')} className="bg-synapse-surface/60 rounded-samsung p-7 shadow-2xl border border-synapse-border active:scale-[0.98] transition-all cursor-pointer space-y-6 backdrop-blur-sm">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-oneui-text-secondary uppercase tracking-widest">Mastery Level</p>
                <p className="text-5xl font-black text-oneui-text-primary tracking-tighter">78%</p>
                <div className="flex items-center gap-1.5 text-synapse-aqua font-black text-[9px] uppercase tracking-widest pt-2">
                  <i className="fa-solid fa-bolt"></i>
                  <span>Accelerating Prep</span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[9px] font-black text-oneui-text-muted uppercase tracking-widest">Global Ranking</p>
                <p className="text-xl font-black text-oneui-text-primary">#1,242</p>
                <p className="text-[9px] font-black text-synapse-aqua/60 uppercase">Top 2%</p>
              </div>
            </div>
            <div className="w-full h-12 flex items-end gap-2">
               {[40, 65, 45, 80, 55, 90, 78].map((h, i) => (
                 <div key={i} className={`flex-1 rounded-t-lg transition-all duration-700 ${i === 6 ? 'bg-synapse-aqua shadow-[0_0_15px_rgba(45,212,191,0.3)]' : 'bg-slate-800'}`} style={{ height: `${h}%` }} />
               ))}
            </div>
          </div>
        </div>

        {/* Daily Challenge */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black text-oneui-text-muted uppercase tracking-[0.2em]">Daily Core</h3>
          </div>
          <div className="bg-synapse-surface/40 rounded-samsung p-6 border border-synapse-border relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer group backdrop-blur-md">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-synapse-aqua/10 rounded-2xl flex items-center justify-center text-synapse-aqua text-3xl shadow-inner border border-synapse-aqua/20">
                <i className="fa-solid fa-microchip"></i>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-black text-oneui-text-primary leading-tight">Today's Synapse</h4>
                <p className="text-xs text-oneui-text-secondary font-medium mt-1 leading-relaxed">
                  {quizAttempted ? 'Neural pathways strengthened. +20 Points earned.' : 'Connect your concepts. Solve today\'s high-yield clinical case.'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/daily-quiz')}
              className={`w-full h-14 mt-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border ${
                quizAttempted ? 'bg-transparent text-oneui-text-muted border-oneui-border' : 'bg-synapse-aqua text-synapse-deep shadow-[0_0_20px_rgba(45,212,191,0.2)] active:scale-95'
              }`}
            >
              {quizAttempted ? 'View Sync Summary' : 'Start Initialization'}
            </button>
          </div>
        </div>

        {/* Live Broadcast */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black text-oneui-text-muted uppercase tracking-[0.2em]">Live Stream</h3>
          </div>
          <div onClick={() => navigate('/live-list')} className="bg-synapse-deep rounded-samsung p-7 shadow-2xl relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer group border border-red-500/30">
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse" />
            <div className="flex justify-between items-start relative z-10 mb-6">
              <span className="bg-red-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest animate-pulse flex items-center gap-2">
                <i className="fa-solid fa-circle text-[6px]"></i> Broadcast
              </span>
              <div className="w-10 h-10 bg-white/5 text-oneui-text-primary rounded-xl flex items-center justify-center border border-white/10">
                 <i className="fa-solid fa-satellite-dish"></i>
              </div>
            </div>
            <h4 className="text-xl font-black text-oneui-text-primary leading-tight mb-2">Neuroanatomy Masterclass</h4>
            <p className="text-xs text-oneui-text-secondary font-medium mb-6">Dr. Anand Sharma • 1.2k Connected</p>
            <button className="w-full h-14 bg-white/10 text-oneui-text-primary border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest active:bg-white/20 transition-all">
              Secure Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
