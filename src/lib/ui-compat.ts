/**
 * UI/UX Compatibility Layer
 * 
 * Provides utilities to bridge legacy and new design systems.
 * Ensures backward compatibility while enabling gradual migration.
 * 
 * @version 2.1.0
 * @updated 2025-10-16
 */

import { colors, spacing, borderRadius, shadows } from './design-system'
import type { GlassVariant } from './glassmorphism-2025'

// ============================================
// LEGACY TO NEW CLASS MAPPING
// ============================================

/**
 * Maps legacy glass variants to new simplified classes
 */
export const GLASS_CLASS_MAP = {
  'glass-light': 'glass-subtle',
  'glass-medium': 'glass-secondary',
  'glass-card': 'glass-secondary',
  'glass-strong': 'glass-primary',
  'glass-premium': 'glass-primary',
  'glass-ultra': 'glass-primary',
  'glass-card-premium': 'glass-primary',
  'glass-nav': 'glass-primary',
  'glass-modal': 'glass-primary',
  'glass-hero': 'glass-primary',
  'glass-floating': 'glass-secondary',
  'glass-layered': 'glass-primary',
  'glass-depth': 'glass-primary',
  'glass-button': 'glass-interactive',
  'glass-input': 'glass-subtle',
} as const

/**
 * Legacy glass modifiers that should be preserved
 */
export const PRESERVED_GLASS_MODIFIERS = [
  'glass-border-subtle',
  'glass-border-light',
  'glass-border-medium',
  'glass-border-glow',
  'glass-border-gradient',
  'glass-hover',
  'glass-hover-glow',
  'glass-shimmer',
  'glass-noise',
  'glass-gradient',
  'glass-professional',
] as const

// ============================================
// MIGRATION UTILITIES
// ============================================

/**
 * Check if a class is a legacy glass class
 */
export function isLegacyGlassClass(className: string): boolean {
  return className in GLASS_CLASS_MAP
}

/**
 * Check if a class is a preserved modifier
 */
export function isPreservedModifier(className: string): boolean {
  return PRESERVED_GLASS_MODIFIERS.includes(className as any)
}

/**
 * Map legacy glass class to new class
 */
export function mapLegacyGlassClass(
  legacyClass: keyof typeof GLASS_CLASS_MAP
): string {
  return GLASS_CLASS_MAP[legacyClass]
}

/**
 * Migrate a full className string from legacy to new
 * Preserves modifiers and utility classes
 */
export function migrateClassNames(classNames: string): string {
  return classNames
    .split(' ')
    .map(className => {
      const trimmed = className.trim()
      if (!trimmed) return ''
      
      // Preserve modifiers
      if (isPreservedModifier(trimmed)) {
        return trimmed
      }
      
      // Map legacy glass classes
      if (isLegacyGlassClass(trimmed)) {
        return mapLegacyGlassClass(trimmed as keyof typeof GLASS_CLASS_MAP)
      }
      
      // Keep everything else as-is
      return trimmed
    })
    .filter(Boolean)
    .join(' ')
}

/**
 * Check if migration is recommended for a component
 */
export function shouldMigrate(classNames: string): boolean {
  const classes = classNames.split(' ')
  const legacyCount = classes.filter(isLegacyGlassClass).length
  const totalClasses = classes.length
  
  // Recommend migration if >30% of classes are legacy
  return legacyCount > 0 && (legacyCount / totalClasses) > 0.3
}

// ============================================
// BACKWARD COMPATIBILITY HELPERS
// ============================================

/**
 * Get equivalent new class for legacy usage
 */
export function getLegacyEquivalent(newClass: string): string | null {
  const reverseMap: Record<string, string> = {}
  
  for (const [legacy, modern] of Object.entries(GLASS_CLASS_MAP)) {
    if (!reverseMap[modern]) {
      reverseMap[modern] = legacy
    }
  }
  
  return reverseMap[newClass] || null
}

/**
 * Check if a component is using the new system
 */
export function usesNewSystem(classNames: string): boolean {
  const newSystemClasses = [
    'glass-primary',
    'glass-secondary',
    'glass-subtle',
    'glass-interactive',
  ]
  
  return classNames.split(' ').some(cls => newSystemClasses.includes(cls))
}

/**
 * Check if a component is using the legacy system
 */
export function usesLegacySystem(classNames: string): boolean {
  return classNames.split(' ').some(isLegacyGlassClass)
}

// ============================================
// COMPONENT ANALYSIS
// ============================================

export interface ComponentAnalysis {
  usesNewSystem: boolean
  usesLegacySystem: boolean
  legacyClasses: string[]
  newClasses: string[]
  modifierClasses: string[]
  utilityClasses: string[]
  migrationRecommended: boolean
  migratedClasses: string
}

/**
 * Analyze component class usage
 */
export function analyzeComponentClasses(classNames: string): ComponentAnalysis {
  const classes = classNames.split(' ').filter(Boolean)
  
  const legacyClasses: string[] = []
  const newClasses: string[] = []
  const modifierClasses: string[] = []
  const utilityClasses: string[] = []
  
  classes.forEach(cls => {
    if (isLegacyGlassClass(cls)) {
      legacyClasses.push(cls)
    } else if (['glass-primary', 'glass-secondary', 'glass-subtle', 'glass-interactive'].includes(cls)) {
      newClasses.push(cls)
    } else if (isPreservedModifier(cls)) {
      modifierClasses.push(cls)
    } else {
      utilityClasses.push(cls)
    }
  })
  
  return {
    usesNewSystem: newClasses.length > 0,
    usesLegacySystem: legacyClasses.length > 0,
    legacyClasses,
    newClasses,
    modifierClasses,
    utilityClasses,
    migrationRecommended: shouldMigrate(classNames),
    migratedClasses: migrateClassNames(classNames),
  }
}

// ============================================
// DESIGN TOKEN COMPATIBILITY
// ============================================

/**
 * Get color value from either legacy or new token
 */
export function getColorValue(
  token: string,
  shade?: number
): string {
  // Handle legacy format: 'primary-600'
  if (token.includes('-')) {
    const [color, weight] = token.split('-')
    if (color in colors && weight) {
      return (colors as any)[color][weight] || colors.primary.DEFAULT
    }
  }
  
  // Handle new format: 'primary' with optional shade
  if (token in colors) {
    return shade
      ? (colors as any)[token][shade] || (colors as any)[token].DEFAULT
      : (colors as any)[token].DEFAULT
  }
  
  return colors.primary.DEFAULT
}

/**
 * Get spacing value from token
 */
export function getSpacingValue(token: string | number): string {
  if (typeof token === 'number') {
    return spacing[token as keyof typeof spacing] || spacing[4]
  }
  
  // Handle legacy format: 'md', 'lg', etc.
  const legacyMap: Record<string, number> = {
    xs: 1,
    sm: 2,
    md: 4,
    lg: 6,
    xl: 8,
    '2xl': 12,
    '3xl': 16,
  }
  
  const key = legacyMap[token]
  return key ? spacing[key as keyof typeof spacing] : spacing[4]
}

/**
 * Get border radius value from token
 */
export function getBorderRadiusValue(token: string): string {
  return borderRadius[token as keyof typeof borderRadius] || borderRadius.DEFAULT
}

/**
 * Get shadow value from token
 */
export function getShadowValue(token: string): string {
  const shadow = shadows[token as keyof typeof shadows]
  if (typeof shadow === 'string') {
    return shadow
  }
  if (typeof shadows.DEFAULT === 'string') {
    return shadows.DEFAULT
  }
  return '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
}

// ============================================
// CODEMOD HELPERS
// ============================================

/**
 * Generate codemod suggestions for a file
 */
export interface CodemodSuggestion {
  line: number
  original: string
  suggested: string
  reason: string
  priority: 'low' | 'medium' | 'high'
}

/**
 * Analyze code and suggest migrations
 */
export function suggestMigrations(
  code: string,
  filePath: string
): CodemodSuggestion[] {
  const suggestions: CodemodSuggestion[] = []
  const lines = code.split('\n')
  
  lines.forEach((line, index) => {
    // Check for legacy glass classes
    const legacyMatches = line.match(/glass-(card|premium|hero|nav|modal|button|light|medium|strong|ultra)/g)
    
    if (legacyMatches) {
      const analysis = analyzeComponentClasses(line)
      
      if (analysis.migrationRecommended) {
        suggestions.push({
          line: index + 1,
          original: line,
          suggested: line.replace(
            /className="([^"]*)"/,
            `className="${analysis.migratedClasses}"`
          ),
          reason: `Migrate to new glassmorphism system (${analysis.legacyClasses.length} legacy classes found)`,
          priority: analysis.legacyClasses.length > 3 ? 'high' : 'medium',
        })
      }
    }
  })
  
  return suggestions
}

// ============================================
// TESTING UTILITIES
// ============================================

/**
 * Mock legacy class for testing
 */
export function mockLegacyClass(legacyClass: keyof typeof GLASS_CLASS_MAP): string {
  return GLASS_CLASS_MAP[legacyClass]
}

/**
 * Verify backward compatibility
 */
export function verifyBackwardCompatibility(): {
  compatible: boolean
  issues: string[]
} {
  const issues: string[] = []
  
  // Check all legacy classes have mappings
  const legacyClasses = Object.keys(GLASS_CLASS_MAP)
  legacyClasses.forEach(cls => {
    const mapped = GLASS_CLASS_MAP[cls as keyof typeof GLASS_CLASS_MAP]
    if (!mapped) {
      issues.push(`No mapping found for legacy class: ${cls}`)
    }
  })
  
  // Check modifiers are preserved
  PRESERVED_GLASS_MODIFIERS.forEach(modifier => {
    if (!isPreservedModifier(modifier)) {
      issues.push(`Modifier not preserved: ${modifier}`)
    }
  })
  
  return {
    compatible: issues.length === 0,
    issues,
  }
}

// ============================================
// EXPORT UTILITIES OBJECT
// ============================================

export const compat = {
  // Class mapping
  GLASS_CLASS_MAP,
  PRESERVED_GLASS_MODIFIERS,
  
  // Migration utilities
  isLegacyGlassClass,
  isPreservedModifier,
  mapLegacyGlassClass,
  migrateClassNames,
  shouldMigrate,
  
  // Backward compatibility
  getLegacyEquivalent,
  usesNewSystem,
  usesLegacySystem,
  
  // Analysis
  analyzeComponentClasses,
  
  // Token compatibility
  getColorValue,
  getSpacingValue,
  getBorderRadiusValue,
  getShadowValue,
  
  // Codemod
  suggestMigrations,
  
  // Testing
  mockLegacyClass,
  verifyBackwardCompatibility,
} as const

export default compat
