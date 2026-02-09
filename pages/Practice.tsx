
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
    } else {
      // Finished AI Session
      setMcqs([]);
    }
  };

  const progress = mcqs.length > 0 ? ((currentIdx + 1) / mcqs.length) * 100 : 0;

  return (
    <div className="flex flex-col h-full bg-oneui-bg min-h-screen">
      {/* Header & Progress Bar */}
      <div className="pt-4 pb-2 bg-oneui-bg">
        <div className="flex justify-between items-center px-8 mb-4">
          <h1 className="text-2xl font-black text-oneui-text-primary leading-tight">Practice<br/><span className="font-light text-oneui-text-secondary">Hub</span></h1>
          <div className="flex flex-col items-end gap-1">
            <div className="bg-oneui-surface px-4 py-2 rounded-2xl border border-oneui-border shadow-sm flex items-center gap-2">
              <span className="text-[10px] font-black text-oneui-text-secondary uppercase tracking-widest">AI Limit</span>
              <span className={`text-xs font-bold ${attemptsToday >= 3 ? 'text-red-500' : 'text-oneui-text-primary'}`}>{attemptsToday}/3</span>
            </div>
          </div>
        </div>
        {mcqs.length > 0 && (
          <div className="px-8 mb-4">
            <div className="w-full h-1.5 bg-oneui-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-oneui-blue transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-40 space-y-6">
        {/* PRACTICE SECTION DASHBOARD */}
        {mcqs.length === 0 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => navigate('/exam')}
                className="bg-oneui-surface border border-oneui-border rounded-samsung p-6 shadow-sm flex flex-col justify-between h-44 active:scale-95 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-blue-50 text-oneui-blue rounded-xl flex items-center justify-center text-2xl group-hover:bg-oneui-blue group-hover:text-white transition-colors">
                  <i className="fa-solid fa-file-invoice"></i>
                </div>
                <div>
                  <p className="font-black text-lg text-oneui-text-primary leading-tight">Mock Exam</p>
                  <p className="text-[10px] font-bold text-oneui-text-secondary uppercase tracking-widest mt-1">Full Syllabus</p>
                </div>
              </div>

              <div 
                onClick={() => {}} 
                className="bg-oneui-surface rounded-samsung p-6 border border-oneui-border shadow-sm flex flex-col justify-between h-44 active:scale-95 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center text-2xl group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                  <i className="fa-solid fa-bolt"></i>
                </div>
                <div>
                  <p className="font-black text-lg text-oneui-text-primary leading-tight">Daily Quiz</p>
                  <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest mt-1">10 mins left</p>
                </div>
              </div>
            </div>

            <div className="bg-oneui-surface rounded-samsung p-8 shadow-sm border border-oneui-border space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <div>
                   <h3 className="font-black text-oneui-text-primary leading-tight">AI Question Bank</h3>
                   <p className="text-[10px] font-black text-oneui-text-secondary uppercase tracking-widest">Custom topic practice</p>
                </div>
              </div>
              
              <p className="text-sm font-medium text-oneui-text-secondary leading-relaxed">Enter a clinical topic or syllabus code (e.g., AN1.1) to generate high-yield MCQs.</p>
              
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g. Hematology, Anatomy"
                  className="w-full h-16 pl-5 pr-16 bg-oneui-bg border border-oneui-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-oneui-blue/5 text-oneui-text-primary font-bold text-lg"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <button 
                  onClick={startPractice}
                  disabled={loading}
                  className={`absolute right-2 top-2 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all ${attemptsToday >= 3 ? 'bg-oneui-border' : 'bg-oneui-blue text-white'}`}
                >
                  {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-arrow-right"></i>}
                </button>
              </div>

              {attemptsToday >= 3 && (
                 <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-3">
                    <i className="fa-solid fa-lock text-red-500"></i>
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Daily AI limit reached. Upgrade to Pro.</p>
                 </div>
              )}
            </div>

            <div className="bg-slate-900 rounded-[32px] p-8 text-white space-y-6 shadow-2xl relative overflow-hidden group">
               <div className="absolute bottom-0 right-0 w-40 h-40 bg-oneui-blue/20 rounded-full -mb-20 -mr-20 blur-3xl"></div>
               <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-oneui-blue rounded-2xl flex items-center justify-center text-2xl">
                     <i className="fa-solid fa-robot"></i>
                  </div>
                  <h4 className="font-bold text-lg">Weakness Analysis</h4>
               </div>
               <p className="text-sm font-medium leading-relaxed opacity-80 relative z-10">
                  Our AI has detected gaps in your <span className="text-oneui-blue font-black">Neuroanatomy</span> knowledge. Would you like to practice high-yield foramen MCQs?
               </p>
               <button className="w-full h-14 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all relative z-10">
                  Analyze My Gaps
               </button>
            </div>
          </div>
        )}

        {/* MCQ Question Screen */}
        {mcqs.length > 0 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between text-[11px] font-black text-oneui-text-secondary px-2 tracking-widest">
              <span>QUESTION {currentIdx + 1} OF {mcqs.length}</span>
              <span className={`uppercase px-3 py-1 rounded-full ${
                mcqs[currentIdx].difficulty === 'hard' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-emerald-50 text-emerald-500 border border-emerald-100'
              }`}>
                {mcqs[currentIdx].difficulty}
              </span>
            </div>

            <div className="bg-oneui-surface p-8 rounded-samsung shadow-sm border border-oneui-border space-y-8 min-h-[400px] flex flex-col">
              <h2 className="text-2xl font-black text-oneui-text-primary leading-snug tracking-tight">
                {mcqs[currentIdx].question}
              </h2>

              <div className="flex-1 space-y-3">
                {mcqs[currentIdx].options.map((opt, i) => {
                  const isSelected = selectedOpt === i;
                  const isCorrect = i === mcqs[currentIdx].correctAnswer;
                  const showResult = showExplanation;
                  
                  let buttonStyle = "bg-oneui-bg border-transparent text-oneui-text-primary";
                  if (showResult) {
                    if (isCorrect) buttonStyle = "bg-emerald-50 border-emerald-500 text-emerald-900";
                    else if (isSelected) buttonStyle = "bg-red-50 border-red-500 text-red-900";
                  } else if (isSelected) {
                    buttonStyle = "bg-blue-50 border-oneui-blue text-oneui-text-primary";
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
                        isSelected ? 'bg-white' : 'bg-oneui-surface/80'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="font-bold text-[15px] leading-tight flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="pt-8 border-t border-oneui-border space-y-6 animate-in fade-in">
                  <div className="bg-oneui-bg p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${selectedOpt === mcqs[currentIdx].correctAnswer ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        <i className={`fa-solid ${selectedOpt === mcqs[currentIdx].correctAnswer ? 'fa-check' : 'fa-xmark'}`}></i>
                      </div>
                      <h4 className="font-black text-oneui-text-primary text-[10px] uppercase tracking-widest">
                        {selectedOpt === mcqs[currentIdx].correctAnswer ? 'CORRECT ANSWER' : 'INCORRECT CHOICE'}
                      </h4>
                    </div>
                    <p className="text-oneui-text-secondary text-[13px] leading-relaxed font-medium">
                      {mcqs[currentIdx].explanation}
                    </p>
                  </div>
                  <button 
                    onClick={handleNext}
                    className="w-full h-16 bg-slate-900 text-white rounded-samsung font-black text-lg hover:bg-oneui-blue active:scale-95 transition-all shadow-xl"
                  >
                    {currentIdx < mcqs.length - 1 ? 'Next Question' : 'Finish Session'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Daily Limit Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="absolute inset-0" onClick={() => setShowLimitModal(false)} />
           <div className="bg-oneui-surface rounded-t-[40px] w-full max-w-[430px] mx-auto p-8 shadow-2xl animate-in slide-in-from-bottom duration-500 relative z-10">
              <div className="w-12 h-1.5 bg-oneui-border rounded-full mx-auto mb-8" />
              <div className="text-center space-y-6">
                 <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full mx-auto flex items-center justify-center text-4xl shadow-inner">
                    <i className="fa-solid fa-hourglass-end"></i>
                 </div>
                 <div className="space-y-2">
                    <h2 className="text-2xl font-black text-oneui-text-primary">AI Limit Reached</h2>
                    <p className="text-sm text-oneui-text-secondary font-medium px-8 leading-relaxed">
                      You've used all free AI practice sessions for today. Formal testing (Mock Exams & Quizzes) remains available.
                    </p>
                 </div>
                 <button className="w-full h-16 bg-oneui-blue text-white rounded-samsung font-black text-lg shadow-xl shadow-blue-100 active:scale-95 transition-all">
                    Unlock Unlimited AI
                 </button>
                 <button onClick={() => setShowLimitModal(false)} className="text-[10px] font-black text-oneui-text-secondary uppercase tracking-widest">Back to Hub</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Practice;
