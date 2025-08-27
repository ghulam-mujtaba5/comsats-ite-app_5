import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-mesh overflow-hidden relative flex flex-col">
      {/* Subtle animated background for specific loading pages */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/15 to-blue-500/15 rounded-full blur-3xl animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '2s' }} />
      </div>
      
      <main className="flex-1 py-8 px-4 relative z-10">
        <div className="container mx-auto max-w-7xl">
          {/* Header Skeleton */}
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-48 mx-auto mb-4 rounded-xl" />
            <Skeleton className="h-6 w-96 mx-auto rounded-xl" />
          </div>

          {/* Calendar View Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar Skeleton */}
            <div className="lg:col-span-2">
              <Card className="card-modern border-0 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-8 w-32 rounded-xl" />
                      <div className="flex gap-3">
                        <Skeleton className="h-10 w-10 rounded-xl" />
                        <Skeleton className="h-10 w-10 rounded-xl" />
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-3">
                      {Array.from({ length: 35 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-xl" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Events List Skeleton */}
            <div>
              <Card className="card-modern border-0 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <Skeleton className="h-6 w-32 rounded-xl" />
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="space-y-3">
                        <Skeleton className="h-5 w-full rounded-xl" />
                        <Skeleton className="h-4 w-3/4 rounded-xl" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
