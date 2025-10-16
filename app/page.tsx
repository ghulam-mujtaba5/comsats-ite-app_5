import type { Metadata } from "next"
import { Suspense } from "react"
import { EnhancedHero } from "@/components/home/enhanced-hero"
import { EnhancedFeatures } from "@/components/home/enhanced-features"
import { EnhancedNews } from "@/components/home/enhanced-news"
import { EnhancedCommunity } from "@/components/home/enhanced-community"
import { EnhancedFAQ } from "@/components/home/enhanced-faq"
import { EnhancedComingSoon } from "@/components/home/enhanced-coming-soon"
import { AnimatedSections } from "@/components/home/animated-sections"

// Create loading skeletons for lazy sections
function NewsSkeleton() {
  return (
    <div className="py-20 px-4">
      <div className="app-container max-w-6xl mx-auto">
        <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border border-white/20 rounded-2xl bg-card/50">
              <div className="aspect-video bg-muted rounded-t-2xl" />
              <div className="p-4 sm:p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-5/6 mb-4"></div>
                <div className="h-10 bg-muted rounded w-32"></div>
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
    <div className="py-20 px-4">
      <div className="app-container max-w-6xl mx-auto">
        <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border border-white/20 rounded-2xl bg-card/50">
              <div className="p-4 sm:p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-5/6 mb-4"></div>
                <div className="h-10 bg-muted rounded w-32"></div>
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
    <div className="py-20 px-4">
      <div className="app-container max-w-6xl mx-auto">
        <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-8"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-white/20 rounded-2xl bg-card/50 p-4 sm:p-6">
              <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ComingSoonSkeleton() {
  return (
    <div className="py-20 px-4">
      <div className="app-container max-w-6xl mx-auto">
        <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-white/20 rounded-2xl bg-card/50">
              <div className="p-4 sm:p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-5/6 mb-4"></div>
                <div className="h-10 bg-muted rounded w-32"></div>
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
    <div className="py-20 px-4">
      <div className="app-container max-w-6xl mx-auto">
        <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-white/20 rounded-2xl bg-card/50">
              <div className="p-4 sm:p-6">
                <div className="h-12 bg-muted rounded w-12 mb-4"></div>
                <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="border border-white/20 rounded-2xl bg-card/50 p-8 sm:p-10 md:p-12 max-w-3xl mx-auto">
          <div className="h-16 bg-muted rounded w-16 mx-auto mb-6"></div>
          <div className="h-8 bg-muted rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-muted rounded w-2/3 mx-auto mb-6"></div>
          <div className="h-12 bg-muted rounded w-40 mx-auto"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/20 to-indigo-50/10 dark:from-background dark:via-slate-900 dark:to-slate-900">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient orbs - adjusted to use more professional blue/indigo tones */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/15 to-indigo-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-600/15 to-indigo-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl" />
        
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      </div>

      <main className="relative z-10 flex-1">
        <EnhancedHero />
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
      </main>
    </div>
  )
}