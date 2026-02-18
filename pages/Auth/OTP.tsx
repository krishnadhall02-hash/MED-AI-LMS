
import React, { useState, useEffect } from 'react';

interface OTPProps {
  identifier: string;
  onVerify: () => Promise<void>;
  onBack: () => void;
}

const OTP: React.FC<OTPProps> = ({ identifier, onVerify, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 4) {
      setError('Required field');
      return;
    }
    
    setIsVerifying(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      if (code === '1234') {
        await onVerify();
      } else {
        setError('Incorrect sync code (Use 1234)');
        setIsVerifying(false);
        setOtp(['', '', '', '']);
        document.getElementById('otp-0')?.focus();
      }
    } catch (err) {
      setError('Network error');
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent p-8 animate-in slide-in-from-right duration-500 overflow-hidden">
      <button 
        onClick={onBack} 
        disabled={isVerifying}
        className="w-12 h-12 -ml-2 text-oneui-text-secondary flex items-center justify-center rounded-full hover:bg-white/5 active:scale-90 transition-all"
      >
        <i className="fa-solid fa-arrow-left text-xl"></i>
      </button>

      <div className="flex-1 flex flex-col justify-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-oneui-text-primary leading-tight tracking-tight">Verify<br/><span className="text-synapse-aqua">Neural Link</span></h1>
          <p className="text-base text-oneui-text-secondary font-medium leading-relaxed">
            Identifier: <span className="text-oneui-text-primary font-bold border-b border-synapse-border pb-1">{identifier}</span>
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex justify-between gap-4">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                disabled={isVerifying}
                className={`w-full aspect-square text-center text-4xl font-black bg-synapse-surface border-2 transition-all shadow-sm rounded-2xl focus:outline-none ${
                  error ? 'border-synapse-error' : 'border-synapse-border focus:border-synapse-aqua focus:ring-4 focus:ring-synapse-aqua/20'
                }`}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
              />
            ))}
          </div>
          
          {error && (
            <p className="text-synapse-error text-center text-sm font-black animate-in zoom-in duration-300">
              {error}
            </p>
          )}

          <div className="text-center pt-2">
            {timer > 0 ? (
              <p className="text-oneui-text-muted text-xs font-bold uppercase tracking-widest">
                Re-sync in <span className="text-oneui-text-primary tabular-nums">0:{timer < 10 ? `0${timer}` : timer}</span>
              </p>
            ) : (
              <button 
                className="text-synapse-aqua text-xs font-black uppercase tracking-widest hover:underline"
              >
                Request New Code
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="pb-8 space-y-6">
        <div className="bg-synapse-surface/50 p-5 rounded-2xl flex items-start gap-4 border border-synapse-border">
           <i className="fa-solid fa-shield-halved text-synapse-aqua text-lg mt-0.5"></i>
           <p className="text-xs text-oneui-text-secondary leading-relaxed font-medium">
             This device (S24 Ultra) will be linked to <span className="text-oneui-text-primary font-bold">Dr. Sarah's Profile</span>.
           </p>
        </div>

        <button 
          onClick={handleVerify}
          disabled={isVerifying || otp.join('').length < 4}
          className="w-full h-20 bg-synapse-aqua text-synapse-deep rounded-samsung font-black text-xl shadow-[0_10px_40px_rgba(45,212,191,0.2)] active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center gap-4"
        >
          {isVerifying ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Complete Sync'}
        </button>
      </div>
    </div>
  );
};

export default OTP;
