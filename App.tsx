
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Practice from './pages/Practice';
import AITutorPanel from './components/AITutorPanel';
import LiveClass from './pages/LiveClass';
import VideoPlayer from './pages/VideoPlayer';
import ExamSimulator from './pages/ExamSimulator';
import CustomizeMockSetup from './pages/CustomizeMockSetup';
import CustomExamSimulator from './pages/CustomExamSimulator';
import TestResults from './pages/TestResults';
import Analytics from './pages/Analytics';
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
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Login from './pages/Auth/Login';
import OTP from './pages/Auth/OTP';
import Register from './pages/Auth/Register';
import Onboarding from './pages/Onboarding';

// Live Classes Screen Placeholder
const LiveClassesList = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-oneui-bg min-h-screen pb-32">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
         <h1 className="text-4xl font-light text-oneui-text-primary leading-tight">Live<br/><span className="font-bold">Sessions</span></h1>
      </div>
      <div className="px-5 space-y-4">
        <div 
          onClick={() => navigate('/live/1')}
          className="bg-oneui-surface rounded-samsung p-6 shadow-xl border border-oneui-border relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer"
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
          <h4 className="text-xl font-black text-oneui-text-primary leading-tight mb-2">Cranial Nerves & Foramina: The Deep Dive</h4>
          <p className="text-xs text-oneui-text-secondary font-bold mb-4">Dr. Anand Sharma • 1,240 Watching</p>
          <button className="w-full h-12 bg-oneui-blue text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100">
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Root content component to enable useNavigate
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState<'LOGIN' | 'OTP' | 'REGISTER' | 'ONBOARDING'>('LOGIN');
  const [identifier, setIdentifier] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsInitializing(false);
  }, []);

  const handleLoginSuccess = async () => {
    try {
      localStorage.setItem('auth_token', 'mock_secure_token_' + Date.now());
      await new Promise(resolve => setTimeout(resolve, 800));
      localStorage.setItem('user_cached_data', JSON.stringify({ name: 'Dr. Sarah', role: 'STUDENT' }));
      setIsAuthenticated(true);
      navigate('/', { replace: true });
    } catch (e) {
      console.error("Auth redirection failed", e);
    }
  };

  const handleGlobalLogout = () => {
    localStorage.removeItem('auth_token');
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
        return <OTP identifier={identifier} onVerify={handleLoginSuccess} onBack={() => setAuthStep('LOGIN')} />;
      case 'REGISTER':
        return <Register onSuccess={(id) => { setIdentifier(id); setAuthStep('OTP'); }} onBack={() => setAuthStep('LOGIN')} />;
      case 'ONBOARDING':
        return <Onboarding onComplete={() => { setIsAuthenticated(true); navigate('/', { replace: true }); }} />;
      default:
        return <Login onNext={(id) => { setIdentifier(id); setAuthStep('OTP'); }} onNavigateRegister={() => setAuthStep('REGISTER')} />;
    }
  };

  if (isInitializing) {
    return (
      <div className="mobile-frame bg-oneui-bg flex items-center justify-center">
         <div className="w-16 h-16 border-4 border-oneui-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="mobile-frame flex flex-col">
      <div className="sticky top-0 z-50 px-6 py-3 flex justify-between items-center text-oneui-text-primary bg-oneui-bg">
        <span className="font-bold text-sm">9:41</span>
        <div className="flex gap-2 text-xs">
          <i className="fa-solid fa-signal"></i>
          <i className="fa-solid fa-wifi"></i>
          <i className="fa-solid fa-battery-full"></i>
        </div>
      </div>

      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-oneui-bg">
        {!isAuthenticated ? (
          <div className="h-full">
            {renderAuthFlow()}
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/tutor" element={<AITutorPanel />} />
            <Route path="/live-list" element={<LiveClassesList />} />
            <Route path="/live/:id" element={<LiveClass />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            <Route path="/recorded-classes" element={<RecordedClasses />} />
            <Route path="/exam" element={<ExamSimulator />} />
            <Route path="/customize-mock" element={<CustomizeMockSetup />} />
            <Route path="/custom-exam" element={<CustomExamSimulator />} />
            <Route path="/exam-results" element={<TestResults />} />
            <Route path="/analytics" element={<Analytics />} />
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
            <Route path="/leaderboard" element={<Leaderboard />} />
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
