
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MCQ, ExamResult } from '../types';

const TestReview: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);

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

  if (loading || questions.length === 0) {
    return (
      <div className="h-screen bg-oneui-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-synapse-aqua border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const q = questions[currentIdx];
  const userAns = answers[currentIdx];
  const isCorrect = userAns === q.correctAnswer;
  const isSkipped = userAns === null;

  // Mock data for AI-suggested similar questions
  const similarTopics = [
    "Vascular Supply to the Brain",
    "Circle of Willis Anatomy",
    "Epidural vs Subdural Hematoma",
    "Ischemic Stroke Management",
    "CT Imaging Principles"
  ];

  return (
    <div className="pb-40 bg-oneui-bg min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-synapse-aqua/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <button onClick={() => navigate(-1)} className="w-10 h-10 -ml-2 text-white/60 mb-4 hover:text-white relative z-10 active:scale-90">
           <i className="fa-solid fa-arrow-left text-lg"></i>
        </button>
        <div className="flex justify-between items-end relative z-10">
          <div>
            <h1 className="text-3xl font-black leading-tight">Review<br/><span className="text-synapse-aqua">Submission</span></h1>
            <p className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Question {currentIdx + 1} of {questions.length}</p>
          </div>
          <div className={`px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${
            isSkipped ? 'bg-slate-800 text-slate-400 border-slate-700' :
            isCorrect ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
            'bg-red-500/20 text-red-400 border-red-500/30'
          }`}>
            {isSkipped ? 'Skipped' : isCorrect ? 'Correct' : 'Incorrect'}
          </div>
        </div>
      </div>

      <div className="px-5 space-y-6 -mt-6">
        {/* Navigation Grid */}
        <div className="bg-synapse-surface/60 backdrop-blur-md rounded-samsung p-4 border border-synapse-border overflow-x-auto no-scrollbar flex gap-2 relative z-20">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`min-w-[44px] h-11 rounded-xl font-black text-xs transition-all border-2 ${
                currentIdx === i ? 'bg-synapse-aqua text-synapse-deep border-synapse-aqua shadow-lg' :
                answers[i] === null ? 'bg-transparent border-slate-700 text-slate-500' :
                answers[i] === questions[i].correctAnswer ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question Card */}
        <div className="bg-synapse-surface p-8 rounded-samsung border border-synapse-border shadow-xl space-y-8">
          <h2 className="text-xl font-black text-oneui-text-primary leading-relaxed">
            {q.question}
          </h2>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isUserChoice = userAns === i;
              const isCorrectOpt = i === q.correctAnswer;
              
              let style = "bg-synapse-deep border-synapse-border text-oneui-text-secondary opacity-60";
              if (isCorrectOpt) style = "bg-emerald-500/10 border-emerald-500 text-emerald-400 opacity-100 ring-2 ring-emerald-500/20";
              else if (isUserChoice && !isCorrectOpt) style = "bg-red-500/10 border-red-500 text-red-400 opacity-100 ring-2 ring-red-500/20";

              return (
                <div
                  key={i}
                  className={`w-full text-left p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${style}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                    isUserChoice ? (isCorrect ? 'bg-emerald-500' : 'bg-red-500') : (isCorrectOpt ? 'bg-emerald-500' : 'bg-synapse-surface')
                  } text-white`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="font-bold flex-1 leading-tight">{opt}</span>
                  {isCorrectOpt && <i className="fa-solid fa-circle-check text-emerald-400 text-lg"></i>}
                  {isUserChoice && !isCorrectOpt && <i className="fa-solid fa-circle-xmark text-red-400 text-lg"></i>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Topic Explanation Section */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black text-oneui-text-muted uppercase tracking-[0.2em] px-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-synapse-aqua rounded-full"></div>
              Topic Explanation
           </h3>
           <div className="bg-synapse-surface/40 p-8 rounded-samsung border border-synapse-border space-y-6 backdrop-blur-md">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-synapse-aqua/10 text-synapse-aqua rounded-2xl flex items-center justify-center text-xl border border-synapse-aqua/20">
                    <i className="fa-solid fa-graduation-cap"></i>
                 </div>
                 <div>
                    <h4 className="font-black text-oneui-text-primary text-lg leading-tight">Clinical Perspective</h4>
                    <p className="text-[9px] font-black text-oneui-text-muted uppercase tracking-widest mt-0.5">{q.subject || 'General Medicine'}</p>
                 </div>
              </div>
              
              <div className="space-y-4 text-oneui-text-secondary text-sm font-medium leading-relaxed">
                 <p className="italic text-synapse-aqua/80">"{q.explanation}"</p>
                 <div className="h-[1px] w-full bg-synapse-border/40" />
                 <p>In competitive exams, differentiating between structural lesions and physiological disruptions is key. Focus on pathognomonic descriptors like "thunderclap" or "worst headache" to identify SAH quickly.</p>
              </div>

              <button className="w-full h-14 bg-white/5 border border-white/5 text-oneui-text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest active:bg-white/10 transition-all flex items-center justify-center gap-3">
                 <i className="fa-solid fa-robot text-synapse-aqua"></i>
                 Ask AI Core for Detail
              </button>
           </div>
        </div>

        {/* Attempt More Section */}
        <div className="space-y-4 pb-20">
           <h3 className="text-[10px] font-black text-oneui-text-muted uppercase tracking-[0.2em] px-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-synapse-warning rounded-full"></div>
              Attempt More Similar
           </h3>
           <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {similarTopics.map((topic, i) => (
                <div 
                  key={i} 
                  onClick={() => navigate('/practice')}
                  className="min-w-[200px] bg-synapse-surface p-6 rounded-samsung border border-synapse-border space-y-4 active:scale-95 transition-all cursor-pointer group"
                >
                   <div className="w-10 h-10 bg-synapse-warning/10 text-synapse-warning rounded-xl flex items-center justify-center border border-synapse-warning/20">
                      <i className="fa-solid fa-bolt-lightning text-xs"></i>
                   </div>
                   <p className="font-black text-oneui-text-primary text-xs leading-tight line-clamp-2 group-hover:text-synapse-aqua transition-colors">{topic}</p>
                   <div className="flex items-center justify-between pt-2">
                      <span className="text-[8px] font-bold text-oneui-text-muted uppercase tracking-widest">High Yield</span>
                      <i className="fa-solid fa-arrow-right text-[10px] text-synapse-border group-hover:translate-x-1 transition-transform group-hover:text-synapse-aqua"></i>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Bottom Sticky Nav */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 bg-gradient-to-t from-synapse-deep via-synapse-deep/90 to-transparent flex gap-3 z-40">
        <button 
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="flex-1 h-16 bg-synapse-surface border border-synapse-border text-oneui-text-primary rounded-samsung font-black text-xs uppercase tracking-widest active:scale-95 transition-all disabled:opacity-30"
        >
          Previous
        </button>
        <button 
          onClick={() => currentIdx < questions.length - 1 ? setCurrentIdx(prev => prev + 1) : navigate('/exam-results')}
          className="flex-1 h-16 bg-synapse-aqua text-synapse-deep rounded-samsung font-black text-xs uppercase tracking-widest shadow-xl shadow-synapse-aqua/20 active:scale-95 transition-all"
        >
          {currentIdx < questions.length - 1 ? 'Next Question' : 'Finish Review'}
        </button>
      </div>
    </div>
  );
};

export default TestReview;
