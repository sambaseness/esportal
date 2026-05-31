
import React, { useState, useEffect } from 'react';
import { Page, Note, Subject, Task, TimetableEntry, AppGroup, Profile, AppConfig, ExamEntry } from './types';
import { supabase } from './supabase';
import { 
  DEFAULT_LOGO, 
  APP_NAME, 
  DEFAULT_MAIN_APPS,
  DEFAULT_COMM_APPS,
  DEFAULT_MEETING_APPS,
  DEFAULT_GENERAL_APPS,
  DEFAULT_FREEDOM_APPS,
  DEFAULT_OS_APPS,
  DEFAULT_CYBER_APPS,
  DEFAULT_NET_APPS,
  DEFAULT_DEV_APPS,
  DEFAULT_AI_APPS,
  DEFAULT_LINUX_APPS,
  DEFAULT_TYPING_APPS,
  DEFAULT_DESIGN_APPS,
  DEFAULT_CLOUD_APPS,
  DEFAULT_DEPLOY_APPS,
  DEFAULT_DB_APPS,
  DEFAULT_TIMETABLE,
  DEPARTMENT_THEMES
} from './constants.tsx';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Apply Theme based on Department
  useEffect(() => {
    if (profile?.department && DEPARTMENT_THEMES[profile.department]) {
      const theme = DEPARTMENT_THEMES[profile.department];
      const root = document.documentElement;
      
      // We map the theme colors to CSS variables
      // Calculating shades or using provided ones
      // For simplicity, I'll use the accent color as the base and let tailwind handle it if I mapped it right
      // But actually, I defined specific shades in index.html, so I should update them here.
      
      // Let's use a mapping for the 50-950 shades based on the accent color
      // Or just update the ones we strictly need.
      // The user wants it to behave like Informatique (Indigo)
      
      const shades = getShades(theme.accent);
      Object.entries(shades).forEach(([shade, value]) => {
        root.style.setProperty(`--brand-${shade}`, value as string);
      });
    }
  }, [profile]);

  // Helper to get hex shades for a tailwind color name (mocking a bit since we don't have a full palette generator)
  const getShades = (accent: string) => {
    const palettes: Record<string, any> = {
      indigo: { 50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81', 950: '#1e1b4b' },
      amber: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f', 950: '#451a03' },
      cyan: { 50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63', 950: '#083344' },
      slate: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617' },
      emerald: { 50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b', 950: '#022c22' },
      rose: { 50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337', 950: '#4c0519' },
    };
    return palettes[accent] || palettes.indigo;
  };

  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [activeDashboardSubPage, setActiveDashboardSubPage] = useState<Page>(Page.Overview);
  const [logo, setLogo] = useState(DEFAULT_LOGO);
  const [appName, setAppName] = useState(APP_NAME);
  const [bgImage, setBgImage] = useState<string | null>(null);

  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mainApps, setMainApps] = useState(DEFAULT_MAIN_APPS);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [appConfig, setAppConfig] = useState<AppConfig>({
    showExamTab: false,
    showDashboardAccess: true,
    allowSignup: true,
    visiblePages: {
      [Page.Overview]: true,
      [Page.Schedule]: true,
      [Page.Subjects]: true,
      [Page.Notes]: true,
      [Page.Annonce]: true,
      [Page.FocusLab]: true,
      [Page.Profile]: true,
      [Page.Admin]: true,
    }
  });
  const [examSchedule, setExamSchedule] = useState<ExamEntry[]>([]);
  
  const [appGroups, setAppGroups] = useState<AppGroup[]>([
    { id: 'g_comm', name: 'Communication', apps: DEFAULT_COMM_APPS, position: 'top-left', visible: true, groupIcon: 'chat' },
    { id: 'g_meet', name: 'Meetings', apps: DEFAULT_MEETING_APPS, position: 'top-left', visible: true, groupIcon: 'video_call' },
    { id: 'g_gen', name: 'General', apps: DEFAULT_GENERAL_APPS, position: 'top-right', visible: true, groupIcon: 'school' },
    { id: 'g_free', name: 'Freedom', apps: DEFAULT_FREEDOM_APPS, position: 'top-right', visible: true, groupIcon: 'mood' },
    { id: 'g_os', name: 'Operating Systems', apps: DEFAULT_OS_APPS, position: 'bottom-left', visible: true, groupIcon: 'terminal' },
    { id: 'g_cyber', name: 'Cybersecurity', apps: DEFAULT_CYBER_APPS, position: 'bottom-right', visible: true, groupIcon: 'security' },
    { id: 'g_net', name: 'Networking', apps: DEFAULT_NET_APPS, position: 'bottom-right', visible: true, groupIcon: 'lan' },
    { id: 'g_dev', name: 'Software Development', apps: DEFAULT_DEV_APPS, position: 'bottom-right', visible: true, groupIcon: 'code' },
    { id: 'g_ai', name: 'AI & ML', apps: DEFAULT_AI_APPS, position: 'bottom-right', visible: true, groupIcon: 'psychology' },
    { id: 'g_linux', name: 'Linux', apps: DEFAULT_LINUX_APPS, position: 'bottom-right', visible: true, groupIcon: 'settings_ethernet' },
    { id: 'g_type', name: 'Typing', apps: DEFAULT_TYPING_APPS, position: 'bottom-right', visible: true, groupIcon: 'keyboard' },
    { id: 'g_ds', name: 'Design', apps: DEFAULT_DESIGN_APPS, position: 'bottom-right', visible: true, groupIcon: 'palette' },
    { id: 'g_cloud', name: 'Cloud', apps: DEFAULT_CLOUD_APPS, position: 'bottom-right', visible: true, groupIcon: 'cloud' },
    { id: 'g_dep', name: 'Deployment', apps: DEFAULT_DEPLOY_APPS, position: 'bottom-right', visible: true, groupIcon: 'rocket_launch' },
    { id: 'g_db', name: 'Database', apps: DEFAULT_DB_APPS, position: 'bottom-right', visible: true, groupIcon: 'database' },
  ]);

  useEffect(() => {
    // Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        fetchAppData();
      }
      else setIsLoading(false);
    });

    // Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        fetchAppData();
      }
      else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAppData = async () => {
    // Fetch Timetable
    const { data: timetableData } = await supabase.from('timetable').select('*');
    if (timetableData) setTimetable(timetableData);

    // Fetch Exams
    const { data: examData } = await supabase.from('exams').select('*').order('date', { ascending: true }).order('start_time', { ascending: true });
    if (examData) setExamSchedule(examData);

    // Fetch Config
    const { data: configData } = await supabase.from('app_config').select('config').eq('id', 'global').single();
    if (configData) setAppConfig(configData.config);

    // Fetch Notes
    const { data: notesData } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
    if (notesData) setNotes(notesData);
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setProfile(data);
    }
    setIsLoading(false);
  };

  const navigateTo = (page: Page) => {
    if (page === Page.Home) {
      setCurrentPage(Page.Home);
    } else {
      setCurrentPage(Page.Dashboard);
      setActiveDashboardSubPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.5em]">Loading Portal...</p>
      </div>
    );
  }

  // Auth Gate: Redirect to Auth if not logged in
  if (!session) {
    return <Auth onAuthSuccess={() => {}} allowSignup={appConfig.allowSignup} />;
  }

  return (
    <div className="min-h-screen transition-all duration-300" style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundAttachment: 'fixed' } : {}}>
      {currentPage === Page.Home ? (
        <Home 
          logo={logo} 
          appName={appName} 
          mainApps={mainApps} 
          appGroups={appGroups} 
          onNavigate={navigateTo} 
          profile={profile}
          showDashboardAccess={appConfig.showDashboardAccess}
        />
      ) : (
        <Dashboard 
          activePage={activeDashboardSubPage}
          onNavigate={navigateTo}
          logo={logo}
          appName={appName}
          setLogo={setLogo}
          setAppName={setAppName}
          setBgImage={setBgImage}
          appGroups={appGroups}
          setAppGroups={setAppGroups}
          mainApps={mainApps}
          setMainApps={setMainApps}
          timetable={timetable}
          setTimetable={setTimetable}
          notes={notes}
          setNotes={setNotes}
          tasks={tasks}
          setTasks={setTasks}
          profile={profile}
          appConfig={appConfig}
          setAppConfig={setAppConfig}
          examSchedule={examSchedule}
          setExamSchedule={setExamSchedule}
        />
      )}
    </div>
  );
};

export default App;
