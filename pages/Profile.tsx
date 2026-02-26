
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
      <div className="bg-synapse-blue-light rounded-t-[40px] w-full max-w-[430px] mx-auto p-8 shadow-2xl animate-in slide-in-from-bottom duration-500 relative z-10 border-t border-white/50">
        <div className="w-12 h-1.5 bg-white/50 rounded-full mx-auto mb-8" />
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-synapse-text-primary tracking-tight">{title}</h2>
          <button onClick={onClose} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-synapse-text-secondary shadow-sm border border-white card-shadow">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

interface ProfileProps {
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [logoutConfig, setLogoutConfig] = useState<{ type: 'device' | 'all', isOpen: boolean } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const handleLogoutAction = async () => {
    if (!logoutConfig) return;
    setIsLoggingOut(true);

    try {
      if (logoutConfig.type === 'all') {
        // Simulate backend API call to revoke all sessions
        // await api.post('/auth/logout-all');
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
        // Simulate backend API call to unregister current device
        // await api.post('/auth/logout-device', { deviceId: 'S24U-9421' });
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      // Execute global logout state reset
      onLogout();
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please check your connection.");
    } finally {
      setIsLoggingOut(false);
      setLogoutConfig(null);
    }
  };

  const menuSection = (title: string, items: { label: string; value?: string; icon: string; action?: () => void; destructive?: boolean }[]) => (
    <div className="space-y-4">
      <h3 className="text-xs font-black text-synapse-text-secondary uppercase tracking-widest px-2">{title}</h3>
      <div className="bg-white rounded-samsung border border-white overflow-hidden shadow-sm divide-y divide-slate-50 card-shadow">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            disabled={isLoggingOut}
            className={`w-full flex items-center gap-4 p-5 text-left active:bg-slate-50 transition-colors disabled:opacity-50 ${item.destructive ? 'text-red-600' : 'text-synapse-text-primary'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${item.destructive ? 'bg-red-50' : 'bg-slate-50 text-synapse-text-secondary'}`}>
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-black">{item.label}</p>
              {item.value && <p className="text-[10px] font-bold text-synapse-text-secondary uppercase tracking-wider">{item.value}</p>}
            </div>
            {!item.destructive && <i className="fa-solid fa-chevron-right text-[10px] text-slate-200"></i>}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pb-40 bg-synapse-blue-light min-h-screen">
      {/* Header */}
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <h1 className="text-4xl font-light text-synapse-text-primary leading-tight">My<br/><span className="font-bold">Profile</span></h1>
      </div>

      <div className="px-5 space-y-8 -mt-4">
        {/* Profile Card */}
        <div className="bg-white rounded-samsung p-8 shadow-sm border border-white flex flex-col items-center text-center space-y-6 card-shadow">
          <div className="relative group">
            <img src="https://i.pravatar.cc/150?u=sarah" className="w-32 h-32 rounded-full border-4 border-synapse-blue-primary p-1 shadow-xl" alt="Profile" />
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-synapse-blue-primary text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg active:scale-90">
              <i className="fa-solid fa-camera text-sm"></i>
            </button>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-black text-synapse-text-primary">{studentData.name}</h2>
              <i className="fa-solid fa-circle-check text-synapse-blue-primary text-sm"></i>
            </div>
            <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest mt-1">ID: {studentData.id}</p>
          </div>
          <div className="flex gap-4 w-full pt-4">
            <div className="flex-1 bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
              <p className="text-lg font-black text-synapse-text-primary">{studentData.accuracy}%</p>
              <p className="text-[8px] font-black text-synapse-text-secondary uppercase tracking-widest">Accuracy</p>
            </div>
            <div className="flex-1 bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
              <p className="text-lg font-black text-synapse-text-primary">#{studentData.rank}</p>
              <p className="text-[8px] font-black text-synapse-text-secondary uppercase tracking-widest">Global Rank</p>
            </div>
            <div className="flex-1 bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
              <p className="text-lg font-black text-synapse-text-primary">{studentData.streak}d</p>
              <p className="text-[8px] font-black text-synapse-text-secondary uppercase tracking-widest">Streak</p>
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
           <h3 className="text-xs font-black text-synapse-text-secondary uppercase tracking-widest px-2">Expert & Awards</h3>
           <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              <div className="min-w-[160px] bg-white p-5 rounded-samsung border border-white flex flex-col gap-3 card-shadow">
                 <div className="w-10 h-10 bg-synapse-blue-primary/10 rounded-xl flex items-center justify-center text-synapse-blue-primary shadow-sm">
                    <i className="fa-solid fa-user-doctor"></i>
                 </div>
                 <p className="text-[9px] font-black text-synapse-blue-primary uppercase tracking-widest">Next Appointment</p>
                 <p className="text-xs font-bold text-synapse-text-primary">Dr. Anand Sharma • Oct 25</p>
              </div>
              <div className="min-w-[160px] bg-white p-5 rounded-samsung border border-white flex flex-col gap-3 card-shadow">
                 <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-100">
                    <i className="fa-solid fa-award"></i>
                 </div>
                 <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Scholarship Status</p>
                 <p className="text-xs font-bold text-synapse-text-primary">Top 3 Ranker (Sep)</p>
              </div>
           </div>
        </div>

        {menuSection('Support', [
          { label: 'Help & Support', icon: 'fa-circle-question' },
          { label: 'Terms & Privacy', icon: 'fa-file-shield' },
        ])}

        {/* Destructive Section */}
        {menuSection('Account Actions', [
          { label: 'Logout from this device', icon: 'fa-right-from-bracket', action: () => setLogoutConfig({ type: 'device', isOpen: true }), destructive: true },
          { label: 'Logout from all devices', icon: 'fa-power-off', action: () => setLogoutConfig({ type: 'all', isOpen: true }), destructive: true },
        ])}

        <div className="text-center pt-4 opacity-30">
           <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest">MedAI LMS v2.4.0 (S24U Build)</p>
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
                  <button key={l} onClick={() => setEditingField(null)} className="h-16 px-6 bg-white rounded-2xl text-left font-bold text-synapse-text-primary flex items-center justify-between border-2 border-transparent active:border-synapse-blue-primary active:bg-synapse-blue-primary/5 card-shadow">
                    {l}
                    {l === studentData.level && <i className="fa-solid fa-check text-synapse-blue-primary"></i>}
                  </button>
                ))}
             </div>
           )}
           {editingField === 'goal' && (
             <div className="space-y-8 py-4">
                <div className="text-center">
                   <p className="text-5xl font-black text-synapse-text-primary">4 <span className="text-xl">Hrs</span></p>
                   <p className="text-[10px] font-black text-synapse-text-secondary uppercase tracking-widest mt-2">Daily Study Commitment</p>
                </div>
                <input type="range" className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-synapse-blue-primary" min="1" max="12" />
                <button onClick={() => setEditingField(null)} className="w-full h-16 bg-synapse-blue-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all">Save Changes</button>
             </div>
           )}
           {editingField !== 'level' && editingField !== 'goal' && (
             <div className="space-y-4">
               <p className="text-sm text-synapse-text-secondary font-medium">Please enter your updated {editingField}.</p>
               <input type="text" className="w-full h-16 px-5 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-synapse-blue-primary/10 font-bold text-synapse-text-primary shadow-inner" placeholder={`Update ${editingField}`} />
               <button onClick={() => setEditingField(null)} className="w-full h-16 bg-synapse-blue-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all">Update Profile</button>
             </div>
           )}
        </div>
      </BottomSheet>

      {/* Logout Confirmation Modal */}
      {logoutConfig?.isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-8 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-samsung p-8 w-full max-w-[340px] text-center space-y-6 shadow-2xl animate-in zoom-in duration-300 card-shadow border border-white">
              <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl shadow-inner ${logoutConfig.type === 'all' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                 <i className={`fa-solid ${logoutConfig.type === 'all' ? 'fa-power-off' : 'fa-right-from-bracket'}`}></i>
              </div>
              <div className="space-y-2">
                 <h2 className="text-2xl font-black text-synapse-text-primary tracking-tight">
                    {logoutConfig.type === 'all' ? 'Logout Everywhere?' : 'Logout?'}
                 </h2>
                 <p className="text-sm text-synapse-text-secondary font-medium leading-relaxed px-4">
                    {logoutConfig.type === 'all' 
                      ? 'This will end all active sessions across your phone, tablet, and web. You will need to re-verify your device.' 
                      : 'You will be logged out from this device only. Your study progress is safe.'}
                 </p>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                 <button 
                   onClick={handleLogoutAction}
                   disabled={isLoggingOut}
                   className={`w-full h-16 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 ${logoutConfig.type === 'all' ? 'bg-red-600 shadow-red-200' : 'bg-synapse-blue-primary shadow-synapse-blue-primary/20'}`}
                 >
                   {isLoggingOut ? (
                     <i className="fa-solid fa-spinner fa-spin"></i>
                   ) : (
                     logoutConfig.type === 'all' ? 'Logout Everywhere' : 'Confirm Logout'
                   )}
                 </button>
                 <button 
                   onClick={() => setLogoutConfig(null)}
                   disabled={isLoggingOut}
                   className="w-full h-14 bg-slate-50 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all disabled:opacity-30"
                 >
                   Cancel
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
