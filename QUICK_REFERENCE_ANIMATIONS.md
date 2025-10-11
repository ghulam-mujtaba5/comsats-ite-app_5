# 🎯 CampusAxis Animation & Emotion System - Quick Reference

## 📦 Import Cheat Sheet

```typescript
// Hooks
import { useConfettiEffect } from '@/hooks/use-confetti-effect'
import { useEmotionState } from '@/hooks/use-emotion-state'

// Context
import { useEmotionalUI, EmotionalUIProvider } from '@/contexts/emotional-ui-context'

// Components - Animations
import { CelebrationAnimation } from '@/components/animations/celebration-animation'
import { ThankYouAnimation } from '@/components/animations/thank-you-animation'
import { LevelUpEffect } from '@/components/animations/level-up-effect'
import { SparkleTrail } from '@/components/animations/sparkle-trail'
import { EmotionAnimation } from '@/components/animations/emotion-animation'

// Components - Emotions
import { MoodWidget } from '@/components/emotions/mood-widget'
import { MindfulBreak } from '@/components/emotions/mindful-break'
import { MotivationMessage } from '@/components/emotions/motivation-message'

// Components - Gamification
import { XPProgressGlow } from '@/components/gamification/xp-progress-glow'
```

---

## 🎊 Common Use Cases

### 1. User Signs Up
```tsx
const { burst } = useConfettiEffect()

const handleSignup = async () => {
  await registerUser()
  burst() // Celebration!
}
```

### 2. Achievement Unlocked
```tsx
const [showEffect, setShowEffect] = useState(false)
const { stars } = useConfettiEffect()

const unlockAchievement = async (id) => {
  await fetch('/api/gamification/unlock', {
    method: 'POST',
    body: JSON.stringify({ achievementId: id })
  })
  stars()
  setShowEffect(true)
}

return <LevelUpEffect trigger={showEffect} level={5} xpGained={100} />
```

### 3. Contribution Accepted
```tsx
const [showThanks, setShowThanks] = useState(false)

const approveContribution = async () => {
  await fetch('/api/approve', { method: 'POST' })
  setShowThanks(true)
}

return (
  <ThankYouAnimation 
    trigger={showThanks}
    userName="John"
    message="Your contribution made an impact!"
  />
)
```

### 4. Track Study Session
```tsx
const { trackActivity, suggestBreak } = useEmotionState()

useEffect(() => {
  trackActivity('study', 30) // 30 minutes
  
  if (suggestBreak()) {
    // Show break suggestion
  }
}, [])
```

### 5. Show XP Progress
```tsx
const [stats, setStats] = useState(null)

useEffect(() => {
  fetch('/api/gamification/progress')
    .then(res => res.json())
    .then(setStats)
}, [])

return stats && (
  <XPProgressGlow 
    currentXP={stats.total_points}
    maxXP={1000}
    level={stats.level}
  />
)
```

### 6. Motivational Popup
```tsx
const [showMotivation, setShowMotivation] = useState(false)

// After task completion
setShowMotivation(true)

return (
  <MotivationMessage 
    trigger={showMotivation}
    icon="sparkles"
    position="top"
  />
)
```

### 7. Mouse Trail Effect
```tsx
const { emotion } = useEmotionalUI()

return (
  <SparkleTrail 
    enabled={emotion === 'happy'}
    density="medium"
  />
)
```

---

## 🎨 Emotion Types & Themes

| Emotion | Color | Use When |
|---------|-------|----------|
| `happy` | Yellow | Success, Achievement |
| `calm` | Blue | Study Mode, Reading |
| `stressed` | Red | Long Session, High Activity |
| `motivated` | Orange | Goals, Challenges |
| `lonely` | Purple | Low Social Activity |
| `focused` | Indigo | Deep Work Mode |
| `neutral` | Gray | Default State |

---

## 🎯 Animation Types

### Confetti Effects
```tsx
const { burst, rain, fireworks, cannon, stars, pride } = useConfettiEffect()

burst()     // Quick celebration
rain()      // 3-second falling confetti
fireworks() // 3-second fireworks show
cannon()    // Powerful burst
stars()     // Star sparkles
pride()     // Rainbow confetti
```

### Celebration Animations
```tsx
<CelebrationAnimation 
  type="confetti"      // confetti, fireworks, balloons, sparkles, successGlow, trophyShine
  message="Well done!" 
  duration={5000}
  onComplete={() => console.log('Done')}
/>
```

---

## 📧 Email Notifications

### Send Email (Automatic)
Already integrated in:
- `/api/gamification/unlock` → Achievement email
- `/api/admin/resources` → Approval email

### Manual Email Send
```tsx
await fetch('/api/email/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'achievement', // achievement, comment, like, welcome, resource_approved, weekly_digest
    recipient_id: 'user-uuid',
    data: {
      achievement: {
        title: 'First Steps',
        description: 'Complete your profile',
        icon: '🎉',
        points: 50
      }
    }
  })
})
```

### Get Email Preferences
```tsx
const res = await fetch('/api/email/send')
const { preferences } = await res.json()
// { email_achievements: true, email_comments: true, ... }
```

### Update Preferences
```tsx
await fetch('/api/email/send', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email_achievements: false,
    email_weekly_digest: true
  })
})
```

---

## 🎮 Gamification APIs

### Get All Achievements
```bash
GET /api/gamification/achievements
GET /api/gamification/achievements?category=academic
GET /api/gamification/achievements?rarity=legendary
```

### Unlock Achievement
```bash
POST /api/gamification/unlock
Body: { achievementId: "uuid" }
```

### Get User's Achievements
```bash
GET /api/gamification/unlock
```

### Get Leaderboard
```bash
GET /api/gamification/leaderboard
GET /api/gamification/leaderboard?campus_id=uuid
GET /api/gamification/leaderboard?department=CS
GET /api/gamification/leaderboard?limit=10
```

### Get User Progress
```bash
GET /api/gamification/progress
```

Response:
```json
{
  "stats": {
    "total_points": 500,
    "level": 3,
    "achievements_unlocked": 8
  },
  "rank": 15,
  "progress_percentage": 45
}
```

---

## 🎭 Emotion State Hook

```tsx
const {
  emotionState,        // { current, intensity, lastChanged, history }
  setEmotion,          // (emotion, intensity) => void
  trackActivity,       // (type, duration) => void
  detectStress,        // () => { isStressed, reason, intensity }
  suggestBreak,        // () => boolean
  getMotivationalMessage, // () => string
  resetSession         // () => void
} = useEmotionState()

// Examples
setEmotion('happy', 80)
trackActivity('study', 45)
const stressed = detectStress()
if (suggestBreak()) {
  // Show break dialog
}
const message = getMotivationalMessage()
```

---

## 🌈 Emotional UI Context

```tsx
const {
  emotion,             // Current emotion type
  intensity,           // 0-100
  setEmotion,          // Change emotion
  trackActivity,       // Log activity
  suggestBreak,        // Check if break needed
  getMotivationalMessage, // Get message
  theme                // { backgroundColor, textColor, accentColor, animationSpeed }
} = useEmotionalUI()

// Use theme classes
<div className={theme.backgroundColor}>
  <p className={theme.textColor}>Hello</p>
  <span className={theme.accentColor}>Important</span>
</div>
```

---

## 🔧 Configuration

### Animation Intensity (in Animation Context)
```tsx
// Already exists in animation-context.tsx
const { animationIntensity } = useAnimation()
// 'low' | 'medium' | 'high'
```

### Reduced Motion Support
All animations automatically respect:
```css
@media (prefers-reduced-motion: reduce) {
  /* Animations disabled */
}
```

---

## 📱 Responsive Design

All components are mobile-optimized:
- Mood widget: Smaller on mobile
- Animations: Scaled for screen size
- Breakpoints: Uses Tailwind responsive classes

---

## 🎯 Performance Tips

1. **Lazy Load**: Only import animations when needed
2. **Conditional Rendering**: Use `trigger` prop to control visibility
3. **Cleanup**: Components auto-cleanup on unmount
4. **Throttling**: Sparkle trail throttles mouse events
5. **Memoization**: Use React.memo for animation wrappers

---

## 🐛 Debug Mode

```tsx
// Check emotion state
console.log(emotionState)

// Check animation status
import { useAnimation } from '@/contexts/animation-context'
const { isAnimationEnabled } = useAnimation()

// Check email preferences
fetch('/api/email/send').then(r => r.json()).then(console.log)
```

---

## 🔗 Related Files

- Migrations: `supabase/migrations/202510110000*.sql`
- Email Templates: `lib/resend-email.ts`
- Email API: `app/api/email/send/route.ts`
- Achievement Hook: `hooks/use-achievements.ts`
- Upload API: `app/api/resources/upload/route.ts`

---

## 🚀 Quick Start Template

```tsx
'use client'

import { useState } from 'react'
import { useConfettiEffect } from '@/hooks/use-confetti-effect'
import { useEmotionState } from '@/hooks/use-emotion-state'
import { MoodWidget } from '@/components/emotions/mood-widget'
import { LevelUpEffect } from '@/components/animations/level-up-effect'

export default function MyPage() {
  const { burst } = useConfettiEffect()
  const { trackActivity } = useEmotionState()
  const [showLevelUp, setShowLevelUp] = useState(false)
  
  const handleAction = () => {
    trackActivity('contribution', 5)
    burst()
    setShowLevelUp(true)
  }
  
  return (
    <div>
      <button onClick={handleAction}>Complete Task</button>
      <MoodWidget />
      <LevelUpEffect trigger={showLevelUp} level={5} xpGained={100} />
    </div>
  )
}
```

---

## 📚 Full Documentation

See `ANIMATION_EMOTIONAL_WELLNESS_COMPLETE.md` for complete details.
