# Animation Guidelines and Best Practices

This document outlines the animation guidelines and best practices for the CampusAxis project, ensuring consistent, accessible, and performant animations across all components.

## Table of Contents

1. [Consistent Animation Timing and Easing](#consistent-animation-timing-and-easing)
2. [Accessibility Considerations](#accessibility-considerations)
3. [Performance Optimization](#performance-optimization)
4. [Component-Specific Guidelines](#component-specific-guidelines)
5. [Glassmorphism Animation Patterns](#glassmorphism-animation-patterns)
6. [Micro-interactions](#micro-interactions)
7. [Testing and Validation](#testing-and-validation)

## Consistent Animation Timing and Easing

### Timing Classes

We've established consistent animation timing classes in `globals.css`:

- `.animate-duration-75` - 75ms
- `.animate-duration-100` - 100ms
- `.animate-duration-150` - 150ms
- `.animate-duration-200` - 200ms
- `.animate-duration-300` - 300ms (default for most interactions)
- `.animate-duration-400` - 400ms
- `.animate-duration-500` - 500ms
- `.animate-duration-700` - 700ms
- `.animate-duration-1000` - 1000ms

### Easing Functions

We use consistent easing functions for different types of animations:

- `.animate-ease-default` - `cubic-bezier(0.4, 0, 0.2, 1)` (easeInOut)
- `.animate-ease-in` - `cubic-bezier(0.4, 0, 1, 1)` (easeIn)
- `.animate-ease-out` - `cubic-bezier(0, 0, 0.2, 1)` (easeOut)
- `.animate-ease-linear` - `linear`
- `.animate-ease-spring` - `cubic-bezier(0.175, 0.885, 0.32, 1.1)` (spring)
- `.animate-ease-bounce` - `cubic-bezier(0.68, -0.55, 0.265, 1.55)` (bounce)
- `.animate-ease-elastic` - `cubic-bezier(0.68, -0.55, 0.265, 1.55)` (elastic)

### Usage Guidelines

1. **Default interactions**: Use `animate-duration-300` with `animate-ease-spring` for most hover and interactive animations
2. **State changes**: Use `animate-duration-200` with `animate-ease-default` for quick state transitions
3. **Entrance/Exit animations**: Use `animate-duration-500` with `animate-ease-default` for modal/dialog transitions
4. **Loading animations**: Use `animate-duration-1000` with `animate-ease-linear` for progress indicators

## Accessibility Considerations

### Prefers Reduced Motion

All animations must respect the `prefers-reduced-motion` media query. Components should:

1. Import the `usePrefersReducedMotion` hook from `@/hooks/use-enhanced-animations`
2. Conditionally apply animations based on user preferences
3. Use `transition-none` class when reduced motion is preferred

```tsx
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const MyComponent = () => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  const animationClasses = prefersReducedMotion 
    ? "transition-none" 
    : "transition-all animate-duration-300 animate-ease-spring"
    
  return (
    <div className={animationClasses}>
      {/* Component content */}
    </div>
  )
}
```

### Focus States

Ensure all interactive elements have clear focus states:
- Use `focus-visible` for keyboard navigation
- Apply `outline-none` with custom focus rings
- Maintain 3:1 contrast ratio for focus indicators

## Performance Optimization

### Best Practices

1. **Use `transform` and `opacity`**: These properties are GPU-accelerated
2. **Avoid layout thrashing**: Don't animate properties that trigger reflows
3. **Limit simultaneous animations**: Avoid animating too many elements at once
4. **Use `will-change`**: Apply to elements that will animate frequently
5. **Debounce scroll animations**: Limit scroll-triggered animations to 60fps

### Mobile Considerations

1. **Reduce animation intensity**: Lower durations and effects on mobile
2. **Disable non-essential animations**: Remove decorative animations on low-end devices
3. **Use `requestAnimationFrame`**: For JavaScript-based animations
4. **Test on real devices**: Verify performance across different hardware

## Component-Specific Guidelines

### Buttons

- **Hover**: `animate-duration-300` with `animate-ease-spring` and slight scale transform
- **Press**: Immediate scale reduction (0.95-0.98)
- **Ripple effect**: 600ms linear fade-out

### Cards

- **Hover**: `animate-duration-200` with `animate-ease-out` and subtle elevation
- **Press**: Immediate transform for tactile feedback
- **Entrance**: Staggered animations with `animate-duration-500`

### Form Elements

- **Focus**: `animate-duration-200` with `animate-ease-default`
- **Validation**: Color transitions with `animate-duration-300`
- **Loading states**: Pulse animations with `animate-duration-1000`

### Navigation

- **Menu items**: `animate-duration-200` with `animate-ease-spring`
- **Dropdowns**: Entrance/exit with `animate-duration-300`
- **Active states**: Immediate visual feedback

## Glassmorphism Animation Patterns

### Interactive Effects

1. **Hover glow**: Subtle shadow enhancement with `animate-duration-300`
2. **Depth effect**: TranslateZ transformations with `animate-ease-spring`
3. **Border transitions**: Color and opacity changes with `animate-duration-200`

### Loading States

1. **Pulse effect**: Opacity cycling with `animate-duration-2000`
2. **Shimmer**: Linear gradient movement with `animate-duration-1500`
3. **Gradient shifts**: Background position changes with `animate-duration-3000`

## Micro-interactions

### Types of Micro-interactions

1. **Button feedback**: Ripple effects, scale changes
2. **Form validation**: Icon transitions, color changes
3. **State indicators**: Loading spinners, success ticks
4. **Navigation cues**: Arrow rotations, menu transitions

### Implementation Guidelines

1. **Keep it subtle**: Micro-interactions should enhance, not distract
2. **Be consistent**: Use the same timing and easing for similar interactions
3. **Provide feedback**: Ensure users understand the result of their actions
4. **Respect user preferences**: Always check for `prefers-reduced-motion`

## Testing and Validation

### Automated Testing

1. **Unit tests**: Verify animation classes are applied correctly
2. **Accessibility tests**: Check `prefers-reduced-motion` support
3. **Performance tests**: Monitor frame rates and CPU usage

### Manual Testing

1. **Device testing**: Test on various screen sizes and hardware
2. **Browser testing**: Verify consistency across browsers
3. **User testing**: Gather feedback on animation effectiveness
4. **Accessibility testing**: Test with screen readers and keyboard navigation

### Performance Monitoring

1. **Frame rate**: Maintain 60fps for all animations
2. **CPU usage**: Monitor for excessive resource consumption
3. **Battery impact**: Test on mobile devices for battery drain
4. **Memory usage**: Check for memory leaks in JavaScript animations

## Conclusion

These guidelines ensure our animations enhance the user experience while maintaining accessibility and performance standards. Always refer to this document when implementing new animations or modifying existing ones.