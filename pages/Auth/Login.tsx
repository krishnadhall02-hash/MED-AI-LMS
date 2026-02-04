
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
      setError('Please enter your email or mobile number');
      return;
    }
    // Simple validation for mock
    onNext(identifier);
  };

  return (
    <div className="flex flex-col h-full bg-oneui-bg p-8 animate-in fade-in duration-500">
      <div className="flex-1 flex flex-col justify-center space-y-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-light text-slate-900 leading-tight">Welcome to<br/><span className="font-bold">MedAI Portal</span></h1>
          <p className="text-slate-500 font-medium">Log in to continue your medical journey</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email or Mobile</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Enter your details"
                className={`w-full h-16 px-5 bg-white border ${error ? 'border-red-500' : 'border-slate-200'} rounded-samsung focus:outline-none focus:ring-2 focus:ring-oneui-blue transition-all font-medium text-lg`}
                value={identifier}
                onChange={(e) => { setIdentifier(e.target.value); setError(''); }}
              />
              {error && <p className="text-red-500 text-xs mt-2 ml-1 font-bold">{error}</p>}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3">
            <i className="fa-solid fa-shield-halved text-oneui-blue mt-0.5"></i>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              <span className="font-bold text-oneui-blue">Secure Device Binding:</span> Your account will be locked to this device for your security.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-8">
        <button 
          onClick={handleNext}
          className="w-full h-16 bg-oneui-blue text-white rounded-samsung font-black text-xl shadow-lg shadow-blue-200 hover:scale-[0.98] active:scale-95 transition-all"
        >
          Get OTP
        </button>
        <button 
          onClick={onNavigateRegister}
          className="w-full h-12 text-slate-500 font-bold text-sm hover:text-oneui-blue transition-colors"
        >
          New here? <span className="underline">Create an account</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
