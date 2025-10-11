# 🧪 CampusAxis Animation & Emotional System - Testing Guide

## 📋 Pre-Deployment Testing Checklist

Test all features before deploying to production.

---

## 🎊 **Animation Tests**

### 1. Confetti Effects
**Test Location**: Any page with `useConfettiEffect`

```tsx
// Test component
import { useConfettiEffect } from '@/hooks/use-confetti-effect'

function TestPage() {
  const { burst, rain, fireworks, cannon, stars, pride } = useConfettiEffect()
  
  return (
    <div className="p-8 space-y-4">
      <button onClick={burst}>Test Burst</button>
      <button onClick={rain}>Test Rain</button>
      <button onClick={fireworks}>Test Fireworks</button>
      <button onClick={cannon}>Test Cannon</button>
      <button onClick={stars}>Test Stars</button>
      <button onClick={pride}>Test Pride</button>
    </div>
  )
}
```

**Expected Results**:
- ✅ Burst: Quick explosion of confetti
- ✅ Rain: 3-second falling confetti from top
- ✅ Fireworks: 3-second fireworks from random positions
- ✅ Cannon: Powerful bursts from sides
- ✅ Stars: Star-shaped sparkles
- ✅ Pride: Rainbow confetti from both sides

**Performance**:
- ✅ Runs at 60fps
- ✅ CPU usage < 15%
- ✅ No lag or stutter
- ✅ Stops cleanly after animation

---

### 2. Level Up Effect
**Test**: Unlock an achievement that causes level up

```tsx
<LevelUpEffect 
  trigger={true}
  level={5}
  xpGained={250}
  title="Campus Champion"
/>
```

**Expected Results**:
- ✅ Background flash appears
- ✅ 12 burst rays emanate from center
- ✅ 20 stars float upward
- ✅ Trophy rotates with glow
- ✅ Level number displays prominently
- ✅ XP gained shown
- ✅ Auto-closes after 5 seconds

**Visual Check**:
- Trophy visible and glowing
- Stars floating smoothly
- Colors are vibrant (yellow/orange)
- No visual glitches

---

### 3. Thank You Animation
**Test**: Upload a resource successfully

```tsx
<ThankYouAnimation 
  trigger={true}
  userName="Test User"
  message="Your contribution made an impact!"
/>
```

**Expected Results**:
- ✅ 12 hearts float upward from bottom
- ✅ Thank you card appears with message
- ✅ Sparkles rotate on corners
- ✅ Clapping hands animate (3 emojis)
- ✅ Personalized name shows
- ✅ Auto-closes after 4 seconds

---

### 4. Sparkle Trail
**Test**: Move mouse around page

```tsx
<SparkleTrail 
  enabled={true}
  density="medium"
  color="#fbbf24"
  size={4}
/>
```

**Expected Results**:
- ✅ Sparkles follow mouse cursor
- ✅ Sparkles fade after 1 second
- ✅ No lag or performance issues
- ✅ Throttled (not too many particles)

**Test Different Densities**:
- Low: Sparkle every 150ms
- Medium: Sparkle every 100ms
- High: Sparkle every 50ms

---

## 💚 **Emotional Intelligence Tests**

### 5. Emotion State Tracking

**Test Manual Emotion Setting**:
```tsx
const { setEmotion, emotionState } = useEmotionState()

setEmotion('happy', 80)
console.log(emotionState) 
// Should show: { current: 'happy', intensity: 80, ... }
```

**Test Activity Tracking**:
```tsx
const { trackActivity, activityPattern } = useEmotionState()

trackActivity('study', 30) // 30 minutes
console.log(activityPattern)
// Should update sessionDuration and actionsCount
```

**Test Stress Detection**:
```tsx
const { detectStress } = useEmotionState()

// After 2+ hours of activity
const stress = detectStress()
// Should return: { isStressed: true, reason: 'long_session', intensity: 70 }
```

**Test Break Suggestion**:
```tsx
const { suggestBreak } = useEmotionState()

// After long session
const needsBreak = suggestBreak()
// Should return: true
```

**Expected Results**:
- ✅ Emotions change correctly
- ✅ Intensity updates
- ✅ History stores last 20 states
- ✅ LocalStorage persists data
- ✅ Stress detected after 2+ hours
- ✅ Break suggested when needed

---

### 6. Mood Widget

**Test Location**: Bottom-right corner of any page

**User Actions**:
1. Click mood widget button
2. See emotion selector expand
3. Click an emotion (e.g., "Happy")
4. See motivational message appear
5. Wait 5 seconds, message should fade

**Expected Results**:
- ✅ Widget visible and clickable
- ✅ Selector expands smoothly
- ✅ All 7 emotions visible
- ✅ Current emotion highlighted
- ✅ Message appears on selection
- ✅ Message auto-hides after 5s

**Visual Check**:
- Rounded button with gradient
- Icons colored correctly
- Text readable
- Animations smooth

---

### 7. Mindful Break

**Test Trigger**: After 2+ hours or manual trigger

```tsx
<MindfulBreak autoTrigger={true} />
```

**User Actions**:
1. Wait for popup to appear
2. Watch breathing circle animation
3. Observe phase changes: Inhale → Hold → Exhale
4. Check breath counter incrementing
5. Try break activity buttons
6. Click "I'm Refreshed"

**Expected Results**:
- ✅ Popup appears with blur backdrop
- ✅ Breathing circle expands/contracts
- ✅ Phase text shows: "inhale", "hold", "exhale"
- ✅ Timing correct: 4s - 7s - 8s
- ✅ Breath counter increments
- ✅ Activity buttons clickable
- ✅ Closes on button click

**Breathing Timing Test**:
- Inhale: 4 seconds (circle grows)
- Hold: 7 seconds (circle stays large)
- Exhale: 8 seconds (circle shrinks)
- Repeat cycle

---

### 8. Motivation Message

**Test**: After completing a task

```tsx
<MotivationMessage 
  trigger={true}
  icon="sparkles"
  position="top"
  duration={4000}
/>
```

**Expected Results**:
- ✅ Message appears at top center
- ✅ Glow effect visible
- ✅ Icon rotates continuously
- ✅ 6 particle sparkles float
- ✅ Message relevant to emotion
- ✅ Auto-hides after 4 seconds

**Test All Icons**:
- Sparkles: ✨ rotating
- Trending: 📈 visible
- Award: 🏆 displayed
- Zap: ⚡ showing

**Test All Positions**:
- Top: Below header
- Center: Middle of screen
- Bottom: Above footer

---

## 🏆 **Gamification Tests**

### 9. Achievement System

**Test API**: `POST /api/gamification/unlock`

```bash
# Unlock achievement
curl -X POST http://localhost:3000/api/gamification/unlock \
  -H "Content-Type: application/json" \
  -d '{"achievementId": "achievement-uuid"}'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Achievement unlocked! +50 points",
  "achievement": { ... },
  "points_earned": 50
}
```

**Database Checks**:
```sql
-- Check user_achievements table
SELECT * FROM user_achievements 
WHERE achievement_id = 'achievement-uuid';

-- Check user_stats updated
SELECT total_points, level, achievements_unlocked 
FROM user_stats 
WHERE user_id = 'user-uuid';

-- Check email_logs
SELECT * FROM email_logs 
WHERE email_type = 'achievement' 
ORDER BY sent_at DESC LIMIT 5;
```

**Expected Results**:
- ✅ Achievement record created
- ✅ User stats updated (+points)
- ✅ Email logged in email_logs
- ✅ Email received in inbox
- ✅ No duplicate unlocks allowed

---

### 10. Leaderboard

**Test API**: `GET /api/gamification/leaderboard`

```bash
# Get leaderboard
curl http://localhost:3000/api/gamification/leaderboard?limit=10

# Filter by campus
curl http://localhost:3000/api/gamification/leaderboard?campus_id=campus-uuid

# Filter by department
curl http://localhost:3000/api/gamification/leaderboard?department=CS
```

**Expected Response**:
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "user_id": "uuid",
      "total_points": 1250,
      "level": 5,
      "achievements_unlocked": 12
    }
  ]
}
```

**Verifications**:
- ✅ Rankings correct (ordered by points)
- ✅ Filtering works (campus/department)
- ✅ Cached response (5 min cache)
- ✅ All users have profiles

---

### 11. XP Progress Glow

**Test Component**: In dashboard or profile

```tsx
<XPProgressGlow 
  currentXP={750}
  maxXP={1000}
  level={4}
  glowIntensity="high"
/>
```

**Visual Checks**:
- ✅ Progress bar fills correctly (75%)
- ✅ Glow effect visible around bar
- ✅ Shimmer animation moving
- ✅ 3 energy particles floating
- ✅ Level number displayed
- ✅ XP fraction shown (750/1000)
- ✅ When XP >= maxXP, "Ready to Level Up" badge appears

**Test Different Values**:
- 0 XP: Empty bar
- 500 XP: Half-filled bar
- 1000 XP: Full bar + badge

---

## 📧 **Email System Tests**

### 12. Email Sending

**Test Achievement Email**:
```bash
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "type": "achievement",
    "recipient_id": "user-uuid",
    "data": {
      "achievement": {
        "title": "First Steps",
        "description": "Complete your profile",
        "icon": "🎉",
        "points": 50
      }
    }
  }'
```

**Expected Results**:
- ✅ HTTP 200 response
- ✅ Email received in inbox (< 30 seconds)
- ✅ HTML formatting correct
- ✅ Achievement details visible
- ✅ CTA button works
- ✅ Email logged in database

**Test All Email Types**:
1. Achievement
2. Comment notification
3. Like notification
4. Welcome email
5. Resource approved
6. Weekly digest

---

### 13. Email Preferences

**Test Get Preferences**:
```bash
curl http://localhost:3000/api/email/send
```

**Expected Response**:
```json
{
  "preferences": {
    "email_achievements": true,
    "email_comments": true,
    "email_likes": true,
    "email_weekly_digest": true,
    "email_resource_approved": true,
    "email_welcome": true
  }
}
```

**Test Update Preferences**:
```bash
curl -X PATCH http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "email_achievements": false,
    "email_weekly_digest": false
  }'
```

**Verify**:
- ✅ Preferences updated in database
- ✅ Emails respect preferences (disabled types not sent)

---

## 📚 **Resource Upload Tests**

### 14. File Upload

**Test Upload**:
1. Go to resources page
2. Click "Upload Resource"
3. Fill form:
   - Title: "Test Resource"
   - Description: "Testing upload"
   - Type: "notes"
   - Department: "CS"
   - File: Select PDF (< 50 MB)
4. Submit

**Expected Results**:
- ✅ Upload progress shown
- ✅ Success message appears
- ✅ Confetti animation plays
- ✅ Thank you animation appears
- ✅ File stored in Supabase Storage
- ✅ Database record created with status='pending'

**Database Verification**:
```sql
SELECT * FROM resources 
WHERE title = 'Test Resource';
-- Check status='pending', file_url not null
```

---

### 15. Admin Approval

**Test Approval**:
1. Go to admin resources panel
2. Find pending resource
3. Set status to 'approved'
4. Submit

**Expected Results**:
- ✅ Status updated in database
- ✅ Email sent to uploader
- ✅ Confetti animation plays (admin side)
- ✅ Email logged in email_logs

**Check Email**:
- Uploader receives "Resource Approved" email
- Email includes resource title
- Link to resource page

---

## 🎨 **Emotional UI Context Tests**

### 16. Theme Adaptation

**Test Different Emotions**:
```tsx
const { theme, setEmotion } = useEmotionalUI()

setEmotion('happy')
console.log(theme.backgroundColor) 
// Should be: 'bg-gradient-to-br from-yellow-50 to-orange-50...'

setEmotion('calm')
console.log(theme.backgroundColor)
// Should be: 'bg-gradient-to-br from-blue-50 to-cyan-50...'
```

**Test All 7 Emotions**:
Each emotion should have unique:
- ✅ Background gradient
- ✅ Text color
- ✅ Accent color
- ✅ Animation speed

---

## 📱 **Mobile Responsiveness Tests**

### 17. Mobile View

**Test On**:
- iPhone (375px width)
- iPad (768px width)
- Android phone (360px width)

**Check Components**:
- ✅ Mood widget: Smaller size, still accessible
- ✅ Animations: Scale correctly
- ✅ XP bar: Readable on small screens
- ✅ Mindful break: Full-screen on mobile
- ✅ Level up: Scales to screen size
- ✅ Thank you: Card fits screen

---

## ♿ **Accessibility Tests**

### 18. Reduced Motion

**Test**:
1. Enable "Reduce motion" in OS settings
2. Trigger animations
3. Verify they're disabled or minimal

**macOS**: System Preferences → Accessibility → Display → Reduce motion
**Windows**: Settings → Ease of Access → Display → Show animations

**Expected Results**:
- ✅ Confetti disabled
- ✅ Animations simplified
- ✅ Core functionality still works

---

### 19. Keyboard Navigation

**Test**:
1. Use Tab key to navigate
2. Press Enter to activate buttons
3. Navigate mood widget with keyboard

**Expected Results**:
- ✅ All buttons focusable
- ✅ Focus indicator visible
- ✅ Enter key activates elements
- ✅ Escape closes popups

---

## 🔧 **Performance Tests**

### 20. Performance Metrics

**Test with Chrome DevTools**:
1. Open DevTools → Performance
2. Start recording
3. Trigger animations
4. Stop recording
5. Analyze

**Acceptable Ranges**:
- ✅ FPS: 55-60fps
- ✅ CPU: < 15% peak
- ✅ Memory: < 5MB increase
- ✅ Network: Minimal (cached assets)

---

## ✅ **Final Integration Test**

### Complete User Journey:

1. **Sign Up** → Welcome confetti
2. **Complete Profile** → Achievement unlocked
3. **Upload Resource** → Thank you animation
4. **Study for 2+ hours** → Mindful break appears
5. **Unlock 5 achievements** → Level up effect
6. **Reach Top 10** → Pride confetti
7. **Check Emails** → All notifications received

**Success Criteria**:
- ✅ All animations play smoothly
- ✅ All emails delivered
- ✅ Database correctly updated
- ✅ No errors in console
- ✅ No performance issues

---

## 🐛 **Bug Reporting Template**

If you find issues, report with:

```markdown
**Component**: [e.g., LevelUpEffect]
**Issue**: [Brief description]
**Steps to Reproduce**:
1. Step 1
2. Step 2

**Expected**: [What should happen]
**Actual**: [What actually happened]
**Screenshots**: [If applicable]
**Console Errors**: [Copy errors]
**Browser**: [Chrome/Safari/Firefox + version]
**Device**: [Desktop/Mobile/Tablet]
```

---

## 📊 **Testing Summary**

Total Tests: **20 Categories**

- [ ] Confetti Effects (6 styles)
- [ ] Level Up Effect
- [ ] Thank You Animation
- [ ] Sparkle Trail
- [ ] Emotion State Tracking
- [ ] Mood Widget
- [ ] Mindful Break
- [ ] Motivation Message
- [ ] Achievement System
- [ ] Leaderboard
- [ ] XP Progress Glow
- [ ] Email Sending
- [ ] Email Preferences
- [ ] Resource Upload
- [ ] Admin Approval
- [ ] Theme Adaptation
- [ ] Mobile Responsiveness
- [ ] Reduced Motion
- [ ] Keyboard Navigation
- [ ] Performance Metrics

---

## 🚀 **Ready for Production?**

All tests passing → ✅ **Deploy!**

Some tests failing → 🔧 **Fix and retest**

---

**Happy Testing! 🎉**
