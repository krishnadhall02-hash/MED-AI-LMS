
import React from 'react';
import { Course } from '../types';

const courses: Course[] = [
  {
    id: '1',
    title: 'Advanced Cardiology Masterclass',
    subject: 'Internal Medicine',
    description: 'Master ECG interpretation, valve diseases, and hemodynamic monitoring.',
    thumbnail: 'https://picsum.photos/seed/cardio/600/400',
    progress: 45,
    isPaid: true,
    topics: []
  },
  {
    id: '2',
    title: 'High Yield Neuroanatomy',
    subject: 'Anatomy',
    description: 'Visual mnemonics for cranial nerves, tracts, and brainstem syndromes.',
    thumbnail: 'https://picsum.photos/seed/neuro/600/400',
    progress: 10,
    isPaid: true,
    topics: []
  },
  {
    id: '3',
    title: 'Pathology for NEET PG',
    subject: 'Pathology',
    description: 'Complete systemic pathology coverage with Robbins integration.',
    thumbnail: 'https://picsum.photos/seed/patho/600/400',
    progress: 82,
    isPaid: false,
    topics: []
  },
];

const Courses: React.FC = () => {
  return (
    <div className="pb-32">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <h1 className="text-4xl font-light text-slate-900 leading-tight">Learning<br/><span className="font-bold">Library</span></h1>
      </div>

      <div className="px-5 space-y-6">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl h-14 px-4 flex items-center gap-3 border border-slate-200 shadow-sm">
          <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
          <input type="text" placeholder="Search my courses" className="bg-transparent border-none flex-1 focus:outline-none font-medium" />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-samsung overflow-hidden shadow-sm border border-slate-100 flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider text-oneui-blue shadow-sm">
                  {course.subject}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-black text-slate-900 text-xl leading-tight">{course.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 font-medium">{course.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                    <span>Course progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-oneui-blue rounded-full transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>

                <div className="pt-2">
                  <button className="w-full h-14 bg-slate-900 text-white text-lg font-black rounded-2xl hover:bg-oneui-blue transition-all">
                    {course.progress > 0 ? 'Resume Lesson' : 'Start Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
