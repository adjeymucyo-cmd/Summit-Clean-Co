const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const root = process.cwd();
const envPath = path.join(root, '.env.local');
const envRaw = fs.readFileSync(envPath, 'utf8');

const env = Object.fromEntries(
  envRaw
    .split(/\r?\n/)
    .filter((line) => line.includes('='))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index), line.slice(index + 1)];
    })
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error('Missing Supabase environment values.');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

(async () => {
  const email = 'admin@summitclean.com';
  const password = 'SummitClean123!';

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'admin' },
  });

  if (error) {
    const message = error.message || '';
    if (message.toLowerCase().includes('already')) {
      console.log('User already exists.');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      return;
    }
    console.error('Failed to create admin user:', message);
    process.exit(1);
  }

  console.log('Admin user created successfully.');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
})();
