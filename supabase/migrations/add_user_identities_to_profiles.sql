-- Add new identity fields to profiles table
-- This migration adds username, email, and phone columns to store user identities

-- Step 1: Add username column (unique, optional)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Step 2: Add email column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Step 3: Add phone column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- Step 4: Set default role to 'user' if not already set
UPDATE profiles SET role = 'user' WHERE role IS NULL;

-- Step 5: Add constraint to ensure role is valid
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin'));

-- Step 6: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);

-- Step 7: Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- Verification query - run this to verify the changes:
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'profiles'
-- ORDER BY ordinal_position;
