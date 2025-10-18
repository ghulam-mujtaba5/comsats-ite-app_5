"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "@/lib/cva"
import { getEnhancedGlassClasses, glassPresets } from "@/lib/glassmorphism-2025"

import { cn } from "@/lib/utils"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-200 ease-in-out overflow-hidden active:scale-95",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-sm [a&]:hover:bg-primary/90 [a&]:hover:shadow-md",
        secondary: "border-transparent bg-secondary text-secondary-foreground shadow-sm [a&]:hover:bg-secondary/90 [a&]:hover:shadow-md",
        destructive:
          "border-transparent bg-destructive text-white shadow-sm [a&]:hover:bg-destructive/90 [a&]:hover:shadow-md focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border-2 border-primary/30 text-slate-900 dark:text-white bg-background/50 backdrop-blur-sm [a&]:hover:bg-primary/10 [a&]:hover:border-primary/50 [a&]:hover:text-primary",
        success: "border-transparent bg-[#22C55E] text-white shadow-sm [a&]:hover:bg-[#16A34A]",
        warning: "border-transparent bg-[#F59E0B] text-white shadow-sm [a&]:hover:bg-[#D97706]",
        info: "border-transparent bg-[#3B82F6] text-white shadow-sm [a&]:hover:bg-[#2563EB]",
        muted: "border-transparent bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 [a&]:hover:bg-slate-100/80 dark:bg-slate-900/80",
        soft: "border-transparent bg-primary/10 text-primary [a&]:hover:bg-primary/20",
        glass: getEnhancedGlassClasses({
          ...glassPresets.badge,
          accessibility: {
            reducedMotion: true,
            focusVisible: true
          }
        }),
        "glass-subtle": getEnhancedGlassClasses({
          ...glassPresets.badge,
          variant: 'glass-subtle',
          accessibility: {
            reducedMotion: true,
            focusVisible: true
          }
        }),
        campus: "border-transparent bg-[#007BFF] dark:bg-[#1F8FFF] text-white shadow-sm [a&]:hover:bg-[#0056b3] dark:[a&]:hover:bg-[#1F8FFF]/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span"
    const prefersReducedMotion = usePrefersReducedMotion()
    
    // Apply animation classes conditionally based on user preferences
    const animationClasses = prefersReducedMotion 
      ? "transition-none" 
      : "transition-all animate-duration-300 animate-ease-spring hover:scale-105"

    return (
      <Comp
        ref={ref}
        data-slot="badge"
        className={cn(
          badgeVariants({ variant }),
          animationClasses,
          className,
          variant?.startsWith("glass") && "dark"
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }