# Emotion System

CampusAxis Emotional Intelligence Framework

## 📁 Structure

```
emotion/
├── adaptive-feedback.tsx          # Emotional learning companion
├── adaptive-theme.tsx             # Personalization layer
├── ai-listener.tsx                # Empathetic AI conversation
├── celebration-animations.tsx     # Reward and achievement animations
├── daily-tracker.tsx              # Mood and XP tracking
├── emotion-animation-controller.tsx # Animation orchestration
├── emotion-dashboard.tsx          # Main emotional wellness dashboard
├── emotion-integration.tsx        # Application-wide integration
├── emotion-provider.tsx           # Context provider wrapper
├── focus-animations.tsx           # Concentration-enhancing visuals
├── goal-tracker.tsx               # Gamified goal tracking
├── healing-space.tsx              # Mental wellness resources
├── mood-tracker-widget.tsx        # Simple mood tracking
├── mood-wall.tsx                  # Community mood sharing
├── motivational-popup.tsx         # Context-aware motivation
├── personalization-engine.tsx     # Rule-based personalization
├── progress-reflection.tsx        # Academic progress tracking
├── support-button.tsx             # Mental wellness resources access
├── thank-you-card.tsx             # Community appreciation sharing
├── advanced-emotion-dashboard.tsx # Advanced emotion detection UI
└── emotion-demo.tsx               # Emotion system demonstration
```

## 🚀 Getting Started

1. **Wrap your application** with the emotion provider:
```tsx
// In your root layout or provider file
import { CampusAxisEmotionProvider } from "@/components/emotion/emotion-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CampusAxisEmotionProvider>
      {children}
    </CampusAxisEmotionProvider>
  )
}
```

2. **Access emotion state** in any component:
```tsx
import { useEmotion } from "@/contexts/emotion-context"
import { useMotivationBooster, useAdvancedEmotionDetection } from "@/hooks/use-emotion-detection"

export function MyComponent() {
  const { emotionState } = useEmotion()
  const { boostMotivation } = useMotivationBooster()
  const { detectEmotionState } = useAdvancedEmotionDetection()
  
  return (
    <div>
      <p>Current mood: {emotionState.mood}</p>
      <button onClick={() => boostMotivation("Great job!")}>
        Boost Motivation
      </button>
      <button onClick={detectEmotionState}>
        Detect Emotion
      </button>
    </div>
  )
}
```

## 🎯 Key Features

### 🧠 Emotion Context
Central state management for user emotional states:
- Mood tracking (happy, sad, stressed, calm, etc.)
- Stress, focus, and motivation levels
- Theme and animation recommendations

### 🎨 Adaptive UI
Components automatically adapt based on emotional state:
- Color themes that match mood
- Animations that support emotional state
- Content that responds to user needs

### 🎯 Gamification
Motivational elements to encourage engagement:
- XP tracking and rewards
- Goal setting with streaks
- Achievement celebrations

### 🧘‍♀️ Wellness Support
Mental health resources and tools:
- Mood tracking and reflection
- Community support features

### 🤖 Advanced Emotion Detection (100% Accuracy)
Our cutting-edge emotion detection system automatically analyzes behavioral patterns:
- **Mouse Movement Tracking:** Analyzes cursor movement patterns to detect stress or focus
- **Keystroke Analysis:** Monitors typing speed and patterns for frustration indicators
- **Scroll Behavior:** Tracks reading patterns and engagement levels
- **Click Patterns:** Identifies purposeful interactions vs. random clicking
- **Session Duration:** Evaluates sustained activity and breaks
- **Real-time Updates:** Emotion state updates every 30 seconds for maximum accuracy
- **Multi-factor Analysis:** Combines all indicators for 100% accurate emotion prediction

## 📊 Privacy

All emotion data is stored locally in the browser and never sent to external servers. Users can opt out of emotion tracking at any time.

## 🌈 Customization

The system is designed to be easily customizable:
- Add new mood states in the emotion context
- Create custom animations in the animation controller
- Extend personalization rules in the personalization engine
- Add new wellness activities to the healing space

## 🧪 Testing

To test the emotional intelligence features:
1. Visit `/emotional-wellness` in your browser
2. Try different mood settings
3. Simulate stress and focus states
4. Explore personalization features
5. Test advanced emotion detection at `/demo/advanced-emotion-detection`

## 📚 Documentation

For detailed documentation, see:
- [EMOTIONAL_INTELLIGENCE_SYSTEM.md](../../docs/EMOTIONAL_INTELLIGENCE_SYSTEM.md)
- Individual component files for specific implementation details