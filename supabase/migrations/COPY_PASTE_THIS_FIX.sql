-- ============================================================================
-- SIMPLE FIX: Copy this ENTIRE query and paste in Supabase SQL Editor → Run
-- ============================================================================

-- Step 1: Add missing columns if they don't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Step 2: Verify columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Step 3: Add RLS policies
DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "service_role_all" ON profiles;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_profile" ON profiles 
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_insert_own_profile" ON profiles 
FOR INSERT WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');

CREATE POLICY "users_update_own_profile" ON profiles 
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "service_role_all" ON profiles 
USING (auth.role() = 'service_role');

-- Step 4: RELOAD POSTGREST CACHE (THIS IS CRITICAL)
NOTIFY pgrst, 'reload schema';

-- Done! You should see success messages above.
-- After this, wait 10 seconds, then restart your dev server and test signup.
