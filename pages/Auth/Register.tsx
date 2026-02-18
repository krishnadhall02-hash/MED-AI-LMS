
import React, { useState } from 'react';

interface RegisterProps {
  onBack: () => void;
  onSuccess: (email: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    exam: 'NEET PG'
  });

  const handleRegister = () => {
    if (!formData.name || !formData.email) return;
    onSuccess(formData.email);
  };

  return (
    <div className="flex flex-col h-full bg-transparent p-8 animate-in slide-in-from-bottom duration-500">
      <button onClick={onBack} className="w-12 h-12 -ml-2 text-oneui-text-secondary flex items-center justify-center rounded-full hover:bg-white/5 active:scale-90 transition-all">
        <i className="fa-solid fa-xmark text-xl"></i>
      </button>

      <div className="flex-1 overflow-y-auto pt-6 pb-20 space-y-12">
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-oneui-text-primary leading-tight tracking-tight">Create<br/><span className="text-synapse-aqua">Academic ID</span></h1>
          <p className="text-oneui-text-secondary font-medium">Join 50k+ aspirants on the AI platform.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-oneui-text-muted uppercase tracking-[0.2em] ml-1">Full Name</label>
            <input 
              type="text" 
              placeholder="Dr. Your Name"
              className="w-full h-16 px-6 bg-synapse-surface border border-synapse-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-synapse-aqua/30 text-oneui-text-primary font-bold text-lg transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-oneui-text-muted uppercase tracking-[0.2em] ml-1">Professional Email</label>
            <input 
              type="email" 
              placeholder="name@institution.edu"
              className="w-full h-16 px-6 bg-synapse-surface border border-synapse-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-synapse-aqua/30 text-oneui-text-primary font-bold text-lg transition-all"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-oneui-text-muted uppercase tracking-[0.2em] ml-1">Target Exam</label>
            <div className="relative">
              <select 
                className="w-full h-16 px-6 bg-synapse-surface border border-synapse-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-synapse-aqua/30 text-oneui-text-primary font-bold text-lg appearance-none transition-all"
                value={formData.exam}
                onChange={(e) => setFormData({...formData, exam: e.target.value})}
              >
                <option>NEET PG</option>
                <option>NEXT</option>
                <option>FMGE</option>
                <option>INI-CET</option>
              </select>
              <i className="fa-solid fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-oneui-text-muted pointer-events-none"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-8">
        <button 
          onClick={handleRegister}
          className="w-full h-20 bg-synapse-aqua text-synapse-deep rounded-samsung font-black text-xl shadow-[0_10px_40px_rgba(45,212,191,0.2)] active:scale-95 transition-all"
        >
          Initialize Academy Account
        </button>
      </div>
    </div>
  );
};

export default Register;
