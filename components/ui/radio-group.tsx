"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { cva, VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const radioGroupItemVariants = cva(
  "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        glass: "bg-white/10 backdrop-blur-xl border-slate-200 dark:border-slate-700 text-white focus:ring-2 focus:ring-white/30 focus:border-slate-200 dark:border-slate-700 shadow-glass",
        "glass-subtle": "bg-white/5 backdrop-blur-lg border-slate-200 dark:border-slate-700 text-white focus:ring-1 focus:ring-white/20 focus:border-slate-200 dark:border-slate-700 shadow-glass-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface RadioGroupProps
  extends React.ComponentProps<typeof RadioGroupPrimitive.Root> {}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

interface RadioGroupItemProps
  extends React.ComponentProps<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioGroupItemVariants> {}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, variant, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "" 
    : "transition-all duration-300 hover:scale-110"

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      data-slot="radio-group-item"
      className={cn(
        radioGroupItemVariants({ variant, className }),
        animationClasses,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }