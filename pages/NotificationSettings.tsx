
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationPreference } from '../types';

const INITIAL_PREFS: NotificationPreference[] = [
  { category: 'class', enabled: true, label: 'Live Class Alerts' },
  { category: 'test', enabled: true, label: 'Test & Exam Results' },
  { category: 'study', enabled: true, label: 'AI Study Nudges' },
  { category: 'announcement', enabled: false, label: 'Platform Announcements' },
];

const NotificationSettings: React.FC = () => {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState(INITIAL_PREFS);

  const togglePref = (index: number) => {
    setPrefs(prev => prev.map((p, i) => i === index ? { ...p, enabled: !p.enabled } : p));
  };

  return (
    <div className="pb-40 bg-oneui-bg min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 -ml-2 text-slate-500 mb-2">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="text-3xl font-bold text-slate-900 leading-tight">Settings</h1>
        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Notifications</p>
      </div>

      <div className="px-5 space-y-8 -mt-4">
        {/* Master Control */}
        <div className="bg-white p-6 rounded-samsung border border-slate-100 shadow-sm space-y-6">
           <div className="flex justify-between items-center">
              <div>
                 <h4 className="font-black text-slate-900">Push Notifications</h4>
                 <p className="text-[10px] text-slate-400 font-bold">Manage all incoming alerts</p>
              </div>
              <div className="w-12 h-7 bg-oneui-blue rounded-full relative">
                 <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full shadow-sm" />
              </div>
           </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-4">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Manage Categories</h3>
           <div className="bg-white rounded-samsung border border-slate-100 shadow-sm divide-y divide-slate-50 overflow-hidden">
              {prefs.map((pref, i) => (
                <div key={pref.category} className="p-6 flex justify-between items-center active:bg-slate-50 transition-all cursor-pointer" onClick={() => togglePref(i)}>
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pref.enabled ? 'bg-blue-50 text-oneui-blue' : 'bg-slate-100 text-slate-300'}`}>
                         <i className={`fa-solid ${
                           pref.category === 'class' ? 'fa-video' :
                           pref.category === 'test' ? 'fa-file-invoice' :
                           pref.category === 'study' ? 'fa-brain' : 'fa-bullhorn'
                         }`}></i>
                      </div>
                      <span className={`font-bold text-sm ${pref.enabled ? 'text-slate-900' : 'text-slate-400'}`}>{pref.label}</span>
                   </div>
                   <div className={`w-10 h-6 rounded-full relative transition-colors ${pref.enabled ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${pref.enabled ? 'right-1' : 'left-1'}`} />
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Quiet Hours */}
        <div className="space-y-4">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Advanced</h3>
           <div className="bg-white p-6 rounded-samsung border border-slate-100 shadow-sm flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                    <i className="fa-solid fa-moon"></i>
                 </div>
                 <span className="font-bold text-sm text-slate-900">Quiet Hours</span>
              </div>
              <i className="fa-solid fa-chevron-right text-slate-200"></i>
           </div>
        </div>

        <div className="bg-slate-100 p-6 rounded-samsung border border-dashed border-slate-200">
           <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic text-center">
             Changing these settings only affects push alerts on this device. You will still see all updates in the Notification Center.
           </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
