"use client"

import * as React from "react"
import { useMicroInteraction, usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'
import { getEnhancedGlassClasses, glassPresets, glassAccessibility } from "@/lib/glassmorphism-2025"

import { cn } from "@/lib/utils"
import { UnifiedGlassCard } from "@/components/shared/UnifiedGlassCard"

type CardProps = React.ComponentProps<"div"> & {
  variant?: "default" | "elevated" | "soft" | "glass" | "glass-premium" | "glass-floating" | "glass-layered"
  enableHover?: boolean
  enablePress?: boolean
  accessibility?: {
    reducedMotion?: boolean
    highContrast?: boolean
    focusVisible?: boolean
  }
  role?: React.AriaRole
  'aria-label'?: string
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = "default", 
    enableHover = true, 
    enablePress = true,
    accessibility = {},
    role,
    'aria-label': ariaLabel,
    children,
    ...props 
  }, ref) => {
    // If it's a glass variant, use the new UnifiedGlassCard component
    if (variant.startsWith("glass")) {
      // Map legacy variants to new variants
      const glassVariantMap = {
        "soft": "subtle",
        "glass": "base",
        "glass-premium": "premium",
        "glass-floating": "base",
        "glass-layered": "medium",
        "elevated": "medium"
      } as const

      // Extract glass variant
      const glassVariant = glassVariantMap[variant as keyof typeof glassVariantMap] || "base"
      
      // Extract interactive effects
      const interactive = enableHover || enablePress
      const glow = variant === "glass-premium"
      const layered = variant === "glass-layered"
      const depth = variant === "glass-floating"

      return (
        <UnifiedGlassCard
          ref={ref}
          variant={glassVariant as any}
          interactive={interactive}
          glow={glow}
          layered={layered}
          depth={depth}
          className={className}
          {...props}
        >
          {children}
        </UnifiedGlassCard>
      )
    }

    // For non-glass variants, use the existing implementation
    const { hoverVariants, tapVariants } = useMicroInteraction()
    const prefersReducedMotion = usePrefersReducedMotion()
    
    // Apply animation classes conditionally based on user preferences
    const animationClasses = prefersReducedMotion 
      ? "transition-none" 
      : "transition-all animate-duration-200 animate-ease-out will-change-transform"
      
    // Determine if the card should have interactive effects
    const interactiveClasses = enableHover || enablePress 
      ? "cursor-pointer" 
      : ""

    // Get accessibility classes
    const focusClasses = glassAccessibility.getFocusClasses()

    return (
      <div
        ref={ref}
        data-slot="card"
        data-variant={variant}
        className={cn(
          "flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
          // Micro-interactions
          animationClasses,
          interactiveClasses,
          enableHover && !prefersReducedMotion && "hover:shadow-md hover:-translate-y-0.5",
          // Mobile touch optimizations
          interactiveClasses && "select-none",
          // Accessibility classes
          focusClasses,
          className
        )}
        aria-label={ariaLabel}
        {...glassAccessibility.getAriaAttributes(undefined, ariaLabel)}
        {...(enablePress && !prefersReducedMotion ? { 
          onMouseDown: (e) => {
            if (e.button === 0) { // Left mouse button
              e.currentTarget.style.transform = 'scale(0.98) translateY(2px)'
            }
          },
          onMouseUp: (e) => {
            e.currentTarget.style.transform = ''
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.transform = ''
          }
        } : {})}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-4 sm:px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-slate-700 dark:text-slate-300 text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 sm:px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-3 px-4 sm:px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}