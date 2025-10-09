# 🔍 Admin Access Error Debugging Guide

## ✅ Issue Fixed - Enhanced Error Notifications

### What Was Changed

1. **Detailed Error Messages in API** (`/app/api/admin/session/elevate/route.ts`)
   - Added comprehensive error logging with specific error codes
   - Distinguishes between different failure scenarios
   - Provides actionable fix suggestions
   - Shows user email and ID for debugging

2. **Enhanced UI Error Display** (`/app/admin/auth/page.tsx`)
   - Shows detailed error messages in toast notifications
   - Displays for longer duration (8-10 seconds) so users can read
   - Includes "How to fix" suggestions
   - Logs full error details to browser console

### Error Types Now Handled

#### 1. Configuration Errors (500)
- **Missing SUPABASE_URL**: Clear message about which env var is missing
- **Missing SERVICE_ROLE_KEY**: Warning when falling back to anon key

#### 2. Authentication Errors (401)
- **Auth Error**: Specific Supabase auth error message
- **Not Signed In**: Clear prompt to sign in at /auth

#### 3. Authorization Errors (403)
- **Not in admin_users table**: Shows user email and ID
- **No admin record found**: Specific message with contact info
- **Database/RLS errors**: Shows error code and hints

#### 4. Database Errors (500)
- **RLS Policy Issues**: Hints about using service role key
- **Connection errors**: Shows actual database error message

### How to Debug Admin Access Issues

#### Step 1: Check Environment Variables
```powershell
# In PowerShell, check if variables are set:
Get-Content .env.local | Select-String "SUPABASE"
```

Required variables:
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Step 2: Restart Dev Server
```powershell
# Stop any running server (Ctrl+C)
# Then restart:
npm run dev
```

**Important**: Environment variables are only loaded when the server starts!

#### Step 3: Try Admin Access
1. Go to `/admin/auth`
2. Click "Continue as Admin"
3. Check the error notification for:
   - **Error title**: Type of error
   - **Details**: Specific cause
   - **How to fix**: Actionable steps
   - **User info**: Your email and ID (if applicable)

#### Step 4: Check Browser Console
Open DevTools (F12) and check Console tab for detailed logs:
```
[Admin Elevate] Checking admin status for user: your@email.com (user-id)
```

### Common Errors & Solutions

#### Error: "Configuration error - NEXT_PUBLIC_SUPABASE_URL is not set"
**Solution**: Add to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://ctixprrqbnfivhepifsa.supabase.co
```

#### Error: "Access denied - Not an admin"
**Details**: "User email@example.com is not in the admin_users table"

**Solution**: Add user to admin_users table via Supabase SQL:
```sql
INSERT INTO admin_users (user_id, role, permissions)
VALUES (
  'user-id-from-error',
  'super_admin',
  ARRAY['all']
);
```

#### Error: "Database error checking admin status (Code: PGRST116)"
**Details**: "Using anon key - may have RLS issues"

**Solution**: 
1. Ensure `SUPABASE_SERVICE_ROLE_KEY` is in `.env.local`
2. Restart dev server to load the variable
3. Or fix RLS policies (see below)

### Fix RLS Policies (if needed)

If you get database errors even with service role key, run this SQL in Supabase:

```sql
-- Allow users to check their own admin status
CREATE POLICY "users_read_own_admin"
ON public.admin_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow admins to view all admin users
CREATE POLICY "admins_read_all"
ON public.admin_users
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.admin_users
  WHERE admin_users.user_id = auth.uid()
));
```

### Quick Test Checklist

- [ ] `.env.local` has all required Supabase variables
- [ ] Dev server restarted after adding variables
- [ ] Signed in with a valid COMSATS email
- [ ] User exists in `auth.users` table
- [ ] User exists in `admin_users` table with role
- [ ] Browser console shows no red errors
- [ ] Error notifications show detailed messages

### Developer Mode Features

In development mode, you get extra debugging info:
- Stack traces in error responses
- Console warnings about missing service role key
- Detailed logs for each step of admin verification

### Testing

Test the error handling:

1. **Test without signing in**: Should show "Not signed in" with redirect prompt
2. **Test with non-admin user**: Should show "Not an admin" with user details
3. **Test with admin user**: Should succeed and set admin cookie

### Need More Help?

Check these logs:
1. **Browser Console** (F12 → Console): Frontend errors
2. **Server Terminal**: API route logs
3. **Supabase Dashboard → Logs**: Database errors

All errors now include:
- ✅ Error type
- ✅ Specific details
- ✅ How to fix
- ✅ User context (email, ID)
- ✅ Environment hints

---

**Remember**: Always restart your dev server after changing `.env.local`!
