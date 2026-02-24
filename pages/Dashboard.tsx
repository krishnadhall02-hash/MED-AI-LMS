
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from '../components/HamburgerMenu';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [unreadNotifs] = useState(2);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quizAttempted, setQuizAttempted] = useState(false);
  const [isImageViewOpen, setIsImageViewOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem('user_cached_data');
    if (raw) setUserData(JSON.parse(raw));
    
    const attempted = localStorage.getItem('daily_quiz_attempted');
    if (attempted === 'true') {
      setQuizAttempted(true);
    }
  }, []);

  // Mock data for the "Today Image"
  const dailyImage = {
    url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200",
    caption: "Axial CT Brain: Hyperdense MCA Sign",
    description: "72yo male presents with sudden left-sided hemiplegia. Note the spontaneous high density in the right middle cerebral artery territory, indicative of acute thromboembolic occlusion.",
    tag: "Radiology • High Yield"
  };

  // Mock data for "Today's Flash"
  const dailyFlash = {
    title: "Today's Flash",
    concept: "Wernicke Encephalopathy is characterized by the classic triad: Ataxia, Ophthalmoplegia, and Confusion. It is caused by Thiamine (B1) deficiency, typically in chronic alcoholism. Remember: Administer Thiamine BEFORE Glucose to prevent worsening of the metabolic crisis.",
    tag: "Physiology • Neuro"
  };

  return (
    <div className="pb-40 min-h-screen relative overflow-x-hidden bg-synapse-light-bg">
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Header with standardized safe padding - DARK THEME */}
      <div className="bg-synapse-dark pt-12 px-8 pb-16 relative rounded-b-[40px] shadow-lg">
        <div className="absolute top-8 right-8 flex gap-3">
           <button 
             onClick={() => navigate('/notifications')}
             className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center text-white border border-white/10 relative active:scale-90 transition-all"
           >
              <i className="fa-solid fa-bell"></i>
              {unreadNotifs > 0 && (
                <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 bg-synapse-aqua text-synapse-deep text-[8px] font-black rounded-full flex items-center justify-center border-2 border-synapse-dark">
                  {unreadNotifs}
                </div>
              )}
           </button>
           <button 
             onClick={() => setIsMenuOpen(true)}
             className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center text-white border border-white/10 active:scale-90 transition-all"
           >
              <i className="fa-solid fa-bars"></i>
           </button>
        </div>
        <h1 className="text-4xl font-light text-white leading-tight tracking-tight uppercase">Ready,<br/><span className="font-black text-synapse-aqua tracking-tighter">Dr. {userData?.name?.split(' ')[1] || 'Sarah'}</span></h1>
      </div>

      <div className="px-5 space-y-8 pb-12 -mt-8">
        {/* Analytics Card */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black text-synapse-text-muted uppercase tracking-[0.2em]">Neural Analytics</h3>
          </div>
          <div onClick={() => navigate('/analytics')} className="bg-synapse-card-white rounded-samsung p-7 shadow-xl border border-slate-100 active:scale-[0.98] transition-all cursor-pointer space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-synapse-text-muted uppercase tracking-widest">Mastery Level</p>
                <p className="text-5xl font-black text-synapse-text-dark tracking-tighter">78%</p>
                <div className="flex items-center gap-1.5 text-synapse-aqua font-black text-[9px] uppercase tracking-widest pt-2">
                  <i className="fa-solid fa-bolt"></i>
                  <span>Accelerating Prep</span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[9px] font-black text-synapse-text-muted uppercase tracking-widest">Global Ranking</p>
                <p className="text-xl font-black text-synapse-text-dark">#1,242</p>
                <p className="text-[9px] font-black text-synapse-aqua uppercase">Top 2%</p>
              </div>
            </div>
            <div className="w-full h-12 flex items-end gap-2">
               {[40, 65, 45, 80, 55, 90, 78].map((h, i) => (
                 <div key={i} className={`flex-1 rounded-t-lg transition-all duration-700 ${i === 6 ? 'bg-synapse-aqua shadow-[0_0_15px_rgba(45,212,191,0.3)]' : 'bg-slate-100'}`} style={{ height: `${h}%` }} />
               ))}
            </div>
          </div>
        </div>

        {/* Daily Challenge (MCQ) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black text-synapse-text-muted uppercase tracking-[0.2em]">Daily Core</h3>
          </div>
          <div className="bg-synapse-card-white rounded-samsung p-6 border border-slate-100 shadow-lg relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer group">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-synapse-aqua/10 rounded-2xl flex items-center justify-center text-synapse-aqua text-3xl shadow-inner border border-synapse-aqua/20">
                <i className="fa-solid fa-microchip"></i>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-black text-synapse-text-dark leading-tight">Medpoint Synapse</h4>
                <p className="text-xs text-synapse-text-muted font-medium mt-1 leading-relaxed">
                  {quizAttempted ? 'Neural pathways strengthened. +20 Points earned.' : 'Connect your concepts. Solve today\'s high-yield clinical case.'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/daily-quiz')}
              className={`w-full h-14 mt-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border ${
                quizAttempted ? 'bg-transparent text-synapse-text-muted border-slate-200' : 'bg-synapse-dark text-white shadow-lg active:scale-95'
              }`}
            >
              {quizAttempted ? 'View Sync Summary' : 'Start Initialization'}
            </button>
          </div>
        </div>

        {/* Today Image Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black text-synapse-text-muted uppercase tracking-[0.2em]">Today Image</h3>
          </div>
          <div 
            onClick={() => setIsImageViewOpen(true)}
            className="bg-synapse-card-white rounded-samsung p-4 border border-slate-100 shadow-lg relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer group"
          >
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100">
              <img 
                src={dailyImage.url} 
                alt="Daily medical case" 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-synapse-dark/80 backdrop-blur-md border border-white/10 text-synapse-aqua text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  {dailyImage.tag}
                </span>
              </div>
            </div>
            <div className="mt-5 px-2 space-y-2">
              <h4 className="text-lg font-black text-synapse-text-dark leading-tight">{dailyImage.caption}</h4>
              <p className="text-xs text-synapse-text-muted font-medium line-clamp-1 leading-relaxed">
                {dailyImage.description}
              </p>
              <button className="w-full h-12 mt-2 bg-synapse-dark text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-synapse-surface transition-all">
                View Case
              </button>
            </div>
          </div>
        </div>

        {/* TODAY'S FLASH SECTION */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black text-synapse-text-muted uppercase tracking-[0.2em]">High Yield Flash</h3>
          </div>
          <div className="bg-synapse-card-white rounded-samsung p-6 border-l-4 border-synapse-aqua shadow-xl active:scale-[0.98] transition-all group">
             <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-black text-synapse-aqua uppercase tracking-[0.2em]">{dailyFlash.title}</h4>
                <div className="w-8 h-8 bg-synapse-aqua/10 rounded-lg flex items-center justify-center text-synapse-aqua border border-synapse-aqua/20">
                   <i className="fa-solid fa-bolt-lightning text-xs"></i>
                </div>
             </div>
             <div className="max-h-32 overflow-y-auto no-scrollbar mb-6">
                <p className="text-sm font-medium text-synapse-text-dark leading-relaxed">
                  {dailyFlash.concept}
                </p>
             </div>
             <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-[9px] font-black text-synapse-text-muted uppercase tracking-widest">{dailyFlash.tag}</span>
                <button className="text-synapse-aqua text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                   Read More <i className="fa-solid fa-chevron-right text-[8px]"></i>
                </button>
             </div>
          </div>
        </div>

        {/* Live Broadcast */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black text-synapse-text-muted uppercase tracking-[0.2em]">Live Stream</h3>
          </div>
          <div onClick={() => navigate('/live-list')} className="bg-synapse-dark rounded-samsung p-7 shadow-2xl relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer group border border-red-500/30">
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse" />
            <div className="flex justify-between items-start relative z-10 mb-6">
              <span className="bg-red-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest animate-pulse flex items-center gap-2">
                <i className="fa-solid fa-circle text-[6px]"></i> Broadcast
              </span>
              <div className="w-10 h-10 bg-white/5 text-white rounded-xl flex items-center justify-center border border-white/10">
                 <i className="fa-solid fa-satellite-dish"></i>
              </div>
            </div>
            <h4 className="text-xl font-black text-white leading-tight mb-2">Neuroanatomy Masterclass</h4>
            <p className="text-xs text-slate-400 font-medium mb-6">Dr. Anand Sharma • 1.2k Connected</p>
            <button className="w-full h-14 bg-white/10 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest active:bg-white/20 transition-all">
              Secure Join
            </button>
          </div>
        </div>
      </div>

      {/* FULL SCREEN IMAGE VIEWER OVERLAY */}
      {isImageViewOpen && (
        <div 
          className="fixed inset-0 z-[150] bg-black flex flex-col items-center justify-center p-0 animate-in fade-in duration-300"
        >
          {/* Header Controls */}
          <div className="absolute top-0 left-0 right-0 z-[160] px-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent" style={{ height: 'calc(var(--safe-area-top) + 40px)' }}>
            <button 
              onClick={() => setIsImageViewOpen(false)}
              className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            <div className="flex gap-4">
               <button className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white active:scale-90">
                 <i className="fa-solid fa-share-nodes"></i>
               </button>
            </div>
          </div>

          {/* Pinch-to-Zoom Image Container */}
          <div className="w-full h-full flex items-center justify-center overflow-auto touch-pinch-zoom no-scrollbar">
            <img 
              src={dailyImage.url} 
              alt="Zoomed clinical case" 
              className="w-full max-h-screen object-contain animate-in zoom-in duration-500"
              style={{ touchAction: 'pinch-zoom' }}
            />
          </div>

          {/* Description Overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-[160] p-10 bg-gradient-to-t from-black via-black/60 to-transparent space-y-4">
            <span className="bg-synapse-aqua text-synapse-deep text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest inline-block">
              {dailyImage.tag}
            </span>
            <h2 className="text-3xl font-black text-white leading-tight">{dailyImage.caption}</h2>
            <p className="text-sm font-medium text-slate-300 leading-relaxed max-w-[90%]">
              {dailyImage.description}
            </p>
            <div className="pt-6 border-t border-white/10 flex gap-4">
              <button className="flex-1 h-14 bg-synapse-aqua text-synapse-deep rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
                Add to Notes
              </button>
              <button className="w-14 h-14 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center text-white active:scale-95 transition-all">
                <i className="fa-solid fa-bookmark"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
