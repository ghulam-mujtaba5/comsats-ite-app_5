# 🚨 ADMIN ACCESS FIX GUIDE

## Problem
Your admin promotion system is failing because of **Row Level Security (RLS) policies** on the `admin_users` table. The current policies are too restrictive and prevent:
- Listing all admin users
- Promoting users to admin
- Managing admin roles

## Root Cause
The `admin_users` table has RLS enabled with policies that only allow users to see their own row:
```sql
CREATE POLICY "admin_users_self_read" ON "public"."admin_users" 
FOR SELECT USING (user_id = auth.uid());
```

This means when your app tries to:
- List all admins → ❌ Blocked (can only see yourself)
- Promote user → ❌ Blocked (can't insert for another user)
- Update roles → ❌ Blocked (can't update another user's row)

## Quick Fix (5 minutes)

### Option 1: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in sidebar
   - Click "New query"

3. **Run this SQL** (copy-paste):

```sql
-- Step 1: Drop restrictive policies
DROP POLICY IF EXISTS "admin_users_self_read" ON public.admin_users;
DROP POLICY IF EXISTS "read own admin row" ON public.admin_users;

-- Step 2: Allow authenticated users to read admin_users
CREATE POLICY "authenticated_read_admin_users" 
ON public.admin_users 
FOR SELECT 
TO authenticated 
USING (true);

-- Step 3: Allow super_admins to manage admins
CREATE POLICY "super_admin_manage_admin_users" 
ON public.admin_users 
FOR ALL
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin'
  )
);

-- Step 4: Add yourself as super_admin (REPLACE EMAIL!)
INSERT INTO public.admin_users (user_id, role, permissions)
SELECT 
  id,
  'super_admin',
  ARRAY['all']
FROM auth.users
WHERE email = 'YOUR_EMAIL@cuilahore.edu.pk'  -- ⚠️ CHANGE THIS!
ON CONFLICT (user_id) 
DO UPDATE SET 
  role = 'super_admin',
  permissions = ARRAY['all'];

-- Step 5: Verify it worked
SELECT 
  au.role,
  au.permissions,
  u.email,
  au.created_at
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE u.email = 'YOUR_EMAIL@cuilahore.edu.pk';  -- ⚠️ CHANGE THIS!
```

4. **Replace YOUR_EMAIL@cuilahore.edu.pk** with your actual email in **2 places**

5. **Click "Run"**

6. **Verify the output** shows your user with `super_admin` role

7. **Test in your app**
   - Refresh the admin page
   - You should now see all admins
   - Try promoting another user

---

### Option 2: Using Supabase CLI

1. **Run the fix script**:
   ```powershell
   .\scripts\fix-admin-cli.ps1
   ```

2. **Follow the prompts**

3. **Choose option 3** (migration + verification)

---

### Option 3: Manual Database Fix (If desperate)

If you're completely locked out:

1. **Go to Supabase Dashboard → Database → Tables**

2. **Click on `admin_users` table**

3. **Click "Insert row"**

4. **Fill in**:
   - `user_id`: Your user ID (get from auth.users table)
   - `role`: `super_admin`
   - `permissions`: `["all"]`

5. **Click "Save"**

6. **Disable RLS temporarily** (dangerous but works):
   ```sql
   ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;
   ```

7. **Test your app**, then **re-enable RLS**:
   ```sql
   ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
   ```

8. **Apply proper policies** using Option 1 above

---

## Verify Fix Worked

### Test 1: Check Database
```sql
-- Should show ALL admin users
SELECT 
  au.id,
  au.role,
  au.permissions,
  u.email
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
ORDER BY au.created_at DESC;
```

### Test 2: Check RLS Policies
```sql
-- Should show new policies
SELECT 
  policyname,
  cmd,
  roles,
  qual
FROM pg_policies
WHERE tablename = 'admin_users';
```

Expected output:
- `authenticated_read_admin_users` (SELECT, authenticated)
- `super_admin_manage_admin_users` (ALL, authenticated with super_admin check)

### Test 3: Test in App
1. Login to your app
2. Go to `/admin/users`
3. You should see list of all users
4. Click "Promote" on a user
5. Select role and permissions
6. Should succeed without "Failed to promote user" error

---

## Why This Fixes It

### Before (Broken):
```
User tries to promote someone
  ↓
API calls supabase.from('admin_users').insert()
  ↓
RLS policy: "Only allow reading own row"
  ↓
❌ BLOCKED - Can't insert for another user
```

### After (Fixed):
```
User tries to promote someone
  ↓
API calls supabaseAdmin.from('admin_users').insert()
  ↓
RLS policy: "Allow if requester is super_admin"
  ↓
Checks: Is current user a super_admin?
  ↓
✅ ALLOWED - Insert succeeds
```

---

## Long-term Fix

The migration file `20251009000000_fix_admin_users_rls.sql` contains the proper fix. To apply:

### Local Development:
```bash
supabase db push
```

### Production:
```bash
supabase db push --linked
```

Or apply the SQL manually in Supabase Dashboard.

---

## Troubleshooting

### Still can't see admins?
**Clear browser cache and cookies**, then login again.

### "Permission denied" error?
Your user is not in `admin_users` table. Run Step 4 from Option 1.

### Can see admins but can't promote?
Your role is `admin` not `super_admin`. Update:
```sql
UPDATE admin_users 
SET role = 'super_admin' 
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'YOUR_EMAIL@cuilahore.edu.pk'
);
```

### Service role key not working?
Check `.env.local`:
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...  (should be long JWT token)
```

If missing, get it from:
Supabase Dashboard → Settings → API → `service_role` key

---

## Files Created

✅ `supabase/migrations/20251009000000_fix_admin_users_rls.sql` - Migration file
✅ `scripts/fix-admin-access.sql` - Manual SQL script  
✅ `scripts/fix-admin-cli.ps1` - Automated fix script
✅ `app/api/admin/admin-users/route.ts` - Improved error handling

---

## Next Steps

1. ✅ Fix RLS policies (use Option 1 above)
2. ✅ Add yourself as super_admin
3. ✅ Test promoting another user
4. ⬜ Apply migration to production
5. ⬜ Document who should have super_admin access
6. ⬜ Add audit logging for admin promotions (already in code!)

---

**Need help?** Check:
- Supabase logs: Dashboard → Logs
- Browser console: F12 → Console tab
- API response: Network tab → Look for `/api/admin/admin-users` request
