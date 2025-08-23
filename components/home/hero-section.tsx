import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { ArrowRight, GraduationCap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notifyFetch } from "@/lib/notify"

export function HeroSection() {
  const [pastPapersCount, setPastPapersCount] = useState<number | null>(null)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await notifyFetch("/api/past-papers/count", undefined, { errorMessage: "Failed to load past papers count" })
        if (!response.ok) {
          throw new Error("Failed to fetch count")
        }
        const data = await response.json()
        setPastPapersCount(data.count)
      } catch (error) {
        // notifyFetch already surfaced the error
        // Fallback to a default or hide the count
        setPastPapersCount(1000) // Fallback for display
      }
    }

    fetchCount()
  }, [])
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                COMSATS University Lahore
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Empowering Your <span className="text-primary">Academic Journey</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl font-serif">
              Access past papers, calculate your GPA, explore learning resources, and connect with faculty - all in one
              comprehensive academic portal designed for COMSATS students.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/resources">
                  Explore Resources
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent" asChild>
                <Link href="/gpa-calculator">Calculate GPA</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent" asChild>
                <a href="https://portal.comsats.edu.pk/" target="_blank" rel="noreferrer">Portal</a>
              </Button>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative w-full max-w-lg mx-auto">
              <Image
                src="/comsats-library-study.png"
                alt="COMSATS students studying"
                width={500}
                height={500}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">
                  {pastPapersCount !== null ? `${(Math.floor(pastPapersCount / 100) * 100).toLocaleString()}+` : "..."}
                </div>
                <div className="text-sm">Past Papers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
