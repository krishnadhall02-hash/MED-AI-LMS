
import React, { useState, useEffect } from 'react';
import { generateStudyPlan } from '../services/gemini';
import { DailyStudyPlan, PerformanceStats } from '../types';

const MOCK_STATS: PerformanceStats = {
  rank: 1242,
  percentile: 98.4,
  totalTests: 45,
  avgAccuracy: 78,
  subjectWise: [
    { subject: 'Anatomy', accuracy: 85, total: 120 },
    { subject: 'Physiology', accuracy: 72, total: 95 },
    { subject: 'Pharma', accuracy: 55, total: 150 },
  ],
  confidenceRatio: [],
  strengths: ['Neuroanatomy', 'CVS Physiology'],
  weaknesses: ['Antiviral Drugs', 'Pharmacokinetics']
};

const StudyPlanner: React.FC = () => {
  const [plan, setPlan] = useState<DailyStudyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      setIsLoading(true);
      const res = await generateStudyPlan(MOCK_STATS);
      setPlan(res);
      setIsLoading(false);
    };
    fetchPlan();
  }, []);

  const getTaskIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video': return 'fa-play';
      case 'note': return 'fa-file-lines';
      case 'quiz': return 'fa-bolt';
      case 'practice': return 'fa-stethoscope';
      default: return 'fa-book-open';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-50 text-red-600 border-red-100';
      case 'medium': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    }
  };

  return (
    <div className="pb-40 bg-oneui-bg min-h-screen">
      {/* 1. Header */}
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <h1 className="text-4xl font-light text-slate-900 leading-tight">Daily<br/><span className="font-bold">Study Plan</span></h1>
        <div className="mt-4 flex items-center gap-2">
           <div className="px-3 py-1 bg-white border border-slate-200 rounded-full flex items-center gap-2 shadow-sm">
              <i className="fa-solid fa-calendar-day text-[10px] text-oneui-blue"></i>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
           </div>
        </div>
      </div>

      <div className="px-5 space-y-6 -mt-4">
        {isLoading ? (
          <div className="bg-white rounded-samsung p-10 text-center space-y-4 shadow-sm border border-slate-100">
            <div className="w-16 h-16 bg-blue-50 text-oneui-blue rounded-full mx-auto flex items-center justify-center text-2xl animate-spin">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <p className="font-bold text-slate-800">AI is analyzing your performance...</p>
            <p className="text-xs text-slate-400">Crafting a high-yield schedule to fix your weak areas.</p>
          </div>
        ) : plan ? (
          <>
            {/* 2. AI Insight / Smart Nudge */}
            <div className="bg-slate-900 rounded-[32px] p-8 text-white space-y-4 shadow-2xl relative overflow-hidden group animate-in slide-in-from-bottom duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-oneui-blue/20 rounded-full -mr-16 -mt-16 blur-3xl" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-oneui-blue rounded-xl flex items-center justify-center text-xl">
                  <i className="fa-solid fa-brain"></i>
                </div>
                <h3 className="font-bold text-lg">AI Strategy Summary</h3>
              </div>
              <p className="text-sm font-medium leading-relaxed opacity-90 relative z-10 italic">
                "{plan.summary}"
              </p>
              <div className="pt-2 relative z-10">
                <span className="text-[10px] font-black text-oneui-blue uppercase tracking-widest">Core Focus:</span>
                <p className="text-sm font-bold mt-1 text-blue-100">{plan.focusArea}</p>
              </div>
            </div>

            {/* 3. Task List */}
            <div className="space-y-4 animate-in fade-in duration-700 delay-200">
              <div className="flex justify-between items-center px-2">
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recommended Actions</h4>
                 <span className="text-[10px] font-bold text-slate-400">{plan.tasks.length} Items</span>
              </div>
              
              {plan.tasks.map((task, i) => (
                <div 
                  key={i} 
                  className="bg-white p-5 rounded-samsung border border-slate-100 shadow-sm flex items-center gap-5 active:scale-95 transition-all cursor-pointer group"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-xl transition-colors group-hover:bg-blue-50 group-hover:text-oneui-blue`}>
                    <i className={`fa-solid ${getTaskIcon(task.type)}`}></i>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                       <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border ${getPriorityColor(task.priority)}`}>
                         {task.priority} Priority
                       </span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{task.subject}</span>
                    </div>
                    <h5 className="font-black text-slate-900 leading-tight">{task.title}</h5>
                    <div className="flex items-center gap-3">
                       <div className="flex items-center gap-1 text-slate-400">
                          <i className="fa-regular fa-clock text-[10px]"></i>
                          <span className="text-[10px] font-bold">{task.duration}</span>
                       </div>
                       <div className="flex items-center gap-1 text-oneui-blue">
                          <i className="fa-solid fa-info-circle text-[10px]"></i>
                          <span className="text-[10px] font-bold truncate max-w-[150px]">{task.reason}</span>
                       </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                     <i className="fa-solid fa-play text-xs ml-0.5"></i>
                  </div>
                </div>
              ))}
            </div>

            {/* 4. Completion Tracker Simulation */}
            <div className="bg-white p-8 rounded-samsung border border-slate-100 text-center space-y-4">
               <div className="w-20 h-2 bg-slate-100 rounded-full mx-auto relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-oneui-blue transition-all duration-1000" style={{ width: '0%' }}></div>
               </div>
               <p className="text-xs font-bold text-slate-500">0 of {plan.tasks.length} tasks completed today</p>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed px-8">
                 Complete all tasks to maintain your 12-day streak and improve your rank.
               </p>
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-slate-400">
             <i className="fa-solid fa-triangle-exclamation text-4xl mb-4"></i>
             <p className="font-bold">Couldn't load plan. Try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPlanner;
