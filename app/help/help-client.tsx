"use client"

import { useState, useEffect } from "react"
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
  ChevronDown,
  ChevronRight,
  Mail,
  MessageCircle,
  Lightbulb,
  Shield,
  Zap,
  Heart,
  Target
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

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

export type FAQCore = Pick<FAQItem, 'question' | 'answer'>

export function HelpClient({ faqs }: { faqs: FAQItem[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [openItems, setOpenItems] = useState<string[]>([])

  // Add state for tracking API errors
  const [apiError, setApiError] = useState<string | null>(null)

  const categories: HelpCategory[] = [
    { id: "all", name: "All Topics", description: "Browse all help topics", icon: HelpCircle, color: "bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border-blue-200/30", count: 12 },
    { id: "general", name: "General", description: "Getting started and basic features", icon: BookOpen, color: "bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-200/30", count: 4 },
    { id: "community", name: "Community", description: "Posts, moderation, and discussions", icon: Users, color: "bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-200/30", count: 3 },
    { id: "academic", name: "Academic Tools", description: "GPA calculator, past papers, resources", icon: Calculator, color: "bg-gradient-to-br from-orange-500/20 to-red-600/20 border-orange-200/30", count: 3 },
    { id: "technical", name: "Technical", description: "Account issues and troubleshooting", icon: Zap, color: "bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border-yellow-200/30", count: 2 }
  ]

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId])
  }

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    const matchesSearch = !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  // Add effect to handle API errors gracefully
  useEffect(() => {
    // In a real implementation, you might fetch additional FAQs from an API
    // For now, we'll just use the static data passed in
    setApiError(null) // Reset any previous errors
  }, [])

  return (
    <div className="min-h-screen bg-mesh overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-20 right-20 w-4 h-4 bg-primary/30 rotate-45 animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-20 w-6 h-6 bg-blue-500/30 rounded-full animate-bounce" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-500/30 rotate-45 animate-bounce" style={{ animationDelay: '5s' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-blue-500/8" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20" />

      <main className="container mx-auto max-w-6xl px-4 py-24 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary mb-6 hover:from-primary/20 hover:to-blue-500/20 transition-all duration-300 hover-lift">
            <HelpCircle className="h-4 w-4" />
            Support Center
          </div>
          <h1 className="text-5xl lg:text-8xl font-bold leading-[0.9] text-balance mb-6">Help &{" "}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">Support</span>
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-serif max-w-4xl mx-auto mb-4">Find answers to common questions and get the help you need to make the most of your CampusAxis experience.</p>
          <p className="text-lg text-muted-foreground/80 font-light max-w-xl mx-auto">Fast, accurate, and always here to help</p>
        </div>

        <Card className="card-modern border-0 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 mb-12 rounded-3xl">
          <CardContent className="p-8">
            <div className="relative mb-6">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground/70" />
              <Input
                placeholder="Search for help topics, features, or common questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-16 h-16 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 rounded-2xl text-lg font-medium focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              />
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-sm text-muted-foreground">
                <Lightbulb className="h-4 w-4" />
                <span className="font-medium">Smart Search</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "h-12 px-6 rounded-2xl transition-all duration-300 hover-lift",
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-primary to-blue-600 text-primary-foreground shadow-lg hover:shadow-xl"
                        : "bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1 rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4" />
                      </div>
                      {category.name}
                      <Badge variant="secondary" className="text-xs font-medium">{category.count}</Badge>
                    </div>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3 text-foreground">{filteredFAQs.length} Helpful{" "}
                <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">Answers</span>
              </h2>
              <p className="text-muted-foreground font-serif text-lg leading-relaxed">Find solutions to the most common questions from our community</p>
            </div>
            <div className="space-y-6">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="card-modern border-0 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 rounded-2xl group hover-lift">
                  <Collapsible open={openItems.includes(faq.id)} onOpenChange={() => toggleItem(faq.id)}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="p-6 cursor-pointer hover:bg-background/30 transition-all duration-300 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg lg:text-xl font-bold text-foreground mb-3 text-left group-hover:text-primary transition-colors duration-300">{faq.question}</CardTitle>
                            <div className="flex items-center gap-3 flex-wrap">
                              <Badge variant="outline" className="text-xs capitalize font-medium px-3 py-1 rounded-xl bg-primary/5 border-primary/20 text-primary">{faq.category}</Badge>
                              {faq.helpful && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground px-3 py-1 rounded-xl bg-muted/30">
                                  <Heart className="h-3 w-3 text-red-500" />
                                  <span className="font-medium">{faq.helpful} helpful</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            {openItems.includes(faq.id) ? (
                              <ChevronDown className="h-6 w-6 text-primary transition-transform duration-300" />
                            ) : (
                              <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-all duration-300" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="px-6 pb-6">
                        <p className="text-muted-foreground leading-relaxed mb-6 font-serif text-base">{faq.answer}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {faq.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs px-2 py-1 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">#{tag}</Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-xs hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-xl">
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
              <Card className="card-modern border-0 backdrop-blur-sm rounded-2xl shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">No Results Found</h3>
                  <p className="text-muted-foreground mb-6 font-serif text-base leading-relaxed max-w-md mx-auto">Try adjusting your search terms or browse different categories to find what you're looking for.</p>
                  <Button onClick={() => { setSearchQuery(""); setSelectedCategory("all") }} className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-8 py-3 hover-lift">
                    <Search className="h-4 w-4 mr-2" />
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-8">
            <Card className="card-modern border-0 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="p-6">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 border border-primary/30">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-muted-foreground font-serif">Get help with common tasks</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <Link href="/contact"><Button variant="outline" className="w-full justify-start h-12 rounded-xl bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 hover-lift"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20"><Mail className="h-4 w-4 text-green-600" /></div>Contact Support</div></Button></Link>
                <Link href="/report-issue"><Button variant="outline" className="w-full justify-start h-12 rounded-xl bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 hover-lift"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20"><Shield className="h-4 w-4 text-red-600" /></div>Report an Issue</div></Button></Link>
                <Link href="/community"><Button variant="outline" className="w-full justify-start h-12 rounded-xl bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 hover-lift"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20"><MessageCircle className="h-4 w-4 text-purple-600" /></div>Join Community</div></Button></Link>
              </CardContent>
            </Card>
            <Card className="card-modern border-0 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="p-6">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-200/30">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  Popular Topics
                </CardTitle>
                <CardDescription className="text-muted-foreground font-serif">Browse by category</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-3">
                {categories.filter(cat => cat.id !== "all").map(category => {
                  const Icon = category.icon
                  return (
                    <Button key={category.id} variant="ghost" onClick={() => setSelectedCategory(category.id)} className="w-full justify-start h-auto p-4 rounded-xl hover:bg-background/50 transition-all duration-300 group hover-lift">
                      <div className="flex items-center gap-4 w-full">
                        <div className={cn("p-3 rounded-xl transition-transform duration-300 group-hover:scale-110", category.color)}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{category.name}</div>
                          <div className="text-sm text-muted-foreground font-serif">{category.description}</div>
                        </div>
                        <Badge variant="secondary" className="text-xs font-medium">{category.count}</Badge>
                      </div>
                    </Button>
                  )
                })}
              </CardContent>
            </Card>
            <Card className="card-modern border-0 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="p-6">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-200/30">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                  Need More Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-muted-foreground mb-6 font-serif leading-relaxed">Can't find what you're looking for? Our support team is here to help.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20"><Mail className="h-4 w-4 text-green-600" /></div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">Email Support</div>
                      <div className="text-xs text-muted-foreground">support@campusaxis.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20"><MessageCircle className="h-4 w-4 text-blue-600" /></div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">Live Chat</div>
                      <div className="text-xs text-muted-foreground">Available 24/7</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
