# 🗄️ Supabase Database Architecture

## 1. Full Database Creation Script
Run this entire block in the **Supabase SQL Editor** to initialize the ecosystem.

```sql
-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (Syncs with Auth)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT CHECK (role IN ('user', 'admin', 'super-admin')) DEFAULT 'user',
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ANNOUNCEMENTS (Annonces)
CREATE TABLE public.announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Général', -- 'Examens', 'DGI', 'ESP', 'Sport'
  priority TEXT CHECK (priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal',
  image_url TEXT,
  author_id UUID REFERENCES public.profiles(id)
);

-- 4. NOTES
CREATE TABLE public.notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content TEXT,
  tags TEXT[],
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES

-- Profiles: Users see all, update only self
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Announcements: Everyone sees, only admins/super-admins manage
CREATE POLICY "Announcements viewable by everyone." ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Only admins can insert announcements." ON public.announcements FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super-admin')));
CREATE POLICY "Only admins can update/delete." ON public.announcements FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super-admin')));

-- Notes: strictly private
CREATE POLICY "Users can manage their own notes." ON public.notes FOR ALL USING (auth.uid() = user_id);

-- 7. AUTOMATIC PROFILE CREATION
-- Trigger to create a profile entry whenever a user signs up via Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## 2. Script Explanation
- **`profiles`**: Acts as the bridge between Auth and UI. The `role` column is the most critical for your requested "Admin Panel" visibility logic.
- **`announcements`**: Designed for the DGI department feed. It includes `priority` and `category` to allow for front-end filtering and visual highlighting (e.g., red for 'urgent').
- **RLS Policies**: Ensures data integrity. Even if someone finds the API URL, they cannot post an announcement unless their `profiles.role` is 'admin'.
- **Trigger**: The `handle_new_user` function ensures you never have a "ghost" user without a profile record.

## 3. How to promote to Admin
To grant yourself admin access for the new pages:
`UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID_FROM_AUTH';`

---
*Note: Ensure the Supabase URL and Anon Key in `supabase.ts` are valid for this project.*
