
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Profile, AppConfig, ExamEntry, Page } from '../../types';

type AdminTab = 'broadcast' | 'users' | 'media' | 'toggle' | 'exam-settings';

interface AdminPanelProps {
  appConfig: AppConfig;
  setAppConfig: (config: AppConfig) => void;
  examSchedule: ExamEntry[];
  setExamSchedule: (exams: ExamEntry[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ appConfig, setAppConfig, examSchedule, setExamSchedule }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('broadcast');
  const [users, setUsers] = useState<Profile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<{msg: string, type: 'info' | 'success' | 'danger'}[]>([]);
  
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'Général',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    image_url: ''
  });
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true });
    
    if (!error) setUsers(data || []);
    setLoadingUsers(false);
  };

  const addLog = (msg: string, type: 'info' | 'success' | 'danger' = 'info') => {
    setTerminalLogs(prev => [...prev, { msg, type }].slice(-5));
  };

  const handleUserAction = async (userId: string, userName: string, action: 'KICK' | 'BAN' | 'RESTRICT') => {
    addLog(`Initiating ${action} sequence for entity: ${userName.toUpperCase()}...`, 'info');
    
    // Simulate database latency
    await new Promise(r => setTimeout(r, 800));

    let statusUpdate = 'active';
    if (action === 'BAN') statusUpdate = 'banned';
    if (action === 'RESTRICT') statusUpdate = 'restricted';

    const { error } = await supabase
      .from('profiles')
      .update({ status: statusUpdate })
      .eq('id', userId);

    if (!error) {
      addLog(`${action} verified. Target: ${userName}. Result: SUCCESS.`, 'success');
      fetchUsers(); // Refresh list
    } else {
      addLog(`ERR: Failed to override security clearance for ${userName}.`, 'danger');
    }
  };

  const handleToggleConfig = async (key: keyof AppConfig | string, subKey?: Page) => {
    let newConfig: AppConfig;
    
    if (subKey) {
      newConfig = {
        ...appConfig,
        visiblePages: {
          ...appConfig.visiblePages,
          [subKey]: !appConfig.visiblePages[subKey]
        }
      };
    } else {
      newConfig = {
        ...appConfig,
        [key as keyof AppConfig]: !appConfig[key as keyof AppConfig]
      };
    }

    setAppConfig(newConfig);
    
    const { error } = await supabase
      .from('app_config')
      .upsert({ id: 'global', config: newConfig });
      
    if (error) {
      addLog(`ERR: Failed to update global configuration.`, 'danger');
    } else {
      const label = subKey ? `Page: ${subKey}` : `Feature: ${key}`;
      const state = (subKey ? newConfig.visiblePages[subKey] : newConfig[key as keyof AppConfig]) ? 'ENABLED' : 'DISABLED';
      addLog(`Configuration updated: ${label} ${state}.`, 'success');
    }
  };

  const handleSaveExam = async (exam: ExamEntry) => {
    const { error } = await supabase
      .from('exams')
      .upsert(exam);
      
    if (error) {
      addLog(`ERR: Failed to save exam entry for ${exam.subject_name}.`, 'danger');
    } else {
      addLog(`Exam entry updated: ${exam.subject_name}.`, 'success');
    }
  };

  const handleDeleteExam = async (id: string, name: string) => {
    const { error } = await supabase
      .from('exams')
      .delete()
      .eq('id', id);
      
    if (error) {
      addLog(`ERR: Failed to delete exam: ${name}.`, 'danger');
    } else {
      addLog(`Exam deleted: ${name}.`, 'success');
      setExamSchedule(examSchedule.filter(e => e.id !== id));
    }
  };

  const handleAddExam = async () => {
    const newExam: ExamEntry = {
      id: Math.random().toString(36).substr(2, 9),
      subject_name: 'Nouveau Sujet',
      date: new Date().toISOString().split('T')[0],
      start_time: '08:00',
      duration_minutes: 120,
      location: 'Amphi A',
      type: 'Examen'
    };
    
    const { error } = await supabase
      .from('exams')
      .insert(newExam);
      
    if (error) {
      addLog(`ERR: Failed to initialize new exam entry.`, 'danger');
    } else {
      addLog(`New exam entry initialized.`, 'success');
      setExamSchedule([...examSchedule, newExam]);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return;

    setIsPublishing(true);
    setStatus(null);

    const { error } = await supabase
      .from('announcements')
      .insert([form]);

    if (error) {
      console.error('Error publishing:', error);
      setStatus({ type: 'error', message: `Erreur: ${error.message}` });
    } else {
      setStatus({ type: 'success', message: 'Annonce publiée avec succès sur le fil DGI!' });
      setForm({ title: '', content: '', category: 'Général', priority: 'normal', image_url: '' });
    }
    setIsPublishing(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Admin Tabs */}
      <div className="flex space-x-4 bg-slate-900/50 p-2 rounded-[2rem] border border-slate-800 w-fit mx-auto">
        <button onClick={() => setActiveTab('broadcast')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'broadcast' ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/30' : 'text-slate-500 hover:text-slate-300'}`}>Broadcast Feed</button>
        <button onClick={() => setActiveTab('users')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-500 hover:text-slate-300'}`}>User Control</button>
        <button onClick={() => setActiveTab('media')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'media' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-500 hover:text-slate-300'}`}>Global Media</button>
        <button onClick={() => setActiveTab('toggle')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'toggle' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-500 hover:text-slate-300'}`}>Toggle</button>
        {appConfig.showExamTab && (
          <button onClick={() => setActiveTab('exam-settings')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'exam-settings' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/30' : 'text-slate-500 hover:text-slate-300'}`}>Exam Setting</button>
        )}
      </div>

      {/* Terminal Feedback Overlay (Global for this page) */}
      {terminalLogs.length > 0 && (
        <div className="fixed bottom-10 right-10 w-80 bg-black/90 border border-slate-800 rounded-2xl p-4 shadow-2xl z-50 font-mono text-[9px] space-y-2 animate-in slide-in-from-bottom duration-300">
           {terminalLogs.map((log, i) => (
             <div key={i} className={`flex items-start space-x-2 ${log.type === 'success' ? 'text-emerald-400' : log.type === 'danger' ? 'text-rose-400' : 'text-indigo-400'}`}>
               <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span>
               <span className="flex-1"># {log.msg}</span>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'broadcast' && (
        <div className="bg-slate-900 p-12 rounded-[3.5rem] border border-slate-800 shadow-2xl space-y-10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 text-slate-800/10 pointer-events-none">
            <span className="material-symbols-outlined text-[240px]">campaign</span>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Post Academic Announcement</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Publish directly to the student ecosystem feed</p>
          </div>

          {status && (
            <div className={`p-6 rounded-3xl border animate-in fade-in slide-in-from-top ${status.type === 'success' ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' : 'bg-rose-950/20 border-rose-500/30 text-rose-400'}`}>
              <div className="flex items-center space-x-4">
                <span className="material-symbols-outlined">{status.type === 'success' ? 'check_circle' : 'error'}</span>
                <p className="font-bold text-sm">{status.message}</p>
              </div>
            </div>
          )}

          <form onSubmit={handlePublish} className="space-y-8 relative z-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Title of Broadcast</label>
              <input type="text" placeholder="e.g. Inscription aux examens de Janvier" className="w-full p-5 bg-slate-950 rounded-2xl border border-slate-800 text-white outline-none focus:border-indigo-500 transition-all font-bold" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</label>
                 <select className="w-full p-5 bg-slate-950 rounded-2xl border border-slate-800 text-white outline-none focus:border-indigo-500 transition-all font-bold appearance-none" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                   <option>Général</option>
                   <option>Examens</option>
                   <option>Administration</option>
                   <option>Sport & Culture</option>
                   <option>DGI News</option>
                 </select>
               </div>
               <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Priority Level</label>
                 <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800">
                   {(['low', 'normal', 'high', 'urgent'] as const).map(p => (
                     <button key={p} type="button" onClick={() => setForm({...form, priority: p})} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${form.priority === p ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-600 hover:text-slate-400'}`}>{p}</button>
                   ))}
                 </div>
               </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Message Content</label>
              <textarea rows={8} placeholder="Détails de l'annonce..." className="w-full p-5 bg-slate-950 rounded-2xl border border-slate-800 text-white outline-none focus:border-indigo-500 transition-all font-medium resize-none" value={form.content} onChange={e => setForm({...form, content: e.target.value})} required />
            </div>

            <button disabled={isPublishing} className={`w-full py-6 rounded-3xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.3em] text-xs transition-all shadow-xl shadow-indigo-900/20 flex items-center justify-center space-x-4 ${isPublishing ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isPublishing ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><span className="material-symbols-outlined">send</span><span>Broadcast to Feed</span></>}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-slate-900 p-12 rounded-[3.5rem] border border-slate-800 shadow-2xl space-y-10 animate-in fade-in duration-500">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">System Entities</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Manage Clearance levels and access status</p>
            </div>
            <button onClick={fetchUsers} className="p-4 rounded-2xl bg-slate-950 text-indigo-400 hover:text-white border border-slate-800 transition-all">
              <span className={`material-symbols-outlined ${loadingUsers ? 'animate-spin' : ''}`}>refresh</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {users.map(user => (
              <div key={user.id} className="p-6 bg-slate-950/50 rounded-3xl border border-slate-800 flex items-center justify-between group hover:border-indigo-500/20 transition-all">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-[1.2rem] bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 overflow-hidden">
                      {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-3xl">person</span>}
                    </div>
                    {/* Status Dot */}
                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-4 border-slate-950 ${(user as any).status === 'banned' ? 'bg-rose-500' : (user as any).status === 'restricted' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-black text-white uppercase tracking-tight">{user.full_name}</h4>
                      <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${user.role === 'admin' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-600 mt-1">{user.id}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                   <button 
                    onClick={() => handleUserAction(user.id, user.full_name, 'RESTRICT')}
                    className="p-3 rounded-xl bg-slate-900 text-amber-500/50 hover:text-amber-500 hover:bg-amber-500/10 border border-slate-800 transition-all"
                    title="Restrict Rights"
                   >
                     <span className="material-symbols-outlined">block</span>
                   </button>
                   <button 
                    onClick={() => handleUserAction(user.id, user.full_name, 'BAN')}
                    className="p-3 rounded-xl bg-slate-900 text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 border border-slate-800 transition-all"
                    title="Terminate Access"
                   >
                     <span className="material-symbols-outlined">person_off</span>
                   </button>
                   <button 
                    onClick={() => handleUserAction(user.id, user.full_name, 'KICK')}
                    className="px-6 py-3 rounded-xl bg-indigo-600/10 text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all border border-indigo-500/20"
                   >
                     Clear Session
                   </button>
                </div>
              </div>
            ))}
            {users.length === 0 && !loadingUsers && (
              <div className="py-20 text-center text-slate-700 border-2 border-dashed border-slate-800 rounded-3xl">
                <span className="material-symbols-outlined text-4xl mb-2">no_accounts</span>
                <p className="text-[10px] font-black uppercase tracking-widest">No entities synchronized</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'media' && (
        <div className="bg-slate-900 p-12 rounded-[3.5rem] border border-slate-800 shadow-2xl space-y-8 min-h-[500px] flex flex-col">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">User Media Vault</h2>
          <div className="flex-1 flex flex-col items-center justify-center text-slate-700">
            <span className="material-symbols-outlined text-7xl mb-6">folder_shared</span>
            <p className="font-bold text-xs uppercase tracking-[0.5em] text-center max-w-sm leading-relaxed">Browsing student-uploaded assets (CM, TD, TP). You can moderate, delete, or promote these to Official Materials.</p>
            <div className="mt-12 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-between group cursor-not-allowed opacity-50">
                 <div className="flex items-center space-x-4">
                   <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-slate-500"><span className="material-symbols-outlined">person</span></div>
                   <div><p className="text-white text-xs font-bold uppercase tracking-widest">Student_01</p><p className="text-[8px] text-slate-600 uppercase font-black">3 Assets</p></div>
                 </div>
                 <span className="material-symbols-outlined text-slate-800">chevron_right</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'toggle' && (
        <div className="bg-slate-900 p-12 rounded-[3.5rem] border border-slate-800 shadow-2xl space-y-10 animate-in fade-in duration-500">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Feature Toggles</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Enable or disable platform modules globally</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Global Access Toggles */}
            <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-slate-800 flex items-center justify-between group hover:border-indigo-500/20 transition-all">
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <span className="material-symbols-outlined text-3xl">dashboard</span>
                </div>
                <div>
                  <h4 className="text-lg font-black text-white uppercase tracking-tight">Dashboard Access</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Show/Hide Dashboard button on Home</p>
                </div>
              </div>
              <button 
                onClick={() => handleToggleConfig('showDashboardAccess')}
                className={`w-16 h-8 rounded-full transition-all relative ${appConfig.showDashboardAccess ? 'bg-indigo-600' : 'bg-slate-800'}`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${appConfig.showDashboardAccess ? 'left-9' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-slate-800 flex items-center justify-between group hover:border-indigo-500/20 transition-all">
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <span className="material-symbols-outlined text-3xl">person_add</span>
                </div>
                <div>
                  <h4 className="text-lg font-black text-white uppercase tracking-tight">Allow Signup</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Show/Hide Signup link on Auth page</p>
                </div>
              </div>
              <button 
                onClick={() => handleToggleConfig('allowSignup')}
                className={`w-16 h-8 rounded-full transition-all relative ${appConfig.allowSignup ? 'bg-indigo-600' : 'bg-slate-800'}`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${appConfig.allowSignup ? 'left-9' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-slate-800 flex items-center justify-between group hover:border-indigo-500/20 transition-all">
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                  <span className="material-symbols-outlined text-3xl">assignment_late</span>
                </div>
                <div>
                  <h4 className="text-lg font-black text-white uppercase tracking-tight">Exam Module</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Show/Hide Exam tab in Schedule</p>
                </div>
              </div>
              <button 
                onClick={() => handleToggleConfig('showExamTab')}
                className={`w-16 h-8 rounded-full transition-all relative ${appConfig.showExamTab ? 'bg-indigo-600' : 'bg-slate-800'}`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${appConfig.showExamTab ? 'left-9' : 'left-1'}`}></div>
              </button>
            </div>

            {/* Page Visibility Toggles */}
            <div className="md:col-span-2 pt-8 border-t border-slate-800">
               <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6">Dashboard Pages Visibility</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: Page.Overview, label: 'Overview', icon: 'grid_view' },
                    { id: Page.Annonce, label: 'Annonces', icon: 'campaign' },
                    { id: Page.Schedule, label: 'Schedule', icon: 'calendar_month' },
                    { id: Page.FocusLab, label: 'Focus Lab', icon: 'timer' },
                    { id: Page.Notes, label: 'Notes', icon: 'description' },
                    { id: Page.Subjects, label: 'Subjects', icon: 'book' },
                    { id: Page.Profile, label: 'Profile', icon: 'person' },
                    { id: Page.Settings, label: 'Settings', icon: 'settings' },
                  ].map(page => (
                    <div key={page.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="material-symbols-outlined text-slate-500">{page.icon}</span>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{page.label}</span>
                      </div>
                      <button 
                        onClick={() => handleToggleConfig('visiblePages', page.id)}
                        className={`w-12 h-6 rounded-full transition-all relative ${appConfig.visiblePages[page.id] !== false ? 'bg-indigo-600' : 'bg-slate-800'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${appConfig.visiblePages[page.id] !== false ? 'left-7' : 'left-1'}`}></div>
                      </button>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'exam-settings' && (
        <div className="bg-slate-900 p-12 rounded-[3.5rem] border border-slate-800 shadow-2xl space-y-10 animate-in fade-in duration-500">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">Exam Schedule Management</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Configure evaluation dates and locations</p>
            </div>
            <button 
              onClick={handleAddExam}
              className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg"
            >
              Ajouter un Examen
            </button>
          </div>

          <div className="space-y-4">
            {examSchedule.map((exam, idx) => (
              <div key={exam.id} className="p-8 bg-slate-950 rounded-[2.5rem] border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-6 items-end group hover:border-rose-500/20 transition-all">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Matière</label>
                  <input 
                    type="text" 
                    value={exam.subject_name} 
                    onChange={e => {
                      const newExams = [...examSchedule];
                      newExams[idx].subject_name = e.target.value;
                      setExamSchedule(newExams);
                    }}
                    onBlur={() => handleSaveExam(exam)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Date & Heure</label>
                  <div className="flex space-x-2">
                    <input 
                      type="date" 
                      value={exam.date} 
                      onChange={e => {
                        const newExams = [...examSchedule];
                        newExams[idx].date = e.target.value;
                        setExamSchedule(newExams);
                      }}
                      onBlur={() => handleSaveExam(exam)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-indigo-500"
                    />
                    <input 
                      type="time" 
                      value={exam.start_time} 
                      onChange={e => {
                        const newExams = [...examSchedule];
                        newExams[idx].start_time = e.target.value;
                        setExamSchedule(newExams);
                      }}
                      onBlur={() => handleSaveExam(exam)}
                      className="w-24 bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Type & Lieu</label>
                  <div className="flex space-x-2">
                    <select 
                      value={exam.type} 
                      onChange={e => {
                        const newExams = [...examSchedule];
                        newExams[idx].type = e.target.value as any;
                        setExamSchedule(newExams);
                        handleSaveExam(newExams[idx]);
                      }}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-indigo-500"
                    >
                      <option value="DS">DS</option>
                      <option value="Examen">Examen</option>
                      <option value="Rattrapage">Rattrapage</option>
                    </select>
                    <input 
                      type="text" 
                      value={exam.location} 
                      onChange={e => {
                        const newExams = [...examSchedule];
                        newExams[idx].location = e.target.value;
                        setExamSchedule(newExams);
                      }}
                      onBlur={() => handleSaveExam(exam)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={() => handleDeleteExam(exam.id, exam.subject_name)}
                    className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            ))}
            {examSchedule.length === 0 && (
              <div className="py-20 text-center text-slate-700 border-2 border-dashed border-slate-800 rounded-[3rem]">
                <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
                <p className="text-[10px] font-black uppercase tracking-widest">Aucun examen configuré</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
