
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
    FREE: 'bg-synapse-success/10 text-synapse-success border-synapse-success/20',
    PAID: 'bg-synapse-aqua/10 text-synapse-aqua border-synapse-aqua/20',
    TRIAL: 'bg-synapse-warning/10 text-synapse-warning border-synapse-warning/20'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${styles[type]}`}>
      {type}
    </span>
  );
};

const SyllabusBadge: React.FC<{ tag: SyllabusTag }> = ({ tag }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-black tracking-tight border ${
    tag.weightage === 'High' ? 'bg-synapse-error/10 text-synapse-error border-synapse-error/20' : 'bg-synapse-elevated text-oneui-text-muted border-synapse-border'
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
      <div className="pb-32 animate-in fade-in duration-500 bg-transparent">
        <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
          <h1 className="text-4xl font-light text-oneui-text-primary leading-tight tracking-tight">Academic<br/><span className="font-black text-synapse-aqua uppercase tracking-widest text-3xl">Archive</span></h1>
        </div>
        <div className="px-5 space-y-6">
          <div className="bg-synapse-surface rounded-2xl h-16 px-6 flex items-center gap-4 border border-synapse-border shadow-2xl backdrop-blur-md mb-8 group focus-within:ring-2 focus-within:ring-synapse-aqua/20 transition-all">
            <i className="fa-solid fa-magnifying-glass text-oneui-text-muted"></i>
            <input type="text" placeholder="Search modules..." className="bg-transparent border-none flex-1 focus:outline-none font-bold text-oneui-text-primary placeholder:text-oneui-text-muted" />
          </div>
          {MOCK_DATA.map((subject) => (
            <div 
              key={subject.id} 
              onClick={() => setSelectedSubject(subject)}
              className="bg-synapse-surface rounded-samsung overflow-hidden shadow-2xl border border-synapse-border flex flex-col active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="relative h-44">
                <img src={subject.thumbnail} alt={subject.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-70" />
                <div className="absolute top-5 left-5">
                  <PricingBadge type={subject.pricing} />
                </div>
                {subject.pricing === 'FREE' && (
                  <div className="absolute bottom-5 right-5 bg-synapse-success text-synapse-deep text-[9px] font-black px-3 py-1.5 rounded-lg shadow-lg">
                    FOUNDATIONAL
                  </div>
                )}
              </div>
              <div className="p-8 space-y-6">
                <div>
                   <h3 className="text-2xl font-black text-oneui-text-primary">{subject.title}</h3>
                   <p className="text-sm text-oneui-text-secondary mt-1 font-medium leading-relaxed">{subject.description}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black text-oneui-text-muted uppercase tracking-[0.2em]">
                    <span>Neural Sync</span>
                    <span className="text-synapse-aqua">{subject.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-synapse-deep rounded-full overflow-hidden">
                    <div className="h-full bg-synapse-aqua rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(45,212,191,0.4)]" style={{ width: `${subject.progress}%` }}></div>
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
        <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 relative">
          <button onClick={goBack} className="absolute top-4 left-6 w-12 h-12 flex items-center justify-center text-oneui-text-secondary active:scale-90 transition-transform">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-bold text-oneui-text-primary leading-tight tracking-tight">{selectedSubject.title}</h1>
            {selectedSubject.pricing === 'FREE' && <PricingBadge type="FREE" />}
          </div>
          <p className="text-[10px] text-synapse-aqua font-black uppercase tracking-[0.3em]">Module Curriculum</p>
        </div>

        <div className="px-5 mt-4 space-y-4">
          {selectedSubject.topics.map((topic) => (
            <button 
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className="w-full bg-synapse-surface p-8 rounded-samsung border border-synapse-border flex items-center justify-between shadow-2xl active:scale-[0.98] transition-all text-left group backdrop-blur-sm"
            >
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap gap-2">
                  {topic.syllabusTags?.map((tag, idx) => <SyllabusBadge key={idx} tag={tag} />)}
                </div>
                <div>
                   <h3 className="font-black text-oneui-text-primary text-xl leading-tight">{topic.title}</h3>
                   <p className="text-xs text-oneui-text-muted font-black uppercase tracking-widest mt-1">{topic.subtopics.length} Neural Nodes</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-synapse-deep rounded-2xl flex items-center justify-center text-oneui-text-muted group-hover:text-synapse-aqua group-hover:bg-synapse-aqua/10 transition-all border border-synapse-border">
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
    <div className="pb-32 animate-in slide-in-from-right duration-300">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 relative">
        <button onClick={goBack} className="absolute top-4 left-6 w-12 h-12 flex items-center justify-center text-oneui-text-secondary">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-oneui-text-primary leading-tight tracking-tight">{selectedTopic.title}</h1>
            <p className="text-[10px] text-synapse-aqua font-black uppercase tracking-[0.2em] mt-1">{selectedSubject.title}</p>
          </div>
        </div>
      </div>
      <div className="px-5 mt-8 space-y-12">
         {selectedTopic.subtopics.map(st => (
           <div key={st.id} className="space-y-4">
              <h4 className="text-[10px] font-black text-oneui-text-muted uppercase tracking-[0.2em] px-2">{st.title}</h4>
              <div className="space-y-3">
                 {st.contents.map(c => (
                   <div 
                    key={c.id} 
                    onClick={() => c.type === 'video' && navigate(`/video/${c.id}`)}
                    className="bg-synapse-surface p-5 rounded-2xl border border-synapse-border flex items-center gap-5 active:scale-95 transition-all cursor-pointer"
                   >
                      <div className="w-12 h-12 rounded-xl bg-synapse-deep flex items-center justify-center text-synapse-aqua text-xl border border-synapse-border">
                         <i className={`fa-solid ${c.type === 'video' ? 'fa-play' : 'fa-file-lines'}`}></i>
                      </div>
                      <div className="flex-1">
                         <p className="font-bold text-oneui-text-primary text-[15px]">{c.title}</p>
                         {c.duration && <p className="text-[9px] font-black text-oneui-text-muted uppercase tracking-widest">{c.duration} Session</p>}
                      </div>
                      {c.isCompleted ? <i className="fa-solid fa-circle-check text-synapse-success"></i> : <i className="fa-regular fa-circle text-synapse-border"></i>}
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
