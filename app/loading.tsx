import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Sparkles, Zap, BookOpen } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-mesh overflow-hidden relative flex flex-col">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '4s' }} />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-primary/30 rotate-45 animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-20 w-6 h-6 bg-blue-500/30 rounded-full animate-bounce" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-500/30 rotate-45 animate-bounce" style={{ animationDelay: '5s' }} />
      </div>

      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-blue-500/8" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20" />

      <main className="flex-1 flex items-center justify-center py-24 px-4 relative z-10">
        <Card className="card-modern border-0 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl">
          <CardContent className="p-12 lg:p-16 flex flex-col items-center space-y-8">
            {/* Enhanced Loading Icon */}
            <div className="relative">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/20 to-blue-600/20 hover:from-primary/30 hover:to-blue-600/30 transition-all duration-300 shadow-xl border border-primary/30 backdrop-blur-sm">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
              </div>
              
              {/* Floating sparkles around loader */}
              <div className="absolute -top-2 -right-2 animate-bounce" style={{ animationDelay: '0.5s' }}>
                <Sparkles className="h-6 w-6 text-primary/60" />
              </div>
              <div className="absolute -bottom-2 -left-2 animate-bounce" style={{ animationDelay: '1.5s' }}>
                <Zap className="h-5 w-5 text-blue-500/60" />
              </div>
              <div className="absolute top-1/2 -right-6 animate-bounce" style={{ animationDelay: '2.5s' }}>
                <BookOpen className="h-4 w-4 text-purple-500/60" />
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Loading
                </span>
                <span className="animate-pulse">...</span>
              </h2>
              <p className="text-lg lg:text-xl text-muted-foreground font-serif leading-relaxed max-w-md">
                Please wait while we prepare your content
              </p>
              
              {/* Loading progress indicator */}
              <div className="w-full max-w-xs mx-auto mt-6">
                <div className="h-2 bg-gradient-to-r from-muted/30 to-muted/10 rounded-full overflow-hidden backdrop-blur-sm">
                  <div className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
              
              {/* Loading tips */}
              <div className="pt-6 border-t border-border/50 mt-8">
                <p className="text-sm text-muted-foreground/80 font-light italic">
                  "Great things take time to load perfectly"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
