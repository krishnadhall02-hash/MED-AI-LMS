
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateMCQs } from '../services/gemini';
import { MCQ } from '../types';

type PracticeView = 'HUB' | 'SUBJECTS' | 'TOPICS' | 'PYQ' | 'MCQ_ENGINE';

const SUBJECTS = [
  { id: '1', name: 'Anatomy', icon: 'fa-skeleton', accuracy: 85, totalTopics: 18 },
  { id: '2', name: 'Physiology', icon: 'fa-heart-pulse', accuracy: 72, totalTopics: 15 },
  { id: '3', name: 'Biochemistry', icon: 'fa-dna', accuracy: 68, totalTopics: 12 },
  { id: '4', name: 'Pathology', icon: 'fa-microscope', accuracy: 92, totalTopics: 20 },
  { id: '5', name: 'Pharmacology', icon: 'fa-pills', accuracy: 55, totalTopics: 22 },
  { id: '6', name: 'Microbiology', icon: 'fa-virus', accuracy: 64, totalTopics: 14 },
];

const TOPICS_BY_SUBJECT: Record<string, string[]> = {
  '1': ['Neuroanatomy', 'Thorax', 'Abdomen', 'Upper Limb', 'Lower Limb', 'Embryology'],
  '2': ['General Physio', 'CVS', 'Respiratory', 'Renal', 'GIT', 'Endocrine'],
  '5': ['General Pharma', 'ANS', 'CVS Pharma', 'CNS Pharma', 'Chemotherapy'],
};

const EXAMS = ['NEET PG', 'INI-CET', 'FMGE'];
const YEARS = ['2023', '2022', '2021', '2020'];

const Practice: React.FC = () => {
  const navigate = useNavigate();
  
  // Navigation State
  const [view, setView] = useState<PracticeView>('HUB');
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  // PYQ Filters
  const [selectedExam, setSelectedExam] = useState('NEET PG');
  const [selectedYear, setSelectedYear] = useState('2023');

  // MCQ Engine State
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const [attemptsToday, setAttemptsToday] = useState(2); 
  const [showLimitModal, setShowLimitModal] = useState(false);

  const startPractice = async (topicStr: string) => {
    setLoading(true);
    setView('MCQ_ENGINE');
    setMcqs([]);
    setSelectedOpt(null);
    setShowExplanation(false);
    try {
      const data = await generateMCQs(topicStr);
      setMcqs(data);
      setCurrentIdx(0);
      setAttemptsToday(prev => prev + 1);
    } catch (e) {
      console.error(e);
      setView('HUB');
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
      setMcqs([]);
      setView('HUB');
    }
  };

  const goBack = () => {
    if (view === 'TOPICS') setView('SUBJECTS');
    else if (view === 'SUBJECTS' || view === 'PYQ' || view === 'MCQ_ENGINE') setView('HUB');
  };

  const progress = mcqs.length > 0 ? ((currentIdx + 1) / mcqs.length) * 100 : 0;

  return (
    <div className="flex flex-col h-full bg-synapse-blue-light min-h-screen">
      {/* Header Area */}
      <div className="pt-4 pb-2">
        <div className="flex justify-between items-center px-8 mb-4">
          <div className="flex items-center gap-4">
            {view !== 'HUB' && (
              <button onClick={goBack} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-synapse-text-secondary border border-synapse-blue-soft active:scale-90 shadow-sm">
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            )}
            <h1 className="text-2xl font-black text-synapse-text-primary leading-tight">Practice<br/><span className="font-light text-synapse-text-secondary tracking-tight">Hub</span></h1>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="bg-white px-4 py-2 rounded-2xl border border-synapse-blue-soft shadow-sm flex items-center gap-2">
              <span className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">AI Limit</span>
              <span className={`text-xs font-bold ${attemptsToday >= 3 ? 'text-synapse-error' : 'text-synapse-blue-primary'}`}>{attemptsToday}/3</span>
            </div>
          </div>
        </div>
        {view === 'MCQ_ENGINE' && mcqs.length > 0 && (
          <div className="px-8 mb-4">
            <div className="w-full h-1.5 bg-synapse-blue-soft rounded-full overflow-hidden">
              <div 
                className="h-full bg-synapse-blue-primary transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-40 space-y-6 no-scrollbar">
        
        {/* VIEW: HUB */}
        {view === 'HUB' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Main Action Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => setView('SUBJECTS')}
                className="bg-white border border-white rounded-samsung p-6 shadow-lg flex flex-col justify-between h-44 active:scale-95 transition-all cursor-pointer group card-shadow"
              >
                <div className="w-12 h-12 bg-synapse-blue-primary/10 text-synapse-blue-primary rounded-xl flex items-center justify-center text-2xl group-hover:bg-synapse-blue-primary group-hover:text-white transition-colors">
                  <i className="fa-solid fa-book-medical"></i>
                </div>
                <div>
                  <p className="font-black text-lg text-synapse-text-primary leading-tight">Subject-Wise</p>
                  <p className="text-[10px] font-bold text-synapse-text-secondary uppercase tracking-widest mt-1">Focused Mastery</p>
                </div>
              </div>

              <div 
                onClick={() => setView('PYQ')}
                className="bg-white rounded-samsung p-6 border border-white shadow-lg flex flex-col justify-between h-44 active:scale-95 transition-all cursor-pointer group card-shadow"
              >
                <div className="w-12 h-12 bg-synapse-warning/10 text-synapse-warning rounded-xl flex items-center justify-center text-2xl group-hover:bg-synapse-warning group-hover:text-white transition-colors">
                  <i className="fa-solid fa-clock-rotate-left"></i>
                </div>
                <div>
                  <p className="font-black text-lg text-synapse-text-primary leading-tight">PYQ Practice</p>
                  <p className="text-[10px] font-bold text-synapse-text-secondary uppercase tracking-widest mt-1">Previous Years</p>
                </div>
              </div>

              <div 
                onClick={() => navigate('/image-practice')}
                className="bg-white rounded-samsung p-6 border border-white shadow-lg flex flex-col justify-between h-44 active:scale-95 transition-all cursor-pointer group card-shadow"
              >
                <div className="w-12 h-12 bg-synapse-blue-primary/10 text-synapse-blue-primary rounded-xl flex items-center justify-center text-2xl group-hover:bg-synapse-blue-primary group-hover:text-white transition-colors">
                  <i className="fa-solid fa-image"></i>
                </div>
                <div>
                  <p className="font-black text-lg text-synapse-text-primary leading-tight">Image-Based</p>
                  <p className="text-[10px] font-bold text-synapse-text-secondary uppercase tracking-widest mt-1">Visual Diagnosis</p>
                </div>
              </div>

              <div 
                onClick={() => navigate('/random-practice')}
                className="bg-white rounded-samsung p-6 border border-white shadow-lg flex flex-col justify-between h-44 active:scale-95 transition-all cursor-pointer group card-shadow"
              >
                <div className="w-12 h-12 bg-synapse-aqua/10 text-synapse-aqua rounded-xl flex items-center justify-center text-2xl group-hover:bg-synapse-aqua group-hover:text-white transition-colors">
                  <i className="fa-solid fa-shuffle"></i>
                </div>
                <div>
                  <p className="font-black text-lg text-synapse-text-primary leading-tight">Random Practice</p>
                  <p className="text-[10px] font-bold text-synapse-text-secondary uppercase tracking-widest mt-1">Mixed MCQs</p>
                </div>
              </div>
            </div>

            {/* AI Generator Card */}
            <div className="bg-white rounded-samsung p-8 shadow-lg border border-white space-y-6 card-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-synapse-blue-primary/10 text-synapse-blue-primary rounded-2xl flex items-center justify-center text-2xl border border-synapse-blue-primary/10">
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <div>
                   <h3 className="font-black text-synapse-text-primary leading-tight">AI Core Generator</h3>
                   <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">Random High-Yield</p>
                </div>
              </div>
              <div className="bg-synapse-blue-light rounded-2xl p-5 border border-synapse-blue-soft space-y-4">
                 <p className="text-xs text-synapse-text-secondary leading-relaxed font-medium">Generate a mixed clinical set across all 19 subjects.</p>
                 <button 
                  onClick={() => startPractice('Mixed Medical High-Yield')}
                  className="w-full h-12 bg-synapse-blue-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm"
                 >
                   Initialize AI Sync
                 </button>
              </div>
            </div>

            {/* Global Exams */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-[0.2em] px-2">Global Testing</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div onClick={() => navigate('/exam')} className="bg-white p-5 rounded-2xl border border-white flex flex-col gap-3 active:scale-95 transition-all cursor-pointer shadow-sm card-shadow">
                    <i className="fa-solid fa-file-contract text-synapse-blue-primary"></i>
                    <p className="text-sm font-black text-synapse-text-primary">Mock Exams</p>
                 </div>
                 <div onClick={() => navigate('/customize-mock')} className="bg-white p-5 rounded-2xl border border-white flex flex-col gap-3 active:scale-95 transition-all cursor-pointer shadow-sm card-shadow">
                    <i className="fa-solid fa-sliders text-synapse-blue-primary"></i>
                    <p className="text-sm font-black text-synapse-text-primary">Custom Tests</p>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: SUBJECTS GRID */}
        {view === 'SUBJECTS' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
             <div className="flex justify-between items-center px-2">
                <h3 className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-[0.2em]">Select Subject</h3>
             </div>
             <div className="grid grid-cols-2 gap-4">
                {SUBJECTS.map(subj => (
                  <div 
                    key={subj.id}
                    onClick={() => { setSelectedSubject(subj); setView('TOPICS'); }}
                    className="bg-white border border-white rounded-samsung p-6 shadow-lg space-y-4 active:scale-95 transition-all cursor-pointer group hover:border-synapse-blue-primary/50 card-shadow"
                  >
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-synapse-blue-primary text-xl border border-slate-100 group-hover:bg-synapse-blue-primary group-hover:text-white transition-all shadow-sm">
                      <i className={`fa-solid ${subj.icon}`}></i>
                    </div>
                    <div>
                      <h4 className="font-black text-synapse-text-primary text-sm tracking-tight">{subj.name}</h4>
                      <div className="flex justify-between items-center mt-2">
                         <span className="text-[9px] font-bold text-synapse-text-secondary uppercase">{subj.totalTopics} Topics</span>
                         <span className="text-[9px] font-black text-synapse-blue-primary">{subj.accuracy}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                         <div className="h-full bg-synapse-blue-primary" style={{ width: `${subj.accuracy}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* VIEW: TOPICS LIST */}
        {view === 'TOPICS' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
             <div className="bg-white p-6 rounded-samsung border border-white flex items-center gap-5 shadow-lg card-shadow">
                <div className="w-14 h-14 bg-synapse-blue-primary/10 rounded-2xl flex items-center justify-center text-synapse-blue-primary text-2xl border border-synapse-blue-primary/10">
                   <i className={`fa-solid ${selectedSubject.icon}`}></i>
                </div>
                <div>
                   <h3 className="text-xl font-black text-synapse-text-primary">{selectedSubject.name}</h3>
                   <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">Neural Pathway Focus</p>
                </div>
             </div>
             <div className="space-y-3">
                {(TOPICS_BY_SUBJECT[selectedSubject.id] || ['Core Principles', 'Clinical Cases', 'High Yield Facts']).map(topicName => (
                  <div 
                    key={topicName}
                    onClick={() => startPractice(`${selectedSubject.name}: ${topicName}`)}
                    className="bg-white p-5 rounded-2xl border border-white flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer group shadow-sm card-shadow"
                  >
                     <p className="font-bold text-synapse-text-primary">{topicName}</p>
                     <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-synapse-blue-primary text-[10px] group-hover:bg-synapse-blue-primary group-hover:text-white transition-all border border-slate-100">
                        <i className="fa-solid fa-play ml-0.5"></i>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* VIEW: PYQ PRACTICE */}
        {view === 'PYQ' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
             {/* Filter Section */}
             <div className="space-y-6">
                <div className="space-y-3">
                   <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest px-2">Exam Category</p>
                   <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                      {EXAMS.map(exam => (
                        <button 
                          key={exam}
                          onClick={() => setSelectedExam(exam)}
                          className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                            selectedExam === exam ? 'bg-synapse-blue-primary text-white border-synapse-blue-primary shadow-md' : 'bg-white text-synapse-text-secondary border-synapse-blue-soft shadow-sm'
                          }`}
                        >
                          {exam}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-3">
                   <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest px-2">Select Year</p>
                   <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                      {YEARS.map(year => (
                        <button 
                          key={year}
                          onClick={() => setSelectedYear(year)}
                          className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                            selectedYear === year ? 'bg-synapse-blue-primary text-white border-synapse-blue-primary shadow-md' : 'bg-white text-synapse-text-secondary border-synapse-blue-soft shadow-sm'
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             {/* PYQ List */}
             <div className="space-y-4">
                <h3 className="text-xs font-black text-synapse-text-primary uppercase tracking-widest px-2 flex items-center gap-2">
                   Available Recalls <span className="text-[10px] text-synapse-text-secondary">(Mock Database)</span>
                </h3>
                <div className="space-y-3">
                   {[1, 2, 3].map(i => (
                     <div 
                      key={i}
                      onClick={() => startPractice(`${selectedExam} ${selectedYear} Recall Set ${i}`)}
                      className="bg-white p-6 rounded-samsung border border-white flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer group shadow-lg card-shadow"
                     >
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-synapse-warning text-xl border border-slate-100 shadow-sm">
                              <i className="fa-solid fa-clock-rotate-left"></i>
                           </div>
                           <div>
                              <h4 className="font-black text-synapse-text-primary">{selectedExam} {selectedYear} Set 0{i}</h4>
                              <p className="text-[9px] font-bold text-synapse-text-secondary uppercase tracking-widest mt-1">30 High-Yield Recalls • 45m Estimated</p>
                           </div>
                        </div>
                        <i className="fa-solid fa-chevron-right text-xs text-slate-200 group-hover:text-synapse-blue-primary transition-colors"></i>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* VIEW: MCQ ENGINE */}
        {view === 'MCQ_ENGINE' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-6">
                 <div className="w-16 h-16 border-4 border-synapse-blue-primary border-t-transparent rounded-full animate-spin shadow-sm"></div>
                 <p className="text-sm font-black text-synapse-blue-primary uppercase tracking-[0.3em] animate-pulse">Initializing Synapse...</p>
              </div>
            ) : mcqs.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-[11px] font-black text-synapse-text-secondary px-2 tracking-widest">
                  <span>QUESTION {currentIdx + 1} OF {mcqs.length}</span>
                  <span className={`uppercase px-3 py-1 rounded-full border ${
                    mcqs[currentIdx].difficulty === 'hard' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-emerald-50 text-emerald-500 border-emerald-100'
                  }`}>
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
        )}
      </div>
    </div>
  );
};

export default Practice;
