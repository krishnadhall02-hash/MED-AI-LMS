
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MCQ, AdaptiveMode, AdaptiveState } from '../types';
import { updateAdaptiveState, INITIAL_ADAPTIVE_STATE, getModeInfo } from '../services/adaptiveEngine';
import { DailyStep, DailyRoutineState, INITIAL_DAILY_STATE, getWeakestTopicFromResults } from '../services/dailyRoutineEngine';

// Mock Data Generators
const generateMockQuestions = (count: number, topicPrefix: string, isImage: boolean = false): MCQ[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `q-${topicPrefix}-${i}`,
    question: `${isImage ? '[IMAGE] ' : ''}Clinical scenario related to ${topicPrefix} - Case ${i + 1}: A patient presents with classic symptoms of...`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: Math.floor(Math.random() * 4),
    explanation: "High-yield explanation focusing on the core mechanism and clinical pearls.",
    difficulty: i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard',
    subject: topicPrefix,
    subtopic: `${topicPrefix} Subtopic ${i}`,
    difficultyLevel: (i % 5) + 1,
    clinicalWeight: 8,
    estimatedTime: 45
  }));
};

const DailyQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [routineState, setRoutineState] = useState<DailyRoutineState>(INITIAL_DAILY_STATE);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load Questions for current step
  const questions = useMemo(() => {
    switch (routineState.currentStep) {
      case DailyStep.ADAPTIVE_MCQS: return generateMockQuestions(20, "General Medicine");
      case DailyStep.WEAK_BOOSTER: 
        const weakTopic = getWeakestTopicFromResults(routineState.step1Results);
        return generateMockQuestions(5, weakTopic);
      case DailyStep.IMAGE_BASED: return generateMockQuestions(5, "Radiology", true);
      case DailyStep.MINI_MOCK: return generateMockQuestions(10, "Mixed Subjects");
      default: return [];
    }
  }, [routineState.currentStep]);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) navigate('/', { replace: true });
  }, [navigate]);

  // Timer for Mini Mock
  useEffect(() => {
    if (routineState.currentStep !== DailyStep.MINI_MOCK || timeLeft <= 0 || showFeedback) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [routineState.currentStep, timeLeft, showFeedback]);

  const handleAnswer = (optionIdx: number) => {
    if (selectedOption !== null || isTransitioning) return;
    setSelectedOption(optionIdx);
    
    const currentQ = questions[currentQuestionIdx];
    const isCorrect = optionIdx === currentQ.correctAnswer;
    
    // Update Adaptive State if in Step 1
    if (routineState.currentStep === DailyStep.ADAPTIVE_MCQS) {
      const newAdaptive = updateAdaptiveState(routineState.adaptiveState, isCorrect, 30, currentQ.subject || 'General Medicine'); // Mock 30s
      setRoutineState(prev => ({ ...prev, adaptiveState: newAdaptive }));
    }

    setShowFeedback(true);
  };

  const nextQuestion = () => {
    const currentQ = questions[currentQuestionIdx];
    const isCorrect = selectedOption === currentQ.correctAnswer;
    
    // Record Result
    const result = { questionId: currentQ.id, correct: isCorrect, timeTaken: 30, topic: currentQ.subject || '' };
    
    let newState = { ...routineState };
    if (routineState.currentStep === DailyStep.ADAPTIVE_MCQS) newState.step1Results.push(result);
    else if (routineState.currentStep === DailyStep.WEAK_BOOSTER) newState.step2Results.push({ questionId: currentQ.id, correct: isCorrect });
    else if (routineState.currentStep === DailyStep.IMAGE_BASED) newState.step3Results.push({ questionId: currentQ.id, correct: isCorrect });
    else if (routineState.currentStep === DailyStep.MINI_MOCK) newState.step4Results.push({ questionId: currentQ.id, correct: isCorrect, timeTaken: 30 });

    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setRoutineState(newState);
    } else {
      // Step Completed
      handleStepCompletion(newState);
    }
  };

  const handleStepCompletion = (state: DailyRoutineState) => {
    setIsTransitioning(true);
    setTimeout(() => {
      let nextStep = DailyStep.SUMMARY;
      if (state.currentStep === DailyStep.ADAPTIVE_MCQS) nextStep = DailyStep.WEAK_BOOSTER;
      else if (state.currentStep === DailyStep.WEAK_BOOSTER) nextStep = DailyStep.IMAGE_BASED;
      else if (state.currentStep === DailyStep.IMAGE_BASED) nextStep = DailyStep.MINI_MOCK;
      
      setRoutineState(prev => ({
        ...prev,
        currentStep: nextStep,
        completedSteps: [...prev.completedSteps, prev.currentStep],
        step1Results: state.step1Results,
        step2Results: state.step2Results,
        step3Results: state.step3Results,
        step4Results: state.step4Results
      }));
      setCurrentQuestionIdx(0);
      setSelectedOption(null);
      setShowFeedback(false);
      setIsTransitioning(false);
      if (nextStep === DailyStep.MINI_MOCK) setTimeLeft(600); // 10 mins for mock
    }, 1000);
  };

  if (routineState.currentStep === DailyStep.SUMMARY) {
    const totalCorrect = routineState.step1Results.filter(r => r.correct).length + 
                       routineState.step2Results.filter(r => r.correct).length + 
                       routineState.step3Results.filter(r => r.correct).length + 
                       routineState.step4Results.filter(r => r.correct).length;
    const totalQs = 20 + 5 + 5 + 10;
    const accuracy = Math.round((totalCorrect / totalQs) * 100);

    return (
      <div className="min-h-screen bg-synapse-blue-light flex flex-col items-center justify-center p-8 text-center space-y-8">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-32 h-32 bg-synapse-blue-primary rounded-full flex items-center justify-center text-white text-5xl shadow-xl"
        >
          <i className="fa-solid fa-check-double"></i>
        </motion.div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-synapse-text-primary tracking-tighter uppercase">Routine Complete</h1>
          <p className="text-synapse-blue-primary font-black text-xs uppercase tracking-[0.3em]">Neural Pathways Synchronized</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <div className="bg-white p-6 rounded-2xl space-y-1 shadow-sm border border-synapse-blue-soft">
            <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">Accuracy</p>
            <p className="text-3xl font-black text-synapse-text-primary">{accuracy}%</p>
          </div>
          <div className="bg-white p-6 rounded-2xl space-y-1 shadow-sm border border-synapse-blue-soft">
            <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">Skill Index</p>
            <p className="text-3xl font-black text-synapse-blue-primary">{Math.round(routineState.adaptiveState.skillIndex)}</p>
          </div>
        </div>

        <button 
          onClick={() => {
            localStorage.setItem('daily_quiz_attempted', 'true');
            navigate('/');
          }}
          className="w-full max-w-sm h-16 bg-synapse-blue-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIdx];
  const stepInfo = {
    [DailyStep.ADAPTIVE_MCQS]: { title: "Adaptive MCQs", icon: "fa-microchip", color: "text-synapse-blue-primary" },
    [DailyStep.WEAK_BOOSTER]: { title: "Weakness Booster", icon: "fa-bolt", color: "text-synapse-warning" },
    [DailyStep.IMAGE_BASED]: { title: "Image Challenge", icon: "fa-image", color: "text-indigo-500" },
    [DailyStep.MINI_MOCK]: { title: "Mini Mock Test", icon: "fa-stopwatch", color: "text-synapse-error" },
  }[routineState.currentStep];

  return (
    <div className="min-h-screen bg-synapse-blue-light pb-32">
      {/* Header */}
      <div className="pt-12 px-8 pb-10 rounded-b-[40px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-synapse-blue-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="flex justify-between items-center relative z-10">
          <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center text-synapse-text-secondary active:scale-90">
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div className="flex items-center gap-3">
            <div className={`px-4 py-1.5 rounded-full border border-synapse-blue-soft bg-white text-[9px] font-black uppercase tracking-widest shadow-sm ${stepInfo?.color}`}>
              {stepInfo?.title}
            </div>
            {routineState.currentStep === DailyStep.MINI_MOCK && (
              <div className="text-synapse-text-primary font-mono font-black text-sm">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4 relative z-10">
          <div className={`w-12 h-12 rounded-2xl bg-white border border-synapse-blue-soft flex items-center justify-center text-xl shadow-sm ${stepInfo?.color}`}>
            <i className={`fa-solid ${stepInfo?.icon}`}></i>
          </div>
          <div>
            <h1 className="text-xl font-black text-synapse-text-primary tracking-tight uppercase">Step {routineState.completedSteps.length + 1} of 4</h1>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`h-1 w-6 rounded-full ${s <= routineState.completedSteps.length + 1 ? 'bg-synapse-blue-primary' : 'bg-synapse-blue-soft'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar for current step */}
      <div className="px-8 -mt-4 relative z-20">
        <div className="bg-white rounded-full h-1.5 w-full overflow-hidden shadow-sm border border-synapse-blue-soft">
          <div 
            className="bg-synapse-blue-primary h-full transition-all duration-500" 
            style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Area */}
      <div className="px-5 mt-8 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${routineState.currentStep}-${currentQuestionIdx}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-samsung p-8 border border-white shadow-lg space-y-8 card-shadow"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">Question {currentQuestionIdx + 1} of {questions.length}</span>
                {currentQ.difficulty && (
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                    currentQ.difficulty === 'hard' ? 'text-red-500 border-red-100 bg-red-50' : 
                    currentQ.difficulty === 'medium' ? 'text-amber-500 border-amber-100 bg-amber-50' : 
                    'text-emerald-500 border-emerald-100 bg-emerald-50'
                  }`}>
                    {currentQ.difficulty}
                  </span>
                )}
              </div>

              {/* Image Placeholder for Image-Based Step */}
              {routineState.currentStep === DailyStep.IMAGE_BASED && (
                <div className="relative group">
                  <div className="w-full aspect-video bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/${currentQuestionIdx}/800/450`} 
                      alt="Clinical Case"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-white/90 backdrop-blur p-3 rounded-full text-synapse-text-primary shadow-xl">
                        <i className="fa-solid fa-magnifying-glass-plus"></i>
                      </button>
                    </div>
                  </div>
                  <p className="text-[9px] font-bold text-synapse-text-secondary mt-2 text-center uppercase tracking-widest">Tap to zoom clinical image</p>
                </div>
              )}

              <h2 className="text-xl font-bold text-synapse-text-primary leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            <div className="space-y-3">
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedOption === i;
                const isCorrect = i === currentQ.correctAnswer;
                const showResult = showFeedback && routineState.currentStep !== DailyStep.MINI_MOCK;

                let style = "border-slate-50 bg-slate-50/50 text-synapse-text-secondary";
                if (showResult) {
                  if (isCorrect) style = "border-synapse-success bg-emerald-50 text-emerald-900";
                  else if (isSelected) style = "border-synapse-error bg-red-50 text-red-900";
                } else if (isSelected) {
                  style = "border-synapse-blue-primary bg-synapse-blue-primary text-white";
                }

                return (
                  <button
                    key={i}
                    disabled={showFeedback && routineState.currentStep !== DailyStep.MINI_MOCK}
                    onClick={() => handleAnswer(i)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${style}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${
                      isSelected ? 'bg-white text-synapse-blue-primary shadow-sm' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="font-semibold flex-1 leading-tight">{opt}</span>
                    {showResult && isCorrect && <i className="fa-solid fa-circle-check text-synapse-success"></i>}
                    {showResult && isSelected && !isCorrect && <i className="fa-solid fa-circle-xmark text-synapse-error"></i>}
                  </button>
                );
              })}
            </div>

            {showFeedback && routineState.currentStep !== DailyStep.MINI_MOCK && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="pt-6 border-t border-slate-50 space-y-4"
              >
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest mb-2">Clinical Explanation</p>
                  <p className="text-xs text-synapse-text-secondary leading-relaxed font-medium italic">
                    {currentQ.explanation}
                  </p>
                </div>

                {routineState.currentStep === DailyStep.WEAK_BOOSTER && (
                  <div className="p-5 bg-synapse-blue-primary/5 rounded-2xl border border-synapse-blue-primary/10 space-y-3">
                    <div className="flex items-center gap-2 text-synapse-blue-primary">
                      <i className="fa-solid fa-diagram-project text-xs"></i>
                      <span className="text-[9px] font-black uppercase tracking-widest">Concept Flowchart</span>
                    </div>
                    <div className="h-24 bg-white rounded-xl border border-dashed border-synapse-blue-primary/30 flex items-center justify-center">
                      <p className="text-[10px] text-synapse-blue-primary font-bold italic">Visualizing {currentQ.subject} mechanism...</p>
                    </div>
                  </div>
                )}
                <button 
                  onClick={nextQuestion}
                  className="w-full h-14 bg-synapse-blue-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                >
                  Continue Routine
                </button>
              </motion.div>
            )}

            {routineState.currentStep === DailyStep.MINI_MOCK && selectedOption !== null && (
              <button 
                onClick={nextQuestion}
                className="w-full h-14 bg-synapse-blue-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Next Question
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Adaptive Indicator */}
      {routineState.currentStep === DailyStep.ADAPTIVE_MCQS && (
        <div className="fixed bottom-10 left-0 right-0 flex justify-center px-8 z-30">
          <div className="bg-white/90 backdrop-blur-md border border-synapse-blue-soft px-6 py-3 rounded-full flex items-center gap-4 shadow-xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-synapse-blue-primary rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-synapse-text-primary uppercase tracking-widest">AI Engine Active</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-100" />
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-synapse-text-secondary uppercase tracking-widest">Level</span>
              <span className="text-xs font-black text-synapse-blue-primary">{routineState.adaptiveState.currentDifficulty.toFixed(1)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyQuiz;
