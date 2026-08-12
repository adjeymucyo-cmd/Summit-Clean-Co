-- Enable Row Level Security (RLS) on profiles table
-- This ensures that users can only access their own profile data
-- while the service role client can perform admin operations

-- Enable RLS on profiles table
alter table if exists profiles enable row level security;

-- Drop existing policies if they exist (safe with if exists in newer Postgres)
drop policy if exists "Users can read own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Users can create own profile" on profiles;
drop policy if exists "Service role bypass" on profiles;

-- Allow users to read their own profile
create policy "Users can read own profile" 
on profiles for select 
using (auth.uid() = id);

-- Allow users to update their own profile
create policy "Users can update own profile" 
on profiles for update 
using (auth.uid() = id);

-- Allow users to create their own profile during signup
create policy "Users can create own profile" 
on profiles for insert 
with check (auth.uid() = id);

-- Service role can perform any operation (for admin functions like signup)
-- This policy allows the service role client to bypass RLS for user creation
create policy "Service role full access" 
on profiles
using (auth.role() = 'service_role');

-- Notify PostgREST to reload the schema cache
notify pgrst, 'reload schema';
