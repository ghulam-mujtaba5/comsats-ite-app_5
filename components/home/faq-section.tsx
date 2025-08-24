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

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch("/api/faqs")
        if (!response.ok) {
          throw new Error(`Failed to load FAQs (${response.status})`)
        }
        const { data } = await response.json()
        setFaqs(data || [])
        setError(null)
      } catch (error) {
        console.error("Failed to fetch FAQs:", error)
        setError("We couldn't load FAQs at the moment. Please try again later.")
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
        </div>

        {loading ? (
          <p role="status" aria-live="polite" className="text-muted-foreground">Loading FAQs…</p>
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
