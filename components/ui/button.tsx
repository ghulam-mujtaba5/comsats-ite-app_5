"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "cva"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { useRippleEffect, usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'
import styles from './button.module.css'
import lightStyles from './button.light.module.css'
import darkStyles from './button.dark.module.css'

const buttonVariants = {
  variant: {
    default: styles.default,
    destructive: styles.destructive,
    outline: styles.outline,
    secondary: styles.secondary,
    ghost: styles.ghost,
    link: styles.link,
    soft: styles.soft,
    subtle: styles.subtle,
    success: styles.success,
    warning: styles.warning,
    info: styles.info,
    glass: "glass", // These are special and handled by getEnhancedGlassClasses
    "glass-premium": "glass-premium",
    "campus-primary": styles['campus-primary'],
    "campus-secondary": styles['campus-secondary'],
  },
  size: {
    default: styles.default,
    sm: styles.sm,
    lg: styles.lg,
    icon: styles.icon,
    xs: styles.xs,
  },
};

interface ButtonProps extends React.ComponentProps<"button"> {
  asChild?: boolean
  'aria-label'?: string
  variant?: keyof typeof buttonVariants.variant
  size?: keyof typeof buttonVariants.size
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, onClick, 'aria-label': ariaLabel, ...props }, ref) => {
    const { ripples, createRipple } = useRippleEffect()
    const prefersReducedMotion = usePrefersReducedMotion()
    const { theme } = useTheme();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(e)
      onClick?.(e)
    }

    const Comp = asChild ? Slot : "button"

    const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(
          styles.button,
          variant && buttonVariants.variant[variant],
          size && buttonVariants.size[size],
          variant && themeStyles[variant],
          className,
          prefersReducedMotion ? "transition-none" : ""
        )}
        onClick={handleClick}
        aria-label={ariaLabel}
        {...props}
      >
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className={cn(
              styles.ripple,
              prefersReducedMotion ? "" : "animate-ripple"
            )}
            style={{
              top: ripple.y,
              left: ripple.x,
              width: '100px',
              height: '100px',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
        {props.children}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button }