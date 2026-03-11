
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateMCQs } from '../services/gemini';
import { MCQ } from '../types';

const RandomPracticeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'SETUP' | 'PRACTICE'>('SETUP');
  const [questionCount, setQuestionCount] = useState<10 | 20 | 50>(10);
  const [difficulty, setDifficulty] = useState<'Mixed' | 'Easy' | 'Moderate' | 'Hard'>('Mixed');
  
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const startRandomPractice = async () => {
    setLoading(true);
    setStep('PRACTICE');
    try {
      // In a real app, we'd pass count and difficulty to the service
      const data = await generateMCQs(`Random Mixed Medical MCQs, Count: ${questionCount}, Difficulty: ${difficulty}`);
      setMcqs(data);
      setCurrentIdx(0);
    } catch (e) {
      console.error(e);
      setStep('SETUP');
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
      navigate('/practice');
    }
  };

  if (step === 'SETUP') {
    return (
      <div className="flex flex-col h-full bg-synapse-blue-light min-h-screen">
        <div className="pt-4 pb-2">
          <div className="flex justify-between items-center px-8 mb-4">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-synapse-text-secondary border border-synapse-blue-soft active:scale-90 shadow-sm">
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <h1 className="text-2xl font-black text-synapse-text-primary leading-tight">Random<br/><span className="font-light text-synapse-text-secondary tracking-tight">Practice</span></h1>
            </div>
          </div>
        </div>

        <div className="px-5 space-y-6">
          <div className="bg-white rounded-samsung p-8 border border-white shadow-lg card-shadow space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-synapse-blue-primary/10 text-synapse-blue-primary rounded-2xl flex items-center justify-center text-3xl">
                <i className="fa-solid fa-shuffle"></i>
              </div>
              <div>
                <h3 className="text-xl font-black text-synapse-text-primary">Mixed MCQs</h3>
                <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">Simulate Exam Conditions</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest px-2">Question Count</p>
                <div className="flex gap-2">
                  {[10, 20, 50].map(count => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count as any)}
                      className={`flex-1 py-3 rounded-xl text-xs font-black transition-all border ${
                        questionCount === count ? 'bg-synapse-blue-primary text-white border-synapse-blue-primary shadow-md' : 'bg-slate-50 text-synapse-text-secondary border-slate-100'
                      }`}
                    >
                      {count} Qs
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest px-2">Difficulty Level</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Mixed', 'Easy', 'Moderate', 'Hard'].map(level => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level as any)}
                      className={`py-3 rounded-xl text-xs font-black transition-all border ${
                        difficulty === level ? 'bg-synapse-blue-primary text-white border-synapse-blue-primary shadow-md' : 'bg-slate-50 text-synapse-text-secondary border-slate-100'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={startRandomPractice}
              className="w-full h-14 bg-synapse-blue-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-synapse-blue-primary/20 active:scale-95 transition-all"
            >
              Start Random Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-synapse-blue-light min-h-screen">
      <div className="pt-4 pb-2">
        <div className="flex justify-between items-center px-8 mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setStep('SETUP')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-synapse-text-secondary border border-synapse-blue-soft active:scale-90 shadow-sm">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <h1 className="text-2xl font-black text-synapse-text-primary leading-tight">Random<br/><span className="font-light text-synapse-text-secondary tracking-tight">Practice</span></h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-40 space-y-6 no-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
             <div className="w-16 h-16 border-4 border-synapse-blue-primary border-t-transparent rounded-full animate-spin shadow-sm"></div>
             <p className="text-sm font-black text-synapse-blue-primary uppercase tracking-[0.3em] animate-pulse">Generating Random Set...</p>
          </div>
        ) : mcqs.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-[11px] font-black text-synapse-text-secondary px-2 tracking-widest">
              <span>QUESTION {currentIdx + 1} OF {mcqs.length}</span>
              <span className="uppercase px-3 py-1 rounded-full border bg-synapse-blue-primary/10 text-synapse-blue-primary border-synapse-blue-primary/20">
                {mcqs[currentIdx].difficulty}
              </span>
            </div>

            <div className="bg-white p-8 rounded-samsung shadow-2xl border border-white space-y-8 min-h-[400px] flex flex-col card-shadow">
              <h2 className="text-2xl font-black text-synapse-text-primary leading-snug tracking-tight">
                {mcqs[currentIdx].question}
              </h2>

              <div className="flex-1 space-y-3">
                {mcqs[currentIdx].options.map((opt, i) => {
                  const isSelected = selectedOpt === i;
                  const isCorrect = i === mcqs[currentIdx].correctAnswer;
                  const showResult = showExplanation;
                  
                  let buttonStyle = "bg-slate-50 border-slate-100 text-synapse-text-secondary";
                  if (showResult) {
                    if (isCorrect) buttonStyle = "bg-emerald-50 border-emerald-500 text-emerald-700";
                    else if (isSelected) buttonStyle = "bg-red-50 border-red-500 text-red-700";
                  } else if (isSelected) {
                    buttonStyle = "bg-synapse-blue-primary border-synapse-blue-primary text-white";
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
                        isSelected ? 'bg-white text-synapse-blue-primary shadow-sm' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="font-bold text-[15px] leading-tight flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="pt-8 border-t border-slate-100 space-y-6 animate-in fade-in">
                  <div className="bg-slate-50 p-6 rounded-2xl space-y-4 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${selectedOpt === mcqs[currentIdx].correctAnswer ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        <i className={`fa-solid ${selectedOpt === mcqs[currentIdx].correctAnswer ? 'fa-check' : 'fa-xmark'}`}></i>
                      </div>
                      <h4 className="font-black text-synapse-text-primary text-[10px] uppercase tracking-widest">
                        {selectedOpt === mcqs[currentIdx].correctAnswer ? 'CORRECT CHOICE' : 'REASONING'}
                      </h4>
                    </div>
                    <p className="text-synapse-text-secondary text-[13px] leading-relaxed font-medium">
                      {mcqs[currentIdx].explanation}
                    </p>
                  </div>
                  <button 
                    onClick={handleNext}
                    className="w-full h-16 bg-synapse-blue-primary text-white rounded-samsung font-black text-lg shadow-xl shadow-synapse-blue-primary/10 active:scale-95 transition-all"
                  >
                    {currentIdx < mcqs.length - 1 ? 'Next Challenge' : 'Exit Session'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RandomPracticeScreen;
