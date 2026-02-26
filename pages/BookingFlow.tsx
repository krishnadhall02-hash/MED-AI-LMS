
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '11:15 AM', '02:00 PM', '04:30 PM'
];

const BookingFlow: React.FC = () => {
  const { facultyId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [purpose, setPurpose] = useState<string>('');
  const [sessionType, setSessionType] = useState<'Video' | 'Audio' | 'Chat'>('Video');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBook = () => {
    setLoading(true);
    // Simulation
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-synapse-blue-light z-[100] flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-synapse-blue-primary text-white rounded-[32px] flex items-center justify-center text-5xl shadow-2xl shadow-synapse-blue-primary/20 mb-8 animate-in zoom-in duration-700">
           <i className="fa-solid fa-check"></i>
        </div>
        <h2 className="text-3xl font-black text-synapse-text-primary tracking-tight leading-tight mb-4">Appointment<br/>Confirmed!</h2>
        <p className="text-sm text-synapse-text-secondary font-medium px-4 leading-relaxed mb-10">
          Your session is scheduled for 25th Oct at {selectedSlot}. A join link has been added to your schedule.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="w-full h-16 bg-synapse-blue-primary text-white rounded-samsung font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="pb-40 bg-synapse-blue-light min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="w-10 h-10 -ml-2 text-synapse-text-secondary mb-2">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-4xl font-light text-synapse-text-primary leading-tight">
          {step === 1 ? <><span className="font-bold">Select</span><br/>a Slot</> : <><span className="font-bold">Session</span><br/>Details</>}
        </h1>
      </div>

      <div className="px-5 space-y-8 -mt-4">
        {step === 1 ? (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
             <div className="bg-white p-6 rounded-samsung shadow-sm border border-white space-y-6 card-shadow">
                <div className="flex justify-between items-center mb-2">
                   <h3 className="font-black text-synapse-text-primary text-lg">October 2023</h3>
                   <span className="text-[10px] font-black text-synapse-blue-primary uppercase tracking-widest">Select Date</span>
                </div>
                {/* Micro Calendar Mock */}
                <div className="flex justify-between">
                   {[24, 25, 26, 27, 28].map(d => (
                     <button key={d} className={`w-12 h-16 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${d === 25 ? 'bg-synapse-blue-primary text-white shadow-lg' : 'bg-slate-50 text-synapse-text-secondary'}`}>
                        <span className="text-[9px] font-black uppercase">Oct</span>
                        <span className="text-lg font-black">{d}</span>
                     </button>
                   ))}
                </div>
             </div>

             <div className="space-y-4">
                <h3 className="text-xs font-black text-synapse-text-secondary uppercase tracking-widest px-2">Available Times</h3>
                <div className="grid grid-cols-2 gap-3">
                   {SLOTS.map(slot => (
                     <button 
                       key={slot}
                       onClick={() => setSelectedSlot(slot)}
                       className={`h-16 rounded-2xl border-2 font-bold transition-all flex items-center justify-center card-shadow ${
                         selectedSlot === slot 
                         ? 'border-synapse-blue-primary bg-synapse-blue-primary/10 text-synapse-blue-primary shadow-sm' 
                         : 'border-white bg-white text-synapse-text-primary shadow-sm'
                       }`}
                     >
                       {slot}
                     </button>
                   ))}
                </div>
             </div>

             <button 
               disabled={!selectedSlot}
               onClick={() => setStep(2)}
               className="w-full h-16 bg-synapse-blue-primary text-white rounded-samsung font-black text-sm uppercase tracking-widest shadow-xl shadow-synapse-blue-primary/20 disabled:opacity-30 active:scale-95 transition-all"
             >
               Next: Session Details
             </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
             <div className="bg-white p-8 rounded-samsung shadow-sm border border-white space-y-6 card-shadow">
                <div className="space-y-4">
                   <p className="text-xs font-black text-synapse-text-secondary uppercase tracking-widest">Purpose of Appointment</p>
                   <div className="grid grid-cols-1 gap-3">
                      {['Doubt Clearing', 'Concept Explanation', 'Exam Strategy'].map(p => (
                        <button 
                          key={p}
                          onClick={() => setPurpose(p)}
                          className={`h-14 px-5 rounded-xl border-2 text-left font-bold text-sm transition-all flex items-center justify-between ${
                            purpose === p ? 'border-synapse-blue-primary bg-synapse-blue-primary/10 text-synapse-blue-primary' : 'border-slate-50 text-synapse-text-secondary'
                          }`}
                        >
                          {p}
                          {purpose === p && <i className="fa-solid fa-circle-check"></i>}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-4">
                   <p className="text-xs font-black text-synapse-text-secondary uppercase tracking-widest">Brief Description</p>
                   <textarea 
                     className="w-full h-32 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-synapse-blue-primary transition-all"
                     placeholder="e.g. Need help with Ventricular System flow chart."
                   />
                </div>

                <div className="space-y-4">
                   <p className="text-xs font-black text-synapse-text-secondary uppercase tracking-widest">Session Type</p>
                   <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                      {(['Video', 'Audio', 'Chat'] as const).map(t => (
                        <button 
                          key={t}
                          onClick={() => setSessionType(t)}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            sessionType === t ? 'bg-synapse-blue-primary text-white shadow-md' : 'text-synapse-text-secondary'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             <div className="p-2 space-y-4">
                <div className="bg-synapse-blue-primary p-6 rounded-[32px] text-white flex items-center gap-5 shadow-2xl">
                   <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl">
                      <i className="fa-solid fa-wallet"></i>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Plan: Pro Member</p>
                      <p className="text-sm font-bold">1 Free Session Remaining</p>
                   </div>
                </div>

                <button 
                   onClick={handleBook}
                   disabled={loading || !purpose}
                   className="w-full h-16 bg-synapse-blue-primary text-white rounded-samsung font-black text-sm uppercase tracking-widest shadow-xl shadow-synapse-blue-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-30"
                >
                  {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-lock"></i>}
                  {loading ? 'Confirming...' : 'Confirm & Book Session'}
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
