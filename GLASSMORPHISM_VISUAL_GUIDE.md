# 🎨 Glassmorphism Visual Style Guide

## Color Palette

### Brand Colors (RGB format for opacity control)
```css
--color-brand-primary: 69 115 223    /* #4573df - Blue */
--color-brand-secondary: 99 102 241  /* #6366f1 - Indigo */

```

**Usage:**
```css
background: rgb(var(--color-brand-primary));           /* Solid blue */
background: rgba(var(--color-brand-primary), 0.15);    /* 15% blue tint */
```

---

## Glass Background Opacity Guide

### Light Mode (Higher Opacity = More Visible on Light Backgrounds)
- **70%** - Standard cards (`--glass-bg-card`)
- **75%** - Elevated surfaces (`--glass-bg-elevated`)
- **85%** - Overlays & modals (`--glass-bg-overlay`)
- **50%** - Subtle backgrounds (`--glass-bg-subtle`)

### Dark Mode (Lower Opacity = More Transparent Glass Effect)
- **55%** - Standard cards
- **50%** - Elevated surfaces  
- **75%** - Overlays & modals
- **40%** - Subtle backgrounds

---

## Blur Intensity Scale

```
4px   (sm)    ░░     Subtle hint
8px   (md)    ░░░    Light blur
12px  (lg)    ░░░░   Medium blur
16px  (xl)    ░░░░░  Standard (DEFAULT)
24px  (2xl)   ░░░░░░ Strong blur
32px  (3xl)   ░░░░░░░ Maximum blur
```

**When to use:**
- **4-8px:** Buttons, badges, small elements
- **12-16px:** Cards, panels, most UI components
- **20-24px:** Navigation, headers, prominent sections
- **28-32px:** Modals, overlays, focus elements

---

## Shadow System

### Light Mode Shadows
```css
/* Subtle */
box-shadow: 0 4px 16px rgba(31, 38, 135, 0.08);

/* Standard */
box-shadow: 
  0 8px 32px rgba(31, 38, 135, 0.12),
  inset 0 1px 0 rgba(255, 255, 255, 0.50);

/* Prominent */
box-shadow: 
  0 16px 48px rgba(31, 38, 135, 0.16),
  inset 0 1px 0 rgba(255, 255, 255, 0.60);
```

### Dark Mode Shadows
```css
/* Subtle */
box-shadow: 
  0 4px 16px rgba(0, 0, 0, 0.40),
  inset 0 1px 0 rgba(255, 255, 255, 0.05);

/* Standard */
box-shadow: 
  0 8px 32px rgba(0, 0, 0, 0.50),
  inset 0 1px 0 rgba(255, 255, 255, 0.08);

/* Prominent with Glow */
box-shadow: 
  0 16px 48px rgba(0, 0, 0, 0.60),
  0 0 32px rgba(69, 115, 223, 0.15),
  inset 0 1px 0 rgba(255, 255, 255, 0.10);
```

---

## Border Styles

### Light Mode
```css
border: 1px solid rgba(255, 255, 255, 0.30);    /* Standard */
border: 1px solid rgba(255, 255, 255, 0.40);    /* Strong */
border: 1px solid rgba(69, 115, 223, 0.20);     /* Accent */
```

### Dark Mode
```css
border: 1px solid rgba(255, 255, 255, 0.10);    /* Standard */
border: 1px solid rgba(255, 255, 255, 0.15);    /* Strong */
border: 1px solid rgba(69, 115, 223, 0.30);     /* Accent */
```

---

## Border Radius Scale

```
6px   (sm)    ┌─┐  Small elements
8px   (md)    ┌──┐ Buttons
12px  (lg)    ┌───┐ Inputs
16px  (xl)    ┌────┐ Small cards
20px  (2xl)   ┌─────┐ Cards (DEFAULT)
24px  (3xl)   ┌──────┐ Large panels
9999px (full) (●) Badges, pills
```

---

## Spacing Grid (8px Base)

```
4px   (space-1)   ▪
8px   (space-2)   ▪▪
12px  (space-3)   ▪▪▪
16px  (space-4)   ▪▪▪▪     Standard
24px  (space-6)   ▪▪▪▪▪▪   Generous
32px  (space-8)   ▪▪▪▪▪▪▪▪ Large
48px  (space-12)  ▪▪▪▪▪▪▪▪▪▪▪▪
64px  (space-16)  Section spacing
```

---

## Text Colors

### Light Mode
```css
--text-primary: rgba(15, 23, 42, 0.95);      /* Almost black - 12.5:1 */
--text-secondary: rgba(51, 65, 85, 0.85);    /* Dark gray - 8.2:1 */
--text-tertiary: rgba(100, 116, 139, 0.75);  /* Medium gray */
--text-disabled: rgba(148, 163, 184, 0.60);  /* Light gray */
```

### Dark Mode
```css
--text-primary: rgba(248, 250, 252, 0.95);   /* Almost white - 13.1:1 */
--text-secondary: rgba(226, 232, 240, 0.85); /* Light gray - 9.3:1 */
--text-tertiary: rgba(203, 213, 225, 0.70);  /* Medium gray */
--text-disabled: rgba(148, 163, 184, 0.50);  /* Dark gray */
```

---

## Component Anatomy

### Glass Card Structure
```
┌─────────────────────────────────────┐
│ ░░░░░ Glass Background (70%) ░░░░░ │ ← Background with opacity
│ ┌───────────────────────────────┐ │
│ │   Content Area                │ │ ← Padding: 24px
│ │   • Title (text-primary)      │ │
│ │   • Description (text-second) │ │
│ │                               │ │
│ │   [Button]                    │ │
│ └───────────────────────────────┘ │
│ Border: rgba(255,255,255,0.30)   │ ← Subtle border
│ Blur: 16px | Radius: 20px         │
│ Shadow: Multi-layer with inset    │
└─────────────────────────────────────┘
```

### Glass Button Structure
```
┌──────────────┐
│ ░░░ Text ░░░ │ ← Padding: 12px 24px
│              │   Background: 65% opacity
└──────────────┘   Blur: 8px
    Hover: ↑      Radius: 12px
    +15% opacity   Border: Subtle
    Glow effect    Transition: 200ms
```

---

## Color Tint System

### Blue Tint (Tech/Professional)
```css
background: rgba(59, 130, 246, 0.10);      /* Light mode */
background: rgba(59, 130, 246, 0.15);      /* Dark mode */
border-color: rgba(59, 130, 246, 0.20);
```

### Indigo Tint (Features/Premium)
```css
background: rgba(99, 102, 241, 0.10);
background: rgba(99, 102, 241, 0.15);
border-color: rgba(99, 102, 241, 0.20);
```

### Purple Tint (Creative/Exclusive)
```css
background: rgba(139, 92, 246, 0.10);
background: rgba(139, 92, 246, 0.15);
border-color: rgba(139, 92, 246, 0.20);
```

### Pink Tint (Special/Limited)
```css
background: rgba(236, 72, 153, 0.10);
background: rgba(236, 72, 153, 0.15);
border-color: rgba(236, 72, 153, 0.20);
```

---

## Hover State Transformations

### Cards
```css
/* Resting */
background: rgba(255, 255, 255, 0.70);
transform: translateY(0);
shadow: Standard

/* Hover */
background: rgba(255, 255, 255, 0.85);  /* +15% opacity */
transform: translateY(-4px);            /* Lift up */
shadow: Larger + softer
border-color: Accent tint
transition: 300ms ease
```

### Buttons
```css
/* Resting */
background: rgba(255, 255, 255, 0.65);
transform: translateY(0);

/* Hover */
background: rgba(255, 255, 255, 0.80);  /* +15% opacity */
transform: translateY(-1px);            /* Subtle lift */
shadow: Stronger
```

### Dark Mode Hover (Special: Glow Effect)
```css
box-shadow: 
  0 12px 40px rgba(0, 0, 0, 0.55),
  0 0 32px rgba(69, 115, 223, 0.20);    /* ← Blue glow! */
```

---

## Responsive Breakpoints

```css
/* Mobile First */
Base: Mobile (< 640px)
  - Padding: 16px
  - Radius: 16px
  - Font: Base

sm: 640px+
  - Padding: 20px
  - Radius: 18px

md: 768px+
  - Padding: 24px
  - Radius: 20px
  - Font: +10%

lg: 1024px+
  - Padding: 32px
  - Radius: 24px

xl: 1280px+
  - Container: 1280px max
```

---

## Accessibility Standards

### Contrast Ratios (WCAG AA)
```
Light Mode:
✅ Primary Text:   12.5:1 (Excellent)
✅ Secondary Text:  8.2:1 (Excellent)
✅ Tertiary Text:   5.5:1 (Good)

Dark Mode:
✅ Primary Text:   13.1:1 (Excellent)
✅ Secondary Text:  9.3:1 (Excellent)
✅ Tertiary Text:   6.1:1 (Good)
```

### Focus Indicators
```css
:focus-visible {
  outline: none;
  border-color: rgba(69, 115, 223, 0.50);
  box-shadow: 0 0 0 3px rgba(69, 115, 223, 0.20);
}
```

---

## Animation Timing

```css
Fast:   150ms - Instant feedback (hover hints)
Base:   200ms - Button hovers
Medium: 300ms - Card transitions
Slow:   500ms - Modal open/close

Easing:
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)  /* Default */
ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)  /* Special */
```

---

## Z-Index Layers

```
0     - Base content
1000  - Dropdowns
1020  - Sticky elements
1030  - Fixed elements
1040  - Modal backdrops
1050  - Modals
1060  - Popovers
1070  - Tooltips
```

---

## Component Cheat Sheet

### Complete Glass Card
```css
.glass-card {
  background: var(--glass-bg-card);
  -webkit-backdrop-filter: blur(var(--glass-blur-xl));
  backdrop-filter: blur(var(--glass-blur-xl));
  border: 1px solid var(--glass-border-base);
  border-radius: var(--radius-2xl);
  padding: var(--space-6);
  box-shadow: var(--glass-shadow-md);
  transition: all var(--transition-medium) var(--ease-in-out);
}
```

### Complete Glass Button
```css
.glass-button {
  background: var(--glass-bg-card);
  -webkit-backdrop-filter: blur(var(--glass-blur-md));
  backdrop-filter: blur(var(--glass-blur-md));
  border: 1px solid var(--glass-border-base);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-6);
  color: var(--text-on-glass);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base) var(--ease-in-out);
}
```

---

## Pro Tips

### 1. Layer Glass Elements
Stack glass with varying opacity for depth:
```
Background: 50% opacity
Card: 70% opacity
Badge: 85% opacity
```

### 2. Use Inset Highlights
Add subtle top highlight for realism:
```css
box-shadow: 
  /* Main shadow */
  0 8px 32px rgba(31, 38, 135, 0.12),
  /* Top highlight */
  inset 0 1px 0 rgba(255, 255, 255, 0.50);
```

### 3. Combine with Gradients
```css
background: linear-gradient(
  135deg,
  rgba(255, 255, 255, 0.70),
  rgba(255, 255, 255, 0.50)
);
```

### 4. Add Saturation
Make colors pop in dark mode:
```css
backdrop-filter: blur(24px) saturate(180%);
```

---

**Visual Style Guide Complete!**  
Use this as your reference for consistent glassmorphism across your entire project.
