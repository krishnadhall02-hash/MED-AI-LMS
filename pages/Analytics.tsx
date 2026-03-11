
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  Cell, PieChart, Pie, LineChart, Line, CartesianGrid
} from 'recharts';

const MOCK_STATS = {
  rank: 1242,
  percentile: 98.4,
  totalTests: 45,
  avgAccuracy: 78,
  trend: '+4.2%',
  skillIndex: 842,
  adaptiveLevel: 4, // Clinical Case
  adaptiveHistory: [
    { day: 'Mon', level: 2, skill: 650 },
    { day: 'Tue', level: 2, skill: 680 },
    { day: 'Wed', level: 3, skill: 720 },
    { day: 'Thu', level: 3, skill: 750 },
    { day: 'Fri', level: 4, skill: 810 },
    { day: 'Sat', level: 4, skill: 842 },
  ],
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
    <div className="pb-40 bg-synapse-blue-light min-h-screen" aria-label="Performance Analysis Screen" data-screen-name="Performance Analysis">
      {/* One UI Large Title Header */}
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 relative">
        <button onClick={() => navigate(-1)} className="absolute top-4 left-6 w-12 h-12 flex items-center justify-center text-synapse-text-secondary active:scale-90">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="text-4xl font-light text-synapse-text-primary leading-tight tracking-tight">Your<br/><span className="font-bold">Performance</span></h1>
        
        {/* Time Range Selector */}
        <div className="mt-8 flex bg-white/50 backdrop-blur-md p-1 rounded-2xl w-fit border border-synapse-blue-soft">
           {(['7d', '30d', 'all'] as const).map(range => (
             <button
               key={range}
               onClick={() => setTimeRange(range)}
               className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 timeRange === range ? 'bg-synapse-blue-primary text-white shadow-md' : 'text-synapse-text-secondary hover:text-synapse-text-primary'
               }`}
             >
               {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : 'All Time'}
             </button>
           ))}
        </div>
      </div>

      <div className="px-5 space-y-6 -mt-4">
        
        {/* ADAPTIVE MASTERY INSIGHTS */}
        <div className="bg-white rounded-samsung p-8 border border-white space-y-6 shadow-lg overflow-hidden relative card-shadow">
           <div className="absolute top-0 right-0 w-64 h-64 bg-synapse-blue-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
           
           <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-synapse-blue-primary/10 rounded-xl flex items-center justify-center text-synapse-blue-primary border border-synapse-blue-primary/10">
                    <i className="fa-solid fa-microchip"></i>
                 </div>
                 <div>
                    <h3 className="font-black text-synapse-text-primary uppercase text-xs tracking-widest">Adaptive Mastery</h3>
                    <p className="text-[10px] font-bold text-synapse-text-secondary uppercase tracking-widest">AI-Driven Progression</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">Skill Index</p>
                 <p className="text-2xl font-black text-synapse-blue-primary">{MOCK_STATS.skillIndex}</p>
              </div>
           </div>

           <div className="h-48 w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={MOCK_STATS.adaptiveHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#00000005" vertical={false} />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} 
                    />
                    <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#0ea5e9', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="skill" 
                      stroke="#0ea5e9" 
                      strokeWidth={4} 
                      dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4, stroke: '#ffffff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                 </LineChart>
              </ResponsiveContainer>
           </div>

           <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                 <p className="text-[9px] font-black text-synapse-text-secondary uppercase tracking-widest mb-1">Current Level</p>
                 <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-synapse-text-primary">Level {MOCK_STATS.adaptiveLevel}</span>
                    <span className="px-2 py-0.5 bg-synapse-blue-primary/10 rounded-md text-[8px] font-black text-synapse-blue-primary uppercase">Clinical</span>
                 </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                 <p className="text-[9px] font-black text-synapse-text-secondary uppercase tracking-widest mb-1">Mode Trend</p>
                 <div className="flex items-center gap-2">
                    <i className="fa-solid fa-arrow-trend-up text-emerald-500"></i>
                    <span className="text-lg font-black text-synapse-text-primary">Challenge</span>
                 </div>
              </div>
           </div>
        </div>

        {/* DETAILED ANALYSIS NAVIGATION CARD */}
        <div 
          onClick={() => navigate('/detailed-analysis')}
          className="bg-white rounded-samsung p-6 border border-white shadow-lg card-shadow flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-synapse-blue-primary/10 rounded-2xl flex items-center justify-center text-synapse-blue-primary text-xl group-hover:bg-synapse-blue-primary group-hover:text-white transition-colors">
              <i className="fa-solid fa-magnifying-glass-chart"></i>
            </div>
            <div>
              <h4 className="text-sm font-black text-synapse-text-primary uppercase tracking-widest">Detailed Analysis</h4>
              <p className="text-[10px] font-bold text-synapse-text-secondary uppercase tracking-widest">Subject, Time & MCQ Insights</p>
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-slate-300 group-hover:text-synapse-blue-primary transition-colors"></i>
        </div>

        {/* RANK & PERCENTILE CARD */}
        <div className="bg-white rounded-samsung p-8 border border-white space-y-8 shadow-lg card-shadow">
           <div className="grid grid-cols-2 gap-8 divide-x divide-slate-100">
              <div className="text-center">
                 <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest mb-1">Global Rank</p>
                 <p className="text-4xl font-black text-synapse-text-primary tracking-tighter">#{MOCK_STATS.rank.toLocaleString()}</p>
                 <p className="text-[10px] font-bold text-emerald-500 mt-1 flex items-center justify-center gap-1">
                    <i className="fa-solid fa-arrow-up"></i> 124 Up
                 </p>
              </div>
              <div className="text-center pl-8">
                 <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest mb-1">Percentile</p>
                 <p className="text-4xl font-black text-synapse-blue-primary tracking-tighter">{MOCK_STATS.percentile}%</p>
                 <p className="text-[10px] font-bold text-synapse-text-secondary mt-1 uppercase tracking-widest">Elite Tier</p>
              </div>
           </div>
           <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">
                 <span>Mastery Progress</span>
                 <span className="text-synapse-blue-primary">Top 1.6%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-synapse-blue-primary transition-all duration-1000 shadow-sm" style={{ width: `${MOCK_STATS.percentile}%` }} />
              </div>
           </div>
        </div>

        {/* SUBJECT-WISE ACCURACY */}
        <div className="bg-white rounded-samsung p-8 border border-white space-y-6 shadow-lg card-shadow">
           <div className="flex justify-between items-center">
              <h3 className="font-black text-synapse-text-primary uppercase text-xs tracking-widest">Subject Accuracy</h3>
              <i className="fa-solid fa-chart-simple text-synapse-text-secondary"></i>
           </div>
           
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={MOCK_STATS.subjectWise} layout="vertical" margin={{ left: -10 }}>
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis 
                      dataKey="subject" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} 
                      width={90}
                    />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                    <Bar dataKey="accuracy" radius={[0, 8, 8, 0]} barSize={24}>
                       {MOCK_STATS.subjectWise.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.accuracy > 70 ? '#0ea5e9' : '#f87171'} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* TOPIC INSIGHTS */}
        <div className="grid grid-cols-1 gap-4">
           <div className="bg-white border border-white p-6 rounded-samsung space-y-4 shadow-lg card-shadow">
              <div className="flex items-center gap-3 text-synapse-blue-primary">
                 <div className="w-8 h-8 bg-synapse-blue-primary/10 rounded-xl flex items-center justify-center border border-synapse-blue-primary/10">
                    <i className="fa-solid fa-circle-check"></i>
                 </div>
                 <h4 className="text-xs font-black uppercase tracking-widest">Key Strengths</h4>
              </div>
              <div className="space-y-2">
                 {MOCK_STATS.strengths.map((s, i) => (
                   <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
                      <p className="text-xs font-black text-synapse-text-primary">{s.name}</p>
                      <p className="text-[9px] font-bold text-synapse-text-secondary uppercase tracking-widest">{s.subject}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-red-50 border border-red-100 p-6 rounded-samsung space-y-4 shadow-lg card-shadow">
              <div className="flex items-center gap-3 text-red-500">
                 <div className="w-8 h-8 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/10">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                 </div>
                 <h4 className="text-xs font-black uppercase tracking-widest">Critical Gaps</h4>
              </div>
              <div className="space-y-3">
                 {MOCK_STATS.weaknesses.map((w, i) => (
                   <div key={i} className="bg-white p-4 rounded-xl border border-red-100 flex items-center justify-between shadow-sm">
                      <div>
                         <p className="text-xs font-black text-synapse-text-primary">{w.name}</p>
                         <p className="text-[9px] font-bold text-synapse-text-secondary uppercase tracking-widest">{w.subject}</p>
                      </div>
                      <button 
                        onClick={() => navigate('/practice')}
                        className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all"
                      >
                         Sync Now
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* STRATEGY RECOMMENDATION */}
        <div className="bg-white rounded-[32px] p-8 text-synapse-text-primary space-y-6 shadow-lg relative overflow-hidden group border border-white card-shadow">
           <div className="absolute top-0 right-0 w-32 h-32 bg-synapse-blue-primary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-synapse-blue-primary/10" />
           <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-synapse-blue-primary text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <h4 className="font-bold text-lg leading-tight text-synapse-text-primary">Smart Strategy</h4>
           </div>
           <p className="text-sm font-medium leading-relaxed text-synapse-text-secondary relative z-10">
             Your high scores in <span className="text-synapse-blue-primary font-bold">Anatomy</span> and <span className="text-synapse-blue-primary font-bold">Pathology</span> are carrying your rank, but <span className="text-red-500 font-bold">Pharmacology</span> lag is preventing a Top 500 entry. Focus on ANS clinical cases today.
           </p>
           <button 
             onClick={() => navigate('/planner')}
             className="w-full h-14 bg-synapse-blue-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all relative z-10"
           >
             Optimize Daily Plan
           </button>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
