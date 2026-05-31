
import React from 'react';
import { TimetableEntry, Profile } from '../../types';

interface TimetableProps {
  timetable: TimetableEntry[];
  profile: Profile | null;
  onSubjectClick: (id: string, tab?: 'CM' | 'TD' | 'TP' | 'Notes' | 'Tasks') => void;
}

const Timetable: React.FC<TimetableProps> = ({ timetable, profile, onSubjectClick }) => {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'];

  // Helper to determine row spans (2 hours = 4 slots of 30min)
  const getSlotIndex = (time: string) => timeSlots.indexOf(time);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top duration-700">
      <div className="flex flex-col items-center text-center space-y-2 mb-10">
        <h2 className="text-3xl font-black text-brand-400 uppercase tracking-tighter">Département {profile?.department || 'Génie Informatique'}</h2>
        <p className="text-slate-500 font-bold tracking-[0.4em] text-[10px] uppercase">Planning du 05/01/2026 au 10/01/2026</p>
        <span className="px-4 py-1 bg-brand-900/30 border border-brand-500/30 text-brand-300 rounded-full text-[10px] font-black uppercase tracking-widest mt-4">Niveau: {profile?.level || 'DUT 1'}</span>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden overflow-x-auto">
        <table className="w-full border-collapse min-w-[1000px]">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="w-20 p-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">H</th>
              {days.map(day => (
                <th key={day} className="p-4 text-center text-[11px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-800 border-l border-slate-800/50">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time, slotIdx) => (
              <tr key={time} className="h-10 group hover:bg-slate-800/10 transition-colors">
                <td className="p-2 text-[10px] font-black text-slate-600 border-b border-slate-800/30 tabular-nums">{time}</td>
                {days.map((day, dayIdx) => {
                  const dayNum = dayIdx + 1;
                  const entry = timetable.find(e => e.day === dayNum && e.start_time === time);
                  
                  if (entry) {
                    const rowSpan = entry.duration_minutes / 30;
                    return (
                      <td 
                        key={`${day}-${time}`} 
                        rowSpan={rowSpan} 
                        className="p-1 border border-slate-800 bg-slate-950/40 relative group/entry overflow-hidden cursor-pointer"
                        onClick={() => onSubjectClick(entry.subject_id, entry.type)}
                      >
                        <div className="h-full p-4 flex flex-col justify-center items-center text-center space-y-2 group-hover/entry:bg-brand-600/10 transition-all">
                          <h4 className="text-[11px] font-black text-brand-200 leading-tight uppercase tracking-tight">
                            {entry.subject_name}
                            <span className="ml-1 text-brand-500">{entry.type}</span>
                          </h4>
                          {entry.professor && <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{entry.professor}</p>}
                          {entry.location && <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-2 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-800">{entry.location}</p>}
                          <div className="absolute top-0 left-0 w-1 h-full bg-brand-500 opacity-30 group-hover/entry:opacity-100 transition-all"></div>
                        </div>
                      </td>
                    );
                  }

                  // Check if this slot is covered by a spanning entry
                  const isSpanned = timetable.some(e => {
                    if (e.day !== dayNum) return false;
                    const startIdx = getSlotIndex(e.start_time);
                    const endIdx = startIdx + (e.duration_minutes / 30);
                    return slotIdx > startIdx && slotIdx < endIdx;
                  });

                  if (isSpanned) return null;

                  return <td key={`${day}-${time}`} className="border-b border-r border-slate-800/20"></td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center space-x-12 pt-8">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-brand-600 rounded-sm"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cours Magistral (CM)</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 border border-brand-600 rounded-sm"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Travaux Dirigés (TD)</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-slate-800 rounded-sm"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Travaux Pratiques (TP)</span>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
