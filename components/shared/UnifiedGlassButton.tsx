"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import styles from './UnifiedGlassButton.module.css'

interface UnifiedGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'subtle' | 'base' | 'medium' | 'strong' | 'premium'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
  children: React.ReactNode
  className?: string
}

export const UnifiedGlassButton = React.forwardRef<HTMLButtonElement, UnifiedGlassButtonProps>(
  (
    {
      variant = 'base',
      size = 'md',
      glow = false,
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
      premium: styles.premium,
    }[variant]

    const sizeClasses = {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    }[size]

    const glassClasses = cn(
      styles.button,
      variantClasses,
      sizeClasses,
      glow && styles.glow,
      className
    )

    return (
      <button ref={ref} className={glassClasses} {...props}>
        {children}
      </button>
    )
  }
)

UnifiedGlassButton.displayName = 'UnifiedGlassButton'