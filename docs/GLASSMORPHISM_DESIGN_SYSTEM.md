# CampusAxis Glassmorphism Design System 2025

## 🎨 Overview

This document outlines the comprehensive glassmorphism design system implemented across the entire CampusAxis platform. The system features two distinct visual modes optimized for light and dark themes.

## 🌓 Design Philosophy

### Light Mode: Layered/3D Glassmorphism
- **Visual Style**: Classic frosted glass with layered depth
- **Characteristics**:
  - Soft, luminous backgrounds
  - Subtle shadows with 3D elevation
  - High transparency with crisp borders
  - Bright, clean aesthetic
  - Optimal for daytime use

### Dark Mode: Deep Tinted Glassmorphism  
- **Visual Style**: Dark glass with subtle glow effects
- **Characteristics**:
  - Rich, deep tinted backgrounds
  - Enhanced shadows with glow
  - Lower transparency for better contrast
  - Premium night-time aesthetic
  - Optimized for low-light environments

## 📐 CSS Module Structure

All components follow the **3-file module pattern**:

```
component-name.module.css       # Base styles (theme-independent)
component-name.light.module.css # Light mode glassmorphism
component-name.dark.module.css  # Dark mode glassmorphism
```

### File Responsibilities

#### Base Module (`*.module.css`)
- Layout and structure
- Typography
- Spacing and sizing
- Theme-independent properties
- Animation definitions

#### Light Module (`*.light.module.css`)
- Light glassmorphism backgrounds
- Frosted glass blur effects
- Soft shadows and borders
- Light theme text colors
- Hover/active states for light mode

#### Dark Module (`*.dark.module.css`)
- Dark glassmorphism backgrounds
- Enhanced blur with saturation
- Glow effects and deep shadows
- Dark theme text colors
- Hover/active states for dark mode

## 🎯 Glass Container Classes

### Subtle Glass
**Use for**: Background sections, subtle dividers

```css
.glass-container-subtle
```

**Light Mode**:
- Background: `rgba(255, 255, 255, 0.65)`
- Blur: `8px` saturate(140%)
- Border: `rgba(148, 163, 184, 0.12)`
- Shadow: Soft 2-layer

**Dark Mode**:
- Background: `rgba(15, 23, 42, 0.50)`
- Blur: `10px` saturate(130%)
- Border: `rgba(148, 163, 184, 0.08)`
- Shadow: Dark with subtle glow

### Base Glass
**Use for**: Standard cards, content containers

```css
.glass-container-base
```

**Light Mode**:
- Background: `rgba(255, 255, 255, 0.75)`
- Blur: `12px` saturate(150%)
- Border: `rgba(148, 163, 184, 0.18)`
- Shadow: Medium 2-layer with inset highlight

**Dark Mode**:
- Background: `rgba(15, 23, 42, 0.65)`
- Blur: `14px` saturate(140%)
- Border: `rgba(148, 163, 184, 0.12)`
- Shadow: Enhanced depth

### Medium Glass
**Use for**: Feature cards, important sections

```css
.glass-container-medium
```

**Light Mode**:
- Background: `rgba(255, 255, 255, 0.85)`
- Blur: `16px` saturate(160%)
- Border: `rgba(148, 163, 184, 0.25)`
- Shadow: Large 3-layer with elevation

**Dark Mode**:
- Background: `rgba(15, 23, 42, 0.75)`
- Blur: `18px` saturate(150%)
- Border: `rgba(148, 163, 184, 0.18)`
- Shadow: Deep with glow accent

### Strong Glass
**Use for**: Modals, navigation, hero sections

```css
.glass-container-strong
```

**Light Mode**:
- Background: `rgba(255, 255, 255, 0.92)`
- Blur: `20px` saturate(170%)
- Border: `rgba(148, 163, 184, 0.35)`
- Shadow: XL 3-layer with strong inset

**Dark Mode**:
- Background: `rgba(15, 23, 42, 0.85)`
- Blur: `24px` saturate(160%)
- Border: `rgba(148, 163, 184, 0.25)`
- Shadow: Maximum depth with prominent glow

## 🔘 Interactive Components

### Glass Cards
```css
.glass-card-light
```
- Interactive hover states
- Lift animation on hover
- Top highlight pseudo-element
- Smooth transitions (300ms)

### Glass Buttons
```css
.glass-btn-light
```
- Responsive sizing with `clamp()`
- Hover lift effect
- Active press state
- Focus ring support

### Glass Inputs
```css
.glass-input-light
```
- Focus state enhancement
- Placeholder color adaptation
- Accessible contrast ratios
- Smooth state transitions

### Glass Navigation
```css
.glass-nav-light
```
- Sticky positioning support
- Enhanced saturation (180%)
- Bottom border definition
- Backdrop blur optimization

### Glass Modals
```css
.glass-modal-light
.glass-modal-backdrop
```
- Maximum blur for overlay
- Tinted backdrop
- Strong elevation
- Adaptive opacity

## 🎨 CSS Custom Properties

### Light Mode Variables
```css
--glass-light-subtle
--glass-light-base
--glass-light-medium
--glass-light-strong
--glass-light-intense

--glass-light-border-subtle
--glass-light-border-base
--glass-light-border-medium
--glass-light-border-strong

--glass-light-blur-sm through -2xl
--glass-light-shadow-sm through -xl
--glass-light-text-primary/secondary/tertiary
```

### Dark Mode Variables
```css
--glass-dark-subtle
--glass-dark-base
--glass-dark-medium
--glass-dark-strong
--glass-dark-intense

--glass-dark-border-subtle
--glass-dark-border-base
--glass-dark-border-medium
--glass-dark-border-strong

--glass-dark-blur-sm through -2xl
--glass-dark-shadow-sm through -xl
--glass-dark-text-primary/secondary/tertiary
```

## 📱 Responsive Behavior

### Mobile Optimization (max-width: 768px)
- Reduced blur intensity for performance
- Light mode: `8px` blur
- Dark mode: `10px` blur
- Maintained visual hierarchy
- Optimized for 60fps scrolling

### Tablet (769px - 1024px)
- Standard blur values
- Adaptive padding with `clamp()`
- Touch-friendly spacing

### Desktop (1025px+)
- Full blur effects
- Maximum visual fidelity
- Enhanced hover interactions

## ♿ Accessibility

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce)
```
- All transitions disabled
- Transform effects removed
- Glass effects maintained (visual only)
- WCAG 2.1 compliant

### Color Contrast
- Light mode text: `rgba(15, 23, 42, 0.95)` (AAA)
- Dark mode text: `rgba(248, 250, 252, 0.95)` (AAA)
- Secondary text maintains 4.5:1 minimum
- Interactive states: Clear visual feedback

### Focus Indicators
- Visible focus rings
- High contrast borders on focus
- Keyboard navigation support
- Screen reader friendly

## 🚀 Performance

### Optimization Strategies
1. **Hardware Acceleration**: `transform: translateZ(0)`
2. **Will-change**: Applied to animated properties
3. **Backdrop-filter**: Both `-webkit-` and standard
4. **Mobile blur reduction**: 25% less blur on mobile
5. **Lazy loading**: Glass effects on visible viewport only

### Browser Support
- ✅ Chrome/Edge (full support)
- ✅ Safari (full support with `-webkit-`)
- ✅ Firefox (full support)
- ⚠️ IE11 (graceful degradation to solid backgrounds)

## 📋 Implementation Checklist

### Component Creation
- [ ] Create base `.module.css` file
- [ ] Create `.light.module.css` file
- [ ] Create `.dark.module.css` file
- [ ] Import all three in component file
- [ ] Apply theme class based on `useThemeMode()`
- [ ] Test in both light and dark modes
- [ ] Verify responsive behavior
- [ ] Check accessibility

### Example Component Structure
```tsx
import { useThemeMode } from '@/lib/theme/useThemeMode'
import styles from './component.module.css'
import stylesLight from './component.light.module.css'
import stylesDark from './component.dark.module.css'

export function Component() {
  const mode = useThemeMode()
  const themeClass = mode.isDark ? stylesDark.root : stylesLight.root
  
  return (
    <div className={clsx(styles.container, themeClass)}>
      {/* Content */}
    </div>
  )
}
```

## 🎯 Best Practices

### DO ✅
- Use semantic class names
- Layer glass effects sparingly (max 2-3 levels)
- Test on real backgrounds
- Verify text contrast
- Use `clamp()` for responsive sizing
- Apply hover states for interactivity
- Include focus indicators
- Optimize blur for mobile

### DON'T ❌
- Stack too many glass layers
- Use on text-heavy content without sufficient contrast
- Forget `-webkit-backdrop-filter` prefix
- Apply maximum blur on mobile
- Skip accessibility testing
- Hardcode pixel values (use clamp/CSS vars)
- Ignore reduced motion preferences
- Forget to test in both themes

## 📊 Visual Hierarchy

### Z-Index Layering
1. **Background**: Gradient meshes, patterns
2. **Content Layer**: Base glass containers (z-1)
3. **Cards**: Interactive glass cards (z-10)
4. **Navigation**: Fixed/sticky nav (z-50)
5. **Modals**: Overlays and dialogs (z-100)
6. **Toasts**: Notifications (z-150)

### Glass Intensity Guide
- **Hero sections**: Strong glass
- **Feature cards**: Medium glass
- **Content containers**: Base glass
- **Background sections**: Subtle glass
- **Navigation**: Strong glass with saturation
- **Modals**: Intense glass with high blur

## 🔄 Theme Switching

The glassmorphism adapts automatically when theme changes:

```tsx
// Theme detection
const mode = useThemeMode()
const themeClass = mode.isDark ? stylesDark.dark : stylesLight.light

// Applied to root container
<div className={clsx(styles.base, themeClass)}>
```

### Transition Smoothness
- Theme switch: 300ms ease
- Hover states: 250ms ease-in-out
- Focus states: 200ms ease
- Active states: 150ms ease

## 📚 Related Documentation
- [UI/UX Framework](./UI_UX_OVERHAUL.md)
- [Component Standards](./COMPONENT_STANDARDS.md)
- [Accessibility Guidelines](./ACCESSIBILITY.md)
- [Performance Optimization](./PERFORMANCE.md)

## 🆘 Troubleshooting

### Glass effect not visible
- Check browser supports `backdrop-filter`
- Ensure parent has background content
- Verify transparency values aren't too low

### Poor performance on mobile
- Reduce blur intensity
- Limit number of glass layers
- Check for excessive repaints

### Text contrast issues
- Use text color variables
- Test with contrast checker
- Add text shadows if needed

### Hover states not working
- Check parent is interactive
- Verify transition properties
- Test cursor pointer

---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Maintainer**: CampusAxis Development Team
