
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, ResponsiveContainer, XAxis } from 'recharts';

const stats = [
  { name: 'M', h: 2 }, { name: 'T', h: 5 }, { name: 'W', h: 3 },
  { name: 'T', h: 6 }, { name: 'F', h: 4 }, { name: 'S', h: 8 }, { name: 'S', h: 1 }
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<string[]>([]);
  const [unreadNotifs] = useState(2);

  const toggleReminder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReminders(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="pb-32">
      {/* One UI Large Header */}
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 bg-oneui-bg relative">
        <div className="absolute top-4 right-8">
           <button 
             onClick={() => navigate('/notifications')}
             className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 border border-slate-100 relative active:scale-90 transition-all"
           >
              <i className="fa-solid fa-bell"></i>
              {unreadNotifs > 0 && (
                <div className="absolute top-2.5 right-2.5 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  {unreadNotifs}
                </div>
              )}
           </button>
        </div>
        <h1 className="text-4xl font-light text-slate-900 leading-tight">Good morning,<br/><span className="font-bold">Dr. Sarah</span></h1>
      </div>

      <div className="px-5 space-y-6 -mt-4">
        {/* Streak Card */}
        <div 
          onClick={() => navigate('/tracker')}
          className="bg-white rounded-samsung p-6 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xl shadow-inner">
              <i className="fa-solid fa-fire"></i>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">12 Days</p>
              <p className="text-sm font-medium text-slate-500">Current streak</p>
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-slate-300"></i>
        </div>

        {/* Community Nudge */}
        <div 
          onClick={() => navigate('/community')}
          className="bg-white rounded-samsung p-6 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
        >
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-lg">
                 <i className="fa-solid fa-users"></i>
              </div>
              <div>
                 <p className="font-black text-slate-800">Community Doubts</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">12 New discussions in Anatomy</p>
              </div>
           </div>
           <i className="fa-solid fa-chevron-right text-slate-300"></i>
        </div>

        {/* AI Smart Recommendation Nudge */}
        <div 
          onClick={() => navigate('/planner')}
          className="bg-slate-900 rounded-samsung p-6 text-white shadow-xl shadow-blue-50 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-oneui-blue/20 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-8 bg-oneui-blue rounded-lg flex items-center justify-center text-sm">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
             </div>
             <p className="text-xs font-black uppercase tracking-widest text-blue-200">Personalized Goal</p>
          </div>
          <h3 className="text-lg font-bold leading-tight mb-4">Fix your <span className="text-oneui-blue">Pharmacology</span> weakness today with a 45-min targeted plan.</h3>
          <div className="flex items-center gap-2 text-oneui-blue font-black text-[10px] uppercase tracking-widest">
            <span>View Plan</span>
            <i className="fa-solid fa-arrow-right"></i>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div 
            onClick={() => navigate('/exam')}
            className="bg-white border border-slate-100 rounded-samsung p-5 shadow-sm flex flex-col justify-between h-40 tap-target active:scale-95 transition-all cursor-pointer"
          >
            <i className="fa-solid fa-file-invoice text-2xl text-oneui-blue"></i>
            <div>
              <p className="font-bold text-lg text-slate-800">Mock Exam</p>
              <p className="text-xs text-slate-400">Full Syllabus #1</p>
            </div>
          </div>
          <div 
            onClick={() => navigate('/practice')}
            className="bg-white rounded-samsung p-5 border border-slate-100 flex flex-col justify-between h-40 tap-target active:scale-95 transition-all cursor-pointer"
          >
            <i className="fa-solid fa-bolt text-2xl text-yellow-500"></i>
            <div>
              <p className="font-bold text-lg text-slate-800">Daily Quiz</p>
              <p className="text-xs text-slate-500">10 mins left</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
