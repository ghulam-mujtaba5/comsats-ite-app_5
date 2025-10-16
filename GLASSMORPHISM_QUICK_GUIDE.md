# Glassmorphism Quick Reference Guide

## 🎯 When to Use Each Class

### `.glass-primary` - **High Emphasis**
```tsx
// Hero sections
<section className="glass-primary p-12">
  <h1>Welcome to COMSATS</h1>
</section>

// Major CTAs
<button className="glass-primary px-8 py-4">
  Get Started
</button>

// Important modals
<div className="glass-primary p-6 rounded-xl">
  <h2>Confirm Action</h2>
</div>
```

### `.glass-secondary` - **Medium Emphasis**
```tsx
// Feature cards
<div className="glass-secondary p-6 rounded-lg">
  <h3>Past Papers</h3>
  <p>Access resources</p>
</div>

// Content sections
<article className="glass-secondary p-8">
  <p>Article content...</p>
</article>

// List items
<li className="glass-secondary p-4">
  <span>Item text</span>
</li>
```

### `.glass-subtle` - **Low Emphasis**
```tsx
// Background overlays
<div className="glass-subtle fixed inset-0" />

// Subtle dividers
<hr className="glass-subtle h-px" />

// Supporting elements
<aside className="glass-subtle p-4">
  <small>Helper text</small>
</aside>
```

### `.glass-interactive` - **Hover & Click**
```tsx
// Clickable cards
<div 
  className="glass-interactive p-6 rounded-lg"
  onClick={handleClick}
>
  <h3>Click me!</h3>
</div>

// Links with glass effect
<a 
  href="/faculty" 
  className="glass-interactive px-6 py-3 rounded-lg"
>
  View Faculty
</a>

// Custom buttons
<button className="glass-interactive px-4 py-2">
  Submit
</button>
```

---

## 🚫 What NOT to Do

### ❌ Don't Mix Multiple Glass Classes
```tsx
// BAD - Conflicting effects
<div className="glass-primary glass-secondary">

// GOOD - Use one class
<div className="glass-primary">
```

### ❌ Don't Use Legacy Classes for New Code
```tsx
// BAD - Old system
<div className="glass-premium glass-ultra">

// GOOD - New system
<div className="glass-primary">
```

### ❌ Don't Nest Glass Effects Deeply
```tsx
// BAD - Performance issue
<div className="glass-primary">
  <div className="glass-secondary">
    <div className="glass-subtle">
      <p>Too many layers!</p>
    </div>
  </div>
</div>

// GOOD - Flat structure
<div className="glass-primary p-6">
  <p>Simple and fast!</p>
</div>
```

---

## 📱 Mobile Best Practices

The system automatically reduces blur on mobile for 60fps performance. No extra code needed!

```tsx
// Desktop: 16px blur
// Mobile: 10px blur (automatic)
<div className="glass-primary">
  Works great everywhere!
</div>
```

---

## 🎨 Combining with Tailwind

Glass classes work perfectly with Tailwind utilities:

```tsx
<div className="glass-secondary p-6 rounded-xl shadow-lg hover:shadow-2xl">
  <h3 className="text-2xl font-bold mb-4">Faculty Review</h3>
  <p className="text-gray-700">Add your review...</p>
</div>
```

---

## 🌙 Dark Mode Support

All glass classes automatically adapt to dark mode:

```tsx
// Light mode: white glass
// Dark mode: dark glass (automatic)
<div className="glass-primary p-8">
  <h2>Works in both themes!</h2>
</div>
```

---

## 🔄 Migration from Old Classes

| Old Class | New Class | Notes |
|-----------|-----------|-------|
| `.glass-light` | `.glass-subtle` | Use for backgrounds |
| `.glass-medium` | `.glass-secondary` | Use for cards |
| `.glass-strong` | `.glass-primary` | Use for emphasis |
| `.glass-premium` | `.glass-primary` | Merged into primary |
| `.glass-ultra` | `.glass-primary` | Merged into primary |
| `.glass-card` | `.glass-secondary` | Standard cards |
| `.glass-card-premium` | `.glass-primary` | Important cards |
| `.glass-hero` | `.glass-primary` | Hero sections |
| `.glass-button` | `.glass-interactive` | All buttons |
| `.glass-hover` | `.glass-interactive` | Clickable items |

---

## ⚡ Performance Tips

### 1. Limit Glass Layers
```tsx
// ✅ GOOD - 1 glass layer
<div className="glass-primary p-6">
  <h2>Title</h2>
  <p>Content</p>
</div>

// ❌ BAD - Multiple layers
<div className="glass-primary">
  <div className="glass-secondary">
    <div className="glass-subtle">
```

### 2. Use Subtle for Backgrounds
```tsx
// ✅ GOOD - Light blur for backgrounds
<div className="glass-subtle fixed inset-0 -z-10" />

// ❌ BAD - Heavy blur wastes GPU
<div className="glass-primary fixed inset-0 -z-10" />
```

### 3. Avoid Glass on Small Elements
```tsx
// ✅ GOOD - Glass on containers
<div className="glass-secondary p-6">
  <span className="text-sm">Small text</span>
</div>

// ❌ BAD - Glass on tiny elements
<span className="glass-secondary text-sm">Text</span>
```

---

## 🎯 Visual Hierarchy Rules

Follow the 60-30-10 rule:

- **60%** of your UI → `.glass-subtle` (backgrounds)
- **30%** of your UI → `.glass-secondary` (content cards)
- **10%** of your UI → `.glass-primary` (important CTAs)

Example layout:
```tsx
<main className="min-h-screen relative">
  {/* 60% - Background */}
  <div className="glass-subtle fixed inset-0 -z-10" />
  
  <div className="container mx-auto p-8">
    {/* 10% - Hero CTA */}
    <section className="glass-primary p-12 mb-8 rounded-2xl">
      <h1>Welcome</h1>
      <button className="glass-interactive px-8 py-4">Start</button>
    </section>
    
    {/* 30% - Content Cards */}
    <div className="grid grid-cols-3 gap-6">
      <div className="glass-secondary p-6 rounded-lg">Card 1</div>
      <div className="glass-secondary p-6 rounded-lg">Card 2</div>
      <div className="glass-secondary p-6 rounded-lg">Card 3</div>
    </div>
  </div>
</main>
```

---

## ♿ Accessibility Checklist

- ✅ All glass classes meet WCAG AA contrast (4.5:1 minimum)
- ✅ Interactive elements have clear hover states
- ✅ Focus indicators visible on all `.glass-interactive` elements
- ✅ Text remains readable on all backgrounds
- ✅ Dark mode maintains contrast ratios

---

## 🐛 Troubleshooting

### Issue: Glass effect not visible
```tsx
// ❌ Missing backdrop
<div className="glass-primary">

// ✅ Add colored background behind glass
<div className="bg-gradient-to-br from-blue-500 to-purple-600 min-h-screen">
  <div className="glass-primary p-6">
    Now visible!
  </div>
</div>
```

### Issue: Performance issues on mobile
```tsx
// ❌ Too many nested glass effects
<div className="glass-primary">
  <div className="glass-secondary">
    <div className="glass-subtle">

// ✅ Flatten structure
<div className="glass-primary p-6">
  <div>Content</div>
</div>
```

### Issue: Text hard to read
```tsx
// ❌ Light text on light glass
<div className="glass-subtle">
  <p className="text-white">Hard to read</p>
</div>

// ✅ Increase glass opacity or adjust text color
<div className="glass-primary">
  <p className="text-gray-900 dark:text-white">Easy to read</p>
</div>
```

---

## 📚 Examples by Use Case

### Homepage Hero
```tsx
<section className="min-h-screen relative flex items-center justify-center">
  <div className="glass-subtle fixed inset-0 -z-10" />
  
  <div className="glass-primary p-12 rounded-3xl max-w-4xl">
    <h1 className="text-5xl font-bold mb-6">COMSATS ITE Platform</h1>
    <p className="text-xl mb-8">Your academic companion</p>
    
    <div className="flex gap-4">
      <button className="glass-interactive px-8 py-4 rounded-xl">
        Get Started
      </button>
      <button className="glass-secondary px-8 py-4 rounded-xl">
        Learn More
      </button>
    </div>
  </div>
</section>
```

### Feature Cards Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
  {features.map((feature) => (
    <div 
      key={feature.id}
      className="glass-secondary p-6 rounded-xl hover:glass-interactive transition-all"
    >
      <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
      <p className="text-gray-700 dark:text-gray-300">{feature.desc}</p>
    </div>
  ))}
</div>
```

### Navigation Bar
```tsx
<nav className="glass-primary border-b sticky top-0 z-50">
  <div className="container mx-auto px-6 py-4 flex justify-between items-center">
    <Logo />
    
    <div className="flex gap-6">
      <a href="/community" className="glass-interactive px-4 py-2 rounded-lg">
        Community
      </a>
      <a href="/faculty" className="glass-interactive px-4 py-2 rounded-lg">
        Faculty
      </a>
    </div>
  </div>
</nav>
```

### Modal Dialog
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  {/* Backdrop */}
  <div className="glass-subtle fixed inset-0" onClick={onClose} />
  
  {/* Modal */}
  <div className="glass-primary p-8 rounded-2xl max-w-md relative z-10">
    <h2 className="text-2xl font-bold mb-4">Confirm Action</h2>
    <p className="mb-6">Are you sure you want to proceed?</p>
    
    <div className="flex gap-4">
      <button className="glass-interactive px-6 py-3 rounded-lg">
        Confirm
      </button>
      <button className="glass-subtle px-6 py-3 rounded-lg" onClick={onClose}>
        Cancel
      </button>
    </div>
  </div>
</div>
```

---

## 🎨 Color Combinations

Glass effects work best with these backgrounds:

```tsx
// ✅ Gradient backgrounds
<div className="bg-gradient-to-br from-blue-500 to-purple-600">
  <div className="glass-primary">Perfect!</div>
</div>

// ✅ Image backgrounds
<div className="bg-[url('/hero-bg.jpg')] bg-cover">
  <div className="glass-secondary">Great!</div>
</div>

// ✅ Solid colors with opacity
<div className="bg-blue-500/20">
  <div className="glass-subtle">Nice!</div>
</div>

// ❌ Plain white backgrounds
<div className="bg-white">
  <div className="glass-primary">Hard to see</div>
</div>
```

---

## 🚀 Quick Start Template

Copy this starter template for new pages:

```tsx
import React from 'react';

export default function NewPage() {
  return (
    <main className="min-h-screen relative">
      {/* Background */}
      <div className="glass-subtle fixed inset-0 -z-10" />
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 fixed inset-0 -z-20" />
      
      <div className="container mx-auto p-8">
        {/* Hero Section - Primary emphasis */}
        <section className="glass-primary p-12 rounded-3xl mb-8">
          <h1 className="text-4xl font-bold mb-4">Page Title</h1>
          <p className="text-xl mb-6">Page description</p>
          <button className="glass-interactive px-8 py-4 rounded-xl">
            Primary Action
          </button>
        </section>
        
        {/* Content Grid - Secondary emphasis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-secondary p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-2">Card 1</h3>
            <p>Content here</p>
          </div>
          <div className="glass-secondary p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-2">Card 2</h3>
            <p>Content here</p>
          </div>
          <div className="glass-secondary p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-2">Card 3</h3>
            <p>Content here</p>
          </div>
        </div>
      </div>
    </main>
  );
}
```

---

## 📖 Summary

- **4 Classes**: primary, secondary, subtle, interactive
- **3 Levels**: High, Medium, Low emphasis
- **60-30-10 Rule**: Balance your visual hierarchy
- **Mobile Optimized**: Automatic blur reduction
- **WCAG AA**: Accessible contrast ratios
- **Zero Breaking Changes**: Legacy classes still work

**Need help?** Check [GLASSMORPHISM_FINAL_IMPLEMENTATION.md](./GLASSMORPHISM_FINAL_IMPLEMENTATION.md) for detailed documentation.
