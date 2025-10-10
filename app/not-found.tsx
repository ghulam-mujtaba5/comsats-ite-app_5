"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileQuestion, Home, ArrowLeft, Search, ExternalLink, Compass, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-mesh overflow-hidden relative flex flex-col">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '4s' }} />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-blue-500/30 rotate-45 animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-20 w-6 h-6 bg-purple-500/30 rounded-full animate-bounce" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-cyan-500/30 rotate-45 animate-bounce" style={{ animationDelay: '5s' }} />
      </div>

      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-transparent to-purple-500/8" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20" />

      <main className="flex-1 flex items-center justify-center py-24 px-4 relative z-10">
        <div className="container mx-auto max-w-3xl text-center">
          <Card className="card-modern border-0 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl">
            <CardContent className="p-12 lg:p-16 space-y-8">
              {/* Logo + 404 Icon */}
              <div className="flex flex-col items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-20" />
                  <Image 
                    src="/logo-square.svg" 
                    alt="CampusAxis Logo" 
                    width={60} 
                    height={60} 
                    className="rounded-2xl shadow-lg relative z-10"
                  />
                </div>
                <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 transition-all duration-300 shadow-xl border border-blue-500/30 backdrop-blur-sm hover-lift relative">
                  <FileQuestion className="h-16 w-16 text-blue-500" />
                  {/* Floating question mark */}
                  <div className="absolute -top-2 -right-2 animate-bounce" style={{ animationDelay: '1s' }}>
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">?</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-6xl lg:text-8xl font-bold leading-tight text-foreground">
                    4<span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">0</span>4
                  </h1>
                  <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                    Page{" "}
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                      Not Found
                    </span>
                  </h2>
                </div>
                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-serif max-w-2xl mx-auto">
                  Sorry, we couldn't find the page you're looking for.
                </p>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-muted-foreground/80 font-light max-w-xl mx-auto leading-relaxed">
                  The page might have been moved, deleted, or you entered the wrong URL. Let's get you back on track!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 hover-lift shadow-xl font-semibold text-base h-auto"
                    >
                      <Home className="h-5 w-5 mr-3" />
                      Go Home
                      <Star className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.history) {
                        window.history.back();
                      }
                    }}
                    className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30 px-8 py-4 rounded-2xl transition-all duration-300 hover-lift shadow-lg font-semibold text-base h-auto"
                  >
                    <ArrowLeft className="h-5 w-5 mr-3" />
                    Go Back
                    <Compass className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Enhanced Popular Sections */}
              <div className="pt-8 border-t border-border/50">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Search className="h-5 w-5 text-primary" />
                  <p className="text-sm font-semibold text-muted-foreground">
                    Looking for something specific? Try these popular sections:
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Link href="/past-papers">
                    <Button variant="outline" size="sm" className="w-full bg-background/30 backdrop-blur-sm border-border/30 hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all duration-300 hover-lift">
                      Past Papers
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/gpa-calculator">
                    <Button variant="outline" size="sm" className="w-full bg-background/30 backdrop-blur-sm border-border/30 hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all duration-300 hover-lift">
                      GPA Calculator
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/faculty">
                    <Button variant="outline" size="sm" className="w-full bg-background/30 backdrop-blur-sm border-border/30 hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all duration-300 hover-lift">
                      Faculty Reviews
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/resources">
                    <Button variant="outline" size="sm" className="w-full bg-background/30 backdrop-blur-sm border-border/30 hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all duration-300 hover-lift">
                      Learning Resources
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
