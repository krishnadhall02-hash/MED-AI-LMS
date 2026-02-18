
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
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 relative">
        <button onClick={() => navigate(-1)} className="absolute top-4 left-6 w-12 h-12 flex items-center justify-center text-oneui-text-secondary active:scale-90">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="text-4xl font-light text-oneui-text-primary leading-tight tracking-tight">Your<br/><span className="font-bold">Performance</span></h1>
        
        {/* Time Range Selector */}
        <div className="mt-8 flex bg-synapse-surface/50 backdrop-blur-md p-1 rounded-2xl w-fit border border-synapse-border">
           {(['7d', '30d', 'all'] as const).map(range => (
             <button
               key={range}
               onClick={() => setTimeRange(range)}
               className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 timeRange === range ? 'bg-synapse-aqua text-synapse-deep shadow-md' : 'text-oneui-text-secondary hover:text-oneui-text-primary'
               }`}
             >
               {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : 'All Time'}
             </button>
           ))}
        </div>
      </div>

      <div className="px-5 space-y-6 -mt-4">
        
        {/* RANK & PERCENTILE CARD */}
        <div className="bg-synapse-surface/80 rounded-samsung p-8 border border-synapse-border space-y-8 backdrop-blur-sm">
           <div className="grid grid-cols-2 gap-8 divide-x divide-synapse-border/40">
              <div className="text-center">
                 <p className="text-[10px] font-black text-oneui-text-muted uppercase tracking-widest mb-1">Global Rank</p>
                 <p className="text-4xl font-black text-oneui-text-primary tracking-tighter">#{MOCK_STATS.rank.toLocaleString()}</p>
                 <p className="text-[10px] font-bold text-emerald-400 mt-1 flex items-center justify-center gap-1">
                    <i className="fa-solid fa-arrow-up"></i> 124 Up
                 </p>
              </div>
              <div className="text-center pl-8">
                 <p className="text-[10px] font-black text-oneui-text-muted uppercase tracking-widest mb-1">Percentile</p>
                 <p className="text-4xl font-black text-synapse-aqua tracking-tighter">{MOCK_STATS.percentile}%</p>
                 <p className="text-[10px] font-bold text-oneui-text-muted mt-1 uppercase tracking-widest">Elite Tier</p>
              </div>
           </div>
           <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black text-oneui-text-muted uppercase tracking-widest">
                 <span>Mastery Progress</span>
                 <span className="text-synapse-aqua">Top 1.6%</span>
              </div>
              <div className="w-full h-2 bg-synapse-deep rounded-full overflow-hidden">
                 <div className="h-full bg-synapse-aqua transition-all duration-1000 shadow-[0_0_10px_rgba(45,212,191,0.3)]" style={{ width: `${MOCK_STATS.percentile}%` }} />
              </div>
           </div>
        </div>

        {/* SUBJECT-WISE ACCURACY */}
        <div className="bg-synapse-surface/60 rounded-samsung p-8 border border-synapse-border space-y-6">
           <div className="flex justify-between items-center">
              <h3 className="font-black text-oneui-text-primary uppercase text-xs tracking-widest">Subject Accuracy</h3>
              <i className="fa-solid fa-chart-simple text-oneui-text-muted"></i>
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
                    <Tooltip contentStyle={{ backgroundColor: '#111d27', border: '1px solid #1e2d3d', borderRadius: '12px' }} />
                    <Bar dataKey="accuracy" radius={[0, 8, 8, 0]} barSize={24}>
                       {MOCK_STATS.subjectWise.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.accuracy > 70 ? '#2dd4bf' : '#f87171'} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* TOPIC INSIGHTS */}
        <div className="grid grid-cols-1 gap-4">
           <div className="bg-synapse-surface/40 border border-synapse-border p-6 rounded-samsung space-y-4">
              <div className="flex items-center gap-3 text-synapse-aqua">
                 <div className="w-8 h-8 bg-synapse-aqua/10 rounded-xl flex items-center justify-center border border-synapse-aqua/20">
                    <i className="fa-solid fa-circle-check"></i>
                 </div>
                 <h4 className="text-xs font-black uppercase tracking-widest">Key Strengths</h4>
              </div>
              <div className="space-y-2">
                 {MOCK_STATS.strengths.map((s, i) => (
                   <div key={i} className="bg-synapse-deep p-3 rounded-xl border border-synapse-border flex justify-between items-center">
                      <p className="text-xs font-black text-oneui-text-primary">{s.name}</p>
                      <p className="text-[9px] font-bold text-oneui-text-muted uppercase tracking-widest">{s.subject}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-samsung space-y-4">
              <div className="flex items-center gap-3 text-red-400">
                 <div className="w-8 h-8 bg-red-400/10 rounded-xl flex items-center justify-center border border-red-400/20">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                 </div>
                 <h4 className="text-xs font-black uppercase tracking-widest">Critical Gaps</h4>
              </div>
              <div className="space-y-3">
                 {MOCK_STATS.weaknesses.map((w, i) => (
                   <div key={i} className="bg-synapse-deep p-4 rounded-xl border border-red-500/10 flex items-center justify-between">
                      <div>
                         <p className="text-xs font-black text-oneui-text-primary">{w.name}</p>
                         <p className="text-[9px] font-bold text-oneui-text-muted uppercase tracking-widest">{w.subject}</p>
                      </div>
                      <button 
                        onClick={() => navigate('/practice')}
                        className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                      >
                         Sync Now
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* STRATEGY RECOMMENDATION */}
        <div className="bg-synapse-deep rounded-[32px] p-8 text-oneui-text-primary space-y-6 shadow-2xl relative overflow-hidden group border border-synapse-border">
           <div className="absolute top-0 right-0 w-32 h-32 bg-synapse-aqua/10 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-synapse-aqua/20" />
           <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-synapse-aqua text-synapse-deep rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <h4 className="font-bold text-lg leading-tight text-oneui-text-primary">Smart Strategy</h4>
           </div>
           <p className="text-sm font-medium leading-relaxed text-oneui-text-secondary relative z-10">
             Your high scores in <span className="text-synapse-aqua font-bold">Anatomy</span> and <span className="text-synapse-aqua font-bold">Pathology</span> are carrying your rank, but <span className="text-red-400 font-bold">Pharmacology</span> lag is preventing a Top 500 entry. Focus on ANS clinical cases today.
           </p>
           <button 
             onClick={() => navigate('/planner')}
             className="w-full h-14 bg-synapse-aqua text-synapse-deep rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all relative z-10"
           >
             Optimize Daily Plan
           </button>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
