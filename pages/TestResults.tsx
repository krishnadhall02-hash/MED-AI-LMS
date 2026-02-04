
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { ExamResult } from '../types';

const COLORS = ['#10b981', '#ef4444', '#94a3b8'];

const TestResults: React.FC = () => {
  const navigate = useNavigate();
  const rawResult = sessionStorage.getItem('last_exam_result');
  const result: ExamResult | null = rawResult ? JSON.parse(rawResult) : null;

  if (!result) {
    return (
      <div className="h-screen flex items-center justify-center p-8 text-center bg-oneui-bg">
        <div className="space-y-6">
          <i className="fa-solid fa-ghost text-6xl text-slate-200"></i>
          <h2 className="text-xl font-bold text-slate-800">No results found</h2>
          <button onClick={() => navigate('/')} className="px-8 py-3 bg-oneui-blue text-white rounded-xl font-bold">Go Home</button>
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

  return (
    <div className="pb-32 bg-oneui-bg min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <h1 className="text-4xl font-light text-slate-900 leading-tight">Exam<br/><span className="font-bold">Report Card</span></h1>
      </div>

      <div className="px-5 space-y-6 -mt-4">
        {/* Main Score Card */}
        <div className="bg-white rounded-samsung p-8 shadow-sm border border-slate-100 text-center space-y-6">
          <div className="relative w-40 h-40 mx-auto">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-black text-slate-900">{result.score}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Points</p>
             </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <p className="text-xl font-black text-emerald-500">{result.correctAnswers}</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Correct</p>
            </div>
            <div className="space-y-1">
              <p className="text-xl font-black text-red-500">{result.incorrectAnswers}</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Incorrect</p>
            </div>
            <div className="space-y-1">
              <p className="text-xl font-black text-slate-400">{result.unanswered}</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Skipped</p>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-samsung shadow-sm border border-slate-100">
             <div className="flex items-center gap-3 mb-2 text-oneui-blue">
                <i className="fa-solid fa-bullseye"></i>
                <p className="text-[10px] font-black uppercase tracking-widest">Accuracy</p>
             </div>
             <p className="text-2xl font-black text-slate-800">{Math.round(result.accuracy)}%</p>
          </div>
          <div className="bg-white p-6 rounded-samsung shadow-sm border border-slate-100">
             <div className="flex items-center gap-3 mb-2 text-amber-500">
                <i className="fa-solid fa-hourglass-half"></i>
                <p className="text-[10px] font-black uppercase tracking-widest">Time Taken</p>
             </div>
             <p className="text-2xl font-black text-slate-800">{Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s</p>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white rounded-samsung p-6 shadow-sm border border-slate-100 space-y-6">
          <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Subject Analysis</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 'bold'}} />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#4c6ef5" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-indigo-600 p-8 rounded-[32px] text-white space-y-4 shadow-xl shadow-indigo-100">
           <div className="flex items-center gap-3">
              <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
              <h4 className="font-bold text-lg">AI Performance Insight</h4>
           </div>
           <p className="text-sm font-medium leading-relaxed opacity-90">
             Your accuracy in <span className="font-black underline">Anatomy</span> is exceptional (100%), but you struggled with complex <span className="font-black underline">Pharmacology</span> cases. We recommend a focused revision on Autonomic Nervous System drugs before your next mock.
           </p>
           <button className="w-full h-14 bg-white/20 backdrop-blur-md rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
             Generate Revision Plan
           </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate('/practice')}
            className="h-16 bg-slate-900 text-white rounded-samsung font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            Review Mistakes
          </button>
          <button 
            onClick={() => navigate('/')}
            className="h-16 bg-white border border-slate-200 text-slate-800 rounded-samsung font-black uppercase tracking-widest active:scale-95 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
