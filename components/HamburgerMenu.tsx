
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Schedule', icon: 'fa-calendar-days', path: '/calendar' },
    { label: 'Expert Advice', icon: 'fa-user-doctor', path: '/expert-advice' },
    { label: 'Student Profile', icon: 'fa-user-gear', path: '/profile' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Background Dimming Overlay */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Slide-in Drawer UI (Right side) */}
      <div className={`fixed top-0 right-0 bottom-0 w-[80%] max-w-[340px] bg-oneui-bg z-[70] shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Drawer Header (One UI Style) */}
        <div className="oneui-header-space flex flex-col justify-end px-8 pb-8 bg-oneui-bg border-b border-slate-200/50">
          <div className="flex justify-end mb-4">
             <button onClick={onClose} aria-label="Close menu" className="w-10 h-10 flex items-center justify-center text-slate-400 active:scale-90">
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

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.path) {
                  navigate(item.path);
                  onClose();
                }
              }}
              className="w-full flex items-center gap-5 p-5 rounded-2xl bg-white/50 hover:bg-white active:scale-[0.98] transition-all border border-transparent hover:border-slate-100 group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-oneui-blue transition-all">
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              <span className="text-base font-black text-slate-800">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Footer Info */}
        <div className="p-8 text-center space-y-2">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">MedAI LMS v2.4.0</p>
           <p className="text-[9px] font-bold text-slate-400 uppercase">Hardware ID: S24U-9421-MED</p>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
