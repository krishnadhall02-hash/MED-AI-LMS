
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from '../components/HamburgerMenu';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [unreadNotifs] = useState(2);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const recentRecordings = [
    { id: 'v1', title: 'Action Potential & Synapse', subject: 'Physiology', progress: 65, thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=400' },
    { id: 'v2', title: 'Glomerular Filtration', subject: 'Physiology', progress: 0, thumbnail: 'https://images.unsplash.com/photo-1579154235820-008107779b5c?auto=format&fit=crop&q=80&w=400', isNew: true },
  ];

  return (
    <div className="pb-32 bg-oneui-bg min-h-screen relative">
      {/* ☰ HAMBURGER MENU OVERLAY */}
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* One UI Large Header */}
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 bg-oneui-bg relative">
        <div className="absolute top-4 right-8 flex gap-3">
           {/* Notifications Button */}
           <button 
             onClick={() => navigate('/notifications')}
             className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 border border-slate-100 relative active:scale-90 transition-all"
           >
              <i className="fa-solid fa-bell"></i>
              {unreadNotifs > 0 && (
                <div className="absolute top-2.5 right-2.5 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  {unreadNotifs}
                </div>
              )}
           </button>

           {/* Hamburger Menu Trigger (PART A) */}
           <button 
             onClick={() => setIsMenuOpen(true)}
             className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-900 border border-slate-100 active:scale-90 transition-all"
           >
              <i className="fa-solid fa-bars"></i>
           </button>
        </div>
        <h1 className="text-4xl font-light text-slate-900 leading-tight">Good morning,<br/><span className="font-bold">Dr. Sarah</span></h1>
      </div>

      <div className="px-5 space-y-8 -mt-4">
        
        {/* PERFORMANCE ANALYTICS SECTION */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Performance Analytics</h3>
            <button onClick={() => navigate('/analytics')} className="text-[10px] font-black text-oneui-blue uppercase">View Details</button>
          </div>
          
          <div 
            onClick={() => navigate('/analytics')}
            className="bg-white rounded-samsung p-6 shadow-sm border border-slate-100 relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <p className="text-3xl font-black text-slate-900">78%</p>
                <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
                  <i className="fa-solid fa-arrow-trend-up"></i>
                  <span>+4.2% Trend</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rank</p>
                  <p className="font-black text-slate-900">#1,242</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Percentile</p>
                  <p className="font-black text-slate-900">98.4%</p>
                </div>
              </div>
            </div>

            <div className="flex items-end gap-1.5 h-12 mb-6">
               {[40, 65, 45, 80, 55, 90, 78].map((h, i) => (
                 <div 
                   key={i} 
                   className={`flex-1 rounded-t-sm transition-all duration-700 ${i === 6 ? 'bg-oneui-blue' : 'bg-slate-100 group-hover:bg-slate-200'}`} 
                   style={{ height: `${h}%` }}
                 />
               ))}
            </div>

            <button className="w-full h-12 bg-slate-50 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-100 flex items-center justify-center gap-2 group-hover:bg-oneui-blue group-hover:text-white transition-all group-hover:border-transparent">
              View Performance <i className="fa-solid fa-chevron-right text-[8px]"></i>
            </button>
          </div>
        </div>
        
        {/* LIVE CLASSES SECTION */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Ongoing Sessions</h3>
            <span className="text-[10px] font-black text-oneui-blue uppercase">Live Now</span>
          </div>
          
          <div 
            onClick={() => navigate('/live/1')}
            className="bg-white rounded-samsung p-6 shadow-xl border border-blue-100 relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-3xl animate-pulse" />
            <div className="flex justify-between items-start mb-4">
              <span className="bg-red-600 text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest animate-pulse">
                Live
              </span>
              <div className="w-10 h-10 bg-blue-50 text-oneui-blue rounded-full flex items-center justify-center">
                <i className="fa-solid fa-tower-broadcast"></i>
              </div>
            </div>
            <h4 className="text-xl font-black text-slate-900 leading-tight mb-2">Cranial Nerves & Foramina: The Deep Dive</h4>
            <button className="mt-4 w-full h-12 bg-oneui-blue text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100">
              Join Live Class
            </button>
          </div>
        </div>

        {/* RECORDED CLASSES SECTION */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recorded Classes</h3>
            <button onClick={() => navigate('/recorded-classes')} className="text-[10px] font-black text-oneui-blue uppercase">View All</button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-5 px-5">
            {recentRecordings.map((rec) => (
              <div 
                key={rec.id}
                onClick={() => navigate(`/video/${rec.id}`)}
                className="min-w-[280px] bg-white rounded-samsung overflow-hidden shadow-sm border border-slate-100 flex flex-col active:scale-95 transition-all cursor-pointer"
              >
                <div className="relative h-40">
                  <img src={rec.thumbnail} alt={rec.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {rec.isNew && <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">New</span>}
                    {rec.progress > 0 && <span className="bg-oneui-blue text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Watching</span>}
                  </div>
                  {rec.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div className="h-full bg-oneui-blue" style={{ width: `${rec.progress}%` }} />
                    </div>
                  )}
                </div>
                <div className="p-5 space-y-1">
                  <p className="text-[9px] font-black text-oneui-blue uppercase tracking-widest">{rec.subject}</p>
                  <h4 className="font-black text-slate-900 line-clamp-1">{rec.title}</h4>
                  <div className="flex justify-between items-center pt-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Continue Watching</p>
                    <i className="fa-solid fa-arrow-right text-[10px] text-slate-300"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4 pb-10">
          <div 
            onClick={() => navigate('/exam')}
            className="bg-white border border-slate-100 rounded-samsung p-5 shadow-sm flex flex-col justify-between h-40 tap-target active:scale-95 transition-all cursor-pointer"
          >
            <i className="fa-solid fa-file-invoice text-2xl text-oneui-blue"></i>
            <div>
              <p className="font-bold text-lg text-slate-800">Mock Exam</p>
              <p className="text-xs text-slate-400">Full Syllabus #1</p>
            </div>
          </div>
          <div 
            onClick={() => navigate('/practice')}
            className="bg-white rounded-samsung p-5 border border-slate-100 flex flex-col justify-between h-40 tap-target active:scale-95 transition-all cursor-pointer"
          >
            <i className="fa-solid fa-bolt text-2xl text-yellow-500"></i>
            <div>
              <p className="font-bold text-lg text-slate-800">Daily Quiz</p>
              <p className="text-xs text-slate-500">10 mins left</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
