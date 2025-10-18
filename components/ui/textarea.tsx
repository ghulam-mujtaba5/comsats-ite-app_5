import * as React from "react"

import { cn } from "@/lib/utils"
import { cva, VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'
import { UnifiedGlassCard } from "@/components/shared/UnifiedGlassCard"

const textareaVariants = cva(
  "border-input placeholder:text-slate-700 dark:text-slate-300 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default: "",
        glass: "",
        "glass-subtle": "",
      },
      textSize: {
        default: "text-base md:text-sm",
        sm: "text-xs",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      textSize: "default",
    },
  }
)

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {
  size?: VariantProps<typeof textareaVariants>["textSize"]
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, ...props }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion()
    
    // Apply animation classes conditionally based on user preferences
    const animationClasses = prefersReducedMotion 
      ? "" 
      : "transition-all duration-300 hover:scale-[1.01] focus:scale-100"

    // If it's a glass variant, use UnifiedGlassCard
    if (variant === "glass" || variant === "glass-subtle") {
      const glassVariant = variant === "glass-subtle" ? "subtle" : "base"
      
      return (
        <UnifiedGlassCard
          variant={glassVariant}
          className={cn(
            "p-0 border-0",
            animationClasses
          )}
        >
          <textarea
            data-slot="textarea"
            className={cn(
              textareaVariants({ variant: "default", textSize: size, className }),
              "bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            )}
            ref={ref}
            {...props}
          />
        </UnifiedGlassCard>
      )
    }

    return (
      <textarea
        data-slot="textarea"
        className={cn(
          textareaVariants({ variant, textSize: size, className }),
          animationClasses
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }