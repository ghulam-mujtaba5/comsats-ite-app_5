"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  RefreshCw,
  Activity,
  Clock,
  Calendar,
  BookOpen,
  Sparkles,
  Eye,
  Download
} from "lucide-react"

interface PastPaper {
  id: string
  title?: string | null
  course_code?: string | null
  semester?: string | null
  year?: number | null
  file_url?: string | null
  status?: string | null
  created_at?: string | null
  [key: string]: any
}

export default function PastPapersModerationPage() {
  const [items, setItems] = useState<PastPaper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState("pending")

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/past-papers?status=${encodeURIComponent(statusFilter)}`, { cache: "no-store" })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || "Failed to load")
      setItems(j.data || [])
    } catch (e: any) {
      setError(e.message || "Failed to load")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [statusFilter])

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/past-papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'Failed to update')
      await load()
    } catch (e) {
      alert((e as any).message || 'Failed')
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this past paper?')) return
    try {
      const res = await fetch(`/api/admin/past-papers?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'Failed to delete')
      await load()
    } catch (e) {
      alert((e as any).message || 'Failed')
    }
  }

  return (
    <AdminGuard fallback={<div className="p-6 text-center">Admin access required.</div>}>
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
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
                      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-2xl">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-indigo-800 to-purple-800 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
                        Past Papers Moderation
                      </h1>
                      <p className="text-slate-600 dark:text-slate-300 text-lg">
                        Review and approve submitted past papers from students
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-indigo-200 dark:border-indigo-800">
                      <Activity className="h-3 w-3 mr-1" />
                      {items.filter(i => i.status === 'pending').length} Pending
                    </Badge>
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-green-200 dark:border-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {items.filter(i => i.status === 'approved').length} Approved
                    </Badge>
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-purple-200 dark:border-purple-800">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Content Review
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button size="sm" variant="outline" className="glass-button bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border-white/40 dark:border-slate-600/40 hover:bg-white/50 dark:hover:bg-slate-700/50">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Site
                  </Button>
                  <Button size="sm" onClick={load} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
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
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Submission Review</h2>
              <p className="text-slate-600 dark:text-slate-300">Review and moderate student submissions</p>
            </div>
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
              <BookOpen className="h-3 w-3 mr-1" />
              Live Moderation
            </Badge>
          </div>
          {/* Enhanced Filters Section */}
          <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
            
            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-30" />
                  <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-xl">
                    <Filter className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">Filter & Review</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300">Filter submissions by status and review efficiently</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Filter and refresh submissions
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 h-4 w-4" />
                    <select
                      className="pl-10 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/40 dark:border-slate-600/40 rounded-lg text-slate-900 dark:text-white focus:bg-white/70 dark:focus:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      aria-label="Filter by status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <Button variant="outline" onClick={load} className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 hover:bg-white/70 dark:hover:bg-slate-700/70">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Submissions Display */}
          <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
            
            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-30" />
                  <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-xl">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">
                    Submissions {items.length ? `(${items.length})` : ''}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                    Review and moderate past paper submissions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 p-8">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                      <span className="text-slate-600 dark:text-slate-300">Loading submissions...</span>
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300">
                  {error}
                </div>
              )}

              {!loading && items.length === 0 ? (
                <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 p-12 text-center">
                  <div className="space-y-4">
                    <div className="text-4xl">📝</div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No Submissions Found</h3>
                      <p className="text-slate-600 dark:text-slate-300">No items found for the selected status.</p>
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {items.map((p) => {
                    const getStatusBadge = (status: string) => {
                      switch (status) {
                        case 'pending':
                          return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        case 'approved':
                          return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Approved
                          </Badge>
                        case 'rejected':
                          return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            Rejected
                          </Badge>
                        default:
                          return <Badge variant="outline">Unknown</Badge>
                      }
                    }

                    const isProblematic = p.status === 'pending'
                    
                    return (
                      <Card key={p.id} className={`glass-card border-0 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-xl group ${
                        isProblematic 
                          ? 'bg-gradient-to-br from-yellow-50/80 to-orange-50/80 dark:from-yellow-950/40 dark:to-orange-950/40 border border-yellow-200/50 dark:border-yellow-800/50 hover:shadow-yellow-500/20'
                          : 'bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-900/40 border border-white/20 dark:border-white/10 hover:shadow-blue-500/10'
                      }`}>
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl" />
                        
                        <CardContent className="relative p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                                  isProblematic 
                                    ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                                    : 'bg-gradient-to-br from-blue-500 to-purple-500'
                                }`}>
                                  <FileText className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
                                    {p.title || p.course_code || 'Untitled'}
                                  </h3>
                                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {p.course_code && (
                                      <Badge variant="outline" className="text-xs bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                                        {p.course_code}
                                      </Badge>
                                    )}
                                    {p.semester && (
                                      <Badge variant="outline" className="text-xs bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {p.semester}
                                      </Badge>
                                    )}
                                    {p.year && (
                                      <Badge variant="outline" className="text-xs bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                                        {p.year}
                                      </Badge>
                                    )}
                                  </div>
                                  {p.file_url && (
                                    <div className="mt-2">
                                      <Link href={p.file_url} target="_blank" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 underline">
                                        <Eye className="h-3 w-3" />
                                        View file
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-3">
                              {getStatusBadge(p.status || 'pending')}
                              <div className="flex items-center gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => updateStatus(p.id, 'approved')}
                                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 shadow-sm hover:shadow-lg transition-all duration-300"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => updateStatus(p.id, 'rejected')}
                                  className="bg-red-500 hover:bg-red-600 border-0"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => remove(p.id)}
                                  className="glass-button border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGuard>
  )
}
