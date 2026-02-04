
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudyLog } from '../types';

const MOCK_LOGS: StudyLog[] = [
  { id: '1', date: '2023-10-25', duration: 120, type: 'video', topic: 'Cranial Nerves' },
  { id: '2', date: '2023-10-24', duration: 45, type: 'practice', topic: 'Pharmacology' },
  { id: '3', date: '2023-10-23', duration: 180, type: 'test', topic: 'Mock Exam 01' },
];

const DailyTracker: React.FC = () => {
  const navigate = useNavigate();
  const [consistencyScore] = useState(84);
  const [streakCount] = useState(12);
  const [isIdleDay] = useState(false); // Simulated detection

  const stats = [
    { label: 'Weekly Average', value: '4.2h' },
    { label: 'Total Hours', value: '156h' },
    { label: 'Idle Days (30d)', value: '2' },
  ];

  return (
    <div className="pb-40 bg-oneui-bg min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <h1 className="text-4xl font-light text-slate-900 leading-tight">Study<br/><span className="font-bold">Tracker</span></h1>
      </div>

      <div className="px-5 space-y-6 -mt-4">
        {/* 1. Consistency Circle & Streak */}
        <div className="bg-white rounded-samsung p-8 shadow-sm border border-slate-100 flex flex-col items-center gap-6">
          <div className="relative w-48 h-48 flex items-center justify-center">
             <svg className="w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="88" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                <circle 
                  cx="96" cy="96" r="88" fill="none" stroke="#4c6ef5" strokeWidth="12" 
                  strokeDasharray={`${(consistencyScore / 100) * 553} 553`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-slate-900">{consistencyScore}%</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consistency</span>
             </div>
          </div>

          <div className="w-full flex justify-between items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xl shadow-inner">
                   <i className="fa-solid fa-fire"></i>
                </div>
                <div>
                  <p className="text-xl font-black text-slate-900">{streakCount} Days</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Streak</p>
                </div>
             </div>
             <button className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-300">
                <i className="fa-solid fa-share-nodes text-xs"></i>
             </button>
          </div>
        </div>

        {/* 2. Idle Day Detection Alert */}
        {isIdleDay && (
          <div className="bg-amber-50 border border-amber-100 p-6 rounded-samsung flex items-center gap-5 animate-in shake duration-500">
             <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-amber-500 text-2xl shadow-sm">
                <i className="fa-solid fa-cloud-sun"></i>
             </div>
             <div className="flex-1">
                <h4 className="font-black text-slate-900 text-sm">You've been idle today!</h4>
                <p className="text-xs text-amber-700 font-medium">Don't break your {streakCount}-day streak. Log a 10 min session to stay active.</p>
             </div>
          </div>
        )}

        {/* 3. Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center space-y-1">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
               <p className="text-lg font-black text-slate-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* 4. Study Logs */}
        <div className="space-y-4">
           <div className="flex justify-between items-center px-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Activity</h3>
              <button className="text-[10px] font-black text-oneui-blue uppercase">Full History</button>
           </div>
           
           <div className="space-y-3">
              {MOCK_LOGS.map(log => (
                <div key={log.id} className="bg-white p-5 rounded-samsung border border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                        {log.type === 'video' && <i className="fa-solid fa-play"></i>}
                        {log.type === 'practice' && <i className="fa-solid fa-stethoscope"></i>}
                        {log.type === 'test' && <i className="fa-solid fa-file-invoice"></i>}
                      </div>
                      <div>
                        <h5 className="font-black text-slate-900 text-sm">{log.topic}</h5>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.duration} mins • {new Date(log.date).toLocaleDateString()}</p>
                      </div>
                   </div>
                   <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-emerald-500">
                      <i className="fa-solid fa-check"></i>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* 5. Manual Log Button */}
        <button className="w-full h-16 bg-slate-900 text-white rounded-samsung font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all">
          <i className="fa-solid fa-plus mr-2"></i> Log New Session
        </button>
      </div>
    </div>
  );
};

export default DailyTracker;
