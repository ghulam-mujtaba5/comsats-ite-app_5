"use client"

import { useEffect, useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
    <section className="py-20 px-4 bg-muted/30 fade-in">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground font-serif">
            Find answers to common questions about using the CampusAxis portal
          </p>
          {isFallback && (
            <div className="mt-3 text-xs border border-yellow-300 bg-yellow-50 text-yellow-900 rounded px-3 py-2">
              Showing default FAQs while live FAQs are unavailable.
            </div>
          )}
        </div>

        {loading ? (
          <div role="status" aria-live="polite" className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`fsk-${i}`} className="skeleton p-4">
                <div className="sk-title w-2/3 rounded mb-2" />
                <div className="sk-line w-full rounded mb-1" />
                <div className="sk-line w-5/6 rounded" />
              </div>
            ))}
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="loader-ring sm" />
              <span>Loading FAQs…</span>
            </div>
          </div>
        ) : error ? (
          <div role="alert" className="text-sm text-destructive">
            {error}
          </div>
        ) : (
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.id} value={`item-${index}`} className="bg-card border border-border rounded-lg px-6 slide-up">
                <AccordionTrigger className="text-left hover:text-primary transition-colors interactive">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-serif slide-up">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  )
}
