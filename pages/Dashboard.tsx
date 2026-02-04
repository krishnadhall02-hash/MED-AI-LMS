
import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis } from 'recharts';

const stats = [
  { name: 'M', h: 2 }, { name: 'T', h: 5 }, { name: 'W', h: 3 },
  { name: 'T', h: 6 }, { name: 'F', h: 4 }, { name: 'S', h: 8 }, { name: 'S', h: 1 }
];

const Dashboard: React.FC = () => {
  return (
    <div className="pb-32">
      {/* One UI Large Header */}
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 bg-oneui-bg">
        <h1 className="text-4xl font-light text-slate-900 leading-tight">Good morning,<br/><span className="font-bold">Dr. Sarah</span></h1>
      </div>

      <div className="px-5 space-y-6 -mt-4">
        {/* Streak Card */}
        <div className="bg-white rounded-samsung p-6 shadow-sm border border-slate-100 flex items-center justify-between">
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

        {/* Study Progress Card */}
        <div className="bg-white rounded-samsung p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800">Activity</h3>
            <span className="text-sm font-bold text-oneui-blue">Details</span>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Bar dataKey="h" fill="#4c6ef5" radius={[4, 4, 4, 4]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-600 rounded-samsung p-5 text-white shadow-lg shadow-indigo-100 flex flex-col justify-between h-40">
            <i className="fa-solid fa-play text-2xl"></i>
            <div>
              <p className="font-bold text-lg">Continue</p>
              <p className="text-xs opacity-80">Cardiology Ch. 2</p>
            </div>
          </div>
          <div className="bg-white rounded-samsung p-5 border border-slate-100 flex flex-col justify-between h-40">
            <i className="fa-solid fa-bolt text-2xl text-yellow-500"></i>
            <div>
              <p className="font-bold text-lg text-slate-800">Daily Quiz</p>
              <p className="text-xs text-slate-500">10 mins left</p>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between pt-4 px-2">
          <h3 className="font-bold text-xl text-slate-800">Upcoming Live</h3>
          <span className="text-oneui-blue text-sm font-bold">View all</span>
        </div>

        <div className="space-y-3">
          {[
            { title: 'ECG Masterclass', mentor: 'Dr. Anand', time: '14:00' },
            { title: 'Pathology Review', mentor: 'Dr. Priya', time: '17:30' }
          ].map((cls, i) => (
            <div key={i} className="bg-white p-5 rounded-samsung border border-slate-100 flex items-center justify-between tap-target">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-oneui-blue">
                  {cls.time}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{cls.title}</h4>
                  <p className="text-xs text-slate-500">{cls.mentor}</p>
                </div>
              </div>
              <button className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold uppercase">Remind</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
