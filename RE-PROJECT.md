# 📂 RE-PROJECT: Pseudo Polytech Portal (PPP) - The Absolute Master Manifest

This document is the "Single Source of Truth" for the **Pseudo Polytech Portal (PPP)**. It includes the official vision, the complete technical database architecture (consolidated from TODO 1, 2, and 3), and the raw, chronological history of development prompts.

---

## 🌐 Part 1: Official Project Identity (README)

**Pseudo Polytech Portal (PPP)** is a student-centric academic operating system designed for the **École Supérieure Polytechnique (ESP)**, specifically for the **Département Génie Informatique (DGI)**.

### 🎯 Core Principles
- **Academic Priority**: Timetables are fixed and override personal tasks.
- **Zero Friction**: Replaces the browser's new tab for instant access to tools.
- **Progressive Disclosure**: UI complexity fades based on current academic context.
- **Institutional Identity**: Incorporates ESP culture (Valeurs, Serment).

---

## ⚡ Part 2: Master SQL Schema (Consolidated TODO 1, 2, 3)

Run this entire block in the **Supabase SQL Editor** to initialize the ecosystem.

```sql
-- ==========================================
-- MASTER INITIALIZATION (TODO 1, 2, 3 Combined)
-- ==========================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES & ROLES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT CHECK (role IN ('user', 'admin', 'super-admin')) DEFAULT 'user',
  status TEXT CHECK (status IN ('active', 'restricted', 'banned')) DEFAULT 'active',
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ANNOUNCEMENTS (Annonces)
CREATE TABLE public.announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Général',
  priority TEXT CHECK (priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal',
  image_url TEXT,
  author_id UUID REFERENCES public.profiles(id)
);

-- 4. NOTES
CREATE TABLE public.notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  tags TEXT[],
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ACADEMIC MATERIALS (CM/TD/TP)
CREATE TABLE public.materials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subject_id TEXT NOT NULL,
  type TEXT CHECK (type IN ('CM', 'TD', 'TP')) NOT NULL,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT 'pdf',
  is_official BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 6. SUBJECT INSIGHTS (Khints & Else)
CREATE TABLE public.subject_insights (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subject_id TEXT NOT NULL,
  tab TEXT CHECK (tab IN ('khints', 'else')) NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ADMINISTRATIVE AUDIT LOGS
CREATE TABLE public.admin_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  admin_id UUID REFERENCES public.profiles(id),
  target_user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  reason TEXT,
  metadata JSONB
);

-- 8. SECURITY POLICIES (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Public select, Self update
CREATE POLICY "Public profiles viewable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Self-update only" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Announcements: Public select, Admin all
CREATE POLICY "Announcements public" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Admin manage annon" ON public.announcements FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super-admin')));

-- Notes: Private
CREATE POLICY "Notes private" ON public.notes FOR ALL USING (auth.uid() = user_id);

-- Materials: Official public, User private
CREATE POLICY "Official mats public" ON public.materials FOR SELECT USING (is_official = true);
CREATE POLICY "User mats private" ON public.materials FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin insert official mats" ON public.materials FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super-admin'))
);
CREATE POLICY "User insert private mats" ON public.materials FOR INSERT WITH CHECK (auth.uid() = user_id AND is_official = false);

-- 9. AUTH TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

---

## 📜 Part 3: Chronological Development History (Full Raw Logs)

### 📍 Prompt History: First Phase
"create a pwa with a brower start page model as the home page. it will have a search bar, a logo... apps for communication on the top left, knowledge on the top right... a dashboard with a sidebar, a schedule page for ESP DGI..."

### 📍 Prompt History: Second Phase
"under the search bar the main apps that will be there will be huawei, openclassrooms, bro code, neso, cs50... communication corner logos: whatsapp, telegram, discord... top right corner: geeksforgeeks, w3schools, stack overflow... bottom left: windows, ubuntu... bottom right: cybersecurity, networking, software dev, ai, linux, typing, design, cloud, database, meetings..."

### 📍 Prompt History: Modification Cycle
"use a dark theme... timetable content fused into schedule with a toggle... subjects cards with elevation and images (reseaux, sgbd, etc)... add Khints and Else tabs... Admin Panel with user ejection (BAN, KICK)... tasks turn redder as deadline approaches... profile page with rank and status..."

---

## 🛠 Part 4: Project Management & Technical Specs
- **Lead Developer**: Samba Sene
- **Tech Stack**: React 19, TypeScript, Tailwind CSS, Supabase.
- **Environment**: PWA, Mobile Responsive, Dark Glassmorphism.
- **Admin Commands**:
    - **Promote**: `UPDATE profiles SET role = 'admin' WHERE id = '...';`
    - **Ban**: `UPDATE profiles SET status = 'banned' WHERE id = '...';`

**Manifest Status: Synchronized & Exhaustive.**
