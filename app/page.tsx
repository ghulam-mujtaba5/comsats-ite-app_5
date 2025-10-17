import type { Metadata } from "next"
import { Suspense } from "react"
import layout from "@/app/styles/common.module.css"
import { EnhancedHero } from "@/components/home/enhanced-hero"
import { EnhancedFeatures } from "@/components/home/enhanced-features"
import { EnhancedNews } from "@/components/home/enhanced-news"
import { EnhancedCommunity } from "@/components/home/enhanced-community"
import { EnhancedFAQ } from "@/components/home/enhanced-faq"
import { EnhancedComingSoon } from "@/components/home/enhanced-coming-soon"
import { AnimatedSections } from "@/components/home/animated-sections"

// Simplified unified loading skeleton
function ContentSkeleton() {
  return (
    <div className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className={layout.section}>
        <div className="h-8 bg-gradient-to-r from-primary/20 to-blue-500/20 dark:from-primary/30 dark:to-blue-500/30 rounded-lg w-1/3 mx-auto mb-12"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-white/20 dark:border-white/10 rounded-xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm p-6 space-y-3">
              <div className="h-6 bg-gradient-to-r from-primary/20 to-blue-500/15 dark:from-primary/30 dark:to-blue-500/25 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200/60 dark:bg-slate-700/60 rounded w-full"></div>
              <div className="h-4 bg-slate-200/60 dark:bg-slate-700/60 rounded w-5/6"></div>
            </div>
          ))}
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
          
          {/* Combine multiple sections in one Suspense boundary for better performance */}
          <Suspense fallback={<ContentSkeleton />}>
            <AnimatedSections />
            <EnhancedComingSoon />
          </Suspense>
          
          <Suspense fallback={<ContentSkeleton />}>
            <EnhancedCommunity />
            <EnhancedNews />
            <EnhancedFAQ />
          </Suspense>
        </div>
      </main>
    </div>
  )
}