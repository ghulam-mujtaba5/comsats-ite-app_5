'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const inputVariants = cva(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        glass: 'bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder:text-white/70 focus:ring-2 focus:ring-white/30 focus:border-white/30 shadow-glass',
        'glass-subtle': 'bg-white/5 backdrop-blur-lg border-white/10 text-white placeholder:text-white/60 focus:ring-1 focus:ring-white/20 focus:border-white/20 shadow-glass-sm',
      },
      inputSize: {
        default: 'h-10 px-3 py-2',
        sm: 'h-9 px-2.5 py-1.5 text-xs',
        lg: 'h-11 px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  size?: VariantProps<typeof inputVariants>['inputSize']
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion()
    
    // Apply animation classes conditionally based on user preferences
    const animationClasses = prefersReducedMotion 
      ? '' 
      : 'transition-all duration-300 hover:scale-[1.02] focus:scale-100'

    return (
      <input
        type={type}
        className={cn(
          inputVariants({ variant, inputSize: size, className }),
          animationClasses,
          variant?.startsWith('glass') && 'dark'
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }