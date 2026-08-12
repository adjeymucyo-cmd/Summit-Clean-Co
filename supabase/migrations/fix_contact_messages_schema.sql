-- Fix contact_messages table schema
-- This migration ensures all required columns exist and the schema is properly recognized by PostgREST

-- Step 1: Ensure contact_messages table exists
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Step 2: Add reply_text column if it doesn't exist
ALTER TABLE public.contact_messages
ADD COLUMN IF NOT EXISTS reply_text text;

-- Step 3: Add replied_at column if it doesn't exist
ALTER TABLE public.contact_messages
ADD COLUMN IF NOT EXISTS replied_at timestamptz;

-- Step 4: Ensure status column has the correct check constraint
ALTER TABLE public.contact_messages
DROP CONSTRAINT IF EXISTS contact_messages_status_check;

ALTER TABLE public.contact_messages
ADD CONSTRAINT contact_messages_status_check
CHECK (status IN ('new', 'opened', 'replied'));

-- Step 5: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS contact_messages_status_idx ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON public.contact_messages(created_at);
CREATE INDEX IF NOT EXISTS contact_messages_email_idx ON public.contact_messages(email);

-- Step 6: Ensure RLS is enabled
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Step 7: Drop existing policies if they exist
DROP POLICY IF EXISTS contact_public_insert ON public.contact_messages;
DROP POLICY IF EXISTS contact_authenticated_read ON public.contact_messages;
DROP POLICY IF EXISTS contact_authenticated_update ON public.contact_messages;

-- Step 8: Create RLS policies for public insert (anyone can submit a message)
CREATE POLICY contact_public_insert ON public.contact_messages
FOR INSERT WITH CHECK (true);

-- Step 9: Create RLS policies for authenticated admins to read
-- (Note: Service role bypasses RLS, but this is for future authenticated admin use)
CREATE POLICY contact_authenticated_read ON public.contact_messages
FOR SELECT
USING (auth.role() = 'authenticated');

-- Step 10: Create RLS policies for authenticated admins to update
CREATE POLICY contact_authenticated_update ON public.contact_messages
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Step 11: Force PostgREST to reload the schema cache
-- This notifies PostgreSQL to notify PostgREST listeners about schema changes
NOTIFY pgrst, 'reload schema';

-- Step 12: Verification query
-- Run this after applying the migration to verify everything is in place:
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'contact_messages'
-- ORDER BY ordinal_position;
