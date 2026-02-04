
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const LiveClass: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [quality, setQuality] = useState<'HD' | 'SD' | 'LQ'>('HD');
  const [attendanceStatus, setAttendanceStatus] = useState<'Joining' | 'Verified'>('Joining');
  const [isRecording, setIsRecording] = useState(true);
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);
  const [reminderSet, setReminderSet] = useState(false);

  const [messages, setMessages] = useState([
    { id: 1, user: 'Dr. Rahul', text: 'Can we discuss the ventricular system again?', time: '14:02' },
    { id: 2, user: 'Dr. Amit', text: 'The ECG masterclass was amazing!', time: '14:05' },
  ]);
  const [input, setInput] = useState('');

  // 1. Attendance Tracking Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setAttendanceStatus('Verified');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // 2. Poll Simulation
  useEffect(() => {
    const timer = setTimeout(() => setShowPoll(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  // 3. Screen Recording / Piracy Protection (Simulated via Visibility API)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setSecurityAlert("Screen activity detected. Please stay on the lecture screen to maintain attendance and access.");
        // In a real app, we might stop playback or report to admin
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), user: 'You', text: input, time: 'Now' }]);
    setInput('');
  };

  const toggleReminder = () => {
    setReminderSet(!reminderSet);
    // Mock notification scheduling
  };

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden relative">
      {/* Security Alert Overlay */}
      {securityAlert && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="bg-white rounded-samsung p-8 w-full max-w-[340px] text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full mx-auto flex items-center justify-center text-3xl">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900 leading-tight">Security Alert</h2>
              <p className="text-sm text-slate-500 font-medium">{securityAlert}</p>
            </div>
            <button 
              onClick={() => setSecurityAlert(null)}
              className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black"
            >
              Resume Lecture
            </button>
          </div>
        </div>
      )}

      {/* 1. Video Player Area (HD Simulation) */}
      <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000" 
          className="w-full h-full object-cover opacity-80"
          alt="Live medical lecture"
        />
        
        {/* Top Indicators */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="flex gap-2">
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded flex items-center gap-1 animate-pulse uppercase tracking-wider shadow-lg">
              <i className="fa-solid fa-circle text-[6px]"></i> Live
            </span>
            {isRecording && (
              <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 border border-white/10">
                <i className="fa-solid fa-record-vinyl text-red-400"></i> REC
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <span className={`text-[10px] font-black px-2 py-1 rounded flex items-center gap-1 backdrop-blur-md border ${
              attendanceStatus === 'Verified' ? 'bg-emerald-500/80 text-white border-emerald-400/20' : 'bg-white/20 text-white border-white/10'
            }`}>
              <i className={`fa-solid ${attendanceStatus === 'Verified' ? 'fa-check-circle' : 'fa-spinner fa-spin'}`}></i>
              {attendanceStatus}
            </span>
            <span className="bg-blue-500/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 border border-blue-400/20">
              <i className="fa-solid fa-shield"></i> DRM Active
            </span>
          </div>
        </div>

        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all border border-white/10"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Bandwidth Selection Overlay */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          {['HD', 'SD', 'LQ'].map((q) => (
            <button
              key={q}
              onClick={() => setQuality(q as any)}
              className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${
                quality === q ? 'bg-oneui-blue text-white' : 'bg-white/20 text-white hover:bg-white/40'
              }`}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Poll Overlay Simulation */}
        {showPoll && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-black/40 backdrop-blur-[2px] animate-in zoom-in duration-300">
            <div className="bg-white rounded-samsung p-6 w-full max-w-[320px] shadow-2xl space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black text-oneui-blue uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">Live MCQ Poll</span>
                <button onClick={() => setShowPoll(false)} className="text-slate-300"><i className="fa-solid fa-xmark"></i></button>
              </div>
              <h3 className="text-lg font-black text-slate-900 leading-tight">Which layer of the heart is thickest?</h3>
              <div className="space-y-2">
                {['Epicardium', 'Myocardium', 'Endocardium', 'Pericardium'].map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => setShowPoll(false)}
                    className="w-full py-3 px-4 rounded-2xl border border-slate-100 hover:border-oneui-blue hover:bg-blue-50 text-left text-sm font-bold text-slate-700 transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Metadata & Controls */}
      <div className="flex-1 bg-oneui-bg p-6 space-y-6 overflow-y-auto rounded-t-[32px] -mt-6 relative z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 leading-tight">ECG Masterclass: Advanced Interpretation</h1>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                <img src="https://i.pravatar.cc/100?u=dr_anand" alt="Mentor" />
              </div>
              <p className="text-sm font-bold text-slate-500">Dr. Anand Sharma • <span className="text-oneui-blue">Cardiology</span></p>
            </div>
          </div>
          <button 
            onClick={toggleReminder}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              reminderSet ? 'bg-oneui-blue text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'
            }`}
          >
            <i className={`fa-${reminderSet ? 'solid' : 'regular'} fa-bell`}></i>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex items-center gap-3">
            <i className="fa-solid fa-bolt text-yellow-500"></i>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network</p>
              <p className="text-sm font-bold text-slate-800">Optimized • {quality}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex items-center gap-3">
            <i className="fa-solid fa-user-check text-emerald-500"></i>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance</p>
              <p className="text-sm font-bold text-slate-800">{attendanceStatus}</p>
            </div>
          </div>
        </div>

        {/* Feature status banners */}
        <div className="space-y-3">
           <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                 <i className="fa-solid fa-cloud-arrow-up"></i>
              </div>
              <div>
                <p className="text-xs font-black text-indigo-900 uppercase tracking-widest">Auto Recording</p>
                <p className="text-[11px] text-indigo-600 font-medium">Session is being saved to your library for 24/7 access.</p>
              </div>
           </div>

           <div className="bg-white rounded-samsung p-6 shadow-sm border border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest flex items-center gap-2">
                  <i className="fa-solid fa-comments text-oneui-blue"></i> Live Discussion
                </h3>
                <button onClick={() => setIsChatOpen(true)} className="text-oneui-blue text-xs font-black uppercase tracking-widest">Open Chat</button>
              </div>
              <div className="space-y-3">
                {messages.slice(-2).map(m => (
                  <div key={m.id} className="flex gap-2 text-sm items-center">
                    <span className="font-black text-slate-900 whitespace-nowrap text-[11px] bg-slate-100 px-2 py-0.5 rounded uppercase">{m.user}</span>
                    <span className="text-slate-600 line-clamp-1 font-medium">{m.text}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>

      {/* Floating Raise Hand Button */}
      <button 
        onClick={() => setIsHandRaised(!isHandRaised)}
        className={`fixed right-6 bottom-24 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all z-20 ${
          isHandRaised ? 'bg-oneui-blue text-white scale-110' : 'bg-white text-slate-400 hover:scale-110 active:scale-90'
        }`}
      >
        <i className={`fa-solid fa-hand${isHandRaised ? '-back-fist' : ''}`}></i>
        {isHandRaised && (
           <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-bounce">1</span>
        )}
      </button>

      {/* Chat Bottom Sheet */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="absolute inset-0" 
            onClick={() => setIsChatOpen(false)} 
          />
          <div className="bg-white rounded-t-[40px] h-[75vh] w-full max-w-[430px] mx-auto flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-500 relative z-10">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-6" />
            
            <div className="px-8 flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Live Chat</h2>
                <span className="bg-red-50 text-red-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Real-time</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 active:scale-90 transition-all">
                <i className="fa-solid fa-chevron-down"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 space-y-6 pb-20">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col gap-1 ${m.user === 'You' ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-black uppercase tracking-widest ${m.user === 'You' ? 'text-oneui-blue' : 'text-slate-400'}`}>
                      {m.user}
                    </span>
                    <span className="text-[10px] text-slate-300 font-bold">{m.time}</span>
                  </div>
                  <div className={`p-4 rounded-2xl font-medium text-sm max-w-[85%] shadow-sm ${
                    m.user === 'You' ? 'bg-oneui-blue text-white rounded-tr-none' : 'bg-slate-50 text-slate-600 rounded-tl-none border border-slate-100'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-white border-t border-slate-100 flex gap-2 items-center">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="Ask a question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="w-full h-14 px-6 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-oneui-blue font-bold text-slate-800"
                />
              </div>
              <button 
                onClick={handleSendMessage}
                className="w-14 h-14 bg-oneui-blue text-white rounded-2xl flex items-center justify-center text-lg shadow-lg shadow-blue-100 active:scale-90 transition-all"
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
