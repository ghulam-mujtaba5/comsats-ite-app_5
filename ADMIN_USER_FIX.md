# 🔧 FIX: Admin Users Not Showing (fa22-bse-199 Issue)

## 🎯 Your Situation

- ✅ You have an existing super admin: `fa22-bse-199@cuilahore.edu.pk`
- ✅ Admin record exists in Supabase `admin_users` table
- ❌ Admin panel shows: "0 Admin Users"
- ❌ Issue: You're not logged in as that admin user

## 🔍 Root Cause

The admin panel checks `requireAdmin()` which verifies:
1. You're logged in ✅
2. Your user ID exists in `admin_users` table ❌

**Problem:** You're likely logged in with a different account, not `fa22-bse-199@cuilahore.edu.pk`

## ⚡ QUICK FIX (2 Steps)

### Step 1: Login as Your Super Admin

1. **Logout** from current account:
   - Go to: http://localhost:3000
   - Click profile icon → Logout

2. **Login** with your super admin:
   ```
   Email: fa22-bse-199@cuilahore.edu.pk
   Password: [your password]
   ```

3. **Verify** admin access:
   - Go to: http://localhost:3000/admin/users
   - Should now show admin users ✅

---

### Step 2: Verify Database (Optional)

**Check if your user is in admin_users table:**

Run in Supabase SQL Editor:
```sql
-- Find your user ID
SELECT id, email FROM auth.users 
WHERE email = 'fa22-bse-199@cuilahore.edu.pk';

-- Check admin record (replace USER_ID with result from above)
SELECT * FROM admin_users 
WHERE user_id = 'YOUR_USER_ID_HERE';
```

**Expected result:**
- Should return 1 row with `role = 'super_admin'`

**If no row found:**
```sql
-- Insert admin record manually
INSERT INTO admin_users (user_id, role, permissions)
VALUES (
  'YOUR_USER_ID_HERE',  -- Replace with actual user ID
  'super_admin',
  ARRAY['all']
)
ON CONFLICT (user_id) DO UPDATE
SET role = 'super_admin', permissions = ARRAY['all'];
```

---

## 🧪 Alternative: Test API Directly

**While logged in as fa22-bse-199**, visit:
```
http://localhost:3000/api/admin/admin-users
```

**Expected response:**
```json
[
  {
    "id": "...",
    "user_id": "...",
    "role": "super_admin",
    "permissions": ["all"],
    "created_at": "...",
    "user": {
      "email": "fa22-bse-199@cuilahore.edu.pk",
      ...
    }
  }
]
```

**If you see `{"error": "Unauthorized"}`:**
- You're not logged in as an admin
- Check browser cookies (F12 → Application → Cookies)
- Clear cookies and login again

---

## 🔐 About the Third-Party Admin Account

You mentioned:
> "Creates: admin@cuilahore.edu.pk / Admin123!@#  
> because it's third party app"

**This is SEPARATE from your existing admin:**
- `admin@cuilahore.edu.pk` = New default admin (for development/testing)
- `fa22-bse-199@cuilahore.edu.pk` = Your existing super admin ✅

**Both can coexist** - no redundancy issue because:
- Each is a separate user in `auth.users`
- Each has separate entry in `admin_users` table
- The `user_id` column has UNIQUE constraint (prevents duplicates)

---

## ✅ Solution Summary

### If admin users not showing:

**Option 1: Login as correct user**
1. Logout
2. Login as `fa22-bse-199@cuilahore.edu.pk`
3. Go to admin panel
4. ✅ Admin users will show

**Option 2: Add current user as admin**
1. Find current user's ID in Supabase
2. Insert into `admin_users` table (SQL above)
3. Refresh admin panel
4. ✅ Admin users will show

**Option 3: Use dev bypass (development only)**
1. Open browser console (F12)
2. Run:
   ```javascript
   document.cookie = "dev_admin=1; path=/";
   ```
3. Reload page
4. ✅ Admin access granted (dev mode only)

---

## 🚨 Common Issues

### Issue: "Unauthorized - Admin access required"
**Cause:** Not logged in as admin  
**Fix:** Login as `fa22-bse-199@cuilahore.edu.pk`

### Issue: "No Admin Users" still showing
**Cause:** API returning empty array  
**Fix:** Check Supabase → `admin_users` table → verify row exists

### Issue: Two admin accounts confusing
**Cause:** Old system + new system coexisting  
**Fix:** This is normal! Both work independently:
- Keep `fa22-bse-199@cuilahore.edu.pk` (your super admin)
- Optionally delete `admin@cuilahore.edu.pk` if not needed

---

## 📊 Check Current State

Run these in Supabase SQL Editor:

```sql
-- 1. See all admin users
SELECT 
  au.id,
  au.role,
  au.permissions,
  u.email,
  au.created_at
FROM admin_users au
LEFT JOIN auth.users u ON u.id = au.user_id
ORDER BY au.created_at DESC;

-- 2. See who you're logged in as (browser session)
-- This can only be checked in browser console:
-- 1. Go to http://localhost:3000
-- 2. Open console (F12)
-- 3. Run: 
--    fetch('/api/admin/session').then(r=>r.json()).then(console.log)
```

---

## ✅ Expected Final State

After logging in as `fa22-bse-199@cuilahore.edu.pk`:

```
Admin Panel → Admin Users Tab:

┌─────────────────────────────────────┐
│ [Crown] 1 Administrator             │
│                                     │
│ fa22-bse-199@cuilahore.edu.pk      │
│ [super_admin]                       │
│ Admin since [date]                  │
│ [Revoke Access] [Manage Access]     │
└─────────────────────────────────────┘
```

---

## 🎯 Quick Checklist

- [ ] Logged in as `fa22-bse-199@cuilahore.edu.pk`
- [ ] User exists in `auth.users` table
- [ ] User exists in `admin_users` table with role = 'super_admin'
- [ ] Visited http://localhost:3000/admin/users
- [ ] Clicked "Admin Users" tab
- [ ] See admin user(s) displayed ✅

---

**Most likely fix: Just login as the correct admin user!** 🎉
