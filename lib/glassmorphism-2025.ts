/**
 * Advanced Glassmorphism 2025 Utility Library
 * Modern, sophisticated glass effects for CampusAxis
 */

export type GlassVariant = 
  | 'glass-subtle'      // Ultra-light, minimal blur
  | 'glass-light'       // Light glass effect
  | 'glass-medium'      // Standard glass effect
  | 'glass-strong'      // Strong glass effect
  | 'glass-premium'     // Premium frosted glass
  | 'glass-ultra'       // Ultra premium with depth
  | 'glass-card'        // Optimized for cards
  | 'glass-nav'         // Optimized for navigation
  | 'glass-modal'       // Optimized for modals/dialogs
  | 'glass-hero'        // Optimized for hero sections

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

export interface GlassOptions {
  variant?: GlassVariant
  border?: GlassBorder
  shadow?: GlassShadow
  hover?: boolean
  interactive?: boolean
  glow?: boolean
  gradient?: boolean
}

/**
 * Get glassmorphism classes based on variant and options
 */
export function getGlassClasses({
  variant = 'glass-medium',
  border = 'border-subtle',
  shadow = 'shadow-soft',
  hover = false,
  interactive = false,
  glow = false,
  gradient = false,
}: GlassOptions = {}): string {
  const classes: string[] = []

  // Base glass variants
  switch (variant) {
    case 'glass-subtle':
      classes.push(
        'bg-white/5 dark:bg-white/[0.02]',
        'backdrop-blur-sm',
        'backdrop-saturate-150'
      )
      break
    case 'glass-light':
      classes.push(
        'bg-white/10 dark:bg-white/[0.03]',
        'backdrop-blur-md',
        'backdrop-saturate-150'
      )
      break
    case 'glass-medium':
      classes.push(
        'bg-white/20 dark:bg-white/[0.05]',
        'backdrop-blur-lg',
        'backdrop-saturate-150',
        'backdrop-brightness-110'
      )
      break
    case 'glass-strong':
      classes.push(
        'bg-white/30 dark:bg-white/[0.08]',
        'backdrop-blur-xl',
        'backdrop-saturate-150',
        'backdrop-brightness-110'
      )
      break
    case 'glass-premium':
      classes.push(
        'bg-white/40 dark:bg-white/[0.1]',
        'backdrop-blur-2xl',
        'backdrop-saturate-200',
        'backdrop-brightness-110'
      )
      break
    case 'glass-ultra':
      classes.push(
        'bg-gradient-to-br from-white/50 via-white/30 to-white/20',
        'dark:from-white/[0.12] dark:via-white/[0.08] dark:to-white/[0.04]',
        'backdrop-blur-3xl',
        'backdrop-saturate-200',
        'backdrop-brightness-125'
      )
      break
    case 'glass-card':
      classes.push(
        'bg-white/30 dark:bg-slate-900/30',
        'backdrop-blur-xl',
        'backdrop-saturate-150'
      )
      break
    case 'glass-nav':
      classes.push(
        'bg-white/70 dark:bg-slate-900/70',
        'backdrop-blur-2xl',
        'backdrop-saturate-150',
        'backdrop-brightness-110'
      )
      break
    case 'glass-modal':
      classes.push(
        'bg-white/80 dark:bg-slate-900/80',
        'backdrop-blur-3xl',
        'backdrop-saturate-150'
      )
      break
    case 'glass-hero':
      classes.push(
        'bg-gradient-to-br from-white/60 via-white/40 to-white/20',
        'dark:from-slate-900/60 dark:via-slate-900/40 dark:to-slate-900/20',
        'backdrop-blur-2xl',
        'backdrop-saturate-200'
      )
      break
  }

  // Border styles
  switch (border) {
    case 'border-subtle':
      classes.push(
        'border border-white/10 dark:border-white/[0.05]'
      )
      break
    case 'border-light':
      classes.push(
        'border border-white/20 dark:border-white/[0.1]'
      )
      break
    case 'border-medium':
      classes.push(
        'border-2 border-white/30 dark:border-white/[0.15]'
      )
      break
    case 'border-glow':
      classes.push(
        'border border-white/20 dark:border-white/[0.1]',
        'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]',
        'dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'
      )
      break
    case 'border-gradient':
      classes.push(
        'border-2 border-transparent',
        'bg-gradient-to-r from-white/20 via-white/10 to-white/20 bg-origin-border',
        'dark:from-white/[0.1] dark:via-white/[0.05] dark:to-white/[0.1]'
      )
      break
  }

  // Shadow styles
  switch (shadow) {
    case 'shadow-soft':
      classes.push(
        'shadow-lg shadow-black/5 dark:shadow-black/20'
      )
      break
    case 'shadow-medium':
      classes.push(
        'shadow-xl shadow-black/10 dark:shadow-black/30'
      )
      break
    case 'shadow-strong':
      classes.push(
        'shadow-2xl shadow-black/15 dark:shadow-black/40'
      )
      break
    case 'shadow-glow':
      classes.push(
        'shadow-2xl shadow-primary/10 dark:shadow-primary/20'
      )
      break
  }

  // Glow effect
  if (glow) {
    classes.push(
      'after:absolute after:inset-0 after:rounded-[inherit]',
      'after:bg-gradient-to-br after:from-primary/10 after:via-transparent after:to-blue-500/10',
      'after:opacity-0 after:transition-opacity after:duration-300',
      'after:pointer-events-none'
    )
  }

  // Gradient overlay
  if (gradient) {
    classes.push(
      'before:absolute before:inset-0 before:rounded-[inherit]',
      'before:bg-gradient-to-br before:from-white/5 before:via-transparent before:to-white/5',
      'before:pointer-events-none'
    )
  }

  // Hover effects
  if (hover) {
    classes.push(
      'transition-all duration-300 ease-out',
      'hover:bg-white/25 dark:hover:bg-white/[0.08]',
      'hover:backdrop-blur-2xl',
      'hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30',
      'hover:-translate-y-0.5'
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
      'active:backdrop-blur-3xl'
    )
  }

  // Base positioning for pseudo-elements
  if (glow || gradient) {
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
} as const

/**
 * Helper function to get preset classes
 */
export function getGlassPreset(preset: keyof typeof glassPresets): string {
  return getGlassClasses(glassPresets[preset])
}
