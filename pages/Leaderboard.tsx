
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'monthly' | 'all-time'>('monthly');

  const leaderboardData = [
    { rank: 1, name: "Dr. Rahul S.", score: 2450, streak: 28, accuracy: 98, avatar: "https://picsum.photos/seed/dr1/100/100" },
    { rank: 2, name: "Dr. Priya M.", score: 2380, streak: 25, accuracy: 96, avatar: "https://picsum.photos/seed/dr2/100/100" },
    { rank: 3, name: "Dr. Amit K.", score: 2310, streak: 30, accuracy: 94, avatar: "https://picsum.photos/seed/dr3/100/100" },
    { rank: 4, name: "Dr. Sneha P.", score: 2250, streak: 15, accuracy: 92, avatar: "https://picsum.photos/seed/dr4/100/100" },
    { rank: 5, name: "Dr. Vikram G.", score: 2190, streak: 12, accuracy: 90, avatar: "https://picsum.photos/seed/dr5/100/100" },
    { rank: 12, name: "You (Dr. Sarah)", score: 1850, streak: 7, accuracy: 88, avatar: "https://picsum.photos/seed/druser/100/100", isUser: true },
  ];

  const scholarships = [
    { rank: 1, reward: "100% Scholarship", color: "bg-amber-400" },
    { rank: 2, reward: "50% Scholarship", color: "bg-slate-300" },
    { rank: 3, reward: "25% Scholarship", color: "bg-orange-400" },
  ];

  return (
    <div className="min-h-screen bg-synapse-light-bg pb-32">
      {/* Header */}
      <div className="bg-synapse-blue-primary pt-12 pb-20 px-6 rounded-b-[48px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <button onClick={() => navigate(-1)} className="text-white active:scale-90 transition-all">
            <i className="fa-solid fa-chevron-left text-xl"></i>
          </button>
          <h1 className="text-white font-black text-lg uppercase tracking-widest">Scholarship Board</h1>
          <button className="text-white active:scale-90 transition-all">
            <i className="fa-solid fa-circle-info text-xl"></i>
          </button>
        </div>

        <div className="flex flex-col items-center relative z-10">
          <div className="flex items-end justify-center gap-4 mb-8">
            {/* Rank 2 */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border-2 border-slate-300 p-1 mb-2 relative">
                <img src={leaderboardData[1].avatar} className="w-full h-full rounded-full object-cover" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center text-[10px] font-black text-slate-700 border-2 border-synapse-blue-primary">2</div>
              </div>
              <div className="h-16 w-12 bg-white/10 rounded-t-lg backdrop-blur-md flex items-end justify-center pb-2">
                 <span className="text-white font-black text-xs">2nd</span>
              </div>
            </div>
            {/* Rank 1 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-4 border-amber-400 p-1 mb-2 relative">
                <img src={leaderboardData[0].avatar} className="w-full h-full rounded-full object-cover" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-xs font-black text-amber-900 border-4 border-synapse-blue-primary">1</div>
              </div>
              <div className="h-24 w-16 bg-white/20 rounded-t-lg backdrop-blur-md flex items-end justify-center pb-3">
                 <i className="fa-solid fa-crown text-amber-400 text-lg"></i>
              </div>
            </div>
            {/* Rank 3 */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border-2 border-orange-400 p-1 mb-2 relative">
                <img src={leaderboardData[2].avatar} className="w-full h-full rounded-full object-cover" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-[10px] font-black text-orange-900 border-2 border-synapse-blue-primary">3</div>
              </div>
              <div className="h-12 w-12 bg-white/10 rounded-t-lg backdrop-blur-md flex items-end justify-center pb-2">
                 <span className="text-white font-black text-xs">3rd</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-10 relative z-20">
        {/* Tabs */}
        <div className="bg-white rounded-2xl p-1.5 flex shadow-lg mb-8 border border-white">
          <button 
            onClick={() => setActiveTab('monthly')}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'monthly' ? 'bg-synapse-blue-primary text-white shadow-md' : 'text-synapse-text-secondary'}`}
          >
            Monthly Rank
          </button>
          <button 
            onClick={() => setActiveTab('all-time')}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'all-time' ? 'bg-synapse-blue-primary text-white shadow-md' : 'text-synapse-text-secondary'}`}
          >
            All-Time
          </button>
        </div>

        {/* User Stats Card */}
        <div className="bg-synapse-blue-primary text-white rounded-samsung p-6 shadow-xl mb-8 flex items-center justify-between border border-white/10">
           <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Your Current Rank</p>
              <h3 className="text-3xl font-black tracking-tighter">#12 <span className="text-sm font-medium opacity-60">/ 50k+</span></h3>
           </div>
           <div className="text-right space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Scholarship Prob.</p>
              <h3 className="text-xl font-black text-synapse-aqua">High (82%)</h3>
           </div>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-[0.2em] px-2">Top Performers</h3>
          <div className="bg-white rounded-samsung shadow-xl border border-white overflow-hidden card-shadow">
            {leaderboardData.map((user, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-4 p-5 border-b border-slate-50 last:border-0 transition-all ${user.isUser ? 'bg-synapse-blue-primary/5' : ''}`}
              >
                <div className="w-8 text-center">
                  <span className={`text-sm font-black ${user.rank <= 3 ? 'text-synapse-blue-primary' : 'text-slate-400'}`}>
                    {user.rank}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100">
                  <img src={user.avatar} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-bold ${user.isUser ? 'text-synapse-blue-primary' : 'text-synapse-text-primary'}`}>
                    {user.name} {user.isUser && <span className="text-[10px] bg-synapse-blue-primary text-white px-2 py-0.5 rounded-full ml-2">YOU</span>}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">
                       <i className="fa-solid fa-fire text-orange-500 mr-1"></i> {user.streak} Day Streak
                    </span>
                    <span className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">
                       <i className="fa-solid fa-bullseye text-synapse-blue-primary mr-1"></i> {user.accuracy}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-synapse-text-primary">{user.score}</p>
                  <p className="text-[9px] font-black text-synapse-text-secondary uppercase tracking-widest">Points</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scholarship Info */}
        <div className="mt-12 space-y-4">
          <h3 className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-[0.2em] px-2">Monthly Rewards</h3>
          <div className="grid grid-cols-1 gap-3">
            {scholarships.map((s) => (
              <div key={s.rank} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-white shadow-sm`}>
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">Rank {s.rank}</p>
                    <h4 className="text-sm font-black text-synapse-text-primary">{s.reward}</h4>
                  </div>
                </div>
                <i className="fa-solid fa-chevron-right text-slate-300 text-xs"></i>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
