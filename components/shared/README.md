# Shared Components

This directory contains reusable components that can be used across the CampusAxis platform.

## Glassmorphism Components

### UnifiedGlassCard

A flexible glass card component with multiple variants and effects.

```tsx
import { UnifiedGlassCard } from '@/components/shared/UnifiedGlassCard'

<UnifiedGlassCard variant="base" interactive glow>
  <h3>Card Title</h3>
  <p>Card content</p>
</UnifiedGlassCard>
```

**Props:**
- `variant`: 'subtle' | 'base' | 'medium' | 'strong' | 'intense'
- `interactive`: boolean (adds hover and active states)
- `glow`: boolean (adds gradient glow effect on hover)
- `layered`: boolean (adds gradient overlay for depth perception)
- `depth`: boolean (enables 3D transformation effects)

### UnifiedGlassButton

A glass button component with multiple variants and sizes.

```tsx
import { UnifiedGlassButton } from '@/components/shared/UnifiedGlassButton'

<UnifiedGlassButton variant="premium" size="lg" glow>
  Premium Button
</UnifiedGlassButton>
```

**Props:**
- `variant`: 'subtle' | 'base' | 'medium' | 'strong' | 'premium'
- `size`: 'sm' | 'md' | 'lg'
- `glow`: boolean (adds gradient glow effect on hover)

## Usage Guidelines

1. Use the new unified components for all glassmorphism needs
2. Prefer these components over legacy glass variants in UI components
3. Follow the established design system guidelines
4. Consider performance implications on mobile devices
5. Ensure proper accessibility support

## Documentation

For comprehensive documentation, see:
- [Glassmorphism Design System](../../docs/glassmorphism-design-system.md)
- [Implementation Summary](../../docs/glassmorphism-implementation-summary.md)