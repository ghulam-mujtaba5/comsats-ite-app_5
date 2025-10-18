"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { cva, VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const checkboxVariants = cva(
  "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        glass: "bg-white/10 backdrop-blur-xl border-slate-200 dark:border-slate-700 data-[state=checked]:bg-white/20 data-[state=checked]:border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-white/30 focus:border-slate-200 dark:border-slate-700 shadow-glass",
        "glass-subtle": "bg-white/5 backdrop-blur-lg border-slate-200 dark:border-slate-700 data-[state=checked]:bg-white/15 data-[state=checked]:border-slate-200 dark:border-slate-700 focus:ring-1 focus:ring-white/20 focus:border-slate-200 dark:border-slate-700 shadow-glass-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface CheckboxProps
  extends React.ComponentProps<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, variant, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "transition-none" 
    : "transition-all animate-duration-300 animate-ease-spring hover:scale-110"

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      data-slot="checkbox"
      className={cn(
        checkboxVariants({ variant, className }),
        animationClasses,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }