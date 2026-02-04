
import React, { useState } from 'react';
import { generateMCQs } from '../services/gemini';
import { MCQ } from '../types';

const Practice: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const startPractice = async () => {
    if (!topic) return;
    setLoading(true);
    setMcqs([]);
    setSelectedOpt(null);
    setShowExplanation(false);
    try {
      const data = await generateMCQs(topic);
      setMcqs(data);
      setCurrentIdx(0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIdx < mcqs.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setShowExplanation(false);
    }
  };

  return (
    <div className="pb-40">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
         <h1 className="text-4xl font-light text-slate-900 leading-tight">Targeted<br/><span className="font-bold">Practice</span></h1>
      </div>

      <div className="px-5 space-y-6">
        <div className="bg-white rounded-samsung p-6 shadow-sm border border-slate-100 space-y-4">
          <p className="text-sm font-bold text-slate-500 px-1 uppercase tracking-wider">What do you want to master?</p>
          <div className="relative">
            <input 
              type="text" 
              placeholder="e.g. Hematology, Cranial Nerves"
              className="w-full h-14 pl-4 pr-14 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-oneui-blue text-slate-800 font-medium"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button 
              onClick={startPractice}
              disabled={loading}
              className="absolute right-2 top-2 w-10 h-10 bg-oneui-blue text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-100"
            >
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
            </button>
          </div>
        </div>

        {mcqs.length > 0 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between text-[11px] font-black text-slate-400 px-2 tracking-widest">
              <span>QUESTION {currentIdx + 1} / {mcqs.length}</span>
              <span className={`uppercase px-2 py-0.5 rounded-full ${
                mcqs[currentIdx].difficulty === 'hard' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'
              }`}>
                {mcqs[currentIdx].difficulty}
              </span>
            </div>

            <div className="bg-white p-6 rounded-samsung shadow-sm border border-slate-100 space-y-8">
              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {mcqs[currentIdx].question}
              </h2>

              <div className="space-y-3">
                {mcqs[currentIdx].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (selectedOpt !== null) return;
                      setSelectedOpt(i);
                      setShowExplanation(true);
                    }}
                    className={`w-full text-left p-4 min-h-[64px] rounded-2xl border-2 transition-all flex items-center gap-4 ${
                      selectedOpt === i 
                        ? (i === mcqs[currentIdx].correctAnswer ? 'border-emerald-500 bg-emerald-50' : 'border-red-500 bg-red-50')
                        : (showExplanation && i === mcqs[currentIdx].correctAnswer ? 'border-emerald-500 bg-emerald-50' : 'border-slate-50 bg-slate-50/50 hover:bg-slate-100')
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                      selectedOpt === i ? 'bg-white shadow-sm text-slate-900' : 'bg-white text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="font-bold text-slate-700 flex-1">{opt}</span>
                  </button>
                ))}
              </div>

              {showExplanation && (
                <div className="pt-6 border-t border-slate-100 space-y-4 animate-in fade-in">
                  <div className="bg-slate-50 p-5 rounded-2xl">
                    <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                      <i className="fa-solid fa-comment-medical text-oneui-blue"></i>
                      AI Perspective
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{mcqs[currentIdx].explanation}</p>
                  </div>
                  <button 
                    onClick={handleNext}
                    className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-oneui-blue transition-all"
                  >
                    {currentIdx < mcqs.length - 1 ? 'Next Question' : 'Complete Practice'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;
