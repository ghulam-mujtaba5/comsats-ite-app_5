"use client"

import { jsonLdBreadcrumb } from "@/lib/seo"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdvancedFilterBar } from "@/components/search/advanced-filter-bar"
import { standardFilters, sortOptions } from "@/lib/filter-data"
import { Heart, Phone, MessageCircle, BookOpen, Users, Shield, Clock, Mail, Filter, RotateCcw, AlertTriangle, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CenteredLoader } from "@/components/ui/loading-spinner"

interface SupportResource {
  id: string
  title: string
  description: string
  category: "mental-health" | "academic" | "financial" | "career" | "personal" | "technical"
  contactInfo: string
  availability: string
  isEmergency?: boolean
  priority?: "high" | "medium" | "low"
  rating?: number
  tags?: string[]
  lastUpdated?: string
}

export default function StudentSupportPage() {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false)
  const [currentSort, setCurrentSort] = useState("priority-desc")
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [supportResources, setSupportResources] = useState<SupportResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [requestForm, setRequestForm] = useState({
    name: "",
    email: "",
    category: "",
    message: "",
    isAnonymous: false
  })
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/student-support/resources')
        if (response.ok) {
          const data = await response.json()
          setSupportResources(data)
        } else {
          throw new Error('Failed to fetch resources')
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load support resources")
        // Fallback to static data if API fails
        setSupportResources([
          {
            id: "1",
            title: "Counseling Services",
            description: "Professional counseling for mental health, stress management, and personal issues.",
            category: "mental-health",
            contactInfo: "counseling@cuilahore.edu.pk | Ext: 2345",
            availability: "Mon-Fri 9:00 AM - 5:00 PM",
            isEmergency: false,
          },
          {
            id: "2",
            title: "Crisis Helpline",
            description: "24/7 emergency support for students in crisis situations.",
            category: "mental-health",
            contactInfo: "Crisis Hotline: 042-111-911-911",
            availability: "24/7 Available",
            isEmergency: true,
          },
          {
            id: "3",
            title: "Academic Tutoring",
            description: "Free tutoring services for struggling students in various subjects.",
            category: "academic",
            contactInfo: "tutoring@cuilahore.edu.pk | Room A-105",
            availability: "Mon-Fri 2:00 PM - 6:00 PM",
          },
          {
            id: "4",
            title: "Financial Aid Office",
            description: "Assistance with scholarships, grants, and financial planning.",
            category: "financial",
            contactInfo: "finaid@cuilahore.edu.pk | Room B-201",
            availability: "Mon-Fri 9:00 AM - 4:00 PM",
          },
          {
            id: "5",
            title: "Career Counseling",
            description: "Career guidance, resume building, and job placement assistance.",
            category: "career",
            contactInfo: "careers@cuilahore.edu.pk | Room C-301",
            availability: "Tue-Thu 10:00 AM - 3:00 PM",
          },
          {
            id: "6",
            title: "Peer Support Groups",
            description: "Student-led support groups for various challenges and interests.",
            category: "personal",
            contactInfo: "peersupport@cuilahore.edu.pk",
            availability: "Various times - Check schedule",
          },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchResources()
  }, [])

  const handleSubmitRequest = async () => {
    if (!requestForm.name.trim() || !requestForm.email.trim() || !requestForm.message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/student-support/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestForm)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Support request submitted successfully. We will get back to you soon."
        })
        setRequestForm({ name: "", email: "", category: "", message: "", isAnonymous: false })
        setShowRequestDialog(false)
        setTimeout(() => triggerRef.current?.focus(), 0)
      } else {
        throw new Error('Failed to submit request')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const filteredResources = supportResources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    const matchesPriority = selectedPriority === "all" || resource.priority === selectedPriority
    const matchesEmergency = !showEmergencyOnly || resource.isEmergency
    
    return matchesSearch && matchesCategory && matchesPriority && matchesEmergency
  }).sort((a, b) => {
    let result = 0
    switch (currentSort) {
      case 'priority-desc':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        result = (priorityOrder[b.priority || 'medium'] || 2) - (priorityOrder[a.priority || 'medium'] || 2)
        break
      case 'title-asc':
        result = a.title.localeCompare(b.title)
        break
      case 'category-asc':
        result = a.category.localeCompare(b.category)
        break
      case 'rating-desc':
        result = (b.rating || 0) - (a.rating || 0)
        break
      case 'updated-desc':
        result = new Date(b.lastUpdated || '').getTime() - new Date(a.lastUpdated || '').getTime()
        break
      default:
        result = 0
    }
    return sortDirection === 'desc' ? -result : result
  })

  const emergencyResources = supportResources.filter(resource => resource.isEmergency)
  const regularResources = filteredResources.filter(resource => !resource.isEmergency)

  // Create actionable links for contact info where possible
  const contactToHref = (contact: string): { href?: string; text: string } => {
    const trimmed = contact.trim()
    // Basic email detection
    const emailMatch = trimmed.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
    if (emailMatch) {
      return { href: `mailto:${emailMatch[0]}`, text: trimmed }
    }
    // Basic phone detection (digits, +, spaces, hyphens)
    const phoneMatch = trimmed.match(/\+?[0-9][0-9\-\s()]{5,}/)
    if (phoneMatch && !trimmed.toLowerCase().includes('ext')) {
      const digits = phoneMatch[0].replace(/[^0-9+]/g, '')
      return { href: `tel:${digits}`, text: trimmed }
    }
    return { text: trimmed }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 border border-red-200 dark:border-red-700/30 text-sm font-medium text-red-700 dark:text-red-300 mb-6">
            <Heart className="h-4 w-4" />
            Student Wellbeing
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            Student <span className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">Support</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-8 font-medium leading-relaxed">
            Get the help and support you need for your academic and personal well-being. We're here to help you succeed.
          </p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500/20 to-pink-600/20 border border-red-200/30 dark:border-red-700/30">
                <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{supportResources.length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Support Services</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-200/30 dark:border-orange-700/30">
                <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{emergencyResources.length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Emergency Resources</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-200/30 dark:border-blue-700/30">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{supportResources.filter(r => r.category === 'mental-health').length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Mental Health</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-200/30 dark:border-green-700/30">
                <BookOpen className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{supportResources.filter(r => r.category === 'academic').length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Academic Support</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Resources */}
        {emergencyResources.length > 0 && (
          <div className="mb-8" aria-live="polite" {...(loading ? ({ 'aria-busy': 'true' } as any) : {})}>
            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Emergency Support
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {emergencyResources.map((resource) => (
                <Card key={resource.id} className="border-primary/30 bg-primary/10 dark:bg-primary/15">
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-primary mb-2">{resource.description}</p>
                    <p className="text-sm text-primary font-medium">{resource.contactInfo}</p>
                    <p className="text-xs text-primary/80 mt-1">{resource.availability}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Search and Filters */}
        <AdvancedFilterBar
          search={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search support resources by title, description, or tags..."
          selects={[
            {
              ...standardFilters.supportCategories,
              value: selectedCategory,
              onChange: setSelectedCategory,
              label: "Support Category",
              description: "Filter by type of support needed",
              options: [...standardFilters.supportCategories.options] as Array<{ label: string; value: string; description?: string }>
            },
            {
              id: "priority",
              value: selectedPriority,
              onChange: setSelectedPriority,
              placeholder: "All Priorities",
              label: "Priority Level",
              description: "Filter by urgency level",
              options: [
                { label: "All Priorities", value: "all" },
                { label: "High Priority", value: "high", description: "Urgent support needed" },
                { label: "Medium Priority", value: "medium", description: "Important but not urgent" },
                { label: "Low Priority", value: "low", description: "General information" }
              ]
            }
          ]}
          sortOptions={[
            { label: "Priority (High to Low)", value: "priority-desc" },
            { label: "Title A-Z", value: "title-asc" },
            { label: "Category", value: "category-asc" },
            { label: "Highest Rated", value: "rating-desc" },
            { label: "Recently Updated", value: "updated-desc" }
          ]}
          currentSort={currentSort}
          onSortChange={setCurrentSort}
          sortDirection={sortDirection}
          onSortDirectionChange={setSortDirection}
          filterPresets={[
            {
              id: 'emergency',
              name: 'Emergency Only',
              filters: { priority: 'high' },
              description: 'High priority emergency resources'
            },
            {
              id: 'mental-health',
              name: 'Mental Health',
              filters: { category: 'mental-health' },
              description: 'Mental health and wellness support'
            },
            {
              id: 'academic',
              name: 'Academic Help',
              filters: { category: 'academic' },
              description: 'Academic support and tutoring'
            }
          ]}
          showActiveFilterCount={true}
          collapsible={true}
          defaultCollapsed={false}
          className="mb-10"
          right={
            <div className="flex items-center gap-4">
              {/* Emergency Only Toggle */}
              <Button
                variant={showEmergencyOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowEmergencyOnly(!showEmergencyOnly)}
                className="flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4" />
                Emergency Only
              </Button>
              
              {/* Quick Clear Filters */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setSelectedPriority("all")
                  setShowEmergencyOnly(false)
                }}
                className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
              >
                <RotateCcw className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          }
        />

        {/* Request Support Button */}
        <div className="mb-8">
          <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
            <DialogTrigger asChild>
              <Button ref={triggerRef} className="w-full md:w-auto">
                <MessageCircle className="h-4 w-4 mr-2" />
                Request Support
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Support</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={requestForm.name}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                    required
                    aria-required="true"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={requestForm.email}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@student.cuilahore.edu.pk"
                    required
                    aria-required="true"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={requestForm.category} onValueChange={(value) => setRequestForm(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mental-health">Mental Health</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="career">Career</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={requestForm.message}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Describe your situation and how we can help..."
                    rows={4}
                    required
                    aria-required="true"
                    autoComplete="off"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    name="anonymous"
                    aria-label="Submit anonymously"
                    checked={requestForm.isAnonymous}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                  />
                  <Label htmlFor="anonymous">Submit anonymously</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitRequest} disabled={submitting || !requestForm.name || !requestForm.email || !requestForm.message}>
                    {submitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Support Resources */}
        <div aria-live="polite" {...(loading ? ({ 'aria-busy': 'true' } as any) : {})}>
          <h2 className="text-xl font-semibold mb-4">Available Support Resources</h2>
          <div className="sr-only" role="status" aria-live="polite">
            {regularResources.length} resources shown
          </div>
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={`sk-${i}`} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">{error}</div>
          ) : regularResources.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No support resources found matching your criteria</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {regularResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow interactive hover-lift">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <Badge variant="outline">
                        {resource.category.replace('-', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{resource.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-blue-500" />
                        {(() => {
                          const c = contactToHref(resource.contactInfo)
                          return c.href ? (
                            <a href={c.href} className="text-blue-600 underline underline-offset-2" aria-label={`Contact ${resource.title}: ${resource.contactInfo}`}>{c.text}</a>
                          ) : (
                            <span className="text-blue-600">{resource.contactInfo}</span>
                          )
                        })()}
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-green-600">{resource.availability}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: "Home", path: "/" }, { name: "Student Support", path: "/student-support" }])) }}
      />
    </div>
  )
}
