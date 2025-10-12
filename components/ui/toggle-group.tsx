"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { cva, type VariantProps } from "@/lib/cva"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const toggleGroupVariants = cva("flex items-center justify-center gap-1", {
  variants: {
    variant: {
      default: "bg-transparent",
      outline: "border border-input bg-transparent shadow-xs",
      glass: "bg-white/10 backdrop-blur-xl border border-white/20 shadow-glass",
      "glass-subtle": "bg-white/5 backdrop-blur-lg border border-white/10 shadow-glass-sm",
    },
    size: {
      default: "h-9",
      sm: "h-8",
      lg: "h-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

type ToggleGroupProps = (
  ToggleGroupPrimitive.ToggleGroupSingleProps | ToggleGroupPrimitive.ToggleGroupMultipleProps
) & VariantProps<typeof toggleGroupVariants> & { className?: string }

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(({ className, variant, size, children, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "transition-none" 
    : "transition-all animate-duration-300 animate-ease-default"

  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn(
        toggleGroupVariants({ variant, size, className }),
        animationClasses,
        variant?.startsWith("glass") && "dark"
      )}
      {...(props as any)}
    >
      {children}
    </ToggleGroupPrimitive.Root>
  )
})

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

type ToggleGroupItemBase = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
type ToggleGroupItemProps = Omit<ToggleGroupItemBase, 'value'> &
  { value?: string } &
  VariantProps<typeof toggleVariants>

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ className, children, variant, size, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "transition-none" 
    : "transition-all animate-duration-300 animate-ease-spring hover:scale-105"

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({ variant, size }),
        animationClasses,
        className,
        variant?.startsWith("glass") && "dark"
      )}
      {...(props as any)}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem, toggleGroupVariants }