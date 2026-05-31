
import React, { useState } from 'react';
import { Page, AppGroup, AppShortcut, Profile } from '../types';

interface HomeProps {
  logo: string;
  appName: string;
  mainApps: AppShortcut[];
  appGroups: AppGroup[];
  onNavigate: (page: Page) => void;
  profile: Profile | null;
  showDashboardAccess: boolean;
}

const Home: React.FC<HomeProps> = ({ logo, appName, mainApps, appGroups, onNavigate, profile, showDashboardAccess }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const activeGroup = appGroups.find(g => g.id === activeGroupId);

  const GroupIconButton: React.FC<{ group: AppGroup }> = ({ group }) => (
    <button 
      onClick={() => setActiveGroupId(group.id)}
      className="flex flex-col items-center group cursor-pointer transform hover:scale-110 transition-all duration-200"
      title={group.name}
    >
      <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-lg flex items-center justify-center border border-white/10 group-hover:bg-brand-600/20 group-hover:border-brand-500/50 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all">
        <span className="material-symbols-outlined text-slate-300 group-hover:text-brand-400 text-3xl">
          {group.groupIcon || 'grid_view'}
        </span>
      </div>
      <span className="mt-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100 group-hover:text-brand-400 transition-all">
        {group.name}
      </span>
    </button>
  );

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center bg-[#020617] transition-all">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-900/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-900/10 blur-[120px] rounded-full"></div>

      {/* Profile/Corner Actions */}
      <div className="absolute top-8 right-8 z-30">
        <button 
          onClick={() => onNavigate(Page.Profile)}
          className="flex items-center space-x-3 p-2 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-full transition-all group"
        >
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-2 group-hover:text-brand-400">
            {profile?.full_name?.split(' ')[0] || 'User'}
          </span>
          <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-black text-xs border border-brand-400">
            {profile?.full_name?.substring(0, 2).toUpperCase() || '??'}
          </div>
        </button>
      </div>

      {/* Corner App Group Towers */}
      <div className="absolute top-8 left-8 flex flex-col space-y-6 z-10">
        {appGroups.filter(g => g.visible && g.position === 'top-left').map(g => <GroupIconButton key={g.id} group={g} />)}
      </div>

      <div className="absolute top-24 right-8 flex flex-col space-y-6 z-10">
        {appGroups.filter(g => g.visible && g.position === 'top-right').map(g => <GroupIconButton key={g.id} group={g} />)}
      </div>

      <div className="absolute bottom-8 left-8 flex flex-col-reverse space-y-6 space-y-reverse z-10">
        {appGroups.filter(g => g.visible && g.position === 'bottom-left').map(g => <GroupIconButton key={g.id} group={g} />)}
      </div>

      <div className="absolute bottom-8 right-8 flex flex-col-reverse space-y-4 space-y-reverse z-10 overflow-y-auto max-h-[60vh] scrollbar-hide pr-2">
        {appGroups.filter(g => g.visible && g.position === 'bottom-right').map(g => <GroupIconButton key={g.id} group={g} />)}
      </div>

      {/* App Group Modal */}
      {activeGroupId && activeGroup && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setActiveGroupId(null)}
        >
          <div 
            className="bg-slate-900/90 backdrop-blur-2xl w-full max-w-lg rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 transform animate-in zoom-in-95 duration-300 border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-brand-400">{activeGroup.groupIcon}</span>
                <h2 className="text-xl font-bold text-slate-100 uppercase tracking-wide">{activeGroup.name}</h2>
              </div>
              <button 
                onClick={() => setActiveGroupId(null)}
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-all"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-6 max-h-[50vh] overflow-y-auto pr-2 scrollbar-hide">
              {activeGroup.apps.map(app => (
                <a 
                  key={app.id} 
                  href={app.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex flex-col items-center group"
                >
                  <div className="w-24 h-24 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center p-5 group-hover:bg-slate-800 group-hover:border-indigo-500/40 group-hover:-translate-y-2 transition-all duration-300">
                    {app.icon?.startsWith('http') ? (
                      <img src={app.icon} alt={app.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="material-symbols-outlined text-slate-500 group-hover:text-brand-400 text-4xl">
                        {app.icon || 'public'}
                      </span>
                    )}
                  </div>
                  <span className="mt-3 text-[10px] font-bold text-slate-500 text-center uppercase tracking-tight group-hover:text-slate-200 transition-colors">
                    {app.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Toggle */}
      {showDashboardAccess && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20">
           <button 
            onClick={() => onNavigate(Page.Overview)}
            className="px-6 py-3 bg-slate-900/50 hover:bg-brand-600 text-slate-200 hover:text-white rounded-full backdrop-blur-md border border-slate-800 transition-all shadow-xl font-bold flex items-center space-x-3 uppercase text-[10px] tracking-widest"
          >
            <span className="material-symbols-outlined text-sm">dashboard</span>
            <span>Dashboard</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="mt-[22vh] w-full max-w-3xl px-6 flex flex-col items-center z-10">
        <div className="flex flex-col items-center mb-12 text-center animate-in fade-in slide-in-from-top duration-1000">
          <img src={logo} alt="Logo" className="w-24 h-24 object-contain mb-6 drop-shadow-[0_0_30px_rgba(99,102,241,0.2)]" />
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase">{appName}</h1>
          <div className="flex items-center space-x-4 mt-3">
             <div className="h-[1px] w-8 bg-brand-500/20"></div>
             <p className="text-slate-500 text-[10px] font-black tracking-[0.5em] uppercase">Student Ecosystem</p>
             <div className="h-[1px] w-8 bg-brand-500/20"></div>
          </div>
        </div>

        <form onSubmit={handleSearch} className="w-full relative group max-w-xl animate-in fade-in slide-in-from-bottom duration-1000">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search the web..."
            className="w-full h-16 pl-16 pr-8 rounded-[2rem] bg-slate-900/90 border border-slate-800 text-slate-200 backdrop-blur shadow-[0_20px_50px_rgba(0,0,0,0.5)] focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-xl font-medium transition-all"
          />
          <span className="material-symbols-outlined absolute left-6 top-5 text-slate-500 group-focus-within:text-brand-400 transition-colors">search</span>
        </form>

        <div className="mt-14 grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-6 w-full justify-center px-4 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
          {mainApps.map(app => (
            <a key={app.id} href={app.url} target="_blank" rel="noopener noreferrer" 
               className="flex flex-col items-center group cursor-pointer transform hover:-translate-y-3 transition-all p-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-900/50 backdrop-blur-md flex items-center justify-center border border-slate-800 group-hover:bg-slate-800 group-hover:border-indigo-500/50 group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] transition-all overflow-hidden p-3">
                {app.icon?.startsWith('http') ? (
                  <img src={app.icon} alt={app.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-brand-400 text-2xl">{app.icon || 'star'}</span>
                )}
              </div>
              <span className="mt-3 text-slate-600 text-[9px] font-black group-hover:text-slate-300 truncate w-16 text-center uppercase tracking-tighter transition-all">{app.name}</span>
            </a>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-4 opacity-30 pointer-events-none">
        <span className="w-12 h-[1px] bg-brand-500"></span>
        <span className="text-slate-500 text-[9px] font-black tracking-[0.8em] uppercase">pp.bluedish.tech</span>
        <span className="w-12 h-[1px] bg-brand-500"></span>
      </div>
    </div>
  );
};

export default Home;
