"use client"

import { useEffect, useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, Clock, Users, FileText, Calendar } from "lucide-react"

type FAQ = {
  id: string
  question: string
  answer: string
}

export function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFallback, setIsFallback] = useState(false)
  // Curated static fallback suitable for the home page
  const STATIC_FAQS: FAQ[] = [
    {
      id: "how-to-login",
      question: "How do I sign in to CampusAxis?",
      answer: "Click the Sign In button and use your official COMSATS email to authenticate. You can browse most areas without signing in, but some actions require it.",
    },
    {
      id: "past-papers",
      question: "Where can I find past papers?",
      answer: "Go to the Past Papers section from the Explore area in the footer or the top navigation. Filter by department, course, exam type, and semester.",
    },
    {
      id: "timetable-upload",
      question: "How can I upload a timetable or report an issue?",
      answer: "Use the Timetable page to view the latest files. If you need to upload a new one, use the Upload option. To report problems, open the Report Issue page and submit the form.",
    },
    {
      id: "news-events",
      question: "What shows up in News & Events?",
      answer: "Official announcements, academic deadlines, workshops and campus events. Use filters to narrow down by category.",
    },
    {
      id: "feedback-support",
      question: "How do I share feedback or get support?",
      answer: "Use the Student Support page to submit requests or feedback. You can also email campusaxis0@gmail.com for general queries.",
    },
  ]

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch("/api/faqs")
        if (!response.ok) {
          throw new Error(`Failed to load FAQs (${response.status})`)
        }
        const { data } = await response.json()
        const list: FAQ[] = Array.isArray(data) ? data : []
        // Use static fallback if API returns no FAQs (e.g., empty table)
        if (list.length === 0) {
          setFaqs(STATIC_FAQS)
          setIsFallback(true)
        } else {
          setFaqs(list)
          setIsFallback(false)
        }
        setError(null)
      } catch (error) {
        console.error("Failed to fetch FAQs:", error)
        // On error, still show static fallback to avoid empty home section
        setFaqs(STATIC_FAQS)
        setIsFallback(true)
        setError(null)
      } finally {
        setLoading(false)
      }
    }

    fetchFaqs()
  }, [])
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20 glass-primary">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative p-4 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-2xl glass-interactive">
              <HelpCircle className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about using the CampusAxis portal
          </p>
          {isFallback && (
            <div className="mt-6 text-sm border border-yellow-300 bg-yellow-50 text-yellow-900 rounded-lg px-4 py-3 max-w-2xl mx-auto inline-flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Showing default FAQs while live FAQs are unavailable.
            </div>
          )}
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border shadow-xl glass-card-premium glass-border-glow glass-depth">
          {loading ? (
            <div role="status" aria-live="polite" className="space-y-4 p-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`fsk-${i}`} className="skeleton p-5 rounded-xl border">
                  <div className="sk-title w-2/3 rounded mb-3 h-5" />
                  <div className="sk-line w-full rounded mb-2" />
                  <div className="sk-line w-5/6 rounded" />
                </div>
              ))}
              <div className="flex items-center justify-center gap-2 text-muted-foreground py-4">
                <div className="loader-ring sm" />
                <span>Loading FAQs…</span>
              </div>
            </div>
          ) : error ? (
            <div role="alert" className="text-sm text-destructive p-6">
              {error}
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4 p-2">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.id} value={`item-${index}`} className="bg-muted/30 border rounded-xl px-5 transition-all duration-300 hover:bg-muted/50 glass-card glass-border-subtle glass-hover">
                  <AccordionTrigger className="text-left hover:text-primary transition-colors pr-8 py-4 text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </Card>
        
        {/* Additional Help CTA */}
        <div className="text-center mt-12">
          <Card className="inline-block p-6 border bg-card/80 backdrop-blur-sm max-w-2xl mx-auto glass-subtle">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center glass-interactive">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-semibold mb-1">Need more help?</h3>
                <p className="text-muted-foreground text-sm">Our support team is ready to assist you with any questions</p>
              </div>
              <div className="mt-2 sm:mt-0">
                <a href="/student-support" className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium glass-interactive">
                  Contact Support
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}