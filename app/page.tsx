"use client"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeatureCards } from "@/components/home/feature-cards"
import { NewsSection } from "@/components/home/news-section"
import { FAQSection } from "@/components/home/faq-section"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <FeatureCards />
        <NewsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
