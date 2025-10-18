"use client"

import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'
import { UnifiedGlassCard } from "@/components/shared/UnifiedGlassCard"

const hoverCardContentVariants = cva(
  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
  {
    variants: {
      variant: {
        default: "bg-popover text-popover-foreground",
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
const HoverCard = HoverCardPrimitive.Root

interface HoverCardTriggerProps
  extends React.ComponentProps<typeof HoverCardPrimitive.Trigger> {}

const HoverCardTrigger = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Trigger>,
  HoverCardTriggerProps
>(({ className, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "transition-none" 
    : "transition-all animate-duration-300 animate-ease-spring hover:scale-[1.02]"

  return (
    <HoverCardPrimitive.Trigger
      ref={ref}
      data-slot="hover-card-trigger"
      className={cn(
        "interactive hover-lift",
        animationClasses,
        className
      )}
      {...props}
    />
  )
})
HoverCardTrigger.displayName = HoverCardPrimitive.Trigger.displayName

interface HoverCardContentProps
  extends React.ComponentProps<typeof HoverCardPrimitive.Content>,
    VariantProps<typeof hoverCardContentVariants> {}

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  HoverCardContentProps
>(({ className, variant, align = "center", sideOffset = 4, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "transition-none" 
    : "transition-all animate-duration-300 animate-ease-default"

  // If it's a glass variant, use UnifiedGlassCard
  if (variant === "glass" || variant === "glass-subtle") {
    const glassVariant = variant === "glass-subtle" ? "subtle" : "base"
    
    return (
      <HoverCardPrimitive.Portal data-slot="hover-card-portal">
        <HoverCardPrimitive.Content
          ref={ref}
          data-slot="hover-card-content"
          align={align}
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
            className="p-4 rounded-md border"
          >
            {props.children}
          </UnifiedGlassCard>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    )
  }

  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        ref={ref}
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          hoverCardContentVariants({ variant }),
          animationClasses,
          className
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  )
})
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }