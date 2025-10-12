"use client"

import * as React from "react"
import { useMicroInteraction, usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

import { cn } from "@/lib/utils"

type CardProps = React.ComponentProps<"div"> & {
  variant?: "default" | "elevated" | "soft" | "glass" | "glass-premium" | "glass-floating" | "glass-layered"
  enableHover?: boolean
  enablePress?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", enableHover = true, enablePress = true, ...props }, ref) => {
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
          // Accessible focus ring using theme ring color
          "outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          // Variants with 2025 glassmorphism
          variant === "elevated" && "shadow-md glass-card glass-border-subtle glass-hover",
          variant === "soft" && "glass-light glass-border-subtle",
          variant === "glass" && "glass-card-premium glass-border-glow glass-hover-glow glass-noise",
          variant === "glass-premium" && "glass-premium glass-border-glow glass-hover-glow glass-gradient glass-noise",
          variant === "glass-floating" && "glass-floating glass-border-light glass-hover glass-noise",
          variant === "glass-layered" && "glass-layered glass-border-subtle glass-hover glass-gradient glass-depth glass-noise",
          className
        )}
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