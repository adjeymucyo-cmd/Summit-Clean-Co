# Fix Contact Message Reply System - Complete Instructions

## Problem Summary
When admins try to reply to contact messages, they get this error:
```
Could not find the 'reply_text' column of 'contact_messages' in the schema cache
```

## Root Cause
1. The `reply_text` column was defined in the schema but PostgREST's schema cache wasn't reloaded
2. The `replied_at` column was missing from the schema definition
3. RLS policies for admin read/update were not defined

## Solution Steps

### Step 1: Go to Your Supabase Dashboard
1. Visit https://supabase.com/dashboard
2. Select your project: **sukgbctwqwsyuapjivhb**

### Step 2: Open SQL Editor
1. Click **SQL Editor** in the left sidebar
2. Click **New Query** button

### Step 3: Copy and Run the Migration Script

Copy this entire SQL script and paste it into your SQL Editor:

```sql
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
CREATE POLICY contact_authenticated_read ON public.contact_messages
FOR SELECT
USING (auth.role() = 'authenticated');

-- Step 10: Create RLS policies for authenticated admins to update
CREATE POLICY contact_authenticated_update ON public.contact_messages
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Step 11: Force PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';
```

### Step 4: Execute the Script
1. Click the **Run** button (or press Ctrl+Enter)
2. Wait for the script to complete
3. You should see "Success" at the bottom

### Step 5: Verify the Fix

Run this verification query in a new SQL Editor query:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'contact_messages'
ORDER BY ordinal_position;
```

You should see these columns:
- ✅ id (uuid, not null)
- ✅ name (text, not null)
- ✅ email (text, not null)
- ✅ phone (text, nullable)
- ✅ message (text, not null)
- ✅ status (text)
- ✅ **reply_text (text, nullable)** ← This is the key one!
- ✅ **replied_at (timestamp with time zone, nullable)** ← This should be here too!
- ✅ created_at (timestamp with time zone)
- ✅ updated_at (timestamp with time zone)

### Step 6: Verify RLS Policies

Run this to verify policies were created:

```sql
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'contact_messages'
ORDER BY policyname;
```

You should see:
- ✅ contact_public_insert (INSERT)
- ✅ contact_authenticated_read (SELECT)
- ✅ contact_authenticated_update (UPDATE)

### Step 7: Restart Your Dev Server

Go back to your terminal and restart the Next.js dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 8: Test the Reply System

1. Go to http://localhost:3000/admin/messages
2. Select a contact message
3. Type a reply in the reply text area
4. Click "Send" or "Reply" button
5. Check the console for the `[REPLY]` logs
6. The message should now:
   - ✅ Update the reply_text in database
   - ✅ Set status to 'replied'
   - ✅ Show no schema cache error
   - ✅ Show success message (or email delivery status)

## Troubleshooting

### Still Getting Schema Cache Error?

If you still see the error after running the migration:

**Option A: Restart Supabase Project**
1. Go to Supabase **Settings → General**
2. Scroll to bottom and click **"Restart Project"**
3. Wait 2-3 minutes
4. Restart your Next.js dev server
5. Try replying again

**Option B: Force Schema Cache Reload**
Run this in SQL Editor:
```sql
NOTIFY pgrst, 'reload schema';
```
Then wait 5 seconds and try replying again.

### Can't See the Columns in Table Editor?

1. Go to **Table Editor** → **contact_messages**
2. Refresh the page (F5)
3. You should now see reply_text and replied_at columns

### Database Shows Table Doesn't Exist?

The table was created by the Supabase project already. The migration will ensure all columns are present and properly configured.

## What Was Changed

### Schema Changes:
- ✅ Added `replied_at TIMESTAMPTZ` column
- ✅ Verified `reply_text TEXT` exists
- ✅ Added proper status check constraint
- ✅ Created performance indexes
- ✅ Added RLS policies for authenticated users

### Application Code:
- ✅ Verified contact-actions.ts uses correct column names
- ✅ Verified TypeScript types match schema (reply_text: string | null)
- ✅ Service role client used for admin operations

### Why This Fixes the Issue:
1. The migration explicitly creates/verifies all columns exist
2. It reloads PostgREST's schema cache with `NOTIFY pgrst, 'reload schema'`
3. RLS policies are properly defined for admin access
4. The service-role client bypasses RLS but policies provide security layer

## Verification Checklist

After applying this fix, verify:

- [ ] No "schema cache" errors in console
- [ ] Reply saves to database successfully
- [ ] Status changes to "replied"
- [ ] reply_text shows the admin's message
- [ ] Admin can open message and see their reply
- [ ] Multiple messages can be replied to
- [ ] No existing messages were deleted
- [ ] Public contact form still works
- [ ] Email delivery works (with valid Resend API key)

## Next Steps After Fix

1. **Email Delivery** - Add Resend API key to `.env.local`:
   ```
   RESEND_API_KEY=re_your_actual_key_here
   FROM_EMAIL=onboarding@resend.dev
   ```

2. **Test Full Workflow**:
   - Submit test contact message
   - Admin replies
   - Verify message saved
   - Verify email delivered (if Resend key configured)
   - Reload admin page
   - Reply should still be visible

## Files Updated

Local project files that were updated with this fix:
- `supabase-schema.sql` - Added replied_at column and RLS policies
- `supabase/migrations/fix_contact_messages_schema.sql` - Comprehensive migration
- `lib/types.ts` - Already had correct types (no change needed)
- Application code - Already correct (no change needed)

## Support

If you still have issues after following these steps:
1. Check the browser console for error messages
2. Check Supabase logs for database errors
3. Verify your Supabase URL and keys in `.env.local`
4. Ensure you're logged into the correct Supabase project
5. Make sure you have admin permissions in Supabase

---

**Status**: This fix should resolve the "reply_text column not found" error and allow admins to successfully reply to contact messages.
