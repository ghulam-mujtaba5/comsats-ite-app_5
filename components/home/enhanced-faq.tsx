"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HelpCircle, Clock, Users, FileText, Calendar, Search, MessageSquare, Zap, Rocket, Flame, Star } from "lucide-react"
import { motion } from "framer-motion"
import { StaggerContainer, StaggerItem, AnimatedCard, FadeInScroll } from "@/components/animations/enhanced"
import { useCelebrationAnimations } from "@/hooks/use-celebration-animations"
import { useAnimation } from "@/contexts/animation-context"
import { useMotivationalFeedback } from "@/components/motivational/unified-feedback-system"

type FAQ = {
  id: string
  question: string
  answer: string
}

export function EnhancedFAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFallback, setIsFallback] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([])
  const { triggerAchievement } = useCelebrationAnimations()
  const { isAnimationEnabled } = useAnimation()
  const { triggerFeedback } = useMotivationalFeedback()

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
    {
      id: "gpa-calculator",
      question: "How accurate is the GPA calculator?",
      answer: "Our GPA calculator follows COMSATS University's official grading system. It supports both semester and cumulative GPA calculations with high accuracy.",
    },
    {
      id: "faculty-reviews",
      question: "Are faculty reviews moderated?",
      answer: "Yes, all reviews are reviewed by our moderation team to ensure they follow our community guidelines and provide valuable insights for students.",
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

  // Filter FAQs based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredFaqs(filtered)
    } else {
      setFilteredFaqs(faqs)
    }
  }, [searchTerm, faqs])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleContactSupport = () => {
    if (isAnimationEnabled) {
      triggerAchievement({
        title: "Getting Help",
        description: "You're reaching out for support!",
        type: 'badge'
      })
      
      // Trigger motivational feedback
      triggerFeedback({
        type: 'help_provided',
        message: "Reaching out for support!"
      })
    }
  }

  const faqStats = [
    { label: "Questions Answered", value: "42", icon: HelpCircle },
    { label: "Community Help", value: "128", icon: Users },
    { label: "Avg. Response Time", value: "< 2h", icon: Clock },
    { label: "Satisfaction Rate", value: "96%", icon: Star }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background/80 to-muted/30 glass-primary">
      <div className="app-container max-w-6xl mx-auto">
        {/* Enhanced Header with proper spacing */}
        <div className="text-center mb-16 md:mb-20">
          <Badge variant="soft" className="mb-4 md:mb-6 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-medium bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-indigo-700 dark:text-indigo-300 border border-indigo-600/40 glass-secondary">
            <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            Student Support
          </Badge>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-balance mb-4 sm:mb-6">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about using the CampusAxis portal. 
            Can't find what you're looking for? Our support team is ready to help.
          </p>
        </div>

        {/* FAQ Stats with proper spacing */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {faqStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-5 rounded-2xl bg-card/90 backdrop-blur-xl border border-white/30 text-center transition-all duration-300 hover:shadow-xl glass-primary"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-xl bg-indigo-500/10">
                    <Icon className="h-6 w-6 text-indigo-500" />
                  </div>
                </div>
                <div className="text-2xl font-semibold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground/90">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Search Bar with proper spacing */}
        <div className="mb-10 sm:mb-12 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
            <input
              type="text"
              placeholder="Search for questions..."
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-2xl sm:rounded-2xl border border-white/30 bg-card/90 backdrop-blur-xl text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-sm sm:text-base glass-secondary glass-professional"
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <button 
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs sm:text-sm"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Fallback Warning with proper spacing */}
        {isFallback && (
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-full text-sm">
              <Clock className="h-4 w-4" />
              <span>Showing default FAQs while live FAQs are unavailable</span>
            </div>
          </div>
        )}

        {/* FAQ Accordion with proper spacing */}
        <Card className="bg-card/90 backdrop-blur-3xl border border-white/30 shadow-2xl rounded-2xl sm:rounded-3xl mb-12 sm:mb-16 glass-card-premium glass-border-glow glass-primary">
          {loading ? (
            <div role="status" aria-live="polite" className="space-y-4 p-4 sm:p-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`fsk-${i}`} className="skeleton p-4 sm:p-5 rounded-2xl border border-white/20">
                  <div className="sk-title w-2/3 rounded mb-2 sm:mb-3 h-4 sm:h-5" />
                  <div className="sk-line w-full rounded mb-1.5 sm:mb-2 h-3 sm:h-4" />
                  <div className="sk-line w-5/6 rounded h-3 sm:h-4" />
                </div>
              ))}
              <div className="flex items-center justify-center gap-2 text-muted-foreground py-3 sm:py-4">
                <div className="loader-ring sm" />
                <span className="text-sm sm:text-base">Loading FAQs…</span>
              </div>
            </div>
          ) : error ? (
            <div role="alert" className="text-sm text-destructive p-4 sm:p-6">
              {error}
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4 p-2">
              {(searchTerm ? filteredFaqs : faqs).map((faq, index) => (
                <AccordionItem 
                  key={faq.id} 
                  value={`item-${index}`} 
                  className="bg-muted/50 border border-white/30 rounded-xl sm:rounded-2xl px-4 sm:px-5 transition-all duration-300 hover:bg-muted/70 glass-card glass-border-light glass-hover glass-depth"
                >
                  <AccordionTrigger className="text-left hover:text-indigo-700 transition-colors pr-6 sm:pr-8 py-3 sm:py-4 text-sm sm:text-base group">
                    <div className="flex items-center">
                      <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {faq.question}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground/90 pb-3 sm:pb-4 text-sm sm:text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
              {filteredFaqs.length === 0 && searchTerm && (
                <div className="text-center py-6 sm:py-8">
                  <HelpCircle className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium mb-1.5 sm:mb-2">No questions found</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">Try different search terms or ask our support team directly</p>
                  <Button 
                    asChild 
                    variant="outline" 
                    className="rounded-lg sm:rounded-xl text-sm sm:text-base px-4 py-2"
                    onClick={handleContactSupport}
                  >
                    <Link href="/student-support">
                      Contact Support
                    </Link>
                  </Button>
                </div>
              )}
            </Accordion>
          )}
        </Card>
        
        {/* Additional Help CTA with proper spacing */}
        <StaggerContainer className="text-center" staggerDelay={0.1}>
          <StaggerItem>
            <Card className="inline-block p-6 border border-white/30 bg-card/90 backdrop-blur-xl rounded-2xl max-w-2xl mx-auto glass-secondary glass-professional">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                    <Users className="h-7 w-7 text-indigo-500" />
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold mb-1">Need more help?</h3>
                  <p className="text-muted-foreground text-sm">Our support team is ready to assist you with any questions</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Button 
                    asChild 
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl hover:bg-primary/90 transition-colors text-sm font-medium"
                    onClick={handleContactSupport}
                  >
                    <Link href="/student-support">
                      Contact Support
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  )
}