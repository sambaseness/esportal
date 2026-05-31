
import React, { useState } from 'react';
import { Task, TaskNature, TaskCategory } from '../../types';

interface TaskModalProps {
  initialData: Partial<Task>;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ initialData, onClose, onSave }) => {
  const [form, setForm] = useState<Partial<Task>>({
    title: initialData.title || '',
    description: initialData.description || '',
    nature: initialData.nature || 'instant',
    category: initialData.category || 'GENERAL',
    preferred_start_time: initialData.preferred_start_time || '12:00',
    duration_minutes: initialData.duration_minutes || 30,
    recurrence_days: initialData.recurrence_days || 1,
    has_deadline: initialData.has_deadline || false,
    due_date: initialData.due_date || new Date().toISOString().split('T')[0],
    subject_id: initialData.subject_id
  });

  const handleSave = () => {
    if (!form.title) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: form.title!,
      description: form.description,
      nature: form.nature as TaskNature,
      category: form.category as TaskCategory,
      preferred_start_time: form.preferred_start_time,
      duration_minutes: form.duration_minutes,
      recurrence_days: form.recurrence_days,
      has_deadline: form.has_deadline,
      due_date: form.has_deadline ? form.due_date : undefined,
      completed: false,
      priority: 1,
      subject_id: form.subject_id
    };
    onSave(newTask);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] w-full max-w-2xl p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
        <header className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Configure Task</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[60vh] pr-4 scrollbar-hide">
          <div className="md:col-span-2 space-y-4">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Title</label>
            <input 
              type="text" 
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:border-brand-500 transition-all font-bold"
              placeholder="e.g., Learning Flutter"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Category</label>
            <select 
               className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:border-brand-500 transition-all font-bold"
               value={form.category}
               onChange={e => setForm({...form, category: e.target.value as TaskCategory})}
            >
              <option value="GENERAL">General</option>
              <option value="PERSONAL">Personal</option>
              <option value="RELIGIOUS">Religious</option>
              <option value="SCHOOL">School</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Start Time</label>
            <input 
              type="time" 
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold"
              value={form.preferred_start_time}
              onChange={e => setForm({...form, preferred_start_time: e.target.value})}
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Deadline Mode</label>
            <div 
              onClick={() => setForm({...form, has_deadline: !form.has_deadline})}
              className={`w-full p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${form.has_deadline ? 'bg-rose-900/20 border-rose-500/50 text-rose-500' : 'bg-slate-950 border-slate-800 text-slate-600'}`}
            >
              <span className="text-[11px] font-black uppercase tracking-widest">Hard Deadline</span>
              <span className="material-symbols-outlined">{form.has_deadline ? 'toggle_on' : 'toggle_off'}</span>
            </div>
          </div>

          {form.has_deadline && (
            <div className="space-y-4 animate-in slide-in-from-left">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Due Date</label>
              <input 
                type="date" 
                className="w-full p-4 bg-slate-950 border border-rose-500/30 rounded-2xl text-white outline-none focus:border-rose-500 transition-all font-bold"
                value={form.due_date}
                onChange={e => setForm({...form, due_date: e.target.value})}
              />
            </div>
          )}

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Nature</label>
            <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800">
              <button 
                onClick={() => setForm({...form, nature: 'instant'})}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${form.nature === 'instant' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
              >Instant</button>
              <button 
                onClick={() => setForm({...form, nature: 'duration'})}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${form.nature === 'duration' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
              >Duration</button>
            </div>
          </div>

          {form.nature === 'duration' && (
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Duration (Mins)</label>
              <input 
                type="number" 
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-white font-bold"
                value={form.duration_minutes}
                onChange={e => setForm({...form, duration_minutes: Number(e.target.value)})}
              />
            </div>
          )}
        </div>

        <div className="pt-6">
           <button 
            onClick={handleSave}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-900/20"
           >
             Save Task
           </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
