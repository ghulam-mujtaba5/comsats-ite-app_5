# 🎨 CampusAxis Animation Integration Map

## 📍 Where to Add Each Animation

This guide shows **exactly where** to integrate each animation component across CampusAxis.

---

## 🏠 **Dashboard** (`app/dashboard/page.tsx`)

### Add These:
```tsx
import { EmotionalUIProvider } from '@/contexts/emotional-ui-context'
import { MoodWidget } from '@/components/emotions/mood-widget'
import { XPProgressGlow } from '@/components/gamification/xp-progress-glow'
import { MindfulBreak } from '@/components/emotions/mindful-break'
import { useEmotionState } from '@/hooks/use-emotion-state'

export default function Dashboard() {
  const { suggestBreak, trackActivity } = useEmotionState()
  const [stats, setStats] = useState(null)
  
  useEffect(() => {
    trackActivity('study', 5) // Track dashboard visit
    
    // Fetch gamification stats
    fetch('/api/gamification/progress')
      .then(res => res.json())
      .then(setStats)
  }, [])
  
  return (
    <EmotionalUIProvider>
      <div>
        {/* XP Bar at top */}
        {stats && (
          <XPProgressGlow 
            currentXP={stats.stats.total_points}
            maxXP={1000}
            level={stats.stats.level}
            glowIntensity="high"
          />
        )}
        
        {/* Your existing dashboard content */}
        
        {/* Mood widget (bottom-right) */}
        <MoodWidget />
        
        {/* Break suggestion (auto-triggers) */}
        <MindfulBreak autoTrigger={suggestBreak()} />
      </div>
    </EmotionalUIProvider>
  )
}
```

**Animations Triggered**:
- ✅ XP Progress Bar (always visible)
- ✅ Mood Widget (always visible)
- ✅ Mindful Break (after 2+ hours)

---

## 🏆 **Achievements Page** (`app/achievements/page.tsx`)

### Add These:
```tsx
import { useState } from 'react'
import { useConfettiEffect } from '@/hooks/use-confetti-effect'
import { LevelUpEffect } from '@/components/animations/level-up-effect'
import { MotivationMessage } from '@/components/emotions/motivation-message'

export default function AchievementsPage() {
  const { stars, burst } = useConfettiEffect()
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showMotivation, setShowMotivation] = useState(false)
  const [levelData, setLevelData] = useState({ level: 0, xp: 0 })
  
  const unlockAchievement = async (id: string) => {
    const res = await fetch('/api/gamification/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ achievementId: id })
    })
    
    if (res.ok) {
      const data = await res.json()
      
      // Show stars animation
      stars()
      
      // Check if leveled up
      if (data.level_up) {
        setLevelData({ 
          level: data.new_level, 
          xp: data.points_earned 
        })
        setShowLevelUp(true)
      } else {
        // Just show motivation
        setShowMotivation(true)
      }
    }
  }
  
  return (
    <div>
      {/* Achievement cards with unlock buttons */}
      
      <LevelUpEffect 
        trigger={showLevelUp}
        level={levelData.level}
        xpGained={levelData.xp}
        title="Achievement Master!"
      />
      
      <MotivationMessage 
        trigger={showMotivation}
        icon="award"
        customMessage="Achievement Unlocked! Keep going! 🎉"
      />
    </div>
  )
}
```

**Animations Triggered**:
- ✅ Stars confetti (on unlock)
- ✅ Level Up effect (if leveled up)
- ✅ Motivation message (on unlock)

---

## 📚 **Resources Upload** (`components/resources/upload-resource-dialog.tsx`)

### Add These:
```tsx
import { useState } from 'react'
import { useConfettiEffect } from '@/hooks/use-confetti-effect'
import { ThankYouAnimation } from '@/components/animations/thank-you-animation'
import { useEmotionState } from '@/hooks/use-emotion-state'

export function UploadResourceDialog() {
  const { burst } = useConfettiEffect()
  const { trackActivity } = useEmotionState()
  const [showThanks, setShowThanks] = useState(false)
  
  const handleSuccess = (userName: string) => {
    // Track contribution
    trackActivity('contribution', 5)
    
    // Show animations
    burst()
    setShowThanks(true)
  }
  
  return (
    <>
      {/* Upload form */}
      
      <ThankYouAnimation 
        trigger={showThanks}
        userName={user?.full_name}
        message="Your resource is under review! Thanks for contributing to CampusAxis 📚"
        onComplete={() => setShowThanks(false)}
      />
    </>
  )
}
```

**Animations Triggered**:
- ✅ Confetti burst (on upload success)
- ✅ Thank you card with hearts (on upload success)

---

## 🎓 **Past Papers** (`app/past-papers/page.tsx`)

### Add These:
```tsx
import { useEmotionState } from '@/hooks/use-emotion-state'
import { EmotionAnimation } from '@/components/animations/emotion-animation'
import { useEffect } from 'react'

export default function PastPapersPage() {
  const { trackActivity, setEmotion } = useEmotionState()
  
  useEffect(() => {
    // Track study activity
    trackActivity('study', 30)
    
    // Set focused emotion
    setEmotion('focused', 70)
  }, [])
  
  return (
    <EmotionAnimation type="focused">
      <div>
        {/* Past papers content with focused glow */}
      </div>
    </EmotionAnimation>
  )
}
```

**Animations Triggered**:
- ✅ Focused glow (ambient)
- ✅ Activity tracking for break suggestions

---

## 🥇 **Leaderboard** (`app/leaderboard/page.tsx`)

### Add These:
```tsx
import { useConfettiEffect } from '@/hooks/use-confetti-effect'
import { MotivationMessage } from '@/components/emotions/motivation-message'
import { SparkleTrail } from '@/components/animations/sparkle-trail'

export default function LeaderboardPage() {
  const { pride } = useConfettiEffect()
  const [showMotivation, setShowMotivation] = useState(false)
  const [userRank, setUserRank] = useState<number | null>(null)
  
  useEffect(() => {
    fetch('/api/gamification/progress')
      .then(res => res.json())
      .then(data => {
        setUserRank(data.rank)
        
        // Celebrate if in top 10
        if (data.rank <= 10) {
          pride()
          setShowMotivation(true)
        }
      })
  }, [])
  
  return (
    <div>
      {/* Show sparkles for top 3 */}
      {userRank && userRank <= 3 && (
        <SparkleTrail enabled={true} density="high" />
      )}
      
      {/* Leaderboard content */}
      
      <MotivationMessage 
        trigger={showMotivation}
        icon="trending"
        customMessage="You're in the top 10! Amazing work! 🏆"
      />
    </div>
  )
}
```

**Animations Triggered**:
- ✅ Pride confetti (if in top 10)
- ✅ Sparkle trail (if in top 3)
- ✅ Motivation message (if in top 10)

---

## 👤 **User Profile** (`app/profile/page.tsx`)

### Add These:
```tsx
import { XPProgressGlow } from '@/components/gamification/xp-progress-glow'
import { EmotionAnimation } from '@/components/animations/emotion-animation'
import { useEmotionalUI } from '@/contexts/emotional-ui-context'

export default function ProfilePage() {
  const { emotion } = useEmotionalUI()
  const [stats, setStats] = useState(null)
  
  return (
    <div>
      {/* Profile header */}
      
      <EmotionAnimation type={emotion}>
        <div className="stats-section">
          {/* XP Progress */}
          {stats && (
            <XPProgressGlow 
              currentXP={stats.total_points}
              maxXP={1000}
              level={stats.level}
            />
          )}
          
          {/* Badge grid with emotion animation */}
          <div className="badges">
            {/* Achievement badges */}
          </div>
        </div>
      </EmotionAnimation>
    </div>
  )
}
```

**Animations Triggered**:
- ✅ XP Progress Bar
- ✅ Emotion-based ambient animation

---

## 📝 **Contribution Approval** (`app/admin/resources/page.tsx`)

### Add These:
```tsx
import { useConfettiEffect } from '@/hooks/use-confetti-effect'

export default function AdminResourcesPage() {
  const { cannon } = useConfettiEffect()
  
  const approveResource = async (id: string) => {
    const formData = new FormData()
    formData.append('id', id)
    formData.append('status', 'approved')
    
    await fetch('/api/admin/resources', {
      method: 'PUT',
      body: formData
    })
    
    // Celebrate approval
    cannon()
  }
  
  return (
    <div>
      {/* Resource list with approve buttons */}
    </div>
  )
}
```

**Animations Triggered**:
- ✅ Cannon confetti (on approval)
- ✅ Email sent automatically (backend)

---

## 🎉 **Events** (`app/events/page.tsx`)

### Add These:
```tsx
import { useConfettiEffect } from '@/hooks/use-confetti-effect'
import { CelebrationAnimation } from '@/components/animations/celebration-animation'

export default function EventsPage() {
  const { fireworks } = useConfettiEffect()
  const [showCelebration, setShowCelebration] = useState(false)
  
  const joinEvent = async (eventId: string) => {
    await fetch(`/api/events/${eventId}/join`, { method: 'POST' })
    
    // Celebrate joining
    fireworks()
    setShowCelebration(true)
  }
  
  return (
    <div>
      {/* Event cards */}
      
      <CelebrationAnimation 
        type="fireworks"
        message="You're registered! See you there! 🎊"
        trigger={showCelebration}
      />
    </div>
  )
}
```

**Animations Triggered**:
- ✅ Fireworks (on event join)
- ✅ Celebration message

---

## 🤝 **Community** (`app/community/page.tsx`)

### Add These:
```tsx
import { useConfettiEffect } from '@/hooks/use-confetti-effect'
import { ThankYouAnimation } from '@/components/animations/thank-you-animation'
import { useEmotionState } from '@/hooks/use-emotion-state'

export default function CommunityPage() {
  const { burst } = useConfettiEffect()
  const { trackActivity, setEmotion } = useEmotionState()
  const [showThanks, setShowThanks] = useState(false)
  
  useEffect(() => {
    // Set social emotion
    setEmotion('happy', 60)
    trackActivity('social', 10)
  }, [])
  
  const handleLike = () => {
    burst()
  }
  
  const handleComment = () => {
    setShowThanks(true)
  }
  
  return (
    <div>
      {/* Community posts */}
      
      <ThankYouAnimation 
        trigger={showThanks}
        message="Thanks for engaging with the community! 💬"
      />
    </div>
  )
}
```

**Animations Triggered**:
- ✅ Confetti burst (on like)
- ✅ Thank you animation (on comment)
- ✅ Happy emotion set

---

## ✨ **Welcome/Onboarding** (`app/welcome/page.tsx`)

### Add These:
```tsx
import { useEffect } from 'react'
import { useConfettiEffect } from '@/hooks/use-confetti-effect'
import { CelebrationAnimation } from '@/components/animations/celebration-animation'

export default function WelcomePage() {
  const { rain } = useConfettiEffect()
  
  useEffect(() => {
    // Welcome celebration
    rain()
    
    // Send welcome email (happens automatically via backend)
  }, [])
  
  return (
    <div>
      <CelebrationAnimation 
        type="confetti"
        message="Welcome to CampusAxis! 🎓"
        autoPlay={true}
        duration={5000}
      />
      
      {/* Onboarding content */}
    </div>
  )
}
```

**Animations Triggered**:
- ✅ Confetti rain (on load)
- ✅ Welcome message
- ✅ Welcome email (backend)

---

## 🎯 **Quick Integration Checklist**

For each page, consider:

| Action | Animation | When |
|--------|-----------|------|
| **Page Load** | Set emotion, track activity | Study/Social/Contribution |
| **Success Action** | Confetti burst/stars | Upload/Submit/Complete |
| **Achievement** | Level up effect | Points milestone |
| **Contribution** | Thank you animation | Upload/Comment/Help |
| **Social Action** | Hearts/Likes | Engagement |
| **Big Milestone** | Fireworks | Major achievements |
| **Long Session** | Mindful break | 2+ hours |
| **Always Show** | Mood widget | Bottom-right corner |

---

## 📦 Global Wrapper

### Root Layout (`app/layout.tsx`):
```tsx
import { EmotionalUIProvider } from '@/contexts/emotional-ui-context'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <EmotionalUIProvider>
          {children}
        </EmotionalUIProvider>
      </body>
    </html>
  )
}
```

---

## 🎨 Animation Decision Tree

```
User Action
    ↓
Is it a success? → Yes → Confetti (burst/stars)
    ↓ No
Is it a contribution? → Yes → Thank You Animation
    ↓ No
Is it a milestone? → Yes → Level Up Effect / Fireworks
    ↓ No
Is it social? → Yes → Hearts / Sparkles
    ↓ No
Long session? → Yes → Mindful Break
    ↓ No
Just browsing → Mood Widget + Activity Tracking
```

---

## 💡 Pro Tips

1. **Always track activity**: Call `trackActivity()` on page load
2. **Set emotion context**: Use `setEmotion()` based on page type
3. **Celebrate generously**: Users love positive feedback
4. **Respect reduced motion**: Animations auto-disable if needed
5. **Don't overdo it**: Max 1-2 animations per action
6. **Test on mobile**: Ensure animations scale properly

---

## 🚀 Ready to Integrate!

Start with:
1. **Dashboard** - Add XP bar + mood widget
2. **Achievements** - Add unlock animations
3. **Resources** - Add thank you animation
4. **Community** - Add social animations

Then expand to other pages as needed!

---

**Made with 💚 for CampusAxis developers**
