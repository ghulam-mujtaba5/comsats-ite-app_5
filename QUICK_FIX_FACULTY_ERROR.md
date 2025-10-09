# ⚡ QUICK FIX: Faculty Status Error

## 🚨 Error You're Seeing
```
Error Loading Faculty
column faculty.status does not exist
0 Faculty Members Found
```

## ✅ IMMEDIATE SOLUTION (5 Minutes)

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project: **campusaxis-ite-app_5**
3. Click **SQL Editor** in the left sidebar

### Step 2: Run This SQL
Copy and paste this SQL and click **RUN**:

```sql
-- Fix faculty.status column issue
ALTER TABLE faculty 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_faculty_status ON faculty(status);

-- Update all existing faculty to approved status
UPDATE faculty SET status = 'approved' WHERE status IS NULL;
```

### Step 3: Verify Fix
Run this to confirm it worked:

```sql
-- Check if column exists
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'faculty' AND column_name = 'status';

-- Count faculty
SELECT status, COUNT(*) as count 
FROM faculty 
GROUP BY status;
```

### Step 4: Refresh Your Website
1. Go to https://campusaxis.site/faculty
2. Hard refresh: **Ctrl + Shift + R** (or **Cmd + Shift + R** on Mac)
3. Faculty should now load! ✅

---

## 🔍 Why This Happened
The `faculty` table was missing the `status` column that the API endpoint expects. This column is used to filter approved vs pending faculty members.

## 🎯 What This Does
- ✅ Adds `status` column with default value `'approved'`
- ✅ Creates index for fast queries
- ✅ Updates all existing faculty to approved status
- ✅ Allows only valid statuses: pending, approved, rejected

---

## 🚀 After Fixing

Your faculty page should now show all faculty members with proper filtering!

If you still see issues:
1. Check browser console for other errors (F12)
2. Verify Supabase connection in .env.local
3. Check RLS policies allow public read access to faculty table

---

## 📞 Need Help?
If the error persists, check:
- Supabase RLS policies (make sure `select` is enabled for `faculty` table)
- Environment variables are set correctly
- Database connection is working

**Quick RLS Fix (if needed):**
```sql
-- Enable read access to faculty table
CREATE POLICY "Allow public read access to approved faculty"
ON faculty FOR SELECT
USING (status = 'approved');
```

---

✅ **This should fix your faculty page immediately!**
