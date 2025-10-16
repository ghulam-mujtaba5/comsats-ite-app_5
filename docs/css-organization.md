# CSS Organization Plan

## Overview
This document outlines how to organize CSS classes in `app/globals.css` into logical groups following the design system.

## Current Structure Analysis
The current `globals.css` file has the following sections:
1. Base styles and resets
2. Mobile-specific fixes
3. Animation keyframes
4. Animation utility classes
5. CSS variables (light/dark mode)
6. Glassmorphism system
7. Legacy glassmorphism aliases
8. Mobile utilities
9. Touch interactions
10. Responsive text
11. CampusAxis brand styles
12. Accessibility features

## Proposed Organization

### 1. Base Styles and Resets
```css
@import "tailwindcss";
@import "tw-animate-css";

/* Base resets and normalizations */
html, body {
  /* ... */
}

* {
  /* ... */
}
```

### 2. Design System Foundation
```css
/* CSS Variables */
:root {
  /* Color variables */
  --background: oklch(1 0 0);
  --foreground: oklch(0.278 0.015 255.85);
  /* ... */
  
  /* Glassmorphism variables */
  --glass-blur-sm: 8px;
  --glass-blur-md: 12px;
  --glass-blur-lg: 16px;
  --glass-blur-xl: 20px;
  --glass-saturation: 150%;
  --glass-brightness: 110%;
  --glass-border-opacity: 0.15;
  --glass-bg-opacity: 0.25;
  --glass-shadow-opacity: 0.10;
}

.dark {
  /* Dark mode overrides */
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... */
  
  /* Dark mode glassmorphism variables */
  --glass-blur-sm: 8px;
  --glass-blur-md: 12px;
  --glass-blur-lg: 16px;
  --glass-blur-xl: 20px;
  --glass-saturation: 140%;
  --glass-brightness: 105%;
  --glass-border-opacity: 0.12;
  --glass-bg-opacity: 0.18;
  --glass-shadow-opacity: 0.20;
}

@layer base {
  /* Base element styles */
  * {
    /* ... */
  }
  
  body {
    /* ... */
  }
}
```

### 3. Animation System
```css
@layer components {
  /* Animation Keyframes */
  @keyframes float { /* ... */ }
  @keyframes pulse-glow { /* ... */ }
  @keyframes shimmer { /* ... */ }
  @keyframes gradient-xy { /* ... */ }
  @keyframes magnetic { /* ... */ }
  @keyframes neon-pulse { /* ... */ }
  @keyframes apple-glass-pulse { /* ... */ }
  @keyframes apple-glass-depth { /* ... */ }
  @keyframes ripple { /* ... */ }
  @keyframes firework { /* ... */ }
  @keyframes ripple-animation { /* ... */ }
  @keyframes fadeIn { /* ... */ }
  @keyframes slideUp { /* ... */ }
  
  /* Animation Utility Classes */
  .animate-ripple { /* ... */ }
  .float { /* ... */ }
  .pulse-glow { /* ... */ }
  .shimmer { /* ... */ }
  .gradient-animation { /* ... */ }
  .magnetic { /* ... */ }
  .neon-text { /* ... */ }
  .apple-glass { /* ... */ }
  .firework { /* ... */ }
  .fade-in { /* ... */ }
  .slide-up { /* ... */ }
  
  /* Animation Timing and Easing */
  .animate-ease-default { /* ... */ }
  .animate-ease-in { /* ... */ }
  .animate-ease-out { /* ... */ }
  .animate-ease-linear { /* ... */ }
  .animate-ease-spring { /* ... */ }
  .animate-ease-bounce { /* ... */ }
  .animate-ease-elastic { /* ... */ }
  
  /* Animation Duration */
  .animate-duration-75 { /* ... */ }
  .animate-duration-100 { /* ... */ }
  .animate-duration-150 { /* ... */ }
  .animate-duration-200 { /* ... */ }
  .animate-duration-300 { /* ... */ }
  .animate-duration-400 { /* ... */ }
  .animate-duration-500 { /* ... */ }
  .animate-duration-700 { /* ... */ }
  .animate-duration-1000 { /* ... */ }
  
  /* Animation Delay */
  .animate-delay-75 { /* ... */ }
  .animate-delay-100 { /* ... */ }
  .animate-delay-150 { /* ... */ }
  .animate-delay-200 { /* ... */ }
  .animate-delay-300 { /* ... */ }
  .animate-delay-400 { /* ... */ }
  .animate-delay-500 { /* ... */ }
  .animate-delay-700 { /* ... */ }
  .animate-delay-1000 { /* ... */ }
  
  /* Animation Fill Mode */
  .animate-fill-none { /* ... */ }
  .animate-fill-forwards { /* ... */ }
  .animate-fill-backwards { /* ... */ }
  .animate-fill-both { /* ... */ }
  
  /* Animation Iteration Count */
  .animate-repeat-1 { /* ... */ }
  .animate-repeat-2 { /* ... */ }
  .animate-repeat-3 { /* ... */ }
  .animate-repeat-infinite { /* ... */ }
  
  /* Animation Direction */
  .animate-direction-normal { /* ... */ }
  .animate-direction-reverse { /* ... */ }
  .animate-direction-alternate { /* ... */ }
  .animate-direction-alternate-reverse { /* ... */ }
  
  /* Animation Play State */
  .animate-running { /* ... */ }
  .animate-paused { /* ... */ }
}
```

### 4. Glassmorphism System
```css
@layer components {
  /* 2025 ADVANCED GLASSMORPHISM SYSTEM */
  
  /* Simplified 4-Class Glass System */
  .glass-primary { /* ... */ }
  .dark .glass-primary { /* ... */ }
  .glass-primary:hover { /* ... */ }
  .dark .glass-primary:hover { /* ... */ }
  
  .glass-secondary { /* ... */ }
  .dark .glass-secondary { /* ... */ }
  .glass-secondary:hover { /* ... */ }
  .dark .glass-secondary:hover { /* ... */ }
  
  .glass-subtle { /* ... */ }
  .dark .glass-subtle { /* ... */ }
  
  .glass-interactive { /* ... */ }
  .dark .glass-interactive { /* ... */ }
  .glass-interactive:hover { /* ... */ }
  .dark .glass-interactive:hover { /* ... */ }
  .glass-interactive:active { /* ... */ }
  
  /* Glass Borders */
  .glass-border-subtle { /* ... */ }
  .dark .glass-border-subtle { /* ... */ }
  
  .glass-border-light { /* ... */ }
  .dark .glass-border-light { /* ... */ }
  
  .glass-border-glow { /* ... */ }
  .dark .glass-border-glow { /* ... */ }
  
  /* Glass Input */
  .glass-input { /* ... */ }
  .dark .glass-input { /* ... */ }
  .glass-input:focus { /* ... */ }
  .dark .glass-input:focus { /* ... */ }
}
```

### 5. Utility Classes
```css
@layer components {
  /* Layout Utilities */
  .app-container { /* ... */ }
  
  /* Interaction Utilities */
  .interactive { /* ... */ }
  .hover-lift:hover { /* ... */ }
  .hover-glow:hover { /* ... */ }
  
  /* Touch Interaction Utilities */
  .touch-interactive { /* ... */ }
  .touch-interactive:active { /* ... */ }
  
  /* Ripple Effect */
  .ripple-container { /* ... */ }
  .ripple { /* ... */ }
  
  /* Scroll Utilities */
  .smooth-scroll { /* ... */ }
  .no-pull-to-refresh { /* ... */ }
  
  /* Performance Utilities */
  .gpu-accelerated { /* ... */ }
}
```

### 6. Responsive Design System
```css
@layer components {
  /* Responsive Text */
  .text-responsive-title { /* ... */ }
  .text-responsive-heading { /* ... */ }
  .text-responsive-body { /* ... */ }
  .text-responsive-caption { /* ... */ }
  
  /* Mobile Navigation */
  .mobile-menu-open { /* ... */ }
  .mobile-nav-trigger { /* ... */ }
  .mobile-nav-overlay { /* ... */ }
  .mobile-nav-content { /* ... */ }
  .mobile-nav-close { /* ... */ }
  
  /* Mobile Utilities */
  @media (max-width: 768px) {
    /* Glassmorphism Mobile Optimizations */
    .glass-primary { /* ... */ }
    .glass-secondary { /* ... */ }
    .glass-subtle { /* ... */ }
    .glass-interactive { /* ... */ }
    .glass-nav { /* ... */ }
    
    /* Layout Constraints */
    .container { /* ... */ }
    .max-w-7xl { /* ... */ }
    .max-w-6xl { /* ... */ }
    .max-w-4xl { /* ... */ }
    .max-w-3xl { /* ... */ }
    .max-w-2xl { /* ... */ }
    
    /* Touch Targets */
    .interactive { /* ... */ }
    .mobile-touch-target { /* ... */ }
    .mobile-btn { /* ... */ }
    .mobile-btn-icon { /* ... */ }
    .mobile-input { /* ... */ }
    .mobile-card { /* ... */ }
    .mobile-card:active { /* ... */ }
    .mobile-nav-item { /* ... */ }
    .mobile-list-item { /* ... */ }
    .mobile-modal { /* ... */ }
    .mobile-dialog { /* ... */ }
    .mobile-tab { /* ... */ }
    .mobile-avatar { /* ... */ }
    .mobile-badge { /* ... */ }
  }
}
```

### 7. CampusAxis Brand System
```css
@layer components {
  /* CAMPUSAXIS MASTER STANDARDS (2025) */
  
  /* Brand Colors */
  :root {
    --campus-primary-light: #007BFF;
    --campus-primary-dark: #1F8FFF;
    /* ... */
  }
  
  .dark {
    --campus-primary: var(--campus-primary-dark);
    /* ... */
  }
  
  :root:not(.dark) {
    --campus-primary: var(--campus-primary-light);
    /* ... */
  }
  
  /* Touch Targets */
  .touch-target { /* ... */ }
  .touch-target-comfortable { /* ... */ }
  .touch-target-large { /* ... */ }
  
  /* CampusAxis Glassmorphism */
  .campus-glass { /* ... */ }
  .dark .campus-glass { /* ... */ }
  .campus-glass:hover { /* ... */ }
  .dark .campus-glass:hover { /* ... */ }
  
  /* Spacing System */
  .space-xs { /* ... */ }
  .space-sm { /* ... */ }
  .space-md { /* ... */ }
  .space-lg { /* ... */ }
  .space-xl { /* ... */ }
  .space-2xl { /* ... */ }
  .space-3xl { /* ... */ }
  
  /* Content Width */
  .prose-optimal { /* ... */ }
  .prose-min { /* ... */ }
  .prose-max { /* ... */ }
  
  /* Button Styles */
  .campus-button-primary { /* ... */ }
  .campus-button-primary:hover { /* ... */ }
  .dark .campus-button-primary { /* ... */ }
  .dark .campus-button-primary:hover { /* ... */ }
  
  /* Typography */
  .text-campus-h1 { /* ... */ }
  .text-campus-h2 { /* ... */ }
  .text-campus-h3 { /* ... */ }
  .text-campus-body { /* ... */ }
  
  /* Glow Effects */
  .dark .campus-glow { /* ... */ }
  .dark .campus-glow:hover { /* ... */ }
  
  /* Loading States */
  .campus-skeleton { /* ... */ }
}
```

### 8. Accessibility System
```css
@layer components {
  /* Focus Rings */
  .focus-ring-campus { /* ... */ }
  .focus-ring-campus:focus-visible { /* ... */ }
  
  :focus-visible { /* ... */ }
  
  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      /* ... */
    }
    
    /* Reduce glass effects */
    .glass-floating,
    .glass-depth,
    .glass-layered,
    .glass-gradient,
    .glass-hover-glow,
    .glass-shimmer {
      /* ... */
    }
    
    .glass-floating::before,
    .glass-depth::before,
    .glass-layered::before,
    .glass-layered::after {
      /* ... */
    }
  }
  
  /* High Contrast Mode */
  @media (prefers-contrast: high) {
    .glass-subtle,
    .glass-light,
    .glass-medium,
    .glass-strong,
    .glass-premium,
    .glass-ultra {
      /* ... */
    }
    
    .glass-card,
    .glass-card-premium,
    .glass-nav,
    .glass-modal,
    .glass-hero {
      /* ... */
    }
    
    .glass-button {
      /* ... */
    }
  }
  
  /* Smooth Scroll */
  html {
    scroll-behavior: smooth;
  }
  
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
  }
}
```

## Benefits of This Organization

1. **Clear Separation of Concerns**: Each section has a specific purpose
2. **Easier Maintenance**: Related styles are grouped together
3. **Better Discoverability**: Developers can find what they need more easily
4. **Consistent Structure**: Follows a logical flow from foundation to specific components
5. **Design System Alignment**: Groups follow the design system principles
6. **Scalability**: Easy to add new sections as the system grows

## Implementation Steps

1. Backup the current `globals.css` file
2. Reorganize sections according to this structure
3. Remove duplicate or overlapping declarations
4. Ensure all existing functionality is preserved
5. Test all components to verify no regressions
6. Update documentation to reflect the new organization