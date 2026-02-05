
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { VideoNote } from '../types';

const VideoPlayer: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // UI States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(2722); // ~45 mins
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showControls, setShowControls] = useState(true);
  const [securityAlert, setSecurityAlert] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  
  // Anti-Piracy Watermark State
  const [watermarkPos, setWatermarkPos] = useState({ x: 10, y: 10 });
  const [notes, setNotes] = useState<VideoNote[]>([
    { id: '1', timestamp: 45, text: 'Nerve origin overview' },
    { id: '2', timestamp: 820, text: 'Clinical: Facial Palsy' }
  ]);

  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. DRM Security Simulation (1.4A/B)
  useEffect(() => {
    // Watermark dance to prevent cam-recording
    const interval = setInterval(() => {
      setWatermarkPos({ x: Math.random() * 70 + 5, y: Math.random() * 80 + 5 });
    }, 4000);

    // Visibility-based protection
    const handleVisibility = () => {
      if (document.hidden) {
        setIsPlaying(false);
        setSecurityAlert(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const note: VideoNote = { id: Date.now().toString(), timestamp: currentTime, text: newNote };
    setNotes([...notes, note].sort((a, b) => a.timestamp - b.timestamp));
    setNewNote('');
    setIsAddingNote(false);
  };

  const resetControls = () => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => isPlaying && setShowControls(false), 3000);
  };

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden relative select-none">
      
      {/* 2. DYNAMIC WATERMARK (Anti-Piracy 1.4B) */}
      <div 
        className="fixed z-50 pointer-events-none opacity-10 text-[10px] font-black text-white whitespace-nowrap transition-all duration-1000 ease-in-out"
        style={{ left: `${watermarkPos.x}%`, top: `${watermarkPos.y}%` }}
      >
        STUDENT_ID: MED-SARAH-9421 • IP: 192.168.1.1
      </div>

      {/* 3. SECURITY OVERLAY (1.4B) */}
      {securityAlert && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-3xl flex items-center justify-center p-8 text-center animate-in fade-in duration-300">
          <div className="bg-white rounded-samsung p-10 max-w-[340px] space-y-6 shadow-2xl">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full mx-auto flex items-center justify-center text-4xl shadow-inner">
               <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div className="space-y-2">
               <h2 className="text-2xl font-black text-slate-900">Privacy Active</h2>
               <p className="text-sm text-slate-500 font-medium leading-relaxed">Content playback is paused while the app is in background or external screen is active.</p>
            </div>
            <button 
              onClick={() => setSecurityAlert(false)}
              className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
            >
              Resume Session
            </button>
          </div>
        </div>
      )}

      {/* 4. IMMERSIVE VIDEO AREA */}
      <div 
        className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden touch-none"
        onClick={resetControls}
      >
        <img 
          src="https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1200" 
          className={`w-full h-full object-cover transition-all duration-1000 ${securityAlert ? 'blur-3xl' : 'opacity-60'}`}
          alt="Lecture Video"
        />
        
        {/* Controls Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-6 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex justify-between items-start">
            <button onClick={() => navigate(-1)} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/10 active:scale-90 transition-all">
               <i className="fa-solid fa-chevron-left"></i>
            </button>
            <div className="flex flex-col items-end gap-2">
               <span className="bg-oneui-blue text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-lg">QHD+ Clarity</span>
               <span className="text-[10px] font-bold text-white/60">Playback: {playbackSpeed}x</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
             <div className="flex items-center gap-14">
                <button className="text-white text-2xl opacity-40 hover:opacity-100 active:scale-90 transition-all"><i className="fa-solid fa-backward-10"></i></button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); resetControls(); }}
                  className="w-20 h-20 bg-white text-slate-900 rounded-full flex items-center justify-center text-3xl shadow-2xl active:scale-90 transition-all"
                >
                   <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play ml-1'}`}></i>
                </button>
                <button className="text-white text-2xl opacity-40 hover:opacity-100 active:scale-90 transition-all"><i className="fa-solid fa-forward-10"></i></button>
             </div>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between text-[10px] font-black text-white/60 uppercase tracking-widest">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
             </div>
             <div className="relative h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-oneui-blue transition-all" style={{ width: `${(currentTime/duration)*100}%` }} />
             </div>
             <div className="flex justify-between items-center">
                <div className="flex gap-4">
                   <button 
                     onClick={(e) => { e.stopPropagation(); setPlaybackSpeed(playbackSpeed >= 2 ? 0.5 : playbackSpeed + 0.25); resetControls(); }}
                     className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/10 active:bg-white/20"
                   >
                     {playbackSpeed}x Speed
                   </button>
                </div>
                <button className="text-white text-xl opacity-60 hover:opacity-100"><i className="fa-solid fa-expand"></i></button>
             </div>
          </div>
        </div>
      </div>

      {/* 5. METADATA & INTERACTIVE LAYER */}
      <div className="flex-1 bg-white rounded-t-[40px] -mt-10 relative z-10 p-8 pt-10 space-y-8 overflow-y-auto shadow-[0_-15px_40px_rgba(0,0,0,0.1)]">
        <div className="space-y-3">
          <div className="flex gap-2">
             <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-100">Renal Physiology</span>
             <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Archive</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 leading-tight">Glomerular Filtration Dynamics: Part II</h1>
          <p className="text-sm font-medium text-slate-500">Dr. Sarah Johnson • 45m Lecture • QHD+</p>
        </div>

        {/* Action Bar */}
        <div className="grid grid-cols-2 gap-4">
           <button 
             onClick={() => { setIsAddingNote(true); setIsNotesOpen(true); }}
             className="bg-oneui-blue p-5 rounded-samsung text-white shadow-xl shadow-blue-100 flex flex-col gap-3 active:scale-95 transition-all"
           >
              <i className="fa-solid fa-plus-circle text-xl"></i>
              <p className="text-[10px] font-black uppercase tracking-widest">Add Timestamp Note</p>
           </button>
           <button 
             onClick={() => setIsNotesOpen(true)}
             className="bg-white border border-slate-100 p-5 rounded-samsung text-slate-400 shadow-sm flex flex-col gap-3 active:bg-slate-50 transition-all"
           >
              <i className="fa-solid fa-list-ul text-xl"></i>
              <p className="text-[10px] font-black uppercase tracking-widest">View 2 Notes</p>
           </button>
        </div>

        {/* Note List Preview */}
        <div className="space-y-4">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Key Timestamps</h3>
           <div className="space-y-3">
              {notes.map(note => (
                <div 
                  key={note.id} 
                  onClick={() => setCurrentTime(note.timestamp)}
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4 active:bg-slate-100 transition-all cursor-pointer group"
                >
                   <div className="w-14 h-10 bg-white rounded-xl flex items-center justify-center text-[10px] font-black text-oneui-blue shadow-sm border border-slate-100 group-active:scale-90 transition-all">
                      {formatTime(note.timestamp)}
                   </div>
                   <p className="text-sm font-bold text-slate-700">{note.text}</p>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* 6. NOTES DRAWER BOTTOM SHEET (1.4B) */}
      {isNotesOpen && (
        <div className="fixed inset-0 z-[110] flex flex-col justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="absolute inset-0" onClick={() => setIsNotesOpen(false)} />
           <div className="bg-white rounded-t-[40px] h-[75vh] w-full max-w-[430px] mx-auto flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-500 relative z-10">
              <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mt-6 mb-8" />
              
              <div className="px-10 flex justify-between items-center mb-8">
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight">Study Notes</h2>
                 <button onClick={() => setIsNotesOpen(false)} className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 active:scale-90 transition-all">
                    <i className="fa-solid fa-xmark"></i>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto px-10 space-y-6 pb-24 no-scrollbar">
                 {isAddingNote && (
                    <div className="bg-blue-50 p-6 rounded-[28px] border border-blue-100 space-y-4 animate-in zoom-in">
                       <p className="text-[10px] font-black text-oneui-blue uppercase tracking-widest">New note at {formatTime(currentTime)}</p>
                       <textarea 
                         autoFocus
                         className="w-full h-24 bg-white border-2 border-transparent focus:border-oneui-blue rounded-2xl p-4 text-sm font-bold focus:outline-none transition-all shadow-sm"
                         placeholder="Enter clinical pearl..."
                         value={newNote}
                         onChange={(e) => setNewNote(e.target.value)}
                       />
                       <button 
                         onClick={handleAddNote}
                         className="w-full h-14 bg-oneui-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100"
                       >
                         Save Note
                       </button>
                    </div>
                 )}

                 {notes.map(note => (
                   <div 
                     key={note.id} 
                     onClick={() => { setCurrentTime(note.timestamp); setIsNotesOpen(false); }}
                     className="bg-white p-5 rounded-[28px] border border-slate-100 flex gap-5 active:bg-slate-50 transition-all cursor-pointer shadow-sm"
                   >
                      <div className="w-14 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[11px] font-black text-slate-400">
                        {formatTime(note.timestamp)}
                      </div>
                      <p className="flex-1 text-sm font-medium text-slate-700 leading-relaxed">{note.text}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
