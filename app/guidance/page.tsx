"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { Search, BookOpen, GraduationCap, FileText, DollarSign, MapPin } from "lucide-react"

interface GuideSection {
  id: string
  title: string
  description: string
  category: "academic" | "admission" | "campus" | "financial" | "policies"
  content: string
  last_updated: string
  is_important?: boolean
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
}

export default function GuidancePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [guideSections, setGuideSections] = useState<GuideSection[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [contentResponse, faqResponse] = await Promise.all([
          fetch('/api/guidance/content'),
          fetch('/api/guidance/faq')
        ])

        if (contentResponse.ok && faqResponse.ok) {
          const contentData = await contentResponse.json()
          const faqData = await faqResponse.json()
          setGuideSections(contentData)
          setFaqs(faqData)
        } else {
          throw new Error('Failed to fetch guidance data')
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load guidance data")
        // Fallback to static data
        setGuideSections([
          {
            id: "1",
            title: "Course Registration Process",
            description: "Step-by-step guide for registering courses each semester",
            category: "academic",
            content: "**Course Registration Steps:**\n\n1. **Pre-Registration Phase**\n   - Check your academic standing\n   - Meet with your academic advisor\n   - Plan your course schedule\n\n2. **Registration Period**\n   - Log into the student portal\n   - Select courses based on your degree plan\n   - Ensure prerequisites are met\n   - Submit your registration\n\n3. **Post-Registration**\n   - Pay semester fees\n   - Verify your schedule\n   - Make any necessary changes during add/drop period\n\n**Important Dates:**\n- Early Registration: 2 weeks before semester\n- Regular Registration: 1 week before semester\n- Add/Drop Period: First week of semester",
            last_updated: "2024-01-15",
            is_important: true,
          },
          {
            id: "2",
            title: "Campus Facilities Guide",
            description: "Information about campus facilities and services",
            category: "campus",
            content: "**Campus Locations:**\n\n**Main Campus:**\n- Academic Offices:\n  - CS: Computer Science Department\n  - EE: Electrical Engineering Department\n  - Management: Business Administration Department\n\n**Student Services:**\n- Library: Main building, extended hours during exams\n- Cafeteria: Multiple dining options\n- Sports Complex: Gym, courts, and fields\n- Medical Center: First aid and health services\n\n**Administrative Offices:**\n- Registrar's Office: Transcripts, certificates\n- Finance Office: Fee payments, scholarships\n- Student Affairs Office: Clubs, events\n- Transportation: University buses available from major city points\n- Parking: Available for students and faculty",
            last_updated: "2024-01-10",
          },
          {
            id: "3",
            title: "Financial Aid Information",
            description: "Scholarships, grants, and financial assistance programs",
            category: "financial",
            content: "**Financial Aid Programs:**\n\n**Available Programs:**\n\n**Merit-Based Scholarships:**\n- Academic Excellence: 50% fee waiver for top performers\n- Dean's List: 25% fee waiver for consistent high achievers\n\n**Need-Based Financial Aid:**\n- Financial Assistance Program: Up to 75% fee waiver\n- Emergency Financial Support: Short-term assistance\n\n**Application Process:**\n1. Submit financial aid application\n2. Provide required documentation\n3. Attend interview if selected\n4. Await decision notification\n\n**Required Documents:**\n- Income certificate\n- Academic transcripts\n- Bank statements\n- Recommendation letters\n\n**Deadlines:**\n- Fall Semester: June 30th\n- Spring Semester: December 31st",
            last_updated: "2024-01-12",
            is_important: true,
          },
          {
            id: "4",
            title: "Academic Policies",
            description: "Important academic policies every student should know",
            category: "policies",
            content: "**Academic Policies:**\n\n**Attendance Policy:**\n- Minimum 75% attendance required\n- Medical leave requires documentation\n- Excessive absences may result in course failure\n\n**Grading System:**\n- A: 85-100 (4.0 GPA)\n- B: 70-84 (3.0 GPA)\n- C: 60-69 (2.0 GPA)\n- D: 50-59 (1.0 GPA)\n- F: Below 50 (0.0 GPA)\n\n**Academic Probation:**\n- CGPA below 2.0 results in probation\n- Two consecutive semesters of probation may lead to dismissal\n\n**Grade Appeals:**\n- Must be filed within 2 weeks of grade posting\n- Requires written justification\n- Reviewed by academic committee\n\n**Academic Integrity:**\n- Zero tolerance for academic dishonesty\n- Penalties range from assignment failure to course failure\n- Repeat offenses may result in dismissal",
            last_updated: "2024-01-08",
            is_important: true,
          }
        ])
        setFaqs([
          {
            id: "1",
            question: "How do I register for courses?",
            answer: "Course registration is done through the student portal during designated registration periods. Make sure to meet with your advisor first.",
            category: "academic",
            tags: ["registration", "courses", "portal"]
          },
          {
            id: "2",
            question: "What are the library hours?",
            answer: "The library is open 24/7 during regular semester periods. During breaks and holidays, hours may be reduced.",
            category: "campus",
            tags: ["library", "hours", "facilities"]
          },
          {
            id: "3",
            question: "How can I apply for financial aid?",
            answer: "Financial aid applications are available through the student portal. Submit your application along with required documents before the deadline.",
            category: "financial",
            tags: ["financial aid", "scholarships", "application"]
          },
          {
            id: "4",
            question: "What is the minimum CGPA requirement?",
            answer: "Students must maintain a minimum CGPA of 2.0 to remain in good academic standing. Below this may result in academic probation.",
            category: "academic",
            tags: ["cgpa", "grades", "requirements"]
          },
          {
            id: "5",
            question: "How do I join student clubs?",
            answer: "Contact the Student Affairs office or visit club booths during orientation week. Most clubs have open membership.",
            category: "campus",
            tags: ["clubs", "activities", "student life"]
          }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredSections = guideSections.filter((section) => {
    const matchesSearch = section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         section.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || section.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "academic":
        return BookOpen
      case "admission":
        return GraduationCap
      case "campus":
        return MapPin
      case "financial":
        return DollarSign
      case "policies":
        return FileText
      default:
        return FileText
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "admission":
        return "bg-green-100 text-green-800 border-green-200"
      case "campus":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "financial":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "policies":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Student Guidance Portal</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your comprehensive guide to academic policies, procedures, and campus resources
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search guides and FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Button>
            <Button
              variant={selectedCategory === "academic" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("academic")}
            >
              Academic
            </Button>
            <Button
              variant={selectedCategory === "admission" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("admission")}
            >
              Admission
            </Button>
            <Button
              variant={selectedCategory === "campus" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("campus")}
            >
              Campus
            </Button>
            <Button
              variant={selectedCategory === "financial" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("financial")}
            >
              Financial
            </Button>
            <Button
              variant={selectedCategory === "policies" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("policies")}
            >
              Policies
            </Button>
          </div>
        </div>

        <Tabs defaultValue="guides" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="guides">Guidance Sections</TabsTrigger>
            <TabsTrigger value="faqs">Frequently Asked Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="guides" className="space-y-6">
            {loading ? (
              <CenteredLoader message="Loading guidance content..." />
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : filteredSections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No guidance sections found matching your criteria</div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredSections.map((section) => {
                  const Icon = getCategoryIcon(section.category)
                  return (
                    <Card key={section.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-lg">{section.title}</CardTitle>
                            {section.is_important && (
                              <Badge variant="destructive" className="text-xs">
                                Important
                              </Badge>
                            )}
                          </div>
                          <Badge className={getCategoryColor(section.category)}>
                            {section.category}
                          </Badge>
                        </div>
                        <CardDescription>{section.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none mb-4">
                          <div className="whitespace-pre-wrap text-sm">{section.content}</div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Last updated: {new Date(section.last_updated).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="faqs" className="space-y-6">
            {loading ? (
              <CenteredLoader message="Loading FAQs..." />
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : filteredFaqs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No FAQs found matching your criteria</div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center justify-between w-full mr-4">
                        <span>{faq.question}</span>
                        <Badge className={getCategoryColor(faq.category)} variant="outline">
                          {faq.category}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2 pb-4">
                        <p className="text-gray-700 dark:text-gray-300 mb-3">{faq.answer}</p>
                        <div className="flex gap-2">
                          {faq.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
