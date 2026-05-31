
import React, { useState } from 'react';
import { Page, AppGroup, AppShortcut, TimetableEntry, Note, Task, Profile, SubjectTab, AppConfig, ExamEntry } from '../types';
import { APP_SHORT_NAME } from '../constants.tsx';
import Overview from './Dashboard/Overview';
import FocusLab from './Dashboard/FocusLab';
import Notes from './Dashboard/Notes';
import HomeConfig from './Dashboard/HomeConfig';
import Schedule from './Dashboard/Schedule';
import Subjects from './Dashboard/Subjects';
import SubjectDetail from './Dashboard/SubjectDetail';
import Annonces from './Dashboard/Annonces';
import AdminPanel from './Dashboard/AdminPanel';
import ProfilePage from './Dashboard/ProfilePage';
import TaskModal from './Dashboard/TaskModal';

interface DashboardProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  logo: string;
  appName: string;
  setLogo: (val: string) => void;
  setAppName: (val: string) => void;
  setBgImage: (val: string | null) => void;
  appGroups: AppGroup[];
  setAppGroups: (val: AppGroup[]) => void;
  mainApps: AppShortcut[];
  setMainApps: (val: AppShortcut[]) => void;
  timetable: TimetableEntry[];
  setTimetable: (val: TimetableEntry[]) => void;
  notes: Note[];
  setNotes: (val: Note[]) => void;
  tasks: Task[];
  setTasks: (val: Task[]) => void;
  profile: Profile | null;
  appConfig: AppConfig;
  setAppConfig: (val: AppConfig) => void;
  examSchedule: ExamEntry[];
  setExamSchedule: (val: ExamEntry[]) => void;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [initialSubjectTab, setInitialSubjectTab] = useState<SubjectTab | undefined>(undefined);
  
  // Task Modal Global State
  const [taskModalData, setTaskModalData] = useState<Partial<Task> | null>(null);

  const isAdmin = props.profile?.role === 'admin' || props.profile?.role === 'super-admin';

  const menuItems = [
    { id: Page.Overview, label: 'Overview', icon: 'grid_view' },
    { id: Page.Annonce, label: 'Annonces', icon: 'campaign' },
    { id: Page.Schedule, label: 'Schedule', icon: 'calendar_month' },
    { id: Page.FocusLab, label: 'Focus Lab', icon: 'timer' },
    { id: Page.Notes, label: 'Notes', icon: 'description' },
    { id: Page.Subjects, label: 'Subjects', icon: 'book' },
    { id: Page.Admin, label: 'Admin Panel', icon: 'admin_panel_settings', adminOnly: true },
    { id: Page.Settings, label: 'Settings', icon: 'settings' },
    { id: Page.Profile, label: 'Profile', icon: 'person' },
  ].filter(item => {
    // Check if page is visible in config
    if (props.appConfig.visiblePages[item.id] === false) return false;
    // Check admin restriction
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  const handleSubjectClick = (id: string, tab?: SubjectTab) => {
    setSelectedSubjectId(id);
    setInitialSubjectTab(tab);
    props.onNavigate(Page.SubjectDetail);
  };

  const renderContent = () => {
    switch (props.activePage) {
      case Page.Overview: return <Overview notes={props.notes} tasks={props.tasks} />;
      case Page.Annonce: return <Annonces tasks={props.tasks} openTaskModal={setTaskModalData} />;
      case Page.FocusLab: return <FocusLab />;
      case Page.Notes: return <Notes notes={props.notes} setNotes={props.setNotes} profile={props.profile} />;
      case Page.Settings: return <HomeConfig {...props} />;
      case Page.Schedule: return (
        <Schedule 
          timetable={props.timetable} 
          tasks={props.tasks} 
          profile={props.profile}
          setTasks={props.setTasks} 
          openTaskModal={setTaskModalData} 
          onSubjectClick={handleSubjectClick}
          appConfig={props.appConfig}
          examSchedule={props.examSchedule}
        />
      );
      case Page.Subjects: return <Subjects onSubjectClick={handleSubjectClick} />;
      case Page.Admin: return isAdmin ? (
        <AdminPanel 
          appConfig={props.appConfig} 
          setAppConfig={props.setAppConfig} 
          examSchedule={props.examSchedule} 
          setExamSchedule={props.setExamSchedule} 
        />
      ) : <Overview notes={props.notes} tasks={props.tasks} />;
      case Page.Profile: return <ProfilePage profile={props.profile} />;
      case Page.SubjectDetail: 
        return selectedSubjectId ? (
          <SubjectDetail 
            subjectId={selectedSubjectId} 
            onBack={() => {
                setSelectedSubjectId(null);
                setInitialSubjectTab(undefined);
                props.onNavigate(Page.Subjects);
            }} 
            notes={props.notes}
            setNotes={props.setNotes}
            tasks={props.tasks}
            setTasks={props.setTasks}
            initialTab={initialSubjectTab}
            openTaskModal={setTaskModalData}
            userRole={props.profile?.role}
          />
        ) : <Subjects onSubjectClick={handleSubjectClick} />;
      default: return (
        <div className="p-10 text-center text-slate-500">
          <span className="material-symbols-outlined text-6xl mb-4">construction</span>
          <p className="text-xl">This page is under construction.</p>
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      {/* Task Creation Modal */}
      {taskModalData && (
        <TaskModal 
          initialData={taskModalData}
          onClose={() => setTaskModalData(null)}
          onSave={(task) => {
            props.setTasks([...props.tasks, task]);
            setTaskModalData(null);
          }}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 z-50 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex items-center p-4 h-16 border-b border-slate-800">
          <img src={props.logo} alt="Logo" className="w-8 h-8 mr-3" />
          {!isSidebarCollapsed && <span className="font-bold text-lg truncate text-white">{APP_SHORT_NAME}</span>}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="ml-auto p-1 text-slate-500 hover:text-brand-400"
          >
            <span className="material-symbols-outlined">{isSidebarCollapsed ? 'menu' : 'menu_open'}</span>
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === Page.Subjects) {
                    setSelectedSubjectId(null);
                    setInitialSubjectTab(undefined);
                }
                props.onNavigate(item.id);
              }}
              className={`w-full flex items-center p-3 rounded-xl transition-all ${
                (props.activePage === item.id || (item.id === Page.Subjects && props.activePage === Page.SubjectDetail))
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {!isSidebarCollapsed && <span className="ml-3 font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-0 w-full px-4">
          <button 
            onClick={() => props.onNavigate(Page.Home)}
            className="w-full flex items-center p-3 rounded-xl text-slate-500 hover:bg-slate-800 hover:text-slate-100 transition-all"
          >
            <span className="material-symbols-outlined">home</span>
            {!isSidebarCollapsed && <span className="ml-3 font-medium">Home Page</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-40">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            {menuItems.find(i => i.id === props.activePage || (i.id === Page.Subjects && props.activePage === Page.SubjectDetail))?.label}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Pseudo Polytech Portal</span>
            <button 
              onClick={() => props.onNavigate(Page.Profile)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border shadow-sm transition-all hover:scale-105 ${isAdmin ? 'bg-brand-900/40 border-brand-500 text-brand-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
            >
              {props.profile?.full_name?.substring(0, 2).toUpperCase() || '??'}
            </button>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
