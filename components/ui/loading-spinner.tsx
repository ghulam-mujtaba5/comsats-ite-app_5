import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const loadingSpinnerVariants = cva(
  "animate-spin",
  {
    variants: {
      variant: {
        default: "",
        glass: "text-white",
        "glass-subtle": "text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const fullPageLoaderVariants = cva(
  "fixed inset-0 z-50 flex flex-col items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-background/80 backdrop-blur-sm",
        glass: "bg-black/30 backdrop-blur-xl",
        "glass-subtle": "bg-black/20 backdrop-blur-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const centeredLoaderVariants = cva(
  "flex flex-col items-center justify-center py-12",
  {
    variants: {
      variant: {
        default: "",
        glass: "",
        "glass-subtle": "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface LoadingSpinnerProps extends VariantProps<typeof loadingSpinnerVariants> {
  className?: string
  size?: number
}

export const LoadingSpinner = ({ className, size = 24, variant }: LoadingSpinnerProps) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "animate-none" 
    : "animate-spin"

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        loadingSpinnerVariants({ variant }),
        animationClasses,
        className,
        variant?.startsWith("glass") && "dark"
      )}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

interface FullPageLoaderProps extends VariantProps<typeof fullPageLoaderVariants> {
  message?: string
}

export function FullPageLoader({ message = "Loading...", variant }: FullPageLoaderProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "" 
    : "transition-all duration-300"

  return (
    <div className={cn(
      fullPageLoaderVariants({ variant }),
      animationClasses,
      variant?.startsWith("glass") && "dark"
    )}>
      <LoadingSpinner size={48} variant={variant} />
      <p className={cn(
        "mt-4 text-lg",
        variant?.startsWith("glass") ? "text-white" : "text-muted-foreground"
      )}>{message}</p>
    </div>
  );
}

interface CenteredLoaderProps extends VariantProps<typeof centeredLoaderVariants> {
  message?: string
}

export function CenteredLoader({ message, variant }: CenteredLoaderProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "" 
    : "transition-all duration-300"
    
    return (
        <div className={cn(
          centeredLoaderVariants({ variant }),
          animationClasses,
          variant?.startsWith("glass") && "dark"
        )}>
            <LoadingSpinner size={32} variant={variant} />
            {message && <p className={cn(
              "mt-3 text-base",
              variant?.startsWith("glass") ? "text-white" : "text-muted-foreground"
            )}>{message}</p>}
        </div>
    );
}