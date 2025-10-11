# 🎯 CampusAxis Animation Integration - Quick Start Guide

## ⚡ Copy-Paste Ready Code Snippets

Use these pre-tested snippets to quickly add animations to any module.

---

## 🏠 1. Basic Page Setup

### Wrap Any Page with Animations
```tsx
import { PageTransition, FadeInScroll } from '@/components/animations/enhanced'

export default function MyPage() {
  return (
    <PageTransition>
      <div className="container mx-auto py-8">
        <FadeInScroll>
          <h1>Page Title</h1>
          <p>Content here...</p>
        </FadeInScroll>
        
        {/* More sections */}
      </div>
    </PageTransition>
  )
}
```

---

## 🎴 2. Animated Cards

### Single Card
```tsx
import { AnimatedCard } from '@/components/animations/enhanced'

<AnimatedCard 
  enableHover={true} 
  enableGlow={true}
  className="p-6"
>
  <h3>Card Title</h3>
  <p>Card content...</p>
</AnimatedCard>
```

### Card Grid with Stagger
```tsx
import { StaggerContainer, StaggerItem, AnimatedCard } from '@/components/animations/enhanced'

<StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.1}>
  {items.map((item) => (
    <StaggerItem key={item.id}>
      <AnimatedCard enableHover={true}>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </AnimatedCard>
    </StaggerItem>
  ))}
</StaggerContainer>
```

---

## 🔢 3. Animated Numbers (Stats, Counts)

### Basic Count-Up
```tsx
import { CountUp } from '@/components/animations/enhanced'

<div>
  Total Users: <CountUp end={1234} duration={2000} />
</div>
```

### With Prefix/Suffix
```tsx
<CountUp 
  end={99} 
  duration={1500} 
  prefix="$" 
  suffix="%" 
/>
```

### Multiple Stats
```tsx
const stats = [
  { label: 'Users', value: 1234 },
  { label: 'Posts', value: 5678 },
  { label: 'Comments', value: 9012 }
]

{stats.map((stat) => (
  <div key={stat.label}>
    <div className="text-3xl font-bold">
      <CountUp end={stat.value} duration={2000} />
    </div>
    <div className="text-sm text-muted-foreground">{stat.label}</div>
  </div>
))}
```

---

## 🔴 4. Pulse Indicators (Live, Active, Online)

### Live Indicator
```tsx
import { Pulse } from '@/components/animations/enhanced'

<Pulse active={true}>
  <div className="w-3 h-3 bg-green-500 rounded-full" />
</Pulse>
```

### With Text
```tsx
<div className="flex items-center gap-2">
  <Pulse active={isLive}>
    <div className="w-2 h-2 bg-green-500 rounded-full" />
  </Pulse>
  <span className="text-sm text-green-600">Live</span>
</div>
```

### Online Status
```tsx
<div className="relative">
  <Avatar src={user.avatar} />
  <Pulse active={user.isOnline}>
    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
  </Pulse>
</div>
```

---

## 🎉 5. Success Celebrations

### Simple Success Checkmark
```tsx
import { CheckmarkDraw } from '@/components/animations/enhanced'
import { useState } from 'react'

const [showSuccess, setShowSuccess] = useState(false)

const handleSubmit = async () => {
  await submitForm()
  setShowSuccess(true)
  setTimeout(() => setShowSuccess(false), 2000)
}

{showSuccess && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white p-8 rounded-lg">
      <CheckmarkDraw size={64} className="text-green-500" />
      <p className="mt-4 text-center">Success!</p>
    </div>
  </div>
)}
```

### With Confetti
```tsx
import { useConfettiEffect } from '@/hooks/use-confetti-effect'
import { CheckmarkDraw } from '@/components/animations/enhanced'

const { burst, fireworks, cannon } = useConfettiEffect()

const handleSuccess = () => {
  burst()  // Quick celebration
  setShowCheck(true)
}

const handleMajorSuccess = () => {
  fireworks()  // Big celebration
  setShowCheck(true)
}
```

---

## 📊 6. Progress Bars

### Basic Progress
```tsx
import { AnimatedProgress } from '@/components/animations/enhanced'

<AnimatedProgress 
  value={uploadProgress} 
  max={100}
  showLabel={true}
/>
```

### Gradient Progress
```tsx
<AnimatedProgress 
  value={progress} 
  max={100}
  variant="gradient"
  showLabel={true}
  className="h-3"
/>
```

### Glowing Progress
```tsx
<AnimatedProgress 
  value={progress} 
  max={100}
  variant="glow"
  showLabel={true}
/>
```

---

## 🔘 7. Animated Buttons

### Basic Animated Button
```tsx
import { AnimatedButton } from '@/components/animations/enhanced'

<AnimatedButton 
  onClick={handleClick}
  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg"
>
  Click Me
</AnimatedButton>
```

### Glowing Button
```tsx
<AnimatedButton 
  variant="glow"
  onClick={handleClick}
  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg"
>
  Submit
</AnimatedButton>
```

---

## 📋 8. Loading States

### Shimmer Skeleton
```tsx
import { Shimmer } from '@/components/animations/enhanced'

{isLoading ? (
  <div className="space-y-4">
    <Shimmer width="w-full" height="h-20" />
    <Shimmer width="w-3/4" height="h-4" />
    <Shimmer width="w-1/2" height="h-4" />
  </div>
) : (
  <div>Actual content...</div>
)}
```

### Loading Card Grid
```tsx
{isLoading ? (
  <div className="grid grid-cols-3 gap-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="space-y-3">
        <Shimmer width="w-full" height="h-40" />
        <Shimmer width="w-3/4" height="h-4" />
        <Shimmer width="w-1/2" height="h-4" />
      </div>
    ))}
  </div>
) : (
  <div>Actual cards...</div>
)}
```

---

## 🎈 9. Bounce Attention Effects

### Notification Badge
```tsx
import { Bounce } from '@/components/animations/enhanced'

<Bounce active={hasNewNotifications}>
  <Badge variant="destructive">
    {notificationCount}
  </Badge>
</Bounce>
```

### Call-to-Action
```tsx
<Bounce active={true}>
  <Button size="lg">
    Limited Time Offer!
  </Button>
</Bounce>
```

---

## 📝 10. Modal/Dialog Animations

### Animated Modal
```tsx
import { AnimatedModal } from '@/components/animations/enhanced'

const [isOpen, setIsOpen] = useState(false)

<AnimatedModal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
>
  <h2 className="text-2xl font-bold mb-4">Modal Title</h2>
  <p className="mb-6">Modal content...</p>
  <Button onClick={() => setIsOpen(false)}>Close</Button>
</AnimatedModal>
```

---

## 🎪 11. Complete Success Flow

### Upload with Progress → Success → Confetti
```tsx
import { useState } from 'react'
import { AnimatedProgress, CheckmarkDraw } from '@/components/animations/enhanced'
import { useConfettiEffect } from '@/hooks/use-confetti-effect'

export function UploadFlow() {
  const [progress, setProgress] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const { burst } = useConfettiEffect()

  const handleUpload = async () => {
    // Simulate upload
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i)
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    // Success!
    setShowSuccess(true)
    burst()
    setTimeout(() => setShowSuccess(false), 2000)
  }

  return (
    <div>
      {progress > 0 && progress < 100 && (
        <AnimatedProgress 
          value={progress} 
          variant="glow"
          showLabel={true}
        />
      )}
      
      {showSuccess && (
        <div className="flex items-center gap-2 text-green-600">
          <CheckmarkDraw size={24} />
          <span>Upload successful!</span>
        </div>
      )}
      
      <Button onClick={handleUpload}>Upload File</Button>
    </div>
  )
}
```

---

## 📖 12. Module-Specific Templates

### Past Papers Page Template
```tsx
import { PageTransition, StaggerContainer, StaggerItem, AnimatedCard, CheckmarkDraw } from '@/components/animations/enhanced'
import { useState } from 'react'

export default function PastPapersPage() {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null)

  const handleDownload = (paperId: string) => {
    // Download logic
    setDownloadSuccess(paperId)
    setTimeout(() => setDownloadSuccess(null), 2000)
  }

  return (
    <PageTransition>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8">Past Papers</h1>
        
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {papers.map((paper) => (
            <StaggerItem key={paper.id}>
              <AnimatedCard enableHover={true}>
                <h3>{paper.title}</h3>
                <p>{paper.course}</p>
                
                {downloadSuccess === paper.id ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckmarkDraw size={20} />
                    <span>Downloaded!</span>
                  </div>
                ) : (
                  <Button onClick={() => handleDownload(paper.id)}>
                    Download
                  </Button>
                )}
              </AnimatedCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </PageTransition>
  )
}
```

### Profile Page Template
```tsx
import { AnimatedCard, AnimatedProgress, CountUp, Bounce } from '@/components/animations/enhanced'
import { Trophy } from 'lucide-react'

export default function ProfilePage({ user }) {
  return (
    <div className="container mx-auto py-8">
      {/* XP Progress */}
      <AnimatedCard enableGlow={true} className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Level {user.level}</h3>
            <p className="text-sm text-muted-foreground">
              <CountUp end={user.xp} /> / <CountUp end={user.nextLevelXP} /> XP
            </p>
          </div>
          {user.isTopContributor && (
            <Bounce active={true}>
              <Trophy className="text-yellow-500 w-8 h-8" />
            </Bounce>
          )}
        </div>
        
        <AnimatedProgress 
          value={user.xp} 
          max={user.nextLevelXP}
          variant="gradient"
          showLabel={true}
        />
      </AnimatedCard>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <AnimatedCard key={stat.label} enableHover={true} className="p-4">
            <div className="text-3xl font-bold">
              <CountUp end={stat.value} duration={2000} />
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  )
}
```

### Leaderboard Page Template
```tsx
import { StaggerContainer, StaggerItem, AnimatedCard, Bounce } from '@/components/animations/enhanced'
import { Trophy, Medal } from 'lucide-react'
import { useConfettiEffect } from '@/hooks/use-confetti-effect'
import { useEffect } from 'react'

export default function LeaderboardPage({ entries, userRank }) {
  const { fireworks } = useConfettiEffect()

  useEffect(() => {
    if (userRank === 1) {
      fireworks() // Celebrate #1!
    }
  }, [userRank, fireworks])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Leaderboard</h1>
      
      <StaggerContainer className="space-y-4">
        {entries.map((entry, index) => (
          <StaggerItem key={entry.id}>
            <AnimatedCard 
              enableHover={true}
              enableGlow={index < 3}
              className="p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold">
                    {index === 0 && (
                      <Bounce active={true}>
                        <Trophy className="text-yellow-500 w-8 h-8" />
                      </Bounce>
                    )}
                    {index === 1 && <Medal className="text-gray-400 w-7 h-7" />}
                    {index === 2 && <Medal className="text-amber-600 w-7 h-7" />}
                    {index > 2 && `#${index + 1}`}
                  </div>
                  
                  <div>
                    <div className="font-semibold">{entry.name}</div>
                    <div className="text-sm text-muted-foreground">
                      <CountUp end={entry.points} /> points
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  )
}
```

---

## 🎨 13. Animation Intensity Levels

### Subtle (Default)
```tsx
<AnimatedCard enableHover={true}>
  {/* Scale: 1.02, Duration: 0.2s */}
</AnimatedCard>
```

### Medium
```tsx
<AnimatedCard 
  enableHover={true}
  whileHover={{ scale: 1.05 }}
>
  {/* Scale: 1.05 */}
</AnimatedCard>
```

### Strong
```tsx
<motion.div
  whileHover={{ scale: 1.1, rotate: 5 }}
  transition={{ duration: 0.3 }}
>
  {/* Scale: 1.1 + Rotation */}
</motion.div>
```

---

## ✅ Quick Checklist for Any Page

When adding animations to a new page:

1. [ ] Import animation components at top
2. [ ] Wrap page with `<PageTransition>`
3. [ ] Replace plain cards with `<AnimatedCard>`
4. [ ] Replace card grids with `<StaggerContainer>` + `<StaggerItem>`
5. [ ] Replace numbers with `<CountUp>`
6. [ ] Add `<Pulse>` to live indicators
7. [ ] Add `<Bounce>` to important badges
8. [ ] Add `<CheckmarkDraw>` to success states
9. [ ] Add confetti to major successes
10. [ ] Test with reduced motion enabled
11. [ ] Test on mobile devices
12. [ ] Check performance (60 FPS target)

---

## 🚀 Deploy Checklist

Before deploying animations:

- [ ] All animations respect `prefers-reduced-motion`
- [ ] Frame rate stays at 60 FPS
- [ ] No memory leaks (test with Chrome DevTools)
- [ ] Mobile performance is smooth
- [ ] Lighthouse score is 90+
- [ ] Animations don't block interactions
- [ ] Loading states have shimmer/skeleton
- [ ] Success states have celebrations
- [ ] All numbers use CountUp
- [ ] All cards use AnimatedCard

---

## 💡 Pro Tips

1. **Keep it Subtle:** Most animations should be 0.2-0.3s
2. **Layer Effects:** Combine hover + glow for premium feel
3. **Celebrate Big Wins:** Use confetti sparingly for major successes
4. **Always Test:** Enable reduced motion and verify fallbacks
5. **Mobile First:** Test on slow devices first
6. **Stagger Lists:** Always use stagger for lists of 3+ items
7. **Pulse Live Data:** Use Pulse for real-time indicators
8. **Count Numbers:** Any number >10 should use CountUp

---

**Ready to animate CampusAxis! 🎉**

Just copy-paste these snippets and customize as needed.
All components are production-ready and performance-optimized.
