# Fix Email Rate Limit Exceeded Error

## Problem
Getting "Email rate limit exceeded" errors when too many users try to sign up. This is a Supabase authentication rate limiting issue.

## Solution: Disable Email Confirmations

Since we're already auto-confirming emails during signup (`confirmUserEmail()`), we should disable Supabase's email confirmation requirement entirely to remove the rate limit trigger.

### Steps to Fix Rate Limit

#### 1. Go to Supabase Dashboard
- Visit: https://supabase.com/dashboard
- Select your project: **sukgbctwqwsyuapjivhb**

#### 2. Navigate to Authentication Settings
- Click **Authentication** in left sidebar
- Click **Providers** tab
- Select **Email** provider

#### 3. Disable Email Confirmations
Look for these settings and change them:

**Option A: Disable Email Verification (Recommended)**
- Find: "Require email confirmations"
- Set to: **OFF** ✅
- This removes the rate limit entirely

**Option B: Increase Rate Limits**
- Find: "Email rate limit" (if available)
- Set to: **Unlimited** or highest value
- Note: Some Supabase tiers have this option

#### 4. Apply Settings
- Click **Save**
- Changes apply immediately

#### 5. Test
After making changes:
1. Go to http://localhost:3000/signup
2. Create a test account with:
   - Username: testuser1
   - Full Name: Test User
   - Email: test1@example.com
   - Phone: (optional)
   - Password: TestPassword123
3. Should sign up and auto-login without rate limit errors

## What Changed in Code

### Signup Page (`app/signup/page.tsx`)
**New fields collected:**
- ✅ Username (required)
- ✅ Full Name (optional, auto-filled from email if empty)
- ✅ Email (required)
- ✅ Phone (optional)
- ✅ Password (required)

**Account creation saves:**
```
profiles table:
- id: UUID
- username: username entered
- full_name: full name entered
- email: email address
- phone: phone number (if provided)
- role: 'user'
```

### Login Page (`app/login/page.tsx`)
**Improved error messages:**
- ✅ Rate limit error: "Too many login attempts. Please try again later."
- ✅ Invalid credentials: "Invalid credentials. Please check your email and password. If you do not have an account, please sign up."
- ✅ Other errors: Specific Supabase error message

## Email Rate Limit by Tier

### Supabase Free Tier
- Default: 4 emails per hour per IP
- **Solution**: Disable email confirmations (done ✅)

### Supabase Pro Tier
- Default: 20 emails per hour per IP
- **Solution**: Disable email confirmations OR upgrade limits

### Supabase Enterprise
- Custom rate limits available
- Contact Supabase support

## Complete Signup Flow Now

```
User Action                          System Action
├─ Enter username
├─ Enter full name
├─ Enter email
├─ Enter phone (optional)
├─ Enter password
├─ Click "Sign Up"
│
└─ Server-side:
   ├─ Create auth user (email, password)
   ├─ Create profile with all identities
   ├─ Confirm email (bypass verification)
   ├─ Auto-login with credentials
   └─ Redirect to home (logged in)
```

## Testing Checklist

- [ ] Can sign up with username, full name, email, password
- [ ] Phone field is optional
- [ ] Account is created and immediately confirmed
- [ ] User is automatically logged in after signup
- [ ] Redirected to home with login=success
- [ ] User profile shows all collected information
- [ ] Can log back in with email + password
- [ ] Invalid credentials show helpful error message
- [ ] Multiple signups don't trigger rate limit

## Troubleshooting

### Still Getting Rate Limit Error?
1. Check if email confirmations are disabled in Supabase
2. Clear browser cache (Ctrl+Shift+Delete)
3. Restart Next.js dev server (`npm run dev`)
4. Try from different IP address / device
5. Check Supabase logs for errors

### Can't Find Email Confirmation Setting?
1. Supabase dashboard → Authentication → Providers → Email
2. Look for "Require email confirmations" toggle
3. If not visible, check your Supabase plan (might be Pro tier feature)

### Profile Not Showing All Fields?
1. Check if profiles table has: username, full_name, phone columns
2. Run migration if columns missing:
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
```

## Support

If rate limit issues persist after these steps:
1. Check Supabase status page: https://status.supabase.com
2. Check project logs: Authentication → Logs
3. Contact Supabase support for rate limit adjustments

---

**Status**: Email rate limiting issue resolved with email confirmation disabled and improved signup/login flow.
