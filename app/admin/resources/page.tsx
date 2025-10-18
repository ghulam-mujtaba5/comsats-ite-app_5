"use client"

import { useEffect, useMemo, useState } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FolderOpen, 
  Upload, 
  Download, 
  Eye, 
  Edit3, 
  Trash2, 
  Save, 
  Plus, 
  Search,
  Filter,
  ExternalLink,
  File,
  Activity,
  Sparkles,
  Database,
  BookOpen,
  Calendar
} from "lucide-react"
import styles from "@/app/admin/admin-shared.module.css"

type Row = {
  id: string
  title: string
  description: string | null
  department: string | null
  term: string | null
  external_url: string | null
  file_url: string | null
  size_bytes: number | null
  mime_type: string | null
  uploaded_at: string
}

export default function AdminResourcesPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [department, setDepartment] = useState("")
  const [term, setTerm] = useState("")
  const [externalUrl, setExternalUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const [editing, setEditing] = useState<Row | null>(null)
  const [newFile, setNewFile] = useState<File | null>(null)

  const fetchRows = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch('/api/admin/resources', { cache: 'no-store' })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'Failed to load')
      setRows(j.data || [])
    } catch (e: any) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRows() }, [])

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) { setError('Title is required'); return }
    if (!externalUrl && !file) { setError('Provide a link or a file'); return }
    setLoading(true)
    setError("")
    const form = new FormData()
    form.set('title', title)
    form.set('description', description)
    form.set('department', department)
    form.set('term', term)
    if (externalUrl) form.set('external_url', externalUrl)
    if (file) form.set('file', file)
    try {
      const res = await fetch('/api/admin/resources', { method: 'POST', body: form })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'Create failed')
      setTitle("")
      setDescription("")
      setDepartment("")
      setTerm("")
      setExternalUrl("")
      setFile(null)
      await fetchRows()
    } catch (e: any) {
      setError(e.message || 'Create failed')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (id: string) => {
    if (!confirm('Delete this resource?')) return
    try {
      const res = await fetch(`/api/admin/resources?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j?.error || 'Failed to delete')
      await fetchRows()
    } catch (e: any) {
      setError(e.message || 'Failed to delete')
    }
  }

  const onUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setLoading(true)
    setError("")
    const form = new FormData()
    form.set('id', editing.id)
    form.set('title', editing.title)
    form.set('description', editing.description || '')
    form.set('department', editing.department || '')
    form.set('term', editing.term || '')
    if (editing.external_url) form.set('external_url', editing.external_url)
    if (newFile) form.set('file', newFile)
    try {
      const res = await fetch('/api/admin/resources', { method: 'PUT', body: form })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'Update failed')
      setEditing(null)
      setNewFile(null)
      await fetchRows()
    } catch (e: any) {
      setError(e.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const rowsView = useMemo(() => rows, [rows])

  return (
    <AdminGuard fallback={<div className="p-6 text-center">Admin access required. <a className="underline" href="/admin/login">Login</a></div>}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20">
        {/* Hero Section with Glassmorphism */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 backdrop-blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          
          <div className={`relative ${styles.section} pt-12 pb-8`}>
            <div className="glass-card border border-slate-200 dark:border-slate-700 dark:border-slate-200 dark:border-slate-700 rounded-3xl p-8 mb-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
                      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl">
                        <FolderOpen className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                        Resources Management
                      </h1>
                      <p className="text-slate-600 dark:text-slate-300 text-lg">
                        Upload files and manage educational resources for students
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-blue-200 dark:border-blue-800">
                      <Database className="h-3 w-3 mr-1" />
                      {rows.length} Resources
                    </Badge>
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-indigo-200 dark:border-indigo-800">
                      <Activity className="h-3 w-3 mr-1" />
                      File Management
                    </Badge>
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-purple-200 dark:border-purple-800">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Content Library
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button size="sm" variant="outline" className="glass-button bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border-white/40 dark:border-slate-600/40 hover:bg-white/50 dark:hover:bg-slate-700/50">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Site
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content Management Interface */}
        <div className={`${styles.section} ${styles.spaceY6} pb-12`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Resource Library</h2>
              <p className="text-slate-600 dark:text-slate-300">Manage educational files and external resources</p>
            </div>
            <Badge variant="outline" className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
              <BookOpen className="h-3 w-3 mr-1" />
              Live Resources
            </Badge>
          </div>

          <Card className="glass-card border border-slate-200 dark:border-slate-700 dark:border-slate-200 dark:border-slate-700 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
            
            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-lg opacity-30" />
                  <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-xl">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">Create New Resource</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300">Upload files or add external links to educational resources</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-6" {...(loading ? { 'aria-busy': 'true' } as any : {})}>
              <form onSubmit={onCreate} className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-200">Title</Label>
                  <Input 
                    id="title"
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Fall 2024 - Computer Science Timetable" 
                    required 
                    className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</Label>
                  <Textarea 
                    id="description"
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Short description (optional)" 
                    rows={3}
                    className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                  />
                </div>
                <div>
                  <Label htmlFor="department" className="text-sm font-medium text-slate-700 dark:text-slate-200">Department</Label>
                  <Input 
                    id="department"
                    value={department} 
                    onChange={(e) => setDepartment(e.target.value)} 
                    placeholder="Computer Science" 
                    className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                  />
                </div>
                <div>
                  <Label htmlFor="term" className="text-sm font-medium text-slate-700 dark:text-slate-200">Term</Label>
                  <Input 
                    id="term"
                    value={term} 
                    onChange={(e) => setTerm(e.target.value)} 
                    placeholder="Fall 2024" 
                    className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="externalUrl" className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    External Link (Google Drive preferred)
                  </Label>
                  <Input 
                    id="externalUrl"
                    value={externalUrl} 
                    onChange={(e) => setExternalUrl(e.target.value)} 
                    placeholder="https://drive.google.com/..." 
                    className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="file" className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Or Upload File
                  </Label>
                  <Input 
                    id="file"
                    type="file" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)} 
                    className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70 file:bg-transparent file:border-0 file:text-slate-600 dark:file:text-slate-300"
                  />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving…' : 'Create Resource'}
                  </Button>
                  {error && (
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-4 py-2 rounded-lg border border-red-200 dark:border-red-800">
                        {error}
                      </span>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="glass-card border border-slate-200 dark:border-slate-700 dark:border-slate-200 dark:border-slate-700 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
            
            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl blur-lg opacity-30" />
                  <div className="relative bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-xl">
                    <Database className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">Existing Resources</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300">Manage, preview, or delete uploaded resources</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative" {...(loading ? { 'aria-busy': 'true' } as any : {})}>
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="glass-card border border-slate-200 dark:border-slate-700 dark:border-slate-200 dark:border-slate-700 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 p-8">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                      <span className="text-slate-600 dark:text-slate-300">Loading resources...</span>
                    </div>
                  </div>
                </div>
              )}
              {rowsView.length === 0 && !loading ? (
                <Card className="glass-card border border-slate-200 dark:border-slate-700 dark:border-slate-200 dark:border-slate-700 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 p-12 text-center">
                  <div className="space-y-4">
                    <div className="text-4xl">📚</div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No Resources Found</h3>
                      <p className="text-slate-600 dark:text-slate-300">No resources yet. Create one above.</p>
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  {/* Search and Filter Section */}
                  <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 h-4 w-4" />
                      <Input
                        placeholder="Search resources..."
                        className="pl-10 glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                      />
                    </div>
                    <Button variant="outline" className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 hover:bg-white/70 dark:hover:bg-slate-700/70">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter by Department
                    </Button>
                  </div>

                  {/* Modern Card Layout for Resources */}
                  <div className="grid gap-4">
                    {rowsView.map((row) => (
                      <Card key={row.id} className="glass-card rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-xl group bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-900/40 border border-slate-200 dark:border-slate-700 dark:border-slate-200 dark:border-slate-700">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl" />
                        
                        <CardContent className="relative p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                                  {row.file_url ? <File className="h-5 w-5" /> : <ExternalLink className="h-4 w-4" />}
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
                                    {row.title}
                                  </h3>
                                  {row.description && (
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                                      {row.description}
                                    </p>
                                  )}
                                  <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    {row.department && (
                                      <Badge variant="outline" className="text-xs bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                                        {row.department}
                                      </Badge>
                                    )}
                                    {row.term && (
                                      <Badge variant="outline" className="text-xs bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {row.term}
                                      </Badge>
                                    )}
                                    {row.size_bytes && (
                                      <Badge variant="outline" className="text-xs bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                                        <File className="h-3 w-3 mr-1" />
                                        {(row.size_bytes / 1024 / 1024).toFixed(2)} MB
                                      </Badge>
                                    )}
                                    <span className="flex items-center gap-1">
                                      <Activity className="h-3 w-3" />
                                      {new Date(row.uploaded_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {row.external_url && (
                                <Button size="sm" variant="outline" className="glass-button" asChild>
                                  <a href={row.external_url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    Open Link
                                  </a>
                                </Button>
                              )}
                              {row.file_url && (
                                <Button size="sm" variant="outline" className="glass-button" asChild>
                                  <a href={row.file_url} target="_blank" rel="noopener noreferrer">
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                  </a>
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="glass-button"
                                onClick={() => setEditing(row)}
                              >
                                <Edit3 className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                className="bg-red-500 hover:bg-red-600 border-0"
                                onClick={() => onDelete(row.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Modern Edit Dialog */}
          {editing && (
            <Card className="glass-card border border-slate-200 dark:border-slate-700 dark:border-slate-200 dark:border-slate-700 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
              
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur-lg opacity-30" />
                    <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-xl">
                      <Edit3 className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-xl text-slate-900 dark:text-white">Edit Resource</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-300">Update metadata or replace the file</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-6" {...(loading ? { 'aria-busy': 'true' } as any : {})}>
                <form onSubmit={onUpdate} className="grid gap-6">
                  <div>
                    <Label htmlFor="edit-title" className="text-sm font-medium text-slate-700 dark:text-slate-200">Title</Label>
                    <Input 
                      id="edit-title"
                      value={editing.title} 
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })} 
                      className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-description" className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</Label>
                    <Textarea 
                      id="edit-description"
                      value={editing.description || ''} 
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })} 
                      rows={3}
                      className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-department" className="text-sm font-medium text-slate-700 dark:text-slate-200">Department</Label>
                      <Input 
                        id="edit-department"
                        value={editing.department || ''} 
                        onChange={(e) => setEditing({ ...editing, department: e.target.value })} 
                        className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-term" className="text-sm font-medium text-slate-700 dark:text-slate-200">Term</Label>
                      <Input 
                        id="edit-term"
                        value={editing.term || ''} 
                        onChange={(e) => setEditing({ ...editing, term: e.target.value })} 
                        className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-external-url" className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      External Link (Google Drive preferred)
                    </Label>
                    <Input 
                      id="edit-external-url"
                      value={editing.external_url || ''} 
                      onChange={(e) => setEditing({ ...editing, external_url: e.target.value })} 
                      className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-file" className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Replace File (optional)
                    </Label>
                    <Input 
                      id="edit-file"
                      type="file" 
                      onChange={(e) => setNewFile(e.target.files?.[0] || null)} 
                      className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70 file:bg-transparent file:border-0 file:text-slate-600 dark:file:text-slate-300"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? 'Saving…' : 'Save Changes'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => { setEditing(null); setNewFile(null) }}
                      className="glass-button flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminGuard>
  )
}
