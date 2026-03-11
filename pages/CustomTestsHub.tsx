
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CustomTestsHub: React.FC = () => {
  const navigate = useNavigate();

  const options = [
    {
      id: 'practice',
      title: 'Custom Practice Test',
      subtitle: 'Flexible learning & concept reinforcement',
      icon: 'fa-stethoscope',
      path: '/custom-practice-setup',
      color: 'text-synapse-blue-primary',
      bgColor: 'bg-synapse-blue-primary/10'
    },
    {
      id: 'mock',
      title: 'Custom Mock Test',
      subtitle: 'Simulate real exam environment',
      icon: 'fa-file-contract',
      path: '/customize-mock',
      color: 'text-synapse-aqua',
      bgColor: 'bg-synapse-aqua/10'
    }
  ];

  return (
    <div className="pb-40 bg-synapse-blue-light min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 relative">
        <button onClick={() => navigate(-1)} className="absolute top-4 left-6 w-12 h-12 flex items-center justify-center text-synapse-text-secondary active:scale-90">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="text-4xl font-light text-synapse-text-primary leading-tight tracking-tight">Custom<br/><span className="font-bold">Tests</span></h1>
      </div>

      <div className="px-5 space-y-4 -mt-4">
        {options.map((opt) => (
          <div 
            key={opt.id}
            onClick={() => navigate(opt.path)}
            className="bg-white rounded-samsung p-8 border border-white shadow-lg flex items-center gap-6 active:scale-[0.98] transition-all cursor-pointer group card-shadow"
          >
            <div className={`w-16 h-16 ${opt.bgColor} ${opt.color} rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>
              <i className={`fa-solid ${opt.icon}`}></i>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-synapse-text-primary leading-tight">{opt.title}</h3>
              <p className="text-[11px] font-bold text-synapse-text-secondary uppercase tracking-widest mt-1">{opt.subtitle}</p>
            </div>
            <i className="fa-solid fa-chevron-right text-slate-200 group-hover:text-synapse-blue-primary transition-colors"></i>
          </div>
        ))}

        <div className="bg-synapse-blue-primary/5 border border-synapse-blue-primary/10 rounded-samsung p-8 mt-4">
           <div className="flex items-center gap-3 text-synapse-blue-primary mb-4">
              <i className="fa-solid fa-circle-info"></i>
              <h4 className="text-[11px] font-black uppercase tracking-widest">Analytics Tracking</h4>
           </div>
           <p className="text-xs font-medium text-synapse-text-secondary leading-relaxed">
             Both modes track accuracy, time per question, and topic performance to optimize your AI study path.
           </p>
        </div>
      </div>
    </div>
  );
};

export default CustomTestsHub;
