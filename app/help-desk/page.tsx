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
import { Search, Plus, MessageCircle, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface Ticket {
  id: string
  title: string
  description: string
  category: string
  priority: "low" | "medium" | "high"
  status: "open" | "in-progress" | "resolved" | "closed"
  createdAt: string
  updatedAt: string
  studentName: string
  studentId: string
  responses: Response[]
}

interface Response {
  id: string
  message: string
  author: string
  role: "student" | "admin"
  timestamp: string
}

const mockTickets: Ticket[] = [
  {
    id: "1",
    title: "Fee Payment Issue",
    description: "I'm unable to pay my semester fee online. The payment gateway shows an error.",
    category: "Finance",
    priority: "high",
    status: "open",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
    studentName: "Ahmad Ali",
    studentId: "SP21-BCS-001",
    responses: [],
  },
  {
    id: "2",
    title: "Transcript Request",
    description: "I need my official transcript for job application. How can I request it?",
    category: "Academic Records",
    priority: "medium",
    status: "in-progress",
    createdAt: "2024-01-19T14:30:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
    studentName: "Fatima Khan",
    studentId: "SP20-BCS-045",
    responses: [
      {
        id: "1",
        message: "Please visit the registrar office with your ID card and fee receipt.",
        author: "Admin Support",
        role: "admin",
        timestamp: "2024-01-20T09:15:00Z",
      },
    ],
  },
  {
    id: "3",
    title: "Course Registration Problem",
    description: "I cannot register for CS-401. It shows 'prerequisite not met' but I have completed CS-301.",
    category: "Registration",
    priority: "medium",
    status: "resolved",
    createdAt: "2024-01-18T11:20:00Z",
    updatedAt: "2024-01-19T16:45:00Z",
    studentName: "Usman Malik",
    studentId: "SP21-BCS-023",
    responses: [
      {
        id: "1",
        message: "We've updated your academic record. You can now register for CS-401.",
        author: "Academic Office",
        role: "admin",
        timestamp: "2024-01-19T16:45:00Z",
      },
    ],
  },
]

const categories = [
  "Finance",
  "Academic Records",
  "Registration",
  "Admissions",
  "Technical Support",
  "General Inquiry",
]

export default function HelpDeskPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium" as "low" | "medium" | "high",
    studentName: "",
    studentId: "",
  })

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleSubmit = () => {
    const ticket: Ticket = {
      id: Date.now().toString(),
      ...newTicket,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [],
    }
    setTickets([ticket, ...tickets])
    setNewTicket({
      title: "",
      description: "",
      category: "",
      priority: "medium",
      studentName: "",
      studentId: "",
    })
    setIsDialogOpen(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "closed":
        return <CheckCircle className="h-4 w-4 text-gray-500" />
      default:
        return <MessageCircle className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Help Desk</h1>
          <p className="text-muted-foreground mt-2">
            Get help with admissions, fees, registration, and other queries
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Submit Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Submit Help Request</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="studentName">Your Name</Label>
                  <Input
                    id="studentName"
                    value={newTicket.studentName}
                    onChange={(e) => setNewTicket({ ...newTicket, studentName: e.target.value })}
                    placeholder="Full Name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    value={newTicket.studentId}
                    onChange={(e) => setNewTicket({ ...newTicket, studentId: e.target.value })}
                    placeholder="SP21-BCS-001"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newTicket.category}
                  onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTicket.priority}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setNewTicket({ ...newTicket, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Subject</Label>
                <Input
                  id="title"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  placeholder="Brief description of your issue"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Provide detailed information about your issue..."
                  rows={4}
                />
              </div>
            </div>
            <Button onClick={handleSubmit} className="w-full">
              Submit Ticket
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="my-tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select
              value={filterStatus}
              onValueChange={setFilterStatus}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(ticket.status)}
                      {ticket.title}
                    </CardTitle>
                    <CardDescription>
                      {ticket.studentName} • {ticket.studentId} • {ticket.category}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge variant="outline">
                      {ticket.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {ticket.description.length > 150 
                    ? `${ticket.description.substring(0, 150)}...` 
                    : ticket.description}
                </p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                  <span>{ticket.responses.length} responses</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="my-tickets">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Login to view your tickets</p>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>How to pay fees online?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Visit the student portal, go to Finance section, and follow the payment instructions.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>How to get official transcript?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Visit the registrar office with your ID card, fee receipt, and application form.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Course registration deadline?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Registration typically opens 2 weeks before semester start and closes 1 week after.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>How to apply for scholarship?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Check the financial aid office for available scholarships and application procedures.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Ticket Detail Dialog */}
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getStatusIcon(selectedTicket.status)}
                {selectedTicket.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge variant={getPriorityColor(selectedTicket.priority)}>
                  {selectedTicket.priority}
                </Badge>
                <Badge variant="outline">
                  {selectedTicket.status}
                </Badge>
                <Badge variant="secondary">
                  {selectedTicket.category}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Student: {selectedTicket.studentName} ({selectedTicket.studentId})</p>
                <p>Created: {new Date(selectedTicket.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm">{selectedTicket.description}</p>
              </div>
              {selectedTicket.responses.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Responses</h4>
                  <div className="space-y-3">
                    {selectedTicket.responses.map((response) => (
                      <div key={response.id} className="border-l-2 border-blue-200 pl-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">{response.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(response.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{response.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
