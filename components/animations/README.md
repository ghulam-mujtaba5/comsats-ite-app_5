# CampusAxis Animation Components

This directory contains all the animation components and hooks for the CampusAxis application.

## New Celebration Animation Components

### 1. `use-celebration-animations.ts`
A custom hook that provides easy-to-use functions for triggering celebratory animations:
- `triggerConfetti()` - Confetti celebration effect
- `triggerBalloons()` - Floating balloons animation
- `triggerFlickeringLights()` - Sparkling lights effect
- `triggerWrappingRibbons()` - Wrapping ribbons animation
- `triggerCelebrationSequence()` - Combination of multiple animations
- `triggerAchievement()` - Achievement-based celebrations

### 2. `celebration-animation.tsx`
The main celebration animation component that renders different types of animations based on the provided type prop.

### 3. `wrapping-ribbons.tsx`
A specialized component for the wrapping ribbons animation effect.

### 4. `celebration-demo.tsx`
A demo component that showcases all the celebration animations with interactive buttons.

### 5. `form-celebration-example.tsx`
An example showing how to integrate celebration animations with form submissions.

### 6. `achievement-badge.tsx`
An interactive achievement badge component that triggers celebrations when earned.

## Updated Components

### 1. `index.ts`
Updated to export the new wrapping ribbons component and its types.

## Demo Pages

### 1. `/app/demo/celebration-demo/page.tsx`
A comprehensive demo page showcasing all the new celebration animations.

### 2. `/app/demo/celebration-demo/layout.tsx`
Layout component for the celebration demo page.

### 3. Updated `/app/demo/animations/page.tsx`
Added a link to the new celebration demo page.

## Documentation

### 1. `/docs/celebration-animations.md`
Detailed documentation on how to use the celebration animations system.

## CSS Updates

### 1. `/app/globals.css`
Added the `firework` animation keyframes and class for the fireworks effect.

## Context Updates

### 1. `/contexts/animation-context.tsx`
Added the `ribbons` animation type to the AnimationType enum.

## Usage Examples

To use the new celebration animations in your components:

```typescript
import { useCelebrationAnimations } from '@/hooks/use-celebration-animations'

export default function MyComponent() {
  const { triggerConfetti } = useCelebrationAnimations()
  
  const handleSuccess = () => {
    triggerConfetti({
      message: 'Task completed successfully!',
      duration: 5000
    })
  }
  
  return (
    <button onClick={handleSuccess}>
      Complete Task
    </button>
  )
}
```

## Animation Types

1. **Confetti** - Colorful paper pieces falling from the top of the screen
2. **Balloons** - Floating balloons rising from the bottom of the screen
3. **Flickering Lights** - Sparkling lights appearing randomly across the screen
4. **Wrapping Ribbons** - Decorative ribbons wrapping around the screen
5. **Celebration Sequences** - Combinations of multiple animations for maximum impact

## Accessibility

All animations respect the `prefers-reduced-motion` media query and will automatically simplify or disable when users prefer reduced motion.