
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { ExamResult } from '../types';

const COLORS = ['#10b981', '#f87171', '#64748b'];

const TestResults: React.FC = () => {
  const navigate = useNavigate();
  const rawResult = sessionStorage.getItem('last_exam_result');
  const isSpeedTest = sessionStorage.getItem('is_speed_test') === 'true';
  const result: ExamResult | null = rawResult ? JSON.parse(rawResult) : null;

  if (!result) {
    return (
      <div className="h-screen flex items-center justify-center p-8 text-center bg-oneui-bg">
        <div className="space-y-6">
          <i className="fa-solid fa-ghost text-6xl text-oneui-text-muted opacity-20"></i>
          <h2 className="text-xl font-bold text-oneui-text-primary">No results found</h2>
          <button onClick={() => navigate('/')} className="px-8 py-3 bg-synapse-aqua text-synapse-deep rounded-xl font-black uppercase tracking-widest">Go Home</button>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: 'Correct', value: result.correctAnswers },
    { name: 'Incorrect', value: result.incorrectAnswers },
    { name: 'Unanswered', value: result.unanswered },
  ];

  const barData = Object.keys(result.subjectBreakdown).map(subj => ({
    name: subj,
    accuracy: Math.round((result.subjectBreakdown[subj].correct / result.subjectBreakdown[subj].total) * 100)
  }));

  const secPerQ = Math.round(result.timeSpent / result.totalQuestions);

  return (
    <div className="pb-32 bg-oneui-bg min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <div className="flex justify-between items-center mb-2">
           <h1 className="text-4xl font-light text-oneui-text-primary leading-tight tracking-tight">Exam<br/><span className="font-bold">Summary</span></h1>
           {isSpeedTest && (
             <span className="bg-amber-500 text-synapse-deep text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-amber-500/20">Speed Mode</span>
           )}
        </div>
      </div>

      <div className="px-5 space-y-6 -mt-4">
        {/* Main Score Card */}
        <div className="bg-synapse-surface/80 border border-synapse-border rounded-samsung p-8 text-center space-y-6 backdrop-blur-sm">
          <div className="relative w-40 h-40 mx-auto">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-black text-oneui-text-primary">{result.score}</p>
                <p className="text-[10px] font-black text-oneui-text-muted uppercase tracking-widest">Points</p>
             </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <p className="text-xl font-black text-emerald-400">{result.correctAnswers}</p>
              <p className="text-[9px] font-black text-oneui-text-muted uppercase tracking-widest">Correct</p>
            </div>
            <div className="space-y-1">
              <p className="text-xl font-black text-red-400">{result.incorrectAnswers}</p>
              <p className="text-[9px] font-black text-oneui-text-muted uppercase tracking-widest">Incorrect</p>
            </div>
            <div className="space-y-1">
              <p className="text-xl font-black text-oneui-text-muted">{result.unanswered}</p>
              <p className="text-[9px] font-black text-oneui-text-muted uppercase tracking-widest">Skipped</p>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-synapse-surface/40 p-6 rounded-samsung border border-synapse-border">
             <div className="flex items-center gap-3 mb-2 text-synapse-aqua opacity-60">
                <i className="fa-solid fa-bullseye"></i>
                <p className="text-[10px] font-black uppercase tracking-widest">Accuracy</p>
             </div>
             <p className="text-2xl font-black text-oneui-text-primary">{Math.round(result.accuracy)}%</p>
          </div>
          <div className="bg-synapse-surface/40 p-6 rounded-samsung border border-synapse-border">
             <div className="flex items-center gap-3 mb-2 text-amber-400 opacity-60">
                <i className="fa-solid fa-gauge-high"></i>
                <p className="text-[10px] font-black uppercase tracking-widest">Avg Speed</p>
             </div>
             <p className="text-2xl font-black text-oneui-text-primary">{secPerQ}s <span className="text-[10px] text-oneui-text-muted uppercase">/ q</span></p>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-synapse-aqua text-synapse-deep p-8 rounded-[32px] space-y-4 shadow-2xl shadow-synapse-aqua/10">
           <div className="flex items-center gap-3">
              <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
              <h4 className="font-black text-lg uppercase tracking-tight">AI Report Analysis</h4>
           </div>
           <p className="text-sm font-bold leading-relaxed opacity-90">
             {isSpeedTest 
               ? `In High-Pressure Speed Mode, you maintained ${Math.round(result.accuracy)}% accuracy. This mimics clinical real-time decision making required for INI-CET.`
               : `Your performance in Anatomy is peak, but Pharmacology lag is visible. We've updated your daily study plan to focus on drug mechanisms.`
             }
           </p>
           <button className="w-full h-14 bg-synapse-deep/10 rounded-2xl font-black text-xs uppercase tracking-widest active:bg-synapse-deep/20 transition-all border border-synapse-deep/20">
             Review Neural Gaps
           </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pb-12">
          <button 
            onClick={() => navigate('/practice')}
            className="h-16 bg-synapse-aqua text-synapse-deep rounded-samsung font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            Review Mistakes
          </button>
          <button 
            onClick={() => navigate('/')}
            className="h-16 bg-synapse-surface border border-synapse-border text-oneui-text-primary rounded-samsung font-black uppercase tracking-widest active:scale-95 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
