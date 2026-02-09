
import React from 'react';
import { useNavigate } from 'react-router-dom';

const FACULTY = [
  {
    id: 'f1',
    name: 'Dr. Anand Sharma',
    subject: 'Anatomy & Neurosciences',
    exp: '12+ Years',
    status: 'Available',
    avatar: 'https://i.pravatar.cc/150?u=dr_anand',
    bio: 'Ex-AIIMS Resident, Specialist in Clinical Anatomy.'
  },
  {
    id: 'f2',
    name: 'Dr. Sarah Johnson',
    subject: 'Internal Medicine',
    exp: '15+ Years',
    status: 'Busy',
    avatar: 'https://i.pravatar.cc/150?u=sarah_f',
    bio: 'Pioneer in Integrative Medical Pedagogy.'
  },
  {
    id: 'f3',
    name: 'Dr. Vikram Mehra',
    subject: 'Pharmacology & Toxicology',
    exp: '8+ Years',
    status: 'Available',
    avatar: 'https://i.pravatar.cc/150?u=vikram_f',
    bio: 'Gold Medalist in MD Pharma, Mnemonic expert.'
  },
];

const FacultyList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-40 bg-oneui-bg min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 -ml-2 text-slate-500 mb-2">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-4xl font-light text-slate-900 leading-tight">Choose Your<br/><span className="font-bold">Expert</span></h1>
      </div>

      <div className="px-5 space-y-4 -mt-4">
        {FACULTY.map((f) => (
          <div 
            key={f.id}
            onClick={() => f.status === 'Available' && navigate(`/book-appointment/${f.id}`)}
            className={`bg-white rounded-samsung p-6 shadow-sm border border-slate-100 flex flex-col gap-6 active:scale-[0.98] transition-all cursor-pointer ${f.status === 'Busy' ? 'opacity-70 grayscale-[0.5]' : ''}`}
          >
            <div className="flex items-center gap-5">
              <div className="relative">
                <img src={f.avatar} alt={f.name} className="w-20 h-20 rounded-[24px] object-cover border-2 border-slate-50 shadow-sm" />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${f.status === 'Available' ? 'bg-emerald-500' : 'bg-red-500'}`} />
              </div>
              <div className="flex-1">
                 <h4 className="text-lg font-black text-slate-900 leading-tight">{f.name}</h4>
                 <p className="text-[10px] font-black text-oneui-blue uppercase tracking-widest mt-0.5">{f.subject}</p>
                 <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-slate-400">
                       <i className="fa-solid fa-briefcase text-[10px]"></i>
                       <span className="text-[10px] font-bold uppercase">{f.exp}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${f.status === 'Available' ? 'text-emerald-600' : 'text-red-500'}`}>
                       <i className={`fa-solid ${f.status === 'Available' ? 'fa-circle-check' : 'fa-clock'} text-[10px]`}></i>
                       <span className="text-[10px] font-black uppercase">{f.status}</span>
                    </div>
                 </div>
              </div>
            </div>

            <p className="text-xs font-medium text-slate-500 leading-relaxed px-1">
              {f.bio}
            </p>

            <button 
              disabled={f.status === 'Busy'}
              className={`w-full h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
                f.status === 'Available' 
                ? 'bg-oneui-blue text-white shadow-lg shadow-blue-100' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {f.status === 'Available' ? 'Book Appointment' : 'Currently Unavailable'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyList;
