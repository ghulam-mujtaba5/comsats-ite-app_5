# Faculty Status Column Fix

## Problem
The faculty page at https://campusaxis.site/faculty is showing an error:
```
Error Loading Faculty
column faculty.status does not exist
```

This is because the API route `/api/faculty` is trying to filter faculty by `status = 'approved'`, but the faculty table doesn't have a status column.

## Solution
This fix adds a status column to the faculty table to make it consistent with the approval workflow.

## Changes Made

1. Added a `status` column to the `faculty` table with values: 'pending', 'approved', 'rejected'
2. Set default value to 'approved' for existing faculty
3. Created an index on the status column for better query performance
4. Added documentation comment for the column
5. Updated the API route to use the status column properly

## Migration File
The migration is in: `supabase/migrations/20251009270000_add_faculty_status_column.sql`

## How to Apply the Fix

### Option 1: Using Supabase CLI (if you have local development setup)
```bash
npx supabase migration up
```

### Option 2: Direct SQL Execution (for production database)
Execute the following SQL directly on your production database:

```sql
-- Add status column to faculty table
-- This makes the faculty approval workflow consistent with the pending_faculty table

ALTER TABLE faculty 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_faculty_status ON faculty(status);

-- Add comment for documentation
COMMENT ON COLUMN faculty.status IS 'Approval status: pending, approved, or rejected';

-- Update existing faculty to have approved status (they were already in the system)
UPDATE faculty SET status = 'approved' WHERE status IS NULL;
```

## Verification
After applying the migration:
1. The faculty page should load without errors
2. All existing faculty should be visible (they now have status = 'approved')
3. The API route `/api/faculty` should work correctly

## Future Considerations
This fix enables a proper faculty approval workflow where:
- New faculty submissions can be added with status = 'pending'
- Admins can approve/reject faculty submissions
- Only approved faculty are shown to users