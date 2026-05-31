
import React from 'react';
import { ESP_VALEURS, ESP_SERMENT } from '../../constants.tsx';
import { Note, Task } from '../../types';

interface OverviewProps {
  notes: Note[];
  tasks: Task[];
}

const Overview: React.FC<OverviewProps> = ({ notes, tasks }) => {
  const activeTasks = tasks.filter(t => !t.completed).length;
  const deadlines = tasks.filter(t => !t.completed && t.due_date).length;

  const stats = [
    { label: 'Total Notes', value: notes.length, icon: 'description', color: 'bg-brand-600' },
    { label: 'Active Tasks', value: activeTasks, icon: 'checklist', color: 'bg-emerald-600' },
    { label: 'Deadlines', value: deadlines, icon: 'alarm', color: 'bg-rose-600' },
  ];

  return (
    <div className="space-y-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center space-x-6 hover:border-slate-700 transition-colors">
            <div className={`${stat.color} p-4 rounded-xl text-white shadow-lg`}>
              <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-3xl font-black text-white mt-1">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* ESP Social Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-100 flex items-center uppercase tracking-widest">
          <span className="material-symbols-outlined mr-3 text-brand-400">diversity_3</span>
          ESP Social
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Valeurs Card */}
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col group hover:border-brand-500/30 transition-all">
            <div className="bg-brand-600 p-6 text-white">
              <h4 className="text-xl font-bold uppercase tracking-tight">Valeurs Fondamentales</h4>
              <p className="text-brand-200 text-xs font-medium uppercase tracking-widest mt-1 opacity-70">Le socle polytechnicien</p>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {ESP_VALEURS.map((val, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 bg-slate-950 rounded-xl text-slate-300 font-medium text-sm border border-slate-800 group-hover:border-slate-700 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>
                  <span>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Serment Card */}
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col group hover:border-amber-500/30 transition-all">
            <div className="bg-amber-600 p-6 text-white">
              <h4 className="text-xl font-bold uppercase tracking-tight">Le Serment</h4>
              <p className="text-amber-200 text-xs font-medium uppercase tracking-widest mt-1 opacity-70">Engagement de l'Ingénieur</p>
            </div>
            <div className="p-8 flex-1 bg-slate-950/50">
              <blockquote className="italic text-slate-300 leading-relaxed text-lg whitespace-pre-line border-l-4 border-amber-500/50 pl-6 py-2">
                {ESP_SERMENT}
              </blockquote>
              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center text-amber-500 font-black text-xs uppercase tracking-[0.3em]">
                <span className="material-symbols-outlined mr-3">military_tech</span>
                Polytech Excellence
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
