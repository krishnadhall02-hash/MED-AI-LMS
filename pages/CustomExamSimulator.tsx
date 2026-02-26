
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MCQ, ExamResult } from '../types';

const MOCK_BASE_QUESTIONS: MCQ[] = [
  {
    id: 'e1',
    question: 'A 45-year-old male presents with sudden onset of severe headache ("worst headache of life"). CT shows blood in the basal cisterns. What is the most likely diagnosis?',
    options: ['Epidural Hematoma', 'Subdural Hematoma', 'Subarachnoid Hemorrhage', 'Intracerebral Hemorrhage'],
    correctAnswer: 2,
    explanation: 'Thunderclap headache is classic for SAH, often due to a ruptured berry aneurysm.',
    difficulty: 'medium',
    subject: 'Medicine'
  },
  {
    id: 'e2',
    question: 'The ligamentum teres is a remnant of which fetal structure?',
    options: ['Ductus venosus', 'Left umbilical vein', 'Right umbilical vein', 'Urachus'],
    correctAnswer: 1,
    explanation: 'The left umbilical vein becomes the ligamentum teres after birth.',
    difficulty: 'easy',
    subject: 'Anatomy'
  },
  {
    id: 'e3',
    question: 'Which of the following is the most sensitive imaging modality for detecting early acute ischemic stroke?',
    options: ['Non-contrast CT Brain', 'CT Angiography', 'Diffusion-weighted MRI', 'T2-weighted MRI'],
    correctAnswer: 2,
    explanation: 'DWI MRI can detect ischemic changes within minutes of onset.',
    difficulty: 'medium',
    subject: 'Radiology'
  }
];

const CustomExamSimulator: React.FC = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<any>(null);
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [skipped, setSkipped] = useState<boolean[]>([]);
  const [hintLevels, setHintLevels] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const rawConfig = sessionStorage.getItem('custom_exam_config');
    if (!rawConfig) {
      navigate('/practice');
      return;
    }
    const parsed = JSON.parse(rawConfig);
    setConfig(parsed);
    setTimeLeft(parsed.timeLimit);
    
    // Generate questions to match requested count
    const generated: MCQ[] = [];
    for (let i = 0; i < parsed.questionCount; i++) {
      const base = MOCK_BASE_QUESTIONS[i % MOCK_BASE_QUESTIONS.length];
      generated.push({ ...base, id: `custom-${i}`, question: `[Q${i+1}] ${base.question}` });
    }
    setQuestions(generated);
    setAnswers(new Array(parsed.questionCount).fill(null));
    setSkipped(new Array(parsed.questionCount).fill(false));
    setHintLevels(new Array(parsed.questionCount).fill(0));
    setIsInitializing(false);
  }, [navigate]);

  const handleSubmit = useCallback(() => {
    if (!config) return;

    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    const subjectBreakdown: { [key: string]: { correct: number, total: number } } = {};

    answers.forEach((ans, i) => {
      const q = questions[i];
      const subj = q.subject || 'General';
      if (!subjectBreakdown[subj]) subjectBreakdown[subj] = { correct: 0, total: 0 };
      subjectBreakdown[subj].total += 1;

      if (ans === null) {
        unanswered += 1;
      } else if (ans === q.correctAnswer) {
        correct += 1;
        subjectBreakdown[subj].correct += 1;
      } else {
        incorrect += 1;
      }
    });

    const result: ExamResult = {
      totalQuestions: questions.length,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      unanswered,
      timeSpent: config.timeLimit - timeLeft,
      score: (correct * 4) - (incorrect * 1),
      accuracy: (correct / (correct + incorrect)) * 100 || 0,
      subjectBreakdown
    };

    sessionStorage.setItem('last_exam_result', JSON.stringify(result));
    sessionStorage.setItem('last_exam_questions', JSON.stringify(questions));
    sessionStorage.setItem('last_exam_answers', JSON.stringify(answers));
    sessionStorage.setItem('is_speed_test', config.isSpeedMode ? 'true' : 'false');
    navigate('/exam-results');
  }, [answers, timeLeft, questions, config, navigate]);

  useEffect(() => {
    if (isInitializing || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isInitializing, timeLeft, handleSubmit]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optIdx;
    setAnswers(newAnswers);

    const newSkips = [...skipped];
    newSkips[currentIdx] = false;
    setSkipped(newSkips);
  };

  const handleHint = () => {
    const newLevels = [...hintLevels];
    newLevels[currentIdx] = Math.min(newLevels[currentIdx] + 1, 2);
    setHintLevels(newLevels);
  };

  const handleSkip = () => {
    const newSkips = [...skipped];
    newSkips[currentIdx] = true;
    setSkipped(newSkips);
    
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsPaletteOpen(true);
    }
  };

  if (isInitializing) {
    return (
      <div className="h-screen bg-synapse-blue-light flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-synapse-blue-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 1. Header with custom timer display */}
      <div className="bg-synapse-blue-primary text-white p-4 flex justify-between items-center shadow-lg relative z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/practice')} className="text-white/60 hover:text-white">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
          <div className="h-8 w-[1px] bg-white/10 mx-1"></div>
          <div className="flex flex-col">
             <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Custom Mock</span>
             {config.isSpeedMode && (
                <span className="text-[8px] font-bold text-amber-300 uppercase flex items-center gap-1">
                   <i className="fa-solid fa-bolt"></i> Speed Mode
                </span>
             )}
          </div>
        </div>

        <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10 ${timeLeft < 60 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/5'}`}>
          <i className="fa-regular fa-clock"></i>
          <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
        </div>

        <button 
          onClick={handleSubmit}
          className="bg-white text-synapse-blue-primary px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all shadow-sm"
        >
          Submit
        </button>
      </div>

      {/* 2. Question Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-synapse-blue-light">
        <div className="flex justify-between items-center text-[10px] font-black text-synapse-text-secondary tracking-[0.15em] uppercase px-1">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <div className="flex items-center gap-2">
             <i className="fa-solid fa-gauge-high text-[10px] text-synapse-text-secondary/40"></i>
             <span>{Math.round((questions.length - currentIdx) * (config.timeLimit / questions.length / 60))}m est. left</span>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-white space-y-8 min-h-[300px] card-shadow">
          <h2 className="text-xl font-bold text-synapse-text-primary leading-relaxed">
            {questions[currentIdx].question}
          </h2>

          <div className="space-y-3">
            {questions[currentIdx].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectOption(i)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-4 card-shadow ${
                  answers[currentIdx] === i 
                    ? 'border-synapse-blue-primary bg-synapse-blue-primary/10 text-synapse-text-primary' 
                    : 'border-white bg-white text-synapse-text-secondary'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${
                   answers[currentIdx] === i ? 'bg-synapse-blue-primary text-white' : 'bg-slate-50 text-slate-400'
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="font-semibold flex-1 leading-tight">{opt}</span>
              </button>
            ))}
          </div>

          {/* Hint and Skip Buttons */}
          <div className="flex items-center gap-4 pt-2">
             <button 
               onClick={handleHint}
               className={`flex-1 h-14 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${
                 hintLevels[currentIdx] > 0 ? 'bg-synapse-blue-primary/10 border-synapse-blue-primary/20 text-synapse-blue-primary' : 'bg-slate-50 border-slate-100 text-slate-400'
               }`}
             >
               <i className="fa-solid fa-lightbulb"></i>
               <span className="text-[10px] font-black uppercase tracking-widest">
                  {hintLevels[currentIdx] === 0 ? 'Hint' : `Hint ${hintLevels[currentIdx]}`}
               </span>
             </button>
             <button 
               onClick={handleSkip}
               className="h-14 px-8 bg-slate-100 border border-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest active:bg-slate-200 transition-all"
             >
               Skip
             </button>
          </div>

          {/* Hint Display */}
          {hintLevels[currentIdx] > 0 && (
            <div className="p-5 bg-synapse-blue-primary/10 rounded-2xl border border-synapse-blue-primary/20 animate-in slide-in-from-top duration-300">
               <p className="text-[9px] font-black text-synapse-blue-primary uppercase tracking-widest mb-1">AI Diagnostic Insight</p>
               <p className="text-xs font-medium text-synapse-text-secondary leading-relaxed italic">
                 {hintLevels[currentIdx] === 1 
                   ? (questions[currentIdx].clinicalClue || "Look for clinical buzzwords in the presentation.") 
                   : (questions[currentIdx].conceptHint || "Consider the physiological mechanism underlying this case.")}
               </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Controls */}
      <div className="bg-white border-t border-white p-6 flex items-center justify-between gap-4 shadow-sm relative z-20 card-shadow">
        <button 
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          className={`flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
            currentIdx === 0 ? 'bg-slate-50 text-slate-200' : 'bg-slate-100 text-synapse-text-secondary'
          }`}
          disabled={currentIdx === 0}
        >
          Previous
        </button>
        
        <button 
          onClick={() => setIsPaletteOpen(true)}
          className="w-14 h-14 bg-white border border-white rounded-2xl flex items-center justify-center text-synapse-text-secondary active:scale-90 shadow-sm card-shadow"
        >
          <i className="fa-solid fa-grid-2"></i>
        </button>

        <button 
          onClick={() => currentIdx < questions.length - 1 ? setCurrentIdx(prev => prev + 1) : handleSubmit()}
          className="flex-1 h-14 bg-synapse-blue-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
        >
          {currentIdx < questions.length - 1 ? 'Next' : 'Finish'}
        </button>
      </div>

      {/* 4. Question Palette */}
      {isPaletteOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setIsPaletteOpen(false)}></div>
          <div className="bg-white rounded-t-[40px] w-full max-w-[430px] mx-auto p-8 pt-4 relative z-10 shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
            <h3 className="text-xl font-black text-synapse-text-primary tracking-tight mb-6 px-1">Test Grid</h3>
            <div className="grid grid-cols-5 gap-3 max-h-[40vh] overflow-y-auto pb-6">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentIdx(i); setIsPaletteOpen(false); }}
                  className={`w-full aspect-square rounded-2xl font-black text-xs flex items-center justify-center border-2 transition-all ${
                    currentIdx === i 
                      ? 'border-synapse-blue-primary bg-synapse-blue-primary/10 text-synapse-blue-primary' 
                      : answers[i] !== null 
                        ? 'bg-synapse-blue-primary border-synapse-blue-primary text-white shadow-md' 
                        : skipped[i]
                          ? 'bg-slate-100 border-slate-200 text-slate-400'
                          : 'bg-white border-slate-100 text-slate-400'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={handleSubmit}
              className="w-full h-16 bg-synapse-blue-primary text-white rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-synapse-blue-primary/20 mt-4"
            >
              Submit Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomExamSimulator;
