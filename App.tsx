
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Practice from './pages/Practice';
import AITutorPanel from './components/AITutorPanel';
import LiveClass from './pages/LiveClass';
import VideoPlayer from './pages/VideoPlayer';
import ExamSimulator from './pages/ExamSimulator';
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
import Login from './pages/Auth/Login';
import OTP from './pages/Auth/OTP';
import Register from './pages/Auth/Register';
import Onboarding from './pages/Onboarding';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [authStep, setAuthStep] = useState<'LOGIN' | 'OTP' | 'REGISTER' | 'ONBOARDING'>('LOGIN');
  const [identifier, setIdentifier] = useState('');

  const handleLoginSuccess = () => {
    setAuthStep('ONBOARDING');
  };

  const handleOnboardingComplete = (data: any) => {
    setHasCompletedOnboarding(true);
    setIsAuthenticated(true);
  };

  const renderAuthFlow = () => {
    switch (authStep) {
      case 'OTP':
        return <OTP identifier={identifier} onVerify={handleLoginSuccess} onBack={() => setAuthStep('LOGIN')} />;
      case 'REGISTER':
        return <Register onSuccess={(id) => { setIdentifier(id); setAuthStep('OTP'); }} onBack={() => setAuthStep('LOGIN')} />;
      case 'ONBOARDING':
        return <Onboarding onComplete={handleOnboardingComplete} />;
      default:
        return <Login onNext={(id) => { setIdentifier(id); setAuthStep('OTP'); }} onNavigateRegister={() => setAuthStep('REGISTER')} />;
    }
  };

  return (
    <Router>
      <div className="mobile-frame flex flex-col">
        <div className="sticky top-0 z-50 px-6 py-3 flex justify-between items-center text-slate-800 bg-oneui-bg">
          <span className="font-bold text-sm">9:41</span>
          <div className="flex gap-2 text-xs">
            <i className="fa-solid fa-signal"></i>
            <i className="fa-solid fa-wifi"></i>
            <i className="fa-solid fa-battery-full"></i>
          </div>
        </div>

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {!isAuthenticated ? (
            renderAuthFlow()
          ) : (
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/tutor" element={<AITutorPanel />} />
              <Route path="/live/:id" element={<LiveClass />} />
              <Route path="/video/:id" element={<VideoPlayer />} />
              <Route path="/exam" element={<ExamSimulator />} />
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
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </main>

        {isAuthenticated && <BottomNav />}
      </div>
    </Router>
  );
};

export default App;
