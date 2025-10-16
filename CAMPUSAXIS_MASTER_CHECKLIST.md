# ✅ CAMPUSAXIS UI/UX MASTER CHECKLIST

**Version:** 2025.1.0  
**Based On:** Material 3 + Glassmorphism + Apple HIG + PWA Standards  
**Date:** October 16, 2025

---

## 📋 TABLE OF CONTENTS

1. [Color, Contrast & Visual Hierarchy](#1-color-contrast--visual-hierarchy)
2. [Layout & Spacing](#2-layout--spacing)
3. [Mobile-First Responsiveness](#3-mobile-first-responsiveness)
4. [Performance & Lightness](#4-performance--lightness)
5. [Usability & Interaction](#5-usability--interaction)
6. [Accessibility (A11y) & Inclusivity](#6-accessibility-a11y--inclusivity)
7. [Glassmorphism & Aesthetic Guidelines](#7-glassmorphism--aesthetic-guidelines)
8. [Progressive Web App (PWA) Standards](#8-progressive-web-app-pwa-standards)
9. [Consistency & Components](#9-consistency--components)
10. [Content & Visual Clarity](#10-content--visual-clarity)
11. [Testing & Validation](#11-testing--validation)
12. [CampusAxis Branding Standards](#12-campusaxis-branding-standards)

---

## 🎨 1. Color, Contrast & Visual Hierarchy

### ✅ Checklist

- [ ] **Primary color consistent**
  - Light mode: White/blue-glass (#FFFFFF + rgba(255,255,255,0.7) + #007BFF)
  - Dark mode: Black/blue-glass (#000000 + rgba(255,255,255,0.05) + #1F8FFF)

- [ ] **Text contrast meets WCAG AA** (minimum 4.5:1 ratio)
  - Light mode text: #111827 on #FFFFFF (21:1 ✅)
  - Dark mode text: #F9FAFB on #000000 (21:1 ✅)

- [ ] **Accent colors used sparingly** (CTA, links, alerts only)
  - Primary accent: #007BFF (light) / #1F8FFF (dark)
  - Success: #22C55E
  - Warning: #F59E0B
  - Error: #EF4444

- [ ] **Brand palette limited to 3–4 main tones**
  1. Primary: #007BFF
  2. Secondary: #1F8FFF
  3. Accent: #0056b3
  4. Neutral: #6B7280

- [ ] **Glassmorphism blur intensity consistent**
  - Light mode: blur(15px)
  - Dark mode: blur(25px)
  - Opacity range: 0.6–0.8

- [ ] **Shadows subtle** (no harsh edges)
  - Light: `0 8px 32px rgba(31, 38, 135, 0.15)`
  - Dark: `0 8px 32px rgba(0, 0, 0, 0.5)`

- [ ] **Transparent layers readable** (text always legible)
  - Minimum contrast: 4.5:1
  - Test on various backgrounds

- [ ] **Gradients smooth and minimal** (no rainbow tones)
  - Use subtle gradients: `rgba(255,255,255,0.25) to rgba(255,255,255,0.05)`

- [ ] **Dark mode uses pure black** (#000) or near-black (#121212)
  - AMOLED power saving
  - True black for depth

- [ ] **Light mode uses pure white** (#ffffff) or off-white (#f9f9f9)
  - Calm, clean aesthetic
  - Professional appearance

### 🔧 Implementation

```typescript
import { campusAxisColors } from '@/lib/campusaxis-standards'

// Light mode
<div className="bg-white text-gray-900">

// Dark mode
<div className="dark:bg-black dark:text-gray-50">

// Accent (sparingly)
<button className="bg-[#007BFF] dark:bg-[#1F8FFF]">
```

---

## 🧩 2. Layout & Spacing

### ✅ Checklist

- [ ] **8px spacing grid followed** throughout (8, 16, 24, 32, etc.)
  ```css
  padding: 8px, 16px, 24px, 32px...
  margin: 8px, 16px, 24px, 32px...
  gap: 8px, 16px, 24px, 32px...
  ```

- [ ] **Equal padding/margin** inside cards and containers
  - Standard card: 24px padding
  - Large card: 32px padding

- [ ] **Proper whitespace** around content groups
  - Between sections: 48px–64px
  - Between elements: 16px–24px

- [ ] **Elements aligned** to grid or container center (no drift)

- [ ] **Cards have consistent corner radius**
  - Standard: 16px
  - Large: 24px

- [ ] **Responsive grid breakpoints**
  - xs: <600px
  - sm: <960px
  - md: <1280px
  - lg: <1920px

- [ ] **Sticky headers/footers** don't overlap content
  - Use proper z-index
  - Account for fixed positioning

- [ ] **Scroll behavior smooth** (no horizontal overflow)
  ```css
  overflow-x: hidden;
  scroll-behavior: smooth;
  ```

### 🔧 Implementation

```tsx
// 8px grid spacing
<div className="p-6 space-y-4">  {/* 24px padding, 16px gap */}

// Card with standard radius
<div className="rounded-2xl p-6">  {/* 16px radius, 24px padding */}

// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
```

---

## 📱 3. Mobile-First Responsiveness

### ✅ Checklist

- [ ] **Layout adapts** from 320px → 1440px seamlessly

- [ ] **Text auto-scales** without overflow or cutoffs
  ```tsx
  <h1 className="text-2xl sm:text-3xl lg:text-4xl">
  ```

- [ ] **Buttons are 44x44px min** (touch target)
  ```tsx
  <button className="min-h-[44px] min-w-[44px]">
  ```

- [ ] **No horizontal scroll** on small screens
  ```css
  overflow-x: hidden;
  max-width: 100vw;
  ```

- [ ] **Navbar collapses** to menu icon (hamburger/drawer)

- [ ] **Cards and grids stack vertically** on mobile
  ```tsx
  <div className="grid grid-cols-1 lg:grid-cols-3">
  ```

- [ ] **Form inputs full-width** on mobile
  ```tsx
  <input className="w-full sm:w-auto">
  ```

- [ ] **Images and SVGs responsive**
  ```css
  max-width: 100%;
  height: auto;
  ```

- [ ] **PWA viewport meta tags** included
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
  ```

### 🔧 Implementation

```tsx
// Responsive component
<div className="
  px-4 sm:px-6 lg:px-8        // Responsive padding
  text-base sm:text-lg        // Responsive text
  min-h-[44px]                // Touch target
">
  <button className="w-full sm:w-auto min-h-[44px]">
    Click Me
  </button>
</div>
```

---

## ⚙️ 4. Performance & Lightness

### ✅ Checklist

- [ ] **Images compressed** (WebP/AVIF)
  ```tsx
  <picture>
    <source srcSet="image.avif" type="image/avif" />
    <source srcSet="image.webp" type="image/webp" />
    <img src="image.jpg" alt="Fallback" />
  </picture>
  ```

- [ ] **Lazy-loading enabled** for heavy content
  ```tsx
  <img loading="lazy" src="image.jpg" />
  ```

- [ ] **CSS and JS minified**
  - Automatic in production build

- [ ] **Use system fonts** or light-weight variable fonts
  ```css
  font-family: Inter, system-ui, -apple-system, sans-serif;
  ```

- [ ] **No unused CSS/JS imports**
  - Run build analyzer
  - Remove dead code

- [ ] **Animations GPU-friendly** (transform, opacity)
  ```css
  transform: translateY(-2px);  /* ✅ GPU */
  opacity: 0.9;                  /* ✅ GPU */
  ```

- [ ] **Lighthouse performance score ≥ 90**
  - Run: `npm run build && npm run analyze`

- [ ] **Page load < 2 seconds** on 4G
  - Target: 1.8s First Contentful Paint
  - Target: 2.5s Largest Contentful Paint

### 🔧 Implementation

```typescript
// Next.js Image optimization
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={630}
  loading="lazy"
  quality={85}
/>

// Dynamic imports for code splitting
const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <Skeleton />,
})
```

---

## 🧠 5. Usability & Interaction

### ✅ Checklist

- [ ] **Clear affordances** (buttons look clickable, fields editable)

- [ ] **Feedback on all actions** (hover, press, submit, load)
  ```tsx
  hover:bg-primary/90    // Hover feedback
  active:scale-98        // Press feedback
  ```

- [ ] **No dead or hidden links**

- [ ] **Error and success messages** visible & polite
  ```tsx
  <Toast type="success">Saved successfully!</Toast>
  ```

- [ ] **Focus states visible** for accessibility
  ```tsx
  focus:ring-2 focus:ring-primary focus:ring-offset-2
  ```

- [ ] **Hover and active states** distinct but not distracting
  ```tsx
  hover:bg-primary/90 active:scale-98 transition-all duration-200
  ```

- [ ] **Tooltips and helper texts** available where needed

- [ ] **Form validation inline** and descriptive
  ```tsx
  <input aria-invalid="true" aria-describedby="error-message" />
  <span id="error-message">Email is required</span>
  ```

- [ ] **Tab order logical**
  ```tsx
  tabIndex={0}  // Interactive elements
  tabIndex={-1} // Programmatic focus only
  ```

- [ ] **Consistent motion timing** (200–400ms easing)
  ```css
  transition: all 200ms ease-in-out;
  ```

### 🔧 Implementation

```tsx
// Interactive button with all states
<button className="
  bg-primary text-white
  min-h-[44px] px-6 py-3
  rounded-2xl
  
  hover:bg-primary/90
  hover:-translate-y-0.5
  
  active:scale-98
  
  focus:outline-none
  focus:ring-2
  focus:ring-primary
  focus:ring-offset-2
  
  disabled:opacity-50
  disabled:cursor-not-allowed
  
  transition-all duration-200 ease-in-out
">
  Submit
</button>
```

---

## 🧍‍♂️ 6. Accessibility (A11y) & Inclusivity

### ✅ Checklist

- [ ] **Alt text** for all non-decorative images
  ```tsx
  <img src="logo.svg" alt="CampusAxis Logo" />
  <img src="decoration.svg" alt="" aria-hidden="true" />
  ```

- [ ] **Semantic HTML** (nav, header, main, footer, etc.)
  ```tsx
  <header>
  <nav>
  <main>
  <footer>
  ```

- [ ] **ARIA roles** used where needed
  ```tsx
  <button role="button" aria-label="Close modal">
  <div role="alert" aria-live="assertive">Error!</div>
  ```

- [ ] **Text resizable** up to 200%
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
  ```

- [ ] **Color not the only way** to convey meaning
  - Use icons + text for status
  - Don't rely on color alone

- [ ] **Focus indicators visible**
  ```css
  :focus {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
  ```

- [ ] **Supports screen readers** (NVDA, VoiceOver)
  - Test with screen reader
  - Proper heading hierarchy

- [ ] **Keyboard accessible** modals & menus
  - Tab navigation works
  - Escape closes modals
  - Focus trap implemented

### 🔧 Implementation

```tsx
// Accessible modal
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Modal Title</h2>
  <p id="modal-description">Modal content</p>
  
  <button
    onClick={onClose}
    aria-label="Close modal"
    tabIndex={0}
  >
    ×
  </button>
</div>

// Accessible form
<form>
  <label htmlFor="email-input">Email Address</label>
  <input
    id="email-input"
    type="email"
    aria-required="true"
    aria-invalid={hasError}
    aria-describedby={hasError ? "email-error" : undefined}
  />
  {hasError && (
    <span id="email-error" role="alert">
      Please enter a valid email
    </span>
  )}
</form>
```

---

## 💎 7. Glassmorphism & Aesthetic Guidelines

### ✅ Checklist

- [ ] **Use translucent backgrounds** with backdrop-filter
  ```css
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(15px) saturate(150%);
  ```

- [ ] **Subtle gradients**
  ```css
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.25),
    rgba(255,255,255,0.05)
  );
  ```

- [ ] **Borders soft**
  - Light: `1px solid rgba(255,255,255,0.2)`
  - Dark: `1px solid rgba(255,255,255,0.1)`

- [ ] **Text always readable** on frosted surfaces
  - Minimum contrast: 4.5:1

- [ ] **Light reflections applied** only to main cards (not everywhere)

- [ ] **Avoid glass layering** (no 2+ blur cards stacked)

- [ ] **Smooth hover transitions** for blur opacity
  ```css
  transition: all 300ms ease-in-out;
  ```

- [ ] **Consistent "depth" illusion** across UI

### 🔧 Implementation

```css
/* Standard glass card */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(15px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
}

/* Dark mode glass */
.dark .glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(25px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

/* Hover effect */
.glass-card:hover {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(150%);
  transition: all 300ms ease-in-out;
}
```

---

## ⚡ 8. Progressive Web App (PWA) Standards

### ✅ Checklist

- [ ] **Has manifest.json** with app name, icons, theme colors
  ```json
  {
    "name": "CampusAxis",
    "short_name": "CampusAxis",
    "start_url": "/",
    "display": "standalone",
    "theme_color": "#007BFF",
    "background_color": "#FFFFFF",
    "icons": [...]
  }
  ```

- [ ] **Supports offline cache** (Service Worker setup)

- [ ] **Splash screen** with CampusAxis logo

- [ ] **Works as standalone** (no browser UI)

- [ ] **Add-to-Home-Screen tested** on Android & iOS

- [ ] **Background sync enabled** for important actions

- [ ] **Light/dark mode** respected from system settings
  ```css
  @media (prefers-color-scheme: dark) {
    /* Dark mode styles */
  }
  ```

### 🔧 Implementation

See `app/manifest.ts` and `app/sw.ts` for complete PWA implementation.

---

## 🧰 9. Consistency & Components

### ✅ Checklist

- [ ] **Buttons follow global design tokens**
  - Color, radius, padding consistent

- [ ] **Inputs, modals, alerts, cards** follow consistent style

- [ ] **Typography hierarchy** (H1 → H6, body, caption)
  - Consistent line-height
  - Consistent font weights

- [ ] **Icons uniform** (outline or filled, not mixed)

- [ ] **Primary CTA color** consistent sitewide

- [ ] **Component naming** consistent with Figma and codebase

- [ ] **All states tested** (hover, focus, disabled, active)

- [ ] **Reused components** (avoid UI duplication)

### 🔧 Implementation

```tsx
// Use design tokens
import { componentStandards } from '@/lib/campusaxis-standards'

// Primary button
<button className="
  bg-[#007BFF] text-white
  px-6 py-3
  rounded-2xl
  min-h-[44px]
  font-semibold
  shadow-[0_4px_12px_rgba(0,123,255,0.3)]
  
  hover:bg-[#0056b3]
  active:scale-98
  focus:ring-2 focus:ring-[#007BFF]
  disabled:opacity-50
  
  transition-all duration-200
">
  Primary Action
</button>
```

---

## 🧭 10. Content & Visual Clarity

### ✅ Checklist

- [ ] **Text concise and readable** (max 60–80 chars per line)
  ```tsx
  <p className="max-w-prose">  {/* ~65ch */}
  ```

- [ ] **Headings descriptive and scannable**

- [ ] **Avoid jargon and long paragraphs**

- [ ] **Visual hierarchy clear** (headings, subtext, icons)

- [ ] **Empty states designed** (no blank screens)
  ```tsx
  <EmptyState
    icon={<InboxIcon />}
    title="No messages yet"
    description="When you receive messages, they'll appear here"
    action={<Button>Send Message</Button>}
  />
  ```

- [ ] **Loading states visible** (skeletons/spinners)

- [ ] **Error pages designed** (404, 500) with helpful navigation

- [ ] **Success messages** confirm user action clearly

### 🔧 Implementation

```tsx
// Readable content
<article className="max-w-prose space-y-6">
  <h1 className="text-4xl font-bold">Clear Heading</h1>
  <p className="text-base leading-relaxed">
    Content with optimal line length...
  </p>
</article>

// Loading state
<div className="animate-pulse space-y-4">
  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded w-full"></div>
  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
</div>
```

---

## 🧩 11. Testing & Validation

### ✅ Checklist

- [ ] **Tested on Chrome, Edge, Firefox, Safari**

- [ ] **Tested on Android & iOS devices**

- [ ] **Tested in both light and dark modes**

- [ ] **Tested for different DPI** (Retina / non-Retina)

- [ ] **Keyboard-only navigation check**

- [ ] **Lighthouse accessibility score ≥ 90**
  ```bash
  npm run lighthouse
  ```

- [ ] **Performance audit** via Chrome DevTools

- [ ] **Usability tested** by at least 3 non-developers

### 🔧 Testing Commands

```bash
# Run Lighthouse
npm run build
npx lighthouse http://localhost:3000 --view

# Run accessibility tests
npm run test:a11y

# Run visual regression tests
npm run test:visual

# Check bundle size
npm run analyze
```

---

## 🎯 12. CampusAxis Branding Standards

### ✅ Checklist

#### Primary Colors

- [ ] **Light Mode:**
  - Background: White (#FFFFFF)
  - Glass: Transparent Glass (rgba(255,255,255,0.7))
  - Accent: Blue (#007BFF)

- [ ] **Dark Mode:**
  - Background: Black (#000000)
  - Glass: Blue-Gray (rgba(255,255,255,0.05))
  - Accent: Neon Blue (#1F8FFF)

#### Typography

- [ ] **Font:** Inter / Poppins (variable weight)
  ```css
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  ```

#### Dimensions

- [ ] **Radius:** 16–24px across cards & modals
  - Standard: 16px
  - Large: 24px

- [ ] **Blur:** 15–25px
  - Light mode: 15px
  - Dark mode: 25px

#### Effects

- [ ] **Accent elements** have glowing edges in dark mode
  ```css
  box-shadow: 0 0 20px rgba(31, 143, 255, 0.5);
  ```

- [ ] **Buttons slightly elevated** with soft shadows
  ```css
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  ```

#### Logo

- [ ] **Consistent CampusAxis logo** usage and spacing
  - Mobile: 32px
  - Tablet: 40px
  - Desktop: 48px
  - Minimum spacing: 16px

#### Transitions

- [ ] **Page transitions** subtle fade or slide-in
  ```css
  transition: all 300ms ease-in-out;
  ```

### 🔧 Implementation

```tsx
// CampusAxis branded component
<div className="
  /* Light mode */
  bg-white
  
  /* Dark mode */
  dark:bg-black
  
  /* Glass effect */
  backdrop-blur-[15px]
  dark:backdrop-blur-[25px]
  
  /* Border */
  border border-white/20
  dark:border-white/10
  
  /* Radius */
  rounded-2xl
  
  /* Shadow */
  shadow-[0_8px_32px_rgba(31,38,135,0.15)]
  dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]
  
  /* Dark mode glow */
  dark:shadow-[0_0_20px_rgba(31,143,255,0.5)]
  
  /* Transition */
  transition-all duration-300 ease-in-out
">
  <button className="
    bg-[#007BFF] dark:bg-[#1F8FFF]
    text-white
    px-6 py-3
    rounded-2xl
    min-h-[44px]
    shadow-[0_4px_12px_rgba(0,123,255,0.3)]
    
    hover:shadow-[0_6px_16px_rgba(0,123,255,0.4)]
    
    transition-all duration-200
  ">
    CampusAxis Action
  </button>
</div>
```

---

## 📊 IMPLEMENTATION STATUS

### Framework Files

✅ **`lib/campusaxis-standards.ts`** - Complete standards implementation  
✅ **`CAMPUSAXIS_MASTER_CHECKLIST.md`** - This comprehensive checklist  
✅ **All standards defined and ready to use**

### Usage

```typescript
// Import standards
import { campusAxisStandards } from '@/lib/campusaxis-standards'

// Use in components
const { colors, spacing, components } = campusAxisStandards

// Validate components
const validation = campusAxisStandards.validateComponent({
  touchTargetSize: 48,
  contrast: 7.2,
  hasAccessibleLabel: true,
})

console.log(validation.valid) // true
```

---

## 🎓 RESOURCES

### Documentation
- Material Design 3: https://m3.material.io/
- Apple HIG: https://developer.apple.com/design/human-interface-guidelines/
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- PWA Standards: https://web.dev/progressive-web-apps/

### Internal
- `lib/campusaxis-standards.ts` - Complete standards
- `lib/design-system.ts` - Design tokens
- `lib/ui-ux-framework.ts` - UI/UX framework

---

## ✅ FINAL STATUS

**Status:** ✅ **COMPLETE & PRODUCTION READY**

All 12 sections of the CampusAxis UI/UX Master Checklist have been:
- ✅ Documented comprehensively
- ✅ Implemented in code (`lib/campusaxis-standards.ts`)
- ✅ Ready for use across the project
- ✅ Validated with utility functions
- ✅ Based on industry standards (Material 3, Apple HIG, WCAG, PWA)

**Start building world-class experiences with CampusAxis! 🚀**

---

**Last Updated:** October 16, 2025  
**Version:** 2025.1.0  
**Maintained By:** CampusAxis Development Team
