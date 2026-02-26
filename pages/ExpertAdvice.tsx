
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExpertAdvice: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-40 bg-synapse-blue-light min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 -ml-2 text-synapse-text-secondary mb-2">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-4xl font-light text-synapse-text-primary leading-tight">Expert<br/><span className="font-bold">Guidance</span></h1>
      </div>

      <div className="px-5 space-y-6 -mt-4">
        {/* Primary Action: Book Appointment */}
        <div 
          onClick={() => navigate('/faculty-list')}
          className="bg-white rounded-samsung p-8 shadow-sm border border-white space-y-6 active:scale-[0.98] transition-all cursor-pointer group card-shadow"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-synapse-blue-primary rounded-[20px] flex items-center justify-center text-white text-3xl shadow-lg shadow-synapse-blue-primary/20">
               <i className="fa-solid fa-calendar-check"></i>
            </div>
            <div>
               <h3 className="text-xl font-black text-synapse-text-primary leading-tight">Book Expert Appointment</h3>
               <p className="text-[10px] font-black text-synapse-blue-primary uppercase tracking-widest mt-1">1-on-1 Personalized Session</p>
            </div>
          </div>
          <p className="text-sm font-medium text-synapse-text-secondary leading-relaxed">
            Schedule a private video or audio session with our top faculty to resolve your deepest doubts or craft your exam strategy.
          </p>
          <button className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-synapse-text-primary group-hover:bg-synapse-blue-primary group-hover:text-white transition-all">
            Find an Expert
          </button>
        </div>

        {/* Guidance Text */}
        <div className="bg-synapse-blue-primary rounded-[32px] p-8 text-white space-y-4 shadow-xl">
           <div className="flex items-center gap-3">
              <i className="fa-solid fa-circle-info text-white/80"></i>
              <h4 className="font-bold">How it works</h4>
           </div>
           <ul className="space-y-3 opacity-80 text-xs font-medium leading-relaxed">
              <li className="flex gap-3">
                <span className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-[10px] shrink-0">1</span>
                Select a subject expert from the listing.
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-[10px] shrink-0">2</span>
                Pick an available slot for a 15 or 30 min call.
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-[10px] shrink-0">3</span>
                Describe your doubt or goal to help faculty prepare.
              </li>
           </ul>
        </div>

        {/* Previously Asked Doubts Placeholder */}
        <div className="space-y-4">
           <h3 className="text-xs font-black text-synapse-text-secondary uppercase tracking-widest px-2">Recently Resolved</h3>
           <div className="bg-white p-6 rounded-samsung border border-white shadow-sm opacity-60 card-shadow">
              <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest mb-2">History</p>
              <p className="text-sm font-bold text-synapse-text-primary italic">"No past appointments found. Your future session summaries will appear here."</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertAdvice;
