/**
 * 🧠 COMPLETE UI/UX DEVELOPMENT FRAMEWORK (2025)
 * 
 * Purpose: Deliver visually clean, accessible, emotionally intelligent,
 * and modern experiences using glassmorphism, AI-driven personalization,
 * and PWA optimization for CampusAxis.
 * 
 * @version 3.0.0
 * @updated October 16, 2025
 */

import { designSystem } from './design-system'

// ============================================
// 1️⃣ FOUNDATIONAL DESIGN PRINCIPLES
// ============================================

export const designPrinciples = {
  // Core UI/UX Pillars
  visualHierarchy: {
    primary: 'Large, bold, high contrast - main actions and headings',
    secondary: 'Medium weight, clear - supporting content',
    tertiary: 'Subtle, smaller - metadata and supplementary info',
  },
  
  consistency: {
    spacing: '8px grid system throughout',
    colors: 'Design tokens for all colors',
    typography: '1.25 scale ratio (Major Third)',
    components: 'Reusable, documented component library',
  },
  
  affordance: {
    buttons: 'Clear clickable appearance with hover states',
    links: 'Underlined or distinct color with cursor pointer',
    inputs: 'Bordered with clear labels and focus states',
    interactive: 'Visual feedback on all interactive elements',
  },
  
  feedback: {
    immediate: '< 100ms visual response',
    loading: 'Skeleton screens and spinners',
    success: 'Toast notifications with green semantic color',
    error: 'Clear error messages with red semantic color',
  },
  
  accessibility: {
    contrast: 'WCAG AA minimum (4.5:1)',
    keyboard: 'All functions keyboard accessible',
    screenReader: 'ARIA labels and semantic HTML',
    focus: 'Visible focus indicators',
  },
  
  usability: {
    cognitiveLoad: 'Minimize mental effort required',
    recognition: 'Familiar patterns over memorization',
    progressive: 'Disclose complexity gradually',
    forgiving: 'Easy undo and clear error recovery',
  },
} as const

// ============================================
// 2️⃣ COLOR THEORY & VISUAL BALANCE
// ============================================

export const colorTheory = {
  // Color Psychology Mapping
  psychology: {
    blue: 'Trust, professionalism, stability (Primary)',
    amber: 'Energy, warmth, attention (Secondary)',
    green: 'Success, growth, positive action',
    red: 'Error, urgency, warning',
    gray: 'Neutral, professional, balanced',
  },
  
  // Contrast Ratios (WCAG Compliance)
  contrast: {
    AA: 4.5,        // Normal text
    AAA: 7.0,       // Enhanced
    AALarge: 3.0,   // Large text (18pt+)
  },
  
  // Color Hierarchy Rules
  hierarchy: {
    primary: designSystem.colors.primary.DEFAULT,
    secondary: designSystem.colors.secondary.DEFAULT,
    accent: designSystem.colors.primary[600],
    neutral: designSystem.colors.neutral[600],
    maxColors: 4,  // Limit: primary + secondary + accent + neutral
  },
  
  // Emotional Mapping
  emotions: {
    trustworthy: [designSystem.colors.primary[600], designSystem.colors.primary[700]],
    energetic: [designSystem.colors.secondary[500], designSystem.colors.secondary[600]],
    calm: [designSystem.colors.primary[100], designSystem.colors.neutral[100]],
    urgent: [designSystem.colors.semantic.error.DEFAULT, designSystem.colors.semantic.warning.DEFAULT],
  },
  
  // Theme Tokens
  tokens: {
    light: {
      background: designSystem.colors.neutral[0],
      foreground: designSystem.colors.neutral[900],
      muted: designSystem.colors.neutral[100],
      mutedForeground: designSystem.colors.neutral[600],
      border: designSystem.colors.neutral[200],
    },
    dark: {
      background: designSystem.colors.neutral[950],
      foreground: designSystem.colors.neutral[50],
      muted: designSystem.colors.neutral[800],
      mutedForeground: designSystem.colors.neutral[400],
      border: designSystem.colors.neutral[800],
    },
  },
} as const

// ============================================
// 3️⃣ VISUAL CLARITY & HIERARCHY
// ============================================

export const visualHierarchy = {
  // Gestalt Principles
  gestalt: {
    proximity: 'Group related elements with consistent spacing',
    similarity: 'Similar items look similar (color, shape, size)',
    continuity: 'Elements arranged in lines or curves',
    closure: 'Incomplete shapes perceived as complete',
    figure: 'Elements distinguished from background',
  },
  
  // Typography Hierarchy
  typography: {
    display: {
      size: designSystem.typography.fontSize['6xl'],
      weight: designSystem.typography.fontWeight.bold,
      lineHeight: designSystem.typography.lineHeight.tight,
      use: 'Hero sections, landing pages',
    },
    h1: {
      size: designSystem.typography.fontSize['4xl'],
      weight: designSystem.typography.fontWeight.bold,
      lineHeight: designSystem.typography.lineHeight.tight,
      use: 'Page titles',
    },
    h2: {
      size: designSystem.typography.fontSize['3xl'],
      weight: designSystem.typography.fontWeight.semibold,
      lineHeight: designSystem.typography.lineHeight.tight,
      use: 'Section headings',
    },
    h3: {
      size: designSystem.typography.fontSize['2xl'],
      weight: designSystem.typography.fontWeight.semibold,
      lineHeight: designSystem.typography.lineHeight.snug,
      use: 'Subsection headings',
    },
    body: {
      size: designSystem.typography.fontSize.base,
      weight: designSystem.typography.fontWeight.normal,
      lineHeight: designSystem.typography.lineHeight.relaxed,
      use: 'Body text, paragraphs',
    },
    small: {
      size: designSystem.typography.fontSize.sm,
      weight: designSystem.typography.fontWeight.normal,
      lineHeight: designSystem.typography.lineHeight.normal,
      use: 'Captions, metadata',
    },
  },
  
  // Visual Weight Distribution
  weight: {
    primary: 'Bold font, large size, high contrast',
    secondary: 'Medium font, medium size, medium contrast',
    tertiary: 'Regular font, small size, low contrast',
  },
  
  // Scanability Patterns
  scanPatterns: {
    zPattern: 'Top left → Top right → Diagonal → Bottom left → Bottom right',
    fPattern: 'Top bar → Left column → Middle scan → Bottom left',
    layerCake: 'Horizontal sections with alternating emphasis',
  },
} as const

// ============================================
// 4️⃣ LAYOUT & SPACING SYSTEM
// ============================================

export const layoutSystem = {
  // Grid System (12-column)
  grid: {
    columns: 12,
    gutter: designSystem.spacing[6],  // 24px
    margin: designSystem.spacing[4],   // 16px mobile
    maxWidth: '1440px',
    breakpoints: designSystem.breakpoints,
  },
  
  // Container Sizes
  containers: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1440px',
    full: '100%',
  },
  
  // Spacing Scale (8px base)
  spacing: {
    base: '8px',
    scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96],
    usage: {
      xs: designSystem.spacing[1],   // 4px - tight spacing
      sm: designSystem.spacing[2],   // 8px - compact spacing
      md: designSystem.spacing[4],   // 16px - default spacing
      lg: designSystem.spacing[6],   // 24px - comfortable spacing
      xl: designSystem.spacing[8],   // 32px - generous spacing
      '2xl': designSystem.spacing[12], // 48px - section spacing
    },
  },
  
  // Vertical Rhythm
  rhythm: {
    baseLineHeight: 1.5,
    scale: 1.25,  // Major Third
    principle: 'Maintain consistent vertical spacing using line-height multiples',
  },
  
  // Whitespace Strategy
  whitespace: {
    micro: 'Between related elements (4-8px)',
    macro: 'Between sections (48-96px)',
    purpose: 'Create visual structure without borders',
    breathing: 'Minimum 16px padding on interactive elements',
  },
} as const

// ============================================
// 5️⃣ TYPOGRAPHY & READABILITY
// ============================================

export const typographyRules = {
  // Optimal Reading
  reading: {
    lineLength: '60-80 characters',
    lineHeight: 1.5,  // Body text
    paragraphSpacing: '1.5em',
    letterSpacing: 'normal',
  },
  
  // Font Pairing
  pairing: {
    display: designSystem.typography.fontFamily.display,
    body: designSystem.typography.fontFamily.sans,
    code: designSystem.typography.fontFamily.mono,
  },
  
  // Hierarchy Ratios
  scale: {
    ratio: 1.25,  // Major Third
    base: 16,     // 16px
    levels: {
      xs: 12,   // 0.75rem
      sm: 14,   // 0.875rem
      base: 16, // 1rem
      lg: 18,   // 1.125rem
      xl: 20,   // 1.25rem
      '2xl': 24, // 1.5rem
      '3xl': 30, // 1.875rem
      '4xl': 36, // 2.25rem
    },
  },
  
  // Responsive Typography
  responsive: {
    mobile: {
      base: '16px',
      scale: 1.2,
      lineHeight: 1.6,
    },
    tablet: {
      base: '16px',
      scale: 1.25,
      lineHeight: 1.5,
    },
    desktop: {
      base: '16px',
      scale: 1.25,
      lineHeight: 1.5,
    },
  },
  
  // Accessibility
  a11y: {
    minSize: 16,          // Minimum readable size
    maxSize: 96,          // Maximum for headings
    resizable: true,      // Allow user scaling up to 200%
    contrast: 4.5,        // WCAG AA for normal text
    contrastLarge: 3.0,   // WCAG AA for large text (18pt+)
  },
} as const

// ============================================
// 6️⃣ INTERACTION DESIGN
// ============================================

export const interactionDesign = {
  // Touch Targets
  touchTargets: {
    minimum: '44px',      // iOS HIG & WCAG
    recommended: '48px',  // Material Design
    comfortable: '56px',  // Desktop hover
    spacing: '8px',       // Between targets
  },
  
  // States
  states: {
    default: {
      opacity: 1,
      transform: 'scale(1)',
      cursor: 'default',
    },
    hover: {
      opacity: 0.9,
      transform: 'scale(1.02)',
      cursor: 'pointer',
      transition: designSystem.animation.duration.fast,
    },
    active: {
      opacity: 0.8,
      transform: 'scale(0.98)',
      cursor: 'pointer',
    },
    focus: {
      outline: `2px solid ${designSystem.colors.primary.DEFAULT}`,
      outlineOffset: '2px',
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
  
  // Microinteractions
  microinteractions: {
    buttonPress: {
      duration: '150ms',
      easing: designSystem.animation.easing.easeOut,
      transform: 'scale(0.98)',
    },
    cardHover: {
      duration: '200ms',
      easing: designSystem.animation.easing.easeInOut,
      transform: 'translateY(-4px)',
      shadow: designSystem.shadows.lg,
    },
    inputFocus: {
      duration: '200ms',
      easing: designSystem.animation.easing.easeOut,
      borderColor: designSystem.colors.primary.DEFAULT,
      shadow: `0 0 0 3px ${designSystem.colors.primary[100]}`,
    },
    modalOpen: {
      duration: '300ms',
      easing: designSystem.animation.easing.spring,
      backdrop: 'fade',
      content: 'scale + fade',
    },
  },
  
  // Gestures (Mobile)
  gestures: {
    swipe: 'Navigate between items',
    pinch: 'Zoom in/out',
    longPress: 'Show context menu',
    doubleTap: 'Quick action',
    pull: 'Refresh content',
  },
  
  // Feedback Timing
  timing: {
    immediate: '< 100ms',    // Button press
    quick: '100-300ms',      // Hover, focus
    smooth: '300-500ms',     // Page transitions
    patient: '500-1000ms',   // Complex animations
  },
} as const

// ============================================
// 7️⃣ ACCESSIBILITY (A11y) FRAMEWORK
// ============================================

export const accessibility = {
  // WCAG 2.1 Level AA Compliance
  wcag: {
    level: 'AA',
    guidelines: {
      perceivable: 'Content presented in ways users can perceive',
      operable: 'UI components users can operate',
      understandable: 'Information and operation understandable',
      robust: 'Content interpretable by assistive technologies',
    },
  },
  
  // Contrast Requirements
  contrast: {
    normalText: 4.5,     // 14pt and above
    largeText: 3.0,      // 18pt+ or 14pt bold+
    uiComponents: 3.0,   // Interactive elements
    graphicalObjects: 3.0, // Icons, charts
  },
  
  // Keyboard Navigation
  keyboard: {
    tab: 'Move forward through interactive elements',
    shiftTab: 'Move backward',
    enter: 'Activate buttons and links',
    space: 'Toggle checkboxes, activate buttons',
    escape: 'Close modals and dialogs',
    arrows: 'Navigate within components',
  },
  
  // ARIA Roles
  aria: {
    landmark: ['banner', 'navigation', 'main', 'complementary', 'contentinfo'],
    widget: ['button', 'checkbox', 'dialog', 'tab', 'tabpanel'],
    liveRegion: ['alert', 'status', 'timer', 'log'],
  },
  
  // Screen Reader Support
  screenReader: {
    altText: 'All images have descriptive alt text',
    labels: 'All form inputs have associated labels',
    headings: 'Logical heading hierarchy (h1 → h2 → h3)',
    landmarks: 'Semantic HTML5 elements used',
    hiddenContent: 'Use aria-hidden for decorative elements',
  },
  
  // Focus Management
  focus: {
    visible: 'Always show focus indicators',
    order: 'Logical tab order matching visual order',
    trap: 'Trap focus within modals',
    restore: 'Return focus after modal closes',
  },
} as const

// ============================================
// 8️⃣ MOTION DESIGN & ANIMATIONS
// ============================================

export const motionDesign = {
  // Animation Principles
  principles: {
    purposeful: 'Every animation has a purpose',
    subtle: 'Enhance, don\'t distract',
    performant: '60fps minimum',
    respectful: 'Honor prefers-reduced-motion',
  },
  
  // Duration Guidelines
  duration: {
    micro: '75-150ms',      // Button states
    macro: '200-400ms',     // Component transitions
    complex: '400-700ms',   // Page transitions
  },
  
  // Easing Curves
  easing: {
    entrance: designSystem.animation.easing.easeOut,
    exit: designSystem.animation.easing.easeIn,
    standard: designSystem.animation.easing.easeInOut,
    expressive: designSystem.animation.easing.spring,
  },
  
  // Animation Types
  types: {
    fade: 'Opacity transitions',
    slide: 'Position transitions',
    scale: 'Size transitions',
    rotate: 'Rotation transitions',
    morph: 'Shape transitions',
  },
  
  // Reduced Motion
  reducedMotion: {
    respect: true,
    fallback: 'Instant or subtle opacity changes',
    cssMedia: '@media (prefers-reduced-motion: reduce)',
  },
} as const

// ============================================
// 9️⃣ GLASSMORPHISM 2025
// ============================================

export const glassmorphism2025 = {
  // Core Properties
  properties: {
    background: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(12px) saturate(150%)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: designSystem.borderRadius['2xl'],
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  },
  
  // Variants
  variants: {
    primary: {
      blur: '12px',
      opacity: 0.25,
      border: 0.2,
      use: 'Hero sections, featured cards',
    },
    secondary: {
      blur: '8px',
      opacity: 0.15,
      border: 0.15,
      use: 'Navigation, standard cards',
    },
    subtle: {
      blur: '6px',
      opacity: 0.1,
      border: 0.1,
      use: 'Backgrounds, overlays',
    },
    interactive: {
      blur: '10px',
      opacity: 0.2,
      border: 0.18,
      use: 'Buttons, interactive elements',
    },
  },
  
  // Dark Mode Adaptation
  darkMode: {
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(12px) saturate(150%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    glow: '0 0 20px rgba(59, 130, 246, 0.3)',
  },
  
  // Mobile Optimization
  mobile: {
    blur: '8px',  // Reduced for performance
    opacity: 0.2, // Slightly higher for readability
    note: 'Reduce blur intensity on mobile for better performance',
  },
  
  // Best Practices
  bestPractices: [
    'Maintain text contrast (4.5:1 minimum)',
    'Avoid stacking multiple glass layers',
    'Use solid backgrounds for text-heavy content',
    'Combine with minimalist layouts',
    'Test on various backgrounds',
  ],
} as const

// ============================================
// 🔟 DARK & LIGHT MODE STRATEGY
// ============================================

export const themeStrategy = {
  // Light Mode Design
  light: {
    background: {
      primary: designSystem.colors.neutral[0],
      secondary: designSystem.colors.neutral[50],
      tertiary: designSystem.colors.neutral[100],
    },
    text: {
      primary: designSystem.colors.neutral[900],
      secondary: designSystem.colors.neutral[700],
      tertiary: designSystem.colors.neutral[500],
    },
    shadows: 'Soft and light',
    borders: designSystem.colors.neutral[200],
  },
  
  // Dark Mode Design
  dark: {
    background: {
      primary: designSystem.colors.neutral[950],
      secondary: designSystem.colors.neutral[900],
      tertiary: designSystem.colors.neutral[800],
    },
    text: {
      primary: designSystem.colors.neutral[50],
      secondary: designSystem.colors.neutral[300],
      tertiary: designSystem.colors.neutral[400],
    },
    shadows: 'Glow effects',
    borders: designSystem.colors.neutral[800],
    accents: 'Neon blue, cyan, violet',
  },
  
  // Transition Strategy
  transition: {
    duration: '200ms',
    easing: designSystem.animation.easing.easeInOut,
    properties: ['background-color', 'color', 'border-color', 'box-shadow'],
  },
  
  // System Sync
  systemSync: {
    media: '(prefers-color-scheme: dark)',
    localStorage: 'theme',
    fallback: 'light',
  },
} as const

// ============================================
// 1️⃣1️⃣ MOBILE-FIRST RESPONSIVE DESIGN
// ============================================

export const responsiveDesign = {
  // Mobile First Approach
  philosophy: 'Design for mobile, enhance for desktop',
  
  // Breakpoints
  breakpoints: {
    xs: { min: '0px', max: '474px', use: 'Small phones' },
    sm: { min: '475px', max: '639px', use: 'Phones' },
    md: { min: '640px', max: '767px', use: 'Large phones' },
    lg: { min: '768px', max: '1023px', use: 'Tablets' },
    xl: { min: '1024px', max: '1279px', use: 'Small laptops' },
    '2xl': { min: '1280px', max: '1535px', use: 'Desktops' },
    '3xl': { min: '1536px', max: '∞', use: 'Large screens' },
  },
  
  // Touch Optimization
  touch: {
    minTarget: '44px',
    comfortable: '48px',
    spacing: '8px',
    feedback: 'Visual press state',
  },
  
  // Adaptive Typography
  typography: {
    mobile: { base: 16, scale: 1.2 },
    tablet: { base: 16, scale: 1.25 },
    desktop: { base: 16, scale: 1.25 },
  },
  
  // Fluid Layouts
  fluid: {
    containers: 'max-width with auto margins',
    grid: 'CSS Grid with auto-fit',
    flexbox: 'Flexible wrapping layouts',
    clamp: 'clamp(min, preferred, max)',
  },
} as const

// ============================================
// 1️⃣2️⃣ PWA OPTIMIZATION
// ============================================

export const pwaOptimization = {
  // Core Requirements
  requirements: {
    manifest: 'Complete manifest.json with icons',
    serviceWorker: 'Offline support and caching',
    https: 'Secure connection required',
    responsive: 'Works on all screen sizes',
  },
  
  // Performance Targets
  performance: {
    fcp: '< 1.8s',        // First Contentful Paint
    lcp: '< 2.5s',        // Largest Contentful Paint
    fid: '< 100ms',       // First Input Delay
    cls: '< 0.1',         // Cumulative Layout Shift
    tti: '< 3.8s',        // Time to Interactive
  },
  
  // Caching Strategy
  caching: {
    static: 'Cache-first',
    dynamic: 'Network-first with fallback',
    images: 'Cache with expiration',
    api: 'Network-first',
  },
  
  // Offline Experience
  offline: {
    shell: 'App shell cached',
    content: 'Previous content available',
    notification: 'Clear offline indicator',
    sync: 'Background sync when online',
  },
} as const

// ============================================
// 1️⃣3️⃣ PERFORMANCE OPTIMIZATION
// ============================================

export const performanceOptimization = {
  // Loading Strategy
  loading: {
    lazy: 'Images and components below fold',
    prefetch: 'Critical route resources',
    preload: 'Above-fold resources',
    defer: 'Non-critical scripts',
  },
  
  // Code Splitting
  splitting: {
    route: 'Split by route/page',
    component: 'Dynamic imports for heavy components',
    vendor: 'Separate vendor bundles',
  },
  
  // Image Optimization
  images: {
    format: 'WebP with fallback',
    responsive: 'srcset for different sizes',
    lazy: 'Native lazy loading',
    compression: 'Optimize before upload',
  },
  
  // Skeleton Loading
  skeleton: {
    use: 'Show layout while content loads',
    animate: 'Subtle pulse animation',
    match: 'Match actual content layout',
  },
} as const

// ============================================
// 1️⃣4️⃣ DESIGN SYSTEM GOVERNANCE
// ============================================

export const designSystemGovernance = {
  // Component Library
  components: {
    documented: 'Every component has docs',
    tested: 'Unit and visual regression tests',
    versioned: 'Semantic versioning',
    accessible: 'WCAG AA compliant',
  },
  
  // Design Tokens
  tokens: {
    colors: 'CSS variables for all colors',
    spacing: '8px base unit system',
    typography: 'Consistent scale',
    shadows: 'Elevation system',
  },
  
  // Reusability
  reusability: {
    principle: 'Build once, use everywhere',
    variants: 'Props for variations',
    composition: 'Small, composable components',
  },
  
  // Documentation
  documentation: {
    usage: 'When and how to use',
    props: 'All available props',
    examples: 'Code examples',
    accessibility: 'A11y considerations',
  },
} as const

// ============================================
// 1️⃣5️⃣ UI/UX AUDIT CHECKLIST
// ============================================

export const auditChecklist = {
  // Visual Design
  visual: [
    'Color pollution (max 4 base colors)',
    'Sufficient contrast (4.5:1 minimum)',
    'Clear visual hierarchy',
    'Consistent spacing (8px grid)',
    'Appropriate typography scale',
    'Balanced composition',
    'No visual clutter',
  ],
  
  // Interaction
  interaction: [
    'Clear affordance (clickable elements look clickable)',
    'Immediate feedback on actions',
    'Smooth transitions (200-400ms)',
    'Touch targets ≥ 44px',
    'Visible focus indicators',
    'Disabled states clearly indicated',
  ],
  
  // Accessibility
  a11y: [
    'WCAG AA contrast met',
    'Keyboard navigation works',
    'Screen reader compatible',
    'ARIA labels present',
    'Alt text on images',
    'No color-only information',
  ],
  
  // Performance
  performance: [
    'First Contentful Paint < 1.8s',
    'Time to Interactive < 3.8s',
    'No layout shifts (CLS < 0.1)',
    'Images optimized and lazy loaded',
    'Code split by route',
  ],
  
  // Responsive
  responsive: [
    'Mobile-first design',
    'Works on all breakpoints',
    'Touch-optimized',
    'Adaptive typography',
    'No horizontal scroll',
  ],
  
  // Content
  content: [
    'Clear information hierarchy',
    'Scannable layout',
    'Appropriate line length (60-80 chars)',
    'Sufficient whitespace',
    'Consistent tone and voice',
  ],
} as const

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if color meets WCAG contrast requirements
 */
export function checkContrast(foreground: string, background: string): {
  ratio: number
  AA: boolean
  AAA: boolean
} {
  // Simplified contrast calculation
  // In production, use a library like 'color' or 'chroma-js'
  const ratio = 4.5 // Placeholder
  return {
    ratio,
    AA: ratio >= 4.5,
    AAA: ratio >= 7.0,
  }
}

/**
 * Generate responsive class names
 */
export function responsive(
  base: string,
  overrides: { [breakpoint: string]: string }
): string {
  let classes = base
  Object.entries(overrides).forEach(([bp, value]) => {
    classes += ` ${bp}:${value}`
  })
  return classes
}

/**
 * Create glassmorphism style
 */
export function createGlassStyle(
  variant: 'primary' | 'secondary' | 'subtle' | 'interactive' = 'secondary',
  darkMode: boolean = false
): React.CSSProperties {
  const v = glassmorphism2025.variants[variant]
  
  if (darkMode) {
    return {
      background: glassmorphism2025.darkMode.background,
      backdropFilter: `blur(${v.blur}) saturate(150%)`,
      border: `1px solid rgba(255, 255, 255, ${v.border / 2})`,
      boxShadow: glassmorphism2025.darkMode.glow,
      borderRadius: designSystem.borderRadius['2xl'],
    }
  }
  
  return {
    background: `rgba(255, 255, 255, ${v.opacity})`,
    backdropFilter: `blur(${v.blur}) saturate(150%)`,
    border: `1px solid rgba(255, 255, 255, ${v.border})`,
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
    borderRadius: designSystem.borderRadius['2xl'],
  }
}

// ============================================
// EXPORT COMPLETE FRAMEWORK
// ============================================

export const uiUxFramework = {
  designPrinciples,
  colorTheory,
  visualHierarchy,
  layoutSystem,
  typographyRules,
  interactionDesign,
  accessibility,
  motionDesign,
  glassmorphism2025,
  themeStrategy,
  responsiveDesign,
  pwaOptimization,
  performanceOptimization,
  designSystemGovernance,
  auditChecklist,
  // Utilities
  checkContrast,
  responsive,
  createGlassStyle,
} as const

export type UIUXFramework = typeof uiUxFramework

export default uiUxFramework
