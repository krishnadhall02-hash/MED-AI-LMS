
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ImagePracticeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Mock data for image-based questions
  const MOCK_IMAGE_QUESTIONS = [
    {
      id: '1',
      image: 'https://picsum.photos/seed/radiology/800/600',
      question: 'Identify the pathology shown in this X-ray image.',
      options: ['Pneumonia', 'Pneumothorax', 'Pleural Effusion', 'Tuberculosis'],
      correctAnswer: 1,
      explanation: 'The X-ray shows a collapsed lung with air in the pleural space, characteristic of a pneumothorax.',
      subject: 'Radiology'
    },
    {
      id: '2',
      image: 'https://picsum.photos/seed/pathology/800/600',
      question: 'What is the most likely diagnosis based on this histology slide?',
      options: ['Adenocarcinoma', 'Squamous Cell Carcinoma', 'Small Cell Carcinoma', 'Large Cell Carcinoma'],
      correctAnswer: 0,
      explanation: 'The slide shows gland formation and mucin production, which are hallmarks of adenocarcinoma.',
      subject: 'Pathology'
    }
  ];

  const currentQ = MOCK_IMAGE_QUESTIONS[currentIdx];

  const handleNext = () => {
    if (currentIdx < MOCK_IMAGE_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setShowExplanation(false);
    } else {
      navigate('/practice');
    }
  };

  return (
    <div className="flex flex-col h-full bg-synapse-blue-light min-h-screen">
      <div className="pt-4 pb-2">
        <div className="flex justify-between items-center px-8 mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-synapse-text-secondary border border-synapse-blue-soft active:scale-90 shadow-sm">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <h1 className="text-2xl font-black text-synapse-text-primary leading-tight">Image-Based<br/><span className="font-light text-synapse-text-secondary tracking-tight">Practice</span></h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-40 space-y-6 no-scrollbar">
        <div className="flex items-center justify-between text-[11px] font-black text-synapse-text-secondary px-2 tracking-widest">
          <span>QUESTION {currentIdx + 1} OF {MOCK_IMAGE_QUESTIONS.length}</span>
          <span className="uppercase px-3 py-1 rounded-full border bg-synapse-blue-primary/10 text-synapse-blue-primary border-synapse-blue-primary/20">
            {currentQ.subject}
          </span>
        </div>

        <div className="bg-white p-6 rounded-samsung shadow-xl border border-white space-y-6 card-shadow">
          {/* Zoomable Image Placeholder */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-100 group">
            <img 
              src={currentQ.image} 
              alt="Clinical Case" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <i className="fa-solid fa-magnifying-glass-plus"></i>
              Tap to Zoom
            </div>
          </div>

          <h2 className="text-xl font-black text-synapse-text-primary leading-snug tracking-tight">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedOpt === i;
              const isCorrect = i === currentQ.correctAnswer;
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
                  className={`w-full text-left p-4 min-h-[64px] rounded-2xl border-2 transition-all flex items-center gap-4 active:scale-[0.98] ${buttonStyle}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                    isSelected ? 'bg-white text-synapse-blue-primary shadow-sm' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="font-bold text-sm leading-tight flex-1">{opt}</span>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="pt-6 border-t border-slate-100 space-y-4 animate-in fade-in">
              <div className="bg-slate-50 p-5 rounded-2xl space-y-3 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${selectedOpt === currentQ.correctAnswer ? 'bg-emerald-500' : 'bg-red-500'}`}>
                    <i className={`fa-solid ${selectedOpt === currentQ.correctAnswer ? 'fa-check' : 'fa-xmark'}`}></i>
                  </div>
                  <h4 className="font-black text-synapse-text-primary text-[9px] uppercase tracking-widest">
                    {selectedOpt === currentQ.correctAnswer ? 'CORRECT CHOICE' : 'REASONING'}
                  </h4>
                </div>
                <p className="text-synapse-text-secondary text-xs leading-relaxed font-medium">
                  {currentQ.explanation}
                </p>
              </div>
              <button 
                onClick={handleNext}
                className="w-full h-14 bg-synapse-blue-primary text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                {currentIdx < MOCK_IMAGE_QUESTIONS.length - 1 ? 'Next Image' : 'Finish Session'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePracticeScreen;
