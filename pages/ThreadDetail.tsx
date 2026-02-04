
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DiscussionThread, Comment, UserRole } from '../types';
import { suggestSimilarQuestions } from '../services/gemini';

const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    author: 'Dr. Anand Sharma',
    authorRole: UserRole.MENTOR,
    authorAvatar: 'https://i.pravatar.cc/100?u=dr_anand',
    text: 'A great way to remember is: "Superior orbital fissure (CN III, IV, V1, VI), Foramen Rotundum (V2), Foramen Ovale (V3), Internal acoustic meatus (VII, VIII), Jugular foramen (IX, X, XI), Hypoglossal canal (XII)." Focus on the Jugular foramen for IX-XI.',
    timestamp: Date.now() - 3600000,
    isVerified: true,
    upvotes: 32
  },
  {
    id: 'c2',
    author: 'Dr. Amit K.',
    authorRole: UserRole.STUDENT,
    authorAvatar: 'https://i.pravatar.cc/100?u=amit',
    text: 'Thanks Dr. Anand! That really helps. Does the internal jugular vein also pass through the jugular foramen?',
    timestamp: Date.now() - 1800000,
    isVerified: false,
    upvotes: 5
  }
];

const ThreadDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [thread, setThread] = useState<DiscussionThread | null>(null);
  const [comments] = useState<Comment[]>(MOCK_COMMENTS);
  const [similarQs, setSimilarQs] = useState<string[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    // Mock fetch thread
    const t: DiscussionThread = {
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
    };
    setThread(t);

    const fetchAI = async () => {
      setLoadingAI(true);
      const res = await suggestSimilarQuestions(t.title, t.content);
      setSimilarQs(res);
      setLoadingAI(false);
    };
    fetchAI();
  }, [id]);

  if (!thread) return null;

  return (
    <div className="pb-40 bg-oneui-bg min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-oneui-blue/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <button onClick={() => navigate(-1)} className="w-10 h-10 -ml-2 text-white/60 mb-4 hover:text-white relative z-10">
           <i className="fa-solid fa-arrow-left text-lg"></i>
        </button>
        <div className="flex flex-wrap gap-2 mb-2 relative z-10">
           <span className="bg-white/10 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-white/10">{thread.subject}</span>
           <span className="bg-white/10 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-white/10">{thread.topic}</span>
        </div>
        <h1 className="text-2xl font-black leading-tight relative z-10">{thread.title}</h1>
      </div>

      <div className="px-5 space-y-6 -mt-6">
        {/* Thread Question */}
        <div className="bg-white p-8 rounded-samsung border border-slate-100 shadow-xl relative z-20">
           <div className="flex items-center gap-4 mb-6">
              <img src={thread.authorAvatar} className="w-10 h-10 rounded-full border border-slate-50" />
              <div>
                 <p className="text-sm font-black text-slate-900">{thread.author}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question • {new Date(thread.timestamp).toLocaleTimeString()}</p>
              </div>
           </div>
           <p className="text-[15px] text-slate-700 font-medium leading-relaxed mb-6">
             {thread.content}
           </p>
           <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl text-slate-600 active:scale-95 transition-all">
                 <i className="fa-regular fa-thumbs-up"></i>
                 <span className="text-xs font-black">{thread.upvotes}</span>
              </button>
              <button className="flex items-center gap-2 text-slate-400 px-4 py-2 rounded-xl">
                 <i className="fa-solid fa-share-nodes"></i>
                 <span className="text-xs font-black uppercase tracking-widest">Share</span>
              </button>
           </div>
        </div>

        {/* AI Suggested Questions (1.13B) */}
        <div className="space-y-3">
           <div className="flex items-center gap-2 px-2">
              <div className="w-1.5 h-1.5 bg-oneui-blue rounded-full"></div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Suggested Discovery</h3>
           </div>
           <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {loadingAI ? (
                [1,2].map(i => <div key={i} className="min-w-[200px] h-16 bg-white rounded-2xl animate-pulse border border-slate-50" />)
              ) : similarQs.map((q, i) => (
                <div key={i} className="min-w-[240px] bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3 active:scale-95 transition-all cursor-pointer">
                   <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-oneui-blue shadow-sm">
                      <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
                   </div>
                   <p className="text-[11px] font-black text-slate-700 leading-tight line-clamp-2">{q}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Comments Section */}
        <div className="space-y-4">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Answers ({comments.length})</h3>
           {comments.map(comment => (
             <div key={comment.id} className={`bg-white p-6 rounded-samsung border ${comment.isVerified ? 'border-blue-100 ring-2 ring-blue-50' : 'border-slate-100'} shadow-sm space-y-4`}>
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                      <img src={comment.authorAvatar} className="w-8 h-8 rounded-full border border-slate-50" />
                      <div>
                         <div className="flex items-center gap-2">
                            <p className="text-[11px] font-black text-slate-900">{comment.author}</p>
                            {comment.authorRole === UserRole.MENTOR && (
                               <span className="bg-slate-900 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-tighter">MENTOR</span>
                            )}
                         </div>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(comment.timestamp).toLocaleTimeString()}</p>
                      </div>
                   </div>
                   {comment.isVerified && (
                      <div className="flex items-center gap-1 text-oneui-blue">
                         <i className="fa-solid fa-circle-check text-xs"></i>
                         <span className="text-[9px] font-black uppercase tracking-widest">Solution</span>
                      </div>
                   )}
                </div>

                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  {comment.text}
                </p>

                <div className="flex items-center gap-4 pt-2">
                   <button className="flex items-center gap-2 text-slate-400 hover:text-oneui-blue active:scale-90 transition-all">
                      <i className="fa-regular fa-thumbs-up"></i>
                      <span className="text-xs font-black">{comment.upvotes}</span>
                   </button>
                   <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reply</button>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Reply Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center gap-3 z-30">
         <div className="flex-1 bg-slate-100 h-14 rounded-2xl px-5 flex items-center gap-3 border border-transparent focus-within:border-oneui-blue focus-within:bg-white transition-all">
            <input type="text" placeholder="Add a helpful answer..." className="bg-transparent border-none flex-1 focus:outline-none font-medium text-sm text-slate-800" />
         </div>
         <button className="w-14 h-14 bg-oneui-blue text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 active:scale-90 transition-all">
            <i className="fa-solid fa-paper-plane"></i>
         </button>
      </div>
    </div>
  );
};

export default ThreadDetail;
