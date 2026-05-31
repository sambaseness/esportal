
import React, { useState } from 'react';
import { supabase } from '../supabase';
import { DEFAULT_LOGO, APP_NAME, DEPARTMENTS, LEVELS } from '../constants.tsx';
import { Department, Level } from '../types';

interface AuthProps {
  onAuthSuccess: () => void;
  allowSignup: boolean;
}

const Auth: React.FC<AuthProps> = ({ allowSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState<Department>('Genie Informatique');
  const [level, setLevel] = useState<Level>('DUT 1');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { 
              full_name: fullName,
              department: department,
              level: level
            }
          }
        });
        if (error) throw error;
        alert('Compte créé ! Veuillez vérifier votre boîte mail (si activé) ou connectez-vous.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-brand-900/20 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-rose-900/10 blur-[150px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <img src={DEFAULT_LOGO} alt="Logo" className="w-20 h-20 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(99,102,241,0.3)]" />
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">{APP_NAME}</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">Access Restricted to Registered Students</p>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-2xl space-y-8">
          <h2 className="text-xl font-black text-white uppercase tracking-tight text-center">
            {isLogin ? 'Authentification' : 'Créer un Compte'}
          </h2>

          {error && (
            <div className="p-4 bg-rose-950/30 border border-rose-500/30 rounded-2xl text-rose-400 text-xs font-bold animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Nom Complet</label>
                  <input 
                    type="text"
                    placeholder="John Doe"
                    className="w-full p-4 bg-slate-950 rounded-2xl border border-slate-800 text-white outline-none focus:border-brand-500 transition-all font-bold"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Département</label>
                    <div className="relative">
                      <select 
                        className="w-full p-4 bg-slate-950 rounded-2xl border border-slate-800 text-white outline-none focus:border-indigo-500 transition-all font-bold appearance-none cursor-pointer"
                        value={department}
                        onChange={e => setDepartment(e.target.value as Department)}
                        required
                      >
                        {DEPARTMENTS.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">expand_more</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Niveau</label>
                    <div className="relative">
                      <select 
                        className="w-full p-4 bg-slate-950 rounded-2xl border border-slate-800 text-white outline-none focus:border-indigo-500 transition-all font-bold appearance-none cursor-pointer"
                        value={level}
                        onChange={e => setLevel(e.target.value as Level)}
                        required
                      >
                        {LEVELS.map(lvl => (
                          <option key={lvl} value={lvl}>{lvl}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">expand_more</span>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Email Institutionnel</label>
              <input 
                type="email"
                placeholder="prenom.nom@esp.sn"
                className="w-full p-4 bg-slate-950 rounded-2xl border border-slate-800 text-white outline-none focus:border-indigo-500 transition-all font-bold"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Mot de Passe</label>
              <input 
                type="password"
                placeholder="••••••••"
                className="w-full p-4 bg-slate-950 rounded-2xl border border-slate-800 text-white outline-none focus:border-indigo-500 transition-all font-bold"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-indigo-900/30 flex items-center justify-center space-x-3"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">{isLogin ? 'login' : 'person_add'}</span>
                  <span>{isLogin ? 'Se Connecter' : 'Inscription'}</span>
                </>
              )}
            </button>
          </form>

          {allowSignup && (
            <div className="text-center pt-2">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[10px] font-black text-slate-400 hover:text-indigo-400 uppercase tracking-widest transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
              </button>
            </div>
          )}
        </div>

        <div className="mt-12 flex items-center justify-center space-x-4 opacity-30 pointer-events-none">
          <span className="w-8 h-[1px] bg-indigo-500"></span>
          <span className="text-slate-500 text-[8px] font-black tracking-[0.5em] uppercase text-center">pp.bluedish.tech</span>
          <span className="w-8 h-[1px] bg-indigo-500"></span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
