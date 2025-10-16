# Profile & Settings - Quick Reference

## 🚀 Quick Start

### Apply Database Migration (REQUIRED FIRST STEP)
```sql
-- Run this in Supabase SQL Editor
-- File: scripts/apply-user-emails-migration.sql
```
Or use the Supabase CLI:
```bash
supabase db push
```

---

## 📍 URLs & Navigation

| Feature | URL | Description |
|---------|-----|-------------|
| Profile Overview | `/profile` | User stats, achievements, activity |
| Profile Settings | `/profile?tab=settings` | All settings in one place |
| Settings (Redirect) | `/settings` | Auto-redirects to profile settings |

---

## 🎯 What Was Fixed

### 1. Email Management Error ✅
**Before:** "Could not find the table 'public.user_emails' in the schema cache"  
**After:** Graceful error handling + migration script ready

**Files Changed:**
- `app/api/user-emails/route.ts` - Enhanced error handling
- `components/profile/email-management.tsx` - Better UX
- `scripts/apply-user-emails-migration.sql` - Manual migration

### 2. Settings Redundancy ✅
**Before:** Settings scattered across `/settings` and `/profile`  
**After:** All settings unified in `/profile` Settings tab

**Files Changed:**
- `components/profile/settings-management.tsx` - NEW unified component
- `app/profile/page.tsx` - Integrated settings
- `app/settings/page.tsx` - Now redirects to profile

### 3. UI/UX Improvements ✅
- Better error messages
- Loading states
- Service unavailable detection
- Success feedback with toasts
- 6-level design system compliance

---

## 📁 Key Components

### SettingsManagement Component
**Location:** `components/profile/settings-management.tsx`

**Features:**
- 3 tabs: Notifications, Privacy, Preferences
- Auto-save to database
- Loading states
- Error handling
- Beautiful glassmorphic design

**Usage:**
```tsx
import { SettingsManagement } from "@/components/profile/settings-management"

<SettingsManagement />
```

### EmailManagement Component
**Location:** `components/profile/email-management.tsx`

**Features:**
- Display primary email (protected)
- Add secondary/personal emails
- Email validation
- Graceful error handling if table not exists
- Verification status display

**Usage:**
```tsx
import { EmailManagement } from "@/components/profile/email-management"

<EmailManagement />
```

---

## 🗄️ Database Tables

### `user_emails` Table
```sql
-- Stores multiple email addresses per user
-- For alumni access after graduation
```

**Columns:**
- `id` - UUID primary key
- `user_id` - References auth.users
- `email` - Email address (unique)
- `email_type` - 'primary', 'secondary', 'personal'
- `is_verified` - Boolean
- `verification_token` - UUID for verification
- `created_at`, `updated_at` - Timestamps

**RLS Policies:** Users can only see/manage their own emails

### `user_preferences` Table
```sql
-- Stores user settings (notifications, privacy, preferences)
```

**Columns:**
- `user_id` - UUID primary key
- `settings` - JSONB (all settings in one field)
- `created_at`, `updated_at` - Timestamps

---

## 🛠️ API Endpoints

### Email Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user-emails` | Fetch all user emails (with fallback) |
| POST | `/api/user-emails` | Add new email address |
| DELETE | `/api/user-emails?id={id}` | Remove email address |
| POST | `/api/user-emails/set-primary` | Set primary email |

### Settings Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile/settings` | Fetch user settings |
| PATCH | `/api/profile/settings` | Update user settings |

---

## ⚙️ Settings Structure

### Notifications (8 controls)
- Email Notifications
- Push Notifications
- Community Posts
- Faculty Reviews
- Help Desk Updates
- Lost & Found Matches
- New Papers
- Weekly Digest

### Privacy (5 controls)
- Profile Visible
- Show Email
- Show Activity
- Allow Messages
- Show Stats

### Preferences (4 controls)
- Theme (Light/Dark/System)
- Language (English/Urdu)
- Email Frequency (Instant/Daily/Weekly/Never)
- Weekly Digest Day (Monday-Sunday)

---

## ✅ Testing Checklist

### After Migration:
- [ ] Run migration script in Supabase
- [ ] Verify `user_emails` table exists
- [ ] Check RLS policies enabled

### Email Management:
- [ ] Go to `/profile` → Settings tab
- [ ] See primary email displayed
- [ ] Try adding new email
- [ ] Verify error handling (if table not ready)
- [ ] Test email validation

### Settings:
- [ ] Toggle notification settings
- [ ] Change privacy controls
- [ ] Update preferences
- [ ] Save settings
- [ ] Refresh and verify persistence

### Navigation:
- [ ] Visit `/settings`
- [ ] Confirm redirect to `/profile?tab=settings`

---

## 🐛 Troubleshooting

### "Could not find table" Error
**Solution:** Run migration script in Supabase SQL Editor
```bash
# File: scripts/apply-user-emails-migration.sql
```

### Settings Not Saving
**Check:**
1. Browser console for errors
2. `/api/profile/settings` endpoint accessible
3. User authenticated in Supabase

### Email Management Shows "Feature Unavailable"
**Reason:** `user_emails` table not created yet  
**Solution:** Apply migration script (see above)

---

## 🎨 Design System

All components use **6-Level Design System**:
1. ✅ Color Harmony (glassmorphism, gradients)
2. ✅ Typography Hierarchy (xl/bold headings, sm labels)
3. ✅ Spacing & Layout (consistent space-y-*)
4. ✅ Component Consistency (unified cards, buttons)
5. ✅ Interactive States (loading, disabled, hover)
6. ✅ Accessibility & UX (labels, errors, feedback)

---

## 📚 Related Files

### Core Components:
- `components/profile/settings-management.tsx` - Settings UI
- `components/profile/email-management.tsx` - Email management UI
- `app/profile/page.tsx` - Profile page with tabs

### API Routes:
- `app/api/user-emails/route.ts` - Email CRUD operations
- `app/api/profile/settings/route.ts` - Settings save/load

### Database:
- `supabase/migrations/20251009250000_add_user_emails_table.sql` - Original migration
- `scripts/apply-user-emails-migration.sql` - Manual migration script

### Documentation:
- `PROFILE_SETTINGS_INTEGRATION_SUMMARY.md` - Complete documentation
- `UI_DESIGN_SYSTEM_AUDIT.md` - Design system compliance

---

## 🚀 Next Steps

1. **Apply Migration:** Run `scripts/apply-user-emails-migration.sql` in Supabase
2. **Test Features:** Follow testing checklist above
3. **Verify Data:** Check settings save/load correctly
4. **Alumni Workflow:** Document email management for graduating students

---

**Status:** ✅ Ready for Testing  
**Migration Required:** Yes (one-time setup)  
**Breaking Changes:** None (backward compatible)
