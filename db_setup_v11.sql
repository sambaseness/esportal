-- Database Setup Script v11
-- This script sets up the necessary tables and initial data for the Pseudo Polytech Portal
-- Updated with expanded App Config, Admin management policies, and User metadata storage

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    role TEXT DEFAULT 'user',
    avatar_url TEXT,
    status TEXT DEFAULT 'active',
    metadata JSONB DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'Général',
    priority TEXT DEFAULT 'normal',
    image_url TEXT,
    author_id UUID REFERENCES auth.users
);

-- 3. Notes Table
CREATE TABLE IF NOT EXISTS notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    tags TEXT[],
    pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    subject_id UUID,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    has_deadline BOOLEAN DEFAULT FALSE,
    preferred_start_time TIME,
    duration_minutes INTEGER DEFAULT 60,
    completed BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 1,
    nature TEXT DEFAULT 'duration',
    category TEXT DEFAULT 'SCHOOL',
    recurrence_days INTEGER
);

-- 5. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#6366f1',
    image_url TEXT
);

-- 6. Timetable Table
CREATE TABLE IF NOT EXISTS timetable (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    day INTEGER NOT NULL, -- 1-6 (Mon-Sat)
    start_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    subject_id UUID REFERENCES subjects,
    location TEXT,
    type TEXT CHECK (type IN ('CM', 'TD', 'TP')),
    professor TEXT,
    subject_name TEXT -- Redundant but helpful for quick display
);

-- 7. Exams Table
CREATE TABLE IF NOT EXISTS exams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject_name TEXT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    location TEXT,
    type TEXT CHECK (type IN ('DS', 'Examen', 'Rattrapage'))
);

-- 8. App Config Table
CREATE TABLE IF NOT EXISTS app_config (
    id TEXT PRIMARY KEY,
    config JSONB NOT NULL
);

-- Initial Data for Subjects
INSERT INTO subjects (name, code, color) VALUES
('Architecture des ordinateurs', 'ARCHI', '#f43f5e'),
('Concepts généraux des réseaux', 'RESEAU', '#3b82f6'),
('Fondamentaux d''analyse', 'MATH1', '#10b981'),
('Anglais', 'ENG', '#f59e0b'),
('SGBD', 'DB', '#8b5cf6'),
('Outil d''analyse des circuits linéaires', 'ELEC', '#06b6d4'),
('Outils Mathématiques pour le signal', 'MATH2', '#ec4899'),
('Algorithms', 'ALGO', '#6366f1'),
('Physics', 'PHYS', '#14b8a6')
ON CONFLICT (code) DO NOTHING;

-- Initial Data for Exams (CC Mars 2026)
INSERT INTO exams (subject_name, date, start_time, duration_minutes, location, type) VALUES
('Architecture des ordinateurs (DUT TR)', '2026-03-03', '10:00', 120, 'Amphi A', 'Examen'),
('Algorithms', '2026-03-03', '13:00', 120, 'Amphi A', 'Examen'),
('Concepts généraux des réseaux', '2026-03-04', '08:00', 120, 'Amphi B', 'Examen'),
('Fondamentaux d''analyse', '2026-03-04', '13:00', 120, 'Amphi B', 'Examen'),
('Anglais', '2026-03-04', '15:00', 120, 'Labo Langues', 'Examen'),
('Physics', '2026-03-05', '22:00', 120, 'Amphi A', 'Examen'),
('SGBD (DUT TR)', '2026-03-06', '14:30', 120, 'Amphi C', 'Examen'),
('Outil d''analyse des circuits linéaires', '2026-03-07', '08:00', 120, 'Amphi A', 'Examen'),
('Architecture des ordinateurs (L1 SRT)', '2026-03-07', '10:00', 120, 'Amphi A', 'Examen'),
('Outils Mathématiques pour le signal', '2026-03-07', '13:00', 120, 'Amphi A', 'Examen');

-- Initial App Config (Expanded)
INSERT INTO app_config (id, config) VALUES
('global', '{
    "showExamTab": true,
    "showDashboardAccess": true,
    "allowSignup": true,
    "visiblePages": {
        "overview": true,
        "annonce": true,
        "schedule": true,
        "focus-lab": true,
        "notes": true,
        "subjects": true,
        "profile": true,
        "settings": true,
        "admin": true
    }
}')
ON CONFLICT (id) DO UPDATE SET config = EXCLUDED.config;

-- RLS Policies (Simplified for development)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Announcements are viewable by everyone" ON announcements FOR SELECT USING (true);
CREATE POLICY "Admins can manage announcements" ON announcements FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own notes" ON notes FOR ALL USING (auth.uid() = user_id);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subjects are viewable by everyone" ON subjects FOR SELECT USING (true);
CREATE POLICY "Admins can manage subjects" ON subjects FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Timetable is viewable by everyone" ON timetable FOR SELECT USING (true);
CREATE POLICY "Admins can manage timetable" ON timetable FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Exams are viewable by everyone" ON exams FOR SELECT USING (true);
CREATE POLICY "Admins can manage exams" ON exams FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "App config is viewable by everyone" ON app_config FOR SELECT USING (true);
CREATE POLICY "Admins can update app config" ON app_config FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
