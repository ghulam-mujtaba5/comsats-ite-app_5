"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AdvancedFilterBar } from "@/components/search/advanced-filter-bar"
import { FileText, Download, Eye, Upload, Calendar, Search, Filter, Clock, Building, GraduationCap, AlertCircle, CheckCircle2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { standardFilters } from "@/lib/filter-data"

type TimetableDoc = {
  id: string
  title: string
  department: string
  term: string | null
  size_bytes: number | null
  mime_type: string
  public_url: string
  uploaded_at: string
}

export default function TimetablePage() {
  const [docs, setDocs] = useState<TimetableDoc[]>([])
  const [filteredDocs, setFilteredDocs] = useState<TimetableDoc[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [selectedTerm, setSelectedTerm] = useState("All")
  const [currentSort, setCurrentSort] = useState("date-desc")
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [title, setTitle] = useState("")
  const [department, setDepartment] = useState("")
  const [term, setTerm] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(true)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const loadDocs = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/timetable-docs", { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to load")
      setDocs(json.data || [])
    } catch (e: any) {
      setError(e.message || "Failed to load")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDocs()
    ;(async () => {
      try {
        const res = await fetch('/api/admin/session', { cache: 'no-store' })
        setIsAdmin(res.ok)
      } catch {
        setIsAdmin(false)
      } finally {
        setAdminLoading(false)
      }
    })()
  }, [])

  const handlePreview = (doc: TimetableDoc) => {
    window.open(doc.public_url, "_blank")
  }

  const handleDownload = (doc: TimetableDoc) => {
    // Open the file in a new tab instead of forcing download
    window.open(doc.public_url, "_blank")
  }

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (!file) {
      setError("Select a PDF file")
      return
    }
    const form = new FormData()
    form.append("file", file)
    form.append("title", title)
    form.append("department", department)
    form.append("term", term)
    setUploading(true)
    setUploadProgress(0)
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 200)
    
    try {
      const res = await fetch("/api/timetable/upload", { method: "POST", body: form })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Upload failed")
      setUploadProgress(100)
      setMessage("Uploaded successfully")
      setTitle("")
      setDepartment("")
      setTerm("")
      setFile(null)
      await loadDocs()
    } catch (e: any) {
      setError(e.message || "Upload failed")
    } finally {
      clearInterval(progressInterval)
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile)
      setError(null)
    } else {
      setError('Please drop a PDF file')
    }
  }, [])

  // Filter and sort documents
  useEffect(() => {
    let filtered = [...docs]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        doc.department.toLowerCase().includes(query) ||
        (doc.term && doc.term.toLowerCase().includes(query))
      )
    }

    // Apply department filter
    if (selectedDepartment !== "All") {
      filtered = filtered.filter(doc => doc.department === selectedDepartment)
    }

    // Apply term filter
    if (selectedTerm !== "All") {
      filtered = filtered.filter(doc => doc.term === selectedTerm)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (currentSort) {
        case "title-asc":
          return sortDirection === 'asc' 
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
        case "department-asc":
          return sortDirection === 'asc'
            ? a.department.localeCompare(b.department)
            : b.department.localeCompare(a.department)
        case "date-desc":
        default:
          return sortDirection === 'desc'
            ? new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
            : new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime()
      }
    })

    setFilteredDocs(filtered)
  }, [docs, searchQuery, selectedDepartment, selectedTerm, currentSort, sortDirection])

  // Get unique departments and terms for filtering
  const departments = [...new Set(docs.map(doc => doc.department))].sort()
  const terms = [...new Set(docs.map(doc => doc.term).filter(Boolean))].sort()

  // Advanced filter options
  const filterOptions = [
    {
      id: "department",
      label: "Department",
      options: ["All", ...departments].map(dept => ({ value: dept, label: dept }))
    },
    {
      id: "term",
      label: "Term",
      options: ["All", ...terms].map(term => ({ value: term, label: term }))
    }
  ]

  const sortOptions = [
    { value: "date-desc", label: "Latest First" },
    { value: "date-asc", label: "Oldest First" },
    { value: "title-asc", label: "Title A-Z" },
    { value: "title-desc", label: "Title Z-A" },
    { value: "department-asc", label: "Department A-Z" },
    { value: "department-desc", label: "Department Z-A" }
  ]

  const handleFilterChange = (filterId: string, value: string) => {
    switch (filterId) {
      case "department":
        setSelectedDepartment(value)
        break
      case "term":
        setSelectedTerm(value)
        break
    }
  }

  const handleSortChange = (value: string) => {
    setCurrentSort(value)
    if (value.includes('desc')) {
      setSortDirection('desc')
    } else {
      setSortDirection('asc')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Enhanced Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary mb-6">
              <Calendar className="h-4 w-4" />
              Academic Resources
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              Timetable <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">PDFs</span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 font-medium leading-relaxed">
              Access and manage official timetable PDFs for all departments and terms.
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-200/30 dark:border-blue-700/30">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{docs.length}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Files</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-200/30 dark:border-green-700/30">
                    <Building className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{departments.length}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Departments</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-200/30 dark:border-purple-700/30">
                    <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{terms.length}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Terms</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-200/30 dark:border-orange-700/30">
                    <Download className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{filteredDocs.length}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Filtered Results</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {adminLoading ? (
            <Card className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <span className="text-slate-600 dark:text-slate-400">Checking permissions...</span>
                </div>
              </CardContent>
            </Card>
          ) : isAdmin ? (
            <Card className="mb-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none" />
              <CardHeader className="p-8 pb-6 relative z-10">
                <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20 border border-primary/30">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  Upload Timetable PDF
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-300 font-medium">Add new timetable documents for students to access</p>
              </CardHeader>
              <CardContent className="p-8 pt-0 relative z-10">
                <form onSubmit={onUpload} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Title *</label>
                      <Input
                        placeholder="e.g., CS Department Fall 2024"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="h-12 px-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/30 dark:border-slate-700/30 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Department *</label>
                      <Input
                        placeholder="e.g., Computer Science"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="h-12 px-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/30 dark:border-slate-700/30 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Term</label>
                      <Input
                        placeholder="e.g., Fall 2024"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        className="h-12 px-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/30 dark:border-slate-700/30 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  {/* Drag and Drop File Upload */}
                  <div
                    className={cn(
                      "relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300",
                      dragActive
                        ? "border-primary bg-primary/10 scale-105"
                        : "border-slate-300 dark:border-slate-600 hover:border-primary/50 hover:bg-primary/5"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-4">
                      <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 border border-primary/30 w-20 h-20 mx-auto flex items-center justify-center">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                          {file ? file.name : "Drop your PDF file here"}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          or click to browse files (PDF only, max 10MB)
                        </p>
                        <Input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            const selectedFile = e.target.files?.[0]
                            if (selectedFile) {
                              if (selectedFile.type === 'application/pdf') {
                                setFile(selectedFile)
                                setError(null)
                              } else {
                                setError('Please select a PDF file')
                              }
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {file && (
                          <div className="flex items-center justify-center gap-2 mt-4">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-green-600">
                              {(file.size / (1024 * 1024)).toFixed(1)} MB
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setFile(null)}
                              className="ml-2 h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {uploading && uploadProgress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Uploading...</span>
                        <span className="text-primary font-medium">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Error and Success Messages */}
                  {error && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                      <AlertCircle className="h-5 w-5" />
                      {error}
                    </div>
                  )}
                  {message && (
                    <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400">
                      <CheckCircle2 className="h-5 w-5" />
                      {message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={uploading || !file || !title || !department}
                    className={cn(
                      "w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
                      "text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {uploading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Uploading...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Upload className="h-5 w-5" />
                        Upload Timetable
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : null}

          {/* Advanced Filtering */}
          <Card className="mb-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-3xl shadow-lg">
            <CardContent className="p-8">
              <AdvancedFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filters={filterOptions}
                onFilterChange={handleFilterChange}
                sortOptions={sortOptions}
                currentSort={currentSort}
                onSortChange={handleSortChange}
                searchPlaceholder="Search timetables by title, department, or term..."
                className="bg-transparent border-0 shadow-none"
              />
            </CardContent>
          </Card>

          {/* Enhanced Document Grid */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">
              {filteredDocs.length} Timetable{filteredDocs.length !== 1 ? "s" : ""} <span className="text-blue-600 dark:text-blue-400">Available</span>
            </h2>
            <p className="text-slate-700 dark:text-slate-200 font-medium">
              Browse and download official timetable documents
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          ) : filteredDocs.length === 0 ? (
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-2xl shadow-lg">
              <CardContent className="p-16 text-center">
                <div className="p-4 rounded-full bg-gradient-to-br from-slate-400/20 to-slate-500/20 border border-slate-400/30 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <FileText className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">No Timetables Found</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6 font-serif text-lg max-w-md mx-auto">
                  {searchQuery || selectedDepartment !== "All" || selectedTerm !== "All"
                    ? "Try adjusting your search terms or filters to find more timetables."
                    : "No timetable documents have been uploaded yet."}
                </p>
                {(searchQuery || selectedDepartment !== "All" || selectedTerm !== "All") && (
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedDepartment("All")
                      setSelectedTerm("All")
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDocs.map((doc) => (
                <Card key={doc.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl group">
                  <CardHeader className="p-6 pb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-200/30 dark:border-blue-700/30 group-hover:scale-110 transition-transform duration-300">
                        <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg leading-tight mb-3 text-slate-900 dark:text-white font-bold">{doc.title}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20 hover:bg-blue-500/20">
                            <Building className="h-3 w-3 mr-1" />
                            {doc.department}
                          </Badge>
                          {doc.term && (
                            <Badge variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-100">
                              <Clock className="h-3 w-3 mr-1" />
                              {doc.term}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 mb-6">
                      <div className="flex justify-between">
                        <span className="font-medium">Uploaded:</span>
                        <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Format:</span>
                        <span className="font-mono text-xs">{doc.mime_type || 'PDF'}</span>
                      </div>
                      {typeof doc.size_bytes === 'number' && (
                        <div className="flex justify-between">
                          <span className="font-medium">Size:</span>
                          <span>{(doc.size_bytes / (1024 * 1024)).toFixed(1)} MB</span>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handlePreview(doc)}
                        className={cn(
                          "h-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
                          "border-white/30 dark:border-slate-700/30",
                          "hover:border-primary/40 hover:bg-primary/10",
                          "rounded-xl transition-all duration-200"
                        )}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        onClick={() => handleDownload(doc)}
                        className={cn(
                          "h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
                          "text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                        )}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
