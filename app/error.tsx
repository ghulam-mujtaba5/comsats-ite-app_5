"use client"

import { useEffect } from "react"
import styles from './error.module.css';
// Footer is provided by the root layout; avoid importing locally to prevent duplicates
import { Button } from "@/components/ui/button"
import layout from "@/app/styles/common.module.css"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home, Zap, ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
    <div className="min-h-screen bg-mesh overflow-hidden relative flex flex-col">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse float" />
  <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse float animate-delay-2000" />
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse float animate-delay-4000" />
        
        {/* Floating geometric shapes */}
  <div className="absolute top-20 right-20 w-4 h-4 bg-red-500/30 rotate-45 animate-bounce animate-delay-1000" />
  <div className="absolute bottom-32 left-20 w-6 h-6 bg-orange-500/30 rounded-full animate-bounce animate-delay-3000" />
  <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-yellow-500/30 rotate-45 animate-bounce animate-delay-5000" />
      </div>

      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/8 via-transparent to-orange-500/8" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20" />

      <main className="flex-1 flex items-center justify-center py-24 px-4 relative z-10">
        <div className={`${layout.section} ${layout.max3xl} text-center`}>
          <Card className="card-modern border-0 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl">
            <CardContent className="p-12 lg:p-16 space-y-8">
              {/* Logo + Error Icon */}
              <div className="flex flex-col items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-20" />
                  <Image 
                    src="/Campus Axis 1.svg" 
                    alt="CampusAxis Logo" 
                    width={60} 
                    height={60} 
                    className="rounded-2xl shadow-lg relative z-10"
                  />
                </div>
                <div className="p-8 rounded-3xl bg-gradient-to-br from-red-500/20 to-orange-600/20 hover:from-red-500/30 hover:to-orange-600/30 transition-all duration-300 shadow-xl border border-red-500/30 backdrop-blur-sm hover-lift">
                  <AlertTriangle className="h-16 w-16 text-red-500" />
                </div>
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-4">
                  Oops!{" "}
                  <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                    Something Went Wrong
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-serif max-w-2xl mx-auto">
                  We encountered an unexpected error while loading this page.
                </p>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-muted-foreground/80 font-light max-w-xl mx-auto leading-relaxed">
                  Don't worry, this is usually temporary. Try refreshing the page or return to the homepage to continue your journey.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button 
                    size="lg" 
                    onClick={reset}
                    className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 hover-lift shadow-xl font-semibold text-base h-auto"
                  >
                    <RefreshCw className="h-5 w-5 mr-3" />
                    Try Again
                    <Zap className="h-4 w-4 ml-2" />
                  </Button>
                  <Link href="/">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30 px-8 py-4 rounded-2xl transition-all duration-300 hover-lift shadow-lg font-semibold text-base h-auto"
                    >
                      <Home className="h-5 w-5 mr-3" />
                      Go Home
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Enhanced Quick Actions */}
              <div className="pt-8 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-6 font-medium">
                  Or try these popular sections while we fix this issue:
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/past-papers">
                    <Button variant="outline" size="sm" className="bg-background/30 backdrop-blur-sm border-border/30 hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all duration-300">
                      Past Papers
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/gpa-calculator">
                    <Button variant="outline" size="sm" className="bg-background/30 backdrop-blur-sm border-border/30 hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all duration-300">
                      GPA Calculator
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/faculty">
                    <Button variant="outline" size="sm" className="bg-background/30 backdrop-blur-sm border-border/30 hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all duration-300">
                      Faculty Reviews
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/help">
                    <Button variant="outline" size="sm" className="bg-background/30 backdrop-blur-sm border-border/30 hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all duration-300">
                      Help Center
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Enhanced Development Error Details */}
              {error && (
                <div className="pt-8 border-t border-border/50">
                  <details className="text-left" open={process.env.NODE_ENV === "development"}>
                    <summary className="cursor-pointer text-sm font-semibold text-muted-foreground mb-4 hover:text-foreground transition-colors duration-200 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Error Details {process.env.NODE_ENV === "development" && "(Development Only)"}
                    </summary>
                    <Card className="card-modern border-0 backdrop-blur-sm mt-4">
                      <CardContent className="p-6 space-y-4">
                        {error.message && (
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Error Message</h4>
                            <pre className="text-sm bg-gradient-to-br from-red-500/10 to-orange-500/10 p-4 rounded-xl overflow-auto text-foreground border border-red-500/20 backdrop-blur-sm whitespace-pre-wrap break-words">
                              {error.message}
                            </pre>
                          </div>
                        )}
                        {error.digest && (
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Error Digest</h4>
                            <pre className="text-sm bg-gradient-to-br from-orange-500/10 to-yellow-500/10 p-4 rounded-xl overflow-auto text-foreground border border-orange-500/20 backdrop-blur-sm font-mono">
                              {error.digest}
                            </pre>
                          </div>
                        )}
                        {error.stack && process.env.NODE_ENV === "development" && (
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Stack Trace</h4>
                            <pre className="text-xs bg-gradient-to-br from-red-500/10 to-orange-500/10 p-4 rounded-xl overflow-auto text-muted-foreground border border-red-500/20 backdrop-blur-sm whitespace-pre-wrap break-words max-h-64">
                              {error.stack}
                            </pre>
                          </div>
                        )}
                        {!error.message && !error.digest && !error.stack && (
                          <div>
                            <p className="text-sm text-muted-foreground italic">No additional error details available.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </details>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

    </div>
  )
}
