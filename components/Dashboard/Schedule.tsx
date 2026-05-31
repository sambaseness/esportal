import React, { useState, useMemo, useEffect } from 'react';
import { TimetableEntry, Task, TaskNature, TaskCategory, AppConfig, ExamEntry, Profile } from '../../types';

interface ScheduleProps {
  timetable: TimetableEntry[];
  tasks: Task[];
  profile: Profile | null;
  setTasks: (tasks: Task[]) => void;
  openTaskModal: (data: Partial<Task>) => void;
  onSubjectClick?: (id: string, tab?: 'CM' | 'TD' | 'TP' | 'Notes' | 'Tasks') => void;
  appConfig: AppConfig;
  examSchedule: ExamEntry[];
}

interface DisplayEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: TaskCategory;
  isFixed: boolean;
  isCompleted: boolean;
  type: string;
  prof?: string;
  room?: string;
  hasDeadline?: boolean;
  dueDate?: string;
}

const Schedule: React.FC<ScheduleProps> = ({ timetable, tasks, profile, setTasks, openTaskModal, onSubjectClick, appConfig, examSchedule }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'exam'>('daily');
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 1); // 1-6
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const daysEng = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysFr = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const timeToMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const minutesToTime = (mins: number) => {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const getSlotIndex = (time: string) => timeSlots.indexOf(time);

  const finalDailySchedule = useMemo(() => {
    const fixedClasses: DisplayEvent[] = timetable
      .filter(e => e.day === selectedDay)
      .map(e => {
        const startMins = timeToMinutes(e.start_time);
        return {
          id: e.id,
          title: e.subject_name || 'Class',
          startTime: e.start_time,
          endTime: minutesToTime(startMins + e.duration_minutes),
          category: 'SCHOOL',
          isFixed: true,
          isCompleted: false,
          type: e.type,
          prof: e.professor,
          room: e.location
        };
      });

    const dayTasks = tasks.filter(t => !t.completed); 
    const placedEvents: DisplayEvent[] = [...fixedClasses];

    const sortedTasks = [...dayTasks].sort((a, b) => {
      const aTime = a.preferred_start_time || '08:00';
      const bTime = b.preferred_start_time || '08:00';
      return timeToMinutes(aTime) - timeToMinutes(bTime);
    });

    sortedTasks.forEach(task => {
      let currentStartMins = timeToMinutes(task.preferred_start_time || '08:00');
      const duration = task.nature === 'instant' ? 15 : (task.duration_minutes || 60);
      let placed = false;
      let safetyCounter = 0;

      while (!placed && safetyCounter < 50) {
        safetyCounter++;
        const currentEndMins = currentStartMins + duration;
        const conflict = placedEvents.find(event => {
          const eStart = timeToMinutes(event.startTime);
          const eEnd = timeToMinutes(event.endTime);
          return (currentStartMins < eEnd && currentEndMins > eStart);
        });

        if (conflict) {
          currentStartMins = timeToMinutes(conflict.endTime);
        } else {
          placedEvents.push({
            id: task.id,
            title: task.title,
            startTime: minutesToTime(currentStartMins),
            endTime: minutesToTime(currentEndMins),
            category: task.category,
            isFixed: false,
            isCompleted: task.completed,
            type: task.nature.toUpperCase(),
            hasDeadline: task.has_deadline,
            dueDate: task.due_date
          });
          placed = true;
        }
      }
    });

    return placedEvents.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  }, [selectedDay, timetable, tasks]);

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getEventStyle = (event: DisplayEvent) => {
    const nowDay = currentTime.getDay() || 1;
    const nowMins = currentTime.getHours() * 60 + currentTime.getMinutes();
    const isActive = nowDay === selectedDay && 
                     nowMins >= timeToMinutes(event.startTime) && 
                     nowMins <= timeToMinutes(event.endTime);

    let bgColor = 'bg-slate-900/40';
    let borderColor = 'border-slate-800';

    if (isActive) {
      borderColor = 'border-brand-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]';
      bgColor = 'bg-brand-900/20';
    }

    if (event.hasDeadline && event.dueDate) {
      const deadline = new Date(event.dueDate).getTime();
      const current = currentTime.getTime();
      const diff = deadline - current;
      const window = 48 * 60 * 60 * 1000;
      const urgency = Math.max(0, Math.min(1, 1 - (diff / window)));
      
      if (urgency > 0) {
        return {
          backgroundColor: `rgba(${Math.floor(15 + urgency * 210)}, ${Math.floor(23 - urgency * 10)}, ${Math.floor(42 - urgency * 20)}, ${0.4 + urgency * 0.4})`,
          borderColor: urgency > 0.5 ? `rgba(244, 63, 94, ${urgency})` : borderColor,
          isActive
        };
      }
    }

    return { backgroundColor: undefined, borderColor: undefined, isActive, className: `${bgColor} ${borderColor}` };
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in duration-500">
      {/* View Switcher Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex items-center shadow-xl">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center space-x-2 ${viewMode === 'daily' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <span className="material-symbols-outlined text-sm">view_day</span>
            <span>Journalier</span>
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center space-x-2 ${viewMode === 'weekly' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <span className="material-symbols-outlined text-sm">calendar_view_week</span>
            <span>Timetable</span>
          </button>
          {appConfig.showExamTab && (
            <button
              onClick={() => setViewMode('exam')}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center space-x-2 ${viewMode === 'exam' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <span className="material-symbols-outlined text-sm">assignment_late</span>
              <span>Examens</span>
            </button>
          )}
        </div>
      </div>

      {viewMode === 'daily' ? (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-16 flex flex-col items-center py-8 space-y-4 border-r border-slate-900">
            {daysEng.map((day, idx) => (
              <button
                key={day}
                onClick={() => setSelectedDay(idx + 1)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${selectedDay === idx + 1 ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-300'}`}
              >
                {day[0]}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col px-10 overflow-hidden">
            <header className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-4xl font-black text-white uppercase tracking-tight">{daysEng[selectedDay - 1]}</h1>
                <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mt-1">Live Student Feed</p>
              </div>
              <button 
                onClick={() => openTaskModal({})}
                className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-600 transition-all shadow-lg"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto pr-4 space-y-2 scrollbar-hide pb-20">
              {finalDailySchedule.map((event) => {
                const style = getEventStyle(event);
                return (
                  <div key={event.id} className="relative flex group">
                    <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-slate-900 z-0"></div>
                    <div className="relative z-10 w-8 flex justify-center pt-8">
                      <button 
                        onClick={() => !event.isFixed && toggleComplete(event.id)}
                        className={`w-8 h-8 rounded-full border-4 border-[#020617] flex items-center justify-center transition-all ${event.isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-900'}`}
                      >
                        {event.isCompleted && <span className="material-symbols-outlined text-[8px]">check</span>}
                        {style.isActive && !event.isCompleted && <div className="w-2 h-2 rounded-full bg-brand-500 animate-ping"></div>}
                      </button>
                    </div>

                    <div className="flex-1 ml-6 pb-6">
                      <div 
                        style={style.backgroundColor ? { backgroundColor: style.backgroundColor, borderColor: style.borderColor } : {}}
                        className={`p-8 rounded-2xl border transition-all ${style.className || ''} ${style.isActive ? 'scale-[1.02]' : ''}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-brand-400 text-[10px] font-black tabular-nums tracking-widest uppercase">{event.startTime}</span>
                              {style.isActive && <span className="text-[8px] font-black bg-brand-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">En Cours</span>}
                            </div>
                            <h3 className="text-xl font-bold text-white tracking-tight mt-1">{event.title} {event.prof ? `(${event.type})` : ''}</h3>
                            <div className="flex items-center space-x-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!event.isFixed && (
                                <>
                                  <button onClick={() => toggleComplete(event.id)} className="text-slate-500 hover:text-emerald-400 transition-colors">
                                    <span className="material-symbols-outlined text-lg">done_all</span>
                                  </button>
                                  <button onClick={() => deleteTask(event.id)} className="text-slate-500 hover:text-rose-500 transition-colors">
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className="bg-slate-950 px-3 py-1 rounded-md text-[8px] font-black text-slate-500 tracking-widest border border-slate-800">{event.category}</span>
                            {event.hasDeadline && <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Urgent</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : viewMode === 'weekly' ? (
        /* Timetable Grid View */
        <div className="flex-1 overflow-y-auto pr-2 pb-20 animate-in fade-in slide-in-from-bottom duration-500">
          <div className="flex flex-col items-center text-center space-y-2 mb-10">
            <h2 className="text-3xl font-black text-brand-400 uppercase tracking-tighter">Département {profile?.department || 'Génie Informatique'}</h2>
            <p className="text-slate-500 font-bold tracking-[0.4em] text-[10px] uppercase">Planning du 02/03/2026 au 07/03/2026</p>
            <span className="px-4 py-1 bg-brand-900/30 border border-brand-500/30 text-brand-300 rounded-full text-[10px] font-black uppercase tracking-widest mt-4">Niveau: {profile?.level || 'DUT 1'}</span>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden overflow-x-auto">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="w-20 p-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">H</th>
                  {daysFr.map(day => (
                    <th key={day} className="p-4 text-center text-[11px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-800 border-l border-slate-800/50">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time, slotIdx) => (
                  <tr key={time} className="h-10 group hover:bg-slate-800/10 transition-colors">
                    <td className="p-2 text-[10px] font-black text-slate-600 border-b border-slate-800/30 tabular-nums">{time}</td>
                    {daysFr.map((day, dayIdx) => {
                      const dayNum = dayIdx + 1;
                      const entry = timetable.find(e => e.day === dayNum && e.start_time === time);
                      
                      if (entry) {
                        const rowSpan = entry.duration_minutes / 30;
                        return (
                          <td 
                            key={`${day}-${time}`} 
                            rowSpan={rowSpan} 
                            className="p-1 border border-slate-800 bg-slate-950/40 relative group/entry overflow-hidden cursor-pointer"
                            onClick={() => onSubjectClick?.(entry.subject_id, entry.type)}
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
      ) : (
        /* Exam View - Grid Structure */
        <div className="flex-1 overflow-y-auto pr-2 pb-20 animate-in fade-in slide-in-from-bottom duration-500">
          <div className="flex flex-col items-center text-center space-y-2 mb-10">
            <h2 className="text-3xl font-black text-rose-400 uppercase tracking-tighter">Calendrier des Examens</h2>
            <p className="text-slate-500 font-bold tracking-[0.4em] text-[10px] uppercase">Session de Contrôle Continu - Mars 2026</p>
            <span className="px-4 py-1 bg-rose-900/30 border border-rose-500/30 text-rose-300 rounded-full text-[10px] font-black uppercase tracking-widest mt-4">Période d'évaluation</span>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden overflow-x-auto">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="w-20 p-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">H</th>
                  {Array.from(new Set(examSchedule.map(e => e.date))).sort().map((date: any) => (
                    <th key={date} className="p-4 text-center text-[11px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-800 border-l border-slate-800/50">
                      {new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time, slotIdx) => (
                  <tr key={time} className="h-10 group hover:bg-slate-800/10 transition-colors">
                    <td className="p-2 text-[10px] font-black text-slate-600 border-b border-slate-800/30 tabular-nums">{time}</td>
                    {Array.from(new Set(examSchedule.map(e => e.date))).sort().map((date: any) => {
                      const entry = examSchedule.find(e => e.date === date && e.start_time === time);
                      
                      if (entry) {
                        const rowSpan = entry.duration_minutes / 30;
                        return (
                          <td 
                            key={`${date}-${time}`} 
                            rowSpan={rowSpan} 
                            className="p-1 border border-slate-800 bg-rose-950/20 relative group/entry overflow-hidden cursor-pointer"
                          >
                            <div className="h-full p-4 flex flex-col justify-center items-center text-center space-y-2 group-hover/entry:bg-rose-600/10 transition-all">
                              <h4 className="text-[11px] font-black text-rose-200 leading-tight uppercase tracking-tight">
                                {entry.subject_name}
                                <span className="ml-1 text-rose-500">{entry.type}</span>
                              </h4>
                              <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-2 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-800">{entry.location}</p>
                              <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 opacity-30 group-hover/entry:opacity-100 transition-all"></div>
                            </div>
                          </td>
                        );
                      }

                      const isSpanned = examSchedule.some(e => {
                        if (e.date !== date) return false;
                        const startIdx = getSlotIndex(e.start_time);
                        const endIdx = startIdx + (e.duration_minutes / 30);
                        return slotIdx > startIdx && slotIdx < endIdx;
                      });

                      if (isSpanned) return null;

                      return <td key={`${date}-${time}`} className="border-b border-r border-slate-800/20"></td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;