
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

  const stats = [
    { label: 'Weekly Avg', value: '4.2h' },
    { label: 'Total Sync', value: '156h' },
    { label: 'Idle Days', value: '2' },
  ];

  return (
    <div className="pb-40 bg-synapse-blue-light min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <h1 className="text-4xl font-light text-synapse-text-primary leading-tight tracking-tight">
          Study<br/>
          <span className="font-black tracking-[0.2em] uppercase text-synapse-blue-primary text-3xl">Tracker</span>
        </h1>
      </div>

      <div className="px-5 space-y-8 -mt-4">
        {/* 1. Consistency Mastery Card */}
        <div className="bg-white rounded-samsung p-8 shadow-lg border border-white flex flex-col items-center gap-8 card-shadow">
          <div className="relative w-56 h-56 flex items-center justify-center">
             <svg className="w-full h-full -rotate-90">
                <circle cx="112" cy="112" r="100" fill="none" stroke="#f1f5f9" strokeWidth="16" />
                <circle 
                  cx="112" cy="112" r="100" fill="none" stroke="#0ea5e9" strokeWidth="16" 
                  strokeDasharray={`${(consistencyScore / 100) * 628} 628`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out drop-shadow-sm"
                />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                <span className="text-6xl font-black text-synapse-text-primary tracking-tighter">{consistencyScore}%</span>
                <span className="text-[10px] font-black text-synapse-blue-primary uppercase tracking-[0.3em]">Consistency</span>
             </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-4">
             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
                <i className="fa-solid fa-fire text-orange-500 text-2xl"></i>
                <div>
                   <p className="text-2xl font-black text-synapse-text-primary">{streakCount}</p>
                   <p className="text-[8px] font-black text-synapse-text-secondary uppercase tracking-widest">Active Streak</p>
                </div>
             </div>
             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
                <i className="fa-solid fa-award text-amber-500 text-2xl"></i>
                <div>
                   <p className="text-2xl font-black text-synapse-text-primary">Elite</p>
                   <p className="text-[8px] font-black text-synapse-text-secondary uppercase tracking-widest">Tier Rank</p>
                </div>
             </div>
          </div>
        </div>

        {/* 2. Semantic Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-white text-center space-y-1 shadow-sm card-shadow">
               <p className="text-[9px] font-black text-synapse-text-secondary uppercase tracking-widest">{s.label}</p>
               <p className="text-xl font-black text-synapse-text-primary">{s.value}</p>
            </div>
          ))}
        </div>

        {/* 3. Activity Archive with 3-Tier Typography */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-[0.2em] px-2">Archive history</h3>
           <div className="space-y-3">
              {MOCK_LOGS.map(log => (
                <div key={log.id} className="bg-white p-6 rounded-samsung border border-white flex items-center justify-between active:scale-[0.98] transition-all shadow-sm card-shadow">
                   <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                        {log.type === 'video' && <i className="fa-solid fa-play"></i>}
                        {log.type === 'practice' && <i className="fa-solid fa-stethoscope"></i>}
                        {log.type === 'test' && <i className="fa-solid fa-file-invoice"></i>}
                      </div>
                      <div>
                        <h5 className="font-black text-synapse-text-primary text-sm leading-tight">{log.topic}</h5>
                        <p className="text-[9px] font-bold text-synapse-text-secondary uppercase tracking-[0.1em] mt-1">
                           {log.duration} MINS <span className="mx-2 text-slate-100">|</span> {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                   </div>
                   <div className="w-8 h-8 bg-synapse-blue-primary/10 text-synapse-blue-primary rounded-full flex items-center justify-center border border-synapse-blue-primary/10">
                      <i className="fa-solid fa-check text-[10px]"></i>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* 4. Action CTA */}
        <div className="pt-4">
          <button className="w-full h-20 bg-synapse-blue-primary text-white rounded-samsung font-black text-sm uppercase tracking-[0.3em] shadow-lg active:scale-95 transition-all">
            Initiate Neural Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyTracker;
