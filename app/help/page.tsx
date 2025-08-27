"use client"

import { useState } from "react"
import type { Metadata } from "next"
import { createMetadata, jsonLdBreadcrumb, jsonLdFAQ } from "@/lib/seo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Search,
  HelpCircle,
  MessageSquare,
  BookOpen,
  Calculator,
  Users,
  FileText,
  Star,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
  Lightbulb,
  Shield,
  Zap,
  Heart,
  Target,
  Award
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export const metadata: Metadata = createMetadata({
  title: "Help Center — CampusAxis",
  description:
    "Find answers to common questions about CampusAxis: community moderation, past papers, GPA calculator, faculty reviews, and more.",
  path: "/help",
  keywords: ["help center", "faq", "support", "CampusAxis"],
})

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
  helpful?: number
}

interface HelpCategory {
  id: string
  name: string
  description: string
  icon: any
  color: string
  count: number
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [openItems, setOpenItems] = useState<string[]>([])

  const categories: HelpCategory[] = [
    {
      id: "all",
      name: "All Topics",
      description: "Browse all help topics",
      icon: HelpCircle,
      color: "bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border-blue-200/30",
      count: 12
    },
    {
      id: "general",
      name: "General",
      description: "Getting started and basic features",
      icon: BookOpen,
      color: "bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-200/30",
      count: 4
    },
    {
      id: "community",
      name: "Community",
      description: "Posts, moderation, and discussions",
      icon: Users,
      color: "bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-200/30",
      count: 3
    },
    {
      id: "academic",
      name: "Academic Tools",
      description: "GPA calculator, past papers, resources",
      icon: Calculator,
      color: "bg-gradient-to-br from-orange-500/20 to-red-600/20 border-orange-200/30",
      count: 3
    },
    {
      id: "technical",
      name: "Technical",
      description: "Account issues and troubleshooting",
      icon: Zap,
      color: "bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border-yellow-200/30",
      count: 2
    }
  ]

  const faqs: FAQItem[] = [
    {
      id: "1",
      question: "How do I find past papers for my course?",
      answer: "Navigate to the Past Papers section from the main menu. You can filter by department, course code, semester, and instructor. Use the search function to quickly find specific papers. All papers are organized by academic year and semester for easy browsing.",
      category: "academic",
      tags: ["past papers", "search", "filter"],
      helpful: 24
    },
    {
      id: "2",
      question: "Is the GPA calculator accurate for COMSATS grading?",
      answer: "Yes, our GPA calculator is specifically designed for COMSATS University grading scale (A+ = 4.0, A = 4.0, A- = 3.67, etc.). Make sure to enter the correct credit hours for each course and select the appropriate grade. The calculator supports both semester and cumulative GPA calculations.",
      category: "academic",
      tags: ["gpa", "calculator", "grades", "comsats"],
      helpful: 31
    },
    {
      id: "3",
      question: "How does community moderation work?",
      answer: "Our community is moderated by admin staff and trusted student moderators. All posts are reviewed for appropriate content. You can report inappropriate posts using the report button. We encourage respectful discussion and academic collaboration while maintaining a safe environment for all students.",
      category: "community",
      tags: ["moderation", "community", "safety"],
      helpful: 18
    },
    {
      id: "4",
      question: "Can I contribute resources or past papers?",
      answer: "Absolutely! We encourage students to contribute academic resources. You can upload past papers through the admin panel (if you have access) or contact us to submit materials. All contributions are reviewed before being published to ensure quality and relevance.",
      category: "general",
      tags: ["contribute", "upload", "resources"],
      helpful: 15
    },
    {
      id: "5",
      question: "How do I report bugs or suggest features?",
      answer: "Use the 'Report an Issue' page accessible from the main menu. You can report bugs, suggest new features, or provide general feedback. We review all submissions and prioritize based on community impact and feasibility.",
      category: "technical",
      tags: ["bugs", "feedback", "features"],
      helpful: 12
    },
    {
      id: "6",
      question: "What should I do if I can't access my account?",
      answer: "If you're having trouble logging in, first try resetting your password using the 'Forgot Password' link. If the issue persists, contact our support team with your username and a description of the problem. We'll help you regain access to your account.",
      category: "technical",
      tags: ["account", "login", "password"],
      helpful: 9
    },
    {
      id: "7",
      question: "How do I join or create study groups?",
      answer: "Visit the Community section and navigate to the Study Groups tab. You can join existing groups by clicking 'Join Group' or create a new group by providing a name, description, and category. Study groups are great for collaboration and peer learning.",
      category: "community",
      tags: ["study groups", "collaboration", "community"],
      helpful: 22
    },
    {
      id: "8",
      question: "Are faculty reviews anonymous?",
      answer: "Yes, all faculty reviews are completely anonymous. Your identity is not revealed to faculty members or other students. However, we do monitor reviews for appropriate content and may remove reviews that violate our community guidelines.",
      category: "general",
      tags: ["faculty", "reviews", "anonymous"],
      helpful: 27
    }
  ]

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <main className="container mx-auto max-w-6xl px-4 py-12">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            <HelpCircle className="h-4 w-4" />
            Support Center
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            Help & <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Support</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 font-medium leading-relaxed">
            Find answers to common questions and get the help you need to make the most of CampusAxis
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-12 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-3xl shadow-lg">
          <CardContent className="p-8">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search for help topics, features, or common questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/30 dark:border-slate-700/30 rounded-2xl text-lg focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            {/* Category Pills */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "h-12 px-6 rounded-xl transition-all duration-200",
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/30 dark:border-slate-700/30 hover:bg-primary/10"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {category.name}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {category.count}
                    </Badge>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">
                {filteredFAQs.length} Helpful <span className="text-blue-600 dark:text-blue-400">Answers</span>
              </h2>
              <p className="text-slate-700 dark:text-slate-200 font-medium">
                Find solutions to the most common questions from our community
              </p>
            </div>

            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
                  <Collapsible open={openItems.includes(faq.id)} onOpenChange={() => toggleItem(faq.id)}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="p-6 cursor-pointer hover:bg-white/50 dark:hover:bg-slate-700/30 transition-colors duration-200 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white mb-2 text-left">
                              {faq.question}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs capitalize">
                                {faq.category}
                              </Badge>
                              {faq.helpful && (
                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                  <Heart className="h-3 w-3" />
                                  {faq.helpful} helpful
                                </div>
                              )}
                            </div>
                          </div>
                          {openItems.includes(faq.id) ? (
                            <ChevronDown className="h-5 w-5 text-slate-500 transition-transform duration-200" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-slate-500 transition-transform duration-200" />
                          )}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="px-6 pb-6">
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                          {faq.answer}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {faq.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-xs">
                              <Heart className="h-3 w-3 mr-1" />
                              Helpful
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-2xl shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="p-4 rounded-full bg-gradient-to-br from-slate-400/20 to-slate-500/20 border border-slate-400/30 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Search className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">No Results Found</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 font-medium max-w-md mx-auto">
                    Try adjusting your search terms or browse different categories.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3"
                  >
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-2xl shadow-lg">
              <CardHeader className="p-6">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20 border border-primary/30">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-3">
                <Link href="/contact">
                  <Button variant="outline" className="w-full justify-start h-12 rounded-xl border-white/30 hover:bg-white/20">
                    <Mail className="h-5 w-5 mr-3" />
                    Contact Support
                  </Button>
                </Link>
                <Link href="/report-issue">
                  <Button variant="outline" className="w-full justify-start h-12 rounded-xl border-white/30 hover:bg-white/20">
                    <Shield className="h-5 w-5 mr-3" />
                    Report an Issue
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" className="w-full justify-start h-12 rounded-xl border-white/30 hover:bg-white/20">
                    <MessageCircle className="h-5 w-5 mr-3" />
                    Join Community
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Popular Categories */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-2xl shadow-lg">
              <CardHeader className="p-6">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-200/30">
                    <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  Popular Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-3">
                {categories.filter(cat => cat.id !== "all").map((category) => {
                  const Icon = category.icon
                  return (
                    <Button
                      key={category.id}
                      variant="ghost"
                      onClick={() => setSelectedCategory(category.id)}
                      className="w-full justify-start h-auto p-3 rounded-xl hover:bg-white/20 transition-colors duration-200"
                    >
                      <div className={cn("p-2 rounded-lg mr-3", category.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-slate-900 dark:text-white">{category.name}</div>
                        <div className="text-xs text-slate-500">{category.count} articles</div>
                      </div>
                    </Button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20 rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Still Need Help?
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                  Our support team is here to help you with any questions or issues.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Mail className="h-4 w-4" />
                    support@campusaxis.com
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <MessageCircle className="h-4 w-4" />
                    24/7 Live Chat Available
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: "Home", path: "/" }, { name: "Help Center", path: "/help" }])) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ([
          { question: "How do I find past papers?", answer: "Go to the Past Papers section and filter by course, semester, or instructor." },
          { question: "Is the GPA calculator accurate?", answer: "Yes, it follows the COMSATS grading scale. Ensure credits and grades are correct." },
          { question: "Can I submit feedback or report bugs?", answer: "Use the Report an Issue page to submit bugs or suggestions." },
        ])) }}
      />
    </div>
  )
}
