import React, { useState, useEffect } from 'react';
import { DEFAULT_SUBJECTS, DEFAULT_MATERIALS } from '../../constants.tsx';
import { CourseMaterial, Note, Task, SubjectTab } from '../../types';
import { supabase } from '../../supabase';

interface SubjectDetailProps {
  subjectId: string;
  onBack: () => void;
  notes: Note[];
  setNotes: (val: Note[]) => void;
  tasks: Task[];
  setTasks: (val: Task[]) => void;
  initialTab?: SubjectTab;
  openTaskModal: (data: Partial<Task>) => void;
  userRole?: string;
}

const SubjectDetail: React.FC<SubjectDetailProps> = ({ 
  subjectId, 
  onBack, 
  notes, 
  setNotes, 
  tasks, 
  setTasks, 
  initialTab, 
  openTaskModal,
  userRole = 'user'
}) => {
  const subject = DEFAULT_SUBJECTS.find(s => s.id === subjectId);
  const materials = DEFAULT_MATERIALS[subjectId] || { cm: [], td: [], tp: [] };
  const [activeTab, setActiveTab] = useState<SubjectTab>(initialTab || 'CM');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteForm, setNoteForm] = useState({ title: '', content: '', tags: [] as string[] });
  
  const isAdmin = userRole === 'admin' || userRole === 'super-admin';

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab, subjectId]);

  if (!subject) return <div className="p-10 text-center text-slate-500">Subject not found.</div>;

  const currentMaterials = activeTab === 'CM' ? materials.cm : activeTab === 'TD' ? materials.td : activeTab === 'TP' ? materials.tp : [];
  const subjectNotes = notes.filter(n => n.tags.includes(subject.code) || n.tags.includes(subject.name));
  const subjectTasks = tasks.filter(t => t.subject_id === subject.id);

  const handleAddMaterial = async (type: 'CM' | 'TD' | 'TP') => {
    const fileName = prompt(`Entrez le nom du nouveau support ${type}:`);
    if (!fileName) return;

    if (isAdmin) {
      alert(`[ADMIN BROADCAST] Publication de "${fileName}" dans ${type} pour tous les utilisateurs.`);
    } else {
      alert(`[USER UPLOAD] "${fileName}" ajouté à votre dossier personnel ${type}.`);
    }
  };

  const openAddNote = () => {
    setNoteForm({ title: '', content: '', tags: [subject.code, subject.name] });
    setIsAddingNote(true);
  };

  const handleSaveNote = () => {
    if (!noteForm.title) return;
    const newNote: Note = { 
      id: Date.now().toString(), 
      user_id: 'default-user', 
      title: noteForm.title, 
      content: noteForm.content, 
      tags: noteForm.tags, 
      pinned: false, 
      created_at: new Date().toISOString() 
    };
    setNotes([newNote, ...notes]);
    setIsAddingNote(false);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  if (isAddingNote) {
    return (
      <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-800 animate-in fade-in zoom-in duration-300">
        <header className="px-8 py-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <button onClick={() => setIsAddingNote(false)} className="text-slate-500 hover:text-rose-500 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
          <h3 className="font-black text-slate-100 uppercase tracking-[0.3em] text-[10px]">New Subject Note • {subject.code}</h3>
          <button onClick={handleSaveNote} className="text-emerald-500 hover:text-emerald-400 transition-colors">
            <span className="material-symbols-outlined font-bold">check</span>
          </button>
        </header>
        <div className="p-10 space-y-8">
          <input className="w-full text-5xl font-black bg-transparent border-none focus:outline-none placeholder-slate-800 text-white tracking-tight" placeholder="Note Title" autoFocus value={noteForm.title} onChange={e => setNoteForm({ ...noteForm, title: e.target.value })} />
          <textarea className="w-full h-96 bg-transparent border-none focus:outline-none text-slate-300 text-lg leading-relaxed placeholder-slate-800 resize-none font-medium" placeholder="Start writing your thoughts..." value={noteForm.content} onChange={e => setNoteForm({ ...noteForm, content: e.target.value })} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-32 animate-in fade-in slide-in-from-right duration-500">
      <div className="relative h-64 md:h-80 w-full rounded-[3rem] overflow-hidden border border-slate-800 shadow-2xl">
        <img src={subject.image_url} alt={subject.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        <div className="absolute inset-0 p-8 flex flex-col justify-between">
          <button onClick={onBack} className="w-12 h-12 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-brand-600 transition-all shadow-xl"><span className="material-symbols-outlined">arrow_back</span></button>
          <div className="space-y-2">
            <span className="text-[10px] font-black text-brand-400 uppercase tracking-[0.4em]">{subject.code}</span>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight drop-shadow-lg">{subject.name}</h2>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-2 bg-slate-900 rounded-[2rem] border border-slate-800 w-fit overflow-x-auto max-w-full scrollbar-hide">
        {['CM', 'TD', 'TP', 'Notes', 'Tasks', 'Khints', 'Else'].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab as SubjectTab)} 
            className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-500 hover:text-slate-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-12 space-y-4">
          <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] flex items-center">
                <span className="material-symbols-outlined mr-3 text-indigo-400">
                  {activeTab === 'Notes' ? 'description' : 
                   activeTab === 'Tasks' ? 'checklist' : 
                   activeTab === 'Khints' ? 'lightbulb' : 
                   activeTab === 'Else' ? 'more_horiz' : 'folder_open'}
                </span>
                {activeTab} {activeTab === 'Khints' ? 'Insight Hub' : activeTab === 'Else' ? 'Miscellany' : 'Content'}
              </h3>
              
              <div className="flex space-x-2">
                {activeTab === 'Notes' && (
                  <button onClick={openAddNote} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/30 hover:bg-indigo-500 transition-all flex items-center space-x-2">
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>New Note</span>
                  </button>
                )}
                {activeTab === 'Tasks' && (
                  <button onClick={() => openTaskModal({ subject_id: subject.id })} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 hover:bg-emerald-500 transition-all flex items-center space-x-2">
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>Add Task</span>
                  </button>
                )}
                {(activeTab === 'CM' || activeTab === 'TD' || activeTab === 'TP') && (
                  <button onClick={() => handleAddMaterial(activeTab)} className="px-6 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-700 hover:bg-slate-700 hover:text-white transition-all flex items-center space-x-2">
                    <span className="material-symbols-outlined text-sm">upload</span>
                    <span>{isAdmin ? `Broadcast ${activeTab}` : `Upload ${activeTab}`}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {(activeTab === 'CM' || activeTab === 'TD' || activeTab === 'TP') && (
                currentMaterials.length > 0 ? (
                  currentMaterials.map((item) => <MaterialRow key={item.id} item={item} />)
                ) : (
                  <EmptyState icon="folder_off" label={`No ${activeTab} materials yet`} />
                )
              )}
              
              {activeTab === 'Notes' && (
                subjectNotes.length > 0 ? (
                  subjectNotes.map(note => (
                    <div key={note.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-all group cursor-pointer">
                      <h4 className="text-base font-bold text-slate-200">{note.title}</h4>
                      <p className="text-slate-500 text-xs mt-2 line-clamp-2">{note.content}</p>
                    </div>
                  ))
                ) : (
                  <EmptyState icon="edit_note" label="No specialized notes for this subject" />
                )
              )}

              {activeTab === 'Tasks' && (
                subjectTasks.length > 0 ? (
                  subjectTasks.map((task) => (
                    <div key={task.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center hover:border-emerald-500/40 transition-all group">
                      <div className="flex items-center space-x-4">
                        <button onClick={() => toggleTaskStatus(task.id)} className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-600 border-emerald-500' : 'border-slate-700 hover:border-emerald-500'}`}>
                          <span className={`material-symbols-outlined ${task.completed ? 'text-white' : 'text-transparent hover:text-emerald-500'} text-xs`}>check</span>
                        </button>
                        <div>
                          <h4 className={`text-sm font-bold ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{task.title}</h4>
                          {task.has_deadline && !task.completed && <p className="text-[9px] text-rose-500 mt-1 uppercase tracking-widest font-black">Urgent: {task.due_date}</p>}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState icon="checklist_rtl" label="Clear for now! No tasks assigned." />
                )
              )}

              {(activeTab === 'Khints' || activeTab === 'Else') && (
                <EmptyState icon={activeTab === 'Khints' ? 'lightbulb_outline' : 'inventory_2'} label={`The ${activeTab} repository is currently empty.`} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MaterialRow: React.FC<{ item: CourseMaterial }> = ({ item }) => (
  <div onClick={() => item.path && window.open(item.path, '_blank')} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-800/50 cursor-pointer border border-transparent hover:border-slate-800 transition-all group">
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
        <span className="material-symbols-outlined text-xl">
          {item.type === 'pdf' ? 'picture_as_pdf' : item.type === 'code' ? 'code' : 'insert_drive_file'}
        </span>
      </div>
      <div>
        <h5 className="text-sm font-black text-slate-300 uppercase tracking-tight group-hover:text-white">{item.name}</h5>
        <div className="flex items-center space-x-2 mt-0.5">
          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{item.type}</span>
          {item.is_official && <span className="text-[8px] bg-indigo-900/40 text-indigo-500 px-1.5 rounded uppercase font-black">Official</span>}
        </div>
      </div>
    </div>
    <span className="material-symbols-outlined text-slate-700 opacity-0 group-hover:opacity-100 transition-all">download</span>
  </div>
);

const EmptyState: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <div className="py-20 text-center flex flex-col items-center">
    <span className="material-symbols-outlined text-5xl text-slate-800 mb-4">{icon}</span>
    <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{label}</p>
  </div>
);

export default SubjectDetail;