# 🚨 URGENT FIX: Infinite Recursion Error

## ❌ The Error You're Seeing:

```
Error (500)
infinite recursion detected in policy for relation 'admin_users' 
(Code: 42P17)
Fix: Check database connection and RLS policies
Hint: Using service role key
```

---

## 🔍 What's Happening:

Your Supabase RLS (Row Level Security) policies have a **circular dependency**:

```sql
-- BAD POLICY (causes infinite loop):
CREATE POLICY "super_admin_insert_admin_users"
ON admin_users
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users  -- ❌ Checking admin_users
    WHERE user_id = auth.uid()  --    while trying to access admin_users
    AND role = 'super_admin'    --    = INFINITE RECURSION!
  )
);
```

This is like asking: *"To see if I can open the door, let me first check if I can open the door..."* 🔄∞

---

## ✅ THE FIX (Choose One):

### **Option 1: Quick Fix via Supabase Dashboard** ⚡ (2 minutes)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Click "SQL Editor"** (left sidebar)

3. **Copy and paste this SQL:**

```sql
-- Fix infinite recursion in admin_users RLS policies
BEGIN;

-- Drop all problematic policies
DROP POLICY IF EXISTS "authenticated_read_admin_users" ON "public"."admin_users";
DROP POLICY IF EXISTS "super_admin_insert_admin_users" ON "public"."admin_users";
DROP POLICY IF EXISTS "super_admin_update_admin_users" ON "public"."admin_users";
DROP POLICY IF EXISTS "super_admin_delete_admin_users" ON "public"."admin_users";
DROP POLICY IF EXISTS "admin_users_self_read" ON "public"."admin_users";
DROP POLICY IF EXISTS "read own admin row" ON "public"."admin_users";

-- Enable RLS
ALTER TABLE "public"."admin_users" ENABLE ROW LEVEL SECURITY;

-- NEW POLICY 1: Allow users to read their own admin record
CREATE POLICY "admin_users_read_own"
ON "public"."admin_users"
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- NEW POLICY 2: Allow all authenticated users to read all admin records
-- (Safe - only contains role info, not sensitive data)
CREATE POLICY "admin_users_read_all"
ON "public"."admin_users"
FOR SELECT
TO authenticated
USING (true);

-- Note: INSERT/UPDATE/DELETE disabled from client
-- These operations happen via service role key (bypasses RLS)
-- This prevents the recursion issue entirely!

COMMIT;
```

4. **Click "Run"** (or press `Ctrl+Enter`)

5. **Wait for success message** ✅

6. **Done!** Go back and try admin access again!

---

### **Option 2: PowerShell Script** 🖥️ (requires psql)

If you have PostgreSQL client installed:

```powershell
# Run from project root:
.\fix-rls-recursion.ps1
```

This will apply the SQL migration automatically.

---

### **Option 3: Use Migration File** 📄

Apply the migration manually:

```powershell
# File already created:
supabase\migrations\20251009120000_fix_rls_infinite_recursion.sql

# Apply via Supabase CLI (if installed):
supabase db push

# Or copy/paste the SQL from that file into Supabase Dashboard
```

---

## 🎯 After Applying the Fix:

1. **Go back to:** `http://localhost:3000/admin/auth`

2. **Click "Continue as Admin"** again

3. **Should work now!** ✅

If you still see the error:
- Hard refresh the page (`Ctrl+Shift+R`)
- Clear browser cache
- Try signing out and back in

---

## 🧠 Technical Explanation:

### Why the old policies caused infinite recursion:

```
User tries to access admin_users table
    ↓
RLS policy activates
    ↓
Policy needs to check: "Is this user a super_admin?"
    ↓
To check, it queries: SELECT FROM admin_users...
    ↓
That query triggers RLS policy again
    ↓
Policy needs to check: "Is this user a super_admin?"
    ↓
To check, it queries: SELECT FROM admin_users...
    ↓
🔄 INFINITE LOOP! ❌
```

### How the new policies fix this:

```
User tries to access admin_users table
    ↓
RLS policy activates
    ↓
Policy: "user_id = auth.uid()" OR "true"
    ↓
✓ Simple check, no recursion!
    ↓
Access granted ✅
```

The new policies:
- ✅ Don't query `admin_users` within the policy
- ✅ Use simple conditions (`user_id = auth.uid()` or `true`)
- ✅ Allow reads for authenticated users
- ✅ Disable writes from client (use service role instead)
- ✅ NO RECURSION!

---

## 💡 Why This is Safe:

**Q: "Isn't allowing all reads (USING true) insecure?"**

**A:** No! Because:
1. `admin_users` table only contains:
   - `user_id` (UUID)
   - `role` (text: 'admin' or 'super_admin')
   - Timestamps
   
2. No sensitive data (passwords, emails, etc.)
3. This is just role information
4. Users need this to know who's an admin
5. Actual admin operations still require service role key

**Q: "How do admins get added if INSERT is disabled?"**

**A:** Via the Auto-Fix endpoint:
- Uses **service role key** (bypasses RLS entirely)
- Only works in development
- Adds users to `admin_users` table directly
- No RLS recursion issues!

---

## 📊 Before vs After:

| Aspect | Before (Broken) ❌ | After (Fixed) ✅ |
|--------|-------------------|------------------|
| **Read Policy** | Recursive check | Simple `true` |
| **Write Policy** | Recursive check | Disabled (use service role) |
| **Recursion** | Yes - infinite loop | No - direct check |
| **Error** | Code 42P17 | No error |
| **Performance** | Crashes | Instant |

---

## 🚀 Quick Start:

```
1. Open: https://supabase.com/dashboard
2. Click: SQL Editor
3. Paste: The SQL above
4. Click: Run
5. Done! ✅
```

---

## 🆘 Still Having Issues?

If the error persists after applying the fix:

1. **Check if SQL executed successfully**
   - Look for "Success" message in Supabase
   - Check for any SQL errors

2. **Verify policies were created**
   ```sql
   -- Run this to check:
   SELECT policyname FROM pg_policies 
   WHERE tablename = 'admin_users';
   ```

3. **Try the Auto-Fix button**
   - Go to `/admin/diagnostic`
   - Click "Auto-Fix (Dev Only)"
   - Uses service role key (bypasses RLS)

4. **Check service role key**
   ```powershell
   Get-Content .env.local | Select-String "SUPABASE_SERVICE_ROLE_KEY"
   ```
   Should show a long key starting with `eyJ...`

---

## ✅ SUCCESS!

After applying the fix:
- ✅ No more infinite recursion error
- ✅ Admin auth works smoothly
- ✅ Diagnostic tool shows detailed info
- ✅ Auto-Fix button works (dev mode)

---

**Apply the fix now and get back to building! 🚀**
