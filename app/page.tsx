import type { Metadata } from "next"
import { Suspense } from "react"
import { EnhancedHero } from "@/components/home/enhanced-hero"
import { EnhancedFeatures } from "@/components/home/enhanced-features"
import { EnhancedNews } from "@/components/home/enhanced-news"
import { EnhancedCommunity } from "@/components/home/enhanced-community"
import { EnhancedFAQ } from "@/components/home/enhanced-faq"
import { EnhancedComingSoon } from "@/components/home/enhanced-coming-soon"
import { AnimatedSections } from "@/components/home/animated-sections"

// Create loading skeletons for lazy sections with professional glassmorphism and brand colors
function NewsSkeleton() {
  return (
    <div className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-gradient-to-b from-blue-50/40 to-white/60 dark:from-blue-950/30 dark:to-slate-950/50">
      <div className="app-container max-w-7xl mx-auto">
        <div className="h-10 bg-gradient-to-r from-blue-200/60 to-indigo-200/40 dark:from-blue-800/60 dark:to-indigo-800/40 rounded-xl w-1/3 mx-auto mb-12 backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/30"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="group border border-blue-200/40 dark:border-blue-800/30 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-blue-100/60 to-indigo-100/40 dark:from-blue-900/50 dark:to-indigo-900/30 rounded-t-2xl border-b border-blue-200/30 dark:border-blue-800/20" />
              <div className="p-5 sm:p-6 space-y-3">
                <div className="h-6 bg-gradient-to-r from-blue-200/60 to-indigo-200/40 dark:from-blue-800/60 dark:to-indigo-800/40 rounded-lg w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-blue-100/50 to-indigo-100/30 dark:from-blue-900/50 dark:to-indigo-900/30 rounded w-full"></div>
                  <div className="h-4 bg-gradient-to-r from-blue-100/50 to-indigo-100/30 dark:from-blue-900/50 dark:to-indigo-900/30 rounded w-5/6"></div>
                </div>
                <div className="h-10 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 dark:from-blue-600/30 dark:to-indigo-600/30 rounded-lg w-32 mt-4 border border-blue-300/30 dark:border-blue-700/30"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CommunitySkeleton() {
  return (
    <div className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-gradient-to-b from-white/60 to-blue-50/40 dark:from-slate-950/50 dark:to-blue-950/30">
      <div className="app-container max-w-7xl mx-auto">
        <div className="h-10 bg-gradient-to-r from-amber-200/60 to-orange-200/40 dark:from-amber-800/60 dark:to-orange-800/40 rounded-xl w-1/3 mx-auto mb-12 backdrop-blur-sm border border-amber-200/30 dark:border-amber-700/30"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border border-blue-200/40 dark:border-blue-800/30 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-blue-200/30 dark:border-blue-800/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-200/60 to-indigo-200/40 dark:from-blue-800/60 dark:to-indigo-800/40"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gradient-to-r from-blue-200/60 to-indigo-200/40 dark:from-blue-800/60 dark:to-indigo-800/40 rounded w-1/3"></div>
                  <div className="h-3 bg-gradient-to-r from-blue-100/50 to-indigo-100/30 dark:from-blue-900/50 dark:to-indigo-900/30 rounded w-1/4"></div>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="h-5 bg-gradient-to-r from-blue-200/60 to-indigo-200/40 dark:from-blue-800/60 dark:to-indigo-800/40 rounded-lg w-3/4"></div>
                <div className="h-4 bg-gradient-to-r from-blue-100/50 to-indigo-100/30 dark:from-blue-900/50 dark:to-indigo-900/30 rounded w-full"></div>
                <div className="h-4 bg-gradient-to-r from-blue-100/50 to-indigo-100/30 dark:from-blue-900/50 dark:to-indigo-900/30 rounded w-5/6"></div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-blue-200/30 dark:border-blue-800/20">
                <div className="h-8 bg-gradient-to-r from-blue-100/50 to-indigo-100/30 dark:from-blue-900/50 dark:to-indigo-900/30 rounded-lg w-20"></div>
                <div className="h-8 bg-gradient-to-r from-blue-100/50 to-indigo-100/30 dark:from-blue-900/50 dark:to-indigo-900/30 rounded-lg w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FAQSkeleton() {
  return (
    <div className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-gradient-to-b from-blue-50/40 to-white/60 dark:from-blue-950/30 dark:to-slate-950/50">
      <div className="app-container max-w-4xl mx-auto">
        <div className="h-10 bg-gradient-to-r from-blue-200/60 to-indigo-200/40 dark:from-blue-800/60 dark:to-indigo-800/40 rounded-xl w-1/3 mx-auto mb-12 backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/30"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border border-blue-200/40 dark:border-blue-800/30 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gradient-to-r from-blue-200/60 to-indigo-200/40 dark:from-blue-800/60 dark:to-indigo-800/40 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-gradient-to-r from-blue-100/50 to-indigo-100/30 dark:from-blue-900/50 dark:to-indigo-900/30 rounded w-full"></div>
                  <div className="h-4 bg-gradient-to-r from-blue-100/50 to-indigo-100/30 dark:from-blue-900/50 dark:to-indigo-900/30 rounded w-5/6"></div>
                </div>
                <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-200/60 to-indigo-200/40 dark:from-blue-800/60 dark:to-indigo-800/40"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ComingSoonSkeleton() {
  return (
    <div className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-gradient-to-b from-white/60 to-amber-50/40 dark:from-slate-950/50 dark:to-amber-950/30">
      <div className="app-container max-w-7xl mx-auto">
        <div className="h-10 bg-gradient-to-r from-amber-200/60 to-orange-200/40 dark:from-amber-800/60 dark:to-orange-800/40 rounded-xl w-1/3 mx-auto mb-12 backdrop-blur-sm border border-amber-200/30 dark:border-amber-700/30"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-amber-200/40 dark:border-amber-800/30 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg">
              <div className="p-5 sm:p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/30 to-orange-500/30 dark:from-amber-600/40 dark:to-orange-600/40 border border-amber-300/30 dark:border-amber-700/30"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-gradient-to-r from-amber-200/60 to-orange-200/40 dark:from-amber-800/60 dark:to-orange-800/40 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-gradient-to-r from-amber-100/50 to-orange-100/30 dark:from-amber-900/50 dark:to-orange-900/30 rounded w-full"></div>
                  <div className="h-4 bg-gradient-to-r from-amber-100/50 to-orange-100/30 dark:from-amber-900/50 dark:to-orange-900/30 rounded w-5/6"></div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-amber-200/30 dark:border-amber-800/20">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-amber-200/60 to-orange-200/40 dark:from-amber-800/60 dark:to-orange-800/40"></div>
                  <div className="h-3 bg-gradient-to-r from-amber-100/50 to-orange-100/30 dark:from-amber-900/50 dark:to-orange-900/30 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AnimatedSectionsSkeleton() {
  return (
    <div className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-gradient-to-b from-blue-50/40 to-white/60 dark:from-blue-950/30 dark:to-slate-950/50">
      <div className="app-container max-w-6xl mx-auto">
        <div className="h-10 bg-gradient-to-r from-blue-200/60 to-indigo-200/40 dark:from-blue-800/60 dark:to-indigo-800/40 rounded-xl w-1/3 mx-auto mb-12 backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/30"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-blue-200/40 dark:border-blue-800/30 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg">
              <div className="p-5 sm:p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400/30 to-indigo-500/30 dark:from-blue-600/40 dark:to-indigo-600/40 border border-blue-300/30 dark:border-blue-700/30"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-gradient-to-r from-blue-200/60 to-indigo-200/40 dark:from-blue-800/60 dark:to-indigo-800/40 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-gradient-to-r from-blue-100/50 to-indigo-100/30 dark:from-blue-900/50 dark:to-indigo-900/30 rounded w-full"></div>
                  <div className="h-4 bg-gradient-to-r from-blue-100/50 to-indigo-100/30 dark:from-blue-900/50 dark:to-indigo-900/30 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border border-blue-200/40 dark:border-blue-800/30 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-2xl p-8 sm:p-10 md:p-12 max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400/30 to-indigo-500/30 dark:from-blue-600/40 dark:to-indigo-600/40 border border-blue-300/30 dark:border-blue-700/30"></div>
          </div>
          <div className="space-y-4 text-center">
            <div className="h-8 bg-gradient-to-r from-blue-200/60 to-indigo-200/40 dark:from-blue-800/60 dark:to-indigo-800/40 rounded-xl w-1/2 mx-auto"></div>
            <div className="h-4 bg-gradient-to-r from-blue-100/50 to-indigo-100/30 dark:from-blue-900/50 dark:to-indigo-900/30 rounded-lg w-3/4 mx-auto"></div>
            <div className="h-4 bg-gradient-to-r from-blue-100/50 to-indigo-100/30 dark:from-blue-900/50 dark:to-indigo-900/30 rounded-lg w-2/3 mx-auto"></div>
            <div className="flex gap-4 justify-center mt-6 pt-6 border-t border-blue-200/30 dark:border-blue-800/20">
              <div className="h-12 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 dark:from-blue-600/40 dark:to-indigo-600/40 rounded-xl w-40 border border-blue-300/30 dark:border-blue-700/30"></div>
              <div className="h-12 bg-gradient-to-r from-blue-100/50 to-indigo-100/30 dark:from-blue-900/50 dark:to-indigo-900/30 rounded-xl w-40 border border-blue-300/30 dark:border-blue-700/30"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const revalidate = 3600 // 1 hour - cache the home page to reduce function invocations

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  title: "CampusAxis - Academic Portal for COMSATS Students",
  description: "Access past papers, calculate your GPA, explore learning resources, and read faculty reviews - all in one comprehensive academic portal designed specifically for COMSATS students."
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20">
      {/* Professional Background with Brand Colors */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Brand color gradient orbs - Blue & Amber from logo */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/15 via-blue-500/12 to-indigo-500/10 dark:from-blue-600/20 dark:via-blue-700/18 dark:to-indigo-700/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-400/12 via-amber-500/10 to-orange-500/8 dark:from-amber-600/18 dark:via-amber-700/15 dark:to-orange-700/12 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-300/8 via-indigo-300/6 to-blue-400/5 dark:from-blue-800/15 dark:via-indigo-800/12 dark:to-blue-900/10 rounded-full blur-3xl" />
        
        {/* Premium dot pattern - lighter for light mode, darker for dark mode */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%233b82f6%22%20fill-opacity%3D%220.06%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221.5%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60 dark:opacity-40" />
        
        {/* Smooth gradient overlay - different for each mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-blue-50/30 to-white/60 dark:from-slate-950/20 dark:via-blue-950/40 dark:to-slate-950/70" />
      </div>

      <main className="relative z-10 flex-1">
        <EnhancedHero />
        
        {/* Sections with consistent spacing and glassmorphism */}
        <div className="space-y-0">
          <EnhancedFeatures />
          
          {/* Lazy loaded sections */}
          <Suspense fallback={<AnimatedSectionsSkeleton />}>
            <AnimatedSections />
          </Suspense>
          
          <Suspense fallback={<ComingSoonSkeleton />}>
            <EnhancedComingSoon />
          </Suspense>
          
          <Suspense fallback={<CommunitySkeleton />}>
            <EnhancedCommunity />
          </Suspense>
          
          <Suspense fallback={<NewsSkeleton />}>
            <EnhancedNews />
          </Suspense>
          
          <Suspense fallback={<FAQSkeleton />}>
            <EnhancedFAQ />
          </Suspense>
        </div>
      </main>
    </div>
  )
}