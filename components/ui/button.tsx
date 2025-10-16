import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "@/lib/cva"

import { cn } from "@/lib/utils"
import { useRippleEffect, usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 active:scale-[0.98] relative overflow-hidden min-h-[44px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:-translate-y-0.5 shadow-[0_4px_12px_rgba(37,99,235,0.3)]",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90 hover:-translate-y-0.5 focus-visible:ring-destructive/40 shadow-[0_4px_12px_rgba(239,68,68,0.3)]",
        outline:
          "border-2 border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-primary/5 hover:border-primary/40 dark:border-primary/30 dark:hover:bg-primary/10",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:-translate-y-0.5",
        ghost: "hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20",
        link: "text-primary underline-offset-4 hover:underline min-h-0",
        soft: "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/15 dark:hover:bg-primary/25",
        subtle: "bg-muted text-foreground/90 hover:bg-muted/80 dark:text-foreground",
        success: "bg-[#22C55E] text-white hover:bg-[#16A34A] shadow-[0_4px_12px_rgba(34,197,94,0.3)]",
        warning: "bg-[#F59E0B] text-white hover:bg-[#D97706] shadow-[0_4px_12px_rgba(245,158,11,0.3)]",
        info: "bg-[#3B82F6] text-white hover:bg-[#2563EB] shadow-[0_4px_12px_rgba(59,130,246,0.3)]",
        glass: "glass-button glass-border-subtle glass-hover glass-interactive backdrop-blur-[15px] bg-white/70 dark:bg-white/5 dark:backdrop-blur-[25px] border border-white/20 dark:border-white/10",
        "glass-premium": "glass-premium glass-border-glow glass-hover-glow glass-interactive backdrop-blur-[20px]",
        "campus-primary": "bg-[#007BFF] dark:bg-[#1F8FFF] text-white shadow-[0_4px_12px_rgba(0,123,255,0.3)] dark:shadow-[0_0_20px_rgba(31,143,255,0.5)] hover:bg-[#0056b3] dark:hover:bg-[#1F8FFF]/90 hover:-translate-y-0.5",
        "campus-secondary": "bg-white dark:bg-black text-[#007BFF] dark:text-[#1F8FFF] border-2 border-[#007BFF] dark:border-[#1F8FFF] hover:bg-[#007BFF]/5 dark:hover:bg-[#1F8FFF]/10 hover:border-[#0056b3] dark:hover:border-[#1F8FFF]/90",
      },
      size: {
        default: "h-11 px-6 py-3 has-[>svg]:px-5 text-base",
        sm: "h-10 px-4 py-2.5 has-[>svg]:px-3 text-sm",
        lg: "h-12 px-8 py-4 has-[>svg]:px-6 text-lg",
        icon: "size-11 p-0",
        xs: "h-9 px-3 py-2 text-xs has-[>svg]:px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

interface ButtonProps extends React.ComponentProps<"button">,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const { ripples, createRipple } = useRippleEffect()
    const prefersReducedMotion = usePrefersReducedMotion()
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(e)
      onClick?.(e)
    }

    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(
          buttonVariants({ variant, size }), 
          className,
          prefersReducedMotion ? "transition-none" : ""
        )}
        onClick={handleClick}
        {...props}
      >
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className={cn(
              "absolute rounded-full bg-current opacity-30",
              prefersReducedMotion ? "" : "animate-ripple"
            )}
            style={{
              top: ripple.y,
              left: ripple.x,
              width: '100px',
              height: '100px',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
        {props.children}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }