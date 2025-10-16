# 🎨 CampusAxis Design System

## Corporate Glassmorphic UI Framework

> A premium, accessible, and performance-optimized design system inspired by Vercel, Notion, and Apple's design language.

---

## 📋 Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Components](#components)
6. [Animations](#animations)
7. [Accessibility](#accessibility)
8. [Usage Examples](#usage-examples)

---

## 🎯 Design Philosophy

### Core Principles

1. **Simplicity & Hierarchy** — Every pixel serves a purpose
2. **Glassmorphism** — Frosted glass effects with depth and clarity
3. **Performance First** — Optimized animations and lightweight assets
4. **Accessibility** — WCAG 2.1 AA compliant
5. **Corporate Elegance** — Professional, trustworthy, innovative

### Visual Language

- **Primary Feel**: Transparent, polished, intelligent
- **Mood**: Trustworthy, innovative, academic, tech-forward
- **Tone**: Professional, youthful, empowering

---

## 🌈 Color Palette

### Light Mode

#### Brand Colors
```css
Primary (Electric Blue): #4A90E2 - hsl(217, 91%, 60%)
Secondary (Mint Teal): #7ED6DF - hsl(187, 64%, 67%)
Accent (Violet Glow): #8B5CF6 - hsl(258, 90%, 66%)
```

#### Semantic Colors
```css
Success: hsl(142, 76%, 36%) - Professional Green
Warning: hsl(38, 92%, 50%) - Attention Amber
Info: hsl(199, 89%, 48%) - Informative Cyan
Error: hsl(0, 84%, 60%) - Clear Red
```

#### Neutrals
```css
Background: hsl(0, 0%, 100%) - Pure White
Foreground: hsl(222, 47%, 11%) - Deep Slate
Muted: hsl(220, 13%, 96%) - Light Gray
Border: hsl(220, 13%, 91%) - Subtle Border
```

### Dark Mode

#### Brand Colors (Enhanced)
```css
Primary: hsl(217, 91%, 65%) - Brighter Blue
Secondary: hsl(187, 80%, 72%) - Neon Teal
Accent: hsl(258, 90%, 70%) - Vibrant Violet
```

#### Neutrals
```css
Background: hsl(222, 47%, 8%) - Deep Charcoal
Foreground: hsl(210, 40%, 98%) - Soft White
Muted: hsl(217, 33%, 17%) - Dark Gray
Border: hsl(217, 33%, 17%) - Subtle Dark Border
```

### Gradients

```css
--gradient-primary: linear-gradient(135deg, #4A90E2 0%, #7ED6DF 100%);
--gradient-secondary: linear-gradient(135deg, #7ED6DF 0%, #8B5CF6 100%);
--gradient-accent: linear-gradient(135deg, #8B5CF6 0%, #4A90E2 100%);
```

---

## 🔤 Typography

### Font Stack

**Primary**: Inter, SF Pro Display, -apple-system, system-ui  
**Fallback**: BlinkMacSystemFont, "Segoe UI", sans-serif

### Type Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| H1 | 32px (2rem) | 700 | 1.25 | Page titles |
| H2 | 24px (1.5rem) | 600 | 1.25 | Section headers |
| H3 | 20px (1.25rem) | 600 | 1.5 | Subsection headers |
| Body | 16px (1rem) | 400 | 1.5 | Main content |
| Small | 14px (0.875rem) | 400 | 1.5 | Secondary text |
| Caption | 12px (0.75rem) | 400 | 1.5 | Metadata, labels |

### CSS Variables

```css
--font-size-xs: 0.75rem;   /* 12px */
--font-size-sm: 0.875rem;  /* 14px */
--font-size-base: 1rem;    /* 16px */
--font-size-lg: 1.125rem;  /* 18px */
--font-size-xl: 1.25rem;   /* 20px */
--font-size-2xl: 1.5rem;   /* 24px */
--font-size-3xl: 2rem;     /* 32px */
```

---

## 📏 Spacing System

### 8px Base Grid

All spacing follows an 8px base grid for consistency:

```css
--spacing-xs: 4px    (0.25rem)
--spacing-sm: 8px    (0.5rem)
--spacing-md: 16px   (1rem)
--spacing-lg: 24px   (1.5rem)
--spacing-xl: 32px   (2rem)
--spacing-2xl: 48px  (3rem)
--spacing-3xl: 64px  (4rem)
```

### Border Radius

```css
--radius-sm: 6px     Buttons, inputs
--radius: 8px        Cards, default
--radius-md: 12px    Modals, dropdowns
--radius-lg: 16px    Large cards
--radius-xl: 24px    Hero sections
--radius-full: 9999px Pills, badges
```

---

## 🧩 Components

### Glass Card

**Usage**: Primary content container with frosted glass effect

```html
<div class="glass-card">
  <h3>Card Title</h3>
  <p>Card content with glassmorphic background</p>
</div>
```

**Variants**:
- `.glass-card` — Default (medium blur)
- `.glass-card-subtle` — Light glass effect
- `.glass-card-heavy` — Strong glass effect

### Glass Button

**Usage**: Primary action buttons with gradient and glass effect

```html
<button class="glass-button">Primary Action</button>
<button class="glass-button-secondary">Secondary</button>
<button class="glass-button-outline">Outline</button>
<button class="glass-button-ghost">Ghost</button>
```

### Glass Input

**Usage**: Form input fields with glass styling

```html
<input 
  type="text" 
  class="glass-input" 
  placeholder="Enter text..."
/>
```

### Glass Badge

**Usage**: Status indicators and labels

```html
<span class="glass-badge badge-success">Active</span>
<span class="glass-badge badge-warning">Pending</span>
<span class="glass-badge badge-info">Info</span>
<span class="glass-badge badge-error">Error</span>
```

### Navigation Components

```html
<!-- Glass Navigation Bar -->
<nav class="glass-nav">
  <!-- Nav content -->
</nav>

<!-- Glass Sidebar -->
<aside class="glass-sidebar">
  <!-- Sidebar content -->
</aside>
```

### Modal/Dialog

```html
<div class="glass-modal">
  <!-- Modal content -->
</div>
```

---

## ✨ Animations & Interactions

### Micro-Interactions

```html
<!-- Magnetic hover effect -->
<button class="magnetic">Hover Me</button>

<!-- Lift on hover -->
<div class="lift-hover glass-card">Lifts on hover</div>

<!-- Scale on hover -->
<div class="scale-hover">Scales slightly</div>

<!-- Glow effects -->
<div class="glow-primary">Primary glow</div>
<div class="glow-secondary">Secondary glow</div>
<div class="hover-glow">Glows on hover</div>
```

### Loading States

```html
<!-- Shimmer loading skeleton -->
<div class="shimmer-loading" style="height: 100px; width: 100%;"></div>

<!-- Pulse animation -->
<div class="pulse">Pulsing element</div>
```

### Entrance Animations

```html
<!-- Fade in -->
<div class="fade-in">Fades in on mount</div>

<!-- Slide up -->
<div class="slide-up">Slides up on mount</div>

<!-- Bounce -->
<div class="bounce">Bouncing element</div>
```

### Transition Speeds

```css
--transition-fast: 150ms   /* Quick interactions */
--transition-base: 250ms   /* Standard transitions */
--transition-slow: 350ms   /* Smooth, noticeable */
--transition-bounce: 500ms /* Playful bounce effect */
```

---

## ♿ Accessibility

### Focus States

All interactive elements have visible focus indicators for keyboard navigation:

```css
*:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
```

### Skip to Main Content

```html
<a href="#main-content" class="skip-to-main">
  Skip to main content
</a>
```

### High Contrast Mode

Automatically increases border thickness in high contrast mode:

```css
@media (prefers-contrast: high) {
  .glass-card, .glass-button {
    border-width: 2px;
  }
}
```

### Reduced Motion

Respects user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Color Contrast

All color combinations meet **WCAG 2.1 AA** standards:
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- Interactive elements: 3:1 contrast ratio

---

## 💡 Usage Examples

### Dashboard Card

```html
<div class="glass-card lift-hover p-6">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-xl font-semibold">Active Projects</h3>
    <span class="glass-badge badge-success">12 Active</span>
  </div>
  <p class="text-muted-foreground mb-4">
    View and manage your ongoing projects
  </p>
  <button class="glass-button w-full">
    View All Projects
  </button>
</div>
```

### Login Form

```html
<div class="glass-modal max-w-md mx-auto p-8">
  <h2 class="text-2xl font-bold mb-6 gradient-text">
    Welcome to CampusAxis
  </h2>
  
  <form class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-2">Email</label>
      <input 
        type="email" 
        class="glass-input w-full" 
        placeholder="your@email.com"
      />
    </div>
    
    <div>
      <label class="block text-sm font-medium mb-2">Password</label>
      <input 
        type="password" 
        class="glass-input w-full" 
        placeholder="••••••••"
      />
    </div>
    
    <button class="glass-button w-full magnetic">
      Sign In
    </button>
    
    <button class="glass-button-ghost w-full">
      Create Account
    </button>
  </form>
</div>
```

### Navigation Bar

```html
<nav class="glass-nav px-6 py-4">
  <div class="flex items-center justify-between max-w-7xl mx-auto">
    <div class="flex items-center space-x-8">
      <img src="/logo.svg" alt="CampusAxis" class="h-10" />
      
      <div class="hide-mobile flex space-x-6">
        <a href="/dashboard" class="hover-glow">Dashboard</a>
        <a href="/projects" class="hover-glow">Projects</a>
        <a href="/community" class="hover-glow">Community</a>
      </div>
    </div>
    
    <div class="flex items-center space-x-4">
      <button class="glass-button-ghost magnetic">
        <svg><!-- Search icon --></svg>
      </button>
      
      <button class="glass-button">
        Create Project
      </button>
      
      <div class="glass-badge badge-info">3</div>
    </div>
  </div>
</nav>
```

### Data Visualization Card

```html
<div class="glass-card p-6">
  <div class="flex items-center justify-between mb-6">
    <h3 class="text-xl font-semibold">Performance Metrics</h3>
    <select class="glass-input">
      <option>Last 7 days</option>
      <option>Last 30 days</option>
    </select>
  </div>
  
  <div class="grid grid-cols-3 gap-4 mb-6">
    <div class="glass-card-subtle p-4">
      <p class="text-sm text-muted-foreground">Total Views</p>
      <p class="text-2xl font-bold gradient-text">12.4K</p>
      <span class="glass-badge badge-success text-xs">+12%</span>
    </div>
    
    <div class="glass-card-subtle p-4">
      <p class="text-sm text-muted-foreground">Engagement</p>
      <p class="text-2xl font-bold gradient-text">8.2K</p>
      <span class="glass-badge badge-warning text-xs">+5%</span>
    </div>
    
    <div class="glass-card-subtle p-4">
      <p class="text-sm text-muted-foreground">Conversions</p>
      <p class="text-2xl font-bold gradient-text">342</p>
      <span class="glass-badge badge-info text-xs">+8%</span>
    </div>
  </div>
  
  <!-- Chart component would go here -->
</div>
```

---

## 🎯 Design Checklist

### Layout
- [x] 12-column responsive grid system
- [x] 8px base spacing grid
- [x] Consistent padding and margins
- [x] Mobile-first responsive breakpoints

### Color System
- [x] 3 core brand colors (Primary, Secondary, Accent)
- [x] 4 semantic colors (Success, Warning, Info, Error)
- [x] Dark mode variants for all colors
- [x] Gradient overlays for premium feel

### Typography
- [x] Font scale documented (6 sizes)
- [x] Weight variations (Regular, Medium, Semibold, Bold)
- [x] Optimal line heights (1.25–1.75)
- [x] High legibility and readability

### Components
- [x] Glass cards with variants
- [x] Button system (Primary, Secondary, Outline, Ghost)
- [x] Form inputs with focus states
- [x] Navigation components
- [x] Badges and status indicators
- [x] Modals and dialogs

### Animations
- [x] Micro-interactions (hover, active, focus)
- [x] Loading states (shimmer, pulse)
- [x] Entrance animations (fade, slide, bounce)
- [x] Performance-optimized transitions

### Accessibility
- [x] WCAG 2.1 AA compliant contrast ratios
- [x] Keyboard navigation support
- [x] Focus visible indicators
- [x] Screen reader friendly
- [x] Reduced motion support
- [x] High contrast mode support

### Performance
- [x] SVG icons only
- [x] Optimized animations (GPU-accelerated)
- [x] Lazy loading for images
- [x] Minimal CSS bundle size

### Branding
- [x] CampusAxis identity maintained
- [x] Academic + AI fusion aesthetic
- [x] Corporate professionalism
- [x] Trustworthy and innovative feel

---

## 🚀 Getting Started

### 1. Import Styles

The design system is automatically included in your Next.js app through `globals.css`.

### 2. Use Components

Simply add the appropriate class names to your HTML elements:

```html
<div class="glass-card">Your content</div>
```

### 3. Customize

Override CSS variables in your component-level styles:

```css
.custom-element {
  --glass-blur-md: blur(16px);
  --glass-bg-medium: rgba(255, 255, 255, 0.4);
}
```

### 4. Dark Mode

Dark mode is handled automatically via the `.dark` class on the root element.

---

## 📚 Resources

- **Inspiration**: Vercel, Notion, Apple Design System
- **Colors**: Generated with OKLCH color space for perceptual uniformity
- **Typography**: Based on modular scale (1.25 ratio)
- **Accessibility**: WCAG 2.1 Guidelines
- **Animations**: CSS Performance Best Practices

---

## 🎨 Brand Assets

### Logo Usage
- Minimum size: 32px height
- Clear space: 16px on all sides
- Light background: Full color logo
- Dark background: White or gradient logo

### Color Applications
- **Primary Blue**: Trust, professionalism, academic
- **Mint Teal**: Innovation, freshness, AI
- **Violet**: Premium, creativity, technology

---

**Built with ❤️ for CampusAxis**  
*Empowering students, universities, and clients through intelligent design*
