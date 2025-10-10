# Incomplete Features Analysis & Implementation Plan

## 🔍 Features Found With Incomplete Implementation

### 1. ❌ Upload Resource Dialog (Student-Facing)
**Location**: `components/resources/upload-resource-dialog.tsx`
**Status**: Mock implementation only
**Issue**: 
- Line 57: `// Mock upload functionality`
- No actual API call
- Just shows toast and resets form
**Files Exist**: 
- ✅ Admin API exists: `/api/admin/resources` (POST)
- ❌ Student API missing: `/api/resources/upload`

### 2. ❌ Gamification/Achievements System
**Location**: `hooks/use-achievements.ts`, `app/api/admin/users/[id]/gamification/route.ts`
**Status**: Partially implemented
**Issues**:
- Line 132 in hook: `// For now, we'll return a mock implementation`
- Database tables missing (achievements, user_achievements, leaderboard)
- API endpoint has TODO comment
- All gamification components exist but no backend
**Missing**:
- Database schema for achievements system
- Complete API implementation
- Real data integration

### 3. ❌ Faculty Mock Data
**Location**: `lib/faculty-data.ts`
**Status**: Mock data definitions exist
**Issue**:
- Lines 51-129: `mockFaculty` array with hardcoded data
- Lines 131-190: `mockReviews` array with hardcoded data  
- Functions use mock data:
  - `getFacultyByDepartment()` - returns mockFaculty
  - `getFacultyById()` - searches mockFaculty
  - `getReviewsByFacultyId()` - filters mockReviews
**Reality Check**:
- ✅ **Faculty pages ALREADY use real DB** (app/faculty/[id]/page.tsx fetches from Supabase)
- ✅ **Faculty API exists** and works
- ⚠️ **Mock data file is UNUSED** - can be removed or kept as types only

### 4. ❌ Community Mock Replies
**Location**: `lib/community-data.ts`
**Status**: Mock data for comment replies
**Issue**:
- Line 32: `mockReplies` array with 3 hardcoded replies
- Not used in actual community system
**Reality Check**:
- ✅ **Community uses real database** (post_comments_enhanced table)
- ⚠️ **Mock replies are UNUSED** - file can be cleaned up

## ✅ What's Already Complete (No Action Needed)

1. **Faculty System** - Fully integrated with Supabase
   - Real API routes working
   - Database connected
   - Reviews functional
   - Mock data file exists but NOT used

2. **Community System** - 100% backend integrated (just completed)
   - Real posts from database
   - Like/comment functionality
   - Notifications working
   - Mock replies data exists but NOT used

3. **Past Papers Upload** - Fully functional
   - Student upload working
   - Admin moderation working
   - File upload + external links supported

## 🎯 Implementation Priority

### HIGH PRIORITY (Required for Full Functionality)

#### 1. Student Resources Upload API
**What to do:**
- Create `/api/resources/upload` endpoint for students
- Support file upload + external URLs
- Add to pending queue for admin approval
- Status should be 'pending' by default

#### 2. Gamification System
**What to do:**
- Create database migration for:
  - `achievements` table
  - `user_achievements` table  
  - `leaderboard` materialized view
- Implement achievement unlock logic
- Create API routes for:
  - GET achievements
  - POST unlock achievement
  - GET leaderboard
  - GET user progress
- Add achievement triggers (e.g., first post, 10 likes, etc.)

### MEDIUM PRIORITY (Code Cleanup)

#### 3. Remove/Update Mock Data Files
**What to do:**
- `lib/faculty-data.ts` - Keep types, remove mock arrays (or mark as deprecated)
- `lib/community-data.ts` - Remove mockReplies array
- Update any imports that might reference mock data

### LOW PRIORITY (Nice to Have)

#### 4. Complete Admin Gamification Endpoint
**What to do:**
- Implement POST logic in `/api/admin/users/[id]/gamification/route.ts`
- Allow admins to manually grant achievements
- Award bonus points

## 📋 Detailed Implementation Steps

### Step 1: Create Student Resources Upload API

**File**: `app/api/resources/upload/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  // 1. Check auth (optional - can allow anon with stricter rate limit)
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // 2. Rate limit
  const limitKey = user?.id || req.headers.get('x-forwarded-for') || 'anon'
  const rateCheck = await rateLimit(req, {
    ...RateLimitPresets.upload,
    keyGenerator: () => `resource-upload:${limitKey}`
  })
  if (!rateCheck.success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  // 3. Parse form data
  const formData = await req.formData()
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const type = formData.get('type') as string
  const department = formData.get('department') as string
  const difficulty = formData.get('difficulty') as string
  const tags = formData.get('tags') as string
  const url = formData.get('url') as string
  const file = formData.get('file') as File | null

  // 4. Validation
  if (!title || !description || !type || !department) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (!file && !url) {
    return NextResponse.json({ error: 'Provide a file or URL' }, { status: 400 })
  }

  // 5. Upload file to storage if provided
  let fileUrl: string | null = null
  if (file) {
    const fileName = `${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resources')
      .upload(`pending/${fileName}`, file)
    
    if (uploadError) {
      return NextResponse.json({ error: 'File upload failed' }, { status: 500 })
    }
    
    const { data: publicUrl } = supabase.storage
      .from('resources')
      .getPublicUrl(uploadData.path)
    
    fileUrl = publicUrl.publicUrl
  }

  // 6. Insert into resources table with status='pending'
  const { data, error } = await supabase
    .from('resources')
    .insert({
      title,
      description,
      type,
      department,
      difficulty,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      external_url: url || null,
      file_url: fileUrl,
      status: 'pending',
      uploaded_by: user?.id || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Database insert failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true, resource: data })
}
```

**Required**: Add `uploaded_by`, `status` columns to resources table if missing.

### Step 2: Create Gamification Database Schema

**File**: `supabase/migrations/20251011000000_create_gamification_tables.sql`

```sql
-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  category TEXT NOT NULL CHECK (category IN ('participation', 'contribution', 'exploration', 'milestone', 'special')),
  criteria JSONB, -- Store achievement unlock criteria
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Leaderboard materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS leaderboard AS
SELECT 
  ua.user_id,
  up.full_name AS user_name,
  up.avatar_url AS user_avatar,
  COALESCE(SUM(a.points), 0) AS total_points,
  ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(a.points), 0) DESC) AS rank
FROM user_achievements ua
JOIN achievements a ON ua.achievement_id = a.id
LEFT JOIN user_profiles up ON ua.user_id = up.user_id
GROUP BY ua.user_id, up.full_name, up.avatar_url
ORDER BY total_points DESC;

-- Index for performance
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);

-- Function to refresh leaderboard
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to refresh leaderboard when achievements are unlocked
CREATE TRIGGER trigger_refresh_leaderboard
AFTER INSERT OR DELETE ON user_achievements
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_leaderboard();

-- RLS policies
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Everyone can view achievements
CREATE POLICY "achievements_select" ON achievements FOR SELECT USING (true);

-- Users can view their own achievements
CREATE POLICY "user_achievements_select_own" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

-- System can insert (via API with service role)
CREATE POLICY "user_achievements_insert_system" ON user_achievements
  FOR INSERT WITH CHECK (true);

-- Seed some achievements
INSERT INTO achievements (title, description, icon, points, rarity, category) VALUES
  ('First Steps', 'Create your first post', '👶', 10, 'common', 'participation'),
  ('Conversation Starter', 'Receive 10 likes on a post', '💬', 25, 'uncommon', 'participation'),
  ('Popular Voice', 'Receive 50 likes on a post', '⭐', 100, 'rare', 'participation'),
  ('Helpful Hand', 'Post 10 comments', '🤝', 50, 'uncommon', 'contribution'),
  ('Resource Provider', 'Upload 5 resources', '📚', 75, 'rare', 'contribution'),
  ('Early Adopter', 'One of the first 100 users', '🚀', 500, 'legendary', 'special'),
  ('Explorer', 'Visit all pages on the site', '🗺️', 50, 'uncommon', 'exploration'),
  ('Semester Complete', 'Access resources for entire semester', '🎓', 150, 'epic', 'milestone'),
  ('Paper Contributor', 'Upload 10 past papers', '📄', 200, 'epic', 'contribution'),
  ('Community Leader', 'Earn 1000 total points', '👑', 1000, 'legendary', 'milestone')
ON CONFLICT DO NOTHING;
```

### Step 3: Create Gamification API Routes

**File**: `app/api/gamification/achievements/route.ts`
**File**: `app/api/gamification/unlock/route.ts`
**File**: `app/api/gamification/leaderboard/route.ts`

### Step 4: Update use-achievements Hook

Remove mock implementation, use real API calls.

### Step 5: Clean Up Mock Data Files

Mark as deprecated or remove unused mock arrays.

## 📊 Affected Files Summary

### Files to CREATE:
1. `app/api/resources/upload/route.ts` - Student upload endpoint
2. `supabase/migrations/20251011000000_create_gamification_tables.sql` - DB schema
3. `app/api/gamification/achievements/route.ts` - Get achievements
4. `app/api/gamification/unlock/route.ts` - Unlock achievement
5. `app/api/gamification/leaderboard/route.ts` - Get leaderboard
6. `app/api/gamification/progress/route.ts` - User progress

### Files to UPDATE:
1. `components/resources/upload-resource-dialog.tsx` - Replace mock with real API call
2. `hooks/use-achievements.ts` - Remove mock, use real API
3. `app/api/admin/users/[id]/gamification/route.ts` - Implement TODO
4. `lib/faculty-data.ts` - Mark as deprecated/types only
5. `lib/community-data.ts` - Remove mockReplies

### Files to CHECK:
1. Database schema for `resources` table (needs status, uploaded_by columns)
2. Storage bucket creation for resources

## ✅ Success Criteria

- [ ] Student can upload resources and see "Submitted for review" message
- [ ] Uploaded resources appear in admin panel with status='pending'
- [ ] Achievements database tables created
- [ ] User can earn achievements
- [ ] Leaderboard displays real rankings
- [ ] Mock data files cleaned up or marked deprecated
- [ ] No unused files remain in codebase
- [ ] All existing functionality still works
- [ ] Build passes with no errors
