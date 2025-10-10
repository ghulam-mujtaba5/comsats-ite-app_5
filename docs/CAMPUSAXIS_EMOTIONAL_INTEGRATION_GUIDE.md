# 🧠 CampusAxis Emotional Intelligence Integration Guide

## 🎯 Overview

This guide explains how to integrate the emotional intelligence system with existing CampusAxis modules to create an emotionally supportive, motivating, and mentally wellness-focused experience for students.

## 📁 System Architecture

The emotional intelligence system consists of:

1. **Global Context**: [EmotionContext](../contexts/emotion-context.tsx) - Manages user emotion states
2. **Detection Hooks**: [use-emotion-detection.ts](../hooks/use-emotion-detection.ts) - Detects user emotions based on activity
3. **UI Components**: [emotion components](../components/emotion/) - Visual and interactive elements
4. **Animation System**: Integrated with existing animation context
5. **Storage**: localStorage for user preferences and Supabase for persistent data

## 🔧 Integration Points

### 1. Past Papers Module Integration

**File**: [campusaxis-integration-example.tsx](../components/emotion/campusaxis-integration-example.tsx)

**Features**:
- Late night study detection with break suggestions
- Completion celebration after reviewing multiple papers
- Stress detection during intensive study sessions

**Implementation**:
```tsx
import { PastPapersEmotionalIntegration } from "@/components/emotion/campusaxis-integration-example"

export function PastPaperViewer() {
  return (
    <div>
      {/* Your existing past paper viewer UI */}
      
      <PastPapersEmotionalIntegration 
        onViewPaper={() => console.log("Viewing paper")}
        onPaperCompleted={() => console.log("Paper completed")}
        userId="user123"
      />
    </div>
  )
}
```

### 2. Community/Events Module Integration

**Features**:
- Gratitude animations when contributing
- Recognition when helping others
- Community mood awareness

**Implementation**:
```tsx
import { CommunityEmotionalIntegration } from "@/components/emotion/campusaxis-integration-example"

export function CommunityActions() {
  return (
    <div>
      {/* Your existing community UI */}
      
      <CommunityEmotionalIntegration 
        onContribute={() => console.log("Contributed")}
        onHelpOthers={() => console.log("Helped others")}
      />
    </div>
  )
}
```

### 3. Leaderboard Module Integration

**Features**:
- Rank improvement celebrations
- Motivational popups for significant progress
- Streak recognition

**Implementation**:
```tsx
import { LeaderboardEmotionalIntegration } from "@/components/emotion/campusaxis-integration-example"

export function Leaderboard({ currentRank, previousRank }: { currentRank: number, previousRank: number }) {
  return (
    <div>
      {/* Your existing leaderboard UI */}
      
      <LeaderboardEmotionalIntegration 
        currentRank={currentRank}
        previousRank={previousRank}
      />
    </div>
  )
}
```

### 4. Profile Dashboard Integration

**Features**:
- Mood tracking widget
- Personalized wellness tips
- Usage pattern insights

**Implementation**:
```tsx
import { ProfileDashboardEmotionalIntegration } from "@/components/emotion/campusaxis-integration-example"

export function ProfileDashboard({ userId }: { userId: string }) {
  return (
    <div>
      {/* Your existing profile dashboard UI */}
      
      <ProfileDashboardEmotionalIntegration userId={userId} />
    </div>
  )
}
```

## 🎨 Emotional Feedback Layer

### Theme Adaptation
The system automatically adapts UI themes based on emotional state:

- **Calm Mode**: Soft blue gradients, slow animations
- **Motivation Mode**: Vibrant yellow-orange palette
- **Focus Mode**: Minimal UI with focus glow
- **Healing Mode**: Gentle background pulse

### Animation Triggers
Animations are triggered based on context:

| Emotion | Trigger | Animation |
|---------|---------|-----------|
| Happy | Achievement, success | Confetti, sparkles |
| Calm | Stress detection, break time | Soft particle drift |
| Stressed | Long sessions, repeated errors | Breathing glow |
| Motivated | Streaks, consistency | Fireworks burst |

## 💬 Humanized Interaction Examples

### Academic Context
- Past paper submission: "Well done, your effort helps everyone 🎓"
- Contributions: "That's teamwork in action 👏"
- Quiz failures: "It's okay, mistakes mean growth 🌱"
- Return after inactivity: "Welcome back! We missed you 💖"

### Study Context
- Long study sessions: "Take a break and breathe ☕"
- Consistent studying: "Your dedication is inspiring! 💪"
- Repeated errors: "Don't worry, mistakes = progress 💪"

## ⚙️ Technical Implementation

### 1. Provider Setup
Wrap your application with the emotion provider:

```tsx
// In your root layout
import { CampusAxisEmotionProvider } from "@/components/emotion/emotion-provider"

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <CampusAxisEmotionProvider>
      {children}
    </CampusAxisEmotionProvider>
  )
}
```

### 2. Using Emotion Hooks
Access emotion state in any component:

```tsx
import { useEmotion } from "@/contexts/emotion-context"
import { useMotivationBooster } from "@/hooks/use-emotion-detection"

export function MyComponent() {
  const { emotionState } = useEmotion()
  const { boostMotivation } = useMotivationBooster()
  
  return (
    <div className={`bg-${emotionState.mood === 'happy' ? 'yellow' : 'blue'}-100`}>
      <p>Current mood: {emotionState.mood}</p>
      <button onClick={() => boostMotivation("Great job!")}>
        Boost Motivation
      </button>
    </div>
  )
}
```

### 3. Triggering Animations
Use the animation context to trigger emotional animations:

```tsx
import { useAnimation } from "@/contexts/animation-context"

export function MyButton() {
  const { triggerAnimation } = useAnimation()
  
  const handleClick = () => {
    triggerAnimation({
      type: 'confetti',
      message: 'Well done! 🎉',
      duration: 3000,
    })
  }
  
  return <button onClick={handleClick}>Click me</button>
}
```

## 🧠 Emotion Detection Logic

The system detects emotions based on:

1. **Activity Patterns**: Frequency and type of interactions
2. **Time-Based Triggers**: Late night usage, session duration
3. **Performance Metrics**: Success/failure rates, streaks
4. **User Input**: Direct mood logging, feedback

### Configuration
```ts
const EMOTION_CONFIG = {
  IDLE_THRESHOLD: 30 * 60 * 1000, // 30 minutes
  LONG_SESSION_THRESHOLD: 60 * 60 * 1000, // 1 hour
  LATE_NIGHT_START: 22, // 10 PM
  LATE_NIGHT_END: 6, // 6 AM
  ACTIVITY_WINDOW: 10 * 60 * 1000, // 10 minutes
}
```

## 🛠️ Customization

### Adding New Emotions
1. Update the `MoodType` enum in [emotion-context.tsx](../contexts/emotion-context.tsx)
2. Add corresponding animations in [emotion-animation-controller.tsx](../components/emotion/emotion-animation-controller.tsx)
3. Update theme mappings in [adaptive-theme.tsx](../components/emotion/adaptive-theme.tsx)

### Adding New Triggers
1. Extend the emotion detection logic in [use-emotion-detection.ts](../hooks/use-emotion-detection.ts)
2. Add new motivational messages in [motivational-popup.tsx](../components/emotion/motivational-popup.tsx)
3. Create new animation components if needed

## 🔒 Privacy & Security

- All emotion data is stored locally in localStorage
- User can opt out of emotion tracking at any time
- No personal information is shared without explicit consent
- Supabase integration is optional and secure

## 🧪 Testing

### Manual Testing
1. Visit `/emotional-wellness` to test all features
2. Simulate different emotional states using the demo controls
3. Test integration points with sample data

### Automated Testing
```tsx
// Example test for emotion integration
import { render, screen } from '@testing-library/react'
import { EmotionProvider } from '@/contexts/emotion-context'

test('renders motivational message when user is stressed', () => {
  render(
    <EmotionProvider>
      <MyComponent />
    </EmotionProvider>
  )
  
  // Simulate stress state
  // Check for motivational message
})
```

## 🚀 Deployment

The emotional intelligence system is designed to work with the existing CampusAxis deployment configuration and requires no additional setup beyond the standard Next.js build process.

## 📚 Documentation

For detailed documentation on individual components:
- [Emotional Intelligence System Overview](./EMOTIONAL_INTELLIGENCE_SYSTEM.md)
- [Component README](../components/emotion/README.md)
- [Implementation Summary](./EMOTIONAL_INTELLIGENCE_IMPLEMENTATION_SUMMARY.md)
- [Feature Showcase](./EMOTIONAL_INTELLIGENCE_FEATURES_SHOWCASE.md)

---

*The CampusAxis Emotional Intelligence System transforms the academic experience into a supportive, adaptive, and motivating journey that helps students thrive both academically and emotionally. 💖*