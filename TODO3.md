# 🛡️ Supabase Administrative Control - TODO 3

## 1. Advanced User Management
Run this script to enable account restrictions, banning, and system logs for administrative actions.

```sql
-- 1. EXTEND PROFILES WITH STATUS
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('active', 'restricted', 'banned')) DEFAULT 'active';

-- 2. ADMINISTRATIVE AUDIT LOGS
CREATE TABLE public.admin_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  admin_id UUID REFERENCES public.profiles(id),
  target_user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL, -- 'KICK', 'BAN', 'RESTRICT', 'RESTORE'
  reason TEXT,
  metadata JSONB
);

-- 3. RLS FOR LOGS
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view logs" ON public.admin_logs
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super-admin'))
);

CREATE POLICY "Admins can insert logs" ON public.admin_logs
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super-admin'))
);

-- 4. SECURITY CHECK FUNCTION
-- You can use this in your other RLS policies to auto-block banned users
-- Example: AND (SELECT status FROM profiles WHERE id = auth.uid()) != 'banned'
```

## 2. Admin Power Operations
In the `AdminPanel`, you can now execute these logic updates:

- **Restrict**: Sets `status` to `restricted`. User can login but cannot post or upload.
- **Ban**: Sets `status` to `banned`. User is immediately blocked from data access via RLS.
- **Kick**: Purely UI-driven for now (kills session in local simulation), but logs the event.

## 3. Real-time Enforcement
If a user's status changes to 'banned', the client-side `App.tsx` should ideally listen for changes to the `profiles` table and trigger an auto-logout.
