
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

    // Auto-focus next
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
    
    // Mock verification
    try {
      if (code === '1234') {
        await onVerify();
      } else {
        setError('Invalid code. Try 1234');
        setIsVerifying(false);
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-oneui-bg p-8 animate-in slide-in-from-right duration-500">
      <button 
        onClick={onBack} 
        disabled={isVerifying}
        className="w-10 h-10 -ml-2 text-slate-800 flex items-center justify-center disabled:opacity-30"
      >
        <i className="fa-solid fa-arrow-left text-xl"></i>
      </button>

      <div className="flex-1 flex flex-col justify-center space-y-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 leading-tight">Verify Identity</h1>
          <p className="text-slate-500 font-medium">We've sent a 4-digit code to<br/><span className="text-slate-900 font-bold">{identifier}</span></p>
        </div>

        <div className="space-y-8">
          <div className="flex justify-between gap-4">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength={1}
                disabled={isVerifying}
                className={`w-16 h-20 text-center text-3xl font-black bg-white border-2 ${error ? 'border-red-500' : 'border-slate-200'} rounded-samsung focus:border-oneui-blue focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all shadow-sm disabled:opacity-50`}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
              />
            ))}
          </div>
          {error && <p className="text-red-500 text-center text-sm font-bold animate-bounce">{error}</p>}

          <div className="text-center">
            {timer > 0 ? (
              <p className="text-slate-400 text-sm font-medium">Resend code in <span className="text-slate-900 font-bold">0:{timer < 10 ? `0${timer}` : timer}</span></p>
            ) : (
              <button disabled={isVerifying} className="text-oneui-blue text-sm font-bold underline disabled:opacity-30">Resend code now</button>
            )}
          </div>
        </div>
      </div>

      <div className="pb-8">
        <button 
          onClick={handleVerify}
          disabled={isVerifying || otp.join('').length < 4}
          className="w-full h-16 bg-oneui-blue text-white rounded-samsung font-black text-xl shadow-lg shadow-blue-200 hover:scale-[0.98] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:grayscale-[0.3]"
        >
          {isVerifying ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i>
              <span>Verifying...</span>
            </>
          ) : (
            'Verify & Log In'
          )}
        </button>
      </div>
    </div>
  );
};

export default OTP;
