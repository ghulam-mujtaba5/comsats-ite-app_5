# Glassmorphism Usage Guide

## Overview

This guide explains how to use the new glassmorphism components and utilities in the CampusAxis project. The implementation follows modern 2025 design trends with proper accessibility and performance considerations.

## Getting Started

### Prerequisites

Make sure you have the following files in your project:

1. `lib/glassmorphism-2025.ts` - Core utility functions
2. `app/globals.css` - CSS variables and base styles
3. Updated UI components in `components/ui/`

### Basic Usage

To use glassmorphism components, simply import and use them like any other UI component:

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function MyComponent() {
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>My Glass Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is a glassmorphism card.</p>
        <Button variant="glass" className="mt-4">
          Glass Button
        </Button>
      </CardContent>
    </Card>
  )
}
```

## Available Variants

### Card Variants

```tsx
// Primary glass card (high emphasis)
<Card variant="glass">

// Secondary glass card (medium emphasis)
<Card variant="glass-secondary">

// Subtle glass card (low emphasis)
<Card variant="glass-subtle">

// Premium glass card with gradient effects
<Card variant="glass-premium">

// Floating glass card with animation
<Card variant="glass-floating">

// Layered glass card with depth effects
<Card variant="glass-layered">
```

### Button Variants

```tsx
// Standard glass button
<Button variant="glass">

// Premium glass button with glow effects
<Button variant="glass-premium">
```

### Badge Variants

```tsx
// Standard glass badge
<Badge variant="glass">

// Subtle glass badge
<Badge variant="glass-subtle">
```

### Input Variants

```tsx
// Standard glass input
<Input variant="glass" />

// Subtle glass input
<Input variant="glass-subtle" />
```

### Alert Variants

```tsx
// Standard glass alert
<Alert variant="glass">

// Subtle glass alert
<Alert variant="glass-subtle">
```

### Dialog Variants

```tsx
// Standard glass dialog
<DialogContent variant="glass">

// Subtle glass dialog
<DialogContent variant="glass-subtle">
```

### Select Variants

```tsx
// Standard glass select
<SelectTrigger variant="glass">
<SelectContent variant="glass">

// Subtle glass select
<SelectTrigger variant="glass-subtle">
<SelectContent variant="glass-subtle">
```

### Tabs Variants

```tsx
// Standard glass tabs
<TabsList variant="glass">
<TabsTrigger variant="glass">

// Subtle glass tabs
<TabsList variant="glass-subtle">
<TabsTrigger variant="glass-subtle">
```

### Popover Variants

```tsx
// Standard glass popover
<PopoverContent variant="glass">

// Subtle glass popover
<PopoverContent variant="glass-subtle">
```

### Tooltip Variants

```tsx
// Standard glass tooltip
<TooltipContent variant="glass">

// Subtle glass tooltip
<TooltipContent variant="glass-subtle">
```

## Customization

### Using Presets

The library provides several presets for common use cases:

```tsx
import { getEnhancedGlassClasses, glassPresets } from '@/lib/glassmorphism-2025'

// Using a preset directly
const glassClasses = getEnhancedGlassClasses(glassPresets.card)

// Customizing a preset
const customClasses = getEnhancedGlassClasses({
  ...glassPresets.button,
  border: 'border-glow',
  shadow: 'shadow-strong'
})
```

### Available Presets

1. `card` - Standard card components
2. `cardPremium` - Premium card components with gradient effects
3. `cardInteractive` - Interactive card components
4. `button` - Button components
5. `input` - Input field components
6. `badge` - Badge components
7. `modal` - Modal/dialog components
8. `dropdown` - Dropdown/menu components
9. `navigation` - Navigation components
10. `hero` - Hero section components
11. `panel` - Panel components
12. `sidebar` - Sidebar components
13. `floatingCard` - Floating card components
14. `layeredCard` - Layered card components

### Custom Options

You can customize glassmorphism effects with the following options:

```typescript
interface EnhancedGlassOptions {
  // Base variant
  variant?: GlassVariant
  
  // Border style
  border?: GlassBorder
  
  // Shadow style
  shadow?: GlassShadow
  
  // Hover effects
  hover?: boolean
  
  // Interactive effects
  interactive?: boolean
  
  // Glow effect
  glow?: boolean
  
  // Gradient overlay
  gradient?: boolean
  
  // Floating effect
  floating?: boolean
  
  // Depth effect
  depth?: boolean
  
  // Accessibility options
  accessibility?: {
    reducedMotion?: boolean
    highContrast?: boolean
    focusVisible?: boolean
  }
  
  // Performance options
  performance?: {
    mobileOptimization?: boolean
    disableAnimations?: boolean
  }
}
```

## Accessibility Features

### Reduced Motion

All glassmorphism components automatically respect the `prefers-reduced-motion` media query. You can also explicitly enable reduced motion:

```tsx
<Card 
  variant="glass"
  accessibility={{
    reducedMotion: true
  }}
>
  Content
</Card>
```

### High Contrast Mode

Components adapt to high contrast mode automatically:

```tsx
<Card 
  variant="glass"
  accessibility={{
    highContrast: true
  }}
>
  Content
</Card>
```

### Focus Visibility

Proper focus indicators are enabled by default:

```tsx
<Button 
  variant="glass"
  accessibility={{
    focusVisible: true
  }}
>
  Click me
</Button>
```

## Performance Considerations

### Mobile Optimization

Mobile optimization is enabled by default:

```tsx
<Card 
  variant="glass"
  performance={{
    mobileOptimization: true
  }}
>
  Content
</Card>
```

### Disable Animations

For better performance on low-end devices:

```tsx
<Card 
  variant="glass"
  performance={{
    disableAnimations: true
  }}
>
  Content
</Card>
```

## Dark Mode Support

The glassmorphism components automatically adapt to dark mode through CSS variables. No additional configuration is needed.

### Custom Dark Mode Styling

If you need custom dark mode styling, you can use the `dark` class:

```tsx
<Card 
  variant="glass"
  className="dark:bg-white/20"
>
  Content
</Card>
```

## Examples

### Glass Dashboard Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function DashboardCard() {
  return (
    <Card variant="glass" className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>Your overview at a glance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Tasks</span>
            <span className="font-semibold">12</span>
          </div>
          <div className="flex justify-between">
            <span>Completed</span>
            <span className="font-semibold">8</span>
          </div>
          <Button variant="glass" className="w-full">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Glass Form

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export function GlassForm() {
  return (
    <Card variant="glass" className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" variant="glass" placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" variant="glass" type="email" placeholder="your@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" variant="glass" placeholder="Your message" />
          </div>
          <Button variant="glass-premium" className="w-full">
            Send Message
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Glass Navigation

```tsx
import { Button } from '@/components/ui/button'

export function GlassNavigation() {
  return (
    <nav className="flex gap-2 p-4">
      <Button variant="glass" size="sm">
        Home
      </Button>
      <Button variant="glass" size="sm">
        About
      </Button>
      <Button variant="glass" size="sm">
        Contact
      </Button>
    </nav>
  )
}
```

## Troubleshooting

### Component Not Showing Glass Effect

1. Ensure you're using the correct variant name
2. Check that the parent container has a non-white background
3. Verify that CSS variables are properly defined in `globals.css`

### Accessibility Issues

1. Make sure to enable accessibility options explicitly if needed
2. Test with screen readers and keyboard navigation
3. Verify focus states are visible

### Performance Problems

1. Enable mobile optimization for mobile devices
2. Consider disabling animations on low-end devices
3. Use subtle variants for better performance

## Best Practices

### 1. Choose the Right Variant

- Use `glass` for high-emphasis elements
- Use `glass-secondary` for medium-emphasis elements
- Use `glass-subtle` for low-emphasis elements
- Use `glass-premium` for special highlights

### 2. Consider Backgrounds

Glassmorphism effects work best on non-white backgrounds. Ensure your page has an appropriate background color or image.

### 3. Test Accessibility

Always test your components with:
- Reduced motion settings
- High contrast mode
- Keyboard navigation
- Screen readers

### 4. Optimize for Performance

- Use subtle variants on mobile devices
- Disable animations on low-end devices
- Limit the number of glass components on a single page

### 5. Maintain Consistency

- Use the same variants for similar elements
- Maintain consistent spacing and typography
- Follow the established design system

## Conclusion

The glassmorphism components provide a modern, accessible way to add frosted glass effects to your UI. By following this guide, you can create beautiful, consistent interfaces that work well across all devices and user preferences.