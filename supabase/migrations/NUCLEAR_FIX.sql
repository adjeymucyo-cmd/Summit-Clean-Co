-- ============================================================================
-- IMMEDIATE FIX FOR: Could not find the 'email' column of 'profiles'
-- ============================================================================
-- Copy this ENTIRE query, paste in Supabase SQL Editor, and run it.
-- This is the most direct fix possible.
-- ============================================================================

-- 1. Drop and recreate profiles table with guaranteed correct schema
-- Only use this if you have NO real user data yet
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Create profiles table with all required columns
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  email text,
  phone text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Create indexes for performance
CREATE INDEX profiles_username_idx ON public.profiles(username);
CREATE INDEX profiles_email_idx ON public.profiles(email);

-- 4. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies
CREATE POLICY "profiles_select_own" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');

CREATE POLICY "profiles_update_own" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_service_role" ON public.profiles
USING (auth.role() = 'service_role');

-- 6. CRITICAL: Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- 7. Verification query - should show all columns
SELECT column_name, data_type, is_nullable FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- ============================================================================
-- Expected output from step 7:
-- column_name      | data_type           | is_nullable
-- ============================================================================
-- id               | uuid                | NO
-- username         | text                | YES
-- full_name        | text                | YES
-- email            | text                | YES  ← This is what was missing!
-- phone            | text                | YES
-- role             | text                | NO
-- created_at       | timestamp with tz   | NO
-- updated_at       | timestamp with tz   | NO
-- ============================================================================
-- If you see email column in the results above, the fix worked!
-- ============================================================================
