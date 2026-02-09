
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface EditSheetProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BottomSheet: React.FC<EditSheetProps> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="bg-oneui-surface rounded-t-[40px] w-full max-w-[430px] mx-auto p-8 shadow-2xl animate-in slide-in-from-bottom duration-500 relative z-10">
        <div className="w-12 h-1.5 bg-oneui-border rounded-full mx-auto mb-8" />
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-oneui-text-primary tracking-tight">{title}</h2>
          <button onClick={onClose} className="w-10 h-10 bg-oneui-bg rounded-full flex items-center justify-center text-oneui-text-secondary">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [editingField, setEditingField] = useState<string | null>(null);

  const studentData = {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.j@meduniv.edu',
    phone: '+91 98765 43210',
    id: 'MED-9421-S24U',
    exam: 'NEET PG',
    year: '2025',
    level: 'Intern',
    college: 'AIMS Medical College',
    accuracy: 78,
    rank: 1242,
    percentile: 98.4,
    streak: 12,
    subscription: 'Pro Member',
    expiry: '24 Oct 2024'
  };

  const menuSection = (title: string, items: { label: string; value?: string; icon: string; action?: () => void; destructive?: boolean }[]) => (
    <div className="space-y-4">
      <h3 className="text-xs font-black text-oneui-text-secondary uppercase tracking-widest px-2">{title}</h3>
      <div className="bg-oneui-surface rounded-samsung border border-oneui-border overflow-hidden shadow-sm divide-y divide-oneui-border">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className={`w-full flex items-center gap-4 p-5 text-left active:bg-oneui-bg transition-colors ${item.destructive ? 'text-red-600' : 'text-oneui-text-primary'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${item.destructive ? 'bg-red-50' : 'bg-oneui-bg text-oneui-text-secondary'}`}>
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-black">{item.label}</p>
              {item.value && <p className="text-[10px] font-bold text-oneui-text-secondary uppercase tracking-wider">{item.value}</p>}
            </div>
            {!item.destructive && <i className="fa-solid fa-chevron-right text-[10px] text-oneui-border"></i>}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pb-40 bg-oneui-bg min-h-screen">
      {/* Header */}
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <h1 className="text-4xl font-light text-oneui-text-primary leading-tight">My<br/><span className="font-bold">Profile</span></h1>
      </div>

      <div className="px-5 space-y-8 -mt-4">
        {/* Profile Card */}
        <div className="bg-oneui-surface rounded-samsung p-8 shadow-sm border border-oneui-border flex flex-col items-center text-center space-y-6">
          <div className="relative group">
            <img src="https://i.pravatar.cc/150?u=sarah" className="w-32 h-32 rounded-full border-4 border-oneui-blue p-1 shadow-xl" alt="Profile" />
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-oneui-blue text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg active:scale-90">
              <i className="fa-solid fa-camera text-sm"></i>
            </button>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-black text-oneui-text-primary">{studentData.name}</h2>
              <i className="fa-solid fa-circle-check text-oneui-blue text-sm"></i>
            </div>
            <p className="text-[10px] font-black text-oneui-text-secondary uppercase tracking-widest mt-1">ID: {studentData.id}</p>
          </div>
          <div className="flex gap-4 w-full pt-4">
            <div className="flex-1 bg-oneui-bg p-3 rounded-2xl text-center">
              <p className="text-lg font-black text-oneui-text-primary">{studentData.accuracy}%</p>
              <p className="text-[8px] font-black text-oneui-text-secondary uppercase tracking-widest">Accuracy</p>
            </div>
            <div className="flex-1 bg-oneui-bg p-3 rounded-2xl text-center">
              <p className="text-lg font-black text-oneui-text-primary">#{studentData.rank}</p>
              <p className="text-[8px] font-black text-oneui-text-secondary uppercase tracking-widest">Global Rank</p>
            </div>
            <div className="flex-1 bg-oneui-bg p-3 rounded-2xl text-center">
              <p className="text-lg font-black text-oneui-text-primary">{studentData.streak}d</p>
              <p className="text-[8px] font-black text-oneui-text-secondary uppercase tracking-widest">Streak</p>
            </div>
          </div>
        </div>

        {/* Sections */}
        {menuSection('Account Information', [
          { label: 'Verified Email', value: studentData.email, icon: 'fa-envelope' },
          { label: 'Mobile Number', value: studentData.phone, icon: 'fa-phone' },
          { label: 'Security & Device', value: 'Galaxy S24 Ultra • Last Login 2h ago', icon: 'fa-shield-halved', action: () => setEditingField('security') },
        ])}

        {menuSection('Academic Profile', [
          { label: 'Target Exam', value: studentData.exam, icon: 'fa-graduation-cap', action: () => setEditingField('exam') },
          { label: 'Attempt Year', value: studentData.year, icon: 'fa-calendar-check', action: () => setEditingField('year') },
          { label: 'Academic Level', value: studentData.level, icon: 'fa-user-doctor', action: () => setEditingField('level') },
          { label: 'College', value: studentData.college, icon: 'fa-building-columns', action: () => setEditingField('college') },
        ])}

        {menuSection('Subscription', [
          { label: 'Plan Details', value: `${studentData.subscription} • Expires ${studentData.expiry}`, icon: 'fa-crown' },
          { label: 'Upgrade Membership', value: 'Unlock AI 2.0 & Mentor Sessions', icon: 'fa-gem', action: () => navigate('/courses') },
        ])}

        {menuSection('Preferences', [
          { label: 'Daily Study Goal', value: '4 Hours', icon: 'fa-clock', action: () => setEditingField('goal') },
          { label: 'Push Notifications', value: 'Enabled', icon: 'fa-bell', action: () => navigate('/notification-settings') },
          { label: 'Difficulty Focus', value: 'Medium', icon: 'fa-bolt', action: () => setEditingField('difficulty') },
        ])}

        {/* Expert & Achievements */}
        <div className="space-y-4">
           <h3 className="text-xs font-black text-oneui-text-secondary uppercase tracking-widest px-2">Expert & Awards</h3>
           <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              <div className="min-w-[160px] bg-indigo-50 p-5 rounded-samsung border border-indigo-100 flex flex-col gap-3">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-oneui-blue shadow-sm">
                    <i className="fa-solid fa-user-doctor"></i>
                 </div>
                 <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Next Appointment</p>
                 <p className="text-xs font-bold text-slate-800">Dr. Anand Sharma • Oct 25</p>
              </div>
              <div className="min-w-[160px] bg-amber-50 p-5 rounded-samsung border border-amber-100 flex flex-col gap-3">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
                    <i className="fa-solid fa-award"></i>
                 </div>
                 <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Scholarship Status</p>
                 <p className="text-xs font-bold text-slate-800">Top 3 Ranker (Sep)</p>
              </div>
           </div>
        </div>

        {menuSection('Support', [
          { label: 'Help & Support', icon: 'fa-circle-question' },
          { label: 'Terms & Privacy', icon: 'fa-file-shield' },
        ])}

        {/* Destructive Section */}
        {menuSection('Account Actions', [
          { label: 'Logout from this device', icon: 'fa-right-from-bracket', action: () => {}, destructive: true },
          { label: 'Logout from all devices', icon: 'fa-power-off', action: () => {}, destructive: true },
        ])}

        <div className="text-center pt-4 opacity-30">
           <p className="text-[10px] font-black text-oneui-text-secondary uppercase tracking-widest">MedAI LMS v2.4.0 (S24U Build)</p>
        </div>
      </div>

      {/* Bottom Sheets for Editing */}
      <BottomSheet 
        title={`Edit ${editingField?.charAt(0).toUpperCase()}${editingField?.slice(1)}`}
        isOpen={!!editingField}
        onClose={() => setEditingField(null)}
      >
        <div className="space-y-6 pb-10">
           {editingField === 'level' && (
             <div className="grid grid-cols-1 gap-3">
                {['UG Student', 'Intern', 'PG Aspirant', 'Doctor'].map(l => (
                  <button key={l} onClick={() => setEditingField(null)} className="h-16 px-6 bg-oneui-bg rounded-2xl text-left font-bold text-oneui-text-primary flex items-center justify-between border-2 border-transparent active:border-oneui-blue active:bg-blue-50">
                    {l}
                    {l === studentData.level && <i className="fa-solid fa-check text-oneui-blue"></i>}
                  </button>
                ))}
             </div>
           )}
           {editingField === 'goal' && (
             <div className="space-y-8 py-4">
                <div className="text-center">
                   <p className="text-5xl font-black text-oneui-text-primary">4 <span className="text-xl">Hrs</span></p>
                   <p className="text-[10px] font-black text-oneui-text-secondary uppercase tracking-widest mt-2">Daily Study Commitment</p>
                </div>
                <input type="range" className="w-full h-2 bg-oneui-bg rounded-full appearance-none accent-oneui-blue" min="1" max="12" />
                <button onClick={() => setEditingField(null)} className="w-full h-16 bg-oneui-blue text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100">Save Changes</button>
             </div>
           )}
           {editingField !== 'level' && editingField !== 'goal' && (
             <div className="space-y-4">
               <p className="text-sm text-oneui-text-secondary font-medium">Please enter your updated {editingField}.</p>
               <input type="text" className="w-full h-16 px-5 bg-oneui-bg border border-oneui-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-oneui-blue font-bold text-oneui-text-primary" placeholder={`Update ${editingField}`} />
               <button onClick={() => setEditingField(null)} className="w-full h-16 bg-oneui-blue text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100">Update Profile</button>
             </div>
           )}
        </div>
      </BottomSheet>
    </div>
  );
};

export default Profile;
