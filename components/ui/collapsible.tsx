"use client"

import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const collapsibleContentVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "",
        glass: "bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-lg shadow-glass",
        "glass-subtle": "bg-white/5 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-glass-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Use the primitive components directly
const Collapsible = CollapsiblePrimitive.Root

interface CollapsibleTriggerProps
  extends React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger> {}

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleTrigger>,
  CollapsibleTriggerProps
>(({ ...props }, ref) => {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      ref={ref}
      data-slot="collapsible-trigger"
      {...props}
    />
  )
})
CollapsibleTrigger.displayName = CollapsiblePrimitive.CollapsibleTrigger.displayName

interface CollapsibleContentProps
  extends React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>,
    VariantProps<typeof collapsibleContentVariants> {}

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  CollapsibleContentProps
>(({ className, variant, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "transition-none" 
    : "transition-all animate-duration-300 animate-ease-default"

  return (
    <CollapsiblePrimitive.CollapsibleContent
      ref={ref}
      data-slot="collapsible-content"
      className={cn(
        collapsibleContentVariants({ variant }),
        animationClasses,
        className,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    />
  )
})
CollapsibleContent.displayName = CollapsiblePrimitive.CollapsibleContent.displayName

export { Collapsible, CollapsibleTrigger, CollapsibleContent }