
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SUBJECTS = [
  { id: '1', name: 'Anatomy' },
  { id: '2', name: 'Physiology' },
  { id: '3', name: 'Biochemistry' },
  { id: '4', name: 'Pathology' },
  { id: '5', name: 'Pharmacology' },
  { id: '6', name: 'Microbiology' },
];

const TOPICS_BY_SUBJECT: Record<string, string[]> = {
  '1': ['Neuroanatomy', 'Thorax', 'Abdomen', 'Upper Limb', 'Lower Limb', 'Embryology'],
  '2': ['General Physio', 'CVS', 'Respiratory', 'Renal', 'GIT', 'Endocrine'],
  '5': ['General Pharma', 'ANS', 'CVS Pharma', 'CNS Pharma', 'Chemotherapy'],
};

const CustomPracticeSetup: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0].id);
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [questionCount, setQuestionCount] = useState(20);
  const [difficulty, setDifficulty] = useState<'Mixed' | 'Easy' | 'Moderate' | 'Hard'>('Mixed');
  const [useTimer, setUseTimer] = useState(false);

  const topics = ['All Topics', ...(TOPICS_BY_SUBJECT[selectedSubject] || ['Core Principles', 'Clinical Cases'])];

  const handleStart = () => {
    // In a real app, this would configure the practice engine
    // For now, we'll navigate to practice with some state
    navigate('/practice', { 
      state: { 
        mode: 'CUSTOM_PRACTICE',
        config: {
          subject: SUBJECTS.find(s => s.id === selectedSubject)?.name,
          topic: selectedTopic,
          count: questionCount,
          difficulty,
          useTimer
        }
      } 
    });
  };

  return (
    <div className="pb-40 bg-synapse-blue-light min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 relative">
        <button onClick={() => navigate(-1)} className="absolute top-4 left-6 w-12 h-12 flex items-center justify-center text-synapse-text-secondary active:scale-90">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="text-4xl font-light text-synapse-text-primary leading-tight tracking-tight">Custom<br/><span className="font-bold">Practice Test</span></h1>
      </div>

      <div className="px-5 space-y-6 -mt-4">
        <div className="bg-white rounded-samsung p-8 shadow-lg border border-white space-y-8 card-shadow">
          
          {/* Subject Selection */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest px-2">Select Subject</label>
            <div className="relative">
              <select 
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setSelectedTopic('All Topics');
                }}
                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 font-bold text-synapse-text-primary appearance-none focus:outline-none focus:border-synapse-blue-primary transition-colors"
              >
                {SUBJECTS.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <i className="fa-solid fa-chevron-down"></i>
              </div>
            </div>
          </div>

          {/* Topic Selection */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest px-2">Select Topic</label>
            <div className="relative">
              <select 
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 font-bold text-synapse-text-primary appearance-none focus:outline-none focus:border-synapse-blue-primary transition-colors"
              >
                {topics.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <i className="fa-solid fa-chevron-down"></i>
              </div>
            </div>
          </div>

          {/* Question Count */}
          <div className="space-y-4">
             <div className="flex justify-between items-center px-2">
                <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">Question Count</p>
                <span className="text-xl font-black text-synapse-text-primary">{questionCount}</span>
             </div>
             <div className="flex gap-2">
                {[10, 20, 50, 100].map(count => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all border ${
                      questionCount === count ? 'bg-synapse-blue-primary text-white border-synapse-blue-primary shadow-md' : 'bg-slate-50 text-synapse-text-secondary border-slate-100'
                    }`}
                  >
                    {count}
                  </button>
                ))}
             </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-4">
             <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest px-2">Difficulty Level</p>
             <div className="grid grid-cols-2 gap-3">
                {['Mixed', 'Easy', 'Moderate', 'Hard'].map((d) => (
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

          {/* Timer Toggle */}
          <div className="flex items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-100">
             <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${useTimer ? 'bg-synapse-blue-primary text-white' : 'bg-slate-200 text-slate-400'}`}>
                   <i className="fa-solid fa-clock"></i>
                </div>
                <div>
                   <p className="text-sm font-black text-synapse-text-primary">Enable Timer</p>
                   <p className="text-[10px] font-bold text-synapse-text-secondary uppercase tracking-widest">1 min per question</p>
                </div>
             </div>
             <button 
               onClick={() => setUseTimer(!useTimer)}
               className={`w-12 h-6 rounded-full relative transition-colors ${useTimer ? 'bg-synapse-blue-primary' : 'bg-slate-300'}`}
             >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${useTimer ? 'left-7' : 'left-1'}`} />
             </button>
          </div>

          <button 
            onClick={handleStart}
            className="w-full h-16 bg-synapse-blue-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-synapse-blue-primary/20 active:scale-95 transition-all"
          >
            Start Practice Session
          </button>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-samsung flex items-start gap-4">
           <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
              <i className="fa-solid fa-lightbulb"></i>
           </div>
           <p className="text-xs font-medium text-emerald-800 leading-relaxed">
             <span className="font-black">Learning Mode:</span> Instant explanations are enabled for this mode to help you reinforce concepts as you practice.
           </p>
        </div>
      </div>
    </div>
  );
};

export default CustomPracticeSetup;
