/**
 * CampusAxis Design System
 * 
 * Comprehensive design tokens and utilities for consistent UI/UX across the application.
 * Follow UI/UX principles: Hierarchy, Consistency, Accessibility, Responsive Design
 * 
 * @version 2.0.0
 * @updated 2025-10-16
 */

// ============================================
// COLOR SYSTEM
// Following Material Design 3 and WCAG AA standards
// ============================================

export const colors = {
  // Primary Colors - COMSATS Blue
  primary: {
    50: '#eff6ff',    // hsl(214, 100%, 97%)
    100: '#dbeafe',   // hsl(214, 95%, 93%)
    200: '#bfdbfe',   // hsl(214, 95%, 87%)
    300: '#93bbfd',   // hsl(213, 97%, 87%)
    400: '#60a5fa',   // hsl(213, 94%, 68%)
    500: '#3b82f6',   // hsl(217, 91%, 60%) - Main brand color
    600: '#2563eb',   // hsl(221, 83%, 53%) - Primary action color
    700: '#1d4ed8',   // hsl(224, 76%, 48%)
    800: '#1e40af',   // hsl(226, 71%, 40%)
    900: '#1e3a8a',   // hsl(228, 64%, 33%)
    950: '#172554',   // hsl(231, 62%, 21%)
    
    // Semantic
    DEFAULT: '#2563eb',
    foreground: '#ffffff',
    light: '#60a5fa',
    dark: '#1d4ed8',
  },

  // Secondary Colors - Amber Accent
  secondary: {
    50: '#fffbeb',    // hsl(48, 100%, 96%)
    100: '#fef3c7',   // hsl(48, 96%, 89%)
    200: '#fde68a',   // hsl(48, 97%, 77%)
    300: '#fcd34d',   // hsl(46, 97%, 65%)
    400: '#fbbf24',   // hsl(43, 96%, 56%)
    500: '#f59e0b',   // hsl(38, 92%, 50%) - Accent color
    600: '#d97706',   // hsl(32, 95%, 44%)
    700: '#b45309',   // hsl(26, 90%, 37%)
    800: '#92400e',   // hsl(21, 85%, 32%)
    900: '#78350f',   // hsl(18, 83%, 27%)
    950: '#451a03',   // hsl(17, 88%, 15%)
    
    // Semantic
    DEFAULT: '#f59e0b',
    foreground: '#ffffff',
  },

  // Neutral Colors - Professional Gray Scale
  neutral: {
    0: '#ffffff',     // Pure white
    50: '#f9fafb',    // hsl(210, 20%, 98%)
    100: '#f3f4f6',   // hsl(214, 17%, 95%)
    200: '#e5e7eb',   // hsl(214, 14%, 91%)
    300: '#d1d5db',   // hsl(214, 12%, 84%)
    400: '#9ca3af',   // hsl(214, 11%, 69%)
    500: '#6b7280',   // hsl(217, 10%, 47%)
    600: '#4b5563',   // hsl(217, 13%, 35%)
    700: '#374151',   // hsl(215, 17%, 28%)
    800: '#1f2937',   // hsl(217, 33%, 17%)
    900: '#111827',   // hsl(217, 43%, 12%)
    950: '#030712',   // hsl(210, 50%, 5%)
    1000: '#000000',  // Pure black
  },

  // Semantic Colors - State & Feedback
  semantic: {
    // Success - Green
    success: {
      light: '#86efac',   // hsl(141, 76%, 73%)
      DEFAULT: '#22c55e',  // hsl(142, 71%, 45%)
      dark: '#16a34a',    // hsl(142, 76%, 36%)
      foreground: '#ffffff',
    },
    
    // Warning - Orange
    warning: {
      light: '#fbbf24',   // hsl(43, 96%, 56%)
      DEFAULT: '#f59e0b',  // hsl(38, 92%, 50%)
      dark: '#d97706',    // hsl(32, 95%, 44%)
      foreground: '#000000',
    },
    
    // Error - Red
    error: {
      light: '#fca5a5',   // hsl(0, 93%, 81%)
      DEFAULT: '#ef4444',  // hsl(0, 72%, 60%)
      dark: '#dc2626',    // hsl(0, 79%, 52%)
      foreground: '#ffffff',
    },
    
    // Info - Blue
    info: {
      light: '#93c5fd',   // hsl(213, 94%, 78%)
      DEFAULT: '#3b82f6',  // hsl(217, 91%, 60%)
      dark: '#2563eb',    // hsl(221, 83%, 53%)
      foreground: '#ffffff',
    },
  },

  // Glassmorphism Colors
  glass: {
    light: 'rgba(255, 255, 255, 0.25)',
    medium: 'rgba(255, 255, 255, 0.35)',
    strong: 'rgba(255, 255, 255, 0.45)',
    border: 'rgba(255, 255, 255, 0.2)',
    
    // Dark mode variants
    darkLight: 'rgba(255, 255, 255, 0.05)',
    darkMedium: 'rgba(255, 255, 255, 0.1)',
    darkStrong: 'rgba(255, 255, 255, 0.15)',
    darkBorder: 'rgba(255, 255, 255, 0.08)',
  },
} as const

// ============================================
// TYPOGRAPHY SYSTEM
// Responsive type scale following 1.25 ratio (Major Third)
// ============================================

export const typography = {
  // Font Families
  fontFamily: {
    sans: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
    mono: 'var(--font-geist-mono), ui-monospace, monospace',
    display: 'var(--font-geist-sans), system-ui, sans-serif',
  },

  // Font Sizes (Mobile First)
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],      // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],   // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
    '5xl': ['3rem', { lineHeight: '1' }],          // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],       // 60px
    '7xl': ['4.5rem', { lineHeight: '1' }],        // 72px
    '8xl': ['6rem', { lineHeight: '1' }],          // 96px
    '9xl': ['8rem', { lineHeight: '1' }],          // 128px
  },

  // Font Weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
} as const

// ============================================
// SPACING SYSTEM
// Following 8px base unit (0.5rem)
// ============================================

export const spacing = {
  0: '0px',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px - base unit
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const

// ============================================
// BORDER RADIUS SYSTEM
// Modern rounded corners
// ============================================

export const borderRadius = {
  none: '0px',
  sm: '0.25rem',    // 4px
  DEFAULT: '0.5rem', // 8px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.25rem', // 20px
  '3xl': '1.5rem',  // 24px
  '4xl': '2rem',    // 32px
  full: '9999px',   // Perfect circle
} as const

// ============================================
// SHADOW SYSTEM
// Elevation and depth
// ============================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  
  // Glass Shadows
  glass: {
    sm: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
    DEFAULT: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.12)',
  },
  
  // Colored Shadows
  primary: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
  secondary: '0 10px 15px -3px rgba(245, 158, 11, 0.3)',
  success: '0 10px 15px -3px rgba(34, 197, 94, 0.3)',
  error: '0 10px 15px -3px rgba(239, 68, 68, 0.3)',
} as const

// ============================================
// ANIMATION SYSTEM
// Consistent timing and easing
// ============================================

export const animation = {
  // Durations (in ms)
  duration: {
    fastest: '75ms',
    faster: '100ms',
    fast: '150ms',
    normal: '200ms',
    medium: '300ms',
    slow: '400ms',
    slower: '500ms',
    slowest: '700ms',
  },

  // Easing Functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Keyframes
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    fadeOut: {
      '0%': { opacity: '1' },
      '100%': { opacity: '0' },
    },
    slideUp: {
      '0%': { transform: 'translateY(10px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    slideDown: {
      '0%': { transform: 'translateY(-10px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    scaleIn: {
      '0%': { transform: 'scale(0.95)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },
    float: {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-10px)' },
    },
    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' },
    },
  },
} as const

// ============================================
// BREAKPOINTS
// Responsive design breakpoints
// ============================================

export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// ============================================
// Z-INDEX SYSTEM
// Consistent stacking order
// ============================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
  max: 9999,
} as const

// ============================================
// GLASSMORPHISM SYSTEM
// Modern frosted glass effects
// ============================================

export const glassmorphism = {
  // Blur Intensities
  blur: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
  },

  // Background Opacities
  opacity: {
    light: 0.15,
    medium: 0.25,
    strong: 0.35,
  },

  // Border Opacities
  borderOpacity: {
    light: 0.1,
    medium: 0.15,
    strong: 0.2,
  },

  // Presets
  presets: {
    primary: {
      background: 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(12px) saturate(150%)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(8px) saturate(140%)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.1)',
    },
    subtle: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(6px) saturate(130%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.05)',
    },
  },
} as const

// ============================================
// UTILITY FUNCTIONS
// Helper functions for design system
// ============================================

/**
 * Get color with opacity
 */
export function withOpacity(color: string, opacity: number): string {
  // Convert hex to rgba
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

/**
 * Get responsive value based on breakpoint
 */
export function responsive<T>(values: { [key: string]: T }): T {
  // This would need to be implemented with a hook in React
  // For now, return the base value
  return values.base || values.sm || Object.values(values)[0]
}

/**
 * Create glassmorphism style object
 */
export function createGlassStyle(
  intensity: 'subtle' | 'secondary' | 'primary' = 'secondary',
  darkMode: boolean = false
) {
  const preset = glassmorphism.presets[intensity]
  
  if (darkMode) {
    return {
      ...preset,
      background: preset.background.replace('255, 255, 255', '0, 0, 0'),
    }
  }
  
  return preset
}

// ============================================
// EXPORT ALL
// ============================================

export const designSystem = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animation,
  breakpoints,
  zIndex,
  glassmorphism,
  // Utilities
  withOpacity,
  responsive,
  createGlassStyle,
} as const

export type DesignSystem = typeof designSystem
export type ColorToken = keyof typeof colors
export type SpacingToken = keyof typeof spacing
export type ShadowToken = keyof typeof shadows
