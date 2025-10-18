/**
 * Responsive utility functions for the application
 */

// Breakpoints matching Tailwind CSS defaults
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const

export type Breakpoint = keyof typeof breakpoints

/**
 * Checks if the current screen size is at least the specified breakpoint
 */
export function isMinWidth(breakpoint: Breakpoint): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= breakpoints[breakpoint]
}

/**
 * Checks if the current screen size is at most the specified breakpoint
 */
export function isMaxWidth(breakpoint: Breakpoint): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < breakpoints[breakpoint]
}

/**
 * Gets the current breakpoint based on screen width
 */
export function getCurrentBreakpoint(): Breakpoint | null {
  if (typeof window === 'undefined') return null
  
  const width = window.innerWidth
  if (width < breakpoints.sm) return null
  if (width < breakpoints.md) return 'sm'
  if (width < breakpoints.lg) return 'md'
  if (width < breakpoints.xl) return 'lg'
  if (width < breakpoints['2xl']) return 'xl'
  return '2xl'
}

/**
 * Returns true if the device is mobile
 */
export function isMobile(): boolean {
  return isMaxWidth('sm')
}

/**
 * Returns true if the device is tablet
 */
export function isTablet(): boolean {
  return isMinWidth('md') && isMaxWidth('lg')
}

/**
 * Returns true if the device is desktop
 */
export function isDesktop(): boolean {
  return isMinWidth('lg')
}

/**
 * Returns true if the device is large desktop
 */
export function isLargeDesktop(): boolean {
  return isMinWidth('xl')
}

/**
 * Responsive grid configuration
 */
export const gridConfig = {
  cols: {
    xs: 1,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
    '2xl': 5
  },
  gap: {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 5,
    xl: 6,
    '2xl': 8
  }
} as const

/**
 * Gets responsive grid configuration based on current breakpoint
 */
export function getGridConfig() {
  const breakpoint = getCurrentBreakpoint()
  if (!breakpoint) return { cols: gridConfig.cols.xs, gap: gridConfig.gap.xs }
  
  return {
    cols: gridConfig.cols[breakpoint],
    gap: gridConfig.gap[breakpoint]
  }
}

/**
 * Responsive text size configuration
 */
export const textSize = {
  xs: {
    title: 'text-lg',
    heading: 'text-base',
    body: 'text-sm',
    caption: 'text-xs'
  },
  sm: {
    title: 'text-xl',
    heading: 'text-lg',
    body: 'text-base',
    caption: 'text-sm'
  },
  md: {
    title: 'text-2xl',
    heading: 'text-xl',
    body: 'text-base',
    caption: 'text-sm'
  },
  lg: {
    title: 'text-3xl',
    heading: 'text-2xl',
    body: 'text-lg',
    caption: 'text-base'
  },
  xl: {
    title: 'text-4xl',
    heading: 'text-3xl',
    body: 'text-xl',
    caption: 'text-lg'
  },
  '2xl': {
    title: 'text-5xl',
    heading: 'text-4xl',
    body: 'text-2xl',
    caption: 'text-xl'
  }
} as const

/**
 * Gets responsive text sizes based on current breakpoint
 */
export function getTextSizes() {
  const breakpoint = getCurrentBreakpoint()
  if (!breakpoint) return textSize.xs
  return textSize[breakpoint]
}

/**
 * Responsive spacing configuration
 */
export const spacing = {
  xs: {
    padding: 'p-2',
    margin: 'm-2',
    gap: 'gap-2'
  },
  sm: {
    padding: 'p-3',
    margin: 'm-3',
    gap: 'gap-3'
  },
  md: {
    padding: 'p-4',
    margin: 'm-4',
    gap: 'gap-4'
  },
  lg: {
    padding: 'p-5',
    margin: 'm-5',
    gap: 'gap-5'
  },
  xl: {
    padding: 'p-6',
    margin: 'm-6',
    gap: 'gap-6'
  },
  '2xl': {
    padding: 'p-8',
    margin: 'm-8',
    gap: 'gap-8'
  }
} as const

/**
 * Gets responsive spacing based on current breakpoint
 */
export function getSpacing() {
  const breakpoint = getCurrentBreakpoint()
  if (!breakpoint) return spacing.xs
  return spacing[breakpoint]
}

/**
 * Touch device detection
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * Hover capability detection
 */
export function hasHover(): boolean {
  if (typeof window === 'undefined') return false
  return !isTouchDevice() || window.matchMedia('(hover: hover)').matches
}

/**
 * Responsive image sizes
 */
export const imageSizes = {
  avatar: {
    xs: 32,
    sm: 36,
    md: 40,
    lg: 48,
    xl: 56,
    '2xl': 64
  },
  thumbnail: {
    xs: 80,
    sm: 100,
    md: 120,
    lg: 160,
    xl: 200,
    '2xl': 240
  },
  card: {
    xs: 200,
    sm: 240,
    md: 280,
    lg: 320,
    xl: 360,
    '2xl': 400
  }
} as const

/**
 * Gets responsive image size based on current breakpoint
 */
export function getImageSize(type: keyof typeof imageSizes) {
  const breakpoint = getCurrentBreakpoint()
  if (!breakpoint) return imageSizes[type].xs
  return imageSizes[type][breakpoint]
}