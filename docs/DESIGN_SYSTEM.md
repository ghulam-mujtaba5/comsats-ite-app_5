# CampusAxis Design System 2025

## Overview
A modern, fully customized design system for an academic platform that perfectly supports both light and dark modes with glassmorphism effects.

## Design Principles

### 1. **Academic Excellence**
- Clean, professional aesthetic suitable for educational content
- Clear hierarchy for information architecture
- Accessible to all users (WCAG AAA compliant)

### 2. **Modern & Contemporary**
- Glassmorphism effects for depth and elegance
- Smooth animations and transitions
- Contemporary color palette

### 3. **Perfect Dual-Mode Support**
- Optimized light mode for daytime study
- Eye-friendly dark mode for night sessions
- Seamless theme transitions

### 4. **Performance First**
- Optimized animations for mobile devices
- Reduced motion support for accessibility
- Hardware-accelerated where possible

## Color System

### Light Mode
- **Background**: Pure white (#FFFFFF) - Maximum clarity
- **Foreground**: Deep navy - Excellent readability
- **Primary**: Academic Blue (#4299E1) - Trust & Knowledge
- **Secondary**: Purple (#7C3AED) - Creativity & Innovation
- **Accent**: Bright Cyan (#06B6D4) - Fresh & Modern

### Dark Mode
- **Background**: Deep slate (#1A202C) - Reduced eye strain
- **Foreground**: Soft white - Comfortable reading
- **Primary**: Brighter blue (#60A5FA) - Enhanced visibility
- **Secondary**: Vivid purple (#8B5CF6) - Vibrant contrast
- **Accent**: Neon cyan (#22D3EE) - Energy & focus

### Semantic Colors
- **Success**: Green (#22C55E) - Achievement
- **Warning**: Amber (#F59E0B) - Attention
- **Info**: Cyan (#06B6D4) - Information
- **Destructive**: Red (#EF4444) - Error

## Typography

### Font Stack
- **Sans Serif**: Geist Sans (primary), system-ui (fallback)
- **Serif**: Manrope (headings), Georgia (fallback)

### Scale (8px base grid)
- **xs**: 12px - Captions, meta text
- **sm**: 14px - Small text, labels
- **base**: 16px - Body text
- **lg**: 18px - Large body, subheadings
- **xl**: 20px - H3
- **2xl**: 24px - H2
- **3xl**: 32px - H1, hero text

### Line Heights
- **Tight**: 1.25 - Headings
- **Normal**: 1.5 - Body text
- **Relaxed**: 1.75 - Long-form content

## Spacing System (8px base grid)

- **3xs**: 4px
- **2xs**: 8px
- **xs**: 12px
- **sm**: 16px
- **md**: 24px
- **lg**: 32px
- **xl**: 40px
- **2xl**: 48px
- **3xl**: 64px
- **4xl**: 80px
- **5xl**: 96px

## Glassmorphism System

### Glass Variants

#### 1. Primary Glass (High emphasis)
- Use: Hero sections, major CTAs
- Background: Heavy glass blur
- Border: Medium thickness
- Shadow: Large elevation

#### 2. Secondary Glass (Medium emphasis)
- Use: Feature cards, content sections
- Background: Medium glass blur
- Border: Light definition
- Shadow: Medium elevation

#### 3. Subtle Glass (Low emphasis)
- Use: Backgrounds, subtle dividers
- Background: Light glass blur
- Border: Minimal definition
- Shadow: None or minimal

#### 4. Interactive Glass (Hover states)
- Use: Buttons, links, clickable cards
- Background: Medium glass
- Transforms: Lift on hover
- Shadow: Grows on interaction

### Glass Properties

#### Light Mode
- **Blur**: 10-24px (performance optimized)
- **Saturation**: 140-170%
- **Background opacity**: 78-96%
- **Border color**: Subtle slate with transparency

#### Dark Mode
- **Blur**: 10-24px (same as light)
- **Saturation**: 130-160%
- **Background opacity**: 60-88%
- **Border color**: Subtle white with glow

## Animation Guidelines

### Durations
- **Fast**: 150ms - Micro-interactions
- **Base**: 250ms - Standard transitions
- **Slow**: 350ms - Complex animations
- **Bounce**: 500ms - Playful effects

### Easing Functions
- **Default**: cubic-bezier(0.4, 0, 0.2, 1) - Standard ease
- **Spring**: cubic-bezier(0.175, 0.885, 0.32, 1.1) - Bouncy
- **Elastic**: cubic-bezier(0.68, -0.55, 0.265, 1.55) - Elastic bounce

### Animation Types
1. **Fade**: Opacity transitions
2. **Slide**: Directional movement
3. **Scale**: Size changes
4. **Rotate**: Rotational effects
5. **Shimmer**: Loading states
6. **Float**: Gentle hovering
7. **Pulse**: Attention-grabbing

### Reduced Motion
All animations respect `prefers-reduced-motion` and fall back to instant transitions.

## Accessibility

### Focus States
- **Ring**: 2px solid primary color
- **Offset**: 2px from element
- **Radius**: Matches element shape

### Touch Targets
- **Minimum**: 44x44px (Apple HIG standard)
- **Comfortable**: 48x48px
- **Large**: 56x56px

### Color Contrast
- **Text**: 4.5:1 minimum (WCAG AA)
- **Large text**: 3:1 minimum
- **UI elements**: 3:1 minimum

### High Contrast Mode
All glass effects are replaced with solid backgrounds and clear borders in high contrast mode.

## Component Patterns

### Cards
```tsx
<Card className="glass-secondary hover-lift">
  <CardHeader>
    <CardTitle>Heading</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Buttons
```tsx
<Button className="glass-interactive">
  Click Me
</Button>
```

### Inputs
```tsx
<Input className="glass-input focus-ring" />
```

## Responsive Breakpoints

- **sm**: 640px - Small tablets
- **md**: 768px - Tablets
- **lg**: 1024px - Laptops
- **xl**: 1280px - Desktops
- **2xl**: 1536px - Large displays

## Mobile Optimizations

1. **Reduced blur** on mobile for performance
2. **Simplified animations** for battery life
3. **Larger touch targets** for accessibility
4. **Font size**: Minimum 16px to prevent zoom
5. **No horizontal scroll** - max-width: 100vw

## Best Practices

### DO ✅
- Use glass effects sparingly for impact
- Maintain consistent spacing (8px grid)
- Test in both light and dark modes
- Provide keyboard navigation
- Use semantic HTML

### DON'T ❌
- Overuse animations
- Ignore accessibility
- Use fixed pixel values for text
- Forget hover/focus states
- Mix different design patterns

## Implementation

All styles are in:
- `app/globals.css` - Core system
- `tailwind.config.ts` - Tailwind configuration
- Component-specific CSS modules for overrides

## Future Enhancements

1. **Color customization** - Allow users to choose accent colors
2. **Font size preferences** - Accessibility setting
3. **Animation intensity** - Let users control motion
4. **Contrast modes** - Enhanced options for visual impairments
