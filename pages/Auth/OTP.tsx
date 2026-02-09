
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

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 4) {
      setError('Please enter the 4-digit code');
      return;
    }
    
    setIsVerifying(true);
    setError('');
    
    // Simulate Backend API Call with One UI 6 performance expectations
    try {
      // Mock network delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      if (code === '1234') {
        // Successful verification triggers the parent redirect logic
        await onVerify();
      } else {
        setError('Verification code is incorrect. Use 1234 for demo.');
        setIsVerifying(false);
        // Reset OTP on error for better UX
        setOtp(['', '', '', '']);
        document.getElementById('otp-0')?.focus();
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-oneui-bg p-8 animate-in slide-in-from-right duration-500 overflow-hidden">
      {/* 1. Header Navigation */}
      <button 
        onClick={onBack} 
        disabled={isVerifying}
        className="w-12 h-12 -ml-2 text-slate-900 flex items-center justify-center rounded-full hover:bg-slate-200 active:scale-90 transition-all disabled:opacity-30"
      >
        <i className="fa-solid fa-arrow-left text-xl"></i>
      </button>

      {/* 2. Main OTP Form Area */}
      <div className="flex-1 flex flex-col justify-center space-y-12">
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">Verify Identity</h1>
          <p className="text-base text-slate-500 font-medium leading-relaxed">
            We've sent a high-yield verification code to<br/>
            <span className="text-slate-900 font-bold border-b-2 border-slate-200">{identifier}</span>
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
                className={`w-[72px] h-24 text-center text-4xl font-black bg-white border-2 transition-all shadow-sm disabled:bg-slate-50/50 disabled:text-slate-300 ${
                  error ? 'border-red-500' : 'border-slate-100 focus:border-oneui-blue focus:ring-8 focus:ring-blue-50'
                } rounded-[24px] focus:outline-none`}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
              />
            ))}
          </div>
          
          {error && (
            <p className="text-red-500 text-center text-sm font-bold animate-in zoom-in duration-300 flex items-center justify-center gap-2">
              <i className="fa-solid fa-circle-exclamation text-xs"></i>
              {error}
            </p>
          )}

          <div className="text-center pt-2">
            {timer > 0 ? (
              <p className="text-slate-400 text-sm font-medium">
                Wait <span className="text-slate-900 font-black tabular-nums">0:{timer < 10 ? `0${timer}` : timer}</span> to resend code
              </p>
            ) : (
              <button 
                disabled={isVerifying} 
                className="text-oneui-blue text-sm font-black uppercase tracking-widest hover:underline disabled:opacity-30 transition-all"
              >
                Resend code now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Primary Submission Action (Fixed Bottom in One UI) */}
      <div className="pb-8 space-y-4">
        <div className="bg-blue-50 p-5 rounded-2xl flex items-start gap-4 border border-blue-100/50">
           <i className="fa-solid fa-user-shield text-oneui-blue text-lg mt-0.5"></i>
           <p className="text-xs text-slate-600 leading-relaxed font-medium">
             Successful login will bind <span className="font-black text-oneui-blue">Sarah's Profile</span> to this S24 Ultra device.
           </p>
        </div>

        <button 
          onClick={handleVerify}
          disabled={isVerifying || otp.join('').length < 4}
          className={`w-full h-20 rounded-[28px] font-black text-xl transition-all flex items-center justify-center gap-4 shadow-2xl disabled:opacity-40 ${
            isVerifying ? 'bg-slate-800 text-white/50' : 'bg-slate-900 text-white shadow-slate-200 active:scale-95'
          }`}
        >
          {isVerifying ? (
            <>
              <i className="fa-solid fa-circle-notch fa-spin"></i>
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Verify & Continue</span>
              <i className="fa-solid fa-chevron-right text-xs opacity-50"></i>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default OTP;
