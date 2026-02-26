
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
      <div className="h-screen flex items-center justify-center p-8 text-center bg-synapse-blue-light">
        <div className="space-y-6">
          <i className="fa-solid fa-ghost text-6xl text-synapse-text-secondary opacity-20"></i>
          <h2 className="text-xl font-bold text-synapse-text-primary">No results found</h2>
          <button onClick={() => navigate('/')} className="px-8 py-3 bg-synapse-blue-primary text-white rounded-xl font-black uppercase tracking-widest">Go Home</button>
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
    <div className="pb-32 bg-synapse-blue-light min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <div className="flex justify-between items-center mb-2">
           <h1 className="text-4xl font-light text-synapse-text-primary leading-tight tracking-tight">Exam<br/><span className="font-bold">Summary</span></h1>
           {isSpeedTest && (
             <span className="bg-synapse-warning text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-synapse-warning/20">Speed Mode</span>
           )}
        </div>
      </div>

      <div className="px-5 space-y-6 -mt-4">
        {/* Main Score Card */}
        <div className="bg-white border border-white rounded-samsung p-8 text-center space-y-6 card-shadow">
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
                <p className="text-4xl font-black text-synapse-text-primary">{result.score}</p>
                <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">Points</p>
             </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <p className="text-xl font-black text-emerald-500">{result.correctAnswers}</p>
              <p className="text-[9px] font-black text-synapse-text-secondary uppercase tracking-widest">Correct</p>
            </div>
            <div className="space-y-1">
              <p className="text-xl font-black text-red-500">{result.incorrectAnswers}</p>
              <p className="text-[9px] font-black text-synapse-text-secondary uppercase tracking-widest">Incorrect</p>
            </div>
            <div className="space-y-1">
              <p className="text-xl font-black text-synapse-text-secondary">{result.unanswered}</p>
              <p className="text-[9px] font-black text-synapse-text-secondary uppercase tracking-widest">Skipped</p>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-samsung border border-white card-shadow">
             <div className="flex items-center gap-3 mb-2 text-synapse-blue-primary opacity-60">
                <i className="fa-solid fa-bullseye"></i>
                <p className="text-[10px] font-black uppercase tracking-widest">Accuracy</p>
             </div>
             <p className="text-2xl font-black text-synapse-text-primary">{Math.round(result.accuracy)}%</p>
          </div>
          <div className="bg-white p-6 rounded-samsung border border-white card-shadow">
             <div className="flex items-center gap-3 mb-2 text-synapse-warning opacity-60">
                <i className="fa-solid fa-gauge-high"></i>
                <p className="text-[10px] font-black uppercase tracking-widest">Avg Speed</p>
             </div>
             <p className="text-2xl font-black text-synapse-text-primary">{secPerQ}s <span className="text-[10px] text-synapse-text-secondary uppercase">/ q</span></p>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-synapse-blue-primary text-white p-8 rounded-[32px] space-y-4 shadow-2xl shadow-synapse-blue-primary/10">
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
           <button className="w-full h-14 bg-white/10 rounded-2xl font-black text-xs uppercase tracking-widest active:bg-white/20 transition-all border border-white/20">
             Review Neural Gaps
           </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pb-12">
          <button 
            onClick={() => navigate('/test-review')}
            className="h-16 bg-white border-2 border-synapse-blue-primary text-synapse-blue-primary rounded-samsung font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-synapse-blue-primary/5"
          >
            Review Test
          </button>
          <button 
            onClick={() => navigate('/practice')}
            className="h-16 bg-synapse-blue-primary text-white rounded-samsung font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            Practice Similar
          </button>
          <button 
            onClick={() => navigate('/')}
            className="h-16 bg-white border border-synapse-blue-soft text-synapse-text-primary rounded-samsung font-black uppercase tracking-widest active:scale-95 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
