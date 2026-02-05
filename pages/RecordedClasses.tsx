
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_DATA = [
  {
    id: 's1',
    subject: 'Physiology',
    topics: [
      {
        id: 't1',
        title: 'Renal Physiology',
        recordings: [
          { id: 'v1', title: 'Glomerular Filtration Dynamics', duration: '45:22', expiry: '48h', isExpired: false, watched: true },
          { id: 'v2', title: 'Tubular Reabsorption', duration: '38:10', expiry: '72h', isExpired: false, watched: false },
          { id: 'v3', title: 'Renal Hormones (Legacy)', duration: '24:15', expiry: 'Expired', isExpired: true, watched: true },
        ]
      },
      {
        id: 't2',
        title: 'Nerve-Muscle Physiology',
        recordings: [
          { id: 'v4', title: 'Membrane Potential Basics', duration: '1:12:00', expiry: '12h', isExpired: false, watched: true },
        ]
      }
    ]
  },
  {
    id: 's2',
    subject: 'Biochemistry',
    topics: [
      {
        id: 't3',
        title: 'Enzymology',
        recordings: [
          { id: 'v5', title: 'Michaelis-Menten Kinetics', duration: '55:30', expiry: '6d', isExpired: false, watched: false },
        ]
      }
    ]
  }
];

const RecordedClasses: React.FC = () => {
  const navigate = useNavigate();
  const [activeSubject, setActiveSubject] = useState(MOCK_DATA[0].id);

  const selectedData = MOCK_DATA.find(s => s.id === activeSubject);

  return (
    <div className="pb-40 bg-oneui-bg min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 -ml-2 text-slate-500 mb-2">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="text-4xl font-light text-slate-900 leading-tight">Video<br/><span className="font-bold">Archive</span></h1>
      </div>

      <div className="px-5 space-y-8 -mt-4">
        {/* Subject Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
           {MOCK_DATA.map(s => (
             <button
               key={s.id}
               onClick={() => setActiveSubject(s.id)}
               className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                 activeSubject === s.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'
               }`}
             >
               {s.subject}
             </button>
           ))}
        </div>

        {/* Topics and Sessions */}
        <div className="space-y-10">
          {selectedData?.topics.map((topic) => (
            <div key={topic.id} className="space-y-4">
               <div className="flex justify-between items-center px-2">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{topic.title}</h3>
                  <span className="text-[10px] font-bold text-slate-300">{topic.recordings.length} Sessions</span>
               </div>
               
               <div className="space-y-3">
                  {topic.recordings.map((rec) => (
                    <div 
                      key={rec.id}
                      onClick={() => !rec.isExpired && navigate(`/video/${rec.id}`)}
                      className={`bg-white p-5 rounded-samsung border flex items-center gap-5 transition-all shadow-sm ${
                        rec.isExpired ? 'opacity-50 grayscale cursor-not-allowed' : 'active:scale-95 cursor-pointer'
                      }`}
                    >
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${
                         rec.isExpired ? 'bg-slate-100 text-slate-300' : 'bg-blue-50 text-oneui-blue'
                       }`}>
                          <i className={`fa-solid ${rec.isExpired ? 'fa-video-slash' : 'fa-play'}`}></i>
                       </div>
                       
                       <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                             <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                               rec.isExpired ? 'bg-slate-200 text-slate-500 border-slate-300' : 
                               rec.expiry === '12h' ? 'bg-red-50 text-red-500 border-red-100 animate-pulse' : 'bg-emerald-50 text-emerald-500 border-emerald-100'
                             }`}>
                                {rec.isExpired ? 'Expired' : `Expires in ${rec.expiry}`}
                             </span>
                             {rec.watched && <i className="fa-solid fa-circle-check text-oneui-blue text-[10px]"></i>}
                          </div>
                          <h4 className="font-black text-slate-900 leading-tight">{rec.title}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{rec.duration} • HQ Recording</p>
                       </div>
                       
                       <div className="flex flex-col items-center gap-1 opacity-20">
                          <i className="fa-solid fa-cloud-arrow-down text-sm"></i>
                          <span className="text-[8px] font-black">NA</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          ))}
        </div>

        {/* Access Info Nudge */}
        <div className="bg-slate-900 p-8 rounded-[32px] text-white space-y-4">
           <div className="flex items-center gap-4">
              <i className="fa-solid fa-circle-info text-oneui-blue"></i>
              <h4 className="font-bold">About Video Access</h4>
           </div>
           <p className="text-xs font-medium opacity-70 leading-relaxed">
             Recordings are available for a limited time (48-72 hours) post-upload for security reasons. Download is disabled for DRM protection.
           </p>
        </div>
      </div>
    </div>
  );
};

export default RecordedClasses;
