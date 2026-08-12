-- ============================================================================
-- COMPREHENSIVE SCHEMA FIX: Profiles and Contact Messages
-- ============================================================================
-- This migration fixes the PGRST204 "Could not find column in schema cache" errors
-- for both profiles.email and contact_messages.reply_text
--
-- Root Cause: Columns exist in PostgreSQL but PostgREST schema cache is stale
-- Solution: Ensure columns exist, add RLS policies, reload schema cache
--
-- Safe to run multiple times (uses IF NOT EXISTS)
-- ============================================================================

-- ============================================================================
-- PART 1: FIX profiles TABLE
-- ============================================================================

-- Step 1A: Ensure profiles table exists with all required columns
-- Using CREATE TABLE IF NOT EXISTS for new projects
-- Using ALTER TABLE ADD COLUMN IF NOT EXISTS for existing projects

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  email text,
  phone text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 1B: Add missing columns if they don't exist (for existing databases)
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- Step 1C: Ensure role column has proper constraint
ALTER TABLE IF EXISTS profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE IF EXISTS profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin'));

-- Step 1D: Create performance indexes
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);

-- Step 1E: Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 1F: Drop existing RLS policies (safe idempotent approach)
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role full access" ON public.profiles;
DROP POLICY IF EXISTS "Service role bypass" ON public.profiles;

-- Step 1G: Create RLS policies for profiles table
-- Allow users to read their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile (during signup with service role)
CREATE POLICY "profiles_insert_own" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');

-- Allow service role to perform admin operations
CREATE POLICY "profiles_service_role_admin" ON public.profiles
USING (auth.role() = 'service_role');

---============================================================================
-- PART 2: FIX contact_messages TABLE
-- ============================================================================

-- Step 2A: Ensure contact_messages table exists with all required columns
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'opened', 'replied')),
  reply_text text,
  replied_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 2B: Add missing columns if they don't exist
ALTER TABLE IF EXISTS contact_messages ADD COLUMN IF NOT EXISTS reply_text TEXT;
ALTER TABLE IF EXISTS contact_messages ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;

-- Step 2C: Ensure status constraint is correct
ALTER TABLE IF EXISTS contact_messages DROP CONSTRAINT IF EXISTS contact_messages_status_check;
ALTER TABLE IF EXISTS contact_messages ADD CONSTRAINT contact_messages_status_check 
  CHECK (status IN ('new', 'opened', 'replied'));

-- Step 2D: Create performance indexes
CREATE INDEX IF NOT EXISTS contact_messages_status_idx ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON public.contact_messages(created_at);
CREATE INDEX IF NOT EXISTS contact_messages_email_idx ON public.contact_messages(email);

-- Step 2E: Enable RLS on contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Step 2F: Drop existing RLS policies
DROP POLICY IF EXISTS "Anyone can create contact message" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_public_insert" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_authenticated_read" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_authenticated_update" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_service_role_admin" ON public.contact_messages;

-- Step 2G: Create RLS policies for contact_messages table
-- Allow anyone to insert (public contact form)
CREATE POLICY "contact_allow_insert" ON public.contact_messages
FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read their own messages
CREATE POLICY "contact_read_own" ON public.contact_messages
FOR SELECT USING (auth.uid()::text = email OR auth.role() = 'service_role');

-- Allow service role to read/update (for admin dashboard)
CREATE POLICY "contact_service_role_admin" ON public.contact_messages
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- PART 3: RELOAD PostgREST SCHEMA CACHE
-- ============================================================================
-- This is CRITICAL - tells PostgREST to reload its schema cache
-- so it can see the new/modified columns

NOTIFY pgrst, 'reload schema';

-- ============================================================================
-- PART 4: VERIFICATION QUERIES
-- ============================================================================
-- Run these queries to verify the schema was updated correctly

-- Verify profiles table schema:
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'profiles'
-- ORDER BY ordinal_position;

-- Expected output should include:
-- ✅ id (uuid)
-- ✅ username (text)
-- ✅ full_name (text)
-- ✅ email (text) ← THIS WAS MISSING FROM CACHE
-- ✅ phone (text)
-- ✅ role (text)
-- ✅ created_at (timestamptz)
-- ✅ updated_at (timestamptz)

-- Verify contact_messages table schema:
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'contact_messages'
-- ORDER BY ordinal_position;

-- Expected output should include:
-- ✅ id (uuid)
-- ✅ name (text)
-- ✅ email (text)
-- ✅ phone (text)
-- ✅ message (text)
-- ✅ status (text)
-- ✅ reply_text (text) ← THIS WAS MISSING FROM CACHE
-- ✅ replied_at (timestamptz)
-- ✅ created_at (timestamptz)
-- ✅ updated_at (timestamptz)

-- Verify RLS policies exist:
-- SELECT tablename, policyname FROM pg_policies WHERE tablename IN ('profiles', 'contact_messages');
