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
        <section className="app-container py-8">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl bg-muted p-6 text-center border shadow-sm hover:shadow-md transition-shadow duration-300 glass-card glass-border-subtle glass-hover glass-depth">
              <h2 className="text-xl font-bold mb-2 text-primary">About CampusAxis</h2>
              <p className="text-muted-foreground mb-4">CampusAxis is your academic portal for COMSATS students—resources, tools, and support all in one place.</p>
              <a href="/about">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-5 py-2 rounded-lg shadow-sm transition-all duration-300 hover:scale-105 glass-button glass-border-light glass-hover glass-depth">
                  Learn more
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