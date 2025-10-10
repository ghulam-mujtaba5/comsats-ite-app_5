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
            <div className="rounded-2xl bg-muted p-6 text-center border">
              <h2 className="text-xl font-bold mb-2 text-primary">About CampusAxis</h2>
              <p className="text-muted-foreground mb-4">CampusAxis is your academic portal for COMSATS students—resources, tools, and support all in one place.</p>
              <a href="/about">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-5 py-2 rounded-lg shadow-sm transition-all duration-300">Learn more</button>
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