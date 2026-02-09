
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from '../components/HamburgerMenu';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [unreadNotifs] = useState(2);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quizAttempted, setQuizAttempted] = useState(false);
  const [hasLiveClass] = useState(true);

  useEffect(() => {
    const attempted = localStorage.getItem('daily_quiz_attempted');
    if (attempted === 'true') {
      setQuizAttempted(true);
    }
  }, []);

  const recentRecordings = [
    { id: 'v1', title: 'Action Potential & Synapse', subject: 'Physiology', progress: 65, thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=400' },
    { id: 'v2', title: 'Glomerular Filtration', subject: 'Physiology', progress: 0, thumbnail: 'https://images.unsplash.com/photo-1579154235820-008107779b5c?auto=format&fit=crop&q=80&w=400', isNew: true },
    { id: 'v3', title: 'Renal Hormones', subject: 'Physiology', progress: 30, thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400' },
  ];

  const testimonials = [
    {
      id: 't1',
      name: 'Dr. Ananya Iyer',
      exam: 'NEET PG 2025',
      text: "The AI Tutor's mnemonics for Pharmacology literally saved my prep. Best tool for quick revision!",
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?u=ananya'
    },
    {
      id: 't2',
      name: 'Dr. Vikram Singh',
      exam: 'INI-CET Aspirant',
      text: "Analytics helped me realize my Anatomy was strong but Pathology needed work. Gained 4% in 2 weeks!",
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?u=vikram'
    }
  ];

  return (
    <div className="pb-32 bg-oneui-bg min-h-screen relative overflow-x-hidden">
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* SECTION 1: GREETING & HEADER */}
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 bg-oneui-bg relative">
        <div className="absolute top-4 right-8 flex gap-3">
           <button 
             onClick={() => navigate('/notifications')}
             className="w-12 h-12 bg-oneui-surface rounded-full shadow-sm flex items-center justify-center text-oneui-text-secondary border border-oneui-border relative active:scale-90 transition-all"
           >
              <i className="fa-solid fa-bell"></i>
              {unreadNotifs > 0 && (
                <div className="absolute top-2.5 right-2.5 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  {unreadNotifs}
                </div>
              )}
           </button>
           <button 
             onClick={() => setIsMenuOpen(true)}
             className="w-12 h-12 bg-oneui-surface rounded-full shadow-sm flex items-center justify-center text-oneui-text-primary border border-oneui-border active:scale-90 transition-all"
           >
              <i className="fa-solid fa-bars"></i>
           </button>
        </div>
        <h1 className="text-4xl font-light text-oneui-text-primary leading-tight">Good morning,<br/><span className="font-bold">Dr. Sarah</span></h1>
      </div>

      <div className="px-5 space-y-8 -mt-4 pb-12">
        
        {/* SECTION 2: PERFORMANCE ANALYSIS (REORDERED: NOW ABOVE MCQ) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xs font-black text-oneui-text-secondary uppercase tracking-widest">Performance Analysis</h3>
          </div>
          <div onClick={() => navigate('/analytics')} className="bg-oneui-surface rounded-samsung p-7 shadow-sm border border-oneui-border active:scale-[0.98] transition-all cursor-pointer space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-oneui-text-secondary uppercase tracking-widest">Overall Accuracy</p>
                <p className="text-4xl font-black text-oneui-text-primary tracking-tighter">78%</p>
                <div className="flex items-center gap-1.5 text-emerald-500 font-black text-[9px] uppercase tracking-widest pt-1">
                  <i className="fa-solid fa-arrow-trend-up"></i>
                  <span>+4.2% This Week</span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[9px] font-black text-oneui-text-secondary uppercase tracking-widest">Percentile</p>
                <p className="text-xl font-black text-oneui-blue">98.4%</p>
                <p className="text-[9px] font-black text-slate-300 uppercase">Rank #1,242</p>
              </div>
            </div>
            <div className="w-full h-12 flex items-end gap-1.5">
               {[40, 65, 45, 80, 55, 90, 78].map((h, i) => (
                 <div key={i} className={`flex-1 rounded-t-lg transition-all duration-700 ${i === 6 ? 'bg-oneui-blue shadow-lg shadow-blue-50' : 'bg-slate-100'}`} style={{ height: `${h}%` }} />
               ))}
            </div>
            <button className="w-full py-2 text-[10px] font-black text-oneui-blue uppercase tracking-widest text-center border-t border-oneui-border pt-4">
              View Detailed Analysis <i className="fa-solid fa-chevron-right ml-1"></i>
            </button>
          </div>
        </div>

        {/* SECTION 3: TODAY'S MCQ (DAILY CHALLENGE) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xs font-black text-oneui-text-secondary uppercase tracking-widest">Daily Challenge</h3>
            <span className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest border transition-colors ${quizAttempted ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
               {quizAttempted ? 'Attempted' : 'Not Attempted'}
            </span>
          </div>
          
          <div className="bg-oneui-surface rounded-samsung p-6 shadow-sm border border-oneui-border relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer group">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 text-3xl shadow-inner relative shrink-0">
                <i className="fa-solid fa-trophy"></i>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-oneui-blue text-white rounded-full flex items-center justify-center text-[8px] font-black border-2 border-white">
                  $
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-black text-oneui-text-primary leading-tight tracking-tight">Today's MCQ</h4>
                <p className="text-xs text-oneui-text-secondary font-medium mt-1 leading-relaxed">
                  {quizAttempted 
                    ? 'Great job! You earned +20 points for today. Check your scholarship ranking.' 
                    : 'Solve today\'s high-yield clinical case and climb the Monthly Scholarship leaderboard.'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/daily-quiz')}
              className={`w-full h-14 mt-6 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
                quizAttempted 
                ? 'bg-slate-50 text-slate-500 border border-oneui-border' 
                : 'bg-oneui-blue text-white shadow-lg shadow-blue-100'
              }`}
            >
              {quizAttempted ? 'View Result' : 'Start Quiz'}
            </button>
          </div>
        </div>

        {/* SECTION 4: ONGOING SESSIONS */}
        {hasLiveClass && (
          <div className="space-y-4 animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xs font-black text-oneui-text-secondary uppercase tracking-widest">Ongoing Session</h3>
            </div>
            <div 
              onClick={() => navigate('/live-list')}
              className="bg-slate-900 rounded-samsung p-7 shadow-2xl relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse" />
              <div className="flex justify-between items-start relative z-10 mb-6">
                <div className="flex flex-col gap-1">
                  <span className="w-fit bg-red-600 text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest animate-pulse flex items-center gap-1.5 shadow-lg">
                    <i className="fa-solid fa-circle text-[6px]"></i> Live Now
                  </span>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-2">Associate Professor</p>
                </div>
                <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md">
                   <i className="fa-solid fa-tower-broadcast"></i>
                </div>
              </div>
              <h4 className="text-xl font-black text-white leading-tight tracking-tight mb-2 relative z-10">Cranial Nerves & Foramina:<br/>The Deep Dive</h4>
              <p className="text-xs text-white/60 font-medium mb-6 relative z-10">Dr. Anand Sharma • 1,240 Watching</p>
              <button className="w-full h-14 bg-oneui-blue text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-500/20 active:bg-blue-500 transition-colors">
                Join Live Class
              </button>
            </div>
          </div>
        )}

        {/* SECTION 5: RECORDED CLASSES */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xs font-black text-oneui-text-secondary uppercase tracking-widest">Recently Recorded</h3>
            <button onClick={() => navigate('/recorded-classes')} className="text-[10px] font-black text-oneui-blue uppercase">View All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-1">
            {recentRecordings.map((rec) => (
              <div 
                key={rec.id}
                onClick={() => navigate(`/video/${rec.id}`)}
                className="min-w-[240px] bg-oneui-surface rounded-[24px] border border-oneui-border overflow-hidden shadow-sm active:scale-[0.98] transition-all cursor-pointer group"
              >
                <div className="relative h-32">
                  <img src={rec.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={rec.title} />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <i className="fa-solid fa-play text-white text-2xl"></i>
                  </div>
                  {rec.isNew && (
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">NEW</span>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h5 className="font-black text-sm text-oneui-text-primary line-clamp-1 leading-tight">{rec.title}</h5>
                    <p className="text-[10px] font-bold text-oneui-text-secondary mt-1">{rec.subject}</p>
                  </div>
                  {rec.progress > 0 && (
                    <div className="space-y-1.5">
                       <div className="flex justify-between text-[8px] font-black text-oneui-text-secondary uppercase">
                          <span>Continue Watching</span>
                          <span>{rec.progress}%</span>
                       </div>
                       <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-oneui-blue" style={{ width: `${rec.progress}%` }} />
                       </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6: TESTIMONIALS */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xs font-black text-oneui-text-secondary uppercase tracking-widest">Student Stories</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-1">
            {testimonials.map((t) => (
              <div 
                key={t.id}
                className="min-w-[300px] bg-white p-6 rounded-samsung border border-oneui-border shadow-sm flex flex-col justify-between italic"
              >
                <p className="text-sm text-oneui-text-primary leading-relaxed font-medium mb-6">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} className="w-10 h-10 rounded-full shadow-sm border border-slate-50" alt={t.name} />
                  <div>
                    <h5 className="text-[11px] font-black text-oneui-text-primary not-italic">{t.name}</h5>
                    <p className="text-[9px] font-bold text-oneui-text-secondary uppercase tracking-widest not-italic">{t.exam}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER INFO */}
        <div className="text-center py-8 opacity-20">
           <p className="text-[9px] font-black text-oneui-text-secondary uppercase tracking-[0.2em]">MedAI LMS Platform v2.4.0</p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
