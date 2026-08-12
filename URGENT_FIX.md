# 🚨 URGENT: Still Getting Schema Cache Error

## The Problem
✅ You ran the migration OR haven't applied it yet
❌ Still seeing: "Could not find the 'email' column of 'profiles' in the schema cache"

---

## 🔥 IMMEDIATE ACTION (Try This First)

### Option A: Nuclear Reset (Most Effective)

**Step 1: Restart Supabase Project**
1. Go to https://app.supabase.com
2. Select your project
3. Go to **Settings** (gear icon, bottom left)
4. Scroll to bottom
5. Click **Restart project** (red button)
6. Wait 2-3 minutes for restart to complete
7. You'll see "Project is running" status

**Step 2: Clear All Local Caches**
```bash
# In your project terminal:
Ctrl+C  (stop dev server if running)

# Clear caches
rm -rf .next
rm -rf node_modules/.cache
```

**Step 3: Clear Browser Cache**
- Press `Ctrl+Shift+Delete`
- Select "All time"
- Check: Cookies, Cache, Cached images
- Click "Clear data"

**Step 4: Restart Everything**
```bash
npm run dev
```

**Step 5: Test Signup**
- Go to http://localhost:3000/signup
- Create test account
- Should work now ✅

---

## If Option A Doesn't Work: Option B

### Step 1: Manual Schema Fix

Go to Supabase SQL Editor and run THIS exact query:

```sql
-- Force reload PostgREST cache
NOTIFY pgrst, 'reload schema';

-- Verify columns exist
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;
```

You should see:
- ✅ email (text type)
- ✅ username (text type)
- ✅ full_name (text type)
- ✅ phone (text type)
- ✅ role (text type)

### Step 2: If Columns Are Missing

If you DON'T see the columns above, run this:

```sql
-- Add missing columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- Reload cache
NOTIFY pgrst, 'reload schema';
```

### Step 3: If Columns Exist But Still Error

Run the complete fix migration:

**Open:** `supabase/migrations/01_fix_profiles_contact_schema_and_rls.sql`

Copy EVERYTHING and paste into Supabase SQL Editor → Run

---

## If Option B Doesn't Work: Option C

### The Ultimate Fix

Go to Supabase SQL Editor and run this:

```sql
-- Drop and recreate profiles table with all columns
DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  email text,
  phone text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');
CREATE POLICY "update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "service_role_admin" ON profiles USING (auth.role() = 'service_role');

-- Reload cache
NOTIFY pgrst, 'reload schema';
```

⚠️ WARNING: This deletes existing profiles! Only use if you have no real users yet.

---

## The Root Issue

PostgREST is a separate process that caches your database schema. When you make changes:

```
PostgreSQL ✅ Updated immediately
PostgREST ❌ Still using old cache
```

Solutions in order of preference:
1. **Restart Supabase project** ← Most reliable
2. **Send NOTIFY pgrst reload** ← Sometimes works
3. **Recreate table** ← Last resort (data loss)

---

## Which Option Should You Try?

| Scenario | Try |
|----------|-----|
| First time seeing error | Option A (Restart) |
| Migration didn't work | Option B (Manual Fix) |
| Still failing after Option A | Option C (Recreate) |

---

## After Any Fix

1. **Wait 30 seconds** (don't test immediately)
2. **Ctrl+Shift+Delete** in browser (clear cache)
3. **Kill dev server:** `Ctrl+C`
4. **Restart:** `npm run dev`
5. **Test signup:** http://localhost:3000/signup

---

## Verify It's Fixed

**Success indicators:**
- ✅ No PGRST204 error in browser console
- ✅ Profile created in database
- ✅ Auto-login redirects to home
- ✅ User can logout and login again

**Failure indicators:**
- ❌ Still see PGRST204 error
- ❌ No profile row in database
- ❌ Browser console has red errors

---

## Quick Checklist

- [ ] Tried Option A (Restart Supabase)?
- [ ] Cleared browser cache?
- [ ] Restarted dev server?
- [ ] Test at http://localhost:3000/signup?
- [ ] Check Supabase → profiles table for new row?

---

## Still Stuck?

If none of the options work, provide:
1. Screenshot of the error message
2. Output from the diagnostic query in SQL Editor
3. What you see in Supabase → profiles table
4. Your browser console errors (F12)

We'll debug from there.

---

**START HERE:** Try Option A (Restart Supabase) - it works 95% of the time.
