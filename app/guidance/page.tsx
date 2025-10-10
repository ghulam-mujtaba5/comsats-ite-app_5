"use client"

import { useState, useEffect } from "react"
import { useCampus } from "@/contexts/campus-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { Search, BookOpen, GraduationCap, FileText, DollarSign, MapPin, Newspaper, Eye, Heart, Briefcase, Settings, Globe, Mail, Monitor, Library } from "lucide-react"
import Link from "next/link"
import { marked } from 'marked'

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

interface BlogArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author_name: string
  featured_image_url: string | null
  is_featured: boolean
  view_count: number
  published_at: string
  created_at: string
  updated_at: string
}

interface SupportResource {
  id: string
  title: string
  description: string
  category: string
  contact_info?: string
  availability?: string
  priority?: string
  tags?: string[]
  is_emergency?: boolean
}

interface PortalResource {
  id: string
  title: string
  description: string
  url: string
  category: string
  icon_name?: string
  requires_vpn?: boolean
  is_external?: boolean
}

export default function GuidancePage() {
  const { selectedCampus } = useCampus()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [guideSections, setGuideSections] = useState<GuideSection[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [blogArticles, setBlogArticles] = useState<BlogArticle[]>([])
  const [supportResources, setSupportResources] = useState<SupportResource[]>([])
  const [portalResources, setPortalResources] = useState<PortalResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const campusParam = selectedCampus?.id ? `?campus_id=${selectedCampus.id}` : ''
        const [contentResponse, faqResponse, blogResponse, supportResponse, portalResponse] = await Promise.all([
          fetch(`/api/guidance/content${campusParam}`),
          fetch(`/api/guidance/faq${campusParam}`),
          fetch(`/api/blog${campusParam}&limit=6`),
          fetch(`/api/student-support/resources${campusParam}`),
          fetch('/api/student-portal/resources')
        ])

        if (contentResponse.ok && faqResponse.ok) {
          const contentData = await contentResponse.json()
          const faqData = await faqResponse.json()
          setGuideSections(contentData)
          setFaqs(faqData)
        } else {
          throw new Error('Failed to fetch guidance data')
        }

        if (blogResponse.ok) {
          const blogData = await blogResponse.json()
          setBlogArticles(blogData.data || [])
        }

        if (supportResponse.ok) {
          const supportData = await supportResponse.json()
          setSupportResources(supportData || [])
        }

        if (portalResponse.ok) {
          const portalData = await portalResponse.json()
          setPortalResources(portalData || [])
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
        setSupportResources([
          {
            id: "1",
            title: "Academic Advising",
            description: "Get help with course selection, academic planning, and degree requirements",
            category: "academic",
            contact_info: "advising@cuilahore.edu.pk",
            availability: "Mon-Fri 9:00 AM - 5:00 PM",
            tags: ["advising", "courses", "planning"]
          },
          {
            id: "2",
            title: "Mental Health Counseling",
            description: "Confidential counseling services for stress, anxiety, and personal issues",
            category: "mental-health",
            contact_info: "counseling@cuilahore.edu.pk",
            availability: "Mon-Fri 9:00 AM - 5:00 PM",
            is_emergency: false,
            tags: ["mental health", "counseling", "wellness"]
          },
          {
            id: "3",
            title: "Crisis Helpline",
            description: "24/7 emergency support for students in crisis situations",
            category: "mental-health",
            contact_info: "Crisis Hotline: 042-111-911-911",
            availability: "24/7 Available",
            is_emergency: true,
            tags: ["emergency", "crisis", "support"]
          }
        ])
        setPortalResources([
          {
            id: "1",
            title: "CU Online Portal",
            description: "Access your student account, registration, fee challans, and academic records",
            url: "https://cuonline.cuilahore.edu.pk",
            category: "cuonline",
            icon_name: "Globe",
            requires_vpn: false,
            is_external: true
          },
          {
            id: "2",
            title: "Student Email",
            description: "Access your official COMSATS student email account",
            url: "https://outlook.office.com",
            category: "email",
            icon_name: "Mail",
            requires_vpn: false,
            is_external: true
          },
          {
            id: "3",
            title: "Moodle LMS",
            description: "Learning Management System for course materials, assignments, and quizzes",
            url: "https://lms.cuilahore.edu.pk",
            category: "lms",
            icon_name: "BookOpen",
            requires_vpn: false,
            is_external: true
          }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [selectedCampus])

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

  const filteredBlogArticles = blogArticles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredSupportResources = supportResources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredPortalResources = portalResources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
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

  const getBlogCategoryIcon = (category: string) => {
    switch (category) {
      case "academic":
        return BookOpen
      case "campus-life":
        return MapPin
      case "career":
        return GraduationCap
      case "technology":
        return FileText
      case "research":
        return FileText
      case "events":
        return FileText
      default:
        return Newspaper
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700/50"
      case "admission":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-700/50"
      case "campus":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-200 dark:border-purple-700/50"
      case "financial":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-700/50"
      case "policies":
        return "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/40"
      case "mental-health":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700/50"
      case "career":
        return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-200 dark:border-indigo-700/50"
      case "technical":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700/50"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700/50"
    }
  }

  const getBlogCategoryColor = (category: string) => {
    switch (category) {
      case "academic":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700/50"
      case "campus-life":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-700/50"
      case "career":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-200 dark:border-purple-700/50"
      case "technology":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700/50"
      case "research":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-700/50"
      case "events":
        return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-200 dark:border-indigo-700/50"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700/50"
    }
  }

  const getResourceIcon = (category: string) => {
    switch (category) {
      case "academic":
        return BookOpen
      case "mental-health":
        return Heart
      case "career":
        return Briefcase
      case "financial":
        return DollarSign
      case "technical":
        return Settings
      case "cuonline":
        return Globe
      case "email":
        return Mail
      case "lms":
        return Monitor
      case "library":
        return Library
      default:
        return FileText
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with Reduced Visual Intensity */}
        <div className="mb-8 bg-card rounded-2xl p-6 border">
          <h1 className="text-3xl font-bold text-foreground mb-2">Student Guidance Portal</h1>
          <p className="text-muted-foreground max-w-4xl">
            Your comprehensive guide to academic policies, procedures, campus resources, support services, and portal links
          </p>
        </div>

        {/* Search and Filters with Reduced Visual Intensity */}
        <div className="mb-6 bg-card rounded-xl p-5 border">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search guides, FAQs, articles, and resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-muted"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className={selectedCategory === "all" ? "" : "bg-muted hover:bg-muted/80 border-muted"}
            >
              All
            </Button>
            <Button
              variant={selectedCategory === "academic" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("academic")}
              className={selectedCategory === "academic" ? "" : "bg-muted hover:bg-muted/80 border-muted"}
            >
              Academic
            </Button>
            <Button
              variant={selectedCategory === "admission" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("admission")}
              className={selectedCategory === "admission" ? "" : "bg-muted hover:bg-muted/80 border-muted"}
            >
              Admission
            </Button>
            <Button
              variant={selectedCategory === "campus" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("campus")}
              className={selectedCategory === "campus" ? "" : "bg-muted hover:bg-muted/80 border-muted"}
            >
              Campus
            </Button>
            <Button
              variant={selectedCategory === "financial" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("financial")}
              className={selectedCategory === "financial" ? "" : "bg-muted hover:bg-muted/80 border-muted"}
            >
              Financial
            </Button>
            <Button
              variant={selectedCategory === "policies" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("policies")}
              className={selectedCategory === "policies" ? "" : "bg-muted hover:bg-muted/80 border-muted"}
            >
              Policies
            </Button>
            <Button
              variant={selectedCategory === "mental-health" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("mental-health")}
              className={selectedCategory === "mental-health" ? "" : "bg-muted hover:bg-muted/80 border-muted"}
            >
              Mental Health
            </Button>
            <Button
              variant={selectedCategory === "career" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("career")}
              className={selectedCategory === "career" ? "" : "bg-muted hover:bg-muted/80 border-muted"}
            >
              Career
            </Button>
            <Button
              variant={selectedCategory === "technical" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("technical")}
              className={selectedCategory === "technical" ? "" : "bg-muted hover:bg-muted/80 border-muted"}
            >
              Technical
            </Button>
            <Button
              variant={selectedCategory === "cuonline" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("cuonline")}
              className={selectedCategory === "cuonline" ? "" : "bg-muted hover:bg-muted/80 border-muted"}
            >
              CU Online
            </Button>
            <Button
              variant={selectedCategory === "email" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("email")}
              className={selectedCategory === "email" ? "" : "bg-muted hover:bg-muted/80 border-muted"}
            >
              Email
            </Button>
            <Button
              variant={selectedCategory === "lms" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("lms")}
              className={selectedCategory === "lms" ? "" : "bg-muted hover:bg-muted/80 border-muted"}
            >
              LMS
            </Button>
            <Button
              variant={selectedCategory === "library" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("library")}
              className={selectedCategory === "library" ? "" : "bg-muted hover:bg-muted/80 border-muted"}
            >
              Library
            </Button>
          </div>
        </div>

        <Tabs defaultValue="guides" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-muted rounded-lg p-1">
            <TabsTrigger value="guides" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Guidance Sections</TabsTrigger>
            <TabsTrigger value="faqs" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Frequently Asked Questions</TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Blog & Articles</TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Support & Portals</TabsTrigger>
          </TabsList>

          <TabsContent value="guides" className="space-y-6">
            {loading ? (
              <CenteredLoader message="Loading guidance content..." />
            ) : error ? (
              <div className="text-center py-8 text-destructive max-w-4xl mx-auto">{error}</div>
            ) : filteredSections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground max-w-4xl mx-auto">No guidance sections found matching your criteria</div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
                {filteredSections.map((section) => {
                  const Icon = getCategoryIcon(section.category)
                  return (
                    <Card key={section.id} className="bg-card border rounded-xl hover:shadow-md transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-primary" />
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
                        <div className="prose prose-sm max-w-none mb-4 dark:prose-invert">
                          <div 
                            dangerouslySetInnerHTML={{ __html: marked(section.content || '') }} 
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
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
              <div className="text-center py-8 text-destructive max-w-4xl mx-auto">{error}</div>
            ) : filteredFaqs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground max-w-4xl mx-auto">No FAQs found matching your criteria</div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4 max-w-4xl mx-auto">
                {filteredFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="bg-card border rounded-lg px-4">
                    <AccordionTrigger className="text-left pr-8 hover:no-underline">
                      <div className="flex items-center justify-between w-full mr-4">
                        <span>{faq.question}</span>
                        <Badge className={getCategoryColor(faq.category)} variant="outline">
                          {faq.category}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2 pb-4">
                        <p className="text-muted-foreground mb-3">{faq.answer}</p>
                        <div className="flex flex-wrap gap-2">
                          {faq.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-muted">
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

          <TabsContent value="blog" className="space-y-6">
            {loading ? (
              <CenteredLoader message="Loading blog articles..." />
            ) : error ? (
              <div className="text-center py-8 text-destructive max-w-4xl mx-auto">{error}</div>
            ) : filteredBlogArticles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground max-w-4xl mx-auto">
                <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p>No blog articles found matching your criteria.</p>
                <Button asChild className="mt-4">
                  <Link href="/blog">View All Blog Articles</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {filteredBlogArticles.map((article) => {
                  const Icon = getBlogCategoryIcon(article.category)
                  return (
                    <Link key={article.id} href={`/blog/${article.slug}`} className="block">
                      <Card className="h-full bg-card border rounded-xl hover:shadow-md transition-all duration-300">
                        {article.featured_image_url && (
                          <img 
                            src={article.featured_image_url} 
                            alt={article.title} 
                            className="w-full h-32 object-cover rounded-t-lg"
                          />
                        )}
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Icon className="h-4 w-4 text-primary" />
                            <Badge className={getBlogCategoryColor(article.category)}>
                              {article.category.replace('-', ' ')}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{new Date(article.published_at).toLocaleDateString()}</span>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{article.view_count}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
                <Card className="h-full bg-card border rounded-xl flex items-center justify-center">
                  <CardContent className="text-center p-6">
                    <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">More Articles Available</h3>
                    <p className="text-sm text-muted-foreground mb-4">Visit our full blog for more articles and insights</p>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/blog">View All Articles</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            {loading ? (
              <CenteredLoader message="Loading resources..." />
            ) : error ? (
              <div className="text-center py-8 text-destructive max-w-4xl mx-auto">{error}</div>
            ) : (
              <div className="space-y-8 max-w-6xl mx-auto">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Student Support Resources
                  </h3>
                  {filteredSupportResources.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground max-w-4xl mx-auto">
                      <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p>No support resources found matching your criteria.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 max-w-4xl mx-auto">
                      {filteredSupportResources.map((resource) => {
                        const Icon = getResourceIcon(resource.category)
                        return (
                          <Card key={resource.id} className="bg-card border rounded-xl hover:shadow-md transition-all duration-300">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                  <Icon className="h-5 w-5 text-primary" />
                                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                                  {resource.is_emergency && (
                                    <Badge variant="destructive" className="text-xs">
                                      Emergency
                                    </Badge>
                                  )}
                                </div>
                                <Badge className={getCategoryColor(resource.category)}>
                                  {resource.category.replace('-', ' ')}
                                </Badge>
                              </div>
                              <CardDescription>{resource.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              {resource.contact_info && (
                                <p className="text-sm text-muted-foreground mb-1">
                                  <strong>Contact:</strong> {resource.contact_info}
                                </p>
                              )}
                              {resource.availability && (
                                <p className="text-sm text-muted-foreground">
                                  <strong>Availability:</strong> {resource.availability}
                                </p>
                              )}
                              {resource.tags && resource.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {resource.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs bg-muted">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-500" />
                    Student Portal Resources
                  </h3>
                  {filteredPortalResources.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground max-w-4xl mx-auto">
                      <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p>No portal resources found matching your criteria.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                      {filteredPortalResources.map((resource) => {
                        const Icon = getResourceIcon(resource.category)
                        return (
                          <Link key={resource.id} href={resource.url} target="_blank" rel="noopener noreferrer">
                            <Card className="h-full bg-card border rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer">
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                                  </div>
                                  <Badge className={getCategoryColor(resource.category)}>
                                    {resource.category}
                                  </Badge>
                                </div>
                                <CardDescription>{resource.description}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="text-xs">
                                    {resource.is_external ? 'External' : 'Internal'}
                                  </Badge>
                                  {resource.requires_vpn && (
                                    <Badge variant="destructive" className="text-xs">
                                      VPN Required
                                    </Badge>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}