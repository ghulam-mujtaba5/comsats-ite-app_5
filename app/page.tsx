import type { Metadata } from "next"
import "./home.light.module.css"
import "./home.dark.module.css"
import { Suspense } from "react"
import layout from "@/app/styles/common.module.css"
import { EnhancedHero } from "@/components/home/enhanced-hero"
import { EnhancedFeatures } from "@/components/home/enhanced-features"
import { EnhancedNews } from "@/components/home/enhanced-news"
import { EnhancedCommunity } from "@/components/home/enhanced-community"
import { EnhancedFAQ } from "@/components/home/enhanced-faq"
import { EnhancedComingSoon } from "@/components/home/enhanced-coming-soon"
import { AnimatedSections } from "@/components/home/animated-sections"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 -mt-8 sm:-mt-12">
      {/* Enhanced Background - Subtle gradients without overlay */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Subtle brand gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/10 via-indigo-400/8 to-purple-400/5 dark:from-blue-500/8 dark:via-indigo-500/6 dark:to-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-indigo-400/10 via-purple-400/8 to-pink-400/5 dark:from-indigo-500/8 dark:via-purple-500/6 dark:to-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-blue-300/8 via-indigo-300/6 to-purple-300/4 dark:from-blue-600/6 dark:via-indigo-600/5 dark:to-purple-600/4 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 flex-1">
        <EnhancedHero />
        
        {/* Sections with proper spacing */}
        <div className="space-y-8 md:space-y-12">
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