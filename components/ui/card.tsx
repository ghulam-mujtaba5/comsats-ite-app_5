"use client"

import * as React from "react"
import { useMicroInteraction, usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'
import { getEnhancedGlassClasses, glassPresets, glassAccessibility } from "@/lib/glassmorphism-2025"

import { cn } from "@/lib/utils"

type CardProps = React.ComponentProps<"div"> & {
  variant?: "default" | "elevated" | "soft" | "glass" | "glass-premium" | "glass-floating" | "glass-layered"
  enableHover?: boolean
  enablePress?: boolean
  accessibility?: {
    reducedMotion?: boolean
    highContrast?: boolean
    focusVisible?: boolean
  }
  role?: string
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
    ...props 
  }, ref) => {
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

    // Get glassmorphism classes based on variant
    let glassClasses = ""
    switch (variant) {
      case "elevated":
        glassClasses = getEnhancedGlassClasses({
          ...glassPresets.card,
          accessibility
        })
        break
      case "soft":
        glassClasses = getEnhancedGlassClasses({ 
          variant: 'glass-subtle',
          accessibility
        })
        break
      case "glass":
        glassClasses = getEnhancedGlassClasses({
          ...glassPresets.card,
          accessibility
        })
        break
      case "glass-premium":
        glassClasses = getEnhancedGlassClasses({
          ...glassPresets.cardPremium,
          accessibility
        })
        break
      case "glass-floating":
        glassClasses = getEnhancedGlassClasses({
          ...glassPresets.floatingCard,
          accessibility
        })
        break
      case "glass-layered":
        glassClasses = getEnhancedGlassClasses({
          ...glassPresets.layeredCard,
          accessibility
        })
        break
      default:
        glassClasses = ""
    }

    // Get accessibility classes
    const focusClasses = glassAccessibility.getFocusClasses()
    const textContrastClasses = glassAccessibility.getTextContrastClasses(
      variant === "soft" ? 'glass-subtle' : 
      variant === "glass" || variant === "elevated" ? 'glass-card' :
      variant === "glass-premium" ? 'glass-premium' :
      variant === "glass-floating" ? 'glass-floating' :
      variant === "glass-layered" ? 'glass-layered' : 'glass-secondary'
    )

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
          // Accessibility classes
          focusClasses,
          textContrastClasses,
          // Glassmorphism classes
          glassClasses,
          className
        )}
        role={role}
        aria-label={ariaLabel}
        {...glassAccessibility.getAriaAttributes(role, ariaLabel)}
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
      />
    )
  }
)

Card.displayName = "Card"

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
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
      className={cn("text-muted-foreground text-sm", className)}
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
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
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