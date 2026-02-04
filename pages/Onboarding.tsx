
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
    <div className="flex flex-col h-full bg-oneui-bg">
      {/* Progress Bar at top */}
      <div className="w-full h-1 bg-slate-200 mt-2">
        <div 
          className="h-full bg-oneui-blue transition-all duration-500" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <h1 className="text-4xl font-light text-slate-900 leading-tight">
          {step === 1 && <><span className="font-bold">Target</span><br/>Your Goal</>}
          {step === 2 && <><span className="font-bold">Study</span><br/>Habits</>}
          {step === 3 && <><span className="font-bold">Course</span><br/>Selection</>}
        </h1>
      </div>

      <div className="flex-1 px-5 space-y-6 overflow-y-auto pb-32">
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="space-y-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select Exam</p>
              <div className="grid grid-cols-1 gap-3">
                {['NEET PG', 'NEXT', 'FMGE', 'INI-CET'].map((exam) => (
                  <button
                    key={exam}
                    onClick={() => setData({ ...data, exam })}
                    className={`h-16 px-6 rounded-samsung border-2 flex items-center justify-between font-bold text-lg transition-all ${
                      data.exam === exam ? 'border-oneui-blue bg-white' : 'border-transparent bg-white shadow-sm'
                    }`}
                  >
                    {exam}
                    {data.exam === exam && <i className="fa-solid fa-circle-check text-oneui-blue"></i>}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Attempt Year</p>
              <div className="flex gap-3">
                {['2025', '2026', '2027'].map((year) => (
                  <button
                    key={year}
                    onClick={() => setData({ ...data, year })}
                    className={`flex-1 h-14 rounded-2xl font-bold transition-all ${
                      data.year === year ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200'
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
            <div className="bg-white p-8 rounded-samsung shadow-sm border border-slate-100 text-center space-y-4">
              <div className="w-20 h-20 bg-blue-50 text-oneui-blue rounded-full mx-auto flex items-center justify-center text-3xl">
                <i className="fa-solid fa-clock"></i>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Preferred daily study</p>
                <p className="text-4xl font-black text-slate-900">{data.studyHours} Hours</p>
              </div>
              <input 
                type="range" 
                min="1" 
                max="12" 
                step="1"
                value={data.studyHours}
                onChange={(e) => setData({ ...data, studyHours: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-oneui-blue"
              />
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>1h</span>
                <span>Casual</span>
                <span>Intense</span>
                <span>12h</span>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Enrolled Subjects</p>
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
                  className={`w-full h-16 px-6 rounded-samsung border-2 flex items-center justify-between font-bold text-lg transition-all ${
                    isSelected ? 'border-oneui-blue bg-white' : 'border-transparent bg-white shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-oneui-blue text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <i className="fa-solid fa-book text-sm"></i>
                    </div>
                    {subject}
                  </div>
                  {isSelected && <i className="fa-solid fa-check text-oneui-blue"></i>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-8 bg-oneui-bg/80 backdrop-blur-md flex gap-4">
        {step > 1 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="w-20 h-16 bg-white border border-slate-200 text-slate-800 rounded-samsung font-black text-xl flex items-center justify-center"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        )}
        <button 
          onClick={nextStep}
          className="flex-1 h-16 bg-oneui-blue text-white rounded-samsung font-black text-xl shadow-lg shadow-blue-200"
        >
          {step === 3 ? 'Get Started' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
