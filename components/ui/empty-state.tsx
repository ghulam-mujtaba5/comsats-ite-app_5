import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LucideIcon, Plus, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const emptyStateCardVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "",
        glass: "bg-white/10 backdrop-blur-xl border border-white/20 shadow-glass",
        "glass-subtle": "bg-white/5 backdrop-blur-lg border border-white/10 shadow-glass-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const emptyStateIconVariants = cva(
  "flex justify-center mb-4",
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

interface EmptyStateProps extends VariantProps<typeof emptyStateCardVariants> {
  icon?: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
  secondaryAction?: {
    label: string
    onClick?: () => void
    href?: string
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  variant,
  className
}: EmptyStateProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "" 
    : "transition-all duration-300"

  return (
    <Card className={cn(
      emptyStateCardVariants({ variant }),
      animationClasses,
      className,
      variant?.startsWith("glass") && "dark"
    )}>
      <CardHeader className="text-center pb-4">
        {Icon && (
          <div className={cn(
            emptyStateIconVariants({ variant })
          )}>
            <div className={cn(
              "p-4 rounded-full",
              variant === "glass" ? "bg-white/10" : 
              variant === "glass-subtle" ? "bg-white/5" : 
              "bg-muted"
            )}>
              <Icon className={cn(
                "h-8 w-8",
                variant?.startsWith("glass") ? "text-white" : "text-muted-foreground"
              )} />
            </div>
          </div>
        )}
        <CardTitle className={cn(
          "text-xl",
          variant?.startsWith("glass") ? "text-white" : ""
        )}>{title}</CardTitle>
        <CardDescription className={cn(
          "text-base",
          variant?.startsWith("glass") ? "text-white/80" : ""
        )}>{description}</CardDescription>
      </CardHeader>
      {(action || secondaryAction) && (
        <CardContent className="flex flex-col sm:flex-row gap-3 justify-center">
          {action && (
            action.href ? (
              <Button 
                asChild
                variant={variant?.startsWith("glass") ? "glass" : "default"}
              >
                <a href={action.href}>
                  <Plus className="h-4 w-4 mr-2" />
                  {action.label}
                </a>
              </Button>
            ) : (
              <Button 
                onClick={action.onClick}
                variant={variant?.startsWith("glass") ? "glass" : "default"}
              >
                <Plus className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            )
          )}
          {secondaryAction && (
            secondaryAction.href ? (
              <Button 
                variant={variant?.startsWith("glass") ? "glass-subtle" : "outline"} 
                asChild
              >
                <a href={secondaryAction.href}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {secondaryAction.label}
                </a>
              </Button>
            ) : (
              <Button 
                variant={variant?.startsWith("glass") ? "glass-subtle" : "outline"} 
                onClick={secondaryAction.onClick}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {secondaryAction.label}
              </Button>
            )
          )}
        </CardContent>
      )}
    </Card>
  )
}