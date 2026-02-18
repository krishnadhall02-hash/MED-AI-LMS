
import React, { useState } from 'react';

interface LoginProps {
  onNext: (identifier: string) => void;
  onNavigateRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onNext, onNavigateRegister }) => {
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!identifier) {
      setError('Required field');
      return;
    }
    onNext(identifier);
  };

  return (
    <div className="flex flex-col h-full bg-transparent p-8 animate-in fade-in duration-700">
      <div className="flex-1 flex flex-col justify-center space-y-12">
        <div className="space-y-4">
          <div className="w-16 h-16 synapse-gradient rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(45,212,191,0.3)] mb-8">
            <i className="fa-solid fa-brain text-white text-3xl"></i>
          </div>
          <h1 className="text-5xl font-black text-white leading-tight tracking-tight">Access<br/><span className="text-synapse-aqua">Synapse AI</span></h1>
          <p className="text-slate-400 font-medium text-lg">Next-gen medical preparation platform.</p>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-synapse-aqua uppercase tracking-[0.2em] ml-1">Identity Access</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Email or Student ID"
                className={`w-full h-18 px-6 bg-synapse-surface/50 border ${error ? 'border-red-500' : 'border-synapse-border'} rounded-samsung focus:outline-none focus:ring-2 focus:ring-synapse-aqua/50 transition-all font-bold text-white text-lg placeholder:text-slate-600 backdrop-blur-md`}
                value={identifier}
                onChange={(e) => { setIdentifier(e.target.value); setError(''); }}
              />
              {error && <p className="text-red-400 text-xs mt-2 ml-1 font-bold animate-in slide-in-from-top-2">{error}</p>}
            </div>
          </div>

          <div className="bg-synapse-aqua/5 border border-synapse-aqua/10 p-5 rounded-2xl flex items-start gap-4">
            <i className="fa-solid fa-shield-bolt text-synapse-aqua mt-1"></i>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              <span className="font-black text-synapse-aqua">End-to-End Encryption:</span> Your learning metrics and AI profile are secured using military-grade AES-256 device binding.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 pb-12">
        <button 
          onClick={handleNext}
          className="w-full h-20 bg-synapse-aqua text-synapse-dark rounded-samsung font-black text-xl shadow-[0_10px_40px_rgba(45,212,191,0.2)] hover:scale-[0.98] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          Initialize Login
          <i className="fa-solid fa-chevron-right text-xs opacity-50"></i>
        </button>
        <button 
          onClick={onNavigateRegister}
          className="w-full text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-synapse-aqua transition-colors"
        >
          New Aspirant? <span className="text-white underline underline-offset-4">Create Account</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
