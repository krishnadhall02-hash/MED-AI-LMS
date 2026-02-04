
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { summarizeNote } from '../services/gemini';

const NoteViewer: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTool, setActiveTool] = useState<'pan' | 'pen' | 'highlight' | 'eraser'>('pan');
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([4, 12]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 24;

  const fetchSummary = async () => {
    if (summary) {
      setShowSummary(true);
      return;
    }
    setLoadingSummary(true);
    setShowSummary(true);
    try {
      const res = await summarizeNote("Cranial Nerves: Origin & Exit", "The cranial nerves are the nerves that emerge directly from the brain... CN I is olfactory... CN II is optic...");
      setSummary(res || "Summary unavailable.");
    } catch (e) {
      setSummary("Error generating summary.");
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 overflow-hidden relative select-none">
      {/* 1. Distraction-Free Top Bar */}
      <div className="bg-slate-900/80 backdrop-blur-md p-4 flex justify-between items-center border-b border-white/5 relative z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-white opacity-60 hover:opacity-100">
             <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <h2 className="text-white font-bold text-sm truncate max-w-[180px]">Cranial Nerves: Origin...</h2>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={fetchSummary}
             className="w-10 h-10 bg-oneui-blue text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-90 transition-all"
           >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
           </button>
           <button className="text-white opacity-60"><i className="fa-solid fa-magnifying-glass"></i></button>
           <button className="text-white opacity-60"><i className="fa-solid fa-ellipsis-vertical"></i></button>
        </div>
      </div>

      {/* 2. PDF View Area (Simulated) */}
      <div className="flex-1 overflow-y-auto bg-slate-800 p-4 pb-24 relative flex flex-col items-center gap-4">
         {/* Page 1 */}
         <div className="w-full max-w-[400px] aspect-[1/1.41] bg-white rounded-lg shadow-2xl p-10 relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-slate-100 font-black text-[10px] select-none pointer-events-none uppercase tracking-widest">Page 1</div>
            <div className="space-y-6">
               <div className="h-8 w-3/4 bg-slate-100 rounded" />
               <div className="space-y-3">
                  <div className="h-4 w-full bg-slate-50 rounded" />
                  <div className="h-4 w-full bg-slate-50 rounded" />
                  <div className="h-4 w-5/6 bg-slate-50 rounded" />
               </div>
               <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <p className="text-xs font-black text-oneui-blue uppercase mb-2">High-Yield Fact</p>
                  <p className="text-[13px] text-slate-700 font-medium italic">CN III, IV, and VI pass through the Superior Orbital Fissure.</p>
               </div>
               {/* Highlight Simulation */}
               <div className="absolute top-[160px] left-10 right-10 h-6 bg-yellow-400/30 rounded-sm pointer-events-none" />
            </div>
         </div>

         {/* Page 2 */}
         <div className="w-full max-w-[400px] aspect-[1/1.41] bg-white rounded-lg shadow-2xl p-10 opacity-50">
            <div className="space-y-4">
               <div className="h-4 w-full bg-slate-50 rounded" />
               <div className="h-4 w-full bg-slate-50 rounded" />
            </div>
         </div>
      </div>

      {/* 3. Annotation Tool Dock (One UI Floating Dock) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-900/90 backdrop-blur-xl p-1.5 rounded-[24px] border border-white/10 shadow-2xl z-20">
         {[
           { id: 'pan', icon: 'fa-hand' },
           { id: 'pen', icon: 'fa-pen-nib' },
           { id: 'highlight', icon: 'fa-highlighter' },
           { id: 'eraser', icon: 'fa-eraser' }
         ].map(tool => (
            <button 
              key={tool.id}
              onClick={() => setActiveTool(tool.id as any)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                activeTool === tool.id ? 'bg-oneui-blue text-white shadow-lg' : 'text-white opacity-40 hover:opacity-100'
              }`}
            >
               <i className={`fa-solid ${tool.icon}`}></i>
            </button>
         ))}
         <div className="w-[1px] h-6 bg-white/10 mx-2" />
         <button className="w-12 h-12 rounded-full flex items-center justify-center text-white opacity-40 hover:opacity-100">
            <i className="fa-solid fa-bookmark"></i>
         </button>
      </div>

      {/* 4. Page Slider Overlay */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 h-48 w-1.5 bg-white/10 rounded-full z-10 flex flex-col justify-end">
         <div 
           className="w-full bg-oneui-blue rounded-full transition-all" 
           style={{ height: `${(currentPage/totalPages)*100}%` }}
         />
      </div>

      {/* 5. AI Summary Sidebar (1.11C) */}
      {showSummary && (
        <div className="fixed inset-0 z-50 flex animate-in fade-in duration-300">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setShowSummary(false)} />
          <div className="w-[85%] max-w-[360px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
             <div className="p-8 pb-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-oneui-blue rounded-xl flex items-center justify-center text-white shadow-lg">
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                   </div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight">AI Note Digest</h3>
                </div>
                <button onClick={() => setShowSummary(false)} className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                   <i className="fa-solid fa-xmark"></i>
                </button>
             </div>

             <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
                {loadingSummary ? (
                   <div className="space-y-6">
                      <div className="h-4 bg-slate-100 rounded w-full animate-pulse" />
                      <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse" />
                      <div className="h-4 bg-slate-100 rounded w-4/6 animate-pulse" />
                   </div>
                ) : (
                  <div className="prose prose-sm text-slate-700 leading-relaxed space-y-6">
                    <p className="text-[13px] font-medium opacity-80 italic">Here are the exam-critical points for this session.</p>
                    <div className="whitespace-pre-line font-medium text-[14px]">
                       {summary}
                    </div>
                    <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                       <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-2">Memory Hack</p>
                       <p className="text-sm font-bold text-indigo-800">Use "OOOTTAFAGVSH" for CN sequence. Focus on Exit Foramina for NEXT 2024.</p>
                    </div>
                  </div>
                )}
             </div>

             <div className="p-8 border-t border-slate-50 flex gap-3">
                <button className="flex-1 h-14 bg-slate-100 text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">Copy</button>
                <button className="flex-1 h-14 bg-oneui-blue text-white rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-blue-100">Flashcard</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteViewer;
