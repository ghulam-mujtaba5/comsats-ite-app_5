# Home Components

This directory contains components specifically designed for the home page of the CampusAxis platform.

## EnhancedHero Component

The EnhancedHero component is a modern, glassmorphism-based hero section that serves as the main focal point of the home page.

### Features

1. **Glassmorphism Design**: Uses the UnifiedGlassCard component for a frosted glass effect
2. **Dark/Light Mode Support**: Automatically adapts to the current theme
3. **Smooth Animations**: Implements Framer Motion for engaging animations
4. **Responsive Design**: Works on all device sizes
5. **Accessibility**: Supports reduced motion preferences

### Color Palette

We've successfully replaced the #8b5cf6 color with a more professional academic palette:

- **Primary Blue**: #4573df (Professional, trustworthy)
- **Secondary Indigo**: #6366f1 (Complementary, modern)
- **Accent Pink**: #ec4899 (Vibrant, energetic)

This palette provides better contrast and a more professional appearance suitable for an academic platform. All references to #8b5cf6 have been removed throughout the project.

### Usage

```tsx
import { EnhancedHero } from '@/components/home';

export default function HomePage() {
  return (
    <EnhancedHero />
  );
}
```

### Customization

The component uses CSS modules for styling, making it easy to customize:

- `heroContainerLight` / `heroContainerDark`: Background styles for each theme
- `backgroundEffect`: Container for the gradient orbs
- `gradientOrb1` / `gradientOrb2`: Decorative gradient elements
- `heroCard`: The main glass card container
- `heading` / `subheading`: Text styles
- `gradientText`: Gradient text effect
- `scrollIndicator`: Animated scroll indicator

### Animation Variants

The component includes two animation variants:

1. `staggerContainer`: Staggers child animations
2. `fadeInUp`: Fades in elements while moving them up

These can be customized by modifying the variants in the component file.

## Best Practices

1. **Performance**: The component uses hardware-accelerated animations
2. **Accessibility**: Respects user preferences for reduced motion
3. **Responsive**: Adapts to all screen sizes
4. **Theme-aware**: Automatically switches between light and dark mode styles
5. **Reusable**: Built with modularity in mind