
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DiscussionThread } from '../types';

const MOCK_THREADS: DiscussionThread[] = [
  {
    id: 't1',
    author: 'Dr. Rahul S.',
    authorAvatar: 'https://i.pravatar.cc/100?u=rahul',
    subject: 'Anatomy',
    topic: 'Neuroanatomy',
    title: 'Tips for remembering Cranial Nerve exit foramina?',
    content: 'I keep mixing up the foramina for CN IX, X, and XI. Anyone have a mnemonic or a high-yield table?',
    timestamp: Date.now() - 3600000 * 2,
    upvotes: 24,
    commentsCount: 8,
    isVerified: true
  },
  {
    id: 't2',
    author: 'Dr. Priya V.',
    authorAvatar: 'https://i.pravatar.cc/100?u=priya',
    subject: 'Pharmacology',
    topic: 'ANS',
    title: 'Mechanism of action of Varenicline?',
    content: 'Is it a full agonist or partial agonist at nicotine receptors?',
    timestamp: Date.now() - 3600000 * 12,
    upvotes: 12,
    commentsCount: 4,
    isVerified: false
  },
  {
    id: 't3',
    author: 'Dr. Kevin M.',
    authorAvatar: 'https://i.pravatar.cc/100?u=kevin',
    subject: 'Medicine',
    topic: 'Cardiology',
    title: 'ECG changes in Hyperkalemia',
    content: 'Beyond peaked T waves, what are the progressive changes we should know for NEET PG?',
    timestamp: Date.now() - 3600000 * 24,
    upvotes: 45,
    commentsCount: 15,
    isVerified: true
  }
];

const Community: React.FC = () => {
  const navigate = useNavigate();
  const [activeSubject, setActiveSubject] = useState('All');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  const subjects = ['All', 'Anatomy', 'Pharma', 'Medicine', 'Physio'];

  return (
    <div className="pb-40 bg-oneui-bg min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <h1 className="text-4xl font-light text-slate-900 leading-tight">Community<br/><span className="font-bold">Discussion</span></h1>
      </div>

      <div className="px-5 space-y-6 -mt-4">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl h-14 px-5 flex items-center gap-3 border border-slate-100 shadow-sm">
           <i className="fa-solid fa-magnifying-glass text-slate-300"></i>
           <input type="text" placeholder="Search doubts & discussions..." className="bg-transparent border-none flex-1 focus:outline-none font-medium text-sm" />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4">
           <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {subjects.map(s => (
                <button 
                  key={s}
                  onClick={() => setActiveSubject(s)}
                  className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                    activeSubject === s ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
           </div>
           
           <div className="flex justify-between items-center px-1">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                 <button 
                   onClick={() => setSortBy('latest')}
                   className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${sortBy === 'latest' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                 >
                   Latest
                 </button>
                 <button 
                   onClick={() => setSortBy('popular')}
                   className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${sortBy === 'popular' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                 >
                   Popular
                 </button>
              </div>
              <button className="text-oneui-blue text-[10px] font-black uppercase tracking-widest">Mark all read</button>
           </div>
        </div>

        {/* Thread List */}
        <div className="space-y-4">
           {MOCK_THREADS.map(thread => (
             <div 
               key={thread.id} 
               onClick={() => navigate(`/community/${thread.id}`)}
               className="bg-white p-6 rounded-samsung border border-slate-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer group"
             >
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                      <img src={thread.authorAvatar} className="w-8 h-8 rounded-full border border-slate-100" />
                      <div>
                         <p className="text-[11px] font-black text-slate-900">{thread.author}</p>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                           {new Date(thread.timestamp).toLocaleDateString()} • {thread.subject}
                         </p>
                      </div>
                   </div>
                   {thread.isVerified && (
                      <span className="bg-blue-50 text-oneui-blue text-[8px] font-black uppercase px-2 py-1 rounded-md border border-blue-100">
                         Mentor Verified
                      </span>
                   )}
                </div>

                <h3 className="text-lg font-black text-slate-900 leading-tight mb-2 group-hover:text-oneui-blue transition-colors">
                  {thread.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 font-medium leading-relaxed mb-5">
                  {thread.content}
                </p>

                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                   <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1.5 text-slate-400">
                         <i className="fa-regular fa-thumbs-up"></i>
                         <span className="text-xs font-black">{thread.upvotes}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                         <i className="fa-regular fa-comment"></i>
                         <span className="text-xs font-black">{thread.commentsCount}</span>
                      </div>
                   </div>
                   <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                      <i className="fa-solid fa-chevron-right text-xs"></i>
                   </button>
                </div>
             </div>
           ))}
        </div>

        {/* Floating Action Button */}
        <button className="fixed bottom-24 right-6 w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl active:scale-90 transition-all z-30">
           <i className="fa-solid fa-plus"></i>
        </button>
      </div>
    </div>
  );
};

export default Community;
