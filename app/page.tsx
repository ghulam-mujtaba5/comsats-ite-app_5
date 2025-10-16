import type { Metadata } from "next"
import { EnhancedHero } from "@/components/home/enhanced-hero"
import { EnhancedFeatures } from "@/components/home/enhanced-features"
import { EnhancedNews } from "@/components/home/enhanced-news"
import { EnhancedCommunity } from "@/components/home/enhanced-community"
import { EnhancedFAQ } from "@/components/home/enhanced-faq"
import { EnhancedComingSoon } from "@/components/home/enhanced-coming-soon"
import { AnimatedSections } from "@/components/home/animated-sections"

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
        
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      <main className="relative z-10 flex-1">
        <EnhancedHero />
        <EnhancedFeatures />
        <AnimatedSections />
        <EnhancedComingSoon />
        <EnhancedCommunity />
        <EnhancedNews />
        <EnhancedFAQ />
      </main>
    </div>
  )
}