# CampusAxis Color Usage Guide

## Quick Reference for Theme-Aware Styling

### ✅ DO: Use Semantic Tokens

```tsx
// Headers and primary text
<h1 className="text-foreground">Title</h1>

// Descriptive text, labels
<p className="text-muted-foreground">Description</p>

// Backgrounds
<div className="bg-background">Content</div>
<div className="bg-card">Card content</div>

// Borders
<div className="border border-border">...</div>
```

### ❌ DON'T: Use Hard-Coded Colors Without Dark Variants

```tsx
// BAD - Won't adapt to dark mode
<h1 className="text-gray-900">Title</h1>
<p className="text-gray-600">Description</p>
<div className="bg-gray-100">Content</div>

// GOOD - Adapts to dark mode
<h1 className="text-gray-900 dark:text-white">Title</h1>
<p className="text-gray-600 dark:text-gray-400">Description</p>
<div className="bg-gray-100 dark:bg-gray-800">Content</div>

// BEST - Uses semantic tokens
<h1 className="text-foreground">Title</h1>
<p className="text-muted-foreground">Description</p>
<div className="bg-muted">Content</div>
```

## Semantic Color Tokens

### Text Colors
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `text-foreground` | Dark slate (#0f172a) | Light gray (#f8fafc) | Primary text, headers |
| `text-muted-foreground` | Medium gray (#64748b) | Light gray (#94a3b8) | Secondary text, descriptions |
| `text-card-foreground` | Dark slate | Light gray | Text on cards |

### Background Colors
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `bg-background` | Pure white | Dark slate | Page background |
| `bg-card` | Off-white | Darker slate | Card backgrounds |
| `bg-muted` | Light gray | Medium dark | Subtle backgrounds |

### Border Colors
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `border-border` | Light gray | Dark gray | Standard borders |
| `border-input` | Light gray | Dark gray | Input borders |

## Tailwind Gray Scale Pattern

When you must use gray colors (for specific brand requirements):

```tsx
// Always include dark: variant
<div className="bg-gray-50 dark:bg-gray-900">
  <h2 className="text-gray-900 dark:text-white">Title</h2>
  <p className="text-gray-600 dark:text-gray-400">Text</p>
  <span className="text-gray-500 dark:text-gray-500">Muted</span>
</div>
```

### Gray Scale Mapping
| Light | Dark | Purpose |
|-------|------|---------|
| `gray-50` | `gray-900` | Very light backgrounds |
| `gray-100` | `gray-800` | Light backgrounds |
| `gray-200` | `gray-700` | Borders, subtle elements |
| `gray-300` | `gray-600` | Hover states |
| `gray-400` | `gray-500` | Disabled states (same both) |
| `gray-500` | `gray-400` | Muted text |
| `gray-600` | `gray-300` | Secondary text |
| `gray-700` | `gray-200` | Primary text alt |
| `gray-800` | `gray-100` | Very dark text |
| `gray-900` | `white` | Darkest text |

## Glassmorphism Classes

Use predefined glassmorphism utilities:

```tsx
// From globals.css - Theme-aware
<div className="glass-primary">Primary glass effect</div>
<div className="glass-secondary">Secondary glass effect</div>
<div className="glass-subtle">Subtle glass effect</div>
<div className="glass-interactive">Interactive glass element</div>

// Backgrounds
<div className="bg-navbar">Navbar background</div>
<div className="bg-navbar-card">Card background</div>

// Text
<span className="text-navbar">Navigation text</span>
<span className="text-navbar-muted">Muted text</span>

// Borders
<div className="border-navbar">Navbar border</div>
```

## Component Variants (cva)

For reusable components, use class-variance-authority:

```tsx
import { cva } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        glass: "bg-white/10 backdrop-blur-xl border-white/20 text-white dark:bg-gray-900/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
```

## Accessibility Requirements

### Minimum Contrast Ratios (WCAG AA)
- **Normal text**: 4.5:1
- **Large text (18px+)**: 3:1
- **UI components**: 3:1

### Testing Your Colors
```tsx
// Use browser DevTools Accessibility panel
// Or check contrast at https://webaim.org/resources/contrastchecker/

// Good examples:
<div className="bg-white text-gray-900">High contrast ✅</div>
<div className="bg-gray-900 text-white">High contrast ✅</div>

// Bad examples (low contrast):
<div className="bg-gray-100 text-gray-300">Too similar ❌</div>
<div className="bg-white text-gray-400">May fail AA ❌</div>
```

## Common Patterns

### Card Component
```tsx
<Card className="bg-card text-card-foreground border-border">
  <CardHeader>
    <CardTitle className="text-foreground">Title</CardTitle>
    <CardDescription className="text-muted-foreground">Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-foreground">Content</p>
  </CardContent>
</Card>
```

### Button States
```tsx
<button className="
  bg-primary text-primary-foreground
  hover:bg-primary/90
  active:bg-primary/80
  disabled:opacity-50 disabled:cursor-not-allowed
  dark:bg-primary dark:text-primary-foreground
">
  Button
</button>
```

### Input Fields
```tsx
<input className="
  bg-background text-foreground
  border-border
  focus:border-ring focus:ring-ring
  placeholder:text-muted-foreground
  dark:bg-input dark:border-border
" />
```

## Testing Checklist

- [ ] Component looks good in light mode
- [ ] Component looks good in dark mode
- [ ] Text has sufficient contrast (WCAG AA)
- [ ] Borders are visible in both modes
- [ ] Hover states work in both modes
- [ ] Focus states are clearly visible
- [ ] Works with system theme preference
- [ ] No flashing when switching themes

## Tools & Resources

- **Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Color Palette**: Tailwind CSS Colors
- **Design System**: `/app/globals.css`
- **Component Library**: `/components/ui/*`
- **Glassmorphism Presets**: `/lib/glassmorphism-2025.ts`

---

**Last Updated**: October 16, 2025  
**Maintained By**: CampusAxis Development Team
