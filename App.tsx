
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Practice from './pages/Practice';
import ImagePracticeScreen from './pages/ImagePracticeScreen';
import RandomPracticeScreen from './pages/RandomPracticeScreen';
import AITutorPanel from './components/AITutorPanel';
import LiveClass from './pages/LiveClass';
import VideoPlayer from './pages/VideoPlayer';
import ExamSimulator from './pages/ExamSimulator';
import CustomizeMockSetup from './pages/CustomizeMockSetup';
import CustomExamSimulator from './pages/CustomExamSimulator';
import TestResults from './pages/TestResults';
import TestReview from './pages/TestReview';
import Analytics from './pages/Analytics';
import DetailedAnalysis from './pages/DetailedAnalysis';
import StudyPlanner from './pages/StudyPlanner';
import DailyTracker from './pages/DailyTracker';
import Calendar from './pages/Calendar';
import NotesLibrary from './pages/NotesLibrary';
import NoteViewer from './pages/NoteViewer';
import Community from './pages/Community';
import ThreadDetail from './pages/ThreadDetail';
import Notifications from './pages/Notifications';
import NotificationSettings from './pages/NotificationSettings';
import RecordedClasses from './pages/RecordedClasses';
import ExpertAdvice from './pages/ExpertAdvice';
import FacultyList from './pages/FacultyList';
import BookingFlow from './pages/BookingFlow';
import DailyQuiz from './pages/DailyQuiz';
import DailyChallenge from './pages/DailyChallenge';
import Leaderboard from './pages/Leaderboard';
import WeaknessRepair from './pages/WeaknessRepair';
import Profile from './pages/Profile';
import Login from './pages/Auth/Login';
import OTP from './pages/Auth/OTP';
import Register from './pages/Auth/Register';
import Onboarding from './pages/Onboarding';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[200] bg-synapse-blue-primary flex flex-col items-center justify-center animate-in fade-in duration-700">
      <div className="relative flex flex-col items-center">
        <div className="w-48 h-48 relative mb-10">
          <div className="absolute inset-0 bg-synapse-aqua/10 rounded-full blur-[60px] animate-pulse"></div>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_20px_rgba(45,212,191,0.4)]">
            <circle cx="100" cy="100" r="85" fill="none" stroke="#1e2d3d" strokeWidth="8" strokeDasharray="15 5" />
            <circle cx="100" cy="100" r="78" fill="none" stroke="#2dd4bf" strokeWidth="1" opacity="0.3" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="#111d27" strokeWidth="12" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="2 10" className="animate-[spin_10s_linear_infinite]" />
            <g transform="translate(60, 60) scale(0.8)">
              <path d="M50 10 C30 10, 15 25, 15 45 C15 65, 30 80, 50 80 V10" fill="none" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round">
                <animate attributeName="stroke-dasharray" values="0,200; 200,0; 0,200" dur="4s" repeatCount="indefinite" />
              </path>
              <path d="M50 10 C70 10, 85 25, 85 45 C85 65, 70 80, 50 80 V10" fill="none" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round">
                <animate attributeName="stroke-dashoffset" values="200; 0; -200" dur="4s" repeatCount="indefinite" />
              </path>
              <circle cx="35" cy="30" r="2.5" fill="#2dd4bf" className="animate-pulse" />
              <circle cx="65" cy="55" r="2.5" fill="#2dd4bf" className="animate-pulse delay-75" />
              <circle cx="40" cy="65" r="2.5" fill="#2dd4bf" className="animate-pulse delay-150" />
              <line x1="50" y1="15" x2="50" y2="75" stroke="#2dd4bf" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
            </g>
            <circle cx="100" cy="100" r="5" fill="#2dd4bf" className="animate-ping" />
          </svg>
        </div>
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black tracking-[0.2em] text-white italic">SYNAPSE</h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-8 bg-synapse-aqua/30"></div>
            <p className="text-synapse-aqua text-[11px] font-black uppercase tracking-[0.5em] opacity-80">MEDPOINT AI CORE</p>
            <div className="h-[1px] w-8 bg-synapse-aqua/30"></div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-16 w-16 h-1 bg-synapse-surface rounded-full overflow-hidden border border-white/5 shadow-inner">
        <div className="h-full bg-synapse-aqua animate-[loading_2.5s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-150%); }
          50% { transform: translateX(50%); }
          100% { transform: translateX(150%); }
        }
      `}</style>
    </div>
  );
};

const LiveClassesList: React.FC = () => {
  const navigate = useNavigate();
  const classes = [
    { id: '1', title: 'Neuroanatomy Masterclass', mentor: 'Dr. Anand Sharma', viewers: '1.2k', tags: ['High Yield', 'Anatomy'] },
    { id: '2', title: 'ECG in 60 Minutes', mentor: 'Dr. Sarah Johnson', viewers: '850', tags: ['Medicine', 'Clinical'] },
    { id: '3', title: 'Renal Physiology Core', mentor: 'Dr. Vikram Mehra', viewers: '540', tags: ['Physiology'] },
  ];

  return (
    <div className="pb-40 min-h-screen bg-synapse-light-bg">
      <div className="bg-synapse-dark pt-12 px-8 pb-12 rounded-b-[40px] shadow-lg">
        <h1 className="text-4xl font-light text-white leading-tight">Live<br /><span className="font-black text-synapse-aqua">Broadcasts</span></h1>
      </div>
      <div className="px-5 space-y-4 -mt-6">
        {classes.map(c => (
          <div 
            key={c.id} 
            onClick={() => navigate(`/live/${c.id}`)}
            className="bg-synapse-card-white shadow-md border border-slate-100 rounded-samsung p-6 space-y-4 active:scale-95 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <span className="bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded uppercase animate-pulse">Live Now</span>
              <div className="flex gap-2">
                {c.tags.map(t => (
                  <span key={t} className="text-[8px] font-bold text-slate-400 uppercase border border-slate-200 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black text-synapse-text-dark">{c.title}</h3>
              <p className="text-xs text-synapse-text-muted font-medium">{c.mentor} • {c.viewers} connected</p>
            </div>
            <button className="w-full h-12 bg-synapse-dark text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:bg-synapse-surface transition-colors">Join Session</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState<'LOGIN' | 'OTP' | 'REGISTER' | 'ONBOARDING'>('LOGIN');
  const [identifier, setIdentifier] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      const token = localStorage.getItem('auth_token');
      const onboarded = localStorage.getItem('profile_synced');
      if (token && onboarded) setIsAuthenticated(true);
      else if (token && !onboarded) setAuthStep('ONBOARDING');
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  const handleOTPVerify = async () => {
    localStorage.setItem('auth_token', 'mock_secure_token_' + Date.now());
    const onboarded = localStorage.getItem('profile_synced');
    if (onboarded) {
      setIsAuthenticated(true);
      navigate('/', { replace: true });
    } else {
      setAuthStep('ONBOARDING');
    }
  };

  const handleGlobalLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('profile_synced');
    localStorage.removeItem('daily_quiz_attempted');
    localStorage.removeItem('user_cached_data');
    setIsAuthenticated(false);
    setAuthStep('LOGIN');
    setIdentifier('');
    navigate('/', { replace: true });
  };

  const renderAuthFlow = () => {
    switch (authStep) {
      case 'OTP':
        return <OTP identifier={identifier} onVerify={handleOTPVerify} onBack={() => setAuthStep('LOGIN')} />;
      case 'REGISTER':
        return <Register onSuccess={(id) => { setIdentifier(id); setAuthStep('OTP'); }} onBack={() => setAuthStep('LOGIN')} />;
      case 'ONBOARDING':
        return <Onboarding onComplete={(data) => { 
          localStorage.setItem('profile_synced', 'true');
          localStorage.setItem('user_cached_data', JSON.stringify({ ...data, name: 'Dr. Aspirant' }));
          setIsAuthenticated(true); 
          navigate('/', { replace: true }); 
        }} />;
      default:
        return <Login onNext={(id) => { setIdentifier(id); setAuthStep('OTP'); }} onNavigateRegister={() => setAuthStep('REGISTER')} />;
    }
  };

  if (showSplash) return <SplashScreen />;

  return (
    <div className="mobile-frame">
      {/* Dark Header / Status Bar Area */}
      <div className="shrink-0 z-[100] px-6 flex justify-between items-center text-white bg-synapse-dark border-b border-white/5" style={{ height: 'var(--safe-area-top)' }}>
        <span className="font-bold text-sm">9:41</span>
        <div className="flex gap-2 text-xs opacity-60">
          <i className="fa-solid fa-signal"></i>
          <i className="fa-solid fa-wifi"></i>
          <i className="fa-solid fa-battery-full text-synapse-aqua"></i>
        </div>
      </div>

      <main className={`flex-1 overflow-x-hidden overflow-y-auto no-scrollbar relative ${isAuthenticated ? 'bg-synapse-light-bg' : 'bg-synapse-blue-light'}`}>
        {!isAuthenticated ? (
          <div className="h-full">
            {renderAuthFlow()}
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/image-practice" element={<ImagePracticeScreen />} />
            <Route path="/random-practice" element={<RandomPracticeScreen />} />
            <Route path="/tutor" element={<AITutorPanel />} />
            <Route path="/live-list" element={<LiveClassesList />} />
            <Route path="/live/:id" element={<LiveClass />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            <Route path="/recorded-classes" element={<RecordedClasses />} />
            <Route path="/exam" element={<ExamSimulator />} />
            <Route path="/customize-mock" element={<CustomizeMockSetup />} />
            <Route path="/custom-exam" element={<CustomExamSimulator />} />
            <Route path="/exam-results" element={<TestResults />} />
            <Route path="/test-review" element={<TestReview />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/detailed-analysis" element={<DetailedAnalysis />} />
            <Route path="/planner" element={<StudyPlanner />} />
            <Route path="/tracker" element={<DailyTracker />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/notes" element={<NotesLibrary />} />
            <Route path="/notes/:id" element={<NoteViewer />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/:id" element={<ThreadDetail />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/notification-settings" element={<NotificationSettings />} />
            <Route path="/profile" element={<Profile onLogout={handleGlobalLogout} />} />
            <Route path="/expert-advice" element={<ExpertAdvice />} />
            <Route path="/faculty-list" element={<FacultyList />} />
            <Route path="/book-appointment/:facultyId" element={<BookingFlow />} />
            <Route path="/daily-quiz" element={<DailyQuiz />} />
            <Route path="/daily-challenge" element={<DailyChallenge />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/weakness-repair" element={<WeaknessRepair />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>

      {isAuthenticated && <BottomNav />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
