# How to Apply the Faculty Status Fix

## Problem
The faculty page at https://campusaxis.site/faculty is showing an error:
```
Error Loading Faculty
column faculty.status does not exist
```

## Solution
This fix adds a missing `status` column to the `faculty` table that the application code expects to exist.

## Files Created
1. `apply_faculty_status_fix.sql` - SQL script to apply the fix directly to your database
2. `supabase/migrations/20251009270000_add_faculty_status_column.sql` - Migration file for future use

## How to Apply the Fix

### Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `apply_faculty_status_fix.sql` into the editor
4. Click "Run" to execute the script

### Option 2: Using psql or any PostgreSQL client
1. Connect to your database using psql or your preferred PostgreSQL client
2. Execute the SQL commands from `apply_faculty_status_fix.sql`:

```sql
-- Add status column to faculty table
ALTER TABLE faculty 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_faculty_status ON faculty(status);

-- Add comment for documentation
COMMENT ON COLUMN faculty.status IS 'Approval status: pending, approved, or rejected';

-- Update existing faculty to have approved status (they were already in the system)
UPDATE faculty SET status = 'approved' WHERE status IS NULL;
```

### Option 3: Using Supabase CLI (if local setup works)
```bash
npx supabase sql -f apply_faculty_status_fix.sql
```

## Verification
After applying the fix:

1. Visit https://campusaxis.site/faculty - the page should load without errors
2. The API endpoint `/api/faculty` should return data without errors
3. All existing faculty members should be visible (they now have status = 'approved')

## What This Fix Does
1. Adds a `status` column to the `faculty` table with allowed values: 'pending', 'approved', 'rejected'
2. Sets the default value to 'approved' for new faculty
3. Updates all existing faculty to have status = 'approved'
4. Creates an index on the status column for better query performance
5. Adds documentation for the column

## Future Benefits
This fix enables a proper faculty approval workflow:
- New faculty submissions can be added with status = 'pending'
- Admins can approve/reject faculty submissions
- Only approved faculty are shown to users
- Consistent with the existing `pending_faculty` table workflow