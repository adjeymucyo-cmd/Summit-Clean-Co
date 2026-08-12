-- ============================================================================
-- DIAGNOSTIC QUERY: Check actual profiles table schema
-- ============================================================================
-- Run this query FIRST to see what columns actually exist in your Supabase database
-- Copy the entire query and run in Supabase SQL Editor

SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- ============================================================================
-- Also check contact_messages schema
-- ============================================================================
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'contact_messages'
ORDER BY ordinal_position;

-- ============================================================================
-- Check RLS policies on profiles
-- ============================================================================
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- ============================================================================
-- Check RLS policies on contact_messages
-- ============================================================================
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'contact_messages';
