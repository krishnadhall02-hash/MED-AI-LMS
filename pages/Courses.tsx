
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Subject, Topic, Subtopic, LearningContent, PricingType, SyllabusTag } from '../types';
import { analyzeSyllabusContext } from '../services/gemini';

const MOCK_DATA: Subject[] = [
  {
    id: 's1',
    title: 'Anatomy',
    description: 'Foundation of medicine with 3D visualizations.',
    thumbnail: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800',
    pricing: 'PAID',
    progress: 45,
    topics: [
      {
        id: 't1',
        title: 'Neuroanatomy',
        description: 'Brain, spinal cord and nervous system.',
        syllabusTags: [{ syllabusName: 'NEET PG', code: 'AN1.1', weightage: 'High' }],
        subtopics: [
          {
            id: 'st1',
            title: 'Cranial Nerves',
            syllabusTags: [{ syllabusName: 'NEET PG', code: 'AN1.1.1', weightage: 'High' }],
            contents: [
              { 
                id: 'c1', title: 'Functional Anatomy of CN I-VI', type: 'video', duration: '12:45', isCompleted: true,
                syllabusTags: [{ syllabusName: 'NEET PG', code: 'AN1.1', weightage: 'High' }]
              },
              { id: 'c2', title: 'CN VII-XII Pathways', type: 'video', duration: '15:20', isCompleted: false },
              { id: 'c3', title: 'Summary Notes: Cranial Nerves', type: 'note', isCompleted: false },
              { id: 'c4', title: 'Quick Quiz: Neuro', type: 'quiz', isCompleted: false },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 's2',
    title: 'Foundations of Biochemistry',
    description: 'Essential molecular biology for pre-clinicals.',
    thumbnail: 'https://images.unsplash.com/photo-1532187875605-1ef6c237a1e0?auto=format&fit=crop&q=80&w=800',
    pricing: 'FREE',
    progress: 10,
    topics: [
      {
        id: 't2',
        title: 'Enzymes & Metabolism',
        description: 'Kinetic models and metabolic regulation.',
        syllabusTags: [{ syllabusName: 'NEET PG', code: 'BC1.1', weightage: 'Medium' }],
        subtopics: [
          {
            id: 'st2',
            title: 'Enzyme Kinetics',
            contents: [
              { id: 'c5', title: 'Michaelis-Menten Model', type: 'video', duration: '08:30', isCompleted: true },
              { id: 'c6', title: 'Lineweaver-Burk Plot (PREMIUM)', type: 'video', duration: '11:15', isCompleted: false },
              { id: 'c7', title: 'Clinical MCQ Pack (PREMIUM)', type: 'quiz', isCompleted: false },
            ]
          }
        ]
      }
    ]
  }
];

const PricingBadge: React.FC<{ type: PricingType }> = ({ type }) => {
  const styles = {
    FREE: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    PAID: 'bg-indigo-50 text-oneui-blue border-indigo-100',
    TRIAL: 'bg-amber-50 text-amber-600 border-amber-100'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${styles[type]}`}>
      {type}
    </span>
  );
};

const SyllabusBadge: React.FC<{ tag: SyllabusTag }> = ({ tag }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-black tracking-tight border ${
    tag.weightage === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-500 border-slate-200'
  }`}>
    {tag.syllabusName}: {tag.code}
  </span>
);

const ContentIcon: React.FC<{ type: LearningContent['type'] }> = ({ type }) => {
  switch (type) {
    case 'video': return <i className="fa-solid fa-play text-oneui-blue"></i>;
    case 'note': return <i className="fa-solid fa-file-lines text-amber-500"></i>;
    case 'quiz': return <i className="fa-solid fa-bolt text-purple-500"></i>;
  }
};

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const goBack = () => {
    setAiInsight(null);
    if (selectedTopic) setSelectedTopic(null);
    else if (selectedSubject) setSelectedSubject(null);
  };

  const getInsight = async () => {
    if (!selectedTopic) return;
    if (selectedSubject?.pricing === 'FREE') {
      setShowUpgradeModal(true);
      return;
    }
    setLoadingInsight(true);
    try {
      const tags = (selectedTopic.syllabusTags || []).map(t => t.code);
      const res = await analyzeSyllabusContext(selectedTopic.title, tags);
      setAiInsight(res);
    } catch (e) {
      setAiInsight("Unable to fetch AI insight at this time.");
    } finally {
      setLoadingInsight(false);
    }
  };

  const handleContentClick = (content: LearningContent) => {
    if (content.title.includes('(PREMIUM)') && selectedSubject?.pricing === 'FREE') {
      setShowUpgradeModal(true);
      return;
    }
    if (content.type === 'video') {
      navigate(`/video/${content.id}`);
    }
  };

  // 1. SUBJECT LIST VIEW
  if (!selectedSubject) {
    return (
      <div className="pb-32 animate-in fade-in duration-500">
        <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
          <h1 className="text-4xl font-light text-slate-900 leading-tight">Subject<br/><span className="font-bold">Library</span></h1>
        </div>
        <div className="px-5 space-y-6">
          <div className="bg-white rounded-2xl h-14 px-4 flex items-center gap-3 border border-slate-200 shadow-sm mb-6">
            <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
            <input type="text" placeholder="Search subjects..." className="bg-transparent border-none flex-1 focus:outline-none font-medium" />
          </div>
          {MOCK_DATA.map((subject) => (
            <div 
              key={subject.id} 
              onClick={() => setSelectedSubject(subject)}
              className="bg-white rounded-samsung overflow-hidden shadow-sm border border-slate-100 flex flex-col active:scale-95 transition-all cursor-pointer group"
            >
              <div className="relative h-40">
                <img src={subject.thumbnail} alt={subject.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4">
                  <PricingBadge type={subject.pricing} />
                </div>
                {subject.pricing === 'FREE' && (
                  <div className="absolute bottom-4 right-4 bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-md shadow-lg">
                    FOUNDATIONAL
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-slate-900">{subject.title}</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">{subject.description}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Progress</span>
                    <span>{subject.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full">
                    <div className="h-full bg-oneui-blue rounded-full transition-all duration-700" style={{ width: `${subject.progress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. TOPIC LIST VIEW
  if (!selectedTopic) {
    return (
      <div className="pb-32 animate-in slide-in-from-right duration-300">
        <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 bg-slate-100/50">
          <button onClick={goBack} className="w-10 h-10 -ml-2 text-slate-500 mb-2">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold text-slate-900 leading-tight">{selectedSubject.title}</h1>
            {selectedSubject.pricing === 'FREE' && <PricingBadge type="FREE" />}
          </div>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Curriculum</p>
        </div>

        {selectedSubject.pricing === 'FREE' && (
          <div className="px-5 mt-4">
             <div className="bg-slate-900 p-6 rounded-[28px] text-white flex items-center justify-between shadow-xl">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Upgrade to Pro</p>
                   <h4 className="font-bold text-sm">Unlock 100% of curriculum</h4>
                </div>
                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-oneui-blue px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                >
                  View Plans
                </button>
             </div>
          </div>
        )}

        <div className="px-5 mt-6 space-y-4">
          {selectedSubject.topics.map((topic) => (
            <button 
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className="w-full bg-white p-6 rounded-samsung border border-slate-100 flex items-center justify-between shadow-sm active:bg-slate-50 transition-all text-left group"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {topic.syllabusTags?.map((tag, idx) => <SyllabusBadge key={idx} tag={tag} />)}
                </div>
                <h3 className="font-black text-slate-900 text-lg">{topic.title}</h3>
                <p className="text-xs text-slate-500 font-medium">{topic.subtopics.length} Subtopics</p>
              </div>
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-oneui-blue group-hover:text-white transition-all">
                <i className="fa-solid fa-chevron-right"></i>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 3. SUBTOPIC & CONTENT VIEW
  return (
    <div className="pb-32 animate-in slide-in-from-right duration-300">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 bg-indigo-50/50 relative">
        <button onClick={goBack} className="w-10 h-10 -ml-2 text-slate-500 mb-2">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 leading-tight">{selectedTopic.title}</h1>
            <p className="text-xs text-oneui-blue font-black uppercase tracking-widest mt-1">{selectedSubject.title}</p>
          </div>
          <button 
            onClick={getInsight}
            disabled={loadingInsight}
            className={`w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center hover:scale-110 transition-transform active:scale-90 ${selectedSubject.pricing === 'FREE' ? 'text-slate-300' : 'text-oneui-blue'}`}
          >
            {loadingInsight ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
          </button>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-8">
        {aiInsight && (
          <div className="bg-oneui-blue text-white p-6 rounded-samsung shadow-lg shadow-blue-200 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-brain"></i> AI Syllabus Insight
              </h4>
              <button onClick={() => setAiInsight(null)} className="opacity-50"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="text-sm font-medium leading-relaxed opacity-95 whitespace-pre-line">
              {aiInsight}
            </div>
          </div>
        )}

        {selectedTopic.subtopics.map((subtopic) => (
          <div key={subtopic.id} className="space-y-3">
            <div className="flex justify-between items-center px-2">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{subtopic.title}</h4>
            </div>
            <div className="space-y-2">
              {subtopic.contents.map((content) => {
                const isPremiumLocked = content.title.includes('(PREMIUM)') && selectedSubject.pricing === 'FREE';
                return (
                  <div 
                    key={content.id}
                    onClick={() => handleContentClick(content)}
                    className={`bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm active:scale-95 transition-all cursor-pointer relative overflow-hidden ${isPremiumLocked ? 'opacity-80' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                      <ContentIcon type={content.type} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-slate-800 text-sm ${isPremiumLocked ? 'blur-[1px]' : ''}`}>
                        {content.title}
                      </p>
                      {content.duration && <p className="text-[10px] text-slate-400 font-bold">{content.duration}</p>}
                    </div>
                    {isPremiumLocked ? (
                       <i className="fa-solid fa-lock text-slate-300"></i>
                    ) : content.isCompleted ? (
                      <i className="fa-solid fa-circle-check text-emerald-500"></i>
                    ) : (
                      <i className="fa-regular fa-circle text-slate-200"></i>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Upgrade CTA at the bottom for free courses */}
        {selectedSubject.pricing === 'FREE' && (
           <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[32px] text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center text-oneui-blue shadow-sm">
                 <i className="fa-solid fa-graduation-cap text-2xl"></i>
              </div>
              <h3 className="text-lg font-black text-slate-900 leading-tight px-4">You've reached the end of the foundational topics.</h3>
              <p className="text-[13px] text-slate-600 font-medium leading-relaxed px-4">
                 Upgrade to the Pro plan to unlock high-yield clinical correlations, full question banks, and mentor sessions.
              </p>
              <button 
                onClick={() => setShowUpgradeModal(true)}
                className="w-full h-14 bg-oneui-blue text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-100"
              >
                Unlock Pro Access
              </button>
           </div>
        )}
      </div>

      {/* Upgrade Modal (1.12B) */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="absolute inset-0" onClick={() => setShowUpgradeModal(false)} />
           <div className="bg-white rounded-t-[40px] w-full max-w-[430px] mx-auto p-8 shadow-2xl animate-in slide-in-from-bottom duration-500 relative z-10">
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
              <div className="text-center space-y-6">
                 <div className="w-20 h-20 bg-blue-50 text-oneui-blue rounded-full mx-auto flex items-center justify-center text-4xl shadow-inner">
                    <i className="fa-solid fa-crown"></i>
                 </div>
                 <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Go Premium</h2>
                    <p className="text-sm text-slate-500 font-medium px-8">Get unlimited access to the entire medical curriculum, AI tutoring, and DRM videos.</p>
                 </div>
                 
                 <div className="space-y-3">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                       <div className="text-left">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Yearly Plan</p>
                          <p className="text-xl font-black text-slate-900">₹9,999 / year</p>
                       </div>
                       <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded">SAVE 30%</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border-2 border-oneui-blue flex items-center justify-between shadow-lg shadow-blue-50">
                       <div className="text-left">
                          <p className="text-xs font-black text-oneui-blue uppercase tracking-widest">Monthly Plan</p>
                          <p className="text-xl font-black text-slate-900">₹1,200 / month</p>
                       </div>
                       <i className="fa-solid fa-circle-check text-oneui-blue"></i>
                    </div>
                 </div>

                 <button className="w-full h-16 bg-oneui-blue text-white rounded-samsung font-black text-xl shadow-xl shadow-blue-100 active:scale-95 transition-all">
                    Upgrade Now
                 </button>
                 <button onClick={() => setShowUpgradeModal(false)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maybe Later</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
