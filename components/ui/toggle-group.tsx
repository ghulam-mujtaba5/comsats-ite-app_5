"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { cva, type VariantProps } from "@/lib/cva"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const toggleGroupVariants = cva("flex items-center justify-center gap-1", {
  variants: {
    variant: {
      default: "bg-transparent",
      outline: "border border-input bg-transparent shadow-xs",
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

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleGroupVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root ref={ref} className={cn(toggleGroupVariants({ variant, size, className }))} {...props}>
    {children}
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => (
  <ToggleGroupPrimitive.Item ref={ref} className={cn(toggleVariants({ variant, size }), className)} {...props}>
    {children}
  </ToggleGroupPrimitive.Item>
))

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem, toggleGroupVariants }
