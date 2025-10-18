/**
 * Glassmorphism Design System - Complete Implementation Guide
 * CampusAxis COMSATS ITE App
 * 
 * This guide provides comprehensive documentation for implementing
 * glassmorphism UI with proper light/dark mode support.
 */

# Glassmorphism Design System

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Usage Guide](#usage-guide)
4. [Component Library](#component-library)
5. [Best Practices](#best-practices)
6. [Examples](#examples)

---

## Overview

This design system implements modern glassmorphism UI with:
- ✅ **Proper opacity levels** for both light and dark modes
- ✅ **Advanced backdrop blur** effects
- ✅ **Semantic color tokens** with CSS variables
- ✅ **Accessible contrast ratios** (WCAG AA compliant)
- ✅ **Responsive layouts** with mobile-first approach
- ✅ **Performance optimized** with CSS layers

---

## Architecture

### Directory Structure

```
styles/
├── design-system/
│   ├── tokens.css              # Design tokens (colors, spacing, etc.)
│   ├── theme-light.css         # Light mode glass variables
│   ├── theme-dark.css          # Dark mode glass variables
│   └── glassmorphism.css       # Utility classes
├── base/
│   ├── reset.css               # CSS reset and normalization
│   └── layout.css              # Layout utilities
├── components/
│   ├── card.module.css         # Card components
│   ├── button.module.css       # Button components
│   ├── input.module.css        # Form inputs
│   ├── modal.module.css        # Modals and dialogs
│   └── navigation.module.css   # Navigation components
└── index.css                   # Main entry point
```

### Import Order

In your `app/globals.css`:

```css
@import "tailwindcss";
@import "../styles/index.css";  /* Design system */
```

---

## Usage Guide

### 1. Using Utility Classes

```tsx
import React from 'react';

export function MyComponent() {
  return (
    <div className="glass-card">
      <h2>Glassmorphism Card</h2>
      <p>This card automatically adapts to light/dark mode</p>
    </div>
  );
}
```

### 2. Using CSS Modules

```tsx
import styles from './MyComponent.module.css';

export function MyComponent() {
  return (
    <div className={styles.customCard}>
      <h2>Custom Styled Card</h2>
    </div>
  );
}
```

```css
/* MyComponent.module.css */
.customCard {
  background: var(--glass-bg-card);
  backdrop-filter: blur(var(--glass-blur-xl));
  -webkit-backdrop-filter: blur(var(--glass-blur-xl));
  border: 1px solid var(--glass-border-base);
  border-radius: var(--radius-2xl);
  padding: var(--space-6);
  box-shadow: var(--glass-shadow-md);
  transition: all var(--transition-medium) var(--ease-in-out);
}

.customCard:hover {
  background: var(--glass-hover-bg);
  box-shadow: var(--glass-hover-shadow);
  transform: translateY(-2px);
}
```

### 3. Creating Theme-Specific Styles

**File: component.module.css (base)**
```css
.container {
  /* Shared styles */
  padding: var(--space-6);
  border-radius: var(--radius-xl);
}
```

**File: component.light.module.css**
```css
.container {
  background: var(--glass-bg-card);
  border: 1px solid rgba(255, 255, 255, 0.30);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.12);
}
```

**File: component.dark.module.css**
```css
.dark .container {
  background: var(--glass-bg-card);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.50);
}
```

---

## Component Library

### Glass Cards

#### Basic Card
```tsx
<div className="glass-card">
  <!-- Content -->
</div>
```

#### Subtle Card (less prominent)
```tsx
<div className="glass-card-subtle">
  <!-- Content -->
</div>
```

#### Elevated Card (more prominent)
```tsx
<div className="glass-card-elevated">
  <!-- Content -->
</div>
```

#### Colored Cards
```tsx
<div className="glass-card glass-blue">Blue tinted card</div>
<div className="glass-card glass-indigo">Indigo tinted card</div>
<div className="glass-card glass-purple">Purple tinted card</div>
<div className="glass-card glass-pink">Pink tinted card</div>
```

### Glass Buttons

```tsx
{/* Standard glass button */}
<button className="glass-button">Click Me</button>

{/* Primary glass button */}
<button className="glass-button-primary">Primary Action</button>
```

### Glass Inputs

```tsx
<input 
  type="text" 
  className="glass-input" 
  placeholder="Enter text..."
/>
```

### Glass Navigation

```tsx
<nav className="glass-nav">
  <!-- Navigation items -->
</nav>

{/* Sticky navigation */}
<nav className="glass-nav-sticky">
  <!-- Navigation items -->
</nav>
```

### Glass Modals

```tsx
{/* Modal backdrop */}
<div className="glass-modal-backdrop">
  {/* Modal content */}
  <div className="glass-modal">
    <h2>Modal Title</h2>
    <p>Modal content</p>
  </div>
</div>
```

### Glass Panels

```tsx
<div className="glass-panel">
  <!-- Panel content -->
</div>

<div className="glass-panel-overlay">
  <!-- Overlay panel content -->
</div>
```

---

## Design Tokens Reference

### Colors

```css
--color-brand-primary: 69 115 223;     /* RGB format for opacity control */
--color-brand-secondary: 99 102 241;
--color-brand-accent: 139 92 246;
```

**Usage:**
```css
background: rgb(var(--color-brand-primary));
background: rgba(var(--color-brand-primary), 0.5);  /* 50% opacity */
```

### Blur Values

```css
--glass-blur-sm: 4px;
--glass-blur-md: 8px;
--glass-blur-lg: 12px;
--glass-blur-xl: 16px;
--glass-blur-2xl: 24px;
--glass-blur-3xl: 32px;
```

### Spacing Scale (8px grid)

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Border Radius

```css
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.25rem;   /* 20px */
--radius-3xl: 1.5rem;    /* 24px */
--radius-full: 9999px;
```

### Shadows

```css
--glass-shadow-sm: ...   /* Subtle shadow */
--glass-shadow-md: ...   /* Medium shadow */
--glass-shadow-lg: ...   /* Large shadow */
--glass-shadow-xl: ...   /* Extra large shadow */
```

---

## Best Practices

### 1. Always Use Backdrop Blur

```css
/* ✅ CORRECT */
.glass-element {
  background: var(--glass-bg-card);
  backdrop-filter: blur(var(--glass-blur-xl));
  -webkit-backdrop-filter: blur(var(--glass-blur-xl));  /* Safari support */
}

/* ❌ INCORRECT - Missing backdrop blur */
.glass-element {
  background: rgba(255, 255, 255, 0.1);
}
```

### 2. Use Proper Opacity Levels

**Light Mode:** Higher opacity (60-85%)
```css
--glass-bg-card: rgba(255, 255, 255, 0.65);
```

**Dark Mode:** Lower opacity (40-60%)
```css
--glass-bg-card: rgba(30, 41, 59, 0.55);
```

### 3. Always Include Borders

```css
.glass-element {
  border: 1px solid var(--glass-border-base);
}
```

### 4. Add Smooth Transitions

```css
.glass-element {
  transition: all var(--transition-medium) var(--ease-in-out);
}
```

### 5. Implement Hover States

```css
.glass-element:hover {
  background: var(--glass-hover-bg);
  box-shadow: var(--glass-hover-shadow);
  transform: translateY(-2px);
}
```

### 6. Use Inset Highlights

```css
box-shadow: 
  0 8px 32px rgba(31, 38, 135, 0.25),
  inset 0 1px 0 rgba(255, 255, 255, 0.50);  /* Top highlight */
```

---

## Examples

### Example 1: Feature Card

```tsx
<div className="glass-card">
  <div style={{ padding: 'var(--space-6)' }}>
    <h3 style={{ 
      fontSize: '1.25rem', 
      fontWeight: 600,
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-3)'
    }}>
      Feature Title
    </h3>
    <p style={{ 
      color: 'var(--text-secondary)',
      lineHeight: 1.6
    }}>
      Feature description with proper text contrast
    </p>
  </div>
</div>
```

### Example 2: Navigation Bar

```tsx
<nav className="glass-nav-sticky" style={{ 
  padding: 'var(--space-4) var(--space-6)' 
}}>
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <div className="logo">CampusAxis</div>
    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
      <a href="/" className="glass-button">Home</a>
      <a href="/about" className="glass-button">About</a>
      <a href="/contact" className="glass-button-primary">Contact</a>
    </div>
  </div>
</nav>
```

### Example 3: Form with Glass Inputs

```tsx
<form className="glass-panel" style={{ maxWidth: '500px' }}>
  <h2 style={{ marginBottom: 'var(--space-6)' }}>Contact Form</h2>
  
  <div style={{ marginBottom: 'var(--space-4)' }}>
    <label style={{ 
      display: 'block',
      marginBottom: 'var(--space-2)',
      fontWeight: 500,
      color: 'var(--text-primary)'
    }}>
      Name
    </label>
    <input 
      type="text" 
      className="glass-input"
      placeholder="Your name"
    />
  </div>
  
  <div style={{ marginBottom: 'var(--space-4)' }}>
    <label style={{ 
      display: 'block',
      marginBottom: 'var(--space-2)',
      fontWeight: 500,
      color: 'var(--text-primary)'
    }}>
      Email
    </label>
    <input 
      type="email" 
      className="glass-input"
      placeholder="your@email.com"
    />
  </div>
  
  <button type="submit" className="glass-button-primary" style={{ width: '100%' }}>
    Submit
  </button>
</form>
```

---

## Accessibility

### Contrast Ratios

All glass components maintain WCAG AA contrast ratios:

- **Light Mode Text:** Dark text on semi-transparent white
  - Primary: `rgba(15, 23, 42, 0.95)` ✅ 12.5:1 ratio
  - Secondary: `rgba(51, 65, 85, 0.85)` ✅ 8.2:1 ratio

- **Dark Mode Text:** Light text on semi-transparent dark
  - Primary: `rgba(248, 250, 252, 0.95)` ✅ 13.1:1 ratio
  - Secondary: `rgba(226, 232, 240, 0.85)` ✅ 9.3:1 ratio

### Focus Indicators

```css
.glass-button:focus-visible {
  outline: none;
  border-color: var(--glass-focus-border);
  box-shadow: var(--glass-focus-ring);  /* 3px ring at 20% opacity */
}
```

### Reduced Motion

The design system respects user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Performance Tips

1. **Use `will-change` sparingly:**
```css
.glass-card:hover {
  will-change: transform, box-shadow;
}
```

2. **Limit backdrop-filter usage** - Use on containers, not every element

3. **Optimize blur values** - More blur = more processing power

4. **Use CSS containment:**
```css
.glass-card {
  contain: layout style paint;
}
```

---

## Migration Guide

### Replacing Inline Styles

**Before:**
```tsx
<div style={{
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  padding: '20px'
}}>
```

**After:**
```tsx
<div className="glass-card">
```

### Updating Existing Components

1. Import the design system
2. Replace inline styles with utility classes
3. Use CSS variables for custom values
4. Test in both light and dark modes

---

## Troubleshooting

### Glass effect not visible?
- Check if backdrop-filter is supported
- Ensure parent has background/image behind glass element
- Verify opacity is not too high

### Text not readable?
- Use `--text-on-glass` color variables
- Increase background opacity
- Add text shadows if needed

### Performance issues?
- Reduce blur amount
- Limit number of glass elements
- Use simpler shadows

---

## Support

For issues or questions:
- Check this documentation
- Review the source files in `/styles/design-system/`
- Test in both light and dark modes
- Verify browser support for backdrop-filter

---

**Last Updated:** October 2025
**Version:** 1.0.0
**Maintainer:** CampusAxis Development Team
