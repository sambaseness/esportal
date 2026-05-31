
import React, { useState, useEffect, useRef } from 'react';
import { Profile, Department, Level } from '../../types';
import { supabase } from '../../supabase';
import { DEPARTMENTS, LEVELS } from '../../constants.tsx';

interface ProfilePageProps {
  profile: Profile | null;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ profile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [editName, setEditName] = useState(profile?.full_name || '');
  const [editDepartment, setEditDepartment] = useState<Department>(profile?.department || 'Genie Informatique');
  const [editLevel, setEditLevel] = useState<Level>(profile?.level || 'DUT 1');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load state from Profile on Mount or when profile changes
  useEffect(() => {
    if (profile) {
      setEditName(profile.full_name);
      setEditDepartment(profile.department || 'Genie Informatique');
      setEditLevel(profile.level || 'DUT 1');
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  if (!profile) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSave = async () => {
    setLoading(true);
    
    // Sync to Supabase
    const { error } = await supabase
      .from('profiles')
      .update({ 
        full_name: editName,
        avatar_url: avatarUrl,
        department: editDepartment,
        level: editLevel
      })
      .eq('id', profile.id);

    if (error) {
      console.error("Error updating profile:", error);
      alert("Failed to sync profile with server.");
    } else {
      setIsEditing(false);
    }

    setLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatarUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const getRankStyle = (role: string) => {
    switch (role) {
      case 'super-admin': return 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
      case 'admin': return 'bg-brand-500/20 border-brand-500 text-brand-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]';
      default: return 'bg-slate-800 border-slate-700 text-slate-400';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-500 pb-20">
      <div className="bg-slate-900 rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden relative">
        {/* Progress bar if saving */}
        {loading && <div className="absolute top-0 left-0 w-full h-1 bg-brand-500 animate-pulse z-50"></div>}

        {/* Banner */}
        <div className="h-40 bg-gradient-to-br from-brand-900 via-brand-700 to-slate-900 relative">
          <div className="absolute inset-0 bg-black/20"></div>
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">Mode Édition Activé</span>
            </div>
          )}
        </div>
        
        <div className="px-12 pb-12">
          {/* Avatar Overlay */}
          <div className="flex justify-center -mt-20 mb-8 relative">
            <div 
              onClick={() => isEditing && fileInputRef.current?.click()}
              className={`w-40 h-40 rounded-[2.5rem] bg-slate-950 border-8 border-slate-900 flex items-center justify-center shadow-2xl overflow-hidden relative group transition-all ${isEditing ? 'cursor-pointer hover:border-brand-500/50' : ''}`}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-7xl text-slate-800">person</span>
              )}
              
              {isEditing && (
                <div className="absolute inset-0 bg-brand-600/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white text-3xl">upload</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-white mt-2">Changer</span>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>

          <div className="text-center space-y-4 mb-12">
            {isEditing ? (
              <input 
                type="text"
                className="text-3xl font-black text-white bg-slate-950 border border-slate-800 rounded-2xl px-6 py-2 text-center focus:border-brand-500 outline-none w-full"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            ) : (
              <h2 className="text-4xl font-black text-white uppercase tracking-tight">{profile.full_name}</h2>
            )}
            
            <div className="flex items-center justify-center space-x-3">
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${getRankStyle(profile.role)}`}>
                {profile.role}
              </span>
              <span className="text-slate-600 font-bold uppercase tracking-widest text-[9px] border-l border-slate-800 pl-3">
                Identifiant Étudiant
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="p-6 bg-slate-950/50 rounded-3xl border border-slate-800/50 flex items-center justify-between group">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Département</p>
                {isEditing ? (
                  <select 
                    className="bg-transparent border-b border-slate-800 text-brand-400 font-bold outline-none focus:border-brand-500 pb-1 w-full"
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value as Department)}
                  >
                    {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-slate-900">{d}</option>)}
                  </select>
                ) : (
                  <p className="text-slate-300 font-bold">{profile.department || 'Non Défini'}</p>
                )}
              </div>
              <span className="material-symbols-outlined text-slate-800 group-hover:text-brand-500/50 transition-colors">domain</span>
            </div>

            <div className="p-6 bg-slate-950/50 rounded-3xl border border-slate-800/50 flex items-center justify-between group">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Niveau d'études</p>
                {isEditing ? (
                  <select 
                    className="bg-transparent border-b border-slate-800 text-brand-400 font-bold outline-none focus:border-brand-500 pb-1 w-full"
                    value={editLevel}
                    onChange={(e) => setEditLevel(e.target.value as Level)}
                  >
                    {LEVELS.map(l => <option key={l} value={l} className="bg-slate-900">{l}</option>)}
                  </select>
                ) : (
                  <p className="text-slate-300 font-bold">{profile.level || 'Non Défini'}</p>
                )}
              </div>
              <span className="material-symbols-outlined text-slate-800 group-hover:text-brand-500/50 transition-colors">school</span>
            </div>

            <div className="p-6 bg-slate-950/50 rounded-3xl border border-slate-800/50 flex items-center justify-between group md:col-span-2">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Email Académique</p>
                <p className="text-slate-500 font-mono text-[10px]">{profile.email}</p>
              </div>
              <span className="material-symbols-outlined text-slate-800">mail</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            {isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="py-5 rounded-3xl bg-slate-800 text-slate-400 font-black uppercase tracking-widest text-xs hover:bg-slate-700 transition-all flex items-center justify-center space-x-2"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                  <span>Annuler</span>
                </button>
                <button 
                  onClick={handleSave}
                  className="py-5 rounded-3xl bg-brand-600 text-white font-black uppercase tracking-widest text-xs hover:bg-brand-500 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-brand-900/40"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  <span>Enregistrer</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="py-5 rounded-3xl bg-slate-800/50 border border-slate-800 text-slate-300 font-black uppercase tracking-widest text-xs hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center space-x-2"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span>Modifier Profil</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="py-5 rounded-3xl bg-rose-600/10 border border-rose-500/30 text-rose-500 font-black uppercase tracking-widest text-xs hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center space-x-2"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  <span>Déconnexion</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {!isEditing && (
        <div className="bg-brand-950/20 border border-brand-500/20 rounded-[2.5rem] p-10 text-center space-y-4">
           <h4 className="text-brand-400 font-black uppercase tracking-[0.3em] text-[10px]">Statut Académique</h4>
           <div className="flex justify-center space-x-12">
              <div className="text-center">
                <p className="text-2xl font-black text-white">{profile.level?.split(' ')[1] || 'L1'}</p>
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Niveau</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-white">{profile.department?.split(' ')[1]?.substring(0, 2).toUpperCase() || 'TR'}</p>
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Filière</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-white">OK</p>
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Status</p>
              </div>
           </div>
           <p className="text-slate-500 text-[10px] italic pt-4">Les données académiques avancées sont synchronisées avec le serveur du département {profile.department || 'PP'}.</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
