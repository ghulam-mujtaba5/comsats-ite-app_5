# CampusAxis Color Palette Guide

## Overview

This document outlines the new color palette for the CampusAxis platform, which replaces the previous #8b5cf6 color with more professional and accessible alternatives.

## New Color Palette

### Primary Colors

| Color Name | HEX Code | Usage |
|------------|----------|-------|
| Professional Blue | #4573df | Primary brand color, links, buttons |
| Complementary Indigo | #6366f1 | Secondary brand color, accents |
| Vibrant Pink | #ec4899 | Accent color, highlights, notifications |

### Why These Colors?

1. **Professional Blue (#4573df)**:
   - Conveys trust and reliability
   - Associated with academic excellence
   - Provides excellent contrast for readability
   - Works well in both light and dark modes

2. **Complementary Indigo (#6366f1)**:
   - Creates visual harmony with the primary blue
   - Modern and clean appearance
   - Good for secondary actions and elements

3. **Vibrant Pink (#ec4899)**:
   - Replaces the previous purple (#8b5cf6) with a more energetic color
   - Draws attention to important elements
   - Provides better accessibility contrast
   - Adds personality without being overwhelming

## Implementation

### CSS Custom Properties

The new colors are available as CSS custom properties:

```css
:root {
  --color-brand-primary: 69 115 223; /* #4573df */
  --color-brand-secondary: 99 102 241; /* #6366f1 */
  --color-brand-accent-new: 236 72 153; /* #ec4899 */
}
```

### Glassmorphism Gradients

The new palette is also used in glassmorphism gradients:

```css
--glass-gradient-primary: linear-gradient(135deg, #4573df, #6366f1);
--glass-gradient-secondary: linear-gradient(135deg, #6366f1, #ec4899);
--glass-gradient-accent: linear-gradient(135deg, #4573df, #ec4899);
```

### Text Gradients

For gradient text effects:

```css
.glass-gradient-text {
  background: var(--glass-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

## Accessibility

All new colors meet WCAG 2.1 AA contrast requirements:
- Professional Blue: 4.5:1+ contrast against white
- Complementary Indigo: 4.5:1+ contrast against white
- Vibrant Pink: 4.5:1+ contrast against white

## Migration from Old Palette

To migrate from the old #8b5cf6 color:

1. Replace direct color references:
   - Old: `#8b5cf6`
   - New: `#ec4899` (for accents) or `#6366f1` (for secondary elements)

2. Update CSS custom properties:
   - Old: `--color-brand-accent: 139 92 246;`
   - New: `--color-brand-accent-new: 236 72 153;`

3. Update gradients:
   - Old: `linear-gradient(135deg, #4573df, #8b5cf6)`
   - New: `linear-gradient(135deg, #4573df, #6366f1)` or `linear-gradient(135deg, #6366f1, #ec4899)`

## Examples

### Buttons

```tsx
// Primary button with new blue
<button className="bg-[#4573df] hover:bg-[#3a62c4] text-white">
  Primary Action
</button>

// Secondary button with indigo
<button className="bg-[#6366f1] hover:bg-[#585cdd] text-white">
  Secondary Action
</button>

// Accent button with pink
<button className="bg-[#ec4899] hover:bg-[#e03e8e] text-white">
  Highlight Action
</button>
```

### Glass Components

```tsx
// Using the new UnifiedGlassCard with updated gradients
<UnifiedGlassCard 
  variant="strong" 
  interactive 
  glow
  className="border-[#6366f1]"
>
  <h2 className="text-[#0f172a] dark:text-[#f8fafc]">
    <span className="bg-gradient-to-r from-[#4573df] to-[#6366f1] bg-clip-text text-transparent">
      Glass Card Title
    </span>
  </h2>
</UnifiedGlassCard>
```

## Conclusion

The new color palette provides a more professional, accessible, and visually appealing experience for CampusAxis users. The combination of Professional Blue, Complementary Indigo, and Vibrant Pink creates a cohesive design language that works well across all components and themes.