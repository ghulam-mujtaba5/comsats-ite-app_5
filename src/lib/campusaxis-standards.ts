/**
 * 🎯 CAMPUSAXIS UI/UX MASTER STANDARDS
 * 
 * Complete implementation of Material 3 + Glassmorphism + Apple HIG + PWA standards
 * Version: 2025
 * 
 * @version 2025.1.0
 * @updated October 16, 2025
 */

// ============================================
// 🎨 1. COLOR, CONTRAST & VISUAL HIERARCHY
// ============================================

export const campusAxisColors = {
  // Light Mode
  light: {
    primary: '#FFFFFF',           // Pure white
    secondary: '#F9F9F9',         // Off-white calm tone
    accent: '#007BFF',            // Accent Blue
    accentHover: '#0056b3',       // Darker blue for hover
    text: {
      primary: '#111827',         // Near black (21:1 contrast)
      secondary: '#374151',       // Gray (12:1 contrast)
      tertiary: '#6B7280',        // Light gray (7:1 contrast)
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.7)',
      border: 'rgba(255, 255, 255, 0.2)',
      blur: '15px',
      shadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
    },
  },

  // Dark Mode (AMOLED Optimized)
  dark: {
    primary: '#000000',           // Pure black (AMOLED saving)
    secondary: '#121212',         // Near-black
    accent: '#1F8FFF',            // Neon Blue
    accentHover: '#4DA6FF',       // Lighter blue for hover
    text: {
      primary: '#F9FAFB',         // Off-white
      secondary: '#D1D5DB',       // Light gray
      tertiary: '#9CA3AF',        // Medium gray
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: 'rgba(255, 255, 255, 0.1)',
      blur: '25px',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      glow: '0 0 20px rgba(31, 143, 255, 0.5)',
    },
  },

  // Brand Palette (Limited to 4 tones)
  brand: {
    primary: '#007BFF',     // Blue
    secondary: '#1F8FFF',   // Neon Blue
    accent: '#0056b3',      // Dark Blue
    neutral: '#6B7280',     // Gray
  },

  // Semantic Colors
  semantic: {
    success: '#22C55E',     // Green (4.5:1 contrast)
    warning: '#F59E0B',     // Amber
    error: '#EF4444',       // Red
    info: '#3B82F6',        // Blue
  },
} as const

// Contrast Ratios (WCAG AA Compliance)
export const contrastStandards = {
  minimumAA: 4.5,           // Normal text
  minimumAAA: 7.0,          // Enhanced
  largeTextAA: 3.0,         // 18pt+ or 14pt bold+
  uiComponents: 3.0,        // Interactive elements
} as const

// Glassmorphism Standards
export const glassStandards = {
  blur: {
    min: '10px',
    standard: '15px',
    max: '25px',
  },
  opacity: {
    min: 0.6,
    standard: 0.7,
    max: 0.8,
  },
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderDark: '1px solid rgba(255, 255, 255, 0.1)',
  shadowLight: '0 8px 32px rgba(31, 38, 135, 0.15)',
  shadowDark: '0 8px 32px rgba(0, 0, 0, 0.5)',
} as const

// ============================================
// 🧩 2. LAYOUT & SPACING
// ============================================

export const spacing = {
  // 8px Grid System
  base: 8,
  scale: {
    xs: 8,      // 8px
    sm: 16,     // 16px
    md: 24,     // 24px
    lg: 32,     // 32px
    xl: 40,     // 40px
    '2xl': 48,  // 48px
    '3xl': 64,  // 64px
  },

  // Card & Container Standards
  card: {
    padding: 24,
    radius: '16px',    // CampusAxis standard
    radiusLg: '24px',  // Large cards
  },

  // Responsive Breakpoints
  breakpoints: {
    xs: 320,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
} as const

// ============================================
// 📱 3. MOBILE-FIRST STANDARDS
// ============================================

export const mobileStandards = {
  // Minimum Touch Targets (Apple HIG)
  touchTarget: {
    min: '44px',
    comfortable: '48px',
    recommended: '56px',
  },

  // Viewport Range
  viewport: {
    min: 320,
    max: 1440,
  },

  // Typography Scaling
  typography: {
    mobile: {
      base: '16px',
      scale: 1.2,
    },
    tablet: {
      base: '16px',
      scale: 1.25,
    },
    desktop: {
      base: '16px',
      scale: 1.25,
    },
  },

  // PWA Viewport Meta
  viewportMeta: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
} as const

// ============================================
// ⚙️ 4. PERFORMANCE STANDARDS
// ============================================

export const performanceTargets = {
  // Core Web Vitals
  LCP: 2.5,          // Largest Contentful Paint (seconds)
  FID: 100,          // First Input Delay (ms)
  CLS: 0.1,          // Cumulative Layout Shift
  FCP: 1.8,          // First Contentful Paint (seconds)
  TTI: 3.8,          // Time to Interactive (seconds)

  // Lighthouse Scores
  lighthouse: {
    performance: 90,
    accessibility: 90,
    bestPractices: 90,
    seo: 90,
    pwa: 90,
  },

  // Asset Optimization
  images: {
    formats: ['webp', 'avif', 'jpg'],
    quality: 85,
    lazyLoad: true,
  },

  // Animation Performance
  animation: {
    properties: ['transform', 'opacity'],  // GPU-friendly
    duration: {
      min: '150ms',
      standard: '200ms',
      max: '400ms',
    },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

// ============================================
// 🧠 5. USABILITY & INTERACTION
// ============================================

export const interactionStandards = {
  // Affordance (Visual Cues)
  affordance: {
    button: {
      cursor: 'pointer',
      minHeight: '44px',
      padding: '12px 24px',
      borderRadius: '16px',
      transition: 'all 200ms ease-in-out',
    },
    link: {
      textDecoration: 'underline',
      cursor: 'pointer',
      color: campusAxisColors.brand.primary,
    },
    input: {
      border: '2px solid',
      borderRadius: '12px',
      padding: '12px 16px',
      minHeight: '44px',
    },
  },

  // Feedback Timing
  feedback: {
    immediate: 100,    // ms - Button press
    quick: 200,        // ms - Hover
    standard: 300,     // ms - Transitions
    patient: 500,      // ms - Complex animations
  },

  // States
  states: {
    hover: {
      transform: 'translateY(-2px)',
      shadow: 'elevated',
    },
    active: {
      transform: 'scale(0.98)',
    },
    focus: {
      outline: '2px solid currentColor',
      outlineOffset: '2px',
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },

  // Motion Timing
  motion: {
    duration: '200ms',
    durationSlow: '400ms',
    easing: 'ease-in-out',
  },
} as const

// ============================================
// 🧍‍♂️ 6. ACCESSIBILITY (A11Y)
// ============================================

export const a11yStandards = {
  // WCAG 2.1 Level AA
  wcag: {
    level: 'AA',
    contrastNormal: 4.5,
    contrastLarge: 3.0,
  },

  // Focus Management
  focus: {
    visible: true,
    indicator: '2px solid currentColor',
    offset: '2px',
  },

  // Keyboard Navigation
  keyboard: {
    tabIndex: {
      interactive: 0,
      programmatic: -1,
    },
    shortcuts: {
      escape: 'Close modals/dialogs',
      enter: 'Activate buttons/links',
      space: 'Toggle checkboxes',
      arrowKeys: 'Navigate lists/menus',
    },
  },

  // ARIA Requirements
  aria: {
    requiredRoles: ['button', 'link', 'navigation', 'main', 'complementary'],
    requiredLabels: ['aria-label', 'aria-labelledby', 'aria-describedby'],
  },

  // Text Resizing
  text: {
    resizable: true,
    maxScale: '200%',
    minSize: '16px',
  },
} as const

// ============================================
// 💎 7. GLASSMORPHISM GUIDELINES
// ============================================

export const glassmorphismGuidelines = {
  // Core Properties
  standard: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(15px) saturate(150%)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  },

  // Dark Mode Variant
  dark: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(25px) saturate(150%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    glow: '0 0 20px rgba(31, 143, 255, 0.5)',
  },

  // Rules
  rules: {
    maxLayers: 1,                  // Don't stack glass
    textContrast: 4.5,             // Minimum contrast
    blurRange: [10, 25],           // Min-max blur (px)
    opacityRange: [0.6, 0.8],      // Min-max opacity
    mainCardsOnly: true,           // Not everywhere
    readableText: true,            // Always prioritize readability
  },

  // Hover Transitions
  hover: {
    opacity: 0.85,
    blur: '20px',
    transition: 'all 300ms ease-in-out',
  },
} as const

// ============================================
// ⚡ 8. PWA STANDARDS
// ============================================

export const pwaStandards = {
  // Manifest Requirements
  manifest: {
    name: 'CampusAxis',
    shortName: 'CampusAxis',
    startUrl: '/',
    display: 'standalone',
    backgroundColor: '#FFFFFF',
    themeColor: '#007BFF',
    orientation: 'portrait-primary',
    categories: ['education', 'lifestyle'],
  },

  // Icons Required
  icons: {
    sizes: [72, 96, 128, 144, 152, 192, 384, 512],
    format: 'png',
    maskable: true,
  },

  // Service Worker
  serviceWorker: {
    caching: {
      static: 'cache-first',
      dynamic: 'network-first',
      images: 'cache-with-expiration',
    },
    offline: true,
    backgroundSync: true,
  },

  // Add to Home Screen
  a2hs: {
    tested: {
      android: true,
      ios: true,
    },
    splashScreen: {
      logo: '/logo.svg',
      background: '#FFFFFF',
    },
  },

  // System Integration
  system: {
    respectDarkMode: true,
    respectReducedMotion: true,
    respectColorScheme: true,
  },
} as const

// ============================================
// 🧰 9. COMPONENT CONSISTENCY
// ============================================

export const componentStandards = {
  // Button Tokens
  button: {
    primary: {
      background: campusAxisColors.brand.primary,
      color: '#FFFFFF',
      padding: '12px 24px',
      borderRadius: '16px',
      minHeight: '44px',
      fontWeight: 600,
      boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
    },
    secondary: {
      background: 'transparent',
      color: campusAxisColors.brand.primary,
      border: '2px solid currentColor',
      padding: '10px 22px',
      borderRadius: '16px',
      minHeight: '44px',
      fontWeight: 600,
    },
    ghost: {
      background: 'transparent',
      color: campusAxisColors.brand.primary,
      padding: '12px 24px',
      borderRadius: '16px',
      minHeight: '44px',
      fontWeight: 600,
    },
  },

  // Input Tokens
  input: {
    border: '2px solid #D1D5DB',
    borderFocus: campusAxisColors.brand.primary,
    borderRadius: '12px',
    padding: '12px 16px',
    minHeight: '44px',
    fontSize: '16px',
    transition: 'all 200ms ease-in-out',
  },

  // Card Tokens
  card: {
    padding: '24px',
    borderRadius: '16px',
    background: glassmorphismGuidelines.standard.background,
    backdropFilter: glassmorphismGuidelines.standard.backdropFilter,
    border: glassmorphismGuidelines.standard.border,
    boxShadow: glassmorphismGuidelines.standard.boxShadow,
  },

  // Modal Tokens
  modal: {
    borderRadius: '24px',
    maxWidth: '600px',
    padding: '32px',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    backdropBlur: 'blur(8px)',
  },

  // Typography Hierarchy
  typography: {
    h1: { size: '3rem', weight: 700, lineHeight: 1.2 },
    h2: { size: '2.5rem', weight: 700, lineHeight: 1.3 },
    h3: { size: '2rem', weight: 600, lineHeight: 1.4 },
    h4: { size: '1.5rem', weight: 600, lineHeight: 1.4 },
    h5: { size: '1.25rem', weight: 600, lineHeight: 1.5 },
    h6: { size: '1rem', weight: 600, lineHeight: 1.5 },
    body: { size: '1rem', weight: 400, lineHeight: 1.6 },
    caption: { size: '0.875rem', weight: 400, lineHeight: 1.5 },
  },

  // Icon Standards
  icons: {
    style: 'outline',  // Or 'filled' - but consistent
    sizes: {
      sm: '16px',
      md: '24px',
      lg: '32px',
      xl: '48px',
    },
  },
} as const

// ============================================
// 🧭 10. CONTENT & CLARITY
// ============================================

export const contentStandards = {
  // Text Readability
  text: {
    maxLineLength: 80,        // Characters
    optimalLineLength: 65,    // Characters
    minLineHeight: 1.5,
    optimalLineHeight: 1.6,
  },

  // Headings
  headings: {
    descriptive: true,
    scannable: true,
    hierarchical: true,
  },

  // States
  emptyStates: {
    required: true,
    illustration: true,
    actionable: true,
  },

  loadingStates: {
    skeleton: true,
    spinner: true,
    progress: true,
  },

  errorStates: {
    '404': {
      designed: true,
      navigation: true,
      helpful: true,
    },
    '500': {
      designed: true,
      navigation: true,
      supportContact: true,
    },
  },

  successStates: {
    visible: true,
    clear: true,
    actionConfirmed: true,
  },
} as const

// ============================================
// 🎯 12. CAMPUSAXIS BRANDING
// ============================================

export const campusAxisBranding = {
  // Primary Colors
  colors: {
    light: {
      primary: '#FFFFFF',
      glass: 'rgba(255, 255, 255, 0.7)',
      accent: '#007BFF',
    },
    dark: {
      primary: '#000000',
      glass: 'rgba(255, 255, 255, 0.05)',
      accent: '#1F8FFF',
      glow: '0 0 20px rgba(31, 143, 255, 0.5)',
    },
  },

  // Typography
  fonts: {
    primary: 'Inter, system-ui, -apple-system, sans-serif',
    secondary: 'Poppins, system-ui, sans-serif',
    weights: [400, 500, 600, 700],
  },

  // Dimensions
  dimensions: {
    borderRadius: {
      standard: '16px',
      large: '24px',
    },
    blur: {
      min: '15px',
      max: '25px',
    },
  },

  // Effects
  effects: {
    glowingEdges: {
      darkMode: true,
      color: 'rgba(31, 143, 255, 0.5)',
    },
    elevatedButtons: {
      shadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
    },
  },

  // Logo Usage
  logo: {
    spacing: {
      min: '16px',
      standard: '24px',
    },
    sizes: {
      mobile: '32px',
      tablet: '40px',
      desktop: '48px',
    },
  },

  // Transitions
  transitions: {
    pageTransition: 'fade',
    duration: '300ms',
    easing: 'ease-in-out',
  },
} as const

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if contrast ratio meets WCAG standards
 */
export function meetsContrastStandard(ratio: number, level: 'AA' | 'AAA' = 'AA'): boolean {
  const threshold = level === 'AA' ? contrastStandards.minimumAA : contrastStandards.minimumAAA
  return ratio >= threshold
}

/**
 * Get spacing value from scale
 */
export function getSpacing(scale: keyof typeof spacing.scale): number {
  return spacing.scale[scale]
}

/**
 * Check if touch target meets minimum size
 */
export function isTouchTargetValid(size: number): boolean {
  const minSize = parseInt(mobileStandards.touchTarget.min)
  return size >= minSize
}

/**
 * Get glassmorphism style for current theme
 */
export function getGlassStyle(isDark: boolean) {
  return isDark ? glassmorphismGuidelines.dark : glassmorphismGuidelines.standard
}

/**
 * Validate component against standards
 */
export function validateComponent(component: {
  touchTargetSize?: number
  contrast?: number
  hasAccessibleLabel?: boolean
}): { valid: boolean; issues: string[] } {
  const issues: string[] = []

  if (component.touchTargetSize && !isTouchTargetValid(component.touchTargetSize)) {
    issues.push(`Touch target too small: ${component.touchTargetSize}px (minimum: 44px)`)
  }

  if (component.contrast && !meetsContrastStandard(component.contrast)) {
    issues.push(`Contrast too low: ${component.contrast}:1 (minimum: 4.5:1)`)
  }

  if (component.hasAccessibleLabel === false) {
    issues.push('Missing accessible label (aria-label or aria-labelledby)')
  }

  return {
    valid: issues.length === 0,
    issues,
  }
}

// ============================================
// EXPORT COMPLETE STANDARDS
// ============================================

export const campusAxisStandards = {
  colors: campusAxisColors,
  contrast: contrastStandards,
  glass: glassStandards,
  spacing,
  mobile: mobileStandards,
  performance: performanceTargets,
  interaction: interactionStandards,
  a11y: a11yStandards,
  glassmorphism: glassmorphismGuidelines,
  pwa: pwaStandards,
  components: componentStandards,
  content: contentStandards,
  branding: campusAxisBranding,
  // Utilities
  meetsContrastStandard,
  getSpacing,
  isTouchTargetValid,
  getGlassStyle,
  validateComponent,
} as const

export type CampusAxisStandards = typeof campusAxisStandards

export default campusAxisStandards
