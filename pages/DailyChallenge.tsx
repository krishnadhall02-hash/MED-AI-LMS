
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const DailyChallenge: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Mock Question
  const question = {
    id: 'q_20240520',
    text: "A 45-year-old male presents with sudden onset of 'the worst headache of his life'. Non-contrast CT brain shows hyperdensity in the basal cisterns. What is the most likely underlying cause?",
    options: [
      "Rupture of a berry aneurysm",
      "Arteriovenous malformation bleed",
      "Hypertensive intracerebral hemorrhage",
      "Amyloid angiopathy"
    ],
    correctIndex: 0,
    explanation: "The classic presentation of 'thunderclap headache' (worst headache of life) combined with CT findings of blood in the basal cisterns is highly suggestive of a Subarachnoid Hemorrhage (SAH). The most common non-traumatic cause of SAH is the rupture of a berry (saccular) aneurysm, typically located in the Circle of Willis."
  };

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const handleSubmit = () => {
    if (isSubmitted) return;
    
    const correct = selectedOption === question.correctIndex;
    setIsCorrect(correct);
    setIsSubmitted(true);
    
    if (correct) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7FA6E8', '#5E8FDB', '#ffffff']
      });
    }

    // Save attempt to local storage
    localStorage.setItem('daily_challenge_attempted', 'true');
    localStorage.setItem('daily_challenge_date', new Date().toDateString());
    
    // Calculate score (mocking logic)
    const speedBonus = Math.floor(timeLeft / 10);
    const score = correct ? (10 + speedBonus) : 0;
    
    // In a real app, we would send this to the backend
    console.log(`Submitted! Score: ${score}`);
  };

  return (
    <div className="min-h-screen bg-synapse-light-bg pb-20">
      {/* Header */}
      <div className="bg-synapse-blue-primary pt-12 pb-8 px-6 rounded-b-[32px] shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="text-white active:scale-90 transition-all">
            <i className="fa-solid fa-chevron-left text-xl"></i>
          </button>
          <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
            <span className="text-white font-black text-xs uppercase tracking-widest">Daily Challenge</span>
          </div>
          <div className="w-8"></div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/20 mb-4">
            <span className={`text-3xl font-black ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>
          <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Time Remaining</p>
        </div>
      </div>

      <div className="px-6 -mt-6">
        <div className="bg-white rounded-samsung p-8 shadow-xl border border-white space-y-8 card-shadow">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-synapse-blue-primary">
              <i className="fa-solid fa-quote-left text-sm opacity-50"></i>
              <span className="text-[10px] font-black uppercase tracking-widest">Clinical Case</span>
            </div>
            <h2 className="text-lg font-bold text-synapse-text-primary leading-relaxed">
              {question.text}
            </h2>
          </div>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                disabled={isSubmitted}
                onClick={() => setSelectedOption(index)}
                className={`w-full p-5 rounded-2xl text-left font-bold text-sm transition-all border-2 flex items-center justify-between group ${
                  isSubmitted
                    ? index === question.correctIndex
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : selectedOption === index
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-slate-100 bg-slate-50 text-slate-400'
                    : selectedOption === index
                      ? 'border-synapse-blue-primary bg-synapse-blue-primary/5 text-synapse-blue-primary shadow-md'
                      : 'border-slate-100 bg-slate-50 text-synapse-text-secondary hover:border-synapse-blue-primary/30'
                }`}
              >
                <span>{option}</span>
                {isSubmitted && index === question.correctIndex && (
                  <i className="fa-solid fa-circle-check text-green-500"></i>
                )}
                {isSubmitted && selectedOption === index && index !== question.correctIndex && (
                  <i className="fa-solid fa-circle-xmark text-red-500"></i>
                )}
                {!isSubmitted && (
                  <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                    selectedOption === index ? 'border-synapse-blue-primary bg-synapse-blue-primary' : 'border-slate-300'
                  }`}>
                    {selectedOption === index && <div className="w-full h-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>}
                  </div>
                )}
              </button>
            ))}
          </div>

          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="w-full h-16 bg-synapse-blue-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-synapse-blue-primary/20 active:scale-95 transition-all disabled:opacity-30"
            >
              Submit Answer
            </button>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-top duration-500">
              <div className={`p-6 rounded-2xl border ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                <h4 className={`text-xs font-black uppercase tracking-widest mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? 'Excellent, Doctor!' : 'Neural Gap Detected'}
                </h4>
                <p className="text-sm text-synapse-text-primary leading-relaxed">
                  {question.explanation}
                </p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/leaderboard')}
                  className="flex-1 h-16 bg-synapse-blue-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                >
                  View Rankings
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-16 h-16 bg-white border border-slate-200 text-synapse-text-secondary rounded-2xl flex items-center justify-center active:scale-95 transition-all"
                >
                  <i className="fa-solid fa-house"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyChallenge;
