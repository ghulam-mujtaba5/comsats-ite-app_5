# 🚀 CampusAxis Design System - Quick Start

**Get up and running with the corporate glassmorphic design system in 5 minutes.**

---

## ⚡ Instant Setup

The design system is **already configured** in your `globals.css`. Just start using the classes!

### Step 1: Check Your Setup ✅

Your `globals.css` already includes:
- ✅ Corporate color palette (Light + Dark mode)
- ✅ Glassmorphic components
- ✅ Typography system
- ✅ Animation utilities
- ✅ Accessibility features

### Step 2: Start Building 🎨

Use the pre-built classes in your components:

```tsx
// Example: Dashboard Card Component
export function DashboardCard() {
  return (
    <div className="glass-card lift-hover p-6">
      <h3 className="text-xl font-semibold gradient-text mb-2">
        Welcome to CampusAxis
      </h3>
      <p className="text-muted-foreground mb-4">
        Your AI-powered academic platform
      </p>
      <button className="glass-button magnetic w-full">
        Get Started
      </button>
    </div>
  );
}
```

---

## 🎯 Essential Classes (Top 10)

### 1. **glass-card** — Your go-to container
```tsx
<div className="glass-card p-6">
  Main content container with frosted glass effect
</div>
```

### 2. **glass-button** — Primary action
```tsx
<button className="glass-button">
  Primary Action
</button>
```

### 3. **glass-input** — Form inputs
```tsx
<input className="glass-input w-full" placeholder="Email..." />
```

### 4. **gradient-text** — Eye-catching headings
```tsx
<h1 className="gradient-text text-4xl font-bold">
  Beautiful Gradient
</h1>
```

### 5. **glass-badge** — Status indicators
```tsx
<span className="glass-badge badge-success">Active</span>
```

### 6. **lift-hover** — Interactive hover effect
```tsx
<div className="glass-card lift-hover p-6">
  Lifts on hover
</div>
```

### 7. **magnetic** — Subtle scale on hover
```tsx
<button className="glass-button magnetic">
  Interactive Button
</button>
```

### 8. **glass-nav** — Sticky navigation
```tsx
<nav className="glass-nav px-6 py-4">
  Navigation content
</nav>
```

### 9. **shimmer-loading** — Loading skeleton
```tsx
<div className="shimmer-loading rounded-lg h-24" />
```

### 10. **fade-in** — Entrance animation
```tsx
<div className="fade-in glass-card p-6">
  Animates on mount
</div>
```

---

## 🎨 Color System Quick Reference

### Using Colors in Tailwind

```tsx
// Background colors
className="bg-background"      // Page background
className="bg-card"            // Card background
className="bg-muted"           // Muted sections

// Text colors
className="text-foreground"    // Primary text
className="text-muted-foreground" // Secondary text
className="text-primary"       // Brand blue
className="text-success"       // Green
className="text-warning"       // Amber
className="text-destructive"   // Red

// Border colors
className="border border-border" // Subtle border
className="border-primary"     // Blue border
```

### Gradients

```tsx
// Use pre-built gradient classes
className="gradient-text"           // Primary gradient text
className="gradient-text-secondary" // Secondary gradient text

// Or use CSS variables
style={{ background: 'var(--gradient-primary)' }}
```

---

## 📐 Spacing Quick Reference

### Padding/Margin Scale (8px grid)

```tsx
className="p-1"   // 4px
className="p-2"   // 8px
className="p-4"   // 16px (most common)
className="p-6"   // 24px
className="p-8"   // 32px
className="p-12"  // 48px
```

### Border Radius

```tsx
className="rounded"      // 8px (default)
className="rounded-lg"   // 16px (cards)
className="rounded-xl"   // 24px (large cards)
className="rounded-full" // Pill shape (badges)
```

---

## 🧩 Common Patterns

### Pattern 1: Stat Card

```tsx
<div className="glass-card p-6">
  <p className="text-sm text-muted-foreground mb-1">Total Users</p>
  <p className="text-3xl font-bold gradient-text mb-2">12,458</p>
  <span className="glass-badge badge-success text-xs">+12%</span>
</div>
```

### Pattern 2: Action Button Group

```tsx
<div className="flex gap-4">
  <button className="glass-button flex-1">Confirm</button>
  <button className="glass-button-outline flex-1">Cancel</button>
</div>
```

### Pattern 3: Form Field

```tsx
<div className="space-y-2">
  <label className="text-sm font-medium">Email</label>
  <input 
    type="email" 
    className="glass-input w-full" 
    placeholder="your@email.com"
  />
</div>
```

### Pattern 4: Notification Badge

```tsx
<div className="relative">
  <button className="glass-button-ghost">
    <BellIcon className="w-5 h-5" />
  </button>
  <span className="absolute -top-1 -right-1 glass-badge badge-error text-xs w-5 h-5 flex items-center justify-center p-0">
    3
  </span>
</div>
```

### Pattern 5: Hero Section

```tsx
<section className="glass-card-heavy p-12 text-center">
  <h1 className="text-4xl font-bold gradient-text mb-4">
    Welcome to CampusAxis
  </h1>
  <p className="text-lg text-muted-foreground mb-8">
    AI-powered academic and freelancing platform
  </p>
  <button className="glass-button magnetic">
    Get Started →
  </button>
</section>
```

---

## 🎭 Variants Reference

### Button Variants

```tsx
// Primary (default)
<button className="glass-button">Primary</button>

// Secondary
<button className="glass-button-secondary">Secondary</button>

// Outline
<button className="glass-button-outline">Outline</button>

// Ghost
<button className="glass-button-ghost">Ghost</button>
```

### Card Variants

```tsx
// Default (medium glass)
<div className="glass-card">Medium</div>

// Subtle
<div className="glass-card-subtle">Light</div>

// Heavy
<div className="glass-card-heavy">Strong</div>
```

### Badge Variants

```tsx
<span className="glass-badge badge-success">Success</span>
<span className="glass-badge badge-warning">Warning</span>
<span className="glass-badge badge-info">Info</span>
<span className="glass-badge badge-error">Error</span>
```

---

## ✨ Animation Utilities

### Hover Effects

```tsx
// Lift effect
<div className="lift-hover glass-card">Lifts on hover</div>

// Scale effect
<div className="scale-hover">Scales on hover</div>

// Magnetic effect
<button className="magnetic glass-button">Magnetic</button>

// Glow effect
<div className="hover-glow glass-card">Glows on hover</div>
```

### Loading States

```tsx
// Shimmer skeleton
<div className="shimmer-loading rounded h-24 w-full" />

// Pulse
<div className="pulse glass-badge">Loading...</div>
```

### Entrance Animations

```tsx
// Fade in
<div className="fade-in">Fades in</div>

// Slide up
<div className="slide-up">Slides up</div>

// Bounce
<div className="bounce">Bounces</div>
```

---

## 🌓 Dark Mode

Dark mode is **automatic**! Just toggle the `.dark` class on your root element:

```tsx
// In your theme toggle component
const toggleTheme = () => {
  document.documentElement.classList.toggle('dark');
};
```

All colors automatically adapt to dark mode.

---

## ♿ Accessibility

Built-in accessibility features:

- ✅ **Focus visible** — Automatic focus rings for keyboard navigation
- ✅ **WCAG 2.1 AA** — All color contrasts meet standards
- ✅ **Reduced motion** — Respects user preferences
- ✅ **Screen readers** — Semantic HTML support

### Skip to Main Content

```tsx
<a href="#main-content" className="skip-to-main">
  Skip to main content
</a>

<main id="main-content">
  {/* Your content */}
</main>
```

---

## 📱 Responsive Utilities

### Hide on Mobile/Desktop

```tsx
// Hide on mobile
<div className="hide-mobile">Desktop only</div>

// Hide on desktop
<div className="hide-desktop">Mobile only</div>
```

### Responsive Text

```tsx
// Smaller text that grows on larger screens
<p className="text-responsive-sm">Responsive text</p>

// Larger text that grows even more
<h1 className="text-responsive-lg">Big responsive heading</h1>
```

---

## 🎯 5-Minute Implementation Challenge

**Create a complete dashboard card in 5 minutes:**

```tsx
import { Users, TrendingUp } from 'lucide-react';

export function QuickDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Stat Card 1 */}
      <div className="glass-card lift-hover p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <Users className="w-5 h-5 text-primary" />
        </div>
        <p className="text-3xl font-bold gradient-text mb-2">12,458</p>
        <div className="flex items-center gap-2">
          <span className="glass-badge badge-success text-xs">+12%</span>
          <TrendingUp className="w-3 h-3 text-success" />
        </div>
      </div>

      {/* Stat Card 2 */}
      <div className="glass-card lift-hover p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Active Projects</p>
          <Users className="w-5 h-5 text-secondary" />
        </div>
        <p className="text-3xl font-bold gradient-text mb-2">342</p>
        <div className="flex items-center gap-2">
          <span className="glass-badge badge-info text-xs">+8%</span>
          <TrendingUp className="w-3 h-3 text-info" />
        </div>
      </div>

      {/* Stat Card 3 */}
      <div className="glass-card lift-hover p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Revenue</p>
          <Users className="w-5 h-5 text-accent" />
        </div>
        <p className="text-3xl font-bold gradient-text mb-2">$48.2K</p>
        <div className="flex items-center gap-2">
          <span className="glass-badge badge-warning text-xs">+5%</span>
          <TrendingUp className="w-3 h-3 text-warning" />
        </div>
      </div>

      {/* Action Button */}
      <div className="md:col-span-3">
        <button className="glass-button magnetic w-full md:w-auto">
          View Detailed Analytics →
        </button>
      </div>
    </div>
  );
}
```

**Done! You've created a professional glassmorphic dashboard in under 5 minutes.**

---

## 📚 Next Steps

1. **Explore Components** → See `COMPONENT_LIBRARY.md`
2. **Read Design System** → See `DESIGN_SYSTEM.md`
3. **View Examples** → See `DESIGN_SHOWCASE.md`
4. **Build Your UI** → Start with the patterns above

---

## 🆘 Common Issues

### Issue: Glass effect not visible
**Solution**: Make sure parent has a background color or image

### Issue: Dark mode colors wrong
**Solution**: Add `.dark` class to `<html>` element

### Issue: Animations not working
**Solution**: Check user hasn't enabled reduced motion

### Issue: Focus ring not showing
**Solution**: Use keyboard (Tab) not mouse click

---

## 💡 Pro Tips

1. **Combine classes** for powerful effects:
   ```tsx
   className="glass-card lift-hover magnetic p-6"
   ```

2. **Use gradient text** for important headings:
   ```tsx
   className="gradient-text text-4xl font-bold"
   ```

3. **Layer glass effects** for depth:
   ```tsx
   <div className="glass-card">
     <div className="glass-card-subtle">
       Nested glass
     </div>
   </div>
   ```

4. **Add badges** for status indicators:
   ```tsx
   <span className="glass-badge badge-success">Active</span>
   ```

5. **Use consistent spacing** with the 8px grid:
   ```tsx
   className="space-y-4" // 16px gaps
   className="gap-6"     // 24px grid gaps
   ```

---

**You're ready to build stunning, corporate glassmorphic UIs! 🎨**

*For detailed documentation, see the full design system guides.*
