import * as React from "react"
import { cva, type VariantProps } from "@/lib/cva"
import { getEnhancedGlassClasses, glassPresets } from "@/lib/glassmorphism-2025"

import { cn } from "@/lib/utils"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const alertVariants = cva(
  "relative w-full rounded-2xl border-2 px-6 py-4 text-base grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-4 gap-y-2 items-start [&>svg]:size-5 [&>svg]:translate-y-0.5 [&>svg]:text-current transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border shadow-sm",
        destructive:
          "text-destructive bg-destructive/10 border-destructive/30 [&>svg]:text-destructive *:data-[slot=alert-description]:text-destructive/90 shadow-sm",
        success: "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30 [&>svg]:text-[#22C55E] *:data-[slot=alert-description]:text-[#22C55E]/90 shadow-sm",
        warning: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30 [&>svg]:text-[#F59E0B] *:data-[slot=alert-description]:text-[#F59E0B]/90 shadow-sm",
        info: "text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/30 [&>svg]:text-[#3B82F6] *:data-[slot=alert-description]:text-[#3B82F6]/90 shadow-sm",
        glass: getEnhancedGlassClasses({
          ...glassPresets.card,
          accessibility: {
            reducedMotion: true,
            focusVisible: true
          }
        }),
        "glass-subtle": getEnhancedGlassClasses({
          ...glassPresets.card,
          variant: 'glass-subtle',
          accessibility: {
            reducedMotion: true,
            focusVisible: true
          }
        }),
        campus: "text-[#007BFF] dark:text-[#1F8FFF] bg-[#007BFF]/10 dark:bg-[#1F8FFF]/10 border-[#007BFF]/30 dark:border-[#1F8FFF]/30 [&>svg]:text-[#007BFF] dark:[&>svg]:text-[#1F8FFF] shadow-sm",
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