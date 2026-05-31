
import React, { useState, useEffect, useRef } from 'react';

type LabMode = 'pomodoro' | 'stopwatch' | 'timer' | 'alarms' | 'worldclock';

const FocusLab: React.FC = () => {
  const [mode, setMode] = useState<LabMode>('pomodoro');

  const renderContent = () => {
    switch (mode) {
      case 'pomodoro': return <PomodoroModule />;
      case 'stopwatch': return <StopwatchModule />;
      case 'timer': return <TimerModule />;
      case 'alarms': return <AlarmsModule />;
      case 'worldclock': return <WorldClockModule />;
      default: return <PomodoroModule />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Mode Switcher */}
      <div className="bg-slate-900 p-2 rounded-[2rem] flex items-center justify-between border border-slate-800 shadow-xl">
        {(['pomodoro', 'stopwatch', 'timer', 'alarms', 'worldclock'] as LabMode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 flex items-center justify-center space-x-2 py-4 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === m ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <span className="material-symbols-outlined text-lg">
              {m === 'pomodoro' ? 'timer' : m === 'stopwatch' ? 'timer_10' : m === 'timer' ? 'hourglass_empty' : m === 'alarms' ? 'alarm' : 'public'}
            </span>
            <span className="hidden md:inline">{m}</span>
          </button>
        ))}
      </div>

      <div className="animate-in fade-in zoom-in-95 duration-500">
        {renderContent()}
      </div>
    </div>
  );
};

/* --- Pomodoro Module --- */
const PomodoroModule = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [pomoType, setPomoType] = useState<'work' | 'short' | 'long'>('work');

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      alert(`${pomoType.toUpperCase()} Session Complete!`);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, pomoType]);

  const setPreset = (type: 'work' | 'short' | 'long') => {
    setIsActive(false);
    setPomoType(type);
    setTimeLeft(type === 'work' ? 25 * 60 : type === 'short' ? 5 * 60 : 15 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-800 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
        <div 
          className="h-full bg-brand-500 transition-all duration-1000" 
          style={{ width: `${(timeLeft / (pomoType === 'work' ? 25 * 60 : pomoType === 'short' ? 5 * 60 : 15 * 60)) * 100}%` }}
        ></div>
      </div>

      <div className="flex space-x-4 mb-12 bg-slate-950 p-2 rounded-2xl border border-slate-800">
        {['work', 'short', 'long'].map(t => (
          <button 
            key={t}
            onClick={() => setPreset(t as any)}
            className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${pomoType === t ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="text-[140px] font-black text-indigo-500 tabular-nums leading-none drop-shadow-[0_0_40px_rgba(99,102,241,0.25)]">
        {formatTime(timeLeft)}
      </div>

      <div className="flex space-x-6 mt-16">
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`w-48 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isActive ? 'bg-rose-600 text-white shadow-xl shadow-rose-900/20' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40'}`}
        >
          {isActive ? 'Pause' : 'Focus Now'}
        </button>
        <button 
          onClick={() => setPreset(pomoType)}
          className="w-20 py-5 rounded-2xl bg-slate-800 text-slate-400 hover:bg-slate-700 transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined">restart_alt</span>
        </button>
      </div>
    </div>
  );
};

/* --- Stopwatch Module --- */
const StopwatchModule = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => setTime(prev => prev + 10), 10);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const centi = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${centi.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 flex flex-col items-center justify-center py-24 bg-slate-900 rounded-[3.5rem] border border-slate-800 shadow-2xl">
        <div className="text-[100px] font-black text-white tabular-nums tracking-tighter leading-none mb-16">
          {formatTime(time)}
        </div>
        <div className="flex space-x-6">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`w-48 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isActive ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}
          >
            {isActive ? 'Stop' : 'Start'}
          </button>
          <button 
            onClick={() => {
              if (isActive) setLaps([time, ...laps]);
              else { setTime(0); setLaps([]); }
            }}
            className="w-48 py-5 rounded-2xl bg-slate-800 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all"
          >
            {isActive ? 'Lap' : 'Reset'}
          </button>
        </div>
      </div>
      <div className="lg:col-span-4 bg-slate-900 rounded-[3.5rem] border border-slate-800 p-8 flex flex-col max-h-[400px]">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 px-4">Laps Recorded</h4>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
          {laps.map((lap, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-slate-950 rounded-2xl border border-slate-800/50">
              <span className="text-[10px] font-black text-slate-600 uppercase">Lap {laps.length - i}</span>
              <span className="text-sm font-black text-white tabular-nums">{formatTime(lap)}</span>
            </div>
          ))}
          {laps.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-30">
              <span className="material-symbols-outlined text-4xl mb-2">history</span>
              <p className="text-[10px] font-black uppercase tracking-widest">No laps</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* --- Timer Module --- */
const TimerModule = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [inputVal, setInputVal] = useState('0');

  useEffect(() => {
    let interval: any;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      alert('Timer Finished!');
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const startTimer = () => {
    const s = parseInt(inputVal) * 60;
    if (s > 0) {
      setSeconds(s);
      setIsActive(true);
    }
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-800">
      {isActive ? (
        <>
          <div className="text-[120px] font-black text-amber-500 tabular-nums leading-none mb-16">
            {formatTime(seconds)}
          </div>
          <button 
            onClick={() => { setIsActive(false); setSeconds(0); }}
            className="px-16 py-5 rounded-2xl bg-rose-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-900/20"
          >
            Cancel Timer
          </button>
        </>
      ) : (
        <div className="space-y-10 flex flex-col items-center">
          <div className="flex flex-col items-center space-y-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Set Duration (Minutes)</span>
            <input 
              type="number"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              className="w-40 bg-slate-950 text-center text-6xl font-black text-white p-6 rounded-3xl border border-slate-800 outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <button 
            onClick={startTimer}
            className="px-16 py-5 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-900/40"
          >
            Start Countdown
          </button>
        </div>
      )}
    </div>
  );
};

/* --- Alarms Module --- */
const AlarmsModule = () => {
  const [alarms, setAlarms] = useState([
    { id: 1, label: 'Morning Class', time: '07:30', active: true },
    { id: 2, label: 'Midday Break', time: '12:00', active: false },
    { id: 3, label: 'Study Session', time: '18:00', active: true },
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {alarms.map(alarm => (
        <div key={alarm.id} className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-between group hover:border-indigo-500/30 transition-all">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h4 className="text-xl font-black text-white uppercase tracking-tight">{alarm.label}</h4>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">Daily Recurrence</p>
            </div>
            <button 
              onClick={() => setAlarms(alarms.map(a => a.id === alarm.id ? {...a, active: !a.active} : a))}
              className={`w-12 h-6 rounded-full transition-all relative ${alarm.active ? 'bg-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.3)]' : 'bg-slate-800'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${alarm.active ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-5xl font-black text-slate-300 tabular-nums tracking-tighter">{alarm.time}</span>
            <button className="text-slate-700 hover:text-rose-500 transition-colors">
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      ))}
      <button className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-dashed border-slate-800 flex flex-col items-center justify-center space-y-4 hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all text-slate-600 hover:text-indigo-400">
        <span className="material-symbols-outlined text-4xl">add_alarm</span>
        <span className="text-[10px] font-black uppercase tracking-widest">New Alarm</span>
      </button>
    </div>
  );
};

/* --- World Clock Module --- */
const WorldClockModule = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (date: Date, zone: string) => {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: zone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-slate-900 p-16 rounded-[4rem] border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group hover:border-indigo-500/30 transition-all shadow-2xl">
        <div className="absolute top-0 right-0 p-12 text-slate-800/10 group-hover:text-indigo-500/5 transition-colors pointer-events-none">
          <span className="material-symbols-outlined text-[200px] font-thin">public</span>
        </div>
        <div className="relative z-10 text-center">
          <h4 className="text-sm font-black text-slate-500 uppercase tracking-[0.6em] mb-4">Dakar, Senegal</h4>
          <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-[0.3em] mb-12">Local Time</p>
          <div className="text-[120px] font-black text-white tabular-nums tracking-tighter leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            {formatTime(now, 'Africa/Dakar')}
          </div>
          <p className="mt-12 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
            {now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FocusLab;
