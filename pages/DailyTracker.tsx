
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
    <div className="pb-40 bg-transparent min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <h1 className="text-4xl font-light text-oneui-text-primary leading-tight tracking-tight">
          Study<br/>
          <span className="font-black tracking-[0.2em] uppercase text-synapse-aqua text-3xl">Tracker</span>
        </h1>
      </div>

      <div className="px-5 space-y-8 -mt-4">
        {/* 1. Consistency Mastery Card */}
        <div className="bg-synapse-surface/80 rounded-samsung p-8 shadow-2xl border border-synapse-border flex flex-col items-center gap-8 backdrop-blur-md">
          <div className="relative w-56 h-56 flex items-center justify-center">
             <svg className="w-full h-full -rotate-90">
                <circle cx="112" cy="112" r="100" fill="none" stroke="#020617" strokeWidth="16" />
                <circle 
                  cx="112" cy="112" r="100" fill="none" stroke="#2dd4bf" strokeWidth="16" 
                  strokeDasharray={`${(consistencyScore / 100) * 628} 628`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out drop-shadow-[0_0_12px_rgba(45,212,191,0.6)]"
                />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                <span className="text-6xl font-black text-oneui-text-primary tracking-tighter">{consistencyScore}%</span>
                <span className="text-[10px] font-black text-synapse-aqua uppercase tracking-[0.3em]">Consistency</span>
             </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-4">
             <div className="bg-synapse-deep p-6 rounded-2xl border border-synapse-border flex items-center gap-4">
                <i className="fa-solid fa-fire text-synapse-aqua text-2xl"></i>
                <div>
                   <p className="text-2xl font-black text-oneui-text-primary">{streakCount}</p>
                   <p className="text-[8px] font-black text-oneui-text-muted uppercase tracking-widest">Active Streak</p>
                </div>
             </div>
             <div className="bg-synapse-deep p-6 rounded-2xl border border-synapse-border flex items-center gap-4">
                <i className="fa-solid fa-award text-synapse-warning text-2xl"></i>
                <div>
                   <p className="text-2xl font-black text-oneui-text-primary">Elite</p>
                   <p className="text-[8px] font-black text-oneui-text-muted uppercase tracking-widest">Tier Rank</p>
                </div>
             </div>
          </div>
        </div>

        {/* 2. Semantic Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s, i) => (
            <div key={i} className="bg-synapse-surface p-5 rounded-2xl border border-synapse-border text-center space-y-1">
               <p className="text-[9px] font-black text-oneui-text-muted uppercase tracking-widest">{s.label}</p>
               <p className="text-xl font-black text-oneui-text-primary">{s.value}</p>
            </div>
          ))}
        </div>

        {/* 3. Activity Archive with 3-Tier Typography */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black text-oneui-text-muted uppercase tracking-[0.2em] px-2">Archive history</h3>
           <div className="space-y-3">
              {MOCK_LOGS.map(log => (
                <div key={log.id} className="bg-synapse-surface p-6 rounded-samsung border border-synapse-border flex items-center justify-between active:scale-[0.98] transition-all">
                   <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-synapse-deep rounded-xl flex items-center justify-center text-oneui-text-muted border border-synapse-border">
                        {log.type === 'video' && <i className="fa-solid fa-play"></i>}
                        {log.type === 'practice' && <i className="fa-solid fa-stethoscope"></i>}
                        {log.type === 'test' && <i className="fa-solid fa-file-invoice"></i>}
                      </div>
                      <div>
                        <h5 className="font-black text-oneui-text-primary text-sm leading-tight">{log.topic}</h5>
                        <p className="text-[9px] font-bold text-oneui-text-secondary uppercase tracking-[0.1em] mt-1">
                           {log.duration} MINS <span className="mx-2 text-synapse-border">|</span> {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                   </div>
                   <div className="w-8 h-8 bg-synapse-aqua/10 text-synapse-aqua rounded-full flex items-center justify-center border border-synapse-aqua/20">
                      <i className="fa-solid fa-check text-[10px]"></i>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* 4. Action CTA */}
        <div className="pt-4">
          <button className="w-full h-20 bg-synapse-aqua text-synapse-deep rounded-samsung font-black text-sm uppercase tracking-[0.3em] shadow-[0_10px_40px_rgba(45,212,191,0.3)] active:scale-95 transition-all">
            Initiate Neural Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyTracker;
