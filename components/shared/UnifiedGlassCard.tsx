"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import styles from './UnifiedGlassCard.module.css'

interface UnifiedGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'subtle' | 'base' | 'medium' | 'strong' | 'intense'
  interactive?: boolean
  glow?: boolean
  layered?: boolean
  depth?: boolean
  children: React.ReactNode
  className?: string
}

export const UnifiedGlassCard = React.forwardRef<HTMLDivElement, UnifiedGlassCardProps>(
  (
    {
      variant = 'base',
      interactive = false,
      glow = false,
      layered = false,
      depth = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    // Build class names based on props
    const variantClasses = {
      subtle: styles.subtle,
      base: styles.base,
      medium: styles.medium,
      strong: styles.strong,
      intense: styles.intense,
    }[variant]

    const glassClasses = cn(
      styles.container,
      variantClasses,
      interactive && styles.interactive,
      glow && styles.glow,
      layered && styles.layered,
      depth && styles.depth,
      className
    )

    return (
      <div ref={ref} className={glassClasses} {...props}>
        {children}
      </div>
    )
  }
)

UnifiedGlassCard.displayName = 'UnifiedGlassCard'