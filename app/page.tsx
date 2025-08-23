"use client"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeatureCards } from "@/components/home/feature-cards"
import { NewsSection } from "@/components/home/news-section"
import { CommunitySection } from "@/components/home/community-section"
import { FAQSection } from "@/components/home/faq-section"
import { ComingSoonSection } from "@/components/home/coming-soon-section"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <FeatureCards />
        <ComingSoonSection />
        <CommunitySection />
        <NewsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
