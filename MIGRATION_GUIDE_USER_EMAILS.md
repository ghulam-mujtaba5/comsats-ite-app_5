# Quick Migration Guide - User Emails Table

## ✅ Migration Status
- **Supabase CLI:** Linked to project `ctixprrqbnfivhepifsa`
- **Migration File:** `20251016172051_add_user_emails_table_fix.sql`
- **Original Migration:** `20251009250000` (already applied to remote database)

## 🎯 Option 1: Supabase Dashboard (RECOMMENDED)

### Step 1: Open Supabase SQL Editor
1. Go to: https://supabase.com/dashboard/project/ctixprrqbnfivhepifsa
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New query**

### Step 2: Copy and Run This SQL
```sql
-- Check if user_emails table already exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'user_emails'
) AS table_exists;

-- If table_exists is FALSE, run the migration below:
-- If table_exists is TRUE, you're already good to go! ✅

-- Create table for storing user email addresses (for alumni access)
CREATE TABLE IF NOT EXISTS user_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  email_type TEXT NOT NULL DEFAULT 'secondary',
  is_verified BOOLEAN DEFAULT false,
  verification_token UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, email),
  UNIQUE(email)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_emails_user_id ON user_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_user_emails_email ON user_emails(email);
CREATE INDEX IF NOT EXISTS idx_user_emails_email_type ON user_emails(email_type);

-- Enable RLS
ALTER TABLE user_emails ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own emails" ON user_emails;
DROP POLICY IF EXISTS "Users can insert own emails" ON user_emails;
DROP POLICY IF EXISTS "Users can update own emails" ON user_emails;
DROP POLICY IF EXISTS "Users can delete own emails" ON user_emails;

-- RLS Policies
CREATE POLICY "Users can view own emails" ON user_emails
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emails" ON user_emails
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emails" ON user_emails
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own emails" ON user_emails
  FOR DELETE USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_user_emails_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_emails_updated_at ON user_emails;
CREATE TRIGGER user_emails_updated_at 
  BEFORE UPDATE ON user_emails
  FOR EACH ROW EXECUTE FUNCTION update_user_emails_updated_at();

-- Comments
COMMENT ON TABLE user_emails IS 'User email addresses for alumni access';
COMMENT ON COLUMN user_emails.email_type IS 'Type of email: primary (institutional), secondary (backup institutional), personal (alumni)';

-- Verify the table was created successfully
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'user_emails') as column_count,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'user_emails') as policy_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'user_emails';
```

### Step 3: Verify Results
You should see output like:
```
table_name   | column_count | policy_count
-------------|--------------|-------------
user_emails  | 8            | 4
```

✅ **Success!** The table is created with 8 columns and 4 RLS policies.

---

## 🔧 Option 2: Supabase CLI (Has Issues)

**Status:** ⚠️ CLI push has migration version conflicts

**Issue:** Duplicate migration versions in local migrations directory causing conflicts:
```
ERROR: duplicate key value violates unique constraint "schema_migrations_pkey"
Key (version)=(20251012) already exists.
```

**Recommendation:** Use Option 1 (Supabase Dashboard) instead.

---

## ✅ Verify Everything Works

After applying the migration:

### Test 1: Check Table Exists
```sql
SELECT * FROM user_emails LIMIT 5;
```

### Test 2: Check RLS Policies
```sql
SELECT * FROM pg_policies WHERE tablename = 'user_emails';
```

### Test 3: Test the Application
1. Go to: https://campusaxis.site/profile
2. Click **Settings** tab
3. Scroll to **Email Management** section
4. Try adding a new email
5. Should work without errors! ✅

---

## 📊 What the Migration Does

1. **Creates `user_emails` Table**
   - Stores multiple email addresses per user
   - Supports primary, secondary, and personal email types
   - Email verification system ready

2. **Adds Performance Indexes**
   - Fast lookups by user_id
   - Fast lookups by email
   - Fast filtering by email_type

3. **Enables Row Level Security (RLS)**
   - Users can only see their own emails
   - Users can only modify their own emails
   - Protected at database level

4. **Auto-Updates Timestamps**
   - `updated_at` automatically updates on changes
   - Trigger-based, no app code needed

---

## 🎯 Expected Outcome

After migration:
- ✅ Email management works on profile page
- ✅ Users can add secondary/personal emails
- ✅ No more "Could not find table" errors
- ✅ Alumni can maintain access after graduation

---

## 🐛 Troubleshooting

### "Table already exists" Error
This is **GOOD**! It means the migration was already applied. The `CREATE TABLE IF NOT EXISTS` statement is safe to run multiple times.

### "Permission denied" Error
Make sure you're logged into Supabase dashboard with admin access.

### Still Getting Errors in App
1. Clear browser cache
2. Restart dev server: `npm run dev`
3. Check browser console for detailed errors

---

## 📞 Next Steps

After successful migration:

1. ✅ **Test Email Management**
   - Go to profile settings
   - Add a test email
   - Verify it appears in the list

2. ✅ **Test Settings**
   - Toggle notification settings
   - Change privacy controls
   - Update preferences
   - Click save and refresh

3. ✅ **Verify Data Persistence**
   - Refresh the page
   - Settings should remain saved
   - Emails should still be listed

---

**Status:** Migration script ready to apply via Supabase Dashboard  
**Estimated Time:** 2-3 minutes  
**Difficulty:** Easy (just copy/paste SQL)
