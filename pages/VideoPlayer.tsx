
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { VideoNote } from '../types';

const VideoPlayer: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Mock Video State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(124); // mock starting position
  const [duration] = useState(1800); // 30 mins
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showControls, setShowControls] = useState(true);
  const [securityAlert, setSecurityAlert] = useState(false);
  const [notes, setNotes] = useState<VideoNote[]>([
    { id: 'n1', timestamp: 45, text: 'Important: Origin of facial nerve' },
    { id: 'n2', timestamp: 120, text: 'Clinical correlation: Bell\'s Palsy symptoms' }
  ]);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Watermark Animation State
  const [watermarkPos, setWatermarkPos] = useState({ x: 10, y: 10 });

  // Refs
  // Use ReturnType<typeof setTimeout> to avoid NodeJS namespace issues in frontend code
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle Watermark Movement (Anti-Piracy)
  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPos({
        x: Math.random() * 80 + 5,
        y: Math.random() * 80 + 5
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle Screenshot Blocking Simulation (Blur on focus loss)
  useEffect(() => {
    const handleFocus = () => setSecurityAlert(false);
    const handleBlur = () => setSecurityAlert(true);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const resetControlsTimer = () => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const note: VideoNote = {
      id: Date.now().toString(),
      timestamp: currentTime,
      text: newNote
    };
    setNotes([...notes, note].sort((a, b) => a.timestamp - b.timestamp));
    setNewNote('');
    setIsAddingNote(false);
  };

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden relative select-none">
      {/* Dynamic Watermark */}
      <div 
        className="fixed z-50 pointer-events-none opacity-20 text-[10px] font-black text-white whitespace-nowrap transition-all duration-1000 ease-in-out"
        style={{ left: `${watermarkPos.x}%`, top: `${watermarkPos.y}%` }}
      >
        Dr. Sarah | ID: MED-90210 | {new Date().toLocaleDateString()}
      </div>

      {/* Security Overlay (Screenshot Blocking Feedback) */}
      {securityAlert && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-8 text-center">
          <div className="space-y-6 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full mx-auto flex items-center justify-center text-4xl">
              <i className="fa-solid fa-eye-slash"></i>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Content Protected</h2>
              <p className="text-slate-400 font-medium">Screen recording or screenshots are strictly prohibited. Your session ID has been logged.</p>
            </div>
            <button 
              onClick={() => setSecurityAlert(false)}
              className="px-8 py-4 bg-white text-slate-900 rounded-full font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
            >
              Resume Learning
            </button>
          </div>
        </div>
      )}

      {/* Video Display Area */}
      <div 
        className="relative aspect-video w-full bg-slate-900 flex items-center justify-center group touch-none"
        onClick={resetControlsTimer}
        onMouseMove={resetControlsTimer}
      >
        <img 
          src="https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1200" 
          className={`w-full h-full object-cover transition-all duration-700 ${securityAlert ? 'blur-3xl scale-110' : 'opacity-80'}`}
          alt="Medical Lecture"
        />

        {/* Video Controls Overlay */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 flex flex-col justify-between p-6 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex justify-between items-center">
            <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <div className="flex gap-2">
              <span className="bg-oneui-blue text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-lg">DRM Protected</span>
              <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-lg">QHD+</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
             <div className="flex items-center gap-12">
               <button className="text-white text-2xl opacity-60 active:scale-90 transition-transform"><i className="fa-solid fa-backward-step"></i></button>
               <button onClick={togglePlay} className="w-20 h-20 bg-white text-slate-900 rounded-full flex items-center justify-center text-3xl shadow-2xl active:scale-90 transition-transform">
                 <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play ml-1'}`}></i>
               </button>
               <button className="text-white text-2xl opacity-60 active:scale-90 transition-transform"><i className="fa-solid fa-forward-step"></i></button>
             </div>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between text-[10px] font-black text-white/80 uppercase tracking-widest">
               <span>{formatTime(currentTime)}</span>
               <span>{formatTime(duration)}</span>
             </div>
             <div className="relative h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-oneui-blue rounded-full transition-all duration-300" style={{ width: `${(currentTime/duration)*100}%` }}></div>
             </div>
             <div className="flex justify-between items-center">
                <div className="flex gap-4">
                   <button 
                     onClick={() => setPlaybackSpeed(playbackSpeed >= 2 ? 0.5 : playbackSpeed + 0.25)}
                     className="text-white text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
                   >
                     {playbackSpeed}x Speed
                   </button>
                   <button className="text-white text-lg opacity-80"><i className="fa-solid fa-closed-captioning"></i></button>
                </div>
                <button className="text-white text-lg opacity-80"><i className="fa-solid fa-expand"></i></button>
             </div>
          </div>
        </div>
      </div>

      {/* Content Tabs & Notes Area */}
      <div className="flex-1 bg-white rounded-t-[32px] -mt-6 relative z-10 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.15)]">
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-6" />
        
        <div className="px-8 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-oneui-blue uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">Neuroanatomy</span>
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded">Expires in 48h</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">Functional Anatomy of Cranial Nerves I-VI</h1>
          <p className="text-sm font-bold text-slate-400">Section 2 • Topic 1.4 • Video Lecture</p>
        </div>

        {/* Notes Section */}
        <div className="flex-1 overflow-y-auto mt-8 px-6 pb-24">
          <div className="flex justify-between items-center px-2 mb-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Timestamped Notes</h3>
            <button 
              onClick={() => setIsAddingNote(true)}
              className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-slate-200 active:scale-95 transition-all"
            >
              <i className="fa-solid fa-plus mr-1"></i> Add Note
            </button>
          </div>

          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-4 group hover:border-oneui-blue transition-colors">
                <button 
                  onClick={() => setCurrentTime(note.timestamp)}
                  className="w-14 h-10 bg-white rounded-xl flex items-center justify-center text-[11px] font-black text-oneui-blue shadow-sm border border-slate-100 active:scale-90"
                >
                  {formatTime(note.timestamp)}
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">{note.text}</p>
                </div>
                <button className="text-slate-200 group-hover:text-red-400 transition-colors self-center">
                  <i className="fa-solid fa-trash-can text-xs"></i>
                </button>
              </div>
            ))}

            {isAddingNote && (
              <div className="bg-blue-50 p-6 rounded-samsung border border-blue-100 space-y-4 animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-oneui-blue uppercase tracking-widest">New Note at {formatTime(currentTime)}</p>
                  <button onClick={() => setIsAddingNote(false)} className="text-slate-400"><i className="fa-solid fa-xmark"></i></button>
                </div>
                <textarea 
                  autoFocus
                  className="w-full bg-white border border-blue-100 rounded-xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-oneui-blue"
                  rows={3}
                  placeholder="Capture key concepts here..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <button 
                  onClick={handleAddNote}
                  className="w-full py-4 bg-oneui-blue text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-100"
                >
                  Save Timestamp Note
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
