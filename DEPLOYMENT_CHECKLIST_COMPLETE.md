# Quick Deployment Checklist ✅

## Before Deploying to Vercel

### 1. Environment Variables (Vercel Dashboard)
Make sure these are set:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Supabase Migrations
Verify these migrations have run:
- `20251009400000_community_social_media_complete.sql` ✅ (includes notifications_enhanced table)
- `20251010050000_enhance_pending_faculty_schema.sql` ✅ (includes profile_image field)

### 3. Build Test
```bash
pnpm build
```

### 4. Deploy
```bash
git add .
git commit -m "Fix: Complete community & notification system integration"
git push origin main
```

## After Deployment - Verify These Features

### ✅ Homepage
- [ ] No "useAuth must be used within an AuthProvider" error
- [ ] Page loads completely
- [ ] No console errors

### ✅ PWA Banner
- [ ] Opens in mobile browser
- [ ] Banner has solid background (no transparency)
- [ ] Text is readable
- [ ] "Dismiss" button works
- [ ] Doesn't show if already installed as PWA

### ✅ Faculty Page
- [ ] Faculty images display
- [ ] Fallback avatars show for missing images
- [ ] Faculty cards are clickable
- [ ] Filter and search work

### ✅ Community Page
- [ ] Posts load
- [ ] Can create new post
- [ ] Like button works
- [ ] Comment system works
- [ ] Real-time updates work

### ✅ Notifications
- [ ] Bell icon shows unread count
- [ ] Clicking bell opens notification dropdown
- [ ] Notifications page loads (/community/notifications)
- [ ] Can mark notifications as read
- [ ] Can delete notifications
- [ ] Real-time notifications appear

## Testing Notifications

### Test Scenario 1: Post Like
1. User A creates a post
2. User B likes the post
3. User A should receive notification

### Test Scenario 2: Comment
1. User A creates a post
2. User B comments on post
3. User A should receive notification

### Test Scenario 3: Reply
1. User A comments on a post
2. User B replies to User A's comment
3. User A should receive notification

## Common Issues & Solutions

### Issue: Notifications not showing
**Solution**: Check Supabase Row Level Security policies are enabled

### Issue: Faculty images not loading
**Solution**: 
1. Check image URLs are accessible
2. Verify CORS settings on image host
3. Check profile_image field in database

### Issue: PWA banner still transparent
**Solution**: Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: Real-time updates not working
**Solution**: Verify Supabase Realtime is enabled for tables

## Quick Links

- **Production**: https://campusaxis.site
- **Vercel Dashboard**: https://vercel.com/your-team/comsats-ite-app
- **Supabase Dashboard**: https://supabase.com/dashboard/project/your-project

## Rollback Plan (If Needed)

If something breaks:
```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

Or in Vercel Dashboard:
1. Go to Deployments
2. Find previous working deployment
3. Click "Promote to Production"

## Performance Monitoring

After deployment, monitor:
- **Page Load Time**: Should be < 3s
- **API Response Time**: Should be < 500ms
- **Error Rate**: Should be < 1%
- **Core Web Vitals**: All should be "Good"

Check in Vercel Analytics and Speedman Analytics.

---

## 🎉 Deployment Success Criteria

- ✅ No console errors on any page
- ✅ All features work as expected
- ✅ Mobile responsive
- ✅ PWA installable
- ✅ Notifications working
- ✅ Faculty images display
- ✅ Community features functional

**Ready to deploy!** 🚀
