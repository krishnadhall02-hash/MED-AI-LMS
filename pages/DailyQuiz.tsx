
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DAILY_QUESTION = {
  question: "A patient presents with 'winging of scapula'. Which nerve is most likely injured?",
  options: ["Long thoracic nerve", "Axillary nerve", "Radial nerve", "Thoracodorsal nerve"],
  correctIndex: 0,
  explanation: "Injury to the long thoracic nerve (C5-C7) paralyzes the serratus anterior muscle, leading to winging of the scapula."
};

const DailyQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isAlreadyAttempted, setIsAlreadyAttempted] = useState(false);

  useEffect(() => {
    const attempted = localStorage.getItem('daily_quiz_attempted');
    if (attempted) {
      setIsAlreadyAttempted(true);
      setSubmitted(true);
    }
  }, []);

  useEffect(() => {
    if (submitted || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [submitted, timeLeft]);

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    localStorage.setItem('daily_quiz_attempted', 'true');
  };

  if (isAlreadyAttempted && submitted) {
    return (
      <div className="flex flex-col h-full bg-oneui-bg min-h-screen p-8 animate-in fade-in duration-500">
        <div className="flex-1 flex flex-col justify-center text-center space-y-8">
           <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full mx-auto flex items-center justify-center text-5xl">
              <i className="fa-solid fa-circle-check"></i>
           </div>
           <div className="space-y-2">
              <h1 className="text-3xl font-black text-oneui-text-primary tracking-tight leading-tight">Already Attempted!</h1>
              <p className="text-sm text-oneui-text-secondary font-medium px-4">
                You've completed today's quiz. Keep coming back daily for the scholarship!
              </p>
           </div>
           
           <div className="bg-oneui-surface p-8 rounded-samsung border border-oneui-border shadow-sm text-left space-y-4">
              <h4 className="text-[10px] font-black text-oneui-blue uppercase tracking-widest">Correct Answer</h4>
              <p className="font-bold text-slate-800">{DAILY_QUESTION.options[DAILY_QUESTION.correctIndex]}</p>
              <div className="h-px bg-oneui-border" />
              <p className="text-xs text-oneui-text-secondary leading-relaxed italic">
                {DAILY_QUESTION.explanation}
              </p>
           </div>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="w-full h-16 bg-oneui-text-primary text-white rounded-samsung font-black text-sm uppercase tracking-widest active:scale-95 transition-all shadow-xl"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-oneui-bg overflow-hidden relative">
      {/* Header */}
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <div className="flex justify-between items-start">
          <button onClick={() => navigate(-1)} className="text-oneui-text-secondary active:scale-90 transition-all">
             <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
          <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${timeLeft < 10 ? 'bg-red-50 text-red-500 border-red-100 animate-pulse' : 'bg-white text-oneui-text-secondary border-oneui-border'}`}>
            <i className="fa-regular fa-clock"></i>
            <span className="font-mono font-black">{timeLeft}s</span>
          </div>
        </div>
        <h1 className="text-4xl font-light text-oneui-text-primary leading-tight mt-6">Daily<br/><span className="font-bold">Challenge</span></h1>
      </div>

      <div className="flex-1 px-5 space-y-8 overflow-y-auto pb-40">
        <div className="bg-oneui-surface p-8 rounded-samsung shadow-sm border border-oneui-border space-y-10 min-h-[400px]">
           {!submitted ? (
             <>
               <h2 className="text-2xl font-black text-oneui-text-primary leading-snug tracking-tight">
                 {DAILY_QUESTION.question}
               </h2>
               <div className="space-y-3">
                 {DAILY_QUESTION.options.map((opt, i) => (
                   <button
                     key={i}
                     onClick={() => setSelected(i)}
                     className={`w-full text-left p-5 min-h-[72px] rounded-2xl border-2 transition-all flex items-center gap-5 tap-target active:scale-[0.98] ${
                       selected === i ? 'border-oneui-blue bg-blue-50 text-oneui-blue' : 'border-oneui-bg bg-oneui-bg/50 text-oneui-text-primary'
                     }`}
                   >
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${
                       selected === i ? 'bg-oneui-blue text-white' : 'bg-white text-oneui-text-secondary'
                     }`}>
                       {String.fromCharCode(65 + i)}
                     </div>
                     <span className="font-bold text-[15px] leading-tight flex-1">{opt}</span>
                   </button>
                 ))}
               </div>
             </>
           ) : (
             <div className="animate-in zoom-in duration-500 space-y-8">
                <div className={`w-20 h-20 rounded-[28px] mx-auto flex items-center justify-center text-3xl text-white shadow-xl ${selected === DAILY_QUESTION.correctIndex ? 'bg-emerald-500' : 'bg-red-500'}`}>
                   <i className={`fa-solid ${selected === DAILY_QUESTION.correctIndex ? 'fa-check' : 'fa-xmark'}`}></i>
                </div>
                <div className="text-center space-y-2">
                   <h2 className="text-3xl font-black text-oneui-text-primary tracking-tight">{selected === DAILY_QUESTION.correctIndex ? 'Excellent!' : 'Oops, Not quite!'}</h2>
                   <p className="text-xs text-oneui-text-secondary font-medium">Your answer has been recorded for the Monthly Leaderboard.</p>
                </div>
                <div className="bg-oneui-bg/50 p-6 rounded-2xl space-y-3 border border-oneui-border">
                   <p className="text-[10px] font-black text-oneui-text-secondary uppercase tracking-widest">Explanation</p>
                   <p className="text-sm font-medium text-slate-700 leading-relaxed italic">{DAILY_QUESTION.explanation}</p>
                </div>
             </div>
           )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-8 bg-oneui-bg/80 backdrop-blur-md flex flex-col gap-4">
        {!submitted ? (
           <button 
             onClick={handleSubmit}
             disabled={selected === null}
             className="w-full h-16 bg-oneui-blue text-white rounded-samsung font-black text-xl shadow-xl shadow-blue-100 disabled:opacity-30 active:scale-95 transition-all"
           >
             Submit Answer
           </button>
        ) : (
           <button 
             onClick={() => navigate('/leaderboard')}
             className="w-full h-16 bg-slate-900 text-white rounded-samsung font-black text-xl shadow-xl active:scale-95 transition-all"
           >
             Check My Rank
           </button>
        )}
      </div>
    </div>
  );
};

export default DailyQuiz;
