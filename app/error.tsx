"use client"

import { useEffect } from "react"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <Card className="p-12">
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <AlertTriangle className="h-24 w-24 text-blue-500" />
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-foreground">Something went wrong!</h1>
                <p className="text-lg text-muted-foreground">
                  We encountered an unexpected error while loading this page.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Don't worry, this is usually temporary. Try refreshing the page or go back to the homepage.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" onClick={reset}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Link href="/">
                    <Button variant="outline" size="lg" className="bg-transparent">
                      <Home className="h-4 w-4 mr-2" />
                      Go Home
                    </Button>
                  </Link>
                </div>
              </div>

              {process.env.NODE_ENV === "development" && error.message && (
                <div className="pt-6 border-t border-border">
                  <details className="text-left">
                    <summary className="cursor-pointer text-sm font-medium text-muted-foreground mb-2">
                      Error Details (Development Only)
                    </summary>
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-auto text-muted-foreground">
                      {error.message}
                    </pre>
                  </details>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
