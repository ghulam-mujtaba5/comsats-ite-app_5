"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Eye, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SupportRequest {
  id: string
  name?: string
  email?: string
  category: string
  message: string
  is_anonymous: boolean
  status: "pending" | "in-progress" | "resolved"
  user_id: string
  assigned_to?: string
  created_at: string
  updated_at: string
}

export default function AdminSupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [requests, setRequests] = useState<SupportRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/student-support/requests')
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      } else {
        throw new Error('Failed to fetch support requests')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load support requests",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/student-support/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Request status updated successfully"
        })
        fetchRequests()
        if (selectedRequest?.id === id) {
          setSelectedRequest({ ...selectedRequest, status: status as any })
        }
      } else {
        throw new Error('Failed to update status')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive"
      })
    }
  }

  const sendResponse = async () => {
    if (!selectedRequest || !response.trim()) return

    try {
      const res = await fetch(`/api/student-support/requests/${selectedRequest.id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: response })
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "Response sent successfully"
        })
        setResponse("")
        updateRequestStatus(selectedRequest.id, "resolved")
      } else {
        throw new Error('Failed to send response')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send response",
        variant: "destructive"
      })
    }
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = 
      request.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.name && request.name.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesCategory = categoryFilter === "all" || request.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "in-progress":
        return <AlertCircle className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      "mental-health": "bg-purple-100 text-purple-800",
      "academic": "bg-blue-100 text-blue-800",
      "financial": "bg-green-100 text-green-800",
      "career": "bg-orange-100 text-orange-800",
      "personal": "bg-pink-100 text-pink-800"
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="app-container section">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Support Request Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage and respond to student support requests
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold">{requests.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {requests.filter(r => r.status === 'in-progress').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {requests.filter(r => r.status === 'resolved').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="text-center py-8">Loading support requests...</div>
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} variant="elevated">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(request.status)}
                      <CardTitle className="text-lg">
                        {request.is_anonymous ? "Anonymous Request" : request.name || "Student Request"}
                      </CardTitle>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      <Badge className={getCategoryColor(request.category)} variant="outline">
                        {request.category}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {request.message}
                    </CardDescription>
                    <p className="text-xs text-gray-500 mt-2">
                      Submitted: {new Date(request.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Support Request Details</DialogTitle>
                          <DialogDescription>
                            Review and respond to this support request
                          </DialogDescription>
                        </DialogHeader>
                        {selectedRequest && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Submitter</Label>
                                <p className="text-sm">
                                  {selectedRequest.is_anonymous ? "Anonymous" : selectedRequest.name || "N/A"}
                                </p>
                              </div>
                              <div>
                                <Label>Email</Label>
                                <p className="text-sm">
                                  {selectedRequest.is_anonymous ? "N/A" : selectedRequest.email || "N/A"}
                                </p>
                              </div>
                              <div>
                                <Label>Category</Label>
                                <Badge className={getCategoryColor(selectedRequest.category)} variant="outline">
                                  {selectedRequest.category}
                                </Badge>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <Select
                                  value={selectedRequest.status}
                                  onValueChange={(value) => updateRequestStatus(selectedRequest.id, value)}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label>Message</Label>
                              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                                <p className="text-sm whitespace-pre-wrap">{selectedRequest.message}</p>
                              </div>
                            </div>
                            <div>
                              <Label>Submitted</Label>
                              <p className="text-sm text-gray-600">
                                {new Date(selectedRequest.created_at).toLocaleString()}
                              </p>
                            </div>
                            {selectedRequest.status !== 'resolved' && (
                              <div>
                                <Label htmlFor="response">Admin Response</Label>
                                <Textarea
                                  id="response"
                                  value={response}
                                  onChange={(e) => setResponse(e.target.value)}
                                  placeholder="Type your response here..."
                                  rows={4}
                                />
                              </div>
                            )}
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                            Close
                          </Button>
                          {selectedRequest?.status !== 'resolved' && (
                            <Button onClick={sendResponse} disabled={!response.trim()}>
                              Send Response & Mark Resolved
                            </Button>
                          )}
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Select
                      value={request.status}
                      onValueChange={(value) => updateRequestStatus(request.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
          {filteredRequests.length === 0 && (
            <Card variant="soft" className="p-8 text-center">
              <div className="text-muted-foreground">No support requests found matching your criteria</div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
