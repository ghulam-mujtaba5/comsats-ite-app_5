import { CenteredLoader } from "@/components/ui/loading-spinner"

export default function Loading() {
  return (
    <div className="min-h-screen bg-mesh overflow-hidden relative flex items-center justify-center">
      {/* Subtle animated background for specific loading pages */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/15 to-blue-500/15 rounded-full blur-3xl animate-pulse float" />
  <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse float animate-delay-2000" />
      </div>
      
      <div className="relative z-10">
        <CenteredLoader message="Loading community content..." />
      </div>
    </div>
  )
}
