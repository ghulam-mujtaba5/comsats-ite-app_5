import type { Metadata } from "next"
import { Suspense } from "react"
import { EnhancedHero } from "@/components/home/enhanced-hero"
import { EnhancedFeatures } from "@/components/home/enhanced-features"
import { EnhancedNews } from "@/components/home/enhanced-news"
import { EnhancedCommunity } from "@/components/home/enhanced-community"
import { EnhancedFAQ } from "@/components/home/enhanced-faq"
import { EnhancedComingSoon } from "@/components/home/enhanced-coming-soon"
import { AnimatedSections } from "@/components/home/animated-sections"

// Create loading skeletons with MAXIMUM glassmorphism - Megicode Brand Style
function NewsSkeleton() {
  return (
    <div className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-blue-50/20 to-white dark:from-[#12161b] dark:to-[#0f1115] backdrop-blur-xl">
      <div className="app-container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-10 bg-gradient-to-r from-[#4573df]/30 to-[#667eea]/20 dark:from-[#4573df]/50 dark:to-[#667eea]/40 rounded-xl w-1/3 mx-auto mb-12 backdrop-blur-2xl border border-[rgba(107,114,128,0.15)] dark:border-[rgba(255,255,255,0.1)] shadow-[0_3px_6px_rgba(60,60,60,0.16),0_3px_6px_rgba(60,60,60,0.23)]"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="group border border-white/30 dark:border-[rgba(255,255,255,0.15)] rounded-2xl bg-white/95 dark:bg-[#1a1f27]/80 backdrop-blur-3xl shadow-clean-lg hover:shadow-xl transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-[#4573df]/20 to-[#2d4fa2]/15 dark:from-[#4573df]/40 dark:to-[#2d4fa2]/35 rounded-t-2xl border-b border-[rgba(107,114,128,0.15)] dark:border-[rgba(255,255,255,0.15)] backdrop-blur-xl" />
              <div className="p-5 sm:p-6 space-y-3">
                <div className="h-6 bg-gradient-to-r from-[#4573df]/25 to-[#667eea]/20 dark:from-[#4573df]/45 dark:to-[#667eea]/40 rounded-lg w-3/4 backdrop-blur-md"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-[#f5f7fa]/80 to-[#f5f7fa]/60 dark:from-[#2a2f38]/90 dark:to-[#2a2f38]/70 rounded w-full backdrop-blur-md"></div>
                  <div className="h-4 bg-gradient-to-r from-[#f5f7fa]/80 to-[#f5f7fa]/60 dark:from-[#2a2f38]/90 dark:to-[#2a2f38]/70 rounded w-5/6 backdrop-blur-md"></div>
                </div>
                <div className="h-10 bg-gradient-to-r from-[#4573df]/30 to-[#2d4fa2]/25 dark:from-[#4573df]/50 dark:to-[#2d4fa2]/45 rounded-lg w-32 mt-4 border border-[rgba(107,114,128,0.15)] dark:border-[rgba(255,255,255,0.15)] backdrop-blur-xl shadow-[0_1px_3px_rgba(60,60,60,0.12),0_1px_2px_rgba(60,60,60,0.24)]"></div>
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
    <div className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-blue-50/20 to-white dark:from-[#0f1115] dark:to-[#12161b] backdrop-blur-xl">
      <div className="app-container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-10 bg-gradient-to-r from-[#ff9800]/30 to-[#764ba2]/20 dark:from-[#ff9800]/50 dark:to-[#764ba2]/40 rounded-xl w-1/3 mx-auto mb-12 backdrop-blur-2xl border border-[rgba(107,114,128,0.15)] dark:border-[rgba(255,255,255,0.1)] shadow-[0_3px_6px_rgba(60,60,60,0.16),0_3px_6px_rgba(60,60,60,0.23)]"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border border-white/30 dark:border-[rgba(255,255,255,0.15)] rounded-2xl bg-white/95 dark:bg-[#1a1f27]/80 backdrop-blur-3xl shadow-clean-lg p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[rgba(107,114,128,0.15)] dark:border-[rgba(255,255,255,0.15)]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4573df]/30 to-[#667eea]/25 dark:from-[#4573df]/50 dark:to-[#667eea]/45 backdrop-blur-md"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gradient-to-r from-[#4573df]/25 to-[#667eea]/20 dark:from-[#4573df]/45 dark:to-[#667eea]/40 rounded w-1/3 backdrop-blur-md"></div>
                  <div className="h-3 bg-gradient-to-r from-[#f5f7fa]/80 to-[#f5f7fa]/60 dark:from-[#2a2f38]/90 dark:to-[#2a2f38]/70 rounded w-1/4 backdrop-blur-md"></div>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="h-5 bg-gradient-to-r from-[#4573df]/25 to-[#667eea]/20 dark:from-[#4573df]/45 dark:to-[#667eea]/40 rounded-lg w-3/4 backdrop-blur-md"></div>
                <div className="h-4 bg-gradient-to-r from-[#f5f7fa]/80 to-[#f5f7fa]/60 dark:from-[#2a2f38]/90 dark:to-[#2a2f38]/70 rounded w-full backdrop-blur-md"></div>
                <div className="h-4 bg-gradient-to-r from-[#f5f7fa]/80 to-[#f5f7fa]/60 dark:from-[#2a2f38]/90 dark:to-[#2a2f38]/70 rounded w-5/6 backdrop-blur-md"></div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-[rgba(107,114,128,0.15)] dark:border-[rgba(255,255,255,0.15)]">
                <div className="h-8 bg-gradient-to-r from-[#f5f7fa]/80 to-[#f5f7fa]/60 dark:from-[#2a2f38]/90 dark:to-[#2a2f38]/70 rounded-lg w-20 backdrop-blur-md"></div>
                <div className="h-8 bg-gradient-to-r from-[#f5f7fa]/80 to-[#f5f7fa]/60 dark:from-[#2a2f38]/90 dark:to-[#2a2f38]/70 rounded-lg w-20 backdrop-blur-md"></div>
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
    <div className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-blue-50/20 to-white dark:from-[#12161b] dark:to-[#0f1115] backdrop-blur-xl">
      <div className="app-container max-w-4xl mx-auto px-4 sm:px-6">
        <div className="h-10 bg-gradient-to-r from-[#4573df]/30 to-[#667eea]/20 dark:from-[#4573df]/50 dark:to-[#667eea]/40 rounded-xl w-1/3 mx-auto mb-12 backdrop-blur-2xl border border-[rgba(107,114,128,0.15)] dark:border-[rgba(255,255,255,0.1)] shadow-[0_3px_6px_rgba(60,60,60,0.16),0_3px_6px_rgba(60,60,60,0.23)]"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border border-white/30 dark:border-[rgba(255,255,255,0.15)] rounded-2xl bg-white/95 dark:bg-[#1a1f27]/80 backdrop-blur-3xl shadow-clean-lg p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gradient-to-r from-[#4573df]/25 to-[#667eea]/20 dark:from-[#4573df]/45 dark:to-[#667eea]/40 rounded-lg w-3/4 backdrop-blur-md"></div>
                  <div className="h-4 bg-gradient-to-r from-[#f5f7fa]/80 to-[#f5f7fa]/60 dark:from-[#2a2f38]/90 dark:to-[#2a2f38]/70 rounded w-full backdrop-blur-md"></div>
                  <div className="h-4 bg-gradient-to-r from-[#f5f7fa]/80 to-[#f5f7fa]/60 dark:from-[#2a2f38]/90 dark:to-[#2a2f38]/70 rounded w-5/6 backdrop-blur-md"></div>
                </div>
                <div className="w-5 h-5 rounded bg-gradient-to-br from-[#4573df]/30 to-[#667eea]/25 dark:from-[#4573df]/50 dark:to-[#667eea]/45 backdrop-blur-md"></div>
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
    <div className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-blue-50/20 to-white dark:from-[#0f1115] dark:to-[#12161b] backdrop-blur-xl">
      <div className="app-container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-10 bg-gradient-to-r from-[#ff9800]/30 to-[#764ba2]/20 dark:from-[#ff9800]/50 dark:to-[#764ba2]/40 rounded-xl w-1/3 mx-auto mb-12 backdrop-blur-2xl border border-[rgba(107,114,128,0.15)] dark:border-[rgba(255,255,255,0.1)] shadow-[0_3px_6px_rgba(60,60,60,0.16),0_3px_6px_rgba(60,60,60,0.23)]"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-white/30 dark:border-[rgba(255,255,255,0.15)] rounded-2xl bg-white/95 dark:bg-[#1a1f27]/80 backdrop-blur-3xl shadow-clean-lg">
              <div className="p-5 sm:p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff9800]/30 to-[#764ba2]/25 dark:from-[#ff9800]/50 dark:to-[#764ba2]/45 border border-[rgba(107,114,128,0.15)] dark:border-[rgba(255,255,255,0.15)] backdrop-blur-xl shadow-[0_1px_3px_rgba(60,60,60,0.12),0_1px_2px_rgba(60,60,60,0.24)]"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-gradient-to-r from-[#ff9800]/25 to-[#764ba2]/20 dark:from-[#ff9800]/45 dark:to-[#764ba2]/40 rounded-lg w-3/4 backdrop-blur-md"></div>
                  <div className="h-4 bg-gradient-to-r from-[#f5f7fa]/80 to-[#f5f7fa]/60 dark:from-[#2a2f38]/90 dark:to-[#2a2f38]/70 rounded w-full backdrop-blur-md"></div>
                  <div className="h-4 bg-gradient-to-r from-[#f5f7fa]/80 to-[#f5f7fa]/60 dark:from-[#2a2f38]/90 dark:to-[#2a2f38]/70 rounded w-5/6 backdrop-blur-md"></div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-[rgba(107,114,128,0.15)] dark:border-[rgba(255,255,255,0.15)]">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#ff9800]/30 to-[#764ba2]/25 dark:from-[#ff9800]/50 dark:to-[#764ba2]/45 backdrop-blur-md"></div>
                  <div className="h-3 bg-gradient-to-r from-[#f5f7fa]/80 to-[#f5f7fa]/60 dark:from-[#2a2f38]/90 dark:to-[#2a2f38]/70 rounded w-24 backdrop-blur-md"></div>
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
    <div className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-blue-50/20 to-white dark:from-[#12161b] dark:to-[#0f1115] backdrop-blur-xl">
      <div className="app-container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-10 bg-gradient-to-r from-[#4573df]/30 to-[#667eea]/20 dark:from-[#4573df]/50 dark:to-[#667eea]/40 rounded-xl w-1/3 mx-auto mb-12 backdrop-blur-2xl border border-[rgba(107,114,128,0.15)] dark:border-[rgba(255,255,255,0.1)] shadow-[0_3px_6px_rgba(60,60,60,0.16),0_3px_6px_rgba(60,60,60,0.23)]"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-white/30 dark:border-[rgba(255,255,255,0.15)] rounded-2xl bg-white/95 dark:bg-[#1a1f27]/80 backdrop-blur-3xl shadow-clean-lg">
              <div className="p-5 sm:p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4573df]/30 to-[#667eea]/25 dark:from-[#4573df]/50 dark:to-[#667eea]/45 border border-[rgba(107,114,128,0.15)] dark:border-[rgba(255,255,255,0.15)] backdrop-blur-xl shadow-[0_1px_3px_rgba(60,60,60,0.12),0_1px_2px_rgba(60,60,60,0.24)]"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-gradient-to-r from-[#4573df]/25 to-[#667eea]/20 dark:from-[#4573df]/45 dark:to-[#667eea]/40 rounded-lg w-3/4 backdrop-blur-md"></div>
                  <div className="h-4 bg-gradient-to-r from-[#f5f7fa]/80 to-[#f5f7fa]/60 dark:from-[#2a2f38]/90 dark:to-[#2a2f38]/70 rounded w-full backdrop-blur-md"></div>
                  <div className="h-4 bg-gradient-to-r from-[#f5f7fa]/80 to-[#f5f7fa]/60 dark:from-[#2a2f38]/90 dark:to-[#2a2f38]/70 rounded w-5/6 backdrop-blur-md"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border border-white/30 dark:border-[rgba(255,255,255,0.15)] rounded-3xl bg-white/98 dark:bg-[#1a1f27]/90 backdrop-blur-3xl shadow-clean-lg p-8 sm:p-10 md:p-12 max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4573df]/30 to-[#667eea]/25 dark:from-[#4573df]/50 dark:to-[#667eea]/45 border border-[rgba(107,114,128,0.15)] dark:border-[rgba(255,255,255,0.15)] backdrop-blur-xl shadow-[0_3px_6px_rgba(60,60,60,0.16),0_3px_6px_rgba(60,60,60,0.23)]"></div>
          </div>
          <div className="space-y-4 text-center">
            <div className="h-8 bg-gradient-to-r from-[#4573df]/25 to-[#667eea]/20 dark:from-[#4573df]/45 dark:to-[#667eea]/40 rounded-xl w-1/2 mx-auto backdrop-blur-md"></div>
            <div className="h-4 bg-gradient-to-r from-[#f5f7fa]/80 to-[#f5f7fa]/60 dark:from-[#2a2f38]/90 dark:to-[#2a2f38]/70 rounded-lg w-3/4 mx-auto backdrop-blur-md"></div>
            <div className="h-4 bg-gradient-to-r from-[#f5f7fa]/80 to-[#f5f7fa]/60 dark:from-[#2a2f38]/90 dark:to-[#2a2f38]/70 rounded-lg w-2/3 mx-auto backdrop-blur-md"></div>
            <div className="flex gap-4 justify-center mt-6 pt-6 border-t border-[rgba(107,114,128,0.15)] dark:border-[rgba(255,255,255,0.15)]">
              <div className="h-12 bg-gradient-to-r from-[#4573df]/30 to-[#2d4fa2]/25 dark:from-[#4573df]/50 dark:to-[#2d4fa2]/45 rounded-xl w-40 border border-[rgba(107,114,128,0.15)] dark:border-[rgba(255,255,255,0.15)] backdrop-blur-xl shadow-[0_1px_3px_rgba(60,60,60,0.12),0_1px_2px_rgba(60,60,60,0.24)]"></div>
              <div className="h-12 bg-gradient-to-r from-[#f5f7fa]/80 to-[#f5f7fa]/60 dark:from-[#2a2f38]/90 dark:to-[#2a2f38]/70 rounded-xl w-40 border border-[rgba(107,114,128,0.15)] dark:border-[rgba(255,255,255,0.15)] backdrop-blur-md"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-slate-50/50 dark:from-[#0f1115] dark:via-[#181c22] dark:to-[#1a1f27] -mt-8 sm:-mt-12">
      {/* Maximum Glassmorphism Background - Megicode Brand Colors */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary brand gradient orbs - Megicode Blue (#4573df) */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#4573df]/25 via-[#667eea]/20 to-[#2d4fa2]/15 dark:from-[#4573df]/30 dark:via-[#667eea]/25 dark:to-[#2d4fa2]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#ff9800]/20 via-[#ff9800]/15 to-[#764ba2]/12 dark:from-[#ff9800]/25 dark:via-[#ff9800]/20 dark:to-[#764ba2]/18 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[#4573df]/15 via-[#667eea]/12 to-[#2d4fa2]/10 dark:from-[#4573df]/22 dark:via-[#667eea]/18 dark:to-[#2d4fa2]/15 rounded-full blur-3xl" />
        
        {/* Premium dot pattern with brand colors */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%234573df%22%20fill-opacity%3D%220.08%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221.5%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60 dark:opacity-30" />
        
        {/* Maximum glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/70 dark:from-[#0f1115]/40 dark:via-[#181c22]/60 dark:to-[#0f1115]/90 backdrop-blur-[1px]" />
      </div>

      <main className="relative z-10 flex-1">
        <EnhancedHero />
        
        {/* Sections with maximum glassmorphism */}
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