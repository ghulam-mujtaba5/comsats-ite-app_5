import * as React from "react"
import { cva, type VariantProps } from "@/lib/cva"

import { cn } from "@/lib/utils"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
        glass: "bg-white/10 backdrop-blur-xl border-white/20 text-white shadow-glass",
        "glass-subtle": "bg-white/5 backdrop-blur-lg border-white/10 text-white shadow-glass-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

interface AlertProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion()
    
    // Apply animation classes conditionally based on user preferences
    const animationClasses = prefersReducedMotion 
      ? "transition-none" 
      : "transition-all animate-duration-300 animate-ease-default"

    return (
      <div
        ref={ref}
        data-slot="alert"
        role="alert"
        className={cn(
          alertVariants({ variant }),
          animationClasses,
          className,
          variant?.startsWith("glass") && "dark"
        )}
        {...props}
      />
    )
  }
)
Alert.displayName = "Alert"

interface AlertTitleProps extends React.ComponentProps<"div"> {}

const AlertTitle = React.forwardRef<HTMLDivElement, AlertTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="alert-title"
        className={cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className)}
        {...props}
      />
    )
  }
)
AlertTitle.displayName = "AlertTitle"

interface AlertDescriptionProps extends React.ComponentProps<"div"> {}

const AlertDescription = React.forwardRef<HTMLDivElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="alert-description"
        className={cn(
          "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
          className,
        )}
        {...props}
      />
    )
  }
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }