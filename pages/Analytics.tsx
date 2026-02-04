
import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  Cell, PieChart, Pie 
} from 'recharts';

const MOCK_STATS = {
  rank: 1242,
  percentile: 98.4,
  totalTests: 45,
  avgAccuracy: 78,
  subjectWise: [
    { subject: 'Anatomy', accuracy: 85, total: 120 },
    { subject: 'Physiology', accuracy: 72, total: 95 },
    { subject: 'Biochem', accuracy: 68, total: 80 },
    { subject: 'Pathology', accuracy: 92, total: 110 },
    { subject: 'Pharma', accuracy: 55, total: 150 },
  ],
  confidenceRatio: [
    { name: 'Confident Correct', value: 65, color: '#10b981' },
    { name: 'Lucky Guesses', value: 15, color: '#fbbf24' },
    { name: 'Confident Wrong', value: 20, color: '#ef4444' },
  ],
  strengths: ['Neuroanatomy', 'General Pathology', 'CVS Physiology'],
  weaknesses: ['Antiviral Drugs', 'Enzyme Kinetics', 'Forensic Toxicology']
};

const Analytics: React.FC = () => {
  return (
    <div className="pb-40 bg-oneui-bg min-h-screen">
      {/* 1. Hero Analytics Header */}
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <h1 className="text-4xl font-light text-slate-900 leading-tight">Your<br/><span className="font-bold">Performance</span></h1>
        
        <div className="mt-8 flex gap-4">
          <div className="bg-white px-6 py-4 rounded-samsung shadow-sm border border-slate-100 flex-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Rank</p>
            <p className="text-2xl font-black text-slate-900">#{MOCK_STATS.rank.toLocaleString()}</p>
          </div>
          <div className="bg-oneui-blue px-6 py-4 rounded-samsung shadow-lg shadow-blue-100 flex-1">
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Percentile</p>
            <p className="text-2xl font-black text-white">{MOCK_STATS.percentile}%</p>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-6 -mt-4">
        {/* 2. Subject Radar Chart (Strength Map) */}
        <div className="bg-white rounded-samsung p-6 shadow-sm border border-slate-100 space-y-4">
          <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Mastery Radar</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={MOCK_STATS.subjectWise}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                <Radar
                  name="Accuracy"
                  dataKey="accuracy"
                  stroke="#4c6ef5"
                  fill="#4c6ef5"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Guess vs Confident (Knowledge Depth) */}
        <div className="bg-white rounded-samsung p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Confidence Audit</h3>
            <span className="text-[10px] font-bold text-oneui-blue bg-blue-50 px-2 py-1 rounded">Last 100 MCQs</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_STATS.confidenceRatio}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {MOCK_STATS.confidenceRatio.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {MOCK_STATS.confidenceRatio.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] font-bold text-slate-500">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Subject Accuracy Bar Chart */}
        <div className="bg-white rounded-samsung p-6 shadow-sm border border-slate-100 space-y-6">
          <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Detailed Accuracy</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_STATS.subjectWise}>
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                <Bar dataKey="accuracy" radius={[6, 6, 6, 6]} barSize={24}>
                  {MOCK_STATS.subjectWise.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.accuracy > 70 ? '#4c6ef5' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Strengths & Weaknesses (The 'Target List') */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-samsung space-y-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <i className="fa-solid fa-circle-check"></i>
              <h4 className="text-[10px] font-black uppercase tracking-widest">Strengths</h4>
            </div>
            <ul className="space-y-2">
              {MOCK_STATS.strengths.map((s, i) => (
                <li key={i} className="text-xs font-bold text-emerald-900 leading-tight">{s}</li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-100 p-6 rounded-samsung space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <h4 className="text-[10px] font-black uppercase tracking-widest">Weaknesses</h4>
            </div>
            <ul className="space-y-2">
              {MOCK_STATS.weaknesses.map((w, i) => (
                <li key={i} className="text-xs font-bold text-red-900 leading-tight">{w}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 6. AI Smart Recommendation Card */}
        <div className="bg-slate-900 rounded-[32px] p-8 text-white space-y-4 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-oneui-blue/20 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-oneui-blue/40" />
           <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-oneui-blue rounded-xl flex items-center justify-center text-xl shadow-lg">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <h4 className="font-bold text-lg">AI Revision Plan</h4>
           </div>
           <p className="text-sm font-medium leading-relaxed opacity-80 relative z-10">
             Based on your 55% accuracy in <span className="font-black text-red-400">Pharmacology</span>, you have 3 unattempted subtopics in <span className="font-black">Antiviral Drugs</span>. Focus on these today to improve your rank by ~200 places.
           </p>
           <button className="w-full h-14 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all relative z-10">
             Start Targeted Session
           </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
