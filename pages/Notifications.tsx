
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification, NotificationCategory } from '../types';

const MOCK_NOTIFS: Notification[] = [
  {
    id: '1',
    category: 'class',
    title: 'Live Class Starting Soon',
    message: 'Dr. Anand is starting "ECG Interpretation" in 10 minutes. Tap to join!',
    timestamp: Date.now() - 600000,
    isRead: false,
    deepLink: '/live/1'
  },
  {
    id: '2',
    category: 'study',
    title: 'Daily Goal Reminder',
    message: 'You still have 45 mins of Pharmacology left for today. Keep the streak alive!',
    timestamp: Date.now() - 3600000 * 2,
    isRead: false,
    deepLink: '/planner'
  },
  {
    id: '3',
    category: 'test',
    title: 'Mock Results Published',
    message: 'NEET PG Full Mock #4 results are out. You ranked #452 nationally!',
    timestamp: Date.now() - 3600000 * 24,
    isRead: true,
    deepLink: '/exam-results'
  },
  {
    id: '4',
    category: 'announcement',
    title: 'Platform Maintenance',
    message: 'The portal will be down for 2 hours tonight for AI model upgrades.',
    timestamp: Date.now() - 3600000 * 48,
    isRead: true
  }
];

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<NotificationCategory | 'all'>('all');
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);

  const filtered = filter === 'all' ? notifs : notifs.filter(n => n.category === filter);

  const markRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleAction = (n: Notification) => {
    markRead(n.id);
    if (n.deepLink) navigate(n.deepLink);
  };

  const categoryIcons = {
    class: { icon: 'fa-video', color: 'bg-red-50 text-red-500' },
    test: { icon: 'fa-file-invoice', color: 'bg-emerald-50 text-emerald-500' },
    study: { icon: 'fa-brain', color: 'bg-blue-50 text-oneui-blue' },
    announcement: { icon: 'fa-bullhorn', color: 'bg-amber-50 text-amber-500' }
  };

  return (
    <div className="pb-40 bg-oneui-bg min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <div className="flex justify-between items-start">
           <h1 className="text-4xl font-light text-slate-900 leading-tight">Alerts &<br/><span className="font-bold">Updates</span></h1>
           <button 
             onClick={() => navigate('/notification-settings')}
             className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 border border-slate-100"
           >
              <i className="fa-solid fa-gear"></i>
           </button>
        </div>
      </div>

      <div className="px-5 space-y-6 -mt-4">
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
           {['all', 'class', 'test', 'study', 'announcement'].map(cat => (
             <button
               key={cat}
               onClick={() => setFilter(cat as any)}
               className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                 filter === cat ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
               }`}
             >
               {cat}
             </button>
           ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filtered.length > 0 ? filtered.map(n => (
            <div 
              key={n.id}
              onClick={() => handleAction(n)}
              className={`bg-white p-5 rounded-samsung border transition-all active:scale-95 cursor-pointer relative ${
                n.isRead ? 'border-slate-50 opacity-70' : 'border-blue-100 shadow-sm'
              }`}
            >
              {!n.isRead && (
                 <div className="absolute top-5 right-5 w-2 h-2 bg-oneui-blue rounded-full animate-pulse" />
              )}
              
              <div className="flex gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${categoryIcons[n.category].color}`}>
                   <i className={`fa-solid ${categoryIcons[n.category].icon}`}></i>
                </div>
                <div className="flex-1 space-y-1">
                   <div className="flex justify-between items-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{n.category}</p>
                      <p className="text-[10px] text-slate-300 font-bold">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                   </div>
                   <h4 className={`text-sm leading-tight ${n.isRead ? 'font-bold text-slate-500' : 'font-black text-slate-900'}`}>{n.title}</h4>
                   <p className="text-xs text-slate-500 font-medium leading-relaxed">{n.message}</p>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center space-y-4">
               <div className="w-20 h-20 bg-white rounded-full border border-slate-100 mx-auto flex items-center justify-center text-slate-200 text-3xl">
                  <i className="fa-solid fa-bell-slash"></i>
               </div>
               <p className="text-sm font-bold text-slate-400">All caught up!</p>
            </div>
          )}
        </div>

        {/* Clear All Button */}
        <button className="w-full py-4 text-xs font-black text-slate-300 uppercase tracking-widest hover:text-red-400 transition-colors">
          Clear All Notifications
        </button>
      </div>
    </div>
  );
};

export default Notifications;
