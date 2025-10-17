"use client"

import { Component, ReactNode, ErrorInfo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetKeys?: any[]
  showDetails?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the whole app
 * 
 * @example
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * 
 * @example
 * <ErrorBoundary 
 *   fallback={<CustomErrorUI />}
 *   onError={(error, errorInfo) => logErrorToService(error, errorInfo)}
 * >
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo)
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Log to external service (e.g., Sentry, LogRocket)
    this.logErrorToService(error, errorInfo)

    this.setState({
      errorInfo,
    })
  }

  componentDidUpdate(prevProps: Props) {
    // Reset error boundary when reset keys change
    if (this.state.hasError && this.props.resetKeys) {
      const hasResetKeysChanged = this.props.resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      )

      if (hasResetKeysChanged) {
        this.reset()
      }
    }
  }

  logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // Send to error tracking service (Sentry)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, { 
        extra: { 
          componentStack: errorInfo.componentStack 
        } 
      })
    }
    
    // For now, log to console in production
    if (process.env.NODE_ENV === "production") {
      console.error("Production error:", {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      })
    }
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full glass-card border-destructive/50">
            <CardContent className="p-8 space-y-6">
              {/* Error Icon */}
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-destructive/10 backdrop-blur-sm">
                  <AlertTriangle className="h-12 w-12 text-destructive" />
                </div>
              </div>

              {/* Error Message */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Something went wrong</h2>
                <p className="text-muted-foreground">
                  We encountered an unexpected error. Please try refreshing the page.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={this.reset}
                  variant="default"
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Link href="/">
                  <Button variant="outline" className="gap-2 w-full">
                    <Home className="h-4 w-4" />
                    Go Home
                  </Button>
                </Link>
              </div>

              {/* Error Details (Development/Optional) */}
              {(this.props.showDetails || process.env.NODE_ENV === "development") &&
                this.state.error && (
                  <details className="mt-6">
                    <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                      Error Details (Development Only)
                    </summary>
                    <div className="mt-4 space-y-4">
                      {/* Error Message */}
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                          Error Message
                        </h4>
                        <pre className="text-sm bg-destructive/10 p-4 rounded-lg overflow-auto border border-destructive/20 whitespace-pre-wrap break-words">
                          {this.state.error.message}
                        </pre>
                      </div>

                      {/* Stack Trace */}
                      {this.state.error.stack && (
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                            Stack Trace
                          </h4>
                          <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto border border-border whitespace-pre-wrap break-words max-h-48">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}

                      {/* Component Stack */}
                      {this.state.errorInfo?.componentStack && (
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                            Component Stack
                          </h4>
                          <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto border border-border whitespace-pre-wrap break-words max-h-48">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Lightweight error boundary for smaller components
 */
export function InlineErrorBoundary({ children, fallback }: Props) {
  return (
    <ErrorBoundary
      fallback={
        fallback || (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Failed to load component</span>
            </div>
          </div>
        )
      }
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * Section error boundary with back navigation
 */
export function SectionErrorBoundary({ children, sectionName }: Props & { sectionName?: string }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-[300px] flex items-center justify-center p-4">
          <Card className="max-w-md w-full glass-card">
            <CardContent className="p-6 space-y-4 text-center">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-destructive/10">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">
                  {sectionName ? `${sectionName} Unavailable` : "Section Unavailable"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  This section encountered an error
                </p>
              </div>
              <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
