
import React, { useState } from 'react';
import { AppGroup, AppShortcut } from '../../types';

interface ConfigProps {
  logo: string;
  appName: string;
  setLogo: (val: string) => void;
  setAppName: (val: string) => void;
  setBgImage: (val: string | null) => void;
  appGroups: AppGroup[];
  setAppGroups: (val: AppGroup[]) => void;
  mainApps: AppShortcut[];
  setMainApps: (val: AppShortcut[]) => void;
}

const HomeConfig: React.FC<ConfigProps> = (props) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);

  // Form state for creating/editing apps
  const [appForm, setAppForm] = useState<Partial<AppShortcut>>({
    name: '',
    url: '',
    icon: '',
    iconType: 'url',
    color: '#1e293b'
  });

  const selectedGroup = props.appGroups.find(g => g.id === selectedGroupId);

  const resetForm = () => {
    setAppForm({ name: '', url: '', icon: '', iconType: 'url', color: '#1e293b' });
    setEditingAppId(null);
  };

  const handleEditApp = (app: AppShortcut) => {
    setEditingAppId(app.id);
    setAppForm({ ...app });
  };

  const handleDeleteApp = (groupId: string, appId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce raccourci ?')) return;
    const updatedGroups = props.appGroups.map(g => {
      if (g.id === groupId) {
        return { ...g, apps: g.apps.filter(a => a.id !== appId) };
      }
      return g;
    });
    props.setAppGroups(updatedGroups);
    if (editingAppId === appId) resetForm();
  };

  const handleSaveApp = () => {
    if (!selectedGroupId || !appForm.name || !appForm.url) return;

    const updatedGroups = props.appGroups.map(g => {
      if (g.id === selectedGroupId) {
        let updatedApps;
        if (editingAppId) {
          updatedApps = g.apps.map(a => a.id === editingAppId ? { ...a, ...appForm } as AppShortcut : a);
        } else {
          const newApp: AppShortcut = {
            id: Date.now().toString(),
            name: appForm.name!,
            url: appForm.url!,
            icon: appForm.icon,
            iconType: appForm.iconType || 'url',
            color: appForm.color || '#1e293b'
          };
          updatedApps = [...g.apps, newApp];
        }
        return { ...g, apps: updatedApps };
      }
      return g;
    });

    props.setAppGroups(updatedGroups);
    resetForm();
  };

  const toggleGroupVisibility = (groupId: string) => {
    props.setAppGroups(props.appGroups.map(g => g.id === groupId ? { ...g, visible: !g.visible } : g));
  };

  const renderGroupList = (position: string, label: string) => {
    const groups = props.appGroups.filter(g => g.position === position);
    return (
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] pl-4">{label}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map(group => (
            <button
              key={group.id}
              onClick={() => { setSelectedGroupId(group.id); resetForm(); }}
              className={`p-6 rounded-3xl border text-left transition-all flex items-center justify-between group bg-slate-900 border-slate-800 hover:border-brand-500 hover:shadow-xl hover:shadow-brand-900/10`}
            >
              <div className="flex items-center space-x-4">
                <span className={`material-symbols-outlined text-indigo-400`}>{group.groupIcon}</span>
                <div>
                  <p className={`text-sm font-bold uppercase tracking-tight text-slate-200`}>{group.name}</p>
                  <p className={`text-[9px] font-black uppercase tracking-widest text-slate-600`}>{group.apps.length} Protocoles</p>
                </div>
              </div>
              {!group.visible && <span className="material-symbols-outlined text-slate-700 text-sm">visibility_off</span>}
              <span className="material-symbols-outlined text-slate-700 group-hover:text-indigo-400 transition-colors">chevron_right</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (selectedGroup) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-32 animate-in slide-in-from-right duration-500">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-[3.5rem] border border-slate-800 shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Editor Header */}
          <div className="p-10 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => setSelectedGroupId(null)} 
                className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-slate-700 hover:border-indigo-500"
              >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
              </button>
              <div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tight">{selectedGroup.name}</h3>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.4em] mt-1">Configuring {selectedGroup.position.replace('-', ' ')} perimeter</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-slate-950 p-2 pl-6 rounded-full border border-slate-800">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Visible On Start Page</span>
              <button 
                onClick={() => toggleGroupVisibility(selectedGroup.id)}
                className={`w-12 h-6 rounded-full transition-all relative ${selectedGroup.visible ? 'bg-indigo-600' : 'bg-slate-800'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${selectedGroup.visible ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>

          <div className="p-10 grid grid-cols-1 xl:grid-cols-12 gap-12">
            {/* Left: App List */}
            <div className="xl:col-span-6 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em]">Current Protocols</h4>
                <span className="text-[10px] font-mono text-slate-500">{selectedGroup.apps.length} Entries</span>
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-4 scrollbar-hide">
                {selectedGroup.apps.map(app => (
                  <div key={app.id} className="p-5 bg-slate-950/80 rounded-[2rem] border border-slate-800 flex items-center justify-between group transition-all hover:border-indigo-500/30">
                    <div className="flex items-center space-x-5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2.5 shadow-inner">
                         {app.icon?.startsWith('http') ? (
                           <img src={app.icon} className="w-full h-full object-contain" />
                         ) : (
                           <span className="material-symbols-outlined text-slate-400 group-hover:text-indigo-400 transition-colors">{app.icon || 'public'}</span>
                         )}
                      </div>
                      <div>
                        <p className="text-base font-bold text-white uppercase tracking-tight">{app.name}</p>
                        <p className="text-[10px] text-slate-600 truncate max-w-[180px] font-mono">{app.url}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => handleEditApp(app)} className="w-11 h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 flex items-center justify-center border border-slate-800"><span className="material-symbols-outlined text-lg">edit</span></button>
                      <button onClick={() => handleDeleteApp(selectedGroup.id, app.id)} className="w-11 h-11 rounded-xl bg-slate-900 hover:bg-rose-900/20 text-slate-400 hover:text-rose-500 flex items-center justify-center border border-slate-800"><span className="material-symbols-outlined text-lg">delete</span></button>
                    </div>
                  </div>
                ))}
                {selectedGroup.apps.length === 0 && (
                  <div className="text-center py-20 text-slate-700 border-2 border-dashed border-slate-800/50 rounded-[2.5rem] flex flex-col items-center">
                    <span className="material-symbols-outlined text-5xl mb-4 opacity-20">cloud_off</span>
                    <p className="text-[10px] font-black uppercase tracking-widest">No Shortcut Protocols Found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Form */}
            <div className="xl:col-span-6 space-y-10 bg-slate-950/20 p-8 rounded-[2.5rem] border border-slate-800/30">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${editingAppId ? 'bg-indigo-400 animate-pulse' : 'bg-emerald-400'}`}></div>
                <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">{editingAppId ? 'Edit Protocol' : 'Initialize New Identity'}</h4>
              </div>
              
              <div className="space-y-7">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Display Title</label>
                  <input type="text" placeholder="e.g. Wiki Notes" value={appForm.name} onChange={e => setAppForm({...appForm, name: e.target.value})} className="w-full p-5 bg-slate-950 border border-slate-800 rounded-2xl text-white font-bold outline-none focus:border-indigo-500 focus:bg-slate-900/50 transition-all" />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Target URL</label>
                  <input type="text" placeholder="https://..." value={appForm.url} onChange={e => setAppForm({...appForm, url: e.target.value})} className="w-full p-5 bg-slate-950 border border-slate-800 rounded-2xl text-white font-bold outline-none focus:border-indigo-500 focus:bg-slate-900/50 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Icon Type</label>
                    <select value={appForm.iconType} onChange={e => setAppForm({...appForm, iconType: e.target.value as any})} className="w-full p-5 bg-slate-950 border border-slate-800 rounded-2xl text-white font-bold outline-none cursor-pointer">
                      <option value="url">Favicon / Image URL</option>
                      <option value="symbol">Material Symbol</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Accent Color</label>
                    <div className="flex space-x-4">
                       <input type="color" value={appForm.color} onChange={e => setAppForm({...appForm, color: e.target.value})} className="w-14 h-14 p-1 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer" />
                       <div className="flex-1 p-5 bg-slate-950 border border-slate-800 rounded-2xl text-[10px] font-mono text-slate-500 flex items-center justify-center uppercase">{appForm.color}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Icon Source</label>
                  <input type="text" placeholder={appForm.iconType === 'symbol' ? 'e.g. settings, shield, lightbulb' : 'https://...'} value={appForm.icon} onChange={e => setAppForm({...appForm, icon: e.target.value})} className="w-full p-5 bg-slate-950 border border-slate-800 rounded-2xl text-white font-bold outline-none focus:border-indigo-500 focus:bg-slate-900/50 transition-all" />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button onClick={resetForm} className="flex-1 py-5 rounded-2xl bg-slate-800/40 hover:bg-slate-800 text-slate-500 font-black uppercase tracking-widest text-[10px] transition-all border border-slate-800">Discard Changes</button>
                <button onClick={handleSaveApp} className="flex-1 py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-indigo-900/20">{editingAppId ? 'Update Entry' : 'Add Shortcut'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 animate-in fade-in duration-700">
      
      {/* Global Branding Section */}
      <section className="bg-slate-900/40 backdrop-blur-md p-10 rounded-[3rem] border border-slate-800 shadow-2xl space-y-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white border border-indigo-400">
            <span className="material-symbols-outlined">settings_suggest</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-none">Global Identity</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Core platform branding configuration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">App Name</label>
            <input type="text" value={props.appName} onChange={e => props.setAppName(e.target.value)} className="w-full p-4 bg-slate-950 rounded-2xl border border-slate-800 text-white font-bold outline-none focus:border-indigo-500 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Logo URL</label>
            <input type="text" value={props.logo} onChange={e => props.setLogo(e.target.value)} className="w-full p-4 bg-slate-950 rounded-2xl border border-slate-800 text-white font-bold outline-none focus:border-indigo-500 transition-all" />
          </div>
          <div className="flex items-end">
            <button className="w-full p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all">Clear Metadata Cache</button>
          </div>
        </div>
      </section>

      {/* Group Navigation */}
      <div className="space-y-12">
        {renderGroupList('top-left', 'Navigation Perimeter (Top Left)')}
        {renderGroupList('top-right', 'Intelligence Grids (Top Right)')}
        {renderGroupList('bottom-left', 'System Layers (Bottom Left)')}
        {renderGroupList('bottom-right', 'The Core Cluster (Bottom Right)')}
      </div>
    </div>
  );
};

export default HomeConfig;
