# QUICK FIX - 3 MINUTES

## The Problem
```
Error: Could not find the 'email' column of 'profiles' in the schema cache (PGRST204)
```

## The Root Cause
✅ Database HAS the columns
❌ PostgREST cache doesn't know about them

## The 4-Step Fix

### 1️⃣ Go to Supabase SQL Editor
https://app.supabase.com → Your Project → SQL Editor → New Query

### 2️⃣ Copy This Entire File
[Open this file](../supabase/migrations/01_fix_profiles_contact_schema_and_rls.sql)

Copy ALL of it

### 3️⃣ Paste and Run
Paste in Supabase SQL Editor → Click "Run"

### 4️⃣ Wait and Test
- Wait 5-10 seconds (PostgREST is reloading)
- Clear browser cache: `Ctrl+Shift+Delete`
- Go to http://localhost:3000/signup
- Create account
- Should work! ✅

## Done ✨

If it still fails → Restart your Supabase project in Project Settings
