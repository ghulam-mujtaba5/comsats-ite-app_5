
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import layout from "@/app/styles/common.module.css"

export default function Loading() {
  return (
    <div className="min-h-screen bg-mesh overflow-hidden relative flex flex-col">
      {/* Subtle animated background for specific loading pages */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/15 to-blue-500/15 rounded-full blur-3xl animate-pulse float" />
    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse float animate-delay-2000" />
      </div>
      
      <main className="flex-1 py-8 px-4 relative z-10">
        <div className={`${layout.section} ${layout.max6xl}`}>
          {/* Header Skeleton */}
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-48 mx-auto mb-4 rounded-xl" />
            <Skeleton className="h-6 w-96 mx-auto mb-6 rounded-xl" />
            <Skeleton className="h-10 w-32 mx-auto rounded-xl" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="glass-secondary rounded-3xl transition-all duration-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-xl" />
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-12 rounded-xl" />
                      <Skeleton className="h-4 w-16 rounded-xl" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Course Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="glass-secondary rounded-3xl transition-all duration-500">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-48 rounded-xl" />
                      <Skeleton className="h-4 w-32 rounded-xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded-xl" />
                          <Skeleton className="h-4 w-16 rounded-xl" />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-20 rounded-xl" />
                      <Skeleton className="h-10 w-24 rounded-xl" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
