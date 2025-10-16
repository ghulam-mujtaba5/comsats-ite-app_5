'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { getEnhancedGlassClasses, glassPresets } from '@/lib/glassmorphism-2025'
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const inputVariants = cva(
  'flex w-full rounded-xl border-2 border-input bg-background px-4 py-3 text-base font-medium ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted transition-all duration-200 ease-in-out min-h-[44px]',
  {
    variants: {
      variant: {
        default: 'hover:border-primary/40',
        glass: getEnhancedGlassClasses({
          ...glassPresets.input,
          accessibility: {
            reducedMotion: true,
            focusVisible: true
          }
        }),
        'glass-subtle': getEnhancedGlassClasses({
          ...glassPresets.input,
          variant: 'glass-subtle',
          accessibility: {
            reducedMotion: true,
            focusVisible: true
          }
        }),
        campus: 'border-[#007BFF]/20 dark:border-[#1F8FFF]/20 focus:border-[#007BFF] dark:focus:border-[#1F8FFF] focus:ring-[#007BFF]/20 dark:focus:ring-[#1F8FFF]/20',
      },
      inputSize: {
        default: 'h-11 px-4 py-3 text-base',
        sm: 'h-10 px-3 py-2.5 text-sm min-h-[40px]',
        lg: 'h-12 px-5 py-4 text-lg min-h-[48px]',
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
      ? 'transition-none' 
      : 'transition-all animate-duration-300 animate-ease-spring hover:scale-[1.02] focus:scale-100'

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