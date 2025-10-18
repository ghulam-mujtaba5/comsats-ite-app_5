"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UnifiedGlassCard } from "@/components/shared/UnifiedGlassCard"
import { HelpCircle, Clock, Users, FileText, Calendar, Search, MessageSquare, Zap, Rocket, Flame, Star } from "lucide-react"
import { motion } from "framer-motion"
import { StaggerContainer, StaggerItem, AnimatedCard, FadeInScroll } from "@/components/animations/enhanced"
import { useCelebrationAnimations } from "@/hooks/use-celebration-animations"
import { useAnimation } from "@/contexts/animation-context"
import { useMotivationalFeedback } from "@/components/motivational/unified-feedback-system"
import styles from "./enhanced-faq.module.css"
import "./enhanced-faq.light.module.css"
import "./enhanced-faq.dark.module.css"
import layout from "@/app/styles/common.module.css"
import { usePreferredTheme } from "@/hooks/use-preferred-theme"

type FAQ = {
  id: string
  question: string
  answer: string
}

export function EnhancedFAQ() {
  const { isDark } = usePreferredTheme()
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
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background/80 to-muted/30 glass-primary">
      <div className="max-w-7xl mx-auto w-full">
        {/* Enhanced Header with proper spacing */}
        <div className={`text-center mb-16 md:mb-20 ${isDark ? 'opacity-100' : 'opacity-100'}`}>
          <Badge variant="soft" className={styles.headerBadge}>
            <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            Student Support
          </Badge>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-balance mb-4 sm:mb-6">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-700 dark:text-slate-300/90 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about using the CampusAxis portal. 
            Can't find what you're looking for? Our support team is ready to help.
          </p>
        </div>

        {/* FAQ Stats with proper spacing */}
        <div className={styles.statsGrid}>
          {faqStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={styles.statsCard}
              >
                <div className="flex justify-center mb-3">
                  <div className={styles.statsIconWrap}>
                    <Icon className="h-6 w-6 text-indigo-500" />
                  </div>
                </div>
                <div className="text-2xl font-semibold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-700 dark:text-slate-300/90">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Search Bar with proper spacing */}
        <div className={styles.searchWrap}>
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-700 dark:text-slate-300 h-4 w-4 sm:h-5 sm:w-5" />
            <input
              type="text"
              placeholder="Search for questions..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <button 
                className={styles.clearBtn}
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
        <UnifiedGlassCard variant="medium" className={styles.cardShell}>
          {loading ? (
            <div role="status" aria-live="polite" className="space-y-4 p-4 sm:p-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`fsk-${i}`} className={styles.skeletonItem}>
                  <div className="sk-title w-2/3 rounded mb-2 sm:mb-3 h-4 sm:h-5" />
                  <div className="sk-line w-full rounded mb-1.5 sm:mb-2 h-3 sm:h-4" />
                  <div className="sk-line w-5/6 rounded h-3 sm:h-4" />
                </div>
              ))}
              <div className="flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 py-3 sm:py-4">
                <div className="loader-ring sm" />
                <span className="text-sm sm:text-base">Loading FAQs…</span>
              </div>
            </div>
          ) : error ? (
            <div role="alert" className="text-sm text-destructive p-4 sm:p-6">
              {error}
            </div>
          ) : (
            <Accordion type="single" collapsible className={styles.accordion}>
              {(searchTerm ? filteredFaqs : faqs).map((faq, index) => (
                <AccordionItem 
                  key={faq.id} 
                  value={`item-${index}`} 
                  className={styles.accordionItem}
                >
                  <AccordionTrigger className={styles.accordionTrigger}>
                    <div className="flex items-center">
                      <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {faq.question}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className={styles.accordionContent}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
              {filteredFaqs.length === 0 && searchTerm && (
                <div className="text-center py-6 sm:py-8">
                  <HelpCircle className="h-10 w-10 sm:h-12 sm:w-12 text-slate-700 dark:text-slate-300 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium mb-1.5 sm:mb-2">No questions found</h3>
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-3 sm:mb-4">Try different search terms or ask our support team directly</p>
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
        </UnifiedGlassCard>
        
        {/* Additional Help CTA with proper spacing */}
        <StaggerContainer className="text-center" staggerDelay={0.1}>
          <StaggerItem>
            <UnifiedGlassCard className={styles.ctaCard}>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                    <Users className="h-7 w-7 text-indigo-500" />
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold mb-1">Need more help?</h3>
                  <p className="text-slate-700 dark:text-slate-300 text-sm">Our support team is ready to assist you with any questions</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Button 
                    asChild 
                    className={styles.ctaBtn}
                    onClick={handleContactSupport}
                  >
                    <Link href="/student-support">
                      Contact Support
                    </Link>
                  </Button>
                </div>
              </div>
            </UnifiedGlassCard>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  )
}