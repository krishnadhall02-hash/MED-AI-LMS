
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MCQ, ExamResult, SmartExplanation } from '../types';
import { generateSmartExplanation } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';

const TestReview: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [smartExplanations, setSmartExplanations] = useState<{ [key: string]: SmartExplanation }>({});
  const [isFetchingSmart, setIsFetchingSmart] = useState(false);
  const [showOptionsExplanations, setShowOptionsExplanations] = useState(false);

  useEffect(() => {
    const rawQs = sessionStorage.getItem('last_exam_questions');
    const rawAns = sessionStorage.getItem('last_exam_answers');
    
    if (!rawQs || !rawAns) {
      navigate('/practice');
      return;
    }

    setQuestions(JSON.parse(rawQs));
    setAnswers(JSON.parse(rawAns));
    setLoading(false);
  }, [navigate]);

  const fetchSmartExplanation = async () => {
    const q = questions[currentIdx];
    if (smartExplanations[q.id] || isFetchingSmart) return;

    setIsFetchingSmart(true);
    const result = await generateSmartExplanation(q);
    if (result) {
      setSmartExplanations(prev => ({ ...prev, [q.id]: result }));
    }
    setIsFetchingSmart(false);
  };

  if (loading || questions.length === 0) {
    return (
      <div className="h-screen bg-synapse-blue-light flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-synapse-blue-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const q = questions[currentIdx];
  const userAns = answers[currentIdx];
  const isCorrect = userAns === q.correctAnswer;
  const isSkipped = userAns === null;
  const smartExp = smartExplanations[q.id];

  // Mock data for AI-suggested similar questions
  const similarTopics = [
    "Vascular Supply to the Brain",
    "Circle of Willis Anatomy",
    "Epidural vs Subdural Hematoma",
    "Ischemic Stroke Management",
    "CT Imaging Principles"
  ];

  return (
    <div className="pb-40 bg-synapse-blue-light min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 bg-synapse-blue-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <button onClick={() => navigate(-1)} className="w-10 h-10 -ml-2 text-white/60 mb-4 hover:text-white relative z-10 active:scale-90">
           <i className="fa-solid fa-arrow-left text-lg"></i>
        </button>
        <div className="flex justify-between items-end relative z-10">
          <div>
            <h1 className="text-3xl font-black leading-tight">Review<br/><span className="text-white/80">Submission</span></h1>
            <p className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Question {currentIdx + 1} of {questions.length}</p>
          </div>
          <div className={`px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${
            isSkipped ? 'bg-white/20 text-white/60 border-white/10' :
            isCorrect ? 'bg-emerald-500 text-white border-emerald-400' :
            'bg-red-500 text-white border-red-400'
          }`}>
            {isSkipped ? 'Skipped' : isCorrect ? 'Correct' : 'Incorrect'}
          </div>
        </div>
      </div>

      <div className="px-5 space-y-6 -mt-6">
        {/* Navigation Grid */}
        <div className="bg-white/80 backdrop-blur-md rounded-samsung p-4 border border-white overflow-x-auto no-scrollbar flex gap-2 relative z-20 shadow-sm">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIdx(i);
                setShowOptionsExplanations(false);
              }}
              className={`min-w-[44px] h-11 rounded-xl font-black text-xs transition-all border-2 ${
                currentIdx === i ? 'bg-synapse-blue-primary text-white border-synapse-blue-primary shadow-lg' :
                answers[i] === null ? 'bg-transparent border-slate-200 text-slate-400' :
                answers[i] === questions[i].correctAnswer ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                'bg-red-50 border-red-100 text-red-600'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question Card */}
        <div className="bg-white p-8 rounded-samsung border border-white shadow-lg space-y-8 card-shadow">
          <h2 className="text-xl font-black text-synapse-text-primary leading-relaxed">
            {q.question}
          </h2>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isUserChoice = userAns === i;
              const isCorrectOpt = i === q.correctAnswer;
              
              let style = "bg-slate-50 border-slate-100 text-synapse-text-secondary opacity-60";
              if (isCorrectOpt) style = "bg-emerald-50 border-emerald-500 text-emerald-700 opacity-100 ring-2 ring-emerald-500/10";
              else if (isUserChoice && !isCorrectOpt) style = "bg-red-50 border-red-500 text-red-700 opacity-100 ring-2 ring-red-500/10";

              return (
                <div
                  key={i}
                  className={`w-full text-left p-5 rounded-2xl border-2 flex flex-col gap-2 transition-all ${style}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                      isUserChoice ? (isCorrect ? 'bg-emerald-500' : 'bg-red-500') : (isCorrectOpt ? 'bg-emerald-500' : 'bg-white border border-slate-200 shadow-sm')
                    } ${isCorrectOpt || isUserChoice ? 'text-white' : 'text-slate-400'}`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="font-bold flex-1 leading-tight">{opt}</span>
                    {isCorrectOpt && <i className="fa-solid fa-circle-check text-emerald-500 text-lg"></i>}
                    {isUserChoice && !isCorrectOpt && <i className="fa-solid fa-circle-xmark text-red-500 text-lg"></i>}
                  </div>
                  
                  {showOptionsExplanations && smartExp && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-2 text-[11px] font-medium text-slate-500 border-t border-slate-100 pt-2"
                    >
                      {smartExp.optionExplanations[i]}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Smart Explanation Section */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-[0.2em] px-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-synapse-blue-primary rounded-full"></div>
                Smart Explanation
              </div>
              {smartExp && (
                <button 
                  onClick={() => setShowOptionsExplanations(!showOptionsExplanations)}
                  className="text-synapse-blue-primary hover:underline"
                >
                  {showOptionsExplanations ? 'Hide Option Details' : 'Show Option Details'}
                </button>
              )}
           </h3>
           
           {!smartExp ? (
             <div className="bg-white p-8 rounded-samsung border border-white space-y-6 shadow-lg card-shadow">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-synapse-blue-primary/10 text-synapse-blue-primary rounded-2xl flex items-center justify-center text-xl border border-synapse-blue-primary/10">
                      <i className="fa-solid fa-graduation-cap"></i>
                   </div>
                   <div>
                      <h4 className="font-black text-synapse-text-primary text-lg leading-tight">Standard Explanation</h4>
                      <p className="text-[9px] font-black text-synapse-text-secondary uppercase tracking-widest mt-0.5">{q.subject || 'General Medicine'}</p>
                   </div>
                </div>
                
                <div className="space-y-4 text-synapse-text-secondary text-sm font-medium leading-relaxed">
                   <p className="italic text-synapse-blue-primary/80">"{q.explanation}"</p>
                </div>

                <button 
                  onClick={fetchSmartExplanation}
                  disabled={isFetchingSmart}
                  className="w-full h-14 bg-synapse-blue-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg shadow-synapse-blue-primary/20"
                >
                   {isFetchingSmart ? (
                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                   ) : (
                     <i className="fa-solid fa-wand-magic-sparkles"></i>
                   )}
                   {isFetchingSmart ? 'Generating Smart Insights...' : 'Generate Smart Explanation'}
                </button>
             </div>
           ) : (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-4"
             >
                {/* Most Tested Point */}
                <div className="bg-synapse-blue-primary/10 p-6 rounded-samsung border border-synapse-blue-primary/20 space-y-2 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-synapse-blue-primary/5 rounded-full -mr-12 -mt-12 blur-2xl" />
                   <div className="flex items-center gap-2 text-synapse-blue-primary relative z-10">
                      <i className="fa-solid fa-star text-xs animate-pulse"></i>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Most Tested Point</h4>
                   </div>
                   <p className="text-sm font-black text-synapse-text-primary leading-tight relative z-10">
                      {smartExp.mostTestedPoint}
                   </p>
                </div>

                {/* Concept Summary */}
                <div className="bg-white p-8 rounded-samsung border border-white space-y-4 shadow-lg card-shadow">
                   <div className="flex items-center gap-3 text-synapse-blue-primary">
                      <div className="w-8 h-8 bg-synapse-blue-primary/10 rounded-lg flex items-center justify-center border border-synapse-blue-primary/10">
                        <i className="fa-solid fa-brain text-sm"></i>
                      </div>
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Concept Summary</h4>
                   </div>
                   <div className="prose prose-sm max-w-none">
                      <p className="text-sm text-synapse-text-secondary leading-relaxed font-medium">
                        {smartExp.conceptSummary}
                      </p>
                   </div>
                </div>

                {/* Clinical Correlation */}
                <div className="bg-white p-8 rounded-samsung border border-white space-y-4 shadow-lg card-shadow">
                   <div className="flex items-center gap-3 text-emerald-600">
                      <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100">
                        <i className="fa-solid fa-stethoscope text-sm"></i>
                      </div>
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Clinical Correlation</h4>
                   </div>
                   <p className="text-sm text-synapse-text-secondary leading-relaxed">
                      {smartExp.clinicalCorrelation}
                   </p>
                </div>

                {/* Exam Trap Note */}
                <div className="bg-red-50 p-8 rounded-samsung border border-red-100 space-y-4 relative overflow-hidden shadow-sm">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/50 rounded-full -mr-16 -mt-16 blur-3xl" />
                   <div className="flex items-center gap-3 text-red-600 relative z-10">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center border border-red-200">
                        <i className="fa-solid fa-triangle-exclamation text-sm"></i>
                      </div>
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Exam Trap Note</h4>
                   </div>
                   <p className="text-sm text-red-900 leading-relaxed font-semibold relative z-10">
                      {smartExp.examTrapNote}
                   </p>
                </div>

                {/* Conditional: Booster & Mnemonic */}
                {smartExp.boosterExplanation && (
                  <div className="bg-synapse-blue-primary/5 p-8 rounded-samsung border border-synapse-blue-primary/10 space-y-4 shadow-sm">
                     <div className="flex items-center gap-3 text-synapse-blue-primary">
                        <div className="w-8 h-8 bg-synapse-blue-primary/10 rounded-lg flex items-center justify-center border border-synapse-blue-primary/10">
                          <i className="fa-solid fa-rocket text-sm"></i>
                        </div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Booster Insight</h4>
                     </div>
                     <p className="text-sm text-synapse-text-secondary leading-relaxed">
                        {smartExp.boosterExplanation}
                     </p>
                     {smartExp.mnemonic && (
                       <div className="mt-4 p-5 bg-white rounded-2xl border border-synapse-blue-soft italic text-synapse-blue-primary text-xs font-black tracking-wide flex items-center gap-3 shadow-sm">
                          <i className="fa-solid fa-lightbulb text-synapse-blue-primary/60"></i>
                          <span>Mnemonic: {smartExp.mnemonic}</span>
                       </div>
                     )}
                  </div>
                )}

                {/* Stepwise Reasoning */}
                {smartExp.stepwiseReasoning && (
                  <div className="bg-white p-8 rounded-samsung border border-white space-y-6 shadow-lg card-shadow">
                     <div className="flex items-center gap-3 text-synapse-text-secondary">
                        <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
                          <i className="fa-solid fa-list-ol text-sm"></i>
                        </div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Stepwise Reasoning</h4>
                     </div>
                     <div className="space-y-4">
                        {smartExp.stepwiseReasoning.map((step, i) => (
                          <div key={i} className="flex gap-4 items-start">
                             <div className="w-6 h-6 rounded-full bg-slate-50 border border-synapse-blue-soft flex items-center justify-center text-[10px] font-black text-synapse-blue-primary shrink-0 mt-0.5">
                                {i + 1}
                             </div>
                             <p className="text-sm text-synapse-text-secondary leading-relaxed">{step}</p>
                          </div>
                        ))}
                     </div>
                  </div>
                )}
             </motion.div>
           )}
        </div>

        {/* Attempt More Section */}
        <div className="space-y-4 pb-20">
           <h3 className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-[0.2em] px-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-synapse-warning rounded-full"></div>
              Attempt More Similar
           </h3>
           <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {similarTopics.map((topic, i) => (
                <div 
                  key={i} 
                  onClick={() => navigate('/practice')}
                  className="min-w-[200px] bg-white p-6 rounded-samsung border border-white space-y-4 active:scale-95 transition-all cursor-pointer group shadow-lg card-shadow"
                >
                   <div className="w-10 h-10 bg-synapse-warning/10 text-synapse-warning rounded-xl flex items-center justify-center border border-synapse-warning/20">
                      <i className="fa-solid fa-bolt-lightning text-xs"></i>
                   </div>
                   <p className="font-black text-synapse-text-primary text-xs leading-tight line-clamp-2 group-hover:text-synapse-blue-primary transition-colors">{topic}</p>
                   <div className="flex items-center justify-between pt-2">
                      <span className="text-[8px] font-bold text-synapse-text-secondary uppercase tracking-widest">High Yield</span>
                      <i className="fa-solid fa-arrow-right text-[10px] text-slate-200 group-hover:translate-x-1 transition-transform group-hover:text-synapse-blue-primary"></i>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Bottom Sticky Nav */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 bg-gradient-to-t from-synapse-blue-light via-synapse-blue-light/90 to-transparent flex gap-3 z-40">
        <button 
          onClick={() => {
            setCurrentIdx(prev => Math.max(0, prev - 1));
            setShowOptionsExplanations(false);
          }}
          disabled={currentIdx === 0}
          className="flex-1 h-16 bg-white border border-synapse-blue-soft text-synapse-text-primary rounded-samsung font-black text-xs uppercase tracking-widest active:scale-95 transition-all disabled:opacity-30 shadow-sm"
        >
          Previous
        </button>
        <button 
          onClick={() => {
            if (currentIdx < questions.length - 1) {
              setCurrentIdx(prev => prev + 1);
              setShowOptionsExplanations(false);
            } else {
              navigate('/exam-results');
            }
          }}
          className="flex-1 h-16 bg-synapse-blue-primary text-white rounded-samsung font-black text-xs uppercase tracking-widest shadow-xl shadow-synapse-blue-primary/20 active:scale-95 transition-all"
        >
          {currentIdx < questions.length - 1 ? 'Next Question' : 'Finish Review'}
        </button>
      </div>
    </div>
  );
};

export default TestReview;
