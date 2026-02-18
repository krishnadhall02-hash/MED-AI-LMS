
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MCQ, ExamResult } from '../types';

const MOCK_EXAM_QUESTIONS: MCQ[] = [
  {
    id: 'e1',
    question: 'A 45-year-old male presents with sudden onset of severe headache ("worst headache of life"). CT shows blood in the basal cisterns. What is the most likely diagnosis?',
    options: ['Epidural Hematoma', 'Subdural Hematoma', 'Subarachnoid Hemorrhage', 'Intracerebral Hemorrhage'],
    correctAnswer: 2,
    explanation: 'Thunderclap headache is classic for SAH, often due to a ruptured berry aneurysm.',
    difficulty: 'medium',
    subject: 'Medicine',
    clinicalClue: 'Look for "basal cisterns" finding.'
  },
  {
    id: 'e2',
    question: 'The ligamentum teres is a remnant of which fetal structure?',
    options: ['Ductus venosus', 'Left umbilical vein', 'Right umbilical vein', 'Urachus'],
    correctAnswer: 1,
    explanation: 'The left umbilical vein becomes the ligamentum teres after birth.',
    difficulty: 'easy',
    subject: 'Anatomy',
    clinicalClue: 'Venous remnant in the liver.'
  },
  {
    id: 'e3',
    question: 'Which of the following is the most sensitive imaging modality for detecting early acute ischemic stroke?',
    options: ['Non-contrast CT Brain', 'CT Ang Angiography', 'Diffusion-weighted MRI', 'T2-weighted MRI'],
    correctAnswer: 2,
    explanation: 'DWI MRI can detect ischemic changes within minutes of onset.',
    difficulty: 'medium',
    subject: 'Radiology'
  }
];

const ExamSimulator: React.FC = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(MOCK_EXAM_QUESTIONS.length).fill(null));
  const [flags, setFlags] = useState<boolean[]>(new Array(MOCK_EXAM_QUESTIONS.length).fill(false));
  const [skipped, setSkipped] = useState<boolean[]>(new Array(MOCK_EXAM_QUESTIONS.length).fill(false));
  const [hintLevels, setHintLevels] = useState<number[]>(new Array(MOCK_EXAM_QUESTIONS.length).fill(0));
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optIdx;
    setAnswers(newAnswers);
    
    // Clear skip status if an answer is selected
    const newSkips = [...skipped];
    newSkips[currentIdx] = false;
    setSkipped(newSkips);
  };

  const toggleFlag = () => {
    const newFlags = [...flags];
    newFlags[currentIdx] = !newFlags[currentIdx];
    setFlags(newFlags);
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
    
    // Auto-advance if not at the end
    if (currentIdx < MOCK_EXAM_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsPaletteOpen(true); // Open palette to review skipped at the end
    }
  };

  const handleSubmit = useCallback(() => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    const subjectBreakdown: { [key: string]: { correct: number, total: number } } = {};

    answers.forEach((ans, i) => {
      const q = MOCK_EXAM_QUESTIONS[i];
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
      totalQuestions: MOCK_EXAM_QUESTIONS.length,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      unanswered,
      timeSpent: 600 - timeLeft,
      score: (correct * 4) - (incorrect * 1),
      accuracy: (correct / (correct + incorrect)) * 100 || 0,
      subjectBreakdown
    };

    sessionStorage.setItem('last_exam_result', JSON.stringify(result));
    sessionStorage.setItem('last_exam_questions', JSON.stringify(MOCK_EXAM_QUESTIONS));
    sessionStorage.setItem('last_exam_answers', JSON.stringify(answers));
    navigate('/exam-results');
  }, [answers, timeLeft, navigate]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`flex flex-col h-screen bg-white transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-[100]' : ''}`}>
      {/* 1. Header with Timer */}
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg relative z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
          <div className="h-8 w-[1px] bg-white/10 mx-1"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-oneui-blue">Mock Exam 01</span>
        </div>

        <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10 ${timeLeft < 60 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/5'}`}>
          <i className="fa-regular fa-clock"></i>
          <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
        </div>

        <button 
          onClick={handleSubmit}
          className="bg-oneui-blue text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
        >
          Submit
        </button>
      </div>

      {/* 2. Question Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 tracking-[0.15em] uppercase">
          <span>Question {currentIdx + 1} of {MOCK_EXAM_QUESTIONS.length}</span>
          <div className="flex gap-4">
             <button 
               onClick={toggleFlag}
               className={`flex items-center gap-2 transition-all ${flags[currentIdx] ? 'text-amber-500' : 'text-slate-300'}`}
             >
               <i className={`fa-${flags[currentIdx] ? 'solid' : 'regular'} fa-flag`}></i>
               <span>{flags[currentIdx] ? 'Flagged' : 'Flag'}</span>
             </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 space-y-8 min-h-[300px]">
          <h2 className="text-xl font-bold text-slate-900 leading-relaxed">
            {MOCK_EXAM_QUESTIONS[currentIdx].question}
          </h2>

          <div className="space-y-3">
            {MOCK_EXAM_QUESTIONS[currentIdx].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectOption(i)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                  answers[currentIdx] === i 
                    ? 'border-oneui-blue bg-blue-50/50 text-slate-900 shadow-sm' 
                    : 'border-slate-50 bg-white text-slate-600 hover:border-slate-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${
                   answers[currentIdx] === i ? 'bg-oneui-blue text-white' : 'bg-slate-50 text-slate-400'
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
                 hintLevels[currentIdx] > 0 ? 'bg-amber-50 border-amber-500 text-amber-500' : 'bg-slate-50 border-slate-100 text-slate-400'
               }`}
             >
               <i className="fa-solid fa-lightbulb"></i>
               <span className="text-[10px] font-black uppercase tracking-widest">
                  {hintLevels[currentIdx] === 0 ? 'Show Hint' : `Hint ${hintLevels[currentIdx]} Active`}
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
            <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100 animate-in slide-in-from-top duration-300">
               <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">High-Yield Clue</p>
               <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                 {hintLevels[currentIdx] === 1 
                   ? (MOCK_EXAM_QUESTIONS[currentIdx].clinicalClue || "Relate the symptoms to the most common vascular or structural anatomic cause.") 
                   : "Think about the progressive changes or remnants associated with fetal development."}
               </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Controls */}
      <div className="bg-white border-t border-slate-100 p-6 flex items-center justify-between gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] relative z-20">
        <button 
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          className={`flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
            currentIdx === 0 ? 'bg-slate-50 text-slate-200' : 'bg-slate-100 text-slate-700 active:scale-95'
          }`}
          disabled={currentIdx === 0}
        >
          Previous
        </button>
        
        <button 
          onClick={() => setIsPaletteOpen(true)}
          className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 active:scale-90 transition-all shadow-sm"
        >
          <i className="fa-solid fa-grid-2"></i>
        </button>

        <button 
          onClick={() => currentIdx < MOCK_EXAM_QUESTIONS.length - 1 ? setCurrentIdx(prev => prev + 1) : handleSubmit()}
          className="flex-1 h-14 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95 transition-all"
        >
          {currentIdx < MOCK_EXAM_QUESTIONS.length - 1 ? 'Next' : 'Review & Submit'}
        </button>
      </div>

      {/* 4. Question Palette Bottom Sheet */}
      {isPaletteOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setIsPaletteOpen(false)}></div>
          <div className="bg-white rounded-t-[40px] w-full max-w-[430px] mx-auto p-8 pt-4 relative z-10 shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Question Palette</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-oneui-blue"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Skipped</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3 max-h-[40vh] overflow-y-auto pb-10">
              {MOCK_EXAM_QUESTIONS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentIdx(i);
                    setIsPaletteOpen(false);
                  }}
                  className={`relative w-full aspect-square rounded-2xl font-black text-sm flex items-center justify-center border-2 transition-all ${
                    currentIdx === i 
                      ? 'border-oneui-blue bg-blue-50 text-oneui-blue' 
                      : answers[i] !== null 
                        ? 'bg-oneui-blue border-oneui-blue text-white shadow-md' 
                        : skipped[i]
                          ? 'bg-slate-100 border-slate-200 text-slate-400'
                          : 'bg-white border-slate-100 text-slate-400'
                  }`}
                >
                  {i + 1}
                  {flags[i] && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
                      <i className="fa-solid fa-flag text-[6px] text-white"></i>
                    </div>
                  )}
                  {skipped[i] && answers[i] === null && !flags[i] && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-300 rounded-full border-2 border-white flex items-center justify-center">
                      <i className="fa-solid fa-slash text-[6px] text-white"></i>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button 
              onClick={handleSubmit}
              className="w-full h-16 bg-oneui-blue text-white rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-blue-100 mt-6"
            >
              Submit Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamSimulator;
