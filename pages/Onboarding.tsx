
import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: (data: any) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    exam: 'NEET PG',
    year: '2025',
    studyHours: 4,
    enrolledCourses: [] as string[]
  });

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else onComplete(data);
  };

  const progress = (step / 3) * 100;

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* 1. Header with Semantic Typography */}
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 relative">
        <div className="absolute top-4 left-0 w-full px-8">
           <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-synapse-aqua transition-all duration-700 shadow-[0_0_10px_rgba(45,212,191,0.5)]" 
                style={{ width: `${progress}%` }}
              ></div>
           </div>
        </div>
        <h1 className="text-4xl font-light text-oneui-text-primary leading-tight tracking-tight">
          {step === 1 && <>Neural<br/><span className="font-black text-synapse-aqua">Alignment</span></>}
          {step === 2 && <>Study<br/><span className="font-black text-synapse-aqua">Habits</span></>}
          {step === 3 && <>Core<br/><span className="font-black text-synapse-aqua">Selection</span></>}
        </h1>
      </div>

      <div className="flex-1 px-5 space-y-8 overflow-y-auto pb-48">
        {step === 1 && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-oneui-text-muted uppercase tracking-[0.2em] ml-1">Select Active Curriculum</p>
              <div className="grid grid-cols-1 gap-3">
                {['NEET PG', 'NEXT', 'FMGE', 'INI-CET'].map((exam) => (
                  <button
                    key={exam}
                    onClick={() => setData({ ...data, exam })}
                    className={`h-20 px-6 rounded-2xl border-2 flex items-center justify-between font-black text-lg transition-all ${
                      data.exam === exam 
                      ? 'border-synapse-aqua bg-synapse-aqua/10 text-oneui-text-primary shadow-[0_0_20px_rgba(45,212,191,0.1)]' 
                      : 'border-synapse-border bg-synapse-surface text-oneui-text-secondary'
                    }`}
                  >
                    {exam}
                    {data.exam === exam && <i className="fa-solid fa-circle-check text-synapse-aqua"></i>}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-oneui-text-muted uppercase tracking-[0.2em] ml-1">Target Year</p>
              <div className="flex gap-3">
                {['2025', '2026', '2027'].map((year) => (
                  <button
                    key={year}
                    onClick={() => setData({ ...data, year })}
                    className={`flex-1 h-14 rounded-xl font-black text-sm transition-all ${
                      data.year === year 
                      ? 'bg-synapse-aqua text-synapse-deep shadow-lg shadow-synapse-aqua/20' 
                      : 'bg-synapse-surface text-oneui-text-muted border border-synapse-border'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 animate-in slide-in-from-right duration-300">
            <div className="bg-synapse-surface p-10 rounded-samsung border border-synapse-border text-center space-y-8 shadow-2xl backdrop-blur-md">
              <div className="w-24 h-24 bg-synapse-aqua/10 text-synapse-aqua rounded-full mx-auto flex items-center justify-center text-4xl border border-synapse-aqua/20 shadow-[0_0_30px_rgba(45,212,191,0.1)]">
                <i className="fa-solid fa-brain"></i>
              </div>
              <div>
                <p className="text-xs font-black text-oneui-text-muted uppercase tracking-widest mb-2">Daily Learning Capacity</p>
                <p className="text-5xl font-black text-oneui-text-primary tracking-tighter">{data.studyHours} <span className="text-xl text-oneui-text-secondary uppercase">Hrs</span></p>
              </div>
              <input 
                type="range" 
                min="1" 
                max="12" 
                step="1"
                value={data.studyHours}
                onChange={(e) => setData({ ...data, studyHours: parseInt(e.target.value) })}
                className="w-full h-2 bg-synapse-deep rounded-full appearance-none cursor-pointer accent-synapse-aqua"
              />
              <div className="flex justify-between text-[9px] font-black text-oneui-text-muted uppercase tracking-widest">
                <span>Casual</span>
                <span>Elite Intern</span>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <p className="text-[10px] font-black text-oneui-text-muted uppercase tracking-[0.2em] ml-1">Unlock Learning Modules</p>
            {['Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Pharmacology'].map((subject) => {
              const isSelected = data.enrolledCourses.includes(subject);
              return (
                <button
                  key={subject}
                  onClick={() => {
                    const courses = isSelected 
                      ? data.enrolledCourses.filter(c => c !== subject)
                      : [...data.enrolledCourses, subject];
                    setData({ ...data, enrolledCourses: courses });
                  }}
                  className={`w-full h-18 px-6 rounded-2xl border-2 flex items-center justify-between font-black transition-all ${
                    isSelected 
                    ? 'border-synapse-aqua bg-synapse-aqua/10 text-oneui-text-primary shadow-lg shadow-synapse-aqua/5' 
                    : 'border-synapse-border bg-synapse-surface text-oneui-text-secondary'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isSelected ? 'bg-synapse-aqua text-synapse-deep' : 'bg-synapse-deep text-oneui-text-muted'}`}>
                      <i className="fa-solid fa-vial-circle-check"></i>
                    </div>
                    <span className="text-lg">{subject}</span>
                  </div>
                  {isSelected && <i className="fa-solid fa-check text-synapse-aqua"></i>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Persistent Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-8 bg-gradient-to-t from-synapse-deep to-transparent flex gap-4">
        {step > 1 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="w-24 h-20 bg-synapse-surface border border-synapse-border text-oneui-text-primary rounded-samsung font-black text-xl flex items-center justify-center active:scale-95 transition-all"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        )}
        <button 
          onClick={nextStep}
          className="flex-1 h-20 bg-synapse-aqua text-synapse-deep rounded-samsung font-black text-xl shadow-[0_10px_40px_rgba(45,212,191,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          {step === 3 ? 'Sync All Modules' : 'Save & Proceed'}
          <i className="fa-solid fa-bolt text-xs opacity-40"></i>
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
