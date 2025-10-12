"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const scrollAreaVariants = cva(
  "relative",
  {
    variants: {
      variant: {
        default: "",
        glass: "bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-glass",
        "glass-subtle": "bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg shadow-glass-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const scrollBarVariants = cva(
  "flex touch-none p-px transition-colors select-none",
  {
    variants: {
      variant: {
        default: "",
        glass: "border-white/20",
        "glass-subtle": "border-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const scrollAreaThumbVariants = cva(
  "relative flex-1 rounded-full",
  {
    variants: {
      variant: {
        default: "bg-border",
        glass: "bg-white/30",
        "glass-subtle": "bg-white/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface ScrollAreaProps
  extends React.ComponentProps<typeof ScrollAreaPrimitive.Root>,
    VariantProps<typeof scrollAreaVariants> {}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, variant, children, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "" 
    : "transition-all animate-duration-300 animate-ease-default"

  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      data-slot="scroll-area"
      className={cn(
        scrollAreaVariants({ variant }),
        animationClasses,
        className,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className={cn(
          "focus-visible:ring-ring/50 size-full rounded-[inherit] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
          prefersReducedMotion ? "transition-none" : "transition-[color,box-shadow] animate-duration-200 animate-ease-default"
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar variant={variant} />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
})
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

interface ScrollBarProps
  extends React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
    VariantProps<typeof scrollBarVariants> {}

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, variant, orientation = "vertical", ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        scrollBarVariants({ variant }),
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className={cn(
          scrollAreaThumbVariants({ variant }),
          prefersReducedMotion ? "transition-none" : "transition-all animate-duration-200 animate-ease-default"
        )}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
})
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }