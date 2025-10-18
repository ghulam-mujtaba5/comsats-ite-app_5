"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'
import { UnifiedGlassCard } from "@/components/shared/UnifiedGlassCard"

const tooltipContentVariants = cva(
  "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        glass: "",
        "glass-subtle": "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Use the primitive components directly
const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

interface TooltipContentProps
  extends React.ComponentProps<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipContentVariants> {}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, variant, sideOffset = 0, children, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "transition-none" 
    : "transition-all animate-duration-300 animate-ease-default"

  // If it's a glass variant, use UnifiedGlassCard
  if (variant === "glass" || variant === "glass-subtle") {
    const glassVariant = variant === "glass-subtle" ? "subtle" : "base"
    
    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          ref={ref}
          data-slot="tooltip-content"
          sideOffset={sideOffset}
          className={cn(
            "p-0 border-0",
            animationClasses,
            className
          )}
          {...props}
        >
          <UnifiedGlassCard
            variant={glassVariant}
            className="px-3 py-1.5"
          >
            {children}
          </UnifiedGlassCard>
          <TooltipPrimitive.Arrow className={cn(
            "z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]",
            glassVariant === "base" ? "bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700" : 
            "bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
          )} />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    )
  }

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          tooltipContentVariants({ variant }),
          animationClasses,
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className={cn(
          "z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]",
          "bg-primary fill-primary"
        )} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
})
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }