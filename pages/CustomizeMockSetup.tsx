
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomizeMockSetup: React.FC = () => {
  const navigate = useNavigate();
  const [questionCount, setQuestionCount] = useState(50);
  const [timeLimit, setTimeLimit] = useState(50); // minutes
  const [difficulty, setDifficulty] = useState<'Mixed' | 'Easy' | 'Medium' | 'Hard'>('Mixed');

  const defaultTime = questionCount; // 1 min per question
  const isSpeedMode = timeLimit < defaultTime;
  const secPerQuestion = Math.round((timeLimit * 60) / questionCount);

  const handleQuestionChange = (val: number) => {
    setQuestionCount(val);
    // Sync time limit if it was matching default
    if (timeLimit === questionCount || timeLimit > val) {
      setTimeLimit(val);
    }
  };

  const handleTimeChange = (val: number) => {
    if (val > questionCount) return; // Prevent increasing beyond default
    setTimeLimit(val);
  };

  const handleStart = () => {
    const config = {
      questionCount,
      timeLimit: timeLimit * 60, // seconds
      difficulty,
      isSpeedMode
    };
    sessionStorage.setItem('custom_exam_config', JSON.stringify(config));
    navigate('/custom-exam');
  };

  return (
    <div className="pb-40 bg-synapse-blue-light min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 -ml-2 text-synapse-text-secondary mb-2">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-4xl font-light text-synapse-text-primary leading-tight">Customize<br/><span className="font-bold">Mock Test</span></h1>
      </div>

      <div className="px-5 space-y-6 -mt-4">
        {/* Real-time Preview Card */}
        <div className="bg-synapse-blue-primary rounded-samsung p-8 text-white shadow-xl relative overflow-hidden card-shadow">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
           <div className="flex justify-between items-start relative z-10">
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-white/80 uppercase tracking-widest">Test Pace</p>
                 <p className="text-4xl font-black">{secPerQuestion} <span className="text-lg">sec/q</span></p>
              </div>
              {isSpeedMode && (
                <span className="bg-synapse-warning text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest animate-pulse shadow-lg">
                  Speed Mode
                </span>
              )}
           </div>
           <p className="text-xs font-medium opacity-80 mt-4 leading-relaxed relative z-10">
             {isSpeedMode 
               ? "High-pressure environment. Speed tests improve cognitive retrieval and time management." 
               : "Balanced pace. Ideal for building clinical reasoning and accuracy foundations."}
           </p>
        </div>

        {/* Configuration Sections */}
        <div className="bg-white rounded-samsung p-8 shadow-sm border border-white space-y-10 card-shadow">
          
          {/* Question Count */}
          <div className="space-y-4">
             <div className="flex justify-between items-center">
                <p className="text-xs font-black text-synapse-text-secondary uppercase tracking-widest">Questions</p>
                <span className="text-xl font-black text-synapse-text-primary">{questionCount}</span>
             </div>
             <input 
               type="range" 
               min="10" 
               max="200" 
               step="10"
               value={questionCount}
               onChange={(e) => handleQuestionChange(parseInt(e.target.value))}
               className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-synapse-blue-primary"
             />
             <div className="flex justify-between text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                <span>10 Qs</span>
                <span>Recommended: 50-100</span>
                <span>200 Qs</span>
             </div>
          </div>

          {/* Time Limit */}
          <div className="space-y-4">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <p className="text-xs font-black text-synapse-text-secondary uppercase tracking-widest">Time Limit</p>
                   {isSpeedMode && <i className="fa-solid fa-bolt text-synapse-warning text-[10px]"></i>}
                </div>
                <div className="text-right">
                   <span className="text-xl font-black text-synapse-text-primary">{timeLimit} <span className="text-sm">mins</span></span>
                </div>
             </div>
             <input 
               type="range" 
               min="10" 
               max={questionCount} 
               step="5"
               value={timeLimit}
               onChange={(e) => handleTimeChange(parseInt(e.target.value))}
               className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-synapse-blue-primary"
             />
             <div className="flex justify-between text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                <span>10 mins</span>
                <span className="text-synapse-blue-primary">Limit: {questionCount} mins (max)</span>
             </div>
             <p className="text-[10px] font-bold text-synapse-text-secondary leading-relaxed text-center italic">
               Reduce time to improve speed & accuracy. You cannot exceed 1 min/question.
             </p>
          </div>

          {/* Difficulty */}
          <div className="space-y-4">
             <p className="text-xs font-black text-synapse-text-secondary uppercase tracking-widest">Difficulty</p>
             <div className="grid grid-cols-2 gap-3">
                {['Mixed', 'Easy', 'Medium', 'Hard'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d as any)}
                    className={`h-14 rounded-2xl border-2 font-bold text-xs uppercase tracking-widest transition-all ${
                      difficulty === d ? 'border-synapse-blue-primary bg-synapse-blue-primary/10 text-synapse-blue-primary shadow-sm' : 'border-slate-50 text-slate-400'
                    }`}
                  >
                    {d}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-4">
           {isSpeedMode && (
             <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3 mb-4">
                <i className="fa-solid fa-circle-exclamation text-synapse-warning mt-0.5"></i>
                <p className="text-[10px] font-bold text-amber-800 leading-relaxed">
                  <span className="font-black">Pressure Alert:</span> You have set a time limit below the standard rate. Pause will be disabled for this speed test.
                </p>
             </div>
           )}
           <button 
             onClick={handleStart}
             className="w-full h-16 bg-synapse-blue-primary text-white rounded-samsung font-black text-xl shadow-xl shadow-synapse-blue-primary/10 active:scale-95 transition-all"
           >
             Create & Start Test
           </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeMockSetup;
