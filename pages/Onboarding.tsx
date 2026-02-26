
import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: (data: any) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    examTarget: 'NEET PG',
    attemptYear: '2025',
    university: '',
    currentYear: '1',
    mobile: '',
    age: '',
  });
  const [error, setError] = useState('');

  const nextStep = () => {
    if (step === 2 && !data.university.trim()) {
      setError('University name is required');
      return;
    }
    if (step === 3 && (!data.mobile.trim() || !data.age.trim())) {
      setError('Please fill all fields');
      return;
    }
    setError('');
    if (step < 3) setStep(step + 1);
    else onComplete(data);
  };

  const progress = (step / 3) * 100;

  return (
    <div className="flex flex-col h-full bg-synapse-blue-light">
      {/* Header with Semantic Typography */}
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 relative">
        <div className="absolute top-4 left-0 w-full px-8">
           <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-synapse-blue-primary transition-all duration-700 shadow-sm" 
                style={{ width: `${progress}%` }}
              ></div>
           </div>
        </div>
        <h1 className="text-4xl font-light text-synapse-text-primary leading-tight tracking-tight">
          {step === 1 && <>Exam<br/><span className="font-black text-synapse-blue-primary">Blueprint</span></>}
          {step === 2 && <>Academic<br/><span className="font-black text-synapse-blue-primary">Record</span></>}
          {step === 3 && <>Final<br/><span className="font-black text-synapse-blue-primary">Verification</span></>}
        </h1>
        <p className="text-[10px] text-synapse-text-secondary font-black uppercase tracking-[0.3em] mt-2">Step {step} of 3 • Profile Mastery</p>
      </div>

      <div className="flex-1 px-5 space-y-8 overflow-y-auto pb-48 no-scrollbar">
        {step === 1 && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-[0.2em] ml-1">Select Target Curriculum</p>
              <div className="grid grid-cols-1 gap-3">
                {['NEET PG', 'FMGE', 'INI CET'].map((exam) => (
                  <button
                    key={exam}
                    onClick={() => setData({ ...data, examTarget: exam })}
                    className={`h-18 px-6 rounded-2xl border-2 flex items-center justify-between font-black text-lg transition-all card-shadow ${
                      data.examTarget === exam 
                      ? 'border-synapse-blue-primary bg-synapse-blue-primary/10 text-synapse-text-primary shadow-lg' 
                      : 'border-white bg-white text-synapse-text-secondary'
                    }`}
                  >
                    {exam}
                    {data.examTarget === exam && <i className="fa-solid fa-circle-check text-synapse-blue-primary"></i>}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-[0.2em] ml-1">Attempt Year</p>
              <div className="flex gap-3">
                {['2025', '2026', '2027'].map((year) => (
                  <button
                    key={year}
                    onClick={() => setData({ ...data, attemptYear: year })}
                    className={`flex-1 h-14 rounded-xl font-black text-sm transition-all card-shadow ${
                      data.attemptYear === year 
                      ? 'bg-synapse-blue-primary text-white shadow-lg' 
                      : 'bg-white text-synapse-text-secondary border border-white'
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
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-[0.2em] ml-1">University / College Name</p>
              <input 
                type="text" 
                placeholder="Ex: AIIMS, New Delhi"
                className="w-full h-16 px-6 bg-white border border-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-synapse-blue-primary/10 text-synapse-text-primary font-bold text-lg transition-all card-shadow"
                value={data.university}
                onChange={(e) => { setData({...data, university: e.target.value}); setError(''); }}
              />
              {error && step === 2 && <p className="text-red-400 text-xs font-bold ml-1">{error}</p>}
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-[0.2em] ml-1">Current Academic Year</p>
              <div className="grid grid-cols-4 gap-2">
                {['1', '2', '3', '4', '5', '6', 'Completed'].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setData({ ...data, currentYear: yr })}
                    className={`h-14 rounded-xl font-black text-xs transition-all border card-shadow ${
                      data.currentYear === yr 
                      ? 'bg-synapse-blue-primary text-white border-synapse-blue-primary shadow-md' 
                      : 'bg-white text-synapse-text-secondary border-white'
                    } ${yr === 'Completed' ? 'col-span-2' : ''}`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-[0.2em] ml-1">Mobile Number</p>
              <div className="flex items-center bg-white border border-white rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-synapse-blue-primary/10 transition-all card-shadow">
                <span className="px-4 text-synapse-text-secondary font-black border-r border-slate-50">+91</span>
                <input 
                  type="tel" 
                  placeholder="9876543210"
                  className="flex-1 h-16 px-4 bg-transparent text-synapse-text-primary font-bold text-lg focus:outline-none"
                  value={data.mobile}
                  onChange={(e) => { setData({...data, mobile: e.target.value}); setError(''); }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-[0.2em] ml-1">Age</p>
              <input 
                type="number" 
                placeholder="Ex: 24"
                className="w-full h-16 px-6 bg-white border border-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-synapse-blue-primary/10 text-synapse-text-primary font-bold text-lg transition-all card-shadow"
                value={data.age}
                onChange={(e) => { setData({...data, age: e.target.value}); setError(''); }}
              />
            </div>
            {error && step === 3 && <p className="text-red-400 text-xs font-bold ml-1">{error}</p>}
          </div>
        )}
      </div>

      {/* Persistent Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-8 bg-gradient-to-t from-synapse-blue-light via-synapse-blue-light/90 to-transparent flex gap-4">
        {step > 1 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="w-24 h-20 bg-white border border-white text-synapse-text-primary rounded-samsung font-black text-xl flex items-center justify-center active:scale-95 transition-all card-shadow"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        )}
        <button 
          onClick={nextStep}
          className="flex-1 h-20 bg-synapse-blue-primary text-white rounded-samsung font-black text-xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          {step === 3 ? 'Sync Profile' : 'Confirm'}
          <i className="fa-solid fa-bolt text-xs opacity-40"></i>
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
