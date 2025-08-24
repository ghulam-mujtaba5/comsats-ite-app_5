"use client"

import type { Metadata } from "next"
import { createMetadata, jsonLdBreadcrumb } from "@/lib/seo"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Phone, MessageCircle, BookOpen, Users, Shield, Clock, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CenteredLoader } from "@/components/ui/loading-spinner"

export const metadata: Metadata = createMetadata({
  title: "Student Support — COMSATS ITE",
  description: "Find mental health, academic, financial, and career support resources for COMSATS Lahore students.",
  path: "/student-support",
  keywords: ["student support", "counseling", "financial aid", "tutoring", "COMSATS Lahore"],
})

interface SupportResource {
  id: string
  title: string
  description: string
  category: "mental-health" | "academic" | "financial" | "career" | "personal"
  contactInfo: string
  availability: string
  isEmergency?: boolean
}

export default function StudentSupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
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
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const emergencyResources = supportResources.filter(resource => resource.isEmergency)
  const regularResources = filteredResources.filter(resource => !resource.isEmergency)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Student Support</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get the help and support you need for your academic and personal well-being
          </p>
        </div>

        {/* Emergency Resources */}
        {emergencyResources.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Emergency Support
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {emergencyResources.map((resource) => (
                <Card key={resource.id} className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-800 flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-700 mb-2">{resource.description}</p>
                    <p className="text-sm text-red-600 font-medium">{resource.contactInfo}</p>
                    <p className="text-xs text-red-500 mt-1">{resource.availability}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search support resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="mental-health">Mental Health</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="career">Career</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Request Support Button */}
        <div className="mb-8">
          <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
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
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={requestForm.isAnonymous}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                  />
                  <Label htmlFor="anonymous">Submit anonymously</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitRequest} disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Support Resources */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Support Resources</h2>
          {loading ? (
            <CenteredLoader message="Loading support resources..." />
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : regularResources.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No support resources found matching your criteria</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {regularResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
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
                        <span className="text-blue-600">{resource.contactInfo}</span>
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
