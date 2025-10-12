import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LucideIcon, Plus, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
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
  className
}: EmptyStateProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="text-center pb-4">
        {Icon && (
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-muted rounded-full">
              <Icon className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
        )}
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      {(action || secondaryAction) && (
        <CardContent className="flex flex-col sm:flex-row gap-3 justify-center">
          {action && (
            action.href ? (
              <Button asChild>
                <a href={action.href}>
                  <Plus className="h-4 w-4 mr-2" />
                  {action.label}
                </a>
              </Button>
            ) : (
              <Button onClick={action.onClick}>
                <Plus className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            )
          )}
          {secondaryAction && (
            secondaryAction.href ? (
              <Button variant="outline" asChild>
                <a href={secondaryAction.href}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {secondaryAction.label}
                </a>
              </Button>
            ) : (
              <Button variant="outline" onClick={secondaryAction.onClick}>
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
