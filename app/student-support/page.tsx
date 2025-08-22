"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Phone, MessageCircle, BookOpen, Users, Shield, Clock, Mail } from "lucide-react"

interface SupportResource {
  id: string
  title: string
  description: string
  category: "mental-health" | "academic" | "financial" | "career" | "personal"
  contactInfo: string
  availability: string
  isEmergency?: boolean
}

interface SupportRequest {
  id: string
  name: string
  email: string
  category: string
  message: string
  isAnonymous: boolean
  status: "pending" | "in-progress" | "resolved"
  createdAt: string
}

const supportResources: SupportResource[] = [
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
]

const mentalHealthTips = [
  {
    title: "Manage Stress",
    description: "Practice deep breathing, meditation, or yoga to reduce stress levels.",
    icon: Heart,
  },
  {
    title: "Stay Connected",
    description: "Maintain relationships with friends, family, and classmates for emotional support.",
    icon: Users,
  },
  {
    title: "Get Enough Sleep",
    description: "Aim for 7-9 hours of sleep per night to maintain mental and physical health.",
    icon: Clock,
  },
  {
    title: "Seek Help Early",
    description: "Don't wait until problems become overwhelming. Reach out for support when needed.",
    icon: MessageCircle,
  },
]

export default function StudentSupportPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [supportRequest, setSupportRequest] = useState({
    name: "",
    email: "",
    category: "",
    message: "",
    isAnonymous: false,
  })

  const filteredResources = supportResources.filter((resource) => {
    return selectedCategory === "all" || resource.category === selectedCategory
  })

  const handleSubmitRequest = () => {
    // In a real app, this would send the request to the backend
    console.log("Support request submitted:", supportRequest)
    setSupportRequest({
      name: "",
      email: "",
      category: "",
      message: "",
      isAnonymous: false,
    })
    setIsRequestDialogOpen(false)
    // Show success message
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "mental-health":
        return Heart
      case "academic":
        return BookOpen
      case "financial":
        return Shield
      case "career":
        return Users
      case "personal":
        return MessageCircle
      default:
        return MessageCircle
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "mental-health":
        return "bg-red-100 text-red-800 border-red-200"
      case "academic":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "financial":
        return "bg-green-100 text-green-800 border-green-200"
      case "career":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "personal":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Student Support</h1>
          <p className="text-muted-foreground mt-2">
            Resources and support for academic, personal, and mental health challenges
          </p>
        </div>
        <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <MessageCircle className="mr-2 h-4 w-4" />
              Request Support
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Request Support</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={supportRequest.isAnonymous}
                  onChange={(e) =>
                    setSupportRequest({ ...supportRequest, isAnonymous: e.target.checked })
                  }
                />
                <Label htmlFor="anonymous">Submit anonymously</Label>
              </div>
              
              {!supportRequest.isAnonymous && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      value={supportRequest.name}
                      onChange={(e) =>
                        setSupportRequest({ ...supportRequest, name: e.target.value })
                      }
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={supportRequest.email}
                      onChange={(e) =>
                        setSupportRequest({ ...supportRequest, email: e.target.value })
                      }
                      placeholder="your.email@student.comsats.edu.pk"
                    />
                  </div>
                </>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="category">Support Category</Label>
                <Select
                  value={supportRequest.category}
                  onValueChange={(value) =>
                    setSupportRequest({ ...supportRequest, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mental-health">Mental Health</SelectItem>
                    <SelectItem value="academic">Academic Support</SelectItem>
                    <SelectItem value="financial">Financial Assistance</SelectItem>
                    <SelectItem value="career">Career Guidance</SelectItem>
                    <SelectItem value="personal">Personal Issues</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={supportRequest.message}
                  onChange={(e) =>
                    setSupportRequest({ ...supportRequest, message: e.target.value })
                  }
                  placeholder="Describe your situation and how we can help..."
                  rows={4}
                />
              </div>
            </div>
            <Button onClick={handleSubmitRequest} className="w-full">
              Submit Request
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="resources" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resources">Support Resources</TabsTrigger>
          <TabsTrigger value="wellness">Wellness Tips</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-6">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All Resources
            </Button>
            <Button
              variant={selectedCategory === "mental-health" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("mental-health")}
            >
              Mental Health
            </Button>
            <Button
              variant={selectedCategory === "academic" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("academic")}
            >
              Academic
            </Button>
            <Button
              variant={selectedCategory === "financial" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("financial")}
            >
              Financial
            </Button>
            <Button
              variant={selectedCategory === "career" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("career")}
            >
              Career
            </Button>
            <Button
              variant={selectedCategory === "personal" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("personal")}
            >
              Personal
            </Button>
          </div>

          {/* Resources Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => {
              const Icon = getCategoryIcon(resource.category)
              return (
                <Card
                  key={resource.id}
                  className={`hover:shadow-lg transition-shadow ${
                    resource.isEmergency ? "border-red-300 bg-red-50" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        {resource.title}
                        {resource.isEmergency && (
                          <Badge variant="destructive" className="text-xs">
                            Emergency
                          </Badge>
                        )}
                      </CardTitle>
                    </div>
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
                      {resource.category.replace("-", " ").toUpperCase()}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{resource.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{resource.contactInfo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{resource.availability}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      <Phone className="mr-2 h-4 w-4" />
                      Contact Now
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="wellness" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {mentalHealthTips.map((tip, index) => {
              const Icon = tip.icon
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon className="h-5 w-5 text-blue-600" />
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">Remember</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700">
                It's okay to not be okay. Seeking help is a sign of strength, not weakness. 
                Our support services are here to help you succeed both academically and personally.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4">Emergency Contacts</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white rounded border">
                <div>
                  <p className="font-medium">Campus Security</p>
                  <p className="text-sm text-muted-foreground">For immediate campus emergencies</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">042-111-001-007</p>
                  <p className="text-xs">24/7 Available</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white rounded border">
                <div>
                  <p className="font-medium">Crisis Helpline</p>
                  <p className="text-sm text-muted-foreground">Mental health crisis support</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">042-111-911-911</p>
                  <p className="text-xs">24/7 Available</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white rounded border">
                <div>
                  <p className="font-medium">Medical Emergency</p>
                  <p className="text-sm text-muted-foreground">Campus medical center</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">042-111-001-008</p>
                  <p className="text-xs">Mon-Fri 8:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>When to Seek Emergency Help</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Thoughts of self-harm or suicide</li>
                <li>Severe panic attacks or anxiety</li>
                <li>Substance abuse emergencies</li>
                <li>Domestic violence situations</li>
                <li>Any situation where immediate safety is at risk</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
