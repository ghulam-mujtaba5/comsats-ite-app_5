"use client"

import { useEffect, useState } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { notifyFetch } from "@/lib/notify"
import { Bug, AlertTriangle, CheckCircle, Clock, ArrowLeft, Filter, Sparkles, Send, MessageCircle } from "lucide-react"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"

type Issue = {
  id: string
  title: string
  description: string
  category: string
  email: string | null
  status: "open" | "in_progress" | "resolved"
  created_at: string
}

type IssueResponse = {
  id: string
  message: string
  is_admin: boolean
  created_at: string
  user: {
    id: string
    email: string | null
  }
}

import styles from "../admin-shared.module.css"

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [responses, setResponses] = useState<IssueResponse[]>([])
  const [newResponse, setNewResponse] = useState("")
  const [responsesLoading, setResponsesLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await notifyFetch('/api/issues', undefined, { errorMessage: 'Failed to load issues' })
      if (res.ok) {
        const j = await res.json()
        setIssues(j.issues || [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const setStatus = async (id: string, status: Issue['status']) => {
    const res = await notifyFetch(`/api/issues/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }, { errorMessage: 'Failed to update status', successMessage: 'Status updated', showOnSuccess: true })
    if (res.ok) load()
  }

  const loadResponses = async (issueId: string) => {
    setResponsesLoading(true)
    try {
      const res = await notifyFetch(`/api/issues/${issueId}/responses`, undefined, { errorMessage: 'Failed to load responses' })
      if (res.ok) {
        const j = await res.json()
        setResponses(j.responses || [])
      }
    } finally {
      setResponsesLoading(false)
    }
  }

  const sendResponse = async () => {
    if (!selectedIssue || !newResponse.trim()) return

    try {
      const res = await notifyFetch(`/api/issues/${selectedIssue.id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newResponse.trim() })
      }, { errorMessage: 'Failed to send response', successMessage: 'Response sent', showOnSuccess: true })

      if (res.ok) {
        setNewResponse("")
        loadResponses(selectedIssue.id)
      }
    } catch (error) {
      console.error('Error sending response:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4" />
      case 'in_progress': return <Clock className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
      case 'in_progress': return 'bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300'
      default: return 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
    }
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-800 dark:to-orange-800">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
          <div className="relative">
            <div className={`${styles.section} py-8`}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Link href="/admin">
                    <Button variant="outline" className="glass-button bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border-white/40 dark:border-slate-600/40 hover:bg-white/50 dark:hover:bg-slate-700/50">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Admin
                    </Button>
                  </Link>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
                    <div className="relative bg-gradient-to-r from-red-600 to-orange-600 p-4 rounded-2xl">
                      <Bug className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 id="issues-heading" className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-red-800 to-orange-600 dark:from-white dark:via-red-200 dark:to-orange-200 bg-clip-text text-transparent">
                      Issue Tracking
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 text-lg mt-1">
                      Monitor and resolve platform issues and user reports
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-red-200 dark:border-red-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Issue Management
                  </Badge>
                  <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-green-200 dark:border-green-800">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Real-time Updates
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Issues Content */}
        <div className={`${styles.section} ${styles.spaceY6}`}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="glass-card border border-white/20 dark:border-white/10 rounded-2xl p-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-slate-600 dark:text-slate-300">Loading issues...</span>
                </div>
              </div>
            </div>
          ) : selectedIssue ? (
            <div className="space-y-6">
              <Button 
                variant="outline" 
                onClick={() => setSelectedIssue(null)}
                className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Issues
              </Button>
              
              <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedIssue.title}</h2>
                        <Badge variant="outline" className={getStatusColor(selectedIssue.status)}>
                          {getStatusIcon(selectedIssue.status)}
                          <span className="ml-1 capitalize">{selectedIssue.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <span>
                          {new Date(selectedIssue.created_at).toLocaleString()}
                        </span>
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-medium">
                          {selectedIssue.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                    <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedIssue.description}
                    </p>
                  </div>
                  
                  {(selectedIssue.email && selectedIssue.email.trim() !== "") && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">Reporter:</span>
                      <span>{selectedIssue.email}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 pt-2">
                    <Select value={selectedIssue.status} onValueChange={(v) => setStatus(selectedIssue.id, v as Issue['status'])}>
                      <SelectTrigger className="w-48 glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">🔴 Open</SelectItem>
                        <SelectItem value="in_progress">🟡 In Progress</SelectItem>
                        <SelectItem value="resolved">🟢 Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {selectedIssue.status !== 'resolved' && (
                      <Button 
                        variant="outline" 
                        onClick={() => setStatus(selectedIssue.id, 'resolved')}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Responses Section */}
              <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Responses</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {responsesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {responses.length === 0 ? (
                        <p className="text-slate-600 dark:text-slate-400 text-center py-4">No responses yet.</p>
                      ) : (
                        responses.map((response) => (
                          <div 
                            key={response.id} 
                            className={`p-4 rounded-xl ${
                              response.is_admin 
                                ? 'bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800' 
                                : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-sm font-medium ${
                                response.is_admin 
                                  ? 'text-blue-700 dark:text-blue-300' 
                                  : 'text-slate-700 dark:text-slate-300'
                              }`}>
                                {response.is_admin ? 'Admin' : (response.user.email || 'User')}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {new Date(response.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                              {response.message}
                            </p>
                          </div>
                        ))
                      )}
                      
                      {/* Response Form */}
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        <h4 className="font-medium text-slate-900 dark:text-white mb-2">Add Response</h4>
                        <div className="space-y-3">
                          <Textarea
                            value={newResponse}
                            onChange={(e) => setNewResponse(e.target.value)}
                            placeholder="Write your response..."
                            rows={3}
                          />
                          <div className="flex justify-end">
                            <Button 
                              onClick={sendResponse}
                              disabled={!newResponse.trim()}
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Send Response
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {issues.map((it, index) => {
                return (
                  <Card 
                    key={it.id} 
                    className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setSelectedIssue(it)
                      loadResponses(it.id)
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{it.title}</h2>
                            <Badge variant="outline" className={getStatusColor(it.status)}>
                              {getStatusIcon(it.status)}
                              <span className="ml-1 capitalize">{it.status.replace('_', ' ')}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                            <span>
                              {new Date(it.created_at).toLocaleString()}
                            </span>
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-medium">
                              {it.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                        <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
                          {it.description}
                        </p>
                      </div>
                      
                      {(it.email && it.email.trim() !== "") && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">Reporter:</span>
                          <span>{it.email}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 pt-2">
                        <Select value={it.status} onValueChange={(v) => setStatus(it.id, v as Issue['status'])}>
                          <SelectTrigger className="w-48 glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">🔴 Open</SelectItem>
                            <SelectItem value="in_progress">🟡 In Progress</SelectItem>
                            <SelectItem value="resolved">🟢 Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {it.status !== 'resolved' && (
                          <Button 
                            variant="outline" 
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation()
                              setStatus(it.id, 'resolved')
                            }}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Resolved
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              
              {issues.length === 0 && (
                <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 p-12 text-center">
                  <div className="space-y-4">
                    <div className="relative mx-auto w-16 h-16">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-xl opacity-30" />
                      <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-2xl">
                        <CheckCircle className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">All Clear!</h3>
                      <p className="text-slate-600 dark:text-slate-300">
                        No issues reported yet. The platform is running smoothly.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  )
}