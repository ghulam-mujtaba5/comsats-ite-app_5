# 🚀 Quick Start - Testing Admin Access

## 1️⃣ Restart Dev Server (Required!)

```powershell
.\restart-dev.ps1
```

**Why?** Environment variables only load when server starts.

---

## 2️⃣ Test in Browser

### Option A: Diagnostic Tool (Recommended)
```
http://localhost:3000/test-admin-access.html
```
- Click "2. Test Admin Elevate"
- Read detailed error in logs
- One-click fixes available

### Option B: Admin Auth Page
```
http://localhost:3000/admin/auth
```
- Click "Continue as Admin"
- Error notification shows 10 seconds
- Check F12 console for details

---

## 3️⃣ Common Errors & Fixes

### ❌ "User not in admin_users table"

**Shows:** Your email and user ID

**Fix:** Run in Supabase SQL Editor
```sql
INSERT INTO admin_users (user_id, role, permissions)
VALUES ('YOUR-USER-ID', 'super_admin', ARRAY['all']);
```

---

### ❌ "Not signed in"

**Fix:** 
1. Go to `/auth`
2. Sign in with COMSATS email
3. Try admin auth again

---

### ❌ "Configuration error - SUPABASE_URL not set"

**Fix:**
1. Check `.env.local` exists
2. Run `.\restart-dev.ps1`
3. Verify env vars are shown

---

### ❌ "Database error (RLS)"

**Fix:** Run in Supabase SQL Editor
```sql
CREATE POLICY "users_read_own_admin"
ON admin_users FOR SELECT TO authenticated
USING (user_id = auth.uid());
```

---

## 📊 What You'll See Now

### Before (Generic)
```
❌ "Forbidden"
```

### After (Detailed)
```
✅ "Access denied - Not an admin

User fa22-bse-199@cuilahore.edu.pk is not in the admin_users table

How to fix: Contact a super admin to grant you admin access

Your account: fa22-bse-199@cuilahore.edu.pk
User ID: 33b2f6fd-8a5c-4f2e-9c1e-7d8e6f5a4b3c"
```

**Plus console logs:**
```
[Admin Elevate] Checking admin status for user: fa22-bse-199@cuilahore.edu.pk
[Admin Elevate] Database error: PGRST116
```

---

## 🔍 Quick Checks

```powershell
# Check env vars are set
Get-Content .env.local | Select-String "SUPABASE"

# Should show:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 📖 Full Docs

- **Complete Guide:** `ADMIN_ERROR_DEBUG_GUIDE.md`
- **What Changed:** `ADMIN_ACCESS_FIX_COMPLETE.md`

---

**Need help?** Open F12 Console - all errors are logged with details!
