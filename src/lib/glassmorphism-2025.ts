/**
 * Advanced Glassmorphism 2025 Utility Library
 * Modern, sophisticated glass effects for CampusAxis
 * 
 * Accessibility & Performance Notes:
 * - All glass effects automatically respect prefers-reduced-motion media query
 * - Glass effects are automatically reduced on mobile devices for performance
 * - All components have proper focus states and ARIA attributes
 * - High contrast mode support is built into the CSS variables
 */

export type GlassVariant = 
  // New simplified 4-class system
  | 'glass-primary'      // High emphasis - heroes, major CTAs
  | 'glass-secondary'    // Medium emphasis - feature cards, content
  | 'glass-subtle'       // Low emphasis - backgrounds, dividers
  | 'glass-interactive'  // Hover states - buttons, clickable cards
  // Legacy aliases (auto-mapped via CSS)
  | 'glass-light'        // → glass-subtle
  | 'glass-medium'       // → glass-secondary
  | 'glass-strong'       // → glass-primary
  | 'glass-premium'      // → glass-primary
  | 'glass-ultra'        // → glass-primary
  | 'glass-card'         // → glass-secondary
  | 'glass-nav'          // → glass-primary
  | 'glass-modal'        // → glass-primary
  | 'glass-hero'         // → glass-primary
  | 'glass-floating'     // → glass-secondary
  | 'glass-layered'      // → glass-primary
  | 'glass-depth'        // → glass-primary

export type GlassBorder = 
  | 'border-none'
  | 'border-subtle'
  | 'border-light'
  | 'border-medium'
  | 'border-glow'
  | 'border-gradient'

export type GlassShadow = 
  | 'shadow-none'
  | 'shadow-soft'
  | 'shadow-medium'
  | 'shadow-strong'
  | 'shadow-glow'
  | 'shadow-apple'     // Apple 2025 shadow style

export interface GlassOptions {
  variant?: GlassVariant
  border?: GlassBorder
  shadow?: GlassShadow
  hover?: boolean
  interactive?: boolean
  glow?: boolean
  gradient?: boolean
  floating?: boolean
  depth?: boolean
}

/**
 * Get glassmorphism classes based on variant and options
 * Updated to use simplified 4-class system (glass-primary/secondary/subtle/interactive)
 * Uses professional blue/indigo color palette for consistency
 */
export function getGlassClasses({
  variant = 'glass-secondary',
  border = 'border-subtle',
  shadow = 'shadow-soft',
  hover = false,
  interactive = false,
  glow = false,
  gradient = false,
  floating = false,
  depth = false,
}: GlassOptions = {}): string {
  const classes: string[] = []

  // Base glass variants
  switch (variant) {
    case 'glass-subtle':
      classes.push(
        'bg-white/90 dark:bg-slate-900/70',
        'backdrop-blur-[var(--glass-blur-sm)]',
        'saturate-[var(--glass-saturation)]'
      )
      break
    case 'glass-light':
      classes.push(
        'bg-white/95 dark:bg-slate-900/75',
        'backdrop-blur-[var(--glass-blur-md)]',
        'saturate-[var(--glass-saturation)]'
      )
      break
    case 'glass-medium':
      classes.push(
        'bg-white/95 dark:bg-slate-900/80',
        'backdrop-blur-[var(--glass-blur-lg)]',
        'saturate-[var(--glass-saturation)]',
        'brightness-[var(--glass-brightness)]'
      )
      break
    case 'glass-strong':
      classes.push(
        'bg-white/95 dark:bg-slate-900/85',
        'backdrop-blur-[var(--glass-blur-xl)]',
        'saturate-[var(--glass-saturation)]',
        'brightness-[var(--glass-brightness)]'
      )
      break
    case 'glass-premium':
      classes.push(
        'bg-white dark:bg-slate-900/90',
        'backdrop-blur-[var(--glass-blur-2xl)]',
        'saturate-[calc(var(--glass-saturation)+20%)]',
        'brightness-[var(--glass-brightness)]'
      )
      break
    case 'glass-ultra':
      classes.push(
        'bg-gradient-to-br from-white/98 via-white/95 to-white/92',
        'dark:from-slate-900/90 dark:via-slate-900/85 dark:to-slate-900/80',
        'backdrop-blur-[var(--glass-blur-3xl)]',
        'saturate-[calc(var(--glass-saturation)+40%)]',
        'brightness-[calc(var(--glass-brightness)+15%)]'
      )
      break
    case 'glass-card':
      classes.push(
        'bg-white/95 dark:bg-slate-900/80',
        'backdrop-blur-[var(--glass-blur-xl)]',
        'saturate-[var(--glass-saturation)]'
      )
      break
    case 'glass-nav':
      classes.push(
        'bg-white/98 dark:bg-slate-900/90',
        'backdrop-blur-[var(--glass-blur-2xl)]',
        'saturate-[var(--glass-saturation)]',
        'brightness-[var(--glass-brightness)]'
      )
      break
    case 'glass-modal':
      classes.push(
        'bg-white dark:bg-slate-900/90',
        'backdrop-blur-[var(--glass-blur-3xl)]',
        'saturate-[var(--glass-saturation)]'
      )
      break
    case 'glass-hero':
      classes.push(
        'bg-gradient-to-br from-white/98 via-white/96 to-white/92',
        'dark:from-slate-900/90 dark:via-slate-900/85 dark:to-slate-900/80',
        'backdrop-blur-[var(--glass-blur-2xl)]',
        'saturate-[calc(var(--glass-saturation)+20%)]'
      )
      break
    case 'glass-floating':
      classes.push(
        'bg-white/95 dark:bg-slate-900/80',
        'backdrop-blur-[var(--glass-blur-xl)]',
        'saturate-[var(--glass-saturation)]',
        'relative',
        'animation float 6s ease-in-out infinite'
      )
      break
    case 'glass-layered':
      classes.push(
        'bg-white/95 dark:bg-slate-900/80',
        'backdrop-blur-[var(--glass-blur-lg)]',
        'saturate-[var(--glass-saturation)]',
        'relative overflow-hidden'
      )
      break
    case 'glass-depth':
      classes.push(
        'bg-white/96 dark:bg-slate-900/85',
        'backdrop-blur-[var(--glass-blur-xl)]',
        'saturate-[var(--glass-saturation)]',
        'relative',
        'transform-style preserve-3d',
        'animation apple-glass-depth 6s ease-in-out infinite'
      )
      break
  }

  // Border styles
  switch (border) {
    case 'border-subtle':
      classes.push(
        'border border-[var(--glass-border-subtle)]'
      )
      break
    case 'border-light':
      classes.push(
        'border border-[var(--glass-border-light)]'
      )
      break
    case 'border-medium':
      classes.push(
        'border-2 border-[var(--glass-border-medium)]'
      )
      break
    case 'border-glow':
      classes.push(
        'border border-[var(--glass-border-medium)]',
        'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_0_12px_rgba(59,130,246,0.18)]',
        'dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_0_10px_rgba(59,130,246,0.28)]'
      )
      break
    case 'border-gradient':
      classes.push(
        'border-2 border-transparent',
        'bg-gradient-to-r from-white/85 via-white/80 to-white/85 bg-origin-border',
        'dark:from-slate-900/70 dark:via-slate-900/65 dark:to-slate-900/70'
      )
      break
  }

  // Shadow styles
  switch (shadow) {
    case 'shadow-soft':
      classes.push(
        'shadow-lg shadow-black/[calc(var(--glass-shadow-opacity)*0.5)] dark:shadow-black/[calc(var(--glass-shadow-opacity)*1.5)]'
      )
      break
    case 'shadow-medium':
      classes.push(
        'shadow-xl shadow-black/[calc(var(--glass-shadow-opacity)*1.5)] dark:shadow-black/[calc(var(--glass-shadow-opacity)*4.5)]'
      )
      break
    case 'shadow-strong':
      classes.push(
        'shadow-2xl shadow-black/[calc(var(--glass-shadow-opacity)*3)] dark:shadow-black/[calc(var(--glass-shadow-opacity)*9)]'
      )
      break
    case 'shadow-glow':
      classes.push(
        'shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/20'
      )
      break
    case 'shadow-apple':
      classes.push(
        'shadow-lg shadow-black/[calc(var(--glass-shadow-opacity)*1.2)] dark:shadow-black/[calc(var(--glass-shadow-opacity)*2.5)]'
      )
      break
  }

  // Glow effect
  if (glow) {
    classes.push(
      'after:absolute after:inset-0 after:rounded-[inherit]',
      'after:bg-gradient-to-br after:from-blue-500/15 after:via-transparent after:to-indigo-500/15',
      'after:opacity-0 after:transition-opacity after:duration-300',
      'after:pointer-events-none'
    )
  }

  // Gradient overlay
  if (gradient) {
    classes.push(
      'before:absolute before:inset-0 before:rounded-[inherit]',
      'before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-white/10',
      'before:pointer-events-none'
    )
  }

  // Floating effect
  if (floating) {
    classes.push(
      'relative',
      'before:absolute before:-inset-4 before:rounded-[calc(var(--radius)+1rem)] before:pointer-events-none',
      'before:bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.05)_0%,rgba(59,130,246,0)_70%)]',
      'before:z-[-1]'
    )
  }

  // Depth effect
  if (depth) {
    classes.push(
      'relative',
      'before:absolute before:inset-0 before:rounded-[inherit]',
      'before:bg-[linear-gradient(135deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0)_50%,rgba(255,255,255,0.1)_100%)]',
      'before:transform translateZ(-2px)'
    )
  }

  // Hover effects
  if (hover) {
      classes.push(
        'transition-all duration-300 ease-out',
        'hover:bg-white/98 dark:hover:bg-slate-900/88',
        'hover:backdrop-blur-[var(--glass-blur-2xl)]',
        'hover:shadow-xl hover:shadow-black/[calc(var(--glass-shadow-opacity)*1.6)] dark:hover:shadow-black/[calc(var(--glass-shadow-opacity)*4.8)]',
        'hover:-translate-y-0.5 hover:scale-[1.01]'
      )
    if (glow) {
      classes.push('hover:after:opacity-100')
    }
  }

  // Interactive effects
  if (interactive) {
    classes.push(
      'cursor-pointer',
      'active:scale-[0.98]',
      'active:backdrop-blur-[var(--glass-blur-3xl)]'
    )
  }

  // Base positioning for pseudo-elements
  if (glow || gradient || floating || depth) {
    classes.push('relative')
  }

  return classes.join(' ')
}

/**
 * Preset configurations for common use cases
 */
export const glassPresets = {
  card: {
    variant: 'glass-card' as GlassVariant,
    border: 'border-subtle' as GlassBorder,
    shadow: 'shadow-soft' as GlassShadow,
    hover: true,
    glow: true,
  },
  cardPremium: {
    variant: 'glass-premium' as GlassVariant,
    border: 'border-glow' as GlassBorder,
    shadow: 'shadow-medium' as GlassShadow,
    hover: true,
    glow: true,
    gradient: true,
  },
  cardInteractive: {
    variant: 'glass-card' as GlassVariant,
    border: 'border-light' as GlassBorder,
    shadow: 'shadow-medium' as GlassShadow,
    hover: true,
    interactive: true,
    glow: true,
  },
  navigation: {
    variant: 'glass-nav' as GlassVariant,
    border: 'border-subtle' as GlassBorder,
    shadow: 'shadow-soft' as GlassShadow,
  },
  modal: {
    variant: 'glass-modal' as GlassVariant,
    border: 'border-light' as GlassBorder,
    shadow: 'shadow-strong' as GlassShadow,
  },
  hero: {
    variant: 'glass-hero' as GlassVariant,
    border: 'border-glow' as GlassBorder,
    shadow: 'shadow-glow' as GlassShadow,
    gradient: true,
  },
  button: {
    variant: 'glass-light' as GlassVariant,
    border: 'border-subtle' as GlassBorder,
    shadow: 'shadow-soft' as GlassShadow,
    hover: true,
    interactive: true,
  },
  input: {
    variant: 'glass-subtle' as GlassVariant,
    border: 'border-light' as GlassBorder,
    shadow: 'shadow-none' as GlassShadow,
  },
  badge: {
    variant: 'glass-light' as GlassVariant,
    border: 'border-subtle' as GlassBorder,
    shadow: 'shadow-none' as GlassShadow,
  },
  panel: {
    variant: 'glass-strong' as GlassVariant,
    border: 'border-medium' as GlassBorder,
    shadow: 'shadow-medium' as GlassShadow,
  },
  sidebar: {
    variant: 'glass-nav' as GlassVariant,
    border: 'border-subtle' as GlassBorder,
    shadow: 'shadow-soft' as GlassShadow,
  },
  dropdown: {
    variant: 'glass-modal' as GlassVariant,
    border: 'border-light' as GlassBorder,
    shadow: 'shadow-strong' as GlassShadow,
  },
  floatingCard: {
    variant: 'glass-floating' as GlassVariant,
    border: 'border-light' as GlassBorder,
    shadow: 'shadow-apple' as GlassShadow,
    floating: true,
    hover: true,
  },
  layeredCard: {
    variant: 'glass-layered' as GlassVariant,
    border: 'border-subtle' as GlassBorder,
    shadow: 'shadow-medium' as GlassShadow,
    gradient: true,
    depth: true,
  },
} as const

/**
 * Helper function to get preset classes
 */
export function getGlassPreset(preset: keyof typeof glassPresets): string {
  return getGlassClasses(glassPresets[preset])
}

/**
 * Enhanced glassmorphism utility for 2025 design standards
 * Provides consistent styling across light and dark modes
 */
export interface EnhancedGlassOptions extends GlassOptions {
  /**
   * Accessibility options for glassmorphism effects
   */
  accessibility?: {
    /**
     * Reduce motion for users who prefer it
     * @default false
     */
    reducedMotion?: boolean
    /**
     * High contrast mode support
     * @default false
     */
    highContrast?: boolean
    /**
     * Ensure proper focus visibility
     * @default true
     */
    focusVisible?: boolean
  }
  /**
   * Performance optimization options
   */
  performance?: {
    /**
     * Reduce blur effect on mobile devices
     * @default true
     */
    mobileOptimization?: boolean
    /**
     * Disable animations for better performance
     * @default false
     */
    disableAnimations?: boolean
  }
}

/**
 * Enhanced glassmorphism class generator with accessibility and performance features
 */
export function getEnhancedGlassClasses(options: EnhancedGlassOptions = {}): string {
  const {
    accessibility = {},
    performance = {},
    ...glassOptions
  } = options
  
  const {
    reducedMotion = false,
    highContrast = false,
    focusVisible = true
  } = accessibility
  
  const {
    mobileOptimization = true,
    disableAnimations = false
  } = performance
  
  // Get base glass classes
  let classes = getGlassClasses(glassOptions)
  
  // Add accessibility classes
  if (reducedMotion) {
    classes += ' motion-reduce:transition-none motion-reduce:animate-none'
  }
  
  if (highContrast) {
    classes += ' high-contrast:outline-2 high-contrast:outline high-contrast:outline-foreground'
  }
  
  // Add focus visibility classes
  if (focusVisible) {
    classes += ' focus-visible:outline-2 focus-visible:outline focus-visible:outline-ring focus-visible:outline-offset-2'
  }
  
  // Add performance classes
  if (disableAnimations) {
    classes += ' transition-none animate-none'
  }
  
  // Add mobile optimization classes (these would be handled via CSS media queries)
  if (mobileOptimization) {
    classes += ' mobile-optimized-glass'
  }
  
  return classes.trim()
}

/**
 * Type-safe preset getter with enhanced options
 */
export function getEnhancedGlassPreset(
  preset: keyof typeof glassPresets, 
  options: Partial<EnhancedGlassOptions> = {}
): string {
  const presetConfig = glassPresets[preset]
  return getEnhancedGlassClasses({
    ...presetConfig,
    ...options
  })
}

/**
 * Accessibility helper functions for glassmorphism components
 */
export const glassAccessibility = {
  /**
   * Ensure sufficient contrast for text on glass backgrounds
   * @param variant Glass variant to check contrast for
   * @returns CSS classes for proper text contrast
   */
  getTextContrastClasses: (variant: GlassVariant = 'glass-secondary'): string => {
    // Map glass variants to appropriate text colors for contrast
    const contrastMap: Record<GlassVariant, string> = {
      'glass-primary': 'text-foreground dark:text-foreground',
      'glass-secondary': 'text-foreground dark:text-foreground',
      'glass-subtle': 'text-foreground dark:text-foreground',
      'glass-interactive': 'text-foreground dark:text-foreground',
      'glass-light': 'text-foreground dark:text-foreground',
      'glass-medium': 'text-foreground dark:text-foreground',
      'glass-strong': 'text-foreground dark:text-foreground',
      'glass-premium': 'text-foreground dark:text-foreground',
      'glass-ultra': 'text-foreground dark:text-foreground',
      'glass-card': 'text-foreground dark:text-foreground',
      'glass-nav': 'text-foreground dark:text-foreground',
      'glass-modal': 'text-foreground dark:text-foreground',
      'glass-hero': 'text-foreground dark:text-foreground',
      'glass-floating': 'text-foreground dark:text-foreground',
      'glass-layered': 'text-foreground dark:text-foreground',
      'glass-depth': 'text-foreground dark:text-foreground',
    }
    
    return contrastMap[variant] || 'text-foreground dark:text-foreground'
  },
  
  /**
   * Get ARIA attributes for glass components
   * @param role ARIA role for the component
   * @param label Accessible label for the component
   * @returns Object with ARIA attributes
   */
  getAriaAttributes: (role?: string, label?: string): Record<string, string> => {
    const attributes: Record<string, string> = {}
    
    if (role) {
      attributes['role'] = role
    }
    
    if (label) {
      attributes['aria-label'] = label
    }
    
    return attributes
  },
  
  /**
   * Ensure proper focus management for interactive glass components
   * @returns CSS classes for focus management
   */
  getFocusClasses: (): string => {
    return 'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
  }
}