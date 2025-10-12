import * as React from "react"

import { cn } from "@/lib/utils"
import { cva, VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const textareaVariants = cva(
  "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default: "",
        glass: "bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder:text-white/70 focus:ring-2 focus:ring-white/30 focus:border-white/30 shadow-glass",
        "glass-subtle": "bg-white/5 backdrop-blur-lg border-white/10 text-white placeholder:text-white/60 focus:ring-1 focus:ring-white/20 focus:border-white/20 shadow-glass-sm",
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

    return (
      <textarea
        data-slot="textarea"
        className={cn(
          textareaVariants({ variant, textSize: size, className }),
          animationClasses,
          variant?.startsWith("glass") && "dark"
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }