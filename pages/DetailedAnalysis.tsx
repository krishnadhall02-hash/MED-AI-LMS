
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  Cell, LineChart, Line, CartesianGrid, PieChart, Pie
} from 'recharts';

const SUBJECT_DATA = [
  { subject: 'Anatomy', accuracy: 85, attempted: 450, correct: 382, incorrect: 68 },
  { subject: 'Physiology', accuracy: 72, attempted: 380, correct: 274, incorrect: 106 },
  { subject: 'Pathology', accuracy: 92, attempted: 520, correct: 478, incorrect: 42 },
  { subject: 'Pharmacology', accuracy: 55, attempted: 310, correct: 170, incorrect: 140, isWeak: true },
  { subject: 'Medicine', accuracy: 78, attempted: 600, correct: 468, incorrect: 132 },
  { subject: 'Surgery', accuracy: 64, attempted: 290, correct: 185, incorrect: 105 },
];

const TIME_DATA = {
  avgTime: '42s',
  totalTime: '18h 45m',
  fastestMock: '38m',
  slowestMock: '52m',
  speedTrend: [
    { test: 'T1', speed: 55 },
    { test: 'T2', speed: 52 },
    { test: 'T3', speed: 48 },
    { test: 'T4', speed: 45 },
    { test: 'T5', speed: 42 },
  ],
  timePressureScore: 82,
  improvementTrend: '+12%'
};

const MCQ_DIFFICULTY_DATA = [
  { difficulty: 'Easy', attempted: 120, accuracy: 85, color: '#10b981' },
  { difficulty: 'Moderate', attempted: 95, accuracy: 72, color: '#fbbf24' },
  { difficulty: 'Hard', attempted: 60, accuracy: 48, color: '#ef4444' },
];

const DetailedAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'subject' | 'time' | 'mcq'>('subject');

  return (
    <div className="pb-40 bg-synapse-blue-light min-h-screen" aria-label="Detailed Analysis Screen">
      {/* Header */}
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 relative">
        <button onClick={() => navigate(-1)} className="absolute top-4 left-6 w-12 h-12 flex items-center justify-center text-synapse-text-secondary active:scale-90">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="text-4xl font-light text-synapse-text-primary leading-tight tracking-tight">Detailed<br/><span className="font-bold">Analysis</span></h1>
        
        {/* Tab Selector */}
        <div className="mt-8 flex bg-white/50 backdrop-blur-md p-1 rounded-2xl w-full border border-synapse-blue-soft">
           {(['subject', 'time', 'mcq'] as const).map(tab => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 activeTab === tab ? 'bg-synapse-blue-primary text-white shadow-md' : 'text-synapse-text-secondary hover:text-synapse-text-primary'
               }`}
             >
               {tab === 'subject' ? 'Subject' : tab === 'time' ? 'Time' : 'MCQ'}
             </button>
           ))}
        </div>
      </div>

      <div className="px-5 space-y-6 -mt-4">
        {activeTab === 'subject' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {SUBJECT_DATA.map((s, i) => (
              <div key={i} className={`bg-white rounded-samsung p-6 border border-white shadow-lg card-shadow space-y-4 ${s.isWeak ? 'border-red-100' : ''}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-black text-synapse-text-primary">{s.subject}</h3>
                    <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">{s.attempted} MCQs Attempted</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-black ${s.accuracy > 80 ? 'text-emerald-500' : s.accuracy < 60 ? 'text-red-500' : 'text-synapse-blue-primary'}`}>
                      {s.accuracy}%
                    </p>
                    <p className="text-[9px] font-black text-synapse-text-secondary uppercase tracking-widest">Accuracy</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                    <span className="text-emerald-500">{s.correct} Correct</span>
                    <span className="text-red-400">{s.incorrect} Incorrect</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500" style={{ width: `${(s.correct / s.attempted) * 100}%` }} />
                    <div className="h-full bg-red-400" style={{ width: `${(s.incorrect / s.attempted) * 100}%` }} />
                  </div>
                </div>

                {s.isWeak && (
                  <div className="pt-2 flex items-center gap-2 text-red-500">
                    <i className="fa-solid fa-triangle-exclamation text-xs"></i>
                    <span className="text-[9px] font-black uppercase tracking-widest">Critical Gap Detected</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'time' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Time Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-samsung p-6 border border-white shadow-lg card-shadow text-center space-y-1">
                <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">Avg Time / Q</p>
                <p className="text-3xl font-black text-synapse-text-primary">{TIME_DATA.avgTime}</p>
              </div>
              <div className="bg-white rounded-samsung p-6 border border-white shadow-lg card-shadow text-center space-y-1">
                <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">Total Mock Time</p>
                <p className="text-3xl font-black text-synapse-blue-primary">{TIME_DATA.totalTime}</p>
              </div>
            </div>

            {/* Fastest/Slowest */}
            <div className="bg-white rounded-samsung p-6 border border-white shadow-lg card-shadow space-y-4">
              <h3 className="text-xs font-black text-synapse-text-primary uppercase tracking-widest">Mock Efficiency</h3>
              <div className="grid grid-cols-2 gap-8 divide-x divide-slate-100">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Fastest Mock</p>
                  <p className="text-xl font-black text-synapse-text-primary">{TIME_DATA.fastestMock}</p>
                </div>
                <div className="pl-8 space-y-1">
                  <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">Slowest Mock</p>
                  <p className="text-xl font-black text-synapse-text-primary">{TIME_DATA.slowestMock}</p>
                </div>
              </div>
            </div>

            {/* Speed Trend Graph */}
            <div className="bg-white rounded-samsung p-6 border border-white shadow-lg card-shadow space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-synapse-text-primary uppercase tracking-widest">Speed Trend (s/Q)</h3>
                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">{TIME_DATA.improvementTrend} Faster</span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={TIME_DATA.speedTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#00000005" vertical={false} />
                    <XAxis 
                      dataKey="test" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} 
                    />
                    <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                    <Line 
                      type="monotone" 
                      dataKey="speed" 
                      stroke="#0ea5e9" 
                      strokeWidth={4} 
                      dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4, stroke: '#ffffff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Time Pressure Score */}
            <div className="bg-synapse-blue-primary rounded-samsung p-8 text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
               <div className="flex justify-between items-center relative z-10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Time Pressure Score</p>
                    <h4 className="text-4xl font-black">{TIME_DATA.timePressureScore}</h4>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                    <i className="fa-solid fa-gauge-high"></i>
                  </div>
               </div>
               <p className="text-xs font-medium mt-4 opacity-80 relative z-10">
                 You are maintaining optimal speed in 82% of clinical scenarios.
               </p>
            </div>
          </div>
        )}

        {activeTab === 'mcq' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {MCQ_DIFFICULTY_DATA.map((d, i) => (
              <div key={i} className="bg-white rounded-samsung p-8 border border-white shadow-lg card-shadow space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-synapse-text-primary">{d.difficulty}</h3>
                    <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">Attempted: {d.attempted}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-3xl font-black" style={{ color: d.color }}>{d.accuracy}%</p>
                    <p className="text-[9px] font-black text-synapse-text-secondary uppercase tracking-widest">Accuracy</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000" 
                      style={{ width: `${d.accuracy}%`, backgroundColor: d.color }} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                   <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[8px] font-black text-synapse-text-secondary uppercase tracking-widest mb-1">Correct</p>
                      <p className="text-sm font-black text-synapse-text-primary">{Math.round(d.attempted * (d.accuracy / 100))}</p>
                   </div>
                   <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[8px] font-black text-synapse-text-secondary uppercase tracking-widest mb-1">Incorrect</p>
                      <p className="text-sm font-black text-synapse-text-primary">{d.attempted - Math.round(d.attempted * (d.accuracy / 100))}</p>
                   </div>
                </div>
              </div>
            ))}

            {/* MCQ Distribution Pie Chart */}
            <div className="bg-white rounded-samsung p-8 border border-white shadow-lg card-shadow space-y-6">
               <h3 className="text-xs font-black text-synapse-text-primary uppercase tracking-widest text-center">Attempt Distribution</h3>
               <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={MCQ_DIFFICULTY_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="attempted"
                        nameKey="difficulty"
                      >
                        {MCQ_DIFFICULTY_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="flex justify-center gap-6">
                  {MCQ_DIFFICULTY_DATA.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">{d.difficulty}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedAnalysis;
