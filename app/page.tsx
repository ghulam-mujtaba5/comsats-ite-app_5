import type { Metadata } from "next"
import "./home.light.module.css"
import "./home.dark.module.css"
import { Suspense } from "react"
import layout from "@/app/styles/common.module.css"
import { EnhancedHero } from "@/components/home/enhanced-hero"
import { ModernFeaturesGrid } from "@/components/home/modern-features-grid"
import { InteractiveCTA } from "@/components/home/interactive-cta"
import { EnhancedNews } from "@/components/home/enhanced-news"
import { EnhancedCommunity } from "@/components/home/enhanced-community"
import { EnhancedFAQ } from "@/components/home/enhanced-faq"
import { EnhancedComingSoon } from "@/components/home/enhanced-coming-soon"
import styles from './page.module.css';

// Simplified unified loading skeleton
function ContentSkeleton() {
  return (
    <div className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className={layout.section}>
        <div className="h-8 bg-gradient-to-r from-primary/20 to-blue-500/20 dark:from-primary/30 dark:to-blue-500/30 rounded-lg w-1/3 mx-auto mb-12"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm p-6 space-y-3">
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
    <div className="min-h-screen relative overflow-hidden -mt-8 sm:-mt-12">
      {/* Modern Mesh Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
        
        {/* Animated gradient mesh - reduced opacity for light mode */}
        <div className="absolute inset-0 opacity-20 dark:opacity-20">
          <div className="absolute top-0 -left-4 w-[500px] h-[500px] bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-0 -right-4 w-[500px] h-[500px] bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>
        
        {/* Grid overlay for modern tech feel - more visible in light mode */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)]" />
      </div>

      <main className="relative z-10">
        <EnhancedHero />
        
        {/* Modern Redesigned Sections */}
        <ModernFeaturesGrid />
        
        <Suspense fallback={<ContentSkeleton />}>
          <InteractiveCTA />
        </Suspense>
        
        <Suspense fallback={<ContentSkeleton />}>
          <EnhancedCommunity />
          <EnhancedNews />
        </Suspense>
        
        <Suspense fallback={<ContentSkeleton />}>
          <EnhancedComingSoon />
          <EnhancedFAQ />
        </Suspense>
      </main>
    </div>
  )
}