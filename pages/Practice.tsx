
import React, { useState, useEffect } from 'react';
import { generateMCQs } from '../services/gemini';
import { MCQ } from '../types';

const Practice: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [attemptsToday, setAttemptsToday] = useState(2); // Mock: Free user has 2/3 attempts left
  const [showLimitModal, setShowLimitModal] = useState(false);
  
  // Progressive Hint State
  const [revealedHints, setRevealedHints] = useState<{
    concept: boolean;
    elimination: boolean;
    clinical: boolean;
  }>({ concept: false, elimination: false, clinical: false });

  const startPractice = async () => {
    if (!topic) return;
    if (attemptsToday >= 3) {
      setShowLimitModal(true);
      return;
    }

    setLoading(true);
    setMcqs([]);
    setSelectedOpt(null);
    setShowExplanation(false);
    resetHints();
    try {
      const data = await generateMCQs(topic);
      setMcqs(data);
      setCurrentIdx(0);
      setAttemptsToday(prev => prev + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const resetHints = () => {
    setRevealedHints({ concept: false, elimination: false, clinical: false });
  };

  const handleNext = () => {
    if (currentIdx < mcqs.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setShowExplanation(false);
      resetHints();
    }
  };

  const revealHint = (type: keyof typeof revealedHints) => {
    setRevealedHints(prev => ({ ...prev, [type]: true }));
  };

  const progress = mcqs.length > 0 ? ((currentIdx + 1) / mcqs.length) * 100 : 0;

  return (
    <div className="flex flex-col h-full bg-oneui-bg">
      {/* 1. Header & Progress Bar */}
      <div className="pt-4 pb-2">
        <div className="flex justify-between items-center px-8 mb-4">
          <h1 className="text-2xl font-black text-slate-900 leading-tight">Practice<br/><span className="font-light text-slate-500">Mode</span></h1>
          <div className="flex flex-col items-end gap-1">
            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attempts</span>
              <span className={`text-xs font-bold ${attemptsToday >= 3 ? 'text-red-500' : 'text-slate-800'}`}>{attemptsToday}/3 Free</span>
            </div>
            {attemptsToday >= 3 && (
              <span className="text-[8px] font-black text-red-400 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded">Daily Limit Reached</span>
            )}
          </div>
        </div>
        <div className="px-8 mb-4">
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-oneui-blue transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-40 space-y-6">
        {/* Topic Input (Only shown if no MCQs started) */}
        {mcqs.length === 0 && (
          <div className="bg-white rounded-samsung p-6 shadow-sm border border-slate-100 space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 text-oneui-blue rounded-xl flex items-center justify-center text-xl">
                <i className="fa-solid fa-stethoscope"></i>
              </div>
              <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Target Mastery</h3>
            </div>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">Enter a clinical topic to generate personalized practice questions.</p>
            <div className="relative">
              <input 
                type="text" 
                placeholder="e.g. Hematology, Cranial Nerves"
                className="w-full h-14 pl-4 pr-14 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-oneui-blue text-slate-800 font-bold"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <button 
                onClick={startPractice}
                disabled={loading}
                className={`absolute right-2 top-2 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all ${attemptsToday >= 3 ? 'bg-slate-300' : 'bg-oneui-blue text-white'}`}
              >
                {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
              </button>
            </div>
          </div>
        )}

        {/* Upgrade Nudge in Practice Screen */}
        {mcqs.length === 0 && attemptsToday < 3 && (
           <div className="bg-indigo-600 p-6 rounded-[28px] text-white space-y-4 shadow-xl shadow-blue-50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl backdrop-blur-md">
                    <i className="fa-solid fa-bolt-lightning"></i>
                 </div>
                 <h4 className="font-bold">Endless Practice</h4>
              </div>
              <p className="text-xs font-medium opacity-80 leading-relaxed">
                 Free users get 3 practice sessions per day. Go Pro to unlock unlimited high-yield question generation.
              </p>
              <button className="w-full h-12 bg-white text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
                 Upgrade Plan
              </button>
           </div>
        )}

        {/* MCQ Question Screen */}
        {mcqs.length > 0 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            {/* Same MCQ layout as before */}
            <div className="flex items-center justify-between text-[11px] font-black text-slate-400 px-2 tracking-widest">
              <span>Q{currentIdx + 1} OF {mcqs.length}</span>
              <span className={`uppercase px-3 py-1 rounded-full ${
                mcqs[currentIdx].difficulty === 'hard' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-emerald-50 text-emerald-500 border border-emerald-100'
              }`}>
                {mcqs[currentIdx].difficulty}
              </span>
            </div>

            <div className="bg-white p-8 rounded-samsung shadow-sm border border-slate-100 space-y-8 min-h-[400px] flex flex-col">
              <h2 className="text-2xl font-black text-slate-900 leading-snug tracking-tight">
                {mcqs[currentIdx].question}
              </h2>

              <div className="flex-1 space-y-3">
                {mcqs[currentIdx].options.map((opt, i) => {
                  const isSelected = selectedOpt === i;
                  const isCorrect = i === mcqs[currentIdx].correctAnswer;
                  const showResult = showExplanation;
                  
                  let buttonStyle = "bg-slate-50/50 border-slate-50 text-slate-700";
                  if (showResult) {
                    if (isCorrect) buttonStyle = "bg-emerald-50 border-emerald-500 text-emerald-900";
                    else if (isSelected) buttonStyle = "bg-red-50 border-red-500 text-red-900";
                  } else if (isSelected) {
                    buttonStyle = "bg-blue-50 border-oneui-blue text-slate-900";
                  }

                  return (
                    <button
                      key={i}
                      disabled={showResult}
                      onClick={() => {
                        setSelectedOpt(i);
                        setShowExplanation(true);
                      }}
                      className={`w-full text-left p-5 min-h-[72px] rounded-2xl border-2 transition-all flex items-center gap-5 tap-target active:scale-[0.98] ${buttonStyle}`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${
                        isSelected ? 'bg-white' : 'bg-white/80'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="font-bold text-[15px] leading-tight flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Screen */}
              {showExplanation && (
                <div className="pt-8 border-t border-slate-100 space-y-6 animate-in fade-in">
                  <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${selectedOpt === mcqs[currentIdx].correctAnswer ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        <i className={`fa-solid ${selectedOpt === mcqs[currentIdx].correctAnswer ? 'fa-check' : 'fa-xmark'}`}></i>
                      </div>
                      <h4 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">
                        {selectedOpt === mcqs[currentIdx].correctAnswer ? 'CORRECT ANSWER' : 'INCORRECT CHOICE'}
                      </h4>
                    </div>
                    <p className="text-slate-600 text-[13px] leading-relaxed font-medium">
                      {mcqs[currentIdx].explanation}
                    </p>
                  </div>
                  <button 
                    onClick={handleNext}
                    className="w-full h-16 bg-slate-900 text-white rounded-samsung font-black text-lg hover:bg-oneui-blue active:scale-95 transition-all shadow-xl shadow-slate-200"
                  >
                    {currentIdx < mcqs.length - 1 ? 'Next Question' : 'Finish Session'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Daily Limit Modal (1.12B) */}
      {showLimitModal && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="absolute inset-0" onClick={() => setShowLimitModal(false)} />
           <div className="bg-white rounded-t-[40px] w-full max-w-[430px] mx-auto p-8 shadow-2xl animate-in slide-in-from-bottom duration-500 relative z-10">
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
              <div className="text-center space-y-6">
                 <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full mx-auto flex items-center justify-center text-4xl shadow-inner">
                    <i className="fa-solid fa-hourglass-end"></i>
                 </div>
                 <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900">Daily Limit Reached</h2>
                    <p className="text-sm text-slate-500 font-medium px-8 leading-relaxed">
                      You've used all 3 free practice sessions for today. Upgrade to Pro for unlimited AI-generated questions and progressive hints.
                    </p>
                 </div>
                 <button className="w-full h-16 bg-oneui-blue text-white rounded-samsung font-black text-lg shadow-xl shadow-blue-100 active:scale-95 transition-all">
                    Unlock Unlimited Practice
                 </button>
                 <button onClick={() => setShowLimitModal(false)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maybe Tomorrow</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Practice;
