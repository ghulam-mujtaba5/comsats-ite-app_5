"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, BookOpen, Users, GraduationCap, FileText, Calendar, DollarSign, MapPin } from "lucide-react"

interface GuideSection {
  id: string
  title: string
  description: string
  category: "academic" | "admission" | "campus" | "financial" | "policies"
  content: string
  lastUpdated: string
  isImportant?: boolean
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
}

const guideSections: GuideSection[] = [
  {
    id: "1",
    title: "Course Registration Process",
    description: "Step-by-step guide for registering courses each semester",
    category: "academic",
    content: `
**Course Registration Steps:**

1. **Pre-Registration Phase**
   - Check your academic standing
   - Meet with your academic advisor
   - Plan your course schedule

2. **Registration Period**
   - Log into the student portal
   - Select courses based on your degree plan
   - Ensure prerequisites are met
   - Submit your registration

3. **Post-Registration**
   - Pay semester fees
   - Verify your schedule
   - Make any necessary changes during add/drop period

**Important Deadlines:**
- Early Registration: 2 weeks before semester
- Regular Registration: 1 week before semester
- Add/Drop Period: First week of semester
    `,
    lastUpdated: "2024-01-15",
    isImportant: true,
  },
  {
    id: "2",
    title: "Campus Facilities Guide",
    description: "Overview of all campus facilities and their locations",
    category: "campus",
    content: `
**Main Campus Facilities:**

**Academic Buildings:**
- CS Block: Computer Science Department
- EE Block: Electrical Engineering Department
- Management Block: Business Administration

**Student Services:**
- Main Library: 24/7 during exams
- Cafeteria: Multiple dining options
- Sports Complex: Gym, courts, and fields
- Medical Center: First aid and health services

**Administrative Offices:**
- Registrar Office: Transcripts, certificates
- Finance Office: Fee payments, scholarships
- Student Affairs: Activities, clubs, events

**Transportation:**
- University buses available from major city points
- Parking available for students and faculty
    `,
    lastUpdated: "2024-01-10",
  },
  {
    id: "3",
    title: "Financial Aid and Scholarships",
    description: "Information about available financial assistance programs",
    category: "financial",
    content: `
**Available Scholarships:**

**Merit-Based Scholarships:**
- Academic Excellence: 50% fee waiver for top performers
- Dean's List: 25% fee waiver for consistent high achievers

**Need-Based Financial Aid:**
- Financial Assistance Program: Up to 75% fee waiver
- Emergency Financial Support: Short-term assistance

**Application Process:**
1. Submit financial aid application
2. Provide required documentation
3. Attend interview if selected
4. Await decision notification

**Required Documents:**
- Income certificate
- Academic transcripts
- Bank statements
- Recommendation letters

**Deadlines:**
- Fall Semester: June 30th
- Spring Semester: December 31st
    `,
    lastUpdated: "2024-01-12",
    isImportant: true,
  },
  {
    id: "4",
    title: "Academic Policies and Procedures",
    description: "Important academic policies every student should know",
    category: "policies",
    content: `
**Attendance Policy:**
- Minimum 75% attendance required
- Medical leave requires documentation
- Excessive absences may result in course failure

**Grading System:**
- A: 85-100 (4.0 GPA)
- B: 70-84 (3.0 GPA)
- C: 60-69 (2.0 GPA)
- D: 50-59 (1.0 GPA)
- F: Below 50 (0.0 GPA)

**Academic Probation:**
- CGPA below 2.0 results in probation
- Two consecutive semesters of probation may lead to dismissal

**Grade Appeals:**
- Must be filed within 2 weeks of grade posting
- Requires written justification
- Reviewed by academic committee

**Plagiarism Policy:**
- Zero tolerance for academic dishonesty
- Penalties range from assignment failure to course failure
- Repeat offenses may result in dismissal
    `,
    lastUpdated: "2024-01-08",
    isImportant: true,
  },
]

const faqs: FAQ[] = [
  {
    id: "1",
    question: "How do I apply for admission?",
    answer: "Visit the admissions office or apply online through our portal. Submit required documents including transcripts, test scores, and application fee.",
    category: "admission",
    tags: ["application", "requirements", "documents"],
  },
  {
    id: "2",
    question: "What is the minimum CGPA requirement?",
    answer: "Students must maintain a minimum CGPA of 2.0 to remain in good academic standing. Below this may result in academic probation.",
    category: "academic",
    tags: ["cgpa", "grades", "requirements"],
  },
  {
    id: "3",
    question: "How can I pay my semester fees?",
    answer: "Fees can be paid online through the student portal, at designated bank branches, or at the campus finance office.",
    category: "financial",
    tags: ["fees", "payment", "finance"],
  },
  {
    id: "4",
    question: "Where is the library located?",
    answer: "The main library is located in the central campus building, ground floor. It's open 24/7 during examination periods.",
    category: "campus",
    tags: ["library", "location", "hours"],
  },
  {
    id: "5",
    question: "How do I join student clubs?",
    answer: "Contact the Student Affairs office or visit club booths during orientation week. Most clubs have open membership.",
    category: "campus",
    tags: ["clubs", "activities", "student life"],
  },
]

export default function GuidancePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredGuides = guideSections.filter((guide) => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || guide.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredFAQs = faqs.filter((faq) => {
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
        return Users
      case "campus":
        return MapPin
      case "financial":
        return DollarSign
      case "policies":
        return FileText
      default:
        return BookOpen
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic":
        return "default"
      case "admission":
        return "secondary"
      case "campus":
        return "outline"
      case "financial":
        return "destructive"
      case "policies":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Guidance Portal</h1>
        <p className="text-muted-foreground mt-2">
          Essential information and policies for COMSATS students
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search guides and FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="guides" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="guides">Student Guides</TabsTrigger>
          <TabsTrigger value="faqs">Frequently Asked Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="guides" className="space-y-6">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All Categories
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
              Campus Life
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

          {/* Guides List */}
          <div className="space-y-4">
            {filteredGuides.map((guide) => {
              const Icon = getCategoryIcon(guide.category)
              return (
                <Card key={guide.id} className={`${guide.isImportant ? 'border-blue-200 bg-blue-50/50' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          <CardTitle className="text-lg">{guide.title}</CardTitle>
                          {guide.isImportant && (
                            <Badge variant="default" className="text-xs">
                              Important
                            </Badge>
                          )}
                        </div>
                        <CardDescription>{guide.description}</CardDescription>
                        <div className="text-xs text-muted-foreground">
                          Last updated: {new Date(guide.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant={getCategoryColor(guide.category)}>
                        {guide.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm font-sans">
                        {guide.content}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="faqs" className="space-y-6">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All Categories
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
              Campus Life
            </Button>
            <Button
              variant={selectedCategory === "financial" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("financial")}
            >
              Financial
            </Button>
          </div>

          {/* FAQs Accordion */}
          <Accordion type="single" collapsible className="w-full">
            {filteredFAQs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <span>{faq.question}</span>
                    <Badge variant="outline" className="text-xs">
                      {faq.category}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p className="text-sm">{faq.answer}</p>
                    <div className="flex gap-1 flex-wrap">
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
        </TabsContent>
      </Tabs>

      {filteredGuides.length === 0 && filteredFAQs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No content found matching your search.</p>
        </div>
      )}
    </div>
  )
}
