
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  Cell, PieChart, Pie 
} from 'recharts';

const MOCK_STATS = {
  rank: 1242,
  percentile: 98.4,
  totalTests: 45,
  avgAccuracy: 78,
  trend: '+4.2%',
  subjectWise: [
    { subject: 'Anatomy', accuracy: 85, color: '#4c6ef5' },
    { subject: 'Physiology', accuracy: 72, color: '#4c6ef5' },
    { subject: 'Biochemistry', accuracy: 68, color: '#4c6ef5' },
    { subject: 'Pathology', accuracy: 92, color: '#4c6ef5' },
    { subject: 'Pharmacology', accuracy: 55, color: '#ef4444' },
  ],
  confidenceRatio: [
    { name: 'Confident Correct', value: 65, color: '#10b981' },
    { name: 'Lucky Guesses', value: 15, color: '#fbbf24' },
    { name: 'Confident Wrong', value: 20, color: '#ef4444' },
  ],
  strengths: [
    { name: 'Neuroanatomy', subject: 'Anatomy' },
    { name: 'General Pathology', subject: 'Pathology' }
  ],
  weaknesses: [
    { name: 'Antiviral Drugs', subject: 'Pharmacology' },
    { name: 'Enzyme Kinetics', subject: 'Biochemistry' }
  ]
};

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  return (
    <div className="pb-40 bg-oneui-bg min-h-screen">
      {/* One UI Large Title Header */}
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 bg-oneui-bg relative">
        <button onClick={() => navigate(-1)} className="absolute top-4 left-6 w-12 h-12 flex items-center justify-center text-slate-400 active:scale-90">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="text-4xl font-light text-slate-900 leading-tight">Your<br/><span className="font-bold">Performance</span></h1>
        
        {/* Time Range Selector */}
        <div className="mt-8 flex bg-white/50 backdrop-blur-md p-1 rounded-2xl w-fit shadow-sm border border-slate-100">
           {(['7d', '30d', 'all'] as const).map(range => (
             <button
               key={range}
               onClick={() => setTimeRange(range)}
               className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 timeRange === range ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'
               }`}
             >
               {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : 'All Time'}
             </button>
           ))}
        </div>
      </div>

      <div className="px-5 space-y-6 -mt-4">
        
        {/* PART B.4: RANK & PERCENTILE CARD */}
        <div className="bg-white rounded-samsung p-8 shadow-sm border border-slate-100 space-y-8">
           <div className="grid grid-cols-2 gap-8 divide-x divide-slate-50">
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Rank</p>
                 <p className="text-4xl font-black text-slate-900 tracking-tighter">#{MOCK_STATS.rank.toLocaleString()}</p>
                 <p className="text-[10px] font-bold text-emerald-500 mt-1 flex items-center justify-center gap-1">
                    <i className="fa-solid fa-arrow-up"></i> 124 Up
                 </p>
              </div>
              <div className="text-center pl-8">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Percentile</p>
                 <p className="text-4xl font-black text-oneui-blue tracking-tighter">{MOCK_STATS.percentile}%</p>
                 <p className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-widest">Elite Tier</p>
              </div>
           </div>
           <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <span>Mastery Progress</span>
                 <span>Top 1.6% of Students</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-oneui-blue transition-all duration-1000" style={{ width: `${MOCK_STATS.percentile}%` }} />
              </div>
           </div>
        </div>

        {/* PART B.1: SUBJECT-WISE ACCURACY */}
        <div className="bg-white rounded-samsung p-8 shadow-sm border border-slate-100 space-y-6">
           <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Subject Accuracy</h3>
              <i className="fa-solid fa-chart-simple text-slate-200"></i>
           </div>
           
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={MOCK_STATS.subjectWise} layout="vertical" margin={{ left: -20 }}>
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis 
                      dataKey="subject" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} 
                      width={90}
                    />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="accuracy" radius={[0, 8, 8, 0]} barSize={24}>
                       {MOCK_STATS.subjectWise.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.accuracy > 70 ? '#4c6ef5' : '#ef4444'} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* PART B.3: GUESS VS CONFIDENT (CONFIDENCE AUDIT) */}
        <div className="bg-white rounded-samsung p-8 shadow-sm border border-slate-100 space-y-6">
           <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Confidence Audit</h3>
              <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 text-xs active:scale-90 transition-all">
                 <i className="fa-solid fa-info"></i>
              </button>
           </div>
           
           <div className="flex items-center gap-10">
              <div className="w-32 h-32">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={MOCK_STATS.confidenceRatio}
                          innerRadius={35}
                          outerRadius={55}
                          paddingAngle={6}
                          dataKey="value"
                       >
                          {MOCK_STATS.confidenceRatio.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                       </Pie>
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                 {MOCK_STATS.confidenceRatio.map((item, i) => (
                   <div key={i} className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.name}</span>
                      </div>
                      <span className="text-lg font-black text-slate-800 ml-4">{item.value}%</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* PART B.2: TOPIC STRENGTH & WEAKNESS */}
        <div className="space-y-4">
           <div className="flex justify-between items-center px-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Topic Insights</h3>
           </div>
           
           <div className="grid grid-cols-1 gap-4">
              {/* Strengths */}
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-samsung space-y-4">
                 <div className="flex items-center gap-3 text-emerald-600">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                       <i className="fa-solid fa-circle-check"></i>
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest">Key Strengths</h4>
                 </div>
                 <div className="space-y-2">
                    {MOCK_STATS.strengths.map((s, i) => (
                      <div key={i} className="bg-white/80 p-3 rounded-xl border border-emerald-100/50 flex justify-between items-center">
                         <p className="text-xs font-black text-slate-900">{s.name}</p>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.subject}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Weaknesses */}
              <div className="bg-red-50 border border-red-100 p-6 rounded-samsung space-y-4">
                 <div className="flex items-center gap-3 text-red-600">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                       <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest">Critical Gaps</h4>
                 </div>
                 <div className="space-y-3">
                    {MOCK_STATS.weaknesses.map((w, i) => (
                      <div key={i} className="bg-white/80 p-4 rounded-xl border border-red-100/50 flex items-center justify-between">
                         <div>
                            <p className="text-xs font-black text-slate-900">{w.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{w.subject}</p>
                         </div>
                         <button 
                           onClick={() => navigate('/practice')}
                           className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-200 active:scale-95 transition-all"
                         >
                            Practice Now
                         </button>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* AI STRATEGY RECOMMENDATION (PREMIUM CARD) */}
        <div className="bg-slate-900 rounded-[32px] p-8 text-white space-y-6 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-oneui-blue/20 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-oneui-blue/40" />
           <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-oneui-blue rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <h4 className="font-bold text-lg leading-tight">Smart Strategy Summary</h4>
           </div>
           <p className="text-sm font-medium leading-relaxed opacity-80 relative z-10">
             Your high scores in <span className="text-oneui-blue font-bold">Anatomy</span> and <span className="text-oneui-blue font-bold">Pathology</span> are carrying your rank, but <span className="text-red-400 font-bold">Pharmacology</span> lag is preventing you from reaching the Top 500. Focus on Autonomic Nervous System MCQ practice today to boost your percentile by ~2.4%.
           </p>
           <button 
             onClick={() => navigate('/planner')}
             className="w-full h-14 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all relative z-10"
           >
             Update Daily Plan
           </button>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
