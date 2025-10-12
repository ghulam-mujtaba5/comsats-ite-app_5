import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

interface ErrorStateProps {
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
  showHomeButton = false
}: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : error

  return (
    <Card className="w-full border-destructive/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-sm text-destructive font-mono">{errorMessage}</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          {onRetry && (
            <Button onClick={onRetry} variant="default">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          {showHomeButton && (
            <Button asChild variant="outline">
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
