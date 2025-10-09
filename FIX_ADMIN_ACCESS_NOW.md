# 🎯 APPLY SQL FIX - Step by Step Guide

## ✅ **Good News!**
Your admin_users table has **5 admins**:
- 3 super_admins ✅
- 2 regular admins ✅

## 🔧 **Problem:**
The RLS policy doesn't let you CHECK if you're an admin (circular dependency issue)

## 📝 **Solution (30 seconds):**

### **In Supabase Dashboard (currently open):**

1. **Click "SQL Editor"** in the left sidebar (icon looks like `</>`)
   - Or go to: https://supabase.com/dashboard/project/ctixprrqbnfivhepifsa/sql/new

2. **Click "New Query"** (green button top right)

3. **Paste this SQL** (press Ctrl+V - it's in your clipboard):

```sql
-- Fix Admin Access - Allow users to check their admin status

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "authenticated_read_admin_users" ON public.admin_users;

-- Create two new policies:

-- 1. Users can check their own admin status
CREATE POLICY "users_read_own_admin"
ON public.admin_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 2. Admins can view all admin users (for admin panel)
CREATE POLICY "admins_read_all"
ON public.admin_users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  )
);

SELECT 'Admin access policies updated!' AS status;
```

4. **Click "RUN"** (or press Ctrl+Enter)

5. ✅ **You'll see:** `"Admin access policies updated!"`

## 🚀 **Then Test Access:**

1. Go back to: **http://localhost:3000/admin/auth**
2. **Refresh** the page (F5)
3. Click **"Continue as Admin"**
4. ✅ **Should work!** No more "Forbidden" error

---

## 📊 **What This SQL Does:**

**Before (Broken):**
```
Policy: "authenticated_read_admin_users"
- Allows: ANY authenticated user to read ALL admins
- Problem: Doesn't let you check if YOU are an admin first
```

**After (Fixed):**
```
Policy 1: "users_read_own_admin"
- Allows: You to check if YOUR user_id is in admin_users ✅

Policy 2: "admins_read_all"  
- Allows: Once verified as admin, you can see all admins ✅
```

This breaks the circular dependency!

---

## 🎯 **Quick Copy (if clipboard lost):**

The SQL is also in:
- `scripts/fix-access-policy.sql`
- Run script again: `.\scripts\fix-access-dashboard.ps1`

---

**Let me know once you run the SQL and I'll help verify access!** 🚀
