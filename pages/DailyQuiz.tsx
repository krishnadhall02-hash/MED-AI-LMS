
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DAILY_QUESTION = {
  question: "A 28-year-old male presents with sudden onset of 'winging of scapula' after a gym session. Which nerve is most likely compromised?",
  options: ["Long thoracic nerve", "Axillary nerve", "Radial nerve", "Thoracodorsal nerve"],
  correctIndex: 0,
  explanation: "The Long Thoracic Nerve (C5-C7) supplies the Serratus Anterior. Injury leads to the inability to anchor the scapula against the thoracic wall, causing 'winging'. This is a high-yield clinical finding often seen after trauma or surgery."
};

const DailyQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const attempted = localStorage.getItem('daily_quiz_attempted');
    if (attempted === 'true') {
      setSubmitted(true);
    }
  }, []);

  useEffect(() => {
    if (submitted || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [submitted, timeLeft]);

  const handleSubmit = async () => {
    if (selected === null || isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Simulate API call to register attempt
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      localStorage.setItem('daily_quiz_attempted', 'true');
      localStorage.setItem('daily_quiz_time', timeTaken.toString());
      localStorage.setItem('daily_quiz_correct', (selected === DAILY_QUESTION.correctIndex).toString());
      
      setSubmitted(true);
    } catch (e) {
      alert("Submission failed. Please check your network.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-oneui-bg">
      {/* 1. Header Area */}
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="w-12 h-12 bg-oneui-surface rounded-full flex items-center justify-center text-oneui-text-secondary border border-oneui-border active:scale-90 transition-all"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          {!submitted && (
            <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 shadow-sm ${timeLeft < 10 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-oneui-text-secondary border-oneui-border'}`}>
              <i className="fa-regular fa-clock font-bold"></i>
              <span className="font-mono font-black text-lg">{timeLeft}s</span>
            </div>
          )}
        </div>
        <h1 className="text-4xl font-light text-oneui-text-primary leading-tight">Daily<br/><span className="font-bold">Challenge</span></h1>
      </div>

      {/* 2. Question Card */}
      <div className="px-5 space-y-6 pb-48">
        <div className="bg-oneui-surface p-8 rounded-samsung shadow-sm border border-oneui-border space-y-8 min-h-[400px]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-oneui-blue uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded border border-blue-100">Anatomy</span>
              <span className="text-[10px] font-black text-oneui-text-secondary uppercase tracking-widest">Question of the day</span>
            </div>
            <h2 className="text-2xl font-black text-oneui-text-primary leading-tight tracking-tight">
              {DAILY_QUESTION.question}
            </h2>
          </div>

          <div className="space-y-3">
            {DAILY_QUESTION.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === DAILY_QUESTION.correctIndex;
              const showResults = submitted;
              
              let style = "bg-oneui-bg border-transparent text-oneui-text-primary";
              if (showResults) {
                if (isCorrect) style = "bg-emerald-50 border-emerald-500 text-emerald-900";
                else if (isSelected) style = "bg-red-50 border-red-500 text-red-900";
              } else if (isSelected) {
                style = "bg-blue-50 border-oneui-blue text-oneui-blue";
              }

              return (
                <button
                  key={i}
                  disabled={submitted}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left p-5 min-h-[72px] rounded-2xl border-2 transition-all flex items-center gap-4 active:scale-[0.98] ${style}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${
                    isSelected ? 'bg-oneui-blue text-white' : 'bg-oneui-surface/80 text-oneui-text-secondary'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="font-bold flex-1">{opt}</span>
                  {showResults && isCorrect && <i className="fa-solid fa-circle-check text-emerald-500"></i>}
                  {showResults && isSelected && !isCorrect && <i className="fa-solid fa-circle-xmark text-red-500"></i>}
                </button>
              );
            })}
          </div>

          {submitted && (
            <div className="pt-6 border-t border-oneui-border animate-in fade-in duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${selected === DAILY_QUESTION.correctIndex ? 'bg-emerald-500' : 'bg-red-500'}`}>
                  <i className={`fa-solid ${selected === DAILY_QUESTION.correctIndex ? 'fa-check' : 'fa-xmark'}`}></i>
                </div>
                <h4 className="font-black text-oneui-text-primary text-[10px] uppercase tracking-widest">
                  {selected === DAILY_QUESTION.correctIndex ? 'Correct Answer' : 'Incorrect Answer'}
                </h4>
              </div>
              <div className="bg-oneui-bg p-6 rounded-2xl border border-oneui-border space-y-4">
                <p className="text-sm font-bold text-oneui-text-primary">Clinical Explanation</p>
                <p className="text-xs text-oneui-text-secondary leading-relaxed font-medium">
                  {DAILY_QUESTION.explanation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Fixed Bottom Action (Sit above BottomNav) */}
      <div className="fixed bottom-24 left-0 right-0 max-w-[430px] mx-auto px-6 z-40">
        {!submitted ? (
          <button 
            onClick={handleSubmit}
            disabled={selected === null || isSubmitting}
            className="w-full h-16 bg-slate-900 text-white rounded-samsung font-black text-lg shadow-2xl active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Verifying...</span>
              </>
            ) : (
              'Submit Answer'
            )}
          </button>
        ) : (
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/')}
              className="flex-1 h-16 bg-white border border-oneui-border text-oneui-text-primary rounded-samsung font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-sm"
            >
              Back to Home
            </button>
            <button 
              onClick={() => navigate('/leaderboard')}
              className="flex-1 h-16 bg-oneui-blue text-white rounded-samsung font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-all"
            >
              View Ranking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyQuiz;
