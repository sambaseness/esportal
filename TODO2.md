
# 🗄️ Supabase Advanced Logic - TODO 2

## 1. Materials & Hub Tables
Run this script to allow Admin Broadcasts of CM/TD/TP and support for Khints/Else tabs.

```sql
-- 1. MATERIALS TABLE (Official + User Uploads)
CREATE TABLE public.materials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subject_id TEXT NOT NULL,
  type TEXT CHECK (type IN ('CM', 'TD', 'TP')) NOT NULL,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT 'pdf',
  is_official BOOLEAN DEFAULT false, -- If TRUE, broadcast to all. If FALSE, user-specific.
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. KHINTS & ELSE TABLES
CREATE TABLE public.subject_insights (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subject_id TEXT NOT NULL,
  tab TEXT CHECK (tab IN ('khints', 'else')) NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. STORAGE BUCKETS
-- You must manually create 'course-materials' bucket in Supabase Dashboard and set it to Public.

-- 4. RLS POLICIES

-- Materials: 
-- Everyone can see Official ones.
CREATE POLICY "Public see official materials" ON public.materials 
FOR SELECT USING (is_official = true);

-- Users see their own private uploads.
CREATE POLICY "Users see own materials" ON public.materials 
FOR SELECT USING (auth.uid() = user_id);

-- Admins can insert official materials.
CREATE POLICY "Admins insert official" ON public.materials 
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super-admin'))
);

-- Users can insert their own private materials.
CREATE POLICY "Users insert private" ON public.materials 
FOR INSERT WITH CHECK (auth.uid() = user_id AND is_official = false);
```

## 2. Admin Panel Integration
The "User Files Explorer" in the Admin Panel now has a target table (`materials`) where you can moderate files uploaded by students.

### Promotion Query
To promote a student's TD to "Official" (broadcasted):
`UPDATE public.materials SET is_official = true WHERE id = 'MATERIAL_UUID';`

## 3. Storage Organization
Recommendation for the `course-materials` bucket:
`/{subject_code}/{type}/{filename}`
Example: `/ALGO1/CM/recursion_v1.pdf`
