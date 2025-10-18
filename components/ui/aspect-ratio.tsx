"use client"

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const aspectRatioVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "",
        glass: "bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-lg shadow-glass overflow-hidden",
        "glass-subtle": "bg-white/5 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-glass-sm overflow-hidden",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface AspectRatioProps
  extends React.ComponentProps<typeof AspectRatioPrimitive.Root>,
    VariantProps<typeof aspectRatioVariants> {}

function AspectRatio({ className, variant, ...props }: AspectRatioProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "transition-none" 
    : "transition-all animate-duration-300 animate-ease-default"

  return (
    <AspectRatioPrimitive.Root
      data-slot="aspect-ratio"
      className={cn(
        aspectRatioVariants({ variant }),
        animationClasses,
        className,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    />
  )
}

export { AspectRatio }