# CSS Modules Implementation Guide

**Last Updated:** October 18, 2025
**Project:** CampusAxis COMSATS ITE App

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Importing CSS Modules](#importing-css-modules)
4. [Using Styles in Components](#using-styles-in-components)
5. [Theme Support](#theme-support)
6. [Glassmorphism Patterns](#glassmorphism-patterns)
7. [Best Practices](#best-practices)
8. [Examples](#examples)
9. [Troubleshooting](#troubleshooting)

---

## Overview

All TSX components in this project now have three CSS module files:

1. **`[component].module.css`** - Base styles
2. **`[component].dark.module.css`** - Dark theme overrides
3. **`[component].light.module.css`** - Light theme overrides

These modules implement a premium glassmorphism design system with:
- Backdrop blur effects
- Semi-transparent backgrounds
- Smooth animations
- Responsive design
- Accessibility support

---

## Quick Start

### 1. Import the CSS Module

At the top of your TSX file, add:

\`\`\`tsx
import styles from './ComponentName.module.css';
\`\`\`

### 2. Use the Styles

Apply styles using the `className` prop:

\`\`\`tsx
<div className={styles.container}>
  <h1 className={styles.title}>Hello World</h1>
  <div className={styles.content}>
    Content goes here
  </div>
</div>
\`\`\`

### 3. Combine Multiple Classes

Use template literals or the `clsx` utility:

\`\`\`tsx
// Using template literals
<div className={\`\${styles.card} \${styles.active}\`}>

// Using clsx (recommended)
import clsx from 'clsx';
<div className={clsx(styles.card, isActive && styles.active)}>
\`\`\`

---

## Importing CSS Modules

### Basic Import

\`\`\`tsx
import styles from './page.module.css';
\`\`\`

### With TypeScript

For better type safety, create a `*.module.css.d.ts` file:

\`\`\`typescript
// page.module.css.d.ts
declare const styles: {
  readonly container: string;
  readonly header: string;
  readonly title: string;
  readonly content: string;
  readonly card: string;
  readonly button: string;
  readonly grid: string;
};

export default styles;
\`\`\`

---

## Using Styles in Components

### Simple Component

\`\`\`tsx
import styles from './Button.module.css';

export function Button({ children, onClick }) {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
}
\`\`\`

### Component with Multiple Elements

\`\`\`tsx
import styles from './Card.module.css';

export function Card({ title, description, image }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <img src={image} alt={title} className={styles.image} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}
\`\`\`

### Conditional Styles

\`\`\`tsx
import styles from './Alert.module.css';
import clsx from 'clsx';

export function Alert({ type, message }) {
  return (
    <div className={clsx(
      styles.alert,
      type === 'success' && styles.success,
      type === 'error' && styles.error,
      type === 'warning' && styles.warning
    )}>
      {message}
    </div>
  );
}
\`\`\`

---

## Theme Support

### Automatic Theme Application

The CSS modules automatically apply theme-specific styles based on the `data-theme` attribute:

\`\`\`css
/* base.module.css */
.container {
  /* Base styles applied to all themes */
}

/* base.dark.module.css */
.container {
  /* Overrides for dark theme */
  background: rgba(30, 30, 46, 0.85);
}

/* base.light.module.css */
.container {
  /* Overrides for light theme */
  background: rgba(255, 255, 255, 0.88);
}
\`\`\`

### Manual Theme Detection

If needed, detect theme in your component:

\`\`\`tsx
import { useTheme } from 'next-themes';
import styles from './Component.module.css';

export function Component() {
  const { theme } = useTheme();
  
  return (
    <div className={styles.container} data-theme={theme}>
      Content
    </div>
  );
}
\`\`\`

---

## Glassmorphism Patterns

### Available CSS Classes

All CSS modules include these glassmorphism classes:

#### Container
\`\`\`tsx
<div className={styles.container}>
  {/* Main container with glassmorphism */}
</div>
\`\`\`

**Features:**
- Backdrop blur
- Semi-transparent background
- Subtle border
- Layered shadows
- Smooth transitions

#### Header
\`\`\`tsx
<div className={styles.header}>
  <h1 className={styles.title}>Title</h1>
</div>
\`\`\`

**Features:**
- Gradient text effect
- Bottom border separator
- Proper spacing

#### Card
\`\`\`tsx
<div className={styles.card}>
  {/* Card content */}
</div>
\`\`\`

**Features:**
- Lighter glassmorphism
- Hover effect
- Rounded corners
- Subtle shadow

#### Button
\`\`\`tsx
<button className={styles.button}>
  Click Me
</button>
\`\`\`

**Features:**
- Glassmorphism background
- Hover state with increased blur
- Active state feedback
- Focus outline for accessibility

#### Grid Layout
\`\`\`tsx
<div className={styles.grid}>
  <div className={styles.card}>Card 1</div>
  <div className={styles.card}>Card 2</div>
  <div className={styles.card}>Card 3</div>
</div>
\`\`\`

**Features:**
- Responsive columns
- Auto-fit minmax
- Consistent gaps

---

## Best Practices

### 1. Always Import CSS Modules

\`\`\`tsx
// ✅ Good
import styles from './Component.module.css';

// ❌ Bad - don't use inline styles for glassmorphism
<div style={{ backdropFilter: 'blur(10px)' }}>
\`\`\`

### 2. Use Semantic Class Names

\`\`\`tsx
// ✅ Good
<div className={styles.container}>
  <header className={styles.header}>
    <h1 className={styles.title}>Title</h1>
  </header>
</div>

// ❌ Bad
<div className={styles.div1}>
  <div className={styles.div2}>
    <h1 className={styles.h1}>Title</h1>
  </div>
</div>
\`\`\`

### 3. Combine Classes Properly

\`\`\`tsx
// ✅ Good
import clsx from 'clsx';
<div className={clsx(styles.card, isActive && styles.active)}>

// ⚠️ Acceptable
<div className={\`\${styles.card} \${isActive ? styles.active : ''}\`}>

// ❌ Bad
<div className={styles.card + ' ' + (isActive ? styles.active : '')}>
\`\`\`

### 4. Don't Override Glassmorphism Properties

\`\`\`tsx
// ✅ Good - Use the provided classes
<div className={styles.container}>

// ❌ Bad - Don't override core glassmorphism
<div className={styles.container} style={{ backdropFilter: 'none' }}>
\`\`\`

### 5. Use CSS Variables for Customization

\`\`\`css
/* ✅ Good - Use CSS variables */
.customContainer {
  composes: container;
  background: var(--glass-bg-heavy);
  box-shadow: var(--glass-shadow-xl);
}

/* ❌ Bad - Hard-coded values */
.customContainer {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}
\`\`\`

---

## Examples

### Example 1: Simple Page Component

\`\`\`tsx
// page.tsx
import styles from './page.module.css';

export default function Page() {
  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome to CampusAxis</h1>
      </div>
      
      <div className={styles.content}>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Past Papers</h3>
            <p>Access previous exam papers</p>
          </div>
          <div className={styles.card}>
            <h3>GPA Calculator</h3>
            <p>Calculate your semester GPA</p>
          </div>
          <div className={styles.card}>
            <h3>Community</h3>
            <p>Connect with peers</p>
          </div>
        </div>
      </div>
    </main>
  );
}
\`\`\`

### Example 2: Interactive Component

\`\`\`tsx
// CourseCard.tsx
'use client';

import { useState } from 'react';
import styles from './CourseCard.module.css';
import clsx from 'clsx';

interface CourseCardProps {
  title: string;
  code: string;
  papers: number;
  onClick?: () => void;
}

export function CourseCard({ title, code, papers, onClick }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={clsx(
        styles.card,
        isHovered && styles.cardHovered
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.code}>{code}</span>
      </div>
      <div className={styles.content}>
        <p>{papers} papers available</p>
        <button className={styles.button}>
          View Papers
        </button>
      </div>
    </div>
  );
}
\`\`\`

### Example 3: Form Component

\`\`\`tsx
// LoginForm.tsx
'use client';

import { useState } from 'react';
import styles from './LoginForm.module.css';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Sign In</h2>
      </div>
      
      <form className={styles.content} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>
        
        <button type="submit" className={styles.button}>
          Sign In
        </button>
      </form>
    </div>
  );
}
\`\`\`

---

## Troubleshooting

### Issue: Styles Not Applying

**Problem:** CSS classes not working

**Solutions:**
1. Check import path is correct
2. Verify CSS file exists
3. Check for typos in class names
4. Ensure using `className` not `class`

\`\`\`tsx
// ✅ Correct
import styles from './Component.module.css';
<div className={styles.container}>

// ❌ Wrong path
import styles from '../Component.module.css'; // If file is in same directory

// ❌ Wrong attribute
<div class={styles.container}> // Should be className
\`\`\`

### Issue: Glassmorphism Not Visible

**Problem:** Backdrop blur not showing

**Solutions:**
1. Check browser support (backdrop-filter needs modern browser)
2. Ensure parent has proper background
3. Verify CSS variables are loaded

\`\`\`css
/* Make sure globals.css is imported in layout.tsx */
@import 'globals.css';
\`\`\`

### Issue: Theme Not Switching

**Problem:** Dark/light theme styles not changing

**Solutions:**
1. Check ThemeProvider is wrapping app
2. Verify data-theme attribute is set
3. Ensure theme CSS files are imported

### Issue: TypeScript Errors

**Problem:** Type errors on style properties

**Solutions:**
1. Create `.d.ts` file for CSS module
2. Add to tsconfig.json types
3. Use `@ts-ignore` as last resort

\`\`\`tsx
// Add this to fix TS issues
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
\`\`\`

---

## Additional Resources

### CSS Variables Reference

Available in `globals.css`:

\`\`\`css
/* Glass Backgrounds */
var(--glass-bg-light)
var(--glass-bg-medium)
var(--glass-bg-heavy)
var(--glass-bg-subtle)

/* Glass Borders */
var(--glass-border-light)
var(--glass-border-medium)
var(--glass-border-subtle)

/* Glass Shadows */
var(--glass-shadow-sm)
var(--glass-shadow-md)
var(--glass-shadow-lg)
var(--glass-shadow-xl)

/* Glass Blur */
var(--glass-blur-sm)
var(--glass-blur-md)
var(--glass-blur-lg)
var(--glass-blur-xl)
\`\`\`

### Helpful Utilities

Install these for better development experience:

\`\`\`bash
# Class name utility
pnpm add clsx

# CSS Modules TypeScript support
pnpm add -D typescript-plugin-css-modules
\`\`\`

### VS Code Extensions

Recommended extensions:
- **CSS Modules** - IntelliSense for CSS Modules
- **Tailwind CSS IntelliSense** - If using with Tailwind
- **PostCSS Language Support** - Syntax highlighting

---

## Summary

✅ **Import** CSS modules at the top of your TSX files
✅ **Use** `className={styles.className}` syntax
✅ **Combine** classes with `clsx` utility
✅ **Trust** the glassmorphism templates (don't override)
✅ **Test** in both light and dark themes
✅ **Follow** semantic naming conventions

---

**Need Help?**
- Check the generated CSS module files for available classes
- Review the examples in this guide
- Run `.\scripts\audit-css-modules.ps1` to verify coverage

**Happy Coding!** 🚀
