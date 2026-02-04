
import React, { useState } from 'react';
import { CalendarEvent } from '../types';

const MOCK_EVENTS: CalendarEvent[] = [
  { id: '1', date: '2023-10-25', title: 'ECG Masterclass', type: 'class', time: '14:00' },
  { id: '2', date: '2023-10-27', title: 'Pharmacology Mock', type: 'test', time: '10:00' },
  { id: '3', date: '2023-10-25', title: 'Neuro Anatomy Rev', type: 'revision', time: '18:00' },
];

const Calendar: React.FC = () => {
  const [currentDate] = useState(new Date(2023, 9, 25)); // Mock October 25, 2023
  const [selectedDay, setSelectedDay] = useState(25);
  const [view, setView] = useState<'month' | 'week'>('month');

  const daysInMonth = 31;
  const startDay = 0; // Sun

  const dayEvents = MOCK_EVENTS.filter(e => e.date === `2023-10-${selectedDay.toString().padStart(2, '0')}`);

  const renderMonth = () => {
    const cells = [];
    for (let i = 0; i < startDay; i++) cells.push(<div key={`empty-${i}`} />);
    for (let d = 1; d <= daysInMonth; d++) {
      const isSelected = selectedDay === d;
      const dateStr = `2023-10-${d.toString().padStart(2, '0')}`;
      const hasEvents = MOCK_EVENTS.some(e => e.date === dateStr);
      
      cells.push(
        <button 
          key={d}
          onClick={() => setSelectedDay(d)}
          className={`aspect-square flex flex-col items-center justify-center gap-1 rounded-2xl transition-all relative ${
            isSelected ? 'bg-oneui-blue text-white shadow-lg' : 'hover:bg-slate-100 text-slate-800'
          }`}
        >
          <span className={`text-sm font-bold ${isSelected ? 'font-black' : ''}`}>{d}</span>
          {hasEvents && (
            <div className="flex gap-0.5">
               <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-oneui-blue'}`} />
            </div>
          )}
        </button>
      );
    }
    return cells;
  };

  return (
    <div className="pb-40 bg-oneui-bg min-h-screen">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <h1 className="text-4xl font-light text-slate-900 leading-tight">My<br/><span className="font-bold">Schedule</span></h1>
      </div>

      <div className="px-5 space-y-6 -mt-4">
        {/* View Switcher */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
           <button 
             onClick={() => setView('month')}
             className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'month' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
           >
             Month
           </button>
           <button 
             onClick={() => setView('week')}
             className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'week' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
           >
             Week
           </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-samsung p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="flex justify-between items-center px-2">
             <h3 className="font-black text-slate-900 text-lg">October 2023</h3>
             <div className="flex gap-4 text-slate-400">
                <button><i className="fa-solid fa-chevron-left"></i></button>
                <button><i className="fa-solid fa-chevron-right"></i></button>
             </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
             {['S','M','T','W','T','F','S'].map(d => (
               <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-2">{d}</div>
             ))}
             {renderMonth()}
          </div>
        </div>

        {/* Agenda */}
        <div className="space-y-4">
           <div className="flex justify-between items-center px-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Agenda • {selectedDay} Oct</h3>
           </div>

           <div className="space-y-3">
              {dayEvents.length > 0 ? dayEvents.map(event => (
                <div key={event.id} className="bg-white p-5 rounded-samsung border border-slate-100 flex items-center gap-5 active:scale-95 transition-all cursor-pointer">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${
                     event.type === 'class' ? 'bg-blue-50 text-oneui-blue' :
                     event.type === 'test' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'
                   }`}>
                      <i className={`fa-solid ${
                        event.type === 'class' ? 'fa-video' :
                        event.type === 'test' ? 'fa-file-invoice' : 'fa-rotate-right'
                      }`}></i>
                   </div>
                   <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{event.time} • {event.type}</p>
                      <h5 className="font-black text-slate-900">{event.title}</h5>
                   </div>
                   <button className="text-slate-200">
                      <i className="fa-solid fa-chevron-right text-xs"></i>
                   </button>
                </div>
              )) : (
                <div className="bg-white/50 border border-dashed border-slate-200 p-10 rounded-samsung text-center text-slate-400 italic text-sm">
                  No events scheduled for this day
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
