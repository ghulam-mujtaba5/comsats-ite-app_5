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
import { 
  Search, 
  Eye, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Heart,
  Send,
  Filter,
  Activity,
  Sparkles,
  UserCheck,
  Brain,
  DollarSign,
  Briefcase,
  Users2,
  RefreshCw
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20">
      {/* Hero Section with Glassmorphism */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 backdrop-blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="relative app-container pt-12 pb-8">
          <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
                    <div className="relative bg-gradient-to-r from-pink-600 to-purple-600 p-3 rounded-2xl">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-pink-800 to-purple-800 dark:from-white dark:via-pink-200 dark:to-purple-200 bg-clip-text text-transparent">
                      Student Support Management
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 text-lg">
                      Provide comprehensive support and guidance to students
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-pink-200 dark:border-pink-800">
                    <Activity className="h-3 w-3 mr-1" />
                    {requests.filter(r => r.status === 'pending').length} Pending
                  </Badge>
                  <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-blue-200 dark:border-blue-800">
                    <UserCheck className="h-3 w-3 mr-1" />
                    {requests.filter(r => r.status === 'in-progress').length} In Progress
                  </Badge>
                  <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-green-200 dark:border-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {requests.filter(r => r.status === 'resolved').length} Resolved
                  </Badge>
                  <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-purple-200 dark:border-purple-800">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Support Center
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button size="sm" variant="outline" className="glass-button bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border-white/40 dark:border-slate-600/40 hover:bg-white/50 dark:hover:bg-slate-700/50">
                  <Eye className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                <Button size="sm" onClick={fetchRequests} className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content Management Interface */}
      <div className="app-container space-y-6 pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Support Requests</h2>
            <p className="text-slate-600 dark:text-slate-300">Manage and respond to student support requests</p>
          </div>
          <Badge variant="outline" className="bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
            <Heart className="h-3 w-3 mr-1" />
            Live Support
          </Badge>
        </div>

        {/* Enhanced Filters */}
        <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
          
          <CardContent className="relative p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 w-full lg:w-48">
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
                <SelectTrigger className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 w-full lg:w-48">
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
          </CardContent>
        </Card>
        
        {/* Enhanced Support Requests Display */}
        <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
          
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-lg opacity-30" />
                <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-xl">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900 dark:text-white">
                  Support Requests ({filteredRequests.length})
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Review and respond to student support needs
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 p-8">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                    <span className="text-slate-600 dark:text-slate-300">Loading support requests...</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredRequests.map((request) => {
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
                  
                  const getStatusBadge = (status: string) => {
                    switch (status) {
                      case "pending":
                        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Pending
                        </Badge>
                      case "in-progress":
                        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          In Progress
                        </Badge>
                      case "resolved":
                        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Resolved
                        </Badge>
                      default:
                        return <Badge variant="outline">Unknown</Badge>
                    }
                  }
                  
                  const getCategoryIcon = (category: string) => {
                    switch (category) {
                      case "mental-health":
                        return <Brain className="h-4 w-4" />
                      case "academic":
                        return <Users2 className="h-4 w-4" />
                      case "financial":
                        return <DollarSign className="h-4 w-4" />
                      case "career":
                        return <Briefcase className="h-4 w-4" />
                      case "personal":
                        return <Heart className="h-4 w-4" />
                      default:
                        return <MessageSquare className="h-4 w-4" />
                    }
                  }
                  
                  const getCategoryColor = (category: string) => {
                    const colors = {
                      "mental-health": "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200",
                      "academic": "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
                      "financial": "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
                      "career": "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200",
                      "personal": "bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200"
                    }
                    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200"
                  }
                  
                  const isUrgent = request.status === 'pending'
                  
                  return (
                    <Card key={request.id} className={`glass-card border-0 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-xl group ${
                      isUrgent 
                        ? 'bg-gradient-to-br from-yellow-50/80 to-orange-50/80 dark:from-yellow-950/40 dark:to-orange-950/40 border border-yellow-200/50 dark:border-yellow-800/50 hover:shadow-yellow-500/20'
                        : 'bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-900/40 border border-white/20 dark:border-white/10 hover:shadow-blue-500/10'
                    }`}>
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl" />
                      
                      <CardContent className="relative p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                                isUrgent 
                                  ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                                  : 'bg-gradient-to-br from-blue-500 to-purple-500'
                              }`}>
                                {getCategoryIcon(request.category)}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
                                  {request.is_anonymous ? "Anonymous Request" : request.name || "Student Request"}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-3">
                                  {request.message}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  <Badge className={getCategoryColor(request.category) + " text-xs flex items-center gap-1"}>
                                    {getCategoryIcon(request.category)}
                                    {request.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </Badge>
                                  {!request.is_anonymous && request.email && (
                                    <Badge variant="outline" className="text-xs bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                                      {request.email}
                                    </Badge>
                                  )}
                                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(request.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-3">
                            {getStatusBadge(request.status)}
                            <div className="flex items-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="glass-button"
                                    onClick={() => setSelectedRequest(request)}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View Details
                                  </Button>
                                </DialogTrigger>
                              </Dialog>
                              
                              <Select value={request.status} onValueChange={(status) => updateRequestStatus(request.id, status)}>
                                <SelectTrigger className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 w-32">
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
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
                
                {filteredRequests.length === 0 && (
                  <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 p-12 text-center">
                    <div className="space-y-4">
                      <div className="text-4xl">❤️</div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No Support Requests</h3>
                        <p className="text-slate-600 dark:text-slate-300">No requests found matching your filters.</p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Modern Response Dialog */}
        {selectedRequest && (
          <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
            <DialogContent className="max-w-2xl glass-card border border-white/20 dark:border-white/10 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-600" />
                  Support Request Details
                </DialogTitle>
                <DialogDescription>
                  Review and respond to this support request
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Submitter</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      {selectedRequest.is_anonymous ? "Anonymous" : selectedRequest.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      {selectedRequest.is_anonymous ? "N/A" : selectedRequest.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Category</Label>
                    <Badge className="mt-1 bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200">
                      {selectedRequest.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</Label>
                    <Select
                      value={selectedRequest.status}
                      onValueChange={(value) => updateRequestStatus(selectedRequest.id, value)}
                    >
                      <SelectTrigger className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 mt-1">
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
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Message</Label>
                  <div className="mt-2 p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/40 dark:border-slate-600/40 rounded-lg">
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {selectedRequest.message}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Submitted</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(selectedRequest.created_at).toLocaleString()}
                  </p>
                </div>
                {selectedRequest.status !== 'resolved' && (
                  <div>
                    <Label htmlFor="response" className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Admin Response
                    </Label>
                    <Textarea
                      id="response"
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Type your supportive response here..."
                      rows={4}
                      className="mt-2 glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDetailsDialog(false)}
                  className="glass-button"
                >
                  Close
                </Button>
                {selectedRequest.status !== 'resolved' && (
                  <Button 
                    onClick={sendResponse} 
                    disabled={!response.trim()}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 border-0"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Response & Mark Resolved
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
