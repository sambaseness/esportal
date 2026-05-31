
export type UserRole = 'user' | 'admin' | 'super-admin';

export type Department = 
  | 'Genie Informatique'
  | 'Genie Civil'
  | 'Genie Electrique'
  | 'Genie Mechanique'
  | 'Genie Chimique et Biologie Appliquee'
  | 'Gestion';

export type Level = 
  | 'DUT 1'
  | 'DUT 2'
  | 'DIC 1'
  | 'DIC 2'
  | 'DIC 3';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  department?: Department;
  level?: Level;
  avatar_url: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  created_at: string;
  title: string;
  content: string;
  category: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  image_url?: string;
  author_id: string;
}

export interface AppShortcut {
  id: string;
  name: string;
  url: string;
  icon?: string;
  iconType?: 'url' | 'symbol';
  color?: string;
}

export interface AppGroup {
  id: string;
  name: string;
  apps: AppShortcut[];
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  visible: boolean;
  groupIcon?: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  image_url?: string;
}

export interface CourseMaterial {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'zip' | 'link' | 'code' | 'png';
  path?: string; 
  content?: string;
  is_official?: boolean; // Added for broadcast logic
}

export interface SubjectMaterials {
  cm: CourseMaterial[];
  td: CourseMaterial[];
  tp: CourseMaterial[];
}

export type TaskNature = 'instant' | 'duration';
export type TaskCategory = 'SCHOOL' | 'GENERAL' | 'PERSONAL' | 'RELIGIOUS';

export interface Task {
  id: string;
  subject_id?: string;
  title: string;
  description?: string;
  due_date?: string; // Specific date string
  has_deadline?: boolean;
  preferred_start_time?: string; // HH:mm
  duration_minutes?: number;
  completed: boolean;
  priority: number; 
  nature: TaskNature;
  category: TaskCategory;
  recurrence_days?: number; // Every X days
}

export interface TimetableEntry {
  id: string;
  day: number; // 1-6 (Mon-Sat)
  start_time: string; // HH:mm
  duration_minutes: number;
  subject_id: string;
  location: string;
  type: 'CM' | 'TD' | 'TP';
  professor?: string;
  subject_name?: string;
}

export interface ExamEntry {
  id: string;
  subject_name: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  duration_minutes: number;
  location: string;
  type: 'DS' | 'Examen' | 'Rattrapage';
}

export interface AppConfig {
  showExamTab: boolean;
  showDashboardAccess: boolean;
  allowSignup: boolean;
  visiblePages: {
    [key in Page]?: boolean;
  };
}

export type SubjectTab = 'CM' | 'TD' | 'TP' | 'Notes' | 'Tasks' | 'Khints' | 'Else';

export enum Page {
  Home = 'home',
  Dashboard = 'dashboard',
  Overview = 'overview',
  Schedule = 'schedule',
  FocusLab = 'focus-lab',
  Notes = 'notes',
  Subjects = 'subjects',
  SubjectDetail = 'subject-detail',
  Timetable = 'timetable',
  Annonce = 'annonce',
  Profile = 'profile',
  Settings = 'settings',
  Admin = 'admin'
}
