import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const errorStateCardVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "border-destructive/50",
        glass: "bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-glass",
        "glass-subtle": "bg-white/5 backdrop-blur-lg border border-slate-200 dark:border-slate-700 shadow-glass-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const errorStateMessageVariants = cva(
  "rounded-lg p-3",
  {
    variants: {
      variant: {
        default: "bg-destructive/10 border border-destructive/20",
        glass: "bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-slate-700",
        "glass-subtle": "bg-white/5 backdrop-blur-lg border border-slate-200 dark:border-slate-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface ErrorStateProps extends VariantProps<typeof errorStateCardVariants> {
  title?: string
  message?: string
  error?: Error | string
  onRetry?: () => void
  showHomeButton?: boolean
}

export function ErrorState({
  title = "Failed to Load Data",
  message = "We encountered an error while fetching the data. Please try again.",
  error,
  onRetry,
  showHomeButton = false,
  variant
}: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : error
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "" 
    : "transition-all duration-300"

  return (
    <Card className={cn(
      errorStateCardVariants({ variant }),
      animationClasses,
      variant?.startsWith("glass") && "dark"
    )}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className={cn(
            "h-5 w-5",
            variant?.startsWith("glass") ? "text-white" : "text-destructive"
          )} />
          <CardTitle className={cn(
            "text-lg",
            variant?.startsWith("glass") ? "text-white" : ""
          )}>{title}</CardTitle>
        </div>
        <CardDescription className={cn(
          variant?.startsWith("glass") ? "text-white/80" : ""
        )}>{message}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <div className={cn(
            errorStateMessageVariants({ variant })
          )}>
            <p className={cn(
              "text-sm font-mono",
              variant?.startsWith("glass") ? "text-white" : "text-destructive"
            )}>{errorMessage}</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          {onRetry && (
            <Button 
              onClick={onRetry} 
              variant={variant?.startsWith("glass") ? "glass" : "default"}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          {showHomeButton && (
            <Button 
              asChild 
              variant={variant?.startsWith("glass") ? "glass-subtle" : "outline"}
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}