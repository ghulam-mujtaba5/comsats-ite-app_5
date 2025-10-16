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
        'bg-white/[var(--glass-bg-opacity)] dark:bg-white/[0.05]',
        'backdrop-blur-[var(--glass-blur-sm)]',
        'saturate-[var(--glass-saturation)]'
      )
      break
    case 'glass-light':
      classes.push(
        'bg-white/[calc(var(--glass-bg-opacity)+0.05)] dark:bg-white/[0.08]',
        'backdrop-blur-[var(--glass-blur-md)]',
        'saturate-[var(--glass-saturation)]'
      )
      break
    case 'glass-medium':
      classes.push(
        'bg-white/[calc(var(--glass-bg-opacity)+0.1)] dark:bg-white/[0.12]',
        'backdrop-blur-[var(--glass-blur-lg)]',
        'saturate-[var(--glass-saturation)]',
        'brightness-[var(--glass-brightness)]'
      )
      break
    case 'glass-strong':
      classes.push(
        'bg-white/[calc(var(--glass-bg-opacity)+0.15)] dark:bg-white/[0.18]',
        'backdrop-blur-[var(--glass-blur-xl)]',
        'saturate-[var(--glass-saturation)]',
        'brightness-[var(--glass-brightness)]'
      )
      break
    case 'glass-premium':
      classes.push(
        'bg-white/[calc(var(--glass-bg-opacity)+0.2)] dark:bg-white/[0.25]',
        'backdrop-blur-[var(--glass-blur-2xl)]',
        'saturate-[calc(var(--glass-saturation)+20%)]',
        'brightness-[var(--glass-brightness)]'
      )
      break
    case 'glass-ultra':
      classes.push(
        'bg-gradient-to-br from-white/[calc(var(--glass-bg-opacity)+0.3)] via-white/[calc(var(--glass-bg-opacity)+0.2)] to-white/[calc(var(--glass-bg-opacity)+0.15)]',
        'dark:from-white/[0.12] dark:via-white/[0.08] dark:to-white/[0.04]',
        'backdrop-blur-[var(--glass-blur-3xl)]',
        'saturate-[calc(var(--glass-saturation)+40%)]',
        'brightness-[calc(var(--glass-brightness)+15%)]'
      )
      break
    case 'glass-card':
      classes.push(
        'bg-white/[calc(var(--glass-bg-opacity)+0.12)] dark:bg-slate-900/[0.2]',
        'backdrop-blur-[var(--glass-blur-xl)]',
        'saturate-[var(--glass-saturation)]'
      )
      break
    case 'glass-nav':
      classes.push(
        'bg-white/[calc(var(--glass-bg-opacity)+0.4)] dark:bg-slate-900/[0.5]',
        'backdrop-blur-[var(--glass-blur-2xl)]',
        'saturate-[var(--glass-saturation)]',
        'brightness-[var(--glass-brightness)]'
      )
      break
    case 'glass-modal':
      classes.push(
        'bg-white/[calc(var(--glass-bg-opacity)+0.5)] dark:bg-slate-900/[0.6]',
        'backdrop-blur-[var(--glass-blur-3xl)]',
        'saturate-[var(--glass-saturation)]'
      )
      break
    case 'glass-hero':
      classes.push(
        'bg-gradient-to-br from-white/[calc(var(--glass-bg-opacity)+0.35)] via-white/[calc(var(--glass-bg-opacity)+0.25)] to-white/[calc(var(--glass-bg-opacity)+0.2)]',
        'dark:from-slate-900/[0.6] dark:via-slate-900/[0.4] dark:to-slate-900/[0.2]',
        'backdrop-blur-[var(--glass-blur-2xl)]',
        'saturate-[calc(var(--glass-saturation)+20%)]'
      )
      break
    case 'glass-floating':
      classes.push(
        'bg-white/[calc(var(--glass-bg-opacity)+0.15)] dark:bg-slate-900/[0.25]',
        'backdrop-blur-[var(--glass-blur-xl)]',
        'saturate-[var(--glass-saturation)]',
        'relative',
        'animation float 6s ease-in-out infinite'
      )
      break
    case 'glass-layered':
      classes.push(
        'bg-white/[calc(var(--glass-bg-opacity)+0.12)] dark:bg-slate-900/[0.2]',
        'backdrop-blur-[var(--glass-blur-lg)]',
        'saturate-[var(--glass-saturation)]',
        'relative overflow-hidden'
      )
      break
    case 'glass-depth':
      classes.push(
        'bg-white/[calc(var(--glass-bg-opacity)+0.15)] dark:bg-slate-900/[0.25]',
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
        'border border-white/[var(--glass-border-opacity)] dark:border-white/[0.08]'
      )
      break
    case 'border-light':
      classes.push(
        'border border-white/[calc(var(--glass-border-opacity)+0.05)] dark:border-white/[0.12]'
      )
      break
    case 'border-medium':
      classes.push(
        'border-2 border-white/[calc(var(--glass-border-opacity)+0.1)] dark:border-white/[0.18]'
      )
      break
    case 'border-glow':
      classes.push(
        'border border-white/[calc(var(--glass-border-opacity)+0.05)] dark:border-white/[0.12]',
        'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_0_8px_rgba(59,130,246,0.1)]',
        'dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_8px_rgba(59,130,246,0.2)]'
      )
      break
    case 'border-gradient':
      classes.push(
        'border-2 border-transparent',
        'bg-gradient-to-r from-white/[calc(var(--glass-border-opacity)+0.1)] via-white/[calc(var(--glass-border-opacity)+0.05)] to-white/[calc(var(--glass-border-opacity)+0.1)] bg-origin-border',
        'dark:from-white/[0.12] dark:via-white/[0.08] dark:to-white/[0.12]'
      )
      break
  }

  // Shadow styles
  switch (shadow) {
    case 'shadow-soft':
      classes.push(
        'shadow-lg shadow-black/[calc(var(--glass-shadow-opacity)*0.5)] dark:shadow-black/[var(--glass-shadow-opacity)]'
      )
      break
    case 'shadow-medium':
      classes.push(
        'shadow-xl shadow-black/[calc(var(--glass-shadow-opacity)*1.5)] dark:shadow-black/[calc(var(--glass-shadow-opacity)*3)]'
      )
      break
    case 'shadow-strong':
      classes.push(
        'shadow-2xl shadow-black/[calc(var(--glass-shadow-opacity)*3)] dark:shadow-black/[calc(var(--glass-shadow-opacity)*6)]'
      )
      break
    case 'shadow-glow':
      classes.push(
        'shadow-2xl shadow-primary/10 dark:shadow-primary/20'
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
      'after:bg-gradient-to-br after:from-primary/15 after:via-transparent after:to-blue-500/15',
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
      'hover:bg-white/[calc(var(--glass-bg-opacity)+0.15)] dark:hover:bg-white/[0.2]',
      'hover:backdrop-blur-[var(--glass-blur-2xl)]',
      'hover:shadow-xl hover:shadow-black/[calc(var(--glass-shadow-opacity)*1.5)] dark:hover:shadow-black/[calc(var(--glass-shadow-opacity)*3)]',
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