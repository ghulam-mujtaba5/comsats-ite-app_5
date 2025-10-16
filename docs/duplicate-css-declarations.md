# Duplicate and Overlapping CSS Declarations

## Overview
This document identifies duplicate and overlapping CSS declarations in `app/globals.css` that can be consolidated for better maintainability and performance.

## Animation Classes

### Timing and Easing
Multiple classes define similar timing and easing functions:

1. `.animate-ease-default` - `cubic-bezier(0.4, 0, 0.2, 1)`
2. `.animate-ease-in` - `cubic-bezier(0.4, 0, 1, 1)`
3. `.animate-ease-out` - `cubic-bezier(0, 0, 0.2, 1)`
4. `.animate-ease-linear` - `linear`
5. `.animate-ease-spring` - `cubic-bezier(0.175, 0.885, 0.32, 1.1)`
6. `.animate-ease-bounce` - `cubic-bezier(0.68, -0.55, 0.265, 1.55)`
7. `.animate-ease-elastic` - `cubic-bezier(0.68, -0.55, 0.265, 1.55)`

**Issue**: `.animate-ease-bounce` and `.animate-ease-elastic` have identical values.

### Duration Classes
Multiple duration classes with incremental values:

1. `.animate-duration-75` - `75ms`
2. `.animate-duration-100` - `100ms`
3. `.animate-duration-150` - `150ms`
4. `.animate-duration-200` - `200ms`
5. `.animate-duration-300` - `300ms`
6. `.animate-duration-400` - `400ms`
7. `.animate-duration-500` - `500ms`
8. `.animate-duration-700` - `700ms`
9. `.animate-duration-1000` - `1000ms`

**Issue**: These could be consolidated into a more flexible system.

### Delay Classes
Multiple delay classes with incremental values:

1. `.animate-delay-75` - `75ms`
2. `.animate-delay-100` - `100ms`
3. `.animate-delay-150` - `150ms`
4. `.animate-delay-200` - `200ms`
5. `.animate-delay-300` - `300ms`
6. `.animate-delay-400` - `400ms`
7. `.animate-delay-500` - `500ms`
8. `.animate-delay-700` - `700ms`
9. `.animate-delay-1000` - `1000ms`

**Issue**: These could be consolidated into a more flexible system.

## Glassmorphism Classes

### Primary Glass
The `.glass-primary` class has both light and dark mode variants with similar structures:

```css
.glass-primary {
  background-color: rgb(255 255 255 / 0.3);
  backdrop-filter: blur(var(--glass-blur-lg)) saturate(var(--glass-saturation)) brightness(var(--glass-brightness));
  border: 1px solid rgb(255 255 255 / var(--glass-border-opacity));
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / var(--glass-shadow-opacity));
  transition: all 300ms cubic-bezier(0, 0, 0.2, 1);
}

.dark .glass-primary {
  background-color: rgb(255 255 255 / 0.15);
  border-color: rgb(255 255 255 / 0.12);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.2);
}
```

### Secondary Glass
The `.glass-secondary` class has similar structure:

```css
.glass-secondary {
  background-color: rgb(255 255 255 / 0.25);
  backdrop-filter: blur(var(--glass-blur-md)) saturate(var(--glass-saturation));
  border: 1px solid rgb(255 255 255 / calc(var(--glass-border-opacity) * 0.8));
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / calc(var(--glass-shadow-opacity) * 0.8));
  transition: all 300ms cubic-bezier(0, 0, 0.2, 1);
}

.dark .glass-secondary {
  background-color: rgb(255 255 255 / 0.1);
  border-color: rgb(255 255 255 / 0.08);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.15);
}
```

**Issue**: These could be generated programmatically rather than defined statically.

## Mobile Utility Classes

### Touch Target Classes
Multiple touch target classes with similar purposes:

1. `.touch-target` - `min-height: 44px; min-width: 44px;`
2. `.touch-target-comfortable` - `min-height: 48px; min-width: 48px;`
3. `.touch-target-large` - `min-height: 56px; min-width: 56px;`

**Issue**: These could be consolidated into a more flexible system.

### Mobile Component Classes
Multiple mobile-specific classes for different components:

1. `.mobile-btn` - Button-specific mobile styles
2. `.mobile-btn-icon` - Icon button-specific mobile styles
3. `.mobile-input` - Input-specific mobile styles
4. `.mobile-card` - Card-specific mobile styles
5. `.mobile-nav-item` - Navigation item-specific mobile styles
6. `.mobile-list-item` - List item-specific mobile styles
7. `.mobile-modal` - Modal-specific mobile styles
8. `.mobile-dialog` - Dialog-specific mobile styles
9. `.mobile-tab` - Tab-specific mobile styles
10. `.mobile-avatar` - Avatar-specific mobile styles
11. `.mobile-badge` - Badge-specific mobile styles

**Issue**: These could be consolidated or generated programmatically.

## Responsive Text Classes

### Text Size Classes
Multiple responsive text classes with similar structures:

1. `.text-responsive-title`
2. `.text-responsive-heading`
3. `.text-responsive-body`
4. `.text-responsive-caption`

Each has the same media query structure but different base values.

**Issue**: These could be generated programmatically.

## CampusAxis Classes

### Brand Color Classes
Multiple brand color classes with similar structures:

1. `:root` - Light mode variables
2. `.dark` - Dark mode variables
3. `:root:not(.dark)` - Light mode fallback

**Issue**: These could be simplified.

### Button Classes
Multiple button classes with similar structures:

1. `.campus-button-primary`
2. `.dark .campus-button-primary`
3. `.campus-button-primary:hover`
4. `.dark .campus-button-primary:hover`

**Issue**: These could be consolidated.

## Accessibility Classes

### Focus Ring Classes
Multiple focus ring classes with similar purposes:

1. `:focus-visible` - General focus ring
2. `.focus-ring-campus` - Campus-specific focus ring
3. `.focus-ring-campus:focus-visible` - Campus-specific focus ring enhancement

**Issue**: These could be consolidated.

## Recommendations

### 1. Consolidate Animation Classes
Create a more flexible system using CSS custom properties:

```css
.animate-ease-[value] {
  transition-timing-function: var(--ease-[value]);
}

.animate-duration-[value] {
  transition-duration: var(--duration-[value]);
}

.animate-delay-[value] {
  animation-delay: var(--delay-[value]);
}
```

### 2. Generate Glass Classes Programmatically
Use CSS custom properties to generate glass classes dynamically rather than defining each statically.

### 3. Consolidate Mobile Utilities
Create a more flexible mobile utility system:

```css
.mobile-[component] {
  /* Base mobile styles */
}

@media (max-width: 768px) {
  .mobile-[component] {
    /* Enhanced mobile styles */
  }
}
```

### 4. Consolidate Responsive Text
Create a more flexible responsive text system using CSS custom properties.

### 5. Simplify CampusAxis Classes
Consolidate brand color and component classes into a more maintainable system.