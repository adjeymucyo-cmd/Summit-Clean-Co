-- Fix contact_messages table schema
-- This migration adds proper constraints and ensures reply_text column exists

-- Step 1: Drop existing check constraint if it exists
ALTER TABLE contact_messages DROP CONSTRAINT IF EXISTS contact_messages_status_check;

-- Step 2: Ensure reply_text column exists (it should already, but just in case)
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS reply_text text;

-- Step 3: Add proper check constraint for status values
ALTER TABLE contact_messages 
ADD CONSTRAINT contact_messages_status_check 
CHECK (status IN ('new', 'opened', 'replied'));

-- Step 4: Refresh the schema cache
-- Note: In Supabase UI, you may need to manually refresh the schema cache
-- Go to Project Settings > Database > Schema Cache > Clear Cache
