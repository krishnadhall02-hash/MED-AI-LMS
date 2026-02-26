
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LEADERS = [
  { rank: 1, name: "Dr. Aryan Khan", accuracy: 98, time: "12s", avatar: "https://i.pravatar.cc/100?u=1" },
  { rank: 2, name: "Dr. Meera Iyer", accuracy: 96, time: "15s", avatar: "https://i.pravatar.cc/100?u=2" },
  { rank: 3, name: "Dr. Sam Wilson", accuracy: 95, time: "14s", avatar: "https://i.pravatar.cc/100?u=3" },
  { rank: 4, name: "Dr. Sarah Johnson", accuracy: 92, time: "18s", avatar: "https://i.pravatar.cc/150?u=sarah" },
  { rank: 5, name: "Dr. Rohan Roy", accuracy: 89, time: "22s", avatar: "https://i.pravatar.cc/100?u=5" },
];

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-40 bg-synapse-blue-light min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 -ml-2 text-synapse-text-secondary mb-2 active:scale-90">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-4xl font-light text-synapse-text-primary leading-tight">Monthly<br/><span className="font-bold">Scholarship</span></h1>
      </div>

      <div className="px-5 space-y-8 -mt-4">
        {/* Scholarship Reward Callout */}
        <div className="bg-synapse-blue-primary rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl card-shadow">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl animate-pulse" />
           <div className="flex items-center gap-5 relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-md border border-white/20">
                 <i className="fa-solid fa-graduation-cap text-white"></i>
              </div>
              <div>
                 <h3 className="text-xl font-black leading-tight">Monthly Reward</h3>
                 <p className="text-[10px] font-black text-white/80 uppercase tracking-widest mt-1">₹10,000 for Top 3</p>
              </div>
           </div>
           <p className="text-xs font-medium text-white/90 mt-6 leading-relaxed relative z-10">
             Calculated based on <span className="text-white font-black">Accuracy</span>, <span className="text-white font-black">Consistency</span> (Daily Streaks), and <span className="text-white font-black">Time Taken</span>.
           </p>
        </div>

        {/* Podium */}
        <div className="flex items-end justify-center gap-4 pt-10 pb-4">
           {/* Rank 2 */}
           <div className="flex flex-col items-center gap-3">
              <div className="relative">
                 <img src={LEADERS[1].avatar} className="w-16 h-16 rounded-full border-4 border-slate-200 shadow-lg" alt="" />
                 <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-600 text-[8px] font-black px-2 py-0.5 rounded-full border border-white">2ND</div>
              </div>
              <div className="w-16 h-20 bg-white rounded-t-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                 <span className="text-lg font-black text-slate-300">#2</span>
              </div>
           </div>
           {/* Rank 1 */}
           <div className="flex flex-col items-center gap-3">
              <div className="relative">
                 <img src={LEADERS[0].avatar} className="w-20 h-20 rounded-full border-4 border-amber-400 shadow-xl" alt="" />
                 <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-[8px] font-black px-3 py-1 rounded-full border border-white shadow-lg animate-bounce">1ST</div>
                 <i className="fa-solid fa-crown absolute -top-4 left-1/2 -translate-x-1/2 text-amber-400 text-xl rotate-12"></i>
              </div>
              <div className="w-20 h-28 bg-white rounded-t-2xl shadow-xl border-t-4 border-t-amber-400 flex items-center justify-center">
                 <span className="text-2xl font-black text-amber-500">#1</span>
              </div>
           </div>
           {/* Rank 3 */}
           <div className="flex flex-col items-center gap-3">
              <div className="relative">
                 <img src={LEADERS[2].avatar} className="w-14 h-14 rounded-full border-4 border-orange-300 shadow-lg" alt="" />
                 <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-300 text-orange-800 text-[8px] font-black px-2 py-0.5 rounded-full border border-white">3RD</div>
              </div>
              <div className="w-14 h-16 bg-white rounded-t-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                 <span className="text-base font-black text-orange-400">#3</span>
              </div>
           </div>
        </div>

        {/* Full Listing */}
        <div className="space-y-3">
           {LEADERS.map(user => (
             <div key={user.rank} className={`bg-white p-5 rounded-samsung border border-white flex items-center gap-4 transition-all shadow-sm card-shadow ${user.rank === 4 ? 'ring-2 ring-synapse-blue-primary ring-offset-2' : ''}`}>
                <span className="w-6 text-center text-xs font-black text-synapse-text-secondary">{user.rank}</span>
                <img src={user.avatar} className="w-10 h-10 rounded-full shadow-inner shrink-0" alt="" />
                <div className="flex-1">
                   <h4 className="font-black text-synapse-text-primary text-sm">{user.rank === 4 ? 'You (Sarah)' : user.name}</h4>
                   <p className="text-[10px] font-bold text-synapse-text-secondary uppercase tracking-widest">{user.accuracy}% Accuracy • {user.time}</p>
                </div>
                {user.rank <= 3 && (
                   <div className="text-amber-500">
                      <i className="fa-solid fa-award"></i>
                   </div>
                )}
             </div>
           ))}
        </div>

        <div className="bg-white/50 p-6 rounded-samsung border border-dashed border-synapse-blue-soft text-center">
           <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">Next reset in 12 days</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
