"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Search, MessageSquare, Clock, CheckCircle, AlertCircle, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Ticket {
  id: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  user_id: string
  created_at: string
  updated_at: string
}

interface TicketResponse {
  id: string
  ticket_id: string
  message: string
  is_admin: boolean
  created_at: string
}

export default function AdminHelpDeskPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [responses, setResponses] = useState<Record<string, TicketResponse[]>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [responseMessage, setResponseMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/help-desk/tickets')
      if (response.ok) {
        const data = await response.json()
        setTickets(data)
        
        // Fetch responses for each ticket
        const responsesData: Record<string, TicketResponse[]> = {}
        for (const ticket of data) {
          const respResponse = await fetch(`/api/help-desk/tickets/${ticket.id}/responses`)
          if (respResponse.ok) {
            const respData = await respResponse.json()
            responsesData[ticket.id] = respData
          }
        }
        setResponses(responsesData)
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
      toast({
        title: "Error",
        description: "Failed to fetch tickets",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const response = await fetch(`/api/help-desk/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        setTickets(prev => prev.map(ticket => 
          ticket.id === ticketId ? { ...ticket, status: status as any } : ticket
        ))
        toast({
          title: "Success",
          description: "Ticket status updated"
        })
      }
    } catch (error) {
      console.error('Error updating ticket:', error)
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive"
      })
    }
  }

  const submitResponse = async () => {
    if (!selectedTicket || !responseMessage.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/help-desk/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: selectedTicket.id,
          message: responseMessage,
          is_admin: true
        })
      })

      if (response.ok) {
        const newResponse = await response.json()
        setResponses(prev => ({
          ...prev,
          [selectedTicket.id]: [...(prev[selectedTicket.id] || []), newResponse]
        }))
        setResponseMessage("")
        toast({
          title: "Success",
          description: "Response sent successfully"
        })
      }
    } catch (error) {
      console.error('Error sending response:', error)
      toast({
        title: "Error",
        description: "Failed to send response",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Help Desk Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage support tickets and respond to student queries
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
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

        {/* Tickets List */}
        {loading ? (
          <div className="text-center py-8">Loading tickets...</div>
        ) : (
          <div className="grid gap-4">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{ticket.title}</CardTitle>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority} priority
                        </Badge>
                        <Badge variant="outline">
                          {ticket.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            View & Respond
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{ticket.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Description</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {ticket.description}
                              </p>
                            </div>
                            
                            <div>
                              <Label>Status</Label>
                              <Select 
                                value={ticket.status} 
                                onValueChange={(value) => updateTicketStatus(ticket.id, value)}
                              >
                                <SelectTrigger className="w-48 mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="open">Open</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Responses */}
                            <div>
                              <Label>Conversation</Label>
                              <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                                {responses[ticket.id]?.map((response) => (
                                  <div 
                                    key={response.id}
                                    className={`p-3 rounded-lg ${
                                      response.is_admin 
                                        ? 'bg-blue-50 ml-4' 
                                        : 'bg-gray-50 mr-4'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <User className="h-3 w-3" />
                                      <span className="text-xs font-medium">
                                        {response.is_admin ? 'Admin' : 'Student'}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(response.created_at).toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="text-sm">{response.message}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Response Form */}
                            <div>
                              <Label htmlFor="response">Your Response</Label>
                              <Textarea
                                id="response"
                                placeholder="Type your response here..."
                                value={responseMessage}
                                onChange={(e) => setResponseMessage(e.target.value)}
                                className="mt-1"
                              />
                              <Button 
                                onClick={submitResponse}
                                disabled={submitting || !responseMessage.trim()}
                                className="mt-2"
                              >
                                {submitting ? "Sending..." : "Send Response"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {ticket.description.substring(0, 150)}
                    {ticket.description.length > 150 && "..."}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
                    <span>Responses: {responses[ticket.id]?.length || 0}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredTickets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No tickets found matching your criteria
              </div>
            )}
          </div>
        )}
      </div>
    </AdminGuard>
  )
}
