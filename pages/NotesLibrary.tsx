
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_NOTES = [
  { id: 'n1', title: 'Cranial Nerves: Origin & Exit', subject: 'Anatomy', topic: 'Neuroanatomy', size: '2.4 MB', downloaded: true, tag: 'AN1.1', isPremium: false },
  { id: 'n2', title: 'Autonomic Nervous System Pharma', subject: 'Pharmacology', topic: 'ANS', size: '1.8 MB', downloaded: false, tag: 'PH2.4', isPremium: true },
  { id: 'n3', title: 'Acid-Base Disorders Review', subject: 'Medicine', topic: 'Renal', size: '3.1 MB', downloaded: true, tag: 'MED8.2', isPremium: false },
];

const NotesLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [showUpgradeNudge, setShowUpgradeNudge] = useState(false);

  const handleDownload = (e: React.MouseEvent, isPremium: boolean) => {
    e.stopPropagation();
    if (isPremium) {
      setShowUpgradeNudge(true);
    } else {
      // Simulate download
      alert("Download started...");
    }
  };

  return (
    <div className="pb-40 bg-oneui-bg min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <h1 className="text-4xl font-light text-slate-900 leading-tight">Study<br/><span className="font-bold">Materials</span></h1>
      </div>

      <div className="px-5 space-y-6 -mt-4">
        {/* Upgrade Banner for Free Users */}
        <div className="bg-gradient-to-br from-indigo-600 to-oneui-blue p-6 rounded-[28px] text-white flex items-center gap-5 shadow-xl shadow-blue-100">
           <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl backdrop-blur-md">
              <i className="fa-solid fa-crown"></i>
           </div>
           <div className="flex-1">
              <h4 className="font-bold text-sm">Download Pro Notes</h4>
              <p className="text-[10px] font-medium opacity-80 uppercase tracking-widest">Unlock 500+ PDF High-Yields</p>
           </div>
           <button 
             onClick={() => setShowUpgradeNudge(true)}
             className="bg-white text-oneui-blue px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
           >
             Go Pro
           </button>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-2">
           <div className="flex-1 h-14 bg-white rounded-2xl border border-slate-100 shadow-sm px-5 flex items-center gap-3">
              <i className="fa-solid fa-magnifying-glass text-slate-300"></i>
              <input type="text" placeholder="Search notes..." className="bg-transparent border-none flex-1 focus:outline-none font-medium text-sm" />
           </div>
           <button className="w-14 h-14 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-400">
              <i className="fa-solid fa-sliders"></i>
           </button>
        </div>

        {/* Notes Grid */}
        <div className="space-y-4">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Recently Accessed</h3>
           <div className="space-y-3">
              {MOCK_NOTES.map(note => (
                <div 
                  key={note.id} 
                  onClick={() => navigate(`/notes/${note.id}`)}
                  className="bg-white p-5 rounded-samsung border border-slate-100 shadow-sm flex items-center gap-5 active:scale-95 transition-all cursor-pointer group"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl text-slate-400 group-hover:bg-blue-50 group-hover:text-oneui-blue transition-all`}>
                     <i className="fa-solid fa-file-pdf"></i>
                  </div>
                  <div className="flex-1 space-y-1">
                     <div className="flex items-center gap-2">
                        <span className="bg-blue-50 text-oneui-blue text-[9px] font-black uppercase px-2 py-0.5 rounded border border-blue-100">
                           {note.tag}
                        </span>
                        {note.isPremium && (
                           <span className="bg-amber-50 text-amber-600 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-amber-100">
                              PRO
                           </span>
                        )}
                        <span className="text-[10px] font-bold text-slate-400">{note.size}</span>
                     </div>
                     <h4 className={`font-black text-slate-900 leading-tight ${note.isPremium ? 'text-slate-500' : ''}`}>{note.title}</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{note.subject} • {note.topic}</p>
                  </div>
                  <button 
                    onClick={(e) => handleDownload(e, note.isPremium)}
                    className="flex flex-col items-center gap-2 active:scale-90 transition-all"
                  >
                     {note.isPremium ? (
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                           <i className="fa-solid fa-lock text-xs"></i>
                        </div>
                     ) : note.downloaded ? (
                        <i className="fa-solid fa-circle-check text-emerald-500 text-lg"></i>
                     ) : (
                        <i className="fa-solid fa-arrow-down-to-line text-slate-200 text-lg hover:text-oneui-blue"></i>
                     )}
                  </button>
                </div>
              ))}
           </div>
        </div>

        {/* Upgrade Modal for restrictions */}
        {showUpgradeNudge && (
          <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="absolute inset-0" onClick={() => setShowUpgradeNudge(false)} />
             <div className="bg-white rounded-t-[40px] w-full max-w-[430px] mx-auto p-8 shadow-2xl animate-in slide-in-from-bottom duration-500 relative z-10">
                <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
                <div className="text-center space-y-6">
                   <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full mx-auto flex items-center justify-center text-4xl shadow-inner">
                      <i className="fa-solid fa-circle-arrow-down"></i>
                   </div>
                   <div className="space-y-2">
                      <h2 className="text-2xl font-black text-slate-900">Offline Access Locked</h2>
                      <p className="text-sm text-slate-500 font-medium px-8 leading-relaxed">
                        Downloading notes for offline revision is a Pro feature. Upgrade your plan to study anywhere, even without internet.
                      </p>
                   </div>
                   <button className="w-full h-16 bg-slate-900 text-white rounded-samsung font-black text-lg shadow-xl shadow-slate-200 active:scale-95 transition-all">
                      Unlock Offline Notes
                   </button>
                   <button onClick={() => setShowUpgradeNudge(false)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Go Back</button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesLibrary;
