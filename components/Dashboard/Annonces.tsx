
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Announcement, Task } from '../../types';

interface AnnoncesProps {
  tasks: Task[];
  openTaskModal: (data: Partial<Task>) => void;
}

const Annonces: React.FC<AnnoncesProps> = ({ tasks, openTaskModal }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
    const channel = supabase.channel('public:announcements').on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => fetchAnnouncements()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    if (!error) setAnnouncements(data || []);
    setLoading(false);
  };

  const convertToTask = (item: Announcement) => {
    openTaskModal({
      title: `Task: ${item.title}`,
      description: item.content,
      category: 'SCHOOL',
      has_deadline: item.priority === 'urgent' || item.priority === 'high',
      due_date: new Date().toISOString().split('T')[0]
    });
  };

  const getBadgeStyle = (priority: string, category: string) => {
    if (priority === 'urgent' || priority === 'high') return 'bg-rose-950/40 text-rose-500 border-rose-500/20';
    if (category.toLowerCase().includes('social')) return 'bg-brand-950/40 text-brand-400 border-indigo-500/20';
    return 'bg-slate-800 text-slate-400 border-slate-700';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-32">
      <div className="flex flex-col space-y-2 mb-12">
        <h2 className="text-sm font-black text-slate-600 uppercase tracking-[0.5em]">Unofficial feeds</h2>
        <p className="text-white text-3xl font-black tracking-tight uppercase">Announcements</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-bold uppercase tracking-widest text-[9px]">Refreshing Feed...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {announcements.map((item) => {
            const author = { name: item.category.includes('admin') ? 'Admin (Prof. Faye)' : 'Class Rep', initial: item.category[0] };
            return (
              <div key={item.id} className="bg-[#0f172a] rounded-[2rem] border border-slate-800/50 shadow-2xl transition-all hover:border-slate-700">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-900/30 flex items-center justify-center text-indigo-400 font-black border border-indigo-500/20">{author.initial}</div>
                      <div>
                        <h4 className="text-sm font-black text-indigo-400">{author.name}</h4>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">{new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getBadgeStyle(item.priority, item.category)}`}>
                      {item.priority === 'urgent' ? 'IMPORTANT' : item.category}
                    </span>
                  </div>
                  <div className="space-y-4 mb-10">
                    <h3 className="text-2xl font-black text-white leading-tight">{item.title}</h3>
                    <p className="text-slate-400 text-base leading-relaxed font-medium">{item.content}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button onClick={() => convertToTask(item)} className="px-6 py-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center space-x-3 transition-all text-slate-200">
                      <span className="material-symbols-outlined text-lg">assignment_add</span>
                      <span className="text-[11px] font-black uppercase tracking-widest">Convert to Task</span>
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all text-slate-500 hover:text-indigo-400">
                      <span className="material-symbols-outlined">share</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Annonces;
