"use client"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const skeletonVariants = cva(
  "animate-pulse rounded-md",
  {
    variants: {
      variant: {
        default: "bg-accent",
        glass: "bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-glass",
        "glass-subtle": "bg-white/5 backdrop-blur-lg border border-slate-200 dark:border-slate-700 shadow-glass-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface SkeletonProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof skeletonVariants> {}

function Skeleton({ className, variant, ...props }: SkeletonProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "animate-none" 
    : "animate-pulse"

  return (
    <div
      data-slot="skeleton"
      className={cn(
        skeletonVariants({ variant }),
        animationClasses,
        className,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    />
  )
}

export { Skeleton }