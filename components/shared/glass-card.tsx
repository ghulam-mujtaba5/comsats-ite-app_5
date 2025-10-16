"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getEnhancedGlassClasses, glassAccessibility } from "@/lib/glassmorphism-2025"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  glassVariant?: 'primary' | 'secondary' | 'subtle'
  hoverEffect?: boolean
  border?: boolean
  performanceOptimized?: boolean
  role?: string
  'aria-label'?: string
}

export function GlassCard({
  title,
  description,
  children,
  className,
  glassVariant = 'secondary',
  hoverEffect = true,
  border = true,
  performanceOptimized = false,
  role,
  'aria-label': ariaLabel,
  ...props
}: GlassCardProps) {
  // Define glass variants using our new system
  const glassVariantMap = {
    primary: 'glass-primary' as const,
    secondary: 'glass-secondary' as const,
    subtle: 'glass-subtle' as const,
  }

  // Get glassmorphism classes with accessibility support
  const glassClasses = getEnhancedGlassClasses({
    variant: glassVariantMap[glassVariant],
    accessibility: {
      reducedMotion: true,
      focusVisible: true,
      highContrast: false
    }
  })

  // Define border classes
  const borderClasses = border 
    ? "glass-border-subtle" 
    : ""

  // Define hover effect classes
  const hoverClasses = hoverEffect
    ? "interactive-elevated"
    : ""

  // Performance optimization classes
  const performanceClasses = performanceOptimized
    ? "will-change-transform gpu-accelerate"
    : ""

  // Get accessibility classes
  const focusClasses = glassAccessibility.getFocusClasses()
  const textContrastClasses = glassAccessibility.getTextContrastClasses(glassVariantMap[glassVariant] as any)

  return (
    <Card 
      className={cn(
        glassClasses,
        borderClasses,
        hoverClasses,
        performanceClasses,
        focusClasses,
        textContrastClasses,
        "rounded-2xl shadow-lg transition-all duration-300",
        className
      )}
      role={role}
      aria-label={ariaLabel}
      {...glassAccessibility.getAriaAttributes(role, ariaLabel)}
      {...props}
    >
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-heading-3">{title}</CardTitle>}
          {description && <CardDescription className="text-body-md">{description}</CardDescription>
}
        </CardHeader>
      )}
      <CardContent className={title || description ? "" : "p-6"}>
        {children}
      </CardContent>
    </Card>
  )
}