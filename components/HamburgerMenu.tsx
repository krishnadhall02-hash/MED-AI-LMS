
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const menuItems = [
    { label: 'Schedule', icon: 'fa-calendar-days', path: '/calendar', color: 'text-blue-500' },
    { label: 'Expert Advice', icon: 'fa-user-doctor', path: '/expert-advice', color: 'text-emerald-500' },
    { label: 'Student Profile', icon: 'fa-user-gear', path: '/profile', color: 'text-slate-700' },
    { label: 'Sign Out', icon: 'fa-right-from-bracket', action: () => setShowSignOutModal(true), color: 'text-red-500' },
  ];

  const handleSignOut = () => {
    // In a real app, clear tokens here
    window.location.reload(); // Hard reset for demo purposes to trigger login flow
  };

  if (!isOpen && !showSignOutModal) return null;

  return (
    <>
      {/* Background Dimming Overlay */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Slide-in Drawer UI (Right side as requested in prompt) */}
      <div className={`fixed top-0 right-0 bottom-0 w-[80%] max-w-[340px] bg-oneui-bg z-[70] shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Drawer Header (One UI Style) */}
        <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 bg-oneui-bg border-b border-slate-200/50">
          <div className="flex justify-end mb-4">
             <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-400 active:scale-90">
                <i className="fa-solid fa-xmark text-xl"></i>
             </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white border-2 border-oneui-blue p-1">
               <img src="https://i.pravatar.cc/150?u=sarah" className="w-full h-full rounded-full object-cover" alt="Profile" />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-900 leading-tight">Dr. Sarah</h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NEET PG Aspirant</p>
            </div>
          </div>
        </div>

        {/* Menu Items (PART B) */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else if (item.path) {
                  navigate(item.path);
                  onClose();
                }
              }}
              className="w-full flex items-center gap-5 p-5 rounded-2xl bg-white/50 hover:bg-white active:scale-[0.98] transition-all border border-transparent hover:border-slate-100 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${item.label === 'Sign Out' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-oneui-blue'}`}>
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              <span className={`text-base font-black ${item.label === 'Sign Out' ? 'text-red-600' : 'text-slate-800'}`}>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Footer Info */}
        <div className="p-8 text-center space-y-2">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">MedAI LMS v2.4.0</p>
           <p className="text-[9px] font-bold text-slate-400 uppercase">Hardware ID: S24U-9421-MED</p>
        </div>
      </div>

      {/* Sign Out Confirmation Modal (PART D) */}
      {showSignOutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-samsung p-8 w-full max-w-[340px] text-center space-y-6 shadow-2xl animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full mx-auto flex items-center justify-center text-3xl shadow-inner">
                 <i className="fa-solid fa-power-off"></i>
              </div>
              <div className="space-y-2">
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign Out?</h2>
                 <p className="text-sm text-slate-500 font-medium leading-relaxed px-4">You will need to re-verify your device to access your study materials again.</p>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                 <button 
                   onClick={handleSignOut}
                   className="w-full h-16 bg-red-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-200 active:scale-95 transition-all"
                 >
                   Confirm Sign Out
                 </button>
                 <button 
                   onClick={() => setShowSignOutModal(false)}
                   className="w-full h-14 bg-slate-50 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                 >
                   Stay Logged In
                 </button>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

export default HamburgerMenu;
