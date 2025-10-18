"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "@/lib/cva"

import { cn } from "@/lib/utils"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-slate-100 dark:bg-slate-900 hover:text-slate-700 dark:text-slate-300 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground",
        glass: "bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-slate-700 text-white hover:bg-white/20 data-[state=on]:bg-white/20 shadow-glass",
        "glass-subtle": "bg-white/5 backdrop-blur-lg border border-slate-200 dark:border-slate-700 text-white hover:bg-white/15 data-[state=on]:bg-white/15 shadow-glass-sm",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

interface ToggleProps
  extends React.ComponentProps<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {}

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ className, variant, size, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "transition-none" 
    : "transition-all animate-duration-300 animate-ease-spring hover:scale-105"

  return (
    <TogglePrimitive.Root
      ref={ref}
      data-slot="toggle"
      className={cn(
        toggleVariants({ variant, size, className }),
        animationClasses,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    />
  )
})
Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }