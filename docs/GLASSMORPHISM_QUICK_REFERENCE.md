# Glassmorphism Quick Reference Guide

## 🚀 Quick Start

### 1. Import Required Files
```tsx
import { useThemeMode } from '@/lib/theme/useThemeMode'
import styles from './component.module.css'
import stylesLight from './component.light.module.css'
import stylesDark from './component.dark.module.css'
import clsx from 'clsx'
```

### 2. Apply Theme Classes
```tsx
const mode = useThemeMode()
const themeClass = mode.isDark ? stylesDark.root : stylesLight.root

return <div className={clsx(styles.container, themeClass)}>...</div>
```

## 📦 Pre-built Utility Classes

### Container Levels
```css
/* Subtle - Background elements */
.glass-container-subtle

/* Base - Standard containers */
.glass-container-base

/* Medium - Feature cards */
.glass-container-medium

/* Strong - Modals, navigation */
.glass-container-strong
```

### Interactive Elements
```css
/* Cards with hover effects */
.glass-card-light

/* Buttons */
.glass-btn-light

/* Input fields */
.glass-input-light

/* Navigation bars */
.glass-nav-light

/* Modals and overlays */
.glass-modal-light
.glass-modal-backdrop
```

## 🎨 Light Mode Values

### Backgrounds
```css
--glass-light-subtle: rgba(255, 255, 255, 0.65);
--glass-light-base: rgba(255, 255, 255, 0.75);
--glass-light-medium: rgba(255, 255, 255, 0.85);
--glass-light-strong: rgba(255, 255, 255, 0.92);
```

### Blur Effects
```css
--glass-light-blur-sm: blur(8px) saturate(140%);
--glass-light-blur-md: blur(12px) saturate(150%);
--glass-light-blur-lg: blur(16px) saturate(160%);
--glass-light-blur-xl: blur(20px) saturate(170%);
```

### Borders
```css
--glass-light-border-subtle: rgba(148, 163, 184, 0.12);
--glass-light-border-base: rgba(148, 163, 184, 0.18);
--glass-light-border-medium: rgba(148, 163, 184, 0.25);
```

## 🌙 Dark Mode Values

### Backgrounds
```css
--glass-dark-subtle: rgba(15, 23, 42, 0.50);
--glass-dark-base: rgba(15, 23, 42, 0.65);
--glass-dark-medium: rgba(15, 23, 42, 0.75);
--glass-dark-strong: rgba(15, 23, 42, 0.85);
```

### Blur Effects
```css
--glass-dark-blur-sm: blur(10px) saturate(130%);
--glass-dark-blur-md: blur(14px) saturate(140%);
--glass-dark-blur-lg: blur(18px) saturate(150%);
--glass-dark-blur-xl: blur(24px) saturate(160%);
```

### Borders
```css
--glass-dark-border-subtle: rgba(148, 163, 184, 0.08);
--glass-dark-border-base: rgba(148, 163, 184, 0.12);
--glass-dark-border-medium: rgba(148, 163, 184, 0.18);
```

## 📝 Component Template

### Base Module (.module.css)
```css
/* component.module.css */
.container {
  position: relative;
  border-radius: clamp(16px, 2.5vw, 24px);
  padding: clamp(1.5rem, 3vw, 3rem);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.title {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 700;
  margin-bottom: 1rem;
}

.content {
  font-size: clamp(0.9375rem, 1.5vw, 1.0625rem);
  line-height: 1.6;
}
```

### Light Module (.light.module.css)
```css
/* component.light.module.css */
.container {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.06),
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
}

.container:hover {
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(148, 163, 184, 0.28);
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.title {
  color: rgba(15, 23, 42, 0.95);
}

.content {
  color: rgba(51, 65, 85, 0.85);
}
```

### Dark Module (.dark.module.css)
```css
/* component.dark.module.css */
.container {
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  border: 1px solid rgba(148, 163, 184, 0.12);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.5),
    0 2px 10px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.container:hover {
  background: rgba(15, 23, 42, 0.78);
  border-color: rgba(148, 163, 184, 0.20);
  box-shadow: 
    0 8px 28px rgba(0, 0, 0, 0.6),
    0 4px 14px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.07),
    0 0 40px rgba(99, 102, 241, 0.15);
}

.title {
  color: rgba(248, 250, 252, 0.95);
}

.content {
  color: rgba(226, 232, 240, 0.85);
}
```

## 🎯 Common Patterns

### Card with Gradient Border
```css
/* Light */
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    rgba(99, 102, 241, 0.7),
    rgba(139, 92, 246, 0.7),
    rgba(59, 130, 246, 0.7)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover::before {
  opacity: 1;
}

/* Dark - same but with glow */
.card::before {
  background: linear-gradient(90deg, 
    rgba(99, 102, 241, 0.6),
    rgba(139, 92, 246, 0.6),
    rgba(59, 130, 246, 0.6)
  );
}
```

### Button with Glass Effect
```css
/* Light */
.button {
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.95), 
    rgba(139, 92, 246, 0.95)
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  box-shadow: 
    0 6px 20px rgba(99, 102, 241, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

/* Dark - add glow */
.button {
  box-shadow: 
    0 6px 20px rgba(99, 102, 241, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 0 40px rgba(99, 102, 241, 0.2);
}
```

### Input Field Glass
```css
/* Light */
.input {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(8px) saturate(140%);
  -webkit-backdrop-filter: blur(8px) saturate(140%);
  border: 1px solid rgba(148, 163, 184, 0.18);
  color: rgba(15, 23, 42, 0.95);
}

.input:focus {
  background: rgba(255, 255, 255, 0.75);
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 
    0 0 0 3px rgba(99, 102, 241, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Dark */
.input {
  background: rgba(15, 23, 42, 0.50);
  backdrop-filter: blur(10px) saturate(130%);
  -webkit-backdrop-filter: blur(10px) saturate(130%);
  border: 1px solid rgba(148, 163, 184, 0.12);
  color: rgba(248, 250, 252, 0.95);
}

.input:focus {
  background: rgba(15, 23, 42, 0.65);
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 
    0 0 0 3px rgba(99, 102, 241, 0.15),
    0 2px 12px rgba(0, 0, 0, 0.3);
}
```

## 📱 Responsive Considerations

```css
/* Mobile - Reduce blur for performance */
@media (max-width: 768px) {
  .container {
    backdrop-filter: blur(8px) saturate(140%);
    -webkit-backdrop-filter: blur(8px) saturate(140%);
  }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .container {
    backdrop-filter: blur(12px) saturate(150%);
    -webkit-backdrop-filter: blur(12px) saturate(150%);
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .container {
    backdrop-filter: blur(16px) saturate(160%);
    -webkit-backdrop-filter: blur(16px) saturate(160%);
  }
}
```

## ♿ Accessibility

```css
/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .container {
    transition: none;
    transform: none !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .container {
    background: hsl(var(--background));
    border: 2px solid hsl(var(--foreground));
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}
```

## 🔍 Debugging Tips

### Check blur support
```javascript
if (CSS.supports('backdrop-filter', 'blur(10px)')) {
  // Blur is supported
} else {
  // Fallback to solid background
}
```

### Verify contrast
- Light mode text on glass: minimum 4.5:1 ratio
- Dark mode text on glass: minimum 4.5:1 ratio
- Use browser DevTools contrast checker

### Performance monitoring
```javascript
// Monitor frame rate
const stats = new Stats();
document.body.appendChild(stats.dom);

requestAnimationFrame(function loop() {
  stats.update();
  requestAnimationFrame(loop);
});
```

## 🎨 Color Palette

### Primary Gradients
```css
/* Blue to Purple */
background: linear-gradient(135deg, 
  rgba(99, 102, 241, 0.95), 
  rgba(139, 92, 246, 0.95)
);

/* Purple to Pink */
background: linear-gradient(135deg, 
  rgba(139, 92, 246, 0.95), 
  rgba(236, 72, 153, 0.95)
);

/* Blue to Cyan */
background: linear-gradient(135deg, 
  rgba(59, 130, 246, 0.95), 
  rgba(6, 182, 212, 0.95)
);
```

### Glass Tints
```css
/* Light blue tint */
background: rgba(239, 246, 255, 0.75);

/* Light purple tint */
background: rgba(245, 243, 255, 0.75);

/* Light pink tint */
background: rgba(253, 242, 248, 0.75);
```

---

**Last Updated**: October 2025  
**Version**: 1.0.0
