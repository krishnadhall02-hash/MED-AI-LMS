
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
    <div className="flex flex-col h-full bg-oneui-bg p-8 animate-in slide-in-from-bottom duration-500">
      <button onClick={onBack} className="w-10 h-10 -ml-2 text-slate-800 flex items-center justify-center">
        <i className="fa-solid fa-xmark text-xl"></i>
      </button>

      <div className="flex-1 overflow-y-auto pt-6 pb-20 space-y-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 leading-tight">Create<br/>Account</h1>
          <p className="text-slate-500 font-medium">Start your specialized preparation</p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <input 
              type="text" 
              placeholder="Dr. Your Name"
              className="w-full h-14 px-5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-oneui-blue font-medium"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="email@college.edu"
              className="w-full h-14 px-5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-oneui-blue font-medium"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Target Exam</label>
            <select 
              className="w-full h-14 px-5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-oneui-blue font-medium appearance-none"
              value={formData.exam}
              onChange={(e) => setFormData({...formData, exam: e.target.value})}
            >
              <option>NEET PG</option>
              <option>NEXT</option>
              <option>FMGE</option>
              <option>INI-CET</option>
            </select>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-8 bg-oneui-bg/80 backdrop-blur-md">
        <button 
          onClick={handleRegister}
          className="w-full h-16 bg-slate-900 text-white rounded-samsung font-black text-xl shadow-lg hover:bg-oneui-blue transition-all"
        >
          Complete Registration
        </button>
      </div>
    </div>
  );
};

export default Register;
