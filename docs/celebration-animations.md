# Celebration Animations Documentation

## Overview

This documentation explains how to use the celebration animations system implemented in the CampusAxis application. The system provides engaging, motivational animations that enhance user experience and provide positive feedback for achievements and milestones.

## Available Animations

### 1. Confetti (`confetti`)
Celebratory confetti particles that burst from the center of the screen.

### 2. Balloons (`balloons`)
Floating balloons that rise from the bottom of the screen.

### 3. Flickering Lights (`sparkles`)
Sparkling lights that appear randomly across the screen.

### 4. Wrapping Ribbons (`ribbons`)
Colorful ribbons that wrap around the screen in decorative patterns.

### 5. Celebration Sequences
Combination of multiple animations for maximum impact.

## Implementation Files

- **Hook**: `hooks/use-celebration-animations.ts`
- **Component**: `components/animations/celebration-animation.tsx`
- **Context**: `contexts/animation-context.tsx`
- **CSS**: `app/globals.css` (animation definitions)

## Usage

### 1. Using the Hook

Import and use the `useCelebrationAnimations` hook in your components:

```typescript
import { useCelebrationAnimations } from '@/hooks/use-celebration-animations'

export default function MyComponent() {
  const {
    triggerConfetti,
    triggerBalloons,
    triggerFlickeringLights,
    triggerWrappingRibbons,
    triggerCelebrationSequence,
    triggerAchievement
  } = useCelebrationAnimations()

  const handleSuccess = () => {
    triggerConfetti({
      message: 'Task completed successfully!',
      duration: 5000,
      particleCount: 300
    })
  }

  return (
    <button onClick={handleSuccess}>
      Complete Task
    </button>
  )
}
```

### 2. Direct Component Usage

You can also use the `CelebrationAnimation` component directly:

```typescript
import { CelebrationAnimation } from '@/components/animations/celebration-animation'

export default function MyComponent() {
  const [showAnimation, setShowAnimation] = useState(false)

  return (
    <div>
      <button onClick={() => setShowAnimation(true)}>
        Show Celebration
      </button>
      
      {showAnimation && (
        <CelebrationAnimation
          type="confetti"
          message="Congratulations!"
          duration={5000}
        />
      )}
    </div>
  )
}
```

## API Reference

### `useCelebrationAnimations()` Hook

#### `triggerConfetti(options)`
- `message?: string` - Message to display during animation
- `duration?: number` - Duration in milliseconds (default: 5000)
- `position?: { x: number, y: number }` - Position in percentage (0-100)
- `particleCount?: number` - Number of confetti particles (default: 200)
- `colors?: string[]` - Array of color codes for particles

#### `triggerBalloons(options)`
- `message?: string` - Message to display during animation
- `duration?: number` - Duration in milliseconds (default: 6000)
- `balloonCount?: number` - Number of balloons (default: 15)

#### `triggerFlickeringLights(options)`
- `message?: string` - Message to display during animation
- `duration?: number` - Duration in milliseconds (default: 4000)
- `lightCount?: number` - Number of lights (default: 20)
- `colors?: string[]` - Array of color codes for lights

#### `triggerWrappingRibbons(options)`
- `message?: string` - Message to display during animation
- `duration?: number` - Duration in milliseconds (default: 7000)
- `ribbonCount?: number` - Number of ribbons (default: 10)
- `colors?: string[]` - Array of color codes for ribbons

#### `triggerCelebrationSequence(options)`
- `message?: string` - Message to display during animation
- `duration?: number` - Duration in milliseconds (default: 8000)
- `effects?: Array<'confetti' | 'balloons' | 'lights' | 'ribbons'>` - Animations to include

#### `triggerAchievement(options)`
- `title?: string` - Achievement title
- `description?: string` - Achievement description
- `duration?: number` - Duration in milliseconds (default: 5000)
- `type?: 'levelUp' | 'badge' | 'milestone'` - Type of achievement

## Customization

### Animation Intensity
Users can control animation intensity through the animation context:

```typescript
import { useAnimation } from '@/contexts/animation-context'

const { animationIntensity, setAnimationIntensity } = useAnimation()
// Values: 'low' | 'medium' | 'high'
```

### Disabling Animations
Users can disable animations entirely:

```typescript
import { useAnimation } from '@/contexts/animation-context'

const { isAnimationEnabled, setIsAnimationEnabled } = useAnimation()
```

## Accessibility

All animations respect the `prefers-reduced-motion` media query. When enabled, animations are automatically simplified or disabled to provide a better experience for users with motion sensitivity.

## Performance

Animations are optimized for performance:
- Uses CSS hardware acceleration where possible
- Automatically reduces complexity on mobile devices
- Implements proper cleanup to prevent memory leaks
- Respects user preferences for reduced motion

## Integration Examples

### Form Submission Success
```typescript
const handleSubmit = async (e) => {
  e.preventDefault()
  // ... form submission logic ...
  
  triggerAchievement({
    title: 'Form Submitted!',
    description: 'Thank you for your submission.',
    type: 'badge'
  })
}
```

### Gamification Milestones
```typescript
const checkLevelUp = (newLevel) => {
  if (newLevel % 10 === 0) {
    triggerCelebrationSequence({
      message: `Congratulations! You've reached level ${newLevel}!`,
      effects: ['confetti', 'balloons', 'lights'],
      duration: 8000
    })
  }
}
```

## Styling

Animations integrate with the existing glassmorphism design system:
- Uses `glass-card` and `glass-button` classes
- Respects dark mode preferences
- Implements proper focus states
- Works with all existing UI components

## Troubleshooting

### Animations Not Showing
1. Check if animations are enabled in the context
2. Verify the `prefers-reduced-motion` setting
3. Ensure the component is mounted in the DOM

### Performance Issues
1. Reduce animation intensity in the context
2. Use fewer particles/lights/ribbons
3. Consider disabling animations on low-end devices

## Best Practices

1. **Use Sparingly**: Don't overuse animations to maintain their impact
2. **Contextual Messaging**: Provide meaningful messages with animations
3. **Performance Awareness**: Test animations on various devices
4. **Accessibility First**: Always respect user preferences
5. **Consistent Branding**: Use colors that match your brand palette