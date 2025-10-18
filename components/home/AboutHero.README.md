# AboutHero Component

## Overview
The AboutHero component is a glassmorphism-based hero section designed for the About page of the CampusAxis platform. It follows the same design principles as the EnhancedHero component but with content tailored for the About section.

## Features
1. **Glassmorphism Design**: Uses the UnifiedGlassCard component for a frosted glass effect
2. **Dark/Light Mode Support**: Automatically adapts to the current theme
3. **Smooth Animations**: Implements Framer Motion for engaging animations
4. **Responsive Design**: Works on all device sizes
5. **Accessibility**: Supports reduced motion preferences

## Color Palette
The component uses the new professional academic color palette:

- **Primary Blue**: #4573df (Professional, trustworthy)
- **Secondary Indigo**: #6366f1 (Complementary, modern)
- **Accent Pink**: #ec4899 (Vibrant, energetic)

## Usage

```tsx
import { AboutHero } from '@/components/home';

export default function AboutPage() {
  return (
    <AboutHero />
  );
}
```

## Component Structure
The AboutHero component consists of:

1. **Main Container**: Section element with theme-specific backgrounds
2. **Background Effects**: Gradient orbs for visual interest
3. **Content Wrapper**: Centered content with animation
4. **Glass Card**: UnifiedGlassCard with strong variant
5. **Heading**: "About CampusAxis" with gradient text
6. **Subheading**: Descriptive text about the platform
7. **Scroll Indicator**: Animated scroll prompt

## Styling
The component uses CSS modules for scoped styling:

- `heroContainerLight` / `heroContainerDark`: Background styles for each theme
- `backgroundEffect`: Container for the gradient orbs
- `gradientOrb1` / `gradientOrb2`: Decorative gradient elements
- `contentWrapper`: Content container with positioning
- `heroCard`: The main glass card container
- `heading` / `subheading`: Text styles
- `gradientText`: Gradient text effect
- `scrollIndicator`: Animated scroll indicator

## Animations
The component implements Framer Motion animations:

1. `staggerContainer`: Staggers child animations for sequential reveal
2. `fadeInUp`: Fades in elements while moving them up

## Responsive Design
The component adapts to different screen sizes:

- **Mobile**: Reduced padding and font sizes
- **Tablet**: Medium spacing and text sizes
- **Desktop**: Full spacing and larger text

## Accessibility
The component follows accessibility best practices:

- Proper color contrast ratios
- Reduced motion support
- Semantic HTML structure
- Focus-visible states

## Performance
The component is optimized for performance:

- Hardware-accelerated animations
- Efficient CSS with minimal repaints
- Optimized for both light and dark modes