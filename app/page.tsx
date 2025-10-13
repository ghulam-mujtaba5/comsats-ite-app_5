import type { Metadata } from "next"
import { EnhancedHero } from "@/components/home/enhanced-hero"
import { EnhancedFeatures } from "@/components/home/enhanced-features"
import { EnhancedNews } from "@/components/home/enhanced-news"
import { EnhancedCommunity } from "@/components/home/enhanced-community"
import { EnhancedFAQ } from "@/components/home/enhanced-faq"
import { EnhancedComingSoon } from "@/components/home/enhanced-coming-soon"

export const revalidate = 3600 // 1 hour - cache the home page to reduce function invocations

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <EnhancedHero />
        <EnhancedFeatures />
        {/* About CampusAxis card/section */}
        <section className="app-container py-12">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl bg-card/80 backdrop-blur-xl border border-white/20 shadow-xl p-8 text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 glass-card-premium glass-border-glow glass-hover glass-depth glass-gradient">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                About CampusAxis
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                CampusAxis is your academic portal for COMSATS students—resources, tools, and support all in one place.
              </p>
              <a href="/about">
                <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground font-medium rounded-xl shadow-lg hover:from-primary/90 hover:to-indigo-700 transition-all duration-300 hover:scale-105 glass-button glass-border-light glass-hover glass-depth">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </a>
            </div>
          </div>
        </section>
        <EnhancedComingSoon />
        <EnhancedCommunity />
        <EnhancedNews />
        <EnhancedFAQ />
      </main>
    </div>
  )
}