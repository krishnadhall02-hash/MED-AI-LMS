
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const LiveClass: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // UI States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [quality, setQuality] = useState<'HD' | 'SD' | 'LQ'>('HD');
  const [isDataSaver, setIsDataSaver] = useState(false);
  
  // Logic States
  const [attendanceStatus, setAttendanceStatus] = useState<'Joining' | 'Verifying' | 'Verified'>('Joining');
  const [isRecording, setIsRecording] = useState(true);
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<'Good' | 'Poor'>('Good');
  const [pollSubmitted, setPollSubmitted] = useState(false);

  const [messages, setMessages] = useState([
    { id: 1, user: 'Dr. Rahul', text: 'Can we discuss the ventricular system again?', time: '14:02' },
    { id: 2, user: 'Dr. Amit', text: 'The ECG masterclass was amazing!', time: '14:05' },
    { id: 3, user: 'Dr. Sarah', text: 'Is the foramen ovale part of this session?', time: '14:08' },
  ]);
  const [input, setInput] = useState('');

  // 1. Attendance & Security Logic
  useEffect(() => {
    // Attendance verification simulation
    const vTimer = setTimeout(() => setAttendanceStatus('Verifying'), 2000);
    const aTimer = setTimeout(() => {
      setAttendanceStatus('Verified');
      // Toast notification for attendance recorded (1.3B)
      showToast("Attendance Recorded Successfully", "success");
    }, 8000);

    // Piracy Protection (1.3B)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setSecurityAlert("Unsafe screen activity detected. Recording/Screenshots are blocked to protect academic content.");
      }
    };
    
    // Low Connection Simulation
    const connTimer = setTimeout(() => {
       if (quality === 'HD') {
          setConnectionQuality('Poor');
          showToast("Weak internet. Switching to Data Saver mode.", "warning");
          setIsDataSaver(true);
          setQuality('LQ');
       }
    }, 20000);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      clearTimeout(vTimer);
      clearTimeout(aTimer);
      clearTimeout(connTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // 2. Poll Simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!pollSubmitted) setShowPoll(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, [pollSubmitted]);

  const showToast = (msg: string, type: 'success' | 'warning') => {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl z-[100] animate-in slide-in-from-bottom duration-500 ${
      type === 'success' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
    }`;
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 3000);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), user: 'You', text: input, time: 'Now' }]);
    setInput('');
  };

  const submitPoll = (option: string) => {
    setPollSubmitted(true);
    showToast("Answer Submitted!", "success");
    setTimeout(() => setShowPoll(false), 1000);
  };

  return (
    <div className={`flex flex-col h-screen bg-black overflow-hidden relative transition-all duration-500 ${isLandscape ? 'orientation-landscape' : ''}`}>
      
      {/* Security Alert Overlay (1.3B) */}
      {securityAlert && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="bg-white rounded-samsung p-10 w-full max-w-[340px] text-center space-y-6 shadow-2xl">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full mx-auto flex items-center justify-center text-4xl shadow-inner">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 leading-tight">Security Alert</h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{securityAlert}</p>
            </div>
            <button 
              onClick={() => setSecurityAlert(null)}
              className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
            >
              Resume Lecture
            </button>
          </div>
        </div>
      )}

      {/* 1. HD VIDEO PLAYER AREA (1.3A) */}
      <div className={`relative transition-all duration-500 bg-slate-950 flex items-center justify-center overflow-hidden group ${isLandscape ? 'h-screen w-screen' : 'aspect-video w-full'}`}>
        <img 
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200" 
          className={`w-full h-full object-cover transition-all duration-[10s] ${isDataSaver ? 'blur-md scale-100 opacity-40' : 'scale-105 group-hover:scale-100 opacity-60'}`}
          alt="Live medical lecture"
        />
        
        {/* Top Indicators Overlay */}
        <div className="absolute top-6 left-6 flex flex-col gap-3 pointer-events-none">
          <div className="flex gap-2">
            <span className="bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse uppercase tracking-widest shadow-lg">
              <i className="fa-solid fa-circle text-[6px]"></i> Live
            </span>
            {isRecording && (
              <span className="bg-white/10 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10 uppercase tracking-widest">
                <i className="fa-solid fa-record-vinyl text-red-400"></i> Auto Recording
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <span className={`text-[9px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md border uppercase tracking-widest ${
              attendanceStatus === 'Verified' ? 'bg-emerald-500 text-white border-emerald-400/20' : 'bg-white/10 text-white border-white/10'
            }`}>
              <i className={`fa-solid ${attendanceStatus === 'Verified' ? 'fa-check-circle' : 'fa-spinner fa-spin'}`}></i>
              {attendanceStatus}
            </span>
            <div className={`text-[9px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10 uppercase tracking-widest ${isDataSaver ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'}`}>
              <i className="fa-solid fa-signal"></i> {quality} {isDataSaver ? '(Data Saver)' : 'Mode'}
            </div>
          </div>
        </div>

        {/* Fullscreen Swipe/Orientation Toggle (1.3A) */}
        <button 
          onClick={() => setIsLandscape(!isLandscape)}
          className="absolute bottom-6 right-6 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-md border border-white/10 active:scale-90 transition-all opacity-0 group-hover:opacity-100"
        >
           <i className={`fa-solid ${isLandscape ? 'fa-compress' : 'fa-expand'}`}></i>
        </button>

        {/* Poll MCQ Overlay (1.3A) */}
        {showPoll && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in zoom-in duration-300">
            <div className="bg-white rounded-samsung p-8 w-full max-w-[360px] shadow-2xl space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-oneui-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Live Quiz</span>
                <span className="text-[10px] font-black text-slate-300 uppercase">Interactive</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 leading-tight">Which cranial nerve exits through the Jugular Foramen?</h3>
              <div className="space-y-2">
                {['CN VII', 'CN VIII', 'CN IX', 'CN XII'].map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => submitPoll(opt)}
                    className="w-full py-4 px-6 rounded-2xl border-2 border-slate-50 bg-slate-50/50 hover:border-oneui-blue hover:bg-blue-50 text-left text-sm font-bold text-slate-700 transition-all flex items-center gap-4 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-black text-xs text-slate-400 group-hover:text-oneui-blue">{String.fromCharCode(65 + i)}</div>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. INTERACTION CONTROLS (Portrait Only) */}
      {!isLandscape && (
        <div className="flex-1 bg-oneui-bg p-8 space-y-8 overflow-y-auto rounded-t-[40px] -mt-10 relative z-10 shadow-[0_-15px_40px_rgba(0,0,0,0.15)] border-t border-white/20">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                 <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-widest">Neuro Anatomy</span>
                 <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Topic 1.4</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">Cranial Nerves & Foramina: The Deep Dive</h1>
              <div className="flex items-center gap-3 bg-white w-fit px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden ring-2 ring-slate-50">
                  <img src="https://i.pravatar.cc/100?u=dr_anand" alt="Mentor" />
                </div>
                <div>
                   <p className="text-sm font-black text-slate-900">Dr. Anand Sharma</p>
                   <p className="text-[10px] font-bold text-oneui-blue uppercase tracking-widest">Associate Professor</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar (1.3A) */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setIsDataSaver(!isDataSaver)}
              className={`p-5 rounded-samsung border flex flex-col gap-3 transition-all ${
                isDataSaver ? 'bg-amber-500 text-white border-amber-400 shadow-xl' : 'bg-white text-slate-400 border-slate-100 shadow-sm'
              }`}
            >
              <i className={`fa-solid fa-leaf text-xl`}></i>
              <p className="text-[11px] font-black uppercase tracking-widest">{isDataSaver ? 'Data Saver ON' : 'Data Saver'}</p>
            </button>
            <div className="bg-white p-5 rounded-samsung border border-slate-100 shadow-sm flex flex-col gap-3">
              <i className="fa-solid fa-users text-xl text-oneui-blue"></i>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">1,240 Watching</p>
            </div>
          </div>

          {/* Chat Sheet Preview (1.3A) */}
          <div 
            onClick={() => setIsChatOpen(true)}
            className="bg-white rounded-samsung p-6 shadow-sm border border-slate-100 space-y-4 active:scale-[0.98] transition-all cursor-pointer"
          >
              <div className="flex justify-between items-center">
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 text-oneui-blue rounded-xl flex items-center justify-center">
                     <i className="fa-solid fa-comments"></i>
                  </div>
                  Discussion
                </h3>
                <span className="text-[10px] font-bold text-slate-300">Expand</span>
              </div>
              <div className="space-y-2">
                {messages.slice(-2).map(m => (
                  <p key={m.id} className="text-[13px] text-slate-500 font-medium italic line-clamp-1">
                    <span className="font-black text-slate-800 mr-2">{m.user}:</span> {m.text}
                  </p>
                ))}
              </div>
          </div>
        </div>
      )}

      {/* Floating Raise Hand Button (1.3A) - S-Pen friendly large target */}
      {!isLandscape && (
        <button 
          onClick={() => {
            setIsHandRaised(!isHandRaised);
            if (!isHandRaised) showToast("Raised hand notification sent to mentor", "success");
          }}
          className={`fixed right-8 bottom-28 w-20 h-20 rounded-[32px] shadow-2xl flex items-center justify-center text-3xl transition-all z-20 active:scale-90 ${
            isHandRaised ? 'bg-oneui-blue text-white shadow-blue-200 rotate-12' : 'bg-white text-slate-400 border border-slate-100 hover:scale-110'
          }`}
        >
          <i className={`fa-solid fa-hand${isHandRaised ? '-back-fist' : ''}`}></i>
        </button>
      )}

      {/* Chat Bottom Sheet (1.3A) */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setIsChatOpen(false)} />
          <div className="bg-white rounded-t-[40px] h-[70vh] w-full max-w-[430px] mx-auto flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-500 relative z-10 border-t border-white/20">
            <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mt-6 mb-8" />
            
            <div className="px-10 flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Chat</h2>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>

            <div className="flex-1 overflow-y-auto px-10 space-y-6 pb-24">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col gap-1 ${m.user === 'You' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.user}</span>
                  <div className={`p-4 rounded-2xl text-sm font-medium ${
                    m.user === 'You' ? 'bg-oneui-blue text-white rounded-tr-none' : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex gap-3 items-center sticky bottom-0">
                <input 
                  type="text" 
                  placeholder="Ask a doubt..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 h-14 px-6 bg-slate-100 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-oneui-blue transition-all font-bold text-slate-800"
                />
              <button 
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className="w-14 h-14 bg-oneui-blue text-white rounded-2xl flex items-center justify-center text-xl shadow-lg active:scale-90 disabled:opacity-50 transition-all"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveClass;
