import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How do I access past papers?",
    answer:
      "You can access past papers by navigating to the Past Papers section. Papers are organized by department, course, and semester. You need to be logged in with your COMSATS email to download papers.",
  },
  {
    question: "Is the GPA calculator accurate?",
    answer:
      "Yes, our GPA calculator follows the official COMSATS grading system. It includes calculators for semester GPA, cumulative GPA, and aggregate calculation for admissions.",
  },
  {
    question: "Can I upload my own study materials?",
    answer:
      "Currently, only verified students and faculty can upload materials. If you have valuable resources to share, please contact the administrators through the contact form.",
  },
  {
    question: "How often are faculty reviews updated?",
    answer:
      "Faculty reviews are updated in real-time as students submit them. All reviews go through a moderation process to ensure they are constructive and appropriate.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Yes, we take privacy seriously. Your personal information is encrypted and only used for authentication and personalization. We never share your data with third parties.",
  },
  {
    question: "How do I report a technical issue?",
    answer:
      "You can report technical issues through the contact form or email us directly. We typically respond within 24 hours and resolve issues as quickly as possible.",
  },
]

export function FAQSection() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground font-serif">
            Find answers to common questions about using the COMSATS ITE portal
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-serif">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
