
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
    title: 'Biochemistry',
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
    PAID: 'bg-synapse-blue-primary/10 text-synapse-blue-primary border-synapse-blue-primary/10',
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
    tag.weightage === 'High' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-slate-50 text-slate-400 border-slate-100'
  }`}>
    {tag.syllabusName}: {tag.code}
  </span>
);

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

  if (!selectedSubject) {
    return (
      <div className="pb-32 animate-in fade-in duration-500 bg-synapse-blue-light min-h-screen">
        <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
          <h1 className="text-4xl font-light text-synapse-text-primary leading-tight tracking-tight">Academic<br/><span className="font-black text-synapse-blue-primary uppercase tracking-widest text-3xl">Archive</span></h1>
        </div>
        <div className="px-5 space-y-6">
          <div className="bg-white rounded-2xl h-16 px-6 flex items-center gap-4 border border-white shadow-sm card-shadow mb-8 group focus-within:ring-2 focus-within:ring-synapse-blue-primary/10 transition-all">
            <i className="fa-solid fa-magnifying-glass text-slate-300"></i>
            <input type="text" placeholder="Search modules..." className="bg-transparent border-none flex-1 focus:outline-none font-bold text-synapse-text-primary placeholder:text-slate-300" />
          </div>
          {MOCK_DATA.map((subject) => (
            <div 
              key={subject.id} 
              onClick={() => setSelectedSubject(subject)}
              className="bg-white rounded-samsung overflow-hidden shadow-sm border border-white flex flex-col active:scale-[0.98] transition-all cursor-pointer group card-shadow"
            >
              <div className="relative h-44">
                <img src={subject.thumbnail} alt={subject.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90" />
                <div className="absolute top-5 left-5">
                  <PricingBadge type={subject.pricing} />
                </div>
                {subject.pricing === 'FREE' && (
                  <div className="absolute bottom-5 right-5 bg-emerald-500 text-white text-[9px] font-black px-3 py-1.5 rounded-lg shadow-lg">
                    FOUNDATIONAL
                  </div>
                )}
              </div>
              <div className="p-8 space-y-6">
                <div>
                   <h3 className="text-2xl font-black text-synapse-text-primary">{subject.title}</h3>
                   <p className="text-sm text-synapse-text-secondary mt-1 font-medium leading-relaxed">{subject.description}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black text-synapse-text-secondary uppercase tracking-[0.2em]">
                    <span>Neural Sync</span>
                    <span className="text-synapse-blue-primary">{subject.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-synapse-blue-primary rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${subject.progress}%` }}></div>
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
      <div className="pb-32 animate-in slide-in-from-right duration-300 bg-synapse-blue-light min-h-screen">
        <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 relative">
          <button onClick={goBack} className="absolute top-4 left-6 w-12 h-12 flex items-center justify-center text-synapse-text-secondary active:scale-90 transition-transform">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-bold text-synapse-text-primary leading-tight tracking-tight">{selectedSubject.title}</h1>
            {selectedSubject.pricing === 'FREE' && <PricingBadge type="FREE" />}
          </div>
          <p className="text-[10px] text-synapse-blue-primary font-black uppercase tracking-[0.3em]">Module Curriculum</p>
        </div>

        <div className="px-5 mt-4 space-y-4">
          {selectedSubject.topics.map((topic) => (
            <button 
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className="w-full bg-white p-8 rounded-samsung border border-white flex items-center justify-between shadow-sm active:scale-[0.98] transition-all text-left group card-shadow"
            >
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap gap-2">
                  {topic.syllabusTags?.map((tag, idx) => <SyllabusBadge key={idx} tag={tag} />)}
                </div>
                <div>
                   <h3 className="font-black text-synapse-text-primary text-xl leading-tight">{topic.title}</h3>
                   <p className="text-xs text-synapse-text-secondary font-black uppercase tracking-widest mt-1">{topic.subtopics.length} Neural Nodes</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-synapse-blue-primary group-hover:bg-synapse-blue-primary/10 transition-all border border-slate-100">
                <i className="fa-solid fa-chevron-right"></i>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 3. SUBTOPIC & CONTENT VIEW (Fallback/Generic return)
  return (
    <div className="pb-32 animate-in slide-in-from-right duration-300 bg-synapse-blue-light min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 relative">
        <button onClick={goBack} className="absolute top-4 left-6 w-12 h-12 flex items-center justify-center text-synapse-text-secondary">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-synapse-text-primary leading-tight tracking-tight">{selectedTopic.title}</h1>
            <p className="text-[10px] text-synapse-blue-primary font-black uppercase tracking-[0.2em] mt-1">{selectedSubject.title}</p>
          </div>
        </div>
      </div>
      <div className="px-5 mt-8 space-y-12">
         {selectedTopic.subtopics.map(st => (
           <div key={st.id} className="space-y-4">
              <h4 className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-[0.2em] px-2">{st.title}</h4>
              <div className="space-y-3">
                 {st.contents.map(c => (
                   <div 
                    key={c.id} 
                    onClick={() => c.type === 'video' && navigate(`/video/${c.id}`)}
                    className="bg-white p-5 rounded-2xl border border-white flex items-center gap-5 active:scale-95 transition-all cursor-pointer shadow-sm card-shadow"
                   >
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-synapse-blue-primary text-xl border border-slate-100">
                         <i className={`fa-solid ${c.type === 'video' ? 'fa-play' : 'fa-file-lines'}`}></i>
                      </div>
                      <div className="flex-1">
                         <p className="font-bold text-synapse-text-primary text-[15px]">{c.title}</p>
                         {c.duration && <p className="text-[9px] font-black text-synapse-text-secondary uppercase tracking-widest">{c.duration} Session</p>}
                      </div>
                      {c.isCompleted ? <i className="fa-solid fa-circle-check text-emerald-500"></i> : <i className="fa-regular fa-circle text-slate-200"></i>}
                   </div>
                 ))}
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default Courses;
