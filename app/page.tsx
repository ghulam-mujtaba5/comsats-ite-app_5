import type { Metadata } from "next"
import { HeroSection } from "@/components/home/hero-section"
import { FeatureCards } from "@/components/home/feature-cards"
import { NewsSection } from "@/components/home/news-section"
import { CommunitySection } from "@/components/home/community-section"
import { FAQSection } from "@/components/home/faq-section"
import { ComingSoonSection } from "@/components/home/coming-soon-section"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <FeatureCards />
        {/* About CampusAxis card/section */}
        <section className="app-container py-8">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 shadow-lg p-8 text-center border border-white/20 dark:border-white/10">
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">About CampusAxis</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">CampusAxis is your academic portal for COMSATS students—resources, tools, and support all in one place.</p>
              <a href="/about">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg transition-all duration-300">Learn more</button>
              </a>
            </div>
          </div>
        </section>
        <ComingSoonSection />
        {/* <CommunitySection /> removed as requested */}
        <NewsSection />
        <FAQSection />
      </main>
    </div>
  )
}
