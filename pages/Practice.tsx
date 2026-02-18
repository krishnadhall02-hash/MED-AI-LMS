
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateMCQs } from '../services/gemini';
import { MCQ } from '../types';

const Practice: React.FC = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [attemptsToday, setAttemptsToday] = useState(2); 
  const [showLimitModal, setShowLimitModal] = useState(false);
  
  const [revealedHints, setRevealedHints] = useState({
    concept: false,
    elimination: false,
    clinical: false,
  });

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

  const handleNext = () => {
    if (currentIdx < mcqs.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setShowExplanation(false);
    } else {
      setMcqs([]);
    }
  };

  const progress = mcqs.length > 0 ? ((currentIdx + 1) / mcqs.length) * 100 : 0;

  return (
    <div className="flex flex-col h-full bg-oneui-bg min-h-screen">
      <div className="pt-4 pb-2">
        <div className="flex justify-between items-center px-8 mb-4">
          <h1 className="text-2xl font-black text-oneui-text-primary leading-tight">Practice<br/><span className="font-light text-oneui-text-secondary tracking-tight">Hub</span></h1>
          <div className="flex flex-col items-end gap-1">
            <div className="bg-synapse-surface px-4 py-2 rounded-2xl border border-synapse-border shadow-sm flex items-center gap-2">
              <span className="text-[10px] font-black text-oneui-text-muted uppercase tracking-widest">AI Limit</span>
              <span className={`text-xs font-bold ${attemptsToday >= 3 ? 'text-red-400' : 'text-oneui-text-primary'}`}>{attemptsToday}/3</span>
            </div>
          </div>
        </div>
        {mcqs.length > 0 && (
          <div className="px-8 mb-4">
            <div className="w-full h-1.5 bg-synapse-deep rounded-full overflow-hidden">
              <div 
                className="h-full bg-synapse-aqua transition-all duration-500 ease-out shadow-[0_0_10px_rgba(45,212,191,0.4)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-40 space-y-6">
        {mcqs.length === 0 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => navigate('/exam')}
                className="bg-synapse-surface border border-synapse-border rounded-samsung p-6 shadow-xl flex flex-col justify-between h-44 active:scale-95 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-synapse-aqua/10 text-synapse-aqua rounded-xl flex items-center justify-center text-2xl group-hover:bg-synapse-aqua group-hover:text-synapse-deep transition-colors">
                  <i className="fa-solid fa-file-invoice"></i>
                </div>
                <div>
                  <p className="font-black text-lg text-oneui-text-primary leading-tight">Mock Exam</p>
                  <p className="text-[10px] font-bold text-oneui-text-muted uppercase tracking-widest mt-1">Full Syllabus</p>
                </div>
              </div>

              <div 
                onClick={() => navigate('/customize-mock')} 
                className="bg-synapse-surface rounded-samsung p-6 border border-synapse-border shadow-xl flex flex-col justify-between h-44 active:scale-95 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-xl flex items-center justify-center text-2xl group-hover:bg-orange-500 group-hover:text-synapse-deep transition-colors">
                  <i className="fa-solid fa-stopwatch"></i>
                </div>
                <div>
                  <p className="font-black text-lg text-oneui-text-primary leading-tight">Custom Mock</p>
                  <p className="text-[10px] font-bold text-oneui-text-muted uppercase tracking-widest mt-1">Adjust Pacing</p>
                </div>
              </div>
            </div>

            <div className="bg-synapse-surface rounded-samsung p-8 shadow-xl border border-synapse-border space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-synapse-aqua/10 text-synapse-aqua rounded-2xl flex items-center justify-center text-2xl border border-synapse-aqua/20">
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <div>
                   <h3 className="font-black text-oneui-text-primary leading-tight">AI Question Generator</h3>
                   <p className="text-[10px] font-black text-oneui-text-muted uppercase tracking-widest">Topic level practice</p>
                </div>
              </div>
              
              <p className="text-sm font-medium text-oneui-text-secondary leading-relaxed">Input a clinical subject to generate AI-curated high-yield MCQs.</p>
              
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g. Hematology"
                  className="w-full h-16 pl-5 pr-16 bg-synapse-deep border border-synapse-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-synapse-aqua/20 text-oneui-text-primary font-bold text-lg placeholder:text-oneui-text-muted"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <button 
                  onClick={startPractice}
                  disabled={loading}
                  className={`absolute right-2 top-2 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all ${attemptsToday >= 3 ? 'bg-synapse-border text-oneui-text-muted' : 'bg-synapse-aqua text-synapse-deep'}`}
                >
                  {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-arrow-right"></i>}
                </button>
              </div>
            </div>
          </div>
        )}

        {mcqs.length > 0 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between text-[11px] font-black text-oneui-text-muted px-2 tracking-widest">
              <span>QUESTION {currentIdx + 1} OF {mcqs.length}</span>
              <span className={`uppercase px-3 py-1 rounded-full border ${
                mcqs[currentIdx].difficulty === 'hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {mcqs[currentIdx].difficulty}
              </span>
            </div>

            <div className="bg-synapse-surface p-8 rounded-samsung shadow-2xl border border-synapse-border space-y-8 min-h-[400px] flex flex-col">
              <h2 className="text-2xl font-black text-oneui-text-primary leading-snug tracking-tight">
                {mcqs[currentIdx].question}
              </h2>

              <div className="flex-1 space-y-3">
                {mcqs[currentIdx].options.map((opt, i) => {
                  const isSelected = selectedOpt === i;
                  const isCorrect = i === mcqs[currentIdx].correctAnswer;
                  const showResult = showExplanation;
                  
                  let buttonStyle = "bg-synapse-deep border-synapse-border text-oneui-text-secondary";
                  if (showResult) {
                    if (isCorrect) buttonStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-400";
                    else if (isSelected) buttonStyle = "bg-red-500/10 border-red-500 text-red-400";
                  } else if (isSelected) {
                    buttonStyle = "bg-synapse-aqua/10 border-synapse-aqua text-synapse-aqua";
                  }

                  return (
                    <button
                      key={i}
                      disabled={showResult}
                      onClick={() => {
                        setSelectedOpt(i);
                        setShowExplanation(true);
                      }}
                      className={`w-full text-left p-5 min-h-[72px] rounded-2xl border-2 transition-all flex items-center gap-5 active:scale-[0.98] ${buttonStyle}`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm ${
                        isSelected ? 'bg-synapse-aqua text-synapse-deep shadow-[0_0_10px_rgba(45,212,191,0.4)]' : 'bg-synapse-surface text-oneui-text-muted'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="font-bold text-[15px] leading-tight flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="pt-8 border-t border-synapse-border space-y-6 animate-in fade-in">
                  <div className="bg-synapse-deep p-6 rounded-2xl space-y-4 border border-synapse-border">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${selectedOpt === mcqs[currentIdx].correctAnswer ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        <i className={`fa-solid ${selectedOpt === mcqs[currentIdx].correctAnswer ? 'fa-check' : 'fa-xmark'}`}></i>
                      </div>
                      <h4 className="font-black text-oneui-text-primary text-[10px] uppercase tracking-widest">
                        {selectedOpt === mcqs[currentIdx].correctAnswer ? 'CORRECT CHOICE' : 'REASONING'}
                      </h4>
                    </div>
                    <p className="text-oneui-text-secondary text-[13px] leading-relaxed font-medium">
                      {mcqs[currentIdx].explanation}
                    </p>
                  </div>
                  <button 
                    onClick={handleNext}
                    className="w-full h-16 bg-synapse-aqua text-synapse-deep rounded-samsung font-black text-lg shadow-xl shadow-synapse-aqua/10 active:scale-95 transition-all"
                  >
                    {currentIdx < mcqs.length - 1 ? 'Next Challenge' : 'Exit Session'}
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
