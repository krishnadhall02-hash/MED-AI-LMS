
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RemediationContent, MCQ, ClinicalCase } from '../types';
import { generateRemediation } from '../services/gemini';
import Markdown from 'react-markdown';

const WeaknessRepair: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [remediation, setRemediation] = useState<RemediationContent | null>(null);
  const [activeTab, setActiveTab] = useState<'revision' | 'mcqs' | 'cases'>('revision');
  const [currentMcqIdx, setCurrentMcqIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Mock topic that was detected as weak
  const weakTopic = "RAAS Regulation & Acid-Base Disorders";

  useEffect(() => {
    const fetchRemediation = async () => {
      setLoading(true);
      const data = await generateRemediation(weakTopic);
      setRemediation(data);
      setLoading(false);
    };
    fetchRemediation();
  }, []);

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowExplanation(true);
  };

  const nextMcq = () => {
    if (!remediation) return;
    if (currentMcqIdx < remediation.mcqs.length - 1) {
      setCurrentMcqIdx(currentMcqIdx + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-synapse-blue-light flex flex-col items-center justify-center p-10 space-y-8">
        <div className="w-24 h-24 border-4 border-synapse-blue-primary/20 border-t-synapse-blue-primary rounded-full animate-spin shadow-sm"></div>
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-black text-synapse-text-primary tracking-tight uppercase">Initializing Neural Repair</h2>
          <p className="text-synapse-text-secondary text-sm font-medium animate-pulse">AI is mapping your misconceptions and generating targeted clinical cases...</p>
        </div>
      </div>
    );
  }

  if (!remediation) {
    return (
      <div className="h-screen bg-synapse-blue-light flex flex-col items-center justify-center p-10 text-center">
        <i className="fa-solid fa-triangle-exclamation text-red-500 text-5xl mb-6"></i>
        <h2 className="text-xl font-black text-synapse-text-primary mb-2">Sync Error</h2>
        <p className="text-synapse-text-secondary text-sm mb-8">Could not generate remediation content. Please try again.</p>
        <button onClick={() => navigate(-1)} className="bg-synapse-blue-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-synapse-blue-light pb-20">
      {/* Header */}
      <div className="bg-synapse-blue-primary pt-12 px-8 pb-10 rounded-b-[40px] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <button onClick={() => navigate(-1)} className="absolute top-8 left-6 w-10 h-10 flex items-center justify-center text-white/80 active:scale-90">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div className="mt-4 space-y-1">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Neural Repair</h1>
          <p className="text-white/80 text-xs font-black uppercase tracking-widest">{weakTopic}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 mt-6">
        <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-white card-shadow">
          {(['revision', 'mcqs', 'cases'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-synapse-blue-primary text-white shadow-md' : 'text-synapse-text-secondary'
              }`}
            >
              {tab === 'revision' ? 'Revision' : tab === 'mcqs' ? 'Targeted MCQs' : 'Clinical Cases'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-8">
        {activeTab === 'revision' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
            <div className="bg-white rounded-samsung p-8 border border-white shadow-lg space-y-6 card-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-synapse-blue-primary/10 rounded-xl flex items-center justify-center text-synapse-blue-primary">
                  <i className="fa-solid fa-file-lines"></i>
                </div>
                <h3 className="text-lg font-black text-synapse-text-primary">{remediation.revisionSheet.title}</h3>
              </div>
              
              <div className="prose prose-sm max-w-none text-synapse-text-secondary leading-relaxed">
                <Markdown>{remediation.revisionSheet.summary}</Markdown>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <h4 className="text-[10px] font-black text-synapse-blue-primary uppercase tracking-widest">High-Yield Mnemonics</h4>
                <div className="space-y-2">
                  {remediation.revisionSheet.mnemonics.map((m, i) => (
                    <div key={i} className="bg-synapse-blue-primary/5 p-4 rounded-xl border border-synapse-blue-primary/10 text-xs font-bold text-synapse-text-primary italic">
                      "{m}"
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest">Common Traps</h4>
                <div className="space-y-2">
                  {remediation.revisionSheet.commonTraps.map((t, i) => (
                    <div key={i} className="flex items-start gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
                      <i className="fa-solid fa-triangle-exclamation text-red-400 mt-0.5"></i>
                      <p className="text-xs font-medium text-red-900">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mcqs' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">Question {currentMcqIdx + 1} of {remediation.mcqs.length}</span>
              <span className="px-3 py-1 bg-synapse-blue-primary/10 rounded-full text-[8px] font-black text-synapse-blue-primary uppercase tracking-widest">Targeted</span>
            </div>

            <div className="bg-white rounded-samsung p-8 border border-white shadow-lg space-y-8 card-shadow">
              <h3 className="text-xl font-bold text-synapse-text-primary leading-relaxed">
                {remediation.mcqs[currentMcqIdx].question}
              </h3>

              <div className="space-y-3">
                {remediation.mcqs[currentMcqIdx].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(i)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                      selectedOption === i 
                        ? (i === remediation.mcqs[currentMcqIdx].correctAnswer ? 'border-synapse-success bg-emerald-50 text-emerald-900' : 'border-synapse-error bg-red-50 text-red-900')
                        : (selectedOption !== null && i === remediation.mcqs[currentMcqIdx].correctAnswer ? 'border-synapse-success bg-emerald-50' : 'border-slate-50 bg-white text-synapse-text-secondary shadow-sm')
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${
                       selectedOption === i 
                        ? (i === remediation.mcqs[currentMcqIdx].correctAnswer ? 'bg-synapse-success text-white' : 'bg-synapse-error text-white')
                        : (selectedOption !== null && i === remediation.mcqs[currentMcqIdx].correctAnswer ? 'bg-synapse-success text-white' : 'bg-slate-50 text-slate-400')
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="font-semibold flex-1 leading-tight">{opt}</span>
                  </button>
                ))}
              </div>

              {showExplanation && (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 animate-in zoom-in duration-300">
                  <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest mb-2">AI Explanation</p>
                  <p className="text-sm text-synapse-text-secondary leading-relaxed italic">
                    {remediation.mcqs[currentMcqIdx].explanation}
                  </p>
                  <button 
                    onClick={nextMcq}
                    className="w-full h-12 mt-6 bg-synapse-blue-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg"
                  >
                    {currentMcqIdx < remediation.mcqs.length - 1 ? 'Next Question' : 'Section Complete'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
            {remediation.clinicalCases.map((c, idx) => (
              <div key={idx} className="bg-white rounded-samsung p-8 border border-white shadow-lg space-y-6 card-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
                    <i className="fa-solid fa-user-doctor"></i>
                  </div>
                  <h3 className="text-lg font-black text-synapse-text-primary">Clinical Case {idx + 1}</h3>
                </div>
                
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm text-synapse-text-secondary leading-relaxed shadow-inner">
                  {c.scenario}
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-synapse-blue-primary uppercase tracking-widest">Diagnostic Approach</h4>
                  <p className="text-xs font-medium text-synapse-text-secondary leading-relaxed">
                    {c.diagnosticApproach}
                  </p>
                </div>

                <button className="w-full h-14 bg-synapse-blue-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                  Solve Stepwise Reasoning
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeaknessRepair;
