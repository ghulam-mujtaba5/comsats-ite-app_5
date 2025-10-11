# 🚀 CampusAxis Deployment Guide - Animation & Email System

## ✅ Completed Tasks

### 1. **Email Notification System**
- ✅ Resend API key added to `.env.local`
- ✅ Email template library created (`lib/resend-email.ts`)
  - Achievement unlock emails
  - Comment notification emails
  - Like notification emails
  - Welcome emails
  - Resource approval emails
  - Weekly digest emails
- ✅ Email management API (`/api/email/send`)
  - POST: Send emails by type
  - GET: Get user preferences
  - PATCH: Update preferences
- ✅ Email database migrations created
  - `user_email_preferences` table
  - `email_logs` table
  - RLS policies
  - Auto-create preferences trigger
- ✅ Email integration in endpoints
  - Achievement unlock → sends email
  - Resource approval → sends email

### 2. **Animation & Emotional Wellness System**
- ✅ 10+ animation components created
- ✅ Confetti effects hook (`use-confetti-effect`)
- ✅ Emotion state management (`use-emotion-state`)
- ✅ Mood widget component
- ✅ Mindful break component
- ✅ Motivation message component
- ✅ XP progress glow component
- ✅ Sparkle trail component
- ✅ Emotion-based animations
- ✅ Emotional UI context provider

### 3. **Gamification System**
- ✅ Database schema created (`20251011000000_create_gamification_tables.sql`)
  - achievements table (24 seeded achievements)
  - user_achievements table
  - user_stats table
  - leaderboard materialized view
- ✅ API endpoints created
  - GET /api/gamification/achievements
  - POST /api/gamification/unlock (with email notification)
  - GET /api/gamification/leaderboard
  - GET /api/gamification/progress
- ✅ React hooks updated (`use-achievements.ts`)
- ✅ Upload dialog updated with real API

### 4. **Student Resources**
- ✅ Upload API created (`/api/resources/upload`)
  - File validation
  - Supabase Storage integration
  - Rate limiting (10/hr auth, 3/hr anon)
  - Status tracking (pending/approved/rejected)
- ✅ Admin approval endpoint updated
  - Sends email when approved

---

## ⏳ Pending Deployment Tasks

### Step 1: Run Database Migrations

You need to run these SQL files in your Supabase Dashboard:

#### A. Gamification Tables Migration
**File:** `supabase/migrations/20251011000000_create_gamification_tables.sql`

**Steps:**
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `eplzcxzgaclrblntwodg`
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy the contents of `20251011000000_create_gamification_tables.sql`
6. Paste and click **Run**

**What it creates:**
- `achievements` table with 24 achievements
- `user_achievements` table
- `user_stats` table
- `leaderboard` materialized view
- RLS policies
- Indexes for performance

#### B. Email Tables Migration
**File:** `supabase/migrations/20251011000001_create_email_tables.sql`

**Steps:**
1. In Supabase SQL Editor
2. Click **New Query**
3. Copy the contents of `20251011000001_create_email_tables.sql`
4. Paste and click **Run**

**What it creates:**
- `user_email_preferences` table
- `email_logs` table
- RLS policies
- Auto-create preferences trigger
- Indexes

---

### Step 2: Create Storage Bucket

**Bucket Name:** `resources`

**Steps:**
1. Go to Supabase Dashboard → **Storage**
2. Click **Create a new bucket**
3. Enter bucket name: `resources`
4. **Public bucket**: Set to `false` (private)
5. **File size limit**: 50 MB
6. **Allowed MIME types**: 
   - application/pdf
   - application/msword
   - application/vnd.openxmlformats-officedocument.wordprocessingml.document
   - application/vnd.ms-excel
   - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
   - application/vnd.ms-powerpoint
   - application/vnd.openxmlformats-officedocument.presentationml.presentation
   - text/plain
   - application/zip
   - image/png
   - image/jpeg
7. Click **Create bucket**

**Storage Policies:**
You may need to add these RLS policies for the bucket:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload resources"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resources');

-- Allow authenticated users to read their own files
CREATE POLICY "Users can read their resources"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'resources' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow admins to read all files
CREATE POLICY "Admins can read all resources"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'resources' AND (SELECT is_super_admin FROM user_profiles WHERE id = auth.uid()));
```

---

### Step 3: Environment Variables Verification

Ensure these are set in your production environment (Vercel):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://eplzcxzgaclrblntwodg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend Email
RESEND_API_KEY=re_Hup7daQU_LkdjhZmRtPwqLUZGuyc8EHGw

# Site URL
NEXT_PUBLIC_SITE_URL=https://campusaxis.site
```

**Vercel Deployment:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add/verify each variable above
3. Make sure they're available for **Production**, **Preview**, and **Development**

---

### Step 4: Test Complete System

Once migrations are run and bucket is created:

#### A. Test Resource Upload
1. Go to student resources page
2. Click "Upload Resource"
3. Fill form and select a PDF file
4. Submit
5. **Expected**: 
   - File uploads successfully
   - Status = `pending` in database
   - Upload confirmation shown

#### B. Test Achievement System
1. Make API call: `GET /api/gamification/achievements`
2. **Expected**: Returns 24 achievements
3. Make API call: `POST /api/gamification/unlock` with achievement ID
4. **Expected**:
   - Achievement unlocked
   - User stats updated
   - Email sent (check inbox)
   - Confetti animation triggers (if integrated in UI)

#### C. Test Leaderboard
1. Make API call: `GET /api/gamification/leaderboard`
2. **Expected**: Returns users ranked by points
3. Filter by campus: `GET /api/gamification/leaderboard?campus_id=xxx`
4. **Expected**: Returns campus-specific rankings

#### D. Test Email Notifications
1. Unlock an achievement
2. **Expected**: Email sent to user with achievement details
3. Admin approves a resource (set status='approved' in admin panel)
4. **Expected**: Email sent to uploader

#### E. Test Animations
1. Visit dashboard
2. **Expected**: Mood widget visible in bottom-right
3. Click mood widget
4. **Expected**: Emotion selector expands
5. Select an emotion
6. **Expected**: Motivational message appears
7. Stay on page for 2+ hours (or manually trigger)
8. **Expected**: Mindful break popup appears

---

### Step 5: Integration with Existing Features

#### Dashboard Integration:
```tsx
// app/dashboard/page.tsx
import { MoodWidget } from '@/components/emotions/mood-widget'
import { XPProgressGlow } from '@/components/gamification/xp-progress-glow'
import { useEmotionalUI } from '@/contexts/emotional-ui-context'

export default function Dashboard() {
  const { trackActivity } = useEmotionalUI()
  const [stats, setStats] = useState(null)
  
  useEffect(() => {
    // Fetch user stats
    fetch('/api/gamification/progress')
      .then(res => res.json())
      .then(data => setStats(data))
    
    // Track activity
    trackActivity('study', 5)
  }, [])
  
  return (
    <div>
      {stats && (
        <XPProgressGlow 
          currentXP={stats.total_points}
          maxXP={stats.next_level_points}
          level={stats.level}
        />
      )}
      <MoodWidget />
    </div>
  )
}
```

#### Achievement Unlock UI:
```tsx
// components/achievements/unlock-button.tsx
import { useState } from 'react'
import { useConfettiEffect } from '@/hooks/use-confetti-effect'
import { LevelUpEffect } from '@/components/animations/level-up-effect'

export function UnlockButton({ achievementId }) {
  const [showEffect, setShowEffect] = useState(false)
  const { stars } = useConfettiEffect()
  
  const unlock = async () => {
    const res = await fetch('/api/gamification/unlock', {
      method: 'POST',
      body: JSON.stringify({ achievementId }),
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (res.ok) {
      const data = await res.json()
      stars() // Sparkle animation
      
      if (data.level_up) {
        setShowEffect(true) // Level up animation
      }
    }
  }
  
  return (
    <>
      <button onClick={unlock}>Unlock Achievement</button>
      <LevelUpEffect 
        trigger={showEffect}
        level={5}
        xpGained={100}
      />
    </>
  )
}
```

#### Resource Upload Success:
```tsx
// components/resources/upload-dialog.tsx
import { useConfettiEffect } from '@/hooks/use-confetti-effect'
import { ThankYouAnimation } from '@/components/animations/thank-you-animation'

export function UploadDialog() {
  const [showThanks, setShowThanks] = useState(false)
  const { burst } = useConfettiEffect()
  
  const handleSuccess = () => {
    burst() // Confetti
    setShowThanks(true) // Thank you card
  }
  
  return (
    <>
      {/* Upload form */}
      <ThankYouAnimation 
        trigger={showThanks}
        message="Your resource is under review!"
      />
    </>
  )
}
```

---

## 📊 Database Schema Reference

### Gamification Tables

```sql
-- achievements
id: uuid PRIMARY KEY
title: text NOT NULL
description: text
icon: text (emoji)
category: text (academic, social, contribution, milestone, special)
rarity: text (common, rare, epic, legendary)
points: integer DEFAULT 10
requirement_count: integer
created_at: timestamptz

-- user_achievements
id: uuid PRIMARY KEY
user_id: uuid REFERENCES auth.users
achievement_id: uuid REFERENCES achievements
unlocked_at: timestamptz DEFAULT now()
progress: integer DEFAULT 0

-- user_stats
id: uuid PRIMARY KEY
user_id: uuid REFERENCES auth.users UNIQUE
total_points: integer DEFAULT 0
level: integer DEFAULT 1
achievements_unlocked: integer DEFAULT 0
last_activity: timestamptz DEFAULT now()

-- leaderboard (materialized view)
user_id: uuid
rank: integer
total_points: integer
level: integer
achievements_unlocked: integer
```

### Email Tables

```sql
-- user_email_preferences
id: uuid PRIMARY KEY
user_id: uuid REFERENCES auth.users UNIQUE
email_achievements: boolean DEFAULT true
email_comments: boolean DEFAULT true
email_likes: boolean DEFAULT true
email_weekly_digest: boolean DEFAULT true
email_resource_approved: boolean DEFAULT true
email_welcome: boolean DEFAULT true
created_at: timestamptz
updated_at: timestamptz

-- email_logs
id: uuid PRIMARY KEY
user_id: uuid REFERENCES auth.users
email_type: text NOT NULL
recipient_email: text NOT NULL
status: text DEFAULT 'sent'
sent_at: timestamptz DEFAULT now()
error_message: text
```

---

## 🔧 Troubleshooting

### Issue: Email not sending
**Solution:**
1. Check `RESEND_API_KEY` is set correctly
2. Verify recipient has email in `user_profiles` table
3. Check `email_logs` table for error messages
4. Ensure user has email preferences enabled

### Issue: Animation not showing
**Solution:**
1. Check browser console for errors
2. Verify `canvas-confetti` is installed
3. Check if user has "prefers-reduced-motion" enabled
4. Ensure component is properly imported

### Issue: Achievement unlock fails
**Solution:**
1. Verify migrations ran successfully
2. Check user exists in `user_stats` table
3. Verify achievement ID exists
4. Check RLS policies allow insert

### Issue: Storage upload fails
**Solution:**
1. Verify `resources` bucket exists
2. Check bucket is set to private
3. Verify file size < 50MB
4. Check MIME type is allowed
5. Verify RLS policies are set

---

## 📈 Monitoring

### Key Metrics to Track:
1. **Email Delivery Rate**: Check `email_logs` for success/failure
2. **Achievement Unlock Rate**: Monitor `user_achievements` growth
3. **Storage Usage**: Track `resources` bucket size
4. **Animation Performance**: Monitor FPS during animations
5. **User Engagement**: Track emotion widget usage

### SQL Queries:

```sql
-- Email delivery rate (last 24 hours)
SELECT 
  email_type,
  COUNT(*) as total,
  SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as success,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
FROM email_logs
WHERE sent_at > NOW() - INTERVAL '24 hours'
GROUP BY email_type;

-- Most popular achievements
SELECT 
  a.title,
  COUNT(ua.id) as unlock_count
FROM achievements a
LEFT JOIN user_achievements ua ON a.id = ua.achievement_id
GROUP BY a.id, a.title
ORDER BY unlock_count DESC
LIMIT 10;

-- Top users by points
SELECT 
  up.full_name,
  us.total_points,
  us.level,
  us.achievements_unlocked
FROM user_stats us
JOIN user_profiles up ON us.user_id = up.id
ORDER BY us.total_points DESC
LIMIT 20;

-- Resource upload stats
SELECT 
  status,
  COUNT(*) as count,
  AVG(size_bytes) as avg_size
FROM resources
GROUP BY status;
```

---

## ✅ Final Checklist

Before going live:

- [ ] Run gamification migration in Supabase
- [ ] Run email tables migration in Supabase
- [ ] Create `resources` storage bucket
- [ ] Set storage RLS policies
- [ ] Verify all environment variables in Vercel
- [ ] Test resource upload end-to-end
- [ ] Test achievement unlock with email
- [ ] Test leaderboard API
- [ ] Test admin resource approval with email
- [ ] Verify animations play smoothly
- [ ] Test mood widget on mobile
- [ ] Check email delivery in production
- [ ] Monitor error logs for 24 hours
- [ ] Verify storage bucket quota

---

## 🎉 Success Criteria

System is fully deployed when:

1. ✅ Users can upload resources successfully
2. ✅ Achievements unlock and send emails
3. ✅ Leaderboard shows real-time rankings
4. ✅ Admin can approve resources (triggers email)
5. ✅ Animations play without lag
6. ✅ Mood widget tracks emotions
7. ✅ Mindful breaks trigger after long sessions
8. ✅ Email notifications arrive within 30 seconds
9. ✅ All migrations applied successfully
10. ✅ Storage bucket handles file uploads

---

**System Status:** ✅ **Code Complete** | ⏳ **Pending Database Deployment**

**Next Action:** Run migrations in Supabase Dashboard and create storage bucket.

---

**Questions?** Check the main documentation: `ANIMATION_EMOTIONAL_WELLNESS_COMPLETE.md`
