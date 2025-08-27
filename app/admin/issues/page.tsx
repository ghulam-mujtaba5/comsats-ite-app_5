"use client"

import { useEffect, useState } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { notifyFetch } from "@/lib/notify"
import { Bug, AlertTriangle, CheckCircle, Clock, ArrowLeft, Filter, Sparkles } from "lucide-react"
import Link from "next/link"

type Issue = {
  id: string
  title: string
  description: string
  category: string
  email: string | null
  status: "open" | "in_progress" | "resolved"
  created_at: string
}

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <AdminGuard fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20">
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-8 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 text-center space-y-4 max-w-md">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">Admin Access Required</div>
            <p className="text-slate-600 dark:text-slate-300">Please log in to access the issues management panel.</p>
          </div>
        </div>
      </div>
    }>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-orange-600/10 to-amber-600/10 backdrop-blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
          
          <div className="relative app-container pt-12 pb-8">
            <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Link href="/admin" className="group">
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
                      <h1 id="issues-heading" className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-red-800 to-orange-800 dark:from-white dark:via-red-200 dark:to-orange-200 bg-clip-text text-transparent">
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
                
                <div className="flex gap-3">
                  <Button variant="outline" className="glass-button bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border-white/40 dark:border-slate-600/40 hover:bg-white/50 dark:hover:bg-slate-700/50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter Issues
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Issues Content */}
        <div className="app-container space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="glass-card border border-white/20 dark:border-white/10 rounded-2xl p-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-slate-600 dark:text-slate-300">Loading issues...</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {issues.map((it, index) => {
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
                    case 'in_progress': return 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                    default: return 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                  }
                }
                
                return (
                  <Card key={it.id} className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 group hover:scale-[1.01] transition-all duration-300 hover:shadow-lg" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {it.title}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(it.created_at).toLocaleString()}
                          </span>
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-medium">
                            {it.category}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(it.status)}>
                        {getStatusIcon(it.status)}
                        <span className="ml-1 capitalize">{it.status.replace('_', ' ')}</span>
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                        <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          {it.description}
                        </p>
                      </div>
                      
                      {it.email && (
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
                            onClick={() => setStatus(it.id, 'resolved')}
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
