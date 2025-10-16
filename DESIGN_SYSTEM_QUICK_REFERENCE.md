# 🎨 CampusAxis Design System - Quick Reference

**Version:** 2.0.0 | **Date:** October 16, 2025

---

## 🎯 Quick Access

```typescript
// Import design system
import { designSystem, colors, spacing, typography } from '@/lib/design-system'

// Use color tokens
const primaryColor = colors.primary.DEFAULT // #2563eb
const successColor = colors.semantic.success.DEFAULT // #22c55e

// Use spacing
const padding = spacing[4] // 1rem (16px)
const margin = spacing[8] // 2rem (32px)

// Use glassmorphism
import { createGlassStyle } from '@/lib/design-system'
const glassStyle = createGlassStyle('primary', false)
```

---

## 🎨 Glassmorphism Quick Guide

### 4 Semantic Classes

```css
/* High emphasis - Hero sections, major CTAs */
.glass-primary {
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(16px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Medium emphasis - Feature cards, content */
.glass-secondary {
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* Low emphasis - Backgrounds, dividers */
.glass-subtle {
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Interactive - Buttons, links, clickable cards */
.glass-interactive {
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
```

### Usage Example

```tsx
// Hero Section
<section className="glass-primary">
  <h1>Welcome to CampusAxis</h1>
</section>

// Feature Card
<div className="glass-secondary p-6 rounded-2xl">
  <h2>Feature Title</h2>
</div>

// Background
<div className="glass-subtle">
  <p>Content here</p>
</div>

// Interactive Button
<button className="glass-interactive hover:shadow-xl">
  Click Me
</button>
```

---

## 🎨 Color System

### Primary Colors (COMSATS Blue)

```typescript
colors.primary[50]   // #eff6ff (lightest)
colors.primary[500]  // #3b82f6 (main)
colors.primary[600]  // #2563eb (brand)
colors.primary[900]  // #1e3a8a (darkest)
```

### Secondary Colors (Amber Accent)

```typescript
colors.secondary[500] // #f59e0b (accent)
colors.secondary[600] // #d97706 (darker)
```

### Semantic Colors

```typescript
colors.semantic.success.DEFAULT // #22c55e (green)
colors.semantic.warning.DEFAULT // #f59e0b (orange)
colors.semantic.error.DEFAULT   // #ef4444 (red)
colors.semantic.info.DEFAULT    // #3b82f6 (blue)
```

### Usage in Tailwind

```html
<!-- Primary color -->
<div class="bg-primary-600 text-primary-foreground">
  
<!-- Success color -->
<div class="text-green-600">
  
<!-- Semantic -->
<Badge variant="success">Success</Badge>
<Alert variant="error">Error</Alert>
```

---

## 📏 Spacing System (8px Grid)

```typescript
spacing[0]   // 0px
spacing[1]   // 4px
spacing[2]   // 8px  (base unit)
spacing[4]   // 16px
spacing[6]   // 24px
spacing[8]   // 32px
spacing[12]  // 48px
spacing[16]  // 64px
```

### Usage

```html
<!-- Padding -->
<div class="p-4">     <!-- 16px all sides -->
<div class="px-6">    <!-- 24px horizontal -->
<div class="py-8">    <!-- 32px vertical -->

<!-- Margin -->
<div class="m-4">     <!-- 16px all sides -->
<div class="mb-6">    <!-- 24px bottom -->
<div class="mt-8">    <!-- 32px top -->

<!-- Gap -->
<div class="gap-4">   <!-- 16px gap -->
<div class="space-y-6"> <!-- 24px vertical space -->
```

---

## ✍️ Typography System

### Font Sizes

```typescript
text-xs    // 12px
text-sm    // 14px
text-base  // 16px (default)
text-lg    // 18px
text-xl    // 20px
text-2xl   // 24px
text-3xl   // 30px
text-4xl   // 36px
```

### Font Weights

```typescript
font-normal    // 400
font-medium    // 500
font-semibold  // 600
font-bold      // 700
font-extrabold // 800
```

### Usage

```html
<!-- Heading -->
<h1 class="text-4xl font-extrabold">Title</h1>
<h2 class="text-2xl font-bold">Subtitle</h2>

<!-- Body -->
<p class="text-base font-normal">Body text</p>
<p class="text-sm text-muted-foreground">Caption</p>
```

---

## 🎭 Shadows

```typescript
shadow-none
shadow-sm
shadow       // default
shadow-md
shadow-lg
shadow-xl
shadow-2xl
```

### Glass Shadows

```css
.glass-primary { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
```

---

## 🔲 Border Radius

```typescript
rounded-none  // 0px
rounded-sm    // 4px
rounded       // 8px (default)
rounded-md    // 8px
rounded-lg    // 12px
rounded-xl    // 16px
rounded-2xl   // 20px
rounded-3xl   // 24px
rounded-full  // 9999px (circle)
```

---

## ⚡ Animation System

### Durations

```css
duration-75    /* 75ms */
duration-100   /* 100ms */
duration-150   /* 150ms */
duration-200   /* 200ms */
duration-300   /* 300ms */
duration-500   /* 500ms */
```

### Easing

```css
ease-linear
ease-in
ease-out
ease-in-out
```

### Usage

```html
<button class="transition-all duration-300 ease-in-out hover:scale-105">
  Hover Me
</button>
```

---

## 📱 Responsive Breakpoints

```typescript
xs:   475px  // Extra small devices
sm:   640px  // Small devices (mobile)
md:   768px  // Medium devices (tablet)
lg:   1024px // Large devices (desktop)
xl:   1280px // Extra large devices
2xl:  1536px // 2x extra large
```

### Usage

```html
<div class="text-sm sm:text-base md:text-lg lg:text-xl">
  Responsive text
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  Responsive grid
</div>
```

---

## 🎯 Common Patterns

### Card with Glass Effect

```html
<div class="glass-secondary rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
  <h3 class="text-xl font-bold mb-2">Title</h3>
  <p class="text-muted-foreground">Description</p>
</div>
```

### Primary Button

```html
<button class="
  px-6 py-3 
  rounded-xl 
  bg-gradient-to-r from-primary-600 to-indigo-600 
  text-white 
  font-semibold
  shadow-lg 
  hover:shadow-xl 
  hover:scale-105
  transition-all 
  duration-300
">
  Get Started
</button>
```

### Hero Section

```html
<section class="
  min-h-screen 
  glass-primary 
  bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50
">
  <div class="app-container py-20">
    <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
      Empowering Your 
      <span class="text-primary-600">Academic Journey</span>
    </h1>
  </div>
</section>
```

### Interactive Card

```html
<div class="
  glass-interactive 
  rounded-2xl 
  p-6 
  group 
  hover:scale-105 
  hover:shadow-xl 
  transition-all 
  duration-300
  cursor-pointer
">
  <div class="flex items-center gap-4 mb-4">
    <div class="p-4 rounded-xl bg-primary-500/10">
      <Icon class="h-6 w-6 text-primary-600" />
    </div>
    <h3 class="text-lg font-semibold group-hover:text-primary-600 transition-colors">
      Feature Name
    </h3>
  </div>
  <p class="text-muted-foreground">Description here</p>
</div>
```

---

## 🔧 Mobile Optimizations

### Touch Targets

```html
<!-- Minimum 44x44px for touch -->
<button class="
  min-h-[44px] 
  min-w-[44px] 
  px-4 
  py-3
  mobile-btn
">
  Tap Me
</button>
```

### Mobile-Specific Classes

```html
<!-- Prevent iOS zoom -->
<input class="text-base mobile-input" />

<!-- Touch feedback -->
<div class="mobile-card active:scale-95 transition-transform">
  Tap for feedback
</div>

<!-- Mobile spacing -->
<div class="p-4 sm:p-6 md:p-8">
  Responsive padding
</div>
```

---

## ♿ Accessibility Checklist

### ARIA Labels

```html
<button aria-label="Close modal" aria-pressed="false">
  <X className="h-5 w-5" aria-hidden="true" />
</button>

<section aria-labelledby="hero-heading">
  <h1 id="hero-heading">Hero Title</h1>
</section>
```

### Focus States

```css
/* Always visible focus */
focus-visible:outline-2
focus-visible:outline-primary-600
focus-visible:outline-offset-2
```

### Keyboard Navigation

```html
<button 
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  tabIndex={0}
>
  Click or Press Enter
</button>
```

---

## 🎨 Design Tokens Quick Copy

```typescript
// Colors
const primary = '#2563eb'
const secondary = '#f59e0b'
const success = '#22c55e'
const error = '#ef4444'
const warning = '#f59e0b'
const info = '#3b82f6'

// Spacing (8px grid)
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
}

// Typography
const fontSize = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '30px',
  '4xl': '36px',
}

// Border Radius
const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  full: '9999px',
}

// Shadows
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
}
```

---

## 📚 Additional Resources

- **Full Design System:** `lib/design-system.ts`
- **Glassmorphism CSS:** `app/globals.css`
- **Complete Guide:** `UI_UX_FIXES_COMPLETE_SUMMARY.md`

---

**Happy Coding! 🚀**

_For questions, refer to the complete documentation in `UI_UX_FIXES_COMPLETE_SUMMARY.md`_
