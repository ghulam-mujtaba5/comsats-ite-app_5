"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useMemo, useState } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UnifiedGlassCard } from "@/components/shared/UnifiedGlassCard"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from '@/hooks/use-toast'
import { 
  GraduationCap, Users, Mail, MapPin, Phone, Book, Award, Eye, Edit, Trash2, 
  Download, Upload, Plus, Sparkles, Activity, TrendingUp, Crown, Save,
  Search, Filter, X
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import adminStyles from "../admin-shared.module.css"

// Uses secure server API at /api/admin/faculty guarded by HTTP-only admin cookie

// Minimal faculty schema used here must match your Supabase table `faculty`
// Columns: id (uuid), name, title, department, email, office, phone, specialization (text[] or csv), courses (text[] or csv), education (text[] or csv), experience, profile_image
type Row = {
  id: string
  name: string
  title: string
  department: string
  email: string
  office: string
  phone?: string
  specialization?: string[] | null
  courses?: string[] | null
  education?: string[] | null
  experience?: string
  profile_image?: string | null
  campus_id?: string | null
}

export default function AdminFacultyPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCampus, setSelectedCampus] = useState<string>("all")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [campuses, setCampuses] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])

  const [form, setForm] = useState<Omit<Row, "id">>({
    name: "",
    title: "",
    department: "",
    email: "",
    office: "",
    phone: "",
    specialization: [],
    courses: [],
    education: [],
    experience: "",
    profile_image: "",
  })

  // Fetch campuses and departments for filtering
  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const res = await fetch('/api/campuses')
        const data = await res.json()
        if (res.ok) {
          setCampuses(data)
        }
      } catch (err) {
        console.error('Failed to fetch campuses:', err)
      }
    }
    
    const fetchDepartments = async () => {
      try {
        const res = await fetch('/api/departments')
        const data = await res.json()
        if (res.ok) {
          setDepartments(data)
        }
      } catch (err) {
        console.error('Failed to fetch departments:', err)
      }
    }
    
    fetchCampuses()
    fetchDepartments()
  }, [])

  const resetForm = () => {
    setForm({
      name: "",
      title: "",
      department: "",
      email: "",
      office: "",
      phone: "",
      specialization: [],
      courses: [],
      education: [],
      experience: "",
      profile_image: "",
    })
    setEditingId(null)
  }

  const fetchRows = async () => {
    setLoading(true)
    setError("")
    try {
      // Build query parameters
      const params = new URLSearchParams()
      if (selectedCampus !== "all") params.append('campus_id', selectedCampus)
      if (selectedDepartment !== "all") params.append('department', selectedDepartment)
      
      const res = await fetch(`/api/admin/faculty?${params.toString()}`, { cache: 'no-store' })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'Failed to load')
      setRows((j.data as Row[]) || [])
    } catch (e: any) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRows()
  }, [selectedCampus, selectedDepartment])

  const upsertRow = async () => {
    setLoading(true)
    setError("")
    const payload: any = {
      ...form,
      specialization: (form.specialization || []) as string[] ,
      courses: (form.courses || []) as string[],
      education: (form.education || []) as string[],
    }
    try {
      const res = await fetch('/api/admin/faculty' + (editingId ? '' : ''), {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'Failed to save')
    } catch (e: any) {
      setError(e.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
    await fetchRows()
    resetForm()
  }

  const editRow = (r: Row) => {
    setEditingId(r.id)
    setForm({
      name: r.name,
      title: r.title,
      department: r.department,
      email: r.email,
      office: r.office,
      phone: r.phone || "",
      specialization: r.specialization || [],
      courses: r.courses || [],
      education: r.education || [],
      experience: r.experience || "",
      profile_image: r.profile_image || "",
    })
  }

  const deleteRow = async (id: string) => {
    if (!confirm("Delete this faculty?")) return
    try {
      const res = await fetch(`/api/admin/faculty?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j?.error || 'Failed to delete')
    } catch (e: any) {
      setError(e.message || 'Failed to delete')
      return
    }
    await fetchRows()
  }

  // CSV helpers
  const toCSV = (rows: Row[]) => {
    const header = [
      "name","title","department","email","office","phone","specialization","courses","education","experience","profile_image"
    ]
    const lines = rows.map(r => [
      r.name,
      r.title,
      r.department,
      r.email,
      r.office,
      r.phone || "",
      (r.specialization || []).join(";"),
      (r.courses || []).join(";"),
      (r.education || []).join(";"),
      r.experience || "",
      r.profile_image || "",
    ].map(v => `"${String(v).replaceAll('"','\"')}"`).join(","))
    return [header.join(","), ...lines].join("\n")
  }

  const downloadCSV = () => {
    const csv = toCSV(rows)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    
    // Check if document is available (client-side only)
    if (typeof document !== 'undefined') {
      const a = document.createElement("a")
      a.href = url
      a.download = "faculty_export.csv"
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const importCSV = async (file: File) => {
    const text = await file.text()
    const lines = text.split(/\r?\n/).filter(Boolean)
    if (lines.length < 2) return
    const header = lines[0].split(",").map(h => h.replaceAll('"','').trim())
    const { toast } = useToast()
    // Validate required headers before attempting import
    const required = ["name","title","department","email","office","phone","specialization","courses","education","experience","profile_image"]
    const missing = required.filter(r => !header.includes(r))
    if (missing.length) {
      toast({ title: 'Invalid CSV', description: `Missing columns: ${missing.join(', ')}`, variant: 'destructive' })
      setError(`Missing columns: ${missing.join(', ')}`)
      return
    }
    const idx = (k: string) => header.indexOf(k)
    const payloads = lines.slice(1).map(line => {
      const cols = line.match(/(?:^|,)(\"(?:.|\n)*?\"|[^,]*)/g)?.map(c => c.replace(/^,?\"?|\"?$/g, "")) || []
      const get = (k: string) => cols[idx(k)] || ""
      return {
        name: get("name"),
        title: get("title"),
        department: get("department"),
        email: get("email"),
        office: get("office"),
        phone: get("phone"),
        specialization: get("specialization").split(";").filter(Boolean),
        courses: get("courses").split(";").filter(Boolean),
        education: get("education").split(";").filter(Boolean),
        experience: get("experience"),
        profile_image: get("profile_image"),
      }
    })
    setLoading(true)
    try {
      // Use the admin bulk import endpoint which expects { rows, upsert, dry_run, fill_defaults }
      const res = await fetch('/api/admin/import/faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: payloads, upsert: true, dry_run: false, fill_defaults: true }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) {
        const message = j?.error || `Failed to import CSV (status ${res.status})`
        toast({ title: 'Import failed', description: message, variant: 'destructive' })
        throw new Error(message)
      }
      // Success
      toast({ title: 'Import successful', description: `Imported ${j.inserted_or_updated ?? j.validated ?? payloads.length} rows`, variant: 'default' })
    } catch (e: any) {
      setError(e.message || 'Failed to import CSV')
    } finally {
      setLoading(false)
    }
    await fetchRows()
  }

  const setCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) importCSV(f)
  }

  // Filter rows based on search query
  const filteredRows = useMemo(() => {
    if (!searchQuery) return rows
    const query = searchQuery.toLowerCase()
    return rows.filter(row => 
      row.name.toLowerCase().includes(query) ||
      row.title.toLowerCase().includes(query) ||
      row.department.toLowerCase().includes(query) ||
      row.email.toLowerCase().includes(query)
    )
  }, [rows, searchQuery])

  const clearFilters = () => {
    setSelectedCampus("all")
    setSelectedDepartment("all")
    setSearchQuery("")
  }

  return (
    <AdminGuard fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20">
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className="glass-secondary border border-slate-200 dark:border-slate-700 rounded-3xl p-8 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 text-center space-y-4 max-w-md">
            <div className="relative mx-auto w-16 h-16 mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-xl opacity-30 animate-pulse" />
              <div className="relative bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-2xl">
                <Crown className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                Admin Access Required
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                Elevated privileges needed to manage faculty
              </p>
              <Link href="/admin/login" className="inline-block mt-4">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  Access Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    }>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20">
        {/* Hero Section with Glassmorphism */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 backdrop-blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          
          <div className={`relative ${adminStyles.section} pt-12 pb-8`}>
            <div className="glass-secondary border border-slate-200 dark:border-slate-700 rounded-3xl p-8 mb-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
                      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-2xl">
                        <GraduationCap className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 id="faculty-heading" className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-indigo-800 to-purple-800 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
                        Faculty Management
                      </h1>
                      <p className="text-slate-600 dark:text-slate-300 text-lg">
                        Comprehensive faculty directory administration
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-indigo-200 dark:border-indigo-800">
                      <Users className="h-3 w-3 mr-1" />
                      {filteredRows.length} Faculty Members
                    </Badge>
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-purple-200 dark:border-purple-800">
                      <Activity className="h-3 w-3 mr-1" />
                      Active Management
                    </Badge>
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-blue-200 dark:border-blue-800">
                      <Sparkles className="h-3 w-3 mr-1" />
                      CSV Import/Export
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <label htmlFor="facultyCsv" className="flex items-center cursor-pointer">
                    <input
                      id="facultyCsv"
                      type="file"
                      accept=".csv"
                      onChange={setCsvFile}
                      style={{ display: 'none' }}
                      aria-describedby="facultyCsvHelp"
                      aria-label="Import faculty CSV file"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="glass-interactive bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border-white/40 dark:border-slate-600/40 hover:bg-white/50 dark:hover:bg-slate-700/50"
                      asChild
                    >
                      <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Import CSV
                      </span>
                    </Button>
                    <span id="facultyCsvHelp" className="sr-only">Select a .csv file to import faculty records</span>
                  </label>
                  <Button size="sm" variant="outline" onClick={downloadCSV} className="glass-button bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border-white/40 dark:border-slate-600/40 hover:bg-white/50 dark:hover:bg-slate-700/50">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Faculty Management Interface */}
        <div className={`${adminStyles.section} ${adminStyles.spaceY6} pb-12`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Faculty Directory</h2>
              <p className="text-slate-600 dark:text-slate-300">Add, edit, and manage faculty profiles</p>
            </div>
            <Badge variant="outline" className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
              <TrendingUp className="h-3 w-3 mr-1" />
              Live Updates
            </Badge>
          </div>

          {/* Filter Section */}
          <Card className="glass-secondary border border-slate-200 dark:border-slate-700 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1 block">Search Faculty</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, title, department, or email..."
                      className="pl-10 glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-48">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1 block">Campus</Label>
                  <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                    <SelectTrigger className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70">
                      <SelectValue placeholder="Select Campus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Campuses</SelectItem>
                      {campuses.map((campus) => (
                        <SelectItem key={campus.id} value={campus.id}>
                          {campus.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-48">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1 block">Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="glass-interactive bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border-white/40 dark:border-slate-600/40 hover:bg-white/50 dark:hover:bg-slate-700/50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass-card border border-slate-200 dark:border-slate-700 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
              
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-30" />
                    <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-xl">
                      {editingId ? <Edit className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-xl text-slate-900 dark:text-white">{editingId ? "Edit Faculty" : "Add Faculty"}</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-300">Manage faculty member information and profiles</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                )}
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Name</Label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Title</Label>
                      <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Department</Label>
                    <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</Label>
                      <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Phone</Label>
                      <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Office Location</Label>
                    <Input value={form.office} onChange={(e) => setForm({ ...form, office: e.target.value })} className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Specialization (semicolon separated)</Label>
                    <Input value={(form.specialization || []).join(";")} onChange={(e) => setForm({ ...form, specialization: e.target.value.split(";").filter(Boolean) })} placeholder="AI; Machine Learning; Data Science" className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Courses (semicolon separated)</Label>
                    <Input value={(form.courses || []).join(";")} onChange={(e) => setForm({ ...form, courses: e.target.value.split(";").filter(Boolean) })} placeholder="CS101; CS102; CS301" className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Education (semicolon separated)</Label>
                    <Input value={(form.education || []).join(";")} onChange={(e) => setForm({ ...form, education: e.target.value.split(";").filter(Boolean) })} placeholder="PhD Computer Science; MS Software Engineering" className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Experience</Label>
                    <Input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="10+ years in academia and industry" className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Profile Image URL</Label>
                    <Input value={form.profile_image || ''} onChange={(e) => setForm({ ...form, profile_image: e.target.value })} placeholder="https://example.com/photo.jpg" className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={upsertRow} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      {editingId ? "Update" : "Create"}
                    </Button>
                    {editingId && (
                      <Button variant="outline" onClick={resetForm} className="glass-button">
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border border-slate-200 dark:border-slate-700 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
              
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-30" />
                    <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-xl text-slate-900 dark:text-white">Faculty Directory</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-300">View, edit, and manage faculty member profiles</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                {filteredRows.length === 0 && !loading ? (
                  <Card className="glass-card border border-slate-200 dark:border-slate-700 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 p-8 text-center">
                    <div className="space-y-4">
                      <div className="text-4xl">👨‍🎓</div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {searchQuery || selectedCampus !== "all" || selectedDepartment !== "all" 
                            ? "No Faculty Found Matching Your Filters" 
                            : "No Faculty Found"}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300">
                          {searchQuery || selectedCampus !== "all" || selectedDepartment !== "all"
                            ? "Try adjusting your search or filters."
                            : "Add your first faculty member to get started."}
                        </p>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <div className="overflow-auto" aria-live="polite" {...(loading ? { 'aria-busy': 'true' } as any : {})}>
                    <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl border border-white/40 dark:border-slate-600/40 overflow-hidden">
                      <table className="w-full text-sm">
                        <caption className="sr-only">Faculty records table</caption>
                        <thead className="bg-white/60 dark:bg-slate-700/60">
                          <tr className="text-left">
                            <th scope="col" className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">Name</th>
                            <th scope="col" className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">Title</th>
                            <th scope="col" className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">Department</th>
                            <th scope="col" className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">Contact</th>
                            <th scope="col" className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading
                            ? Array.from({ length: 6 }).map((_, i) => (
                                <tr key={`sk-${i}`} className="border-t border-slate-200 dark:border-slate-600/40">
                                  <td className="py-3 px-4"><Skeleton className="h-4 w-40" /></td>
                                  <td className="py-3 px-4"><Skeleton className="h-4 w-32" /></td>
                                  <td className="py-3 px-4"><Skeleton className="h-4 w-24" /></td>
                                  <td className="py-3 px-4"><Skeleton className="h-4 w-48" /></td>
                                  <td className="py-3 px-4">
                                    <div className="flex gap-2">
                                      <Skeleton className="h-8 w-16" />
                                      <Skeleton className="h-8 w-20" />
                                      <Skeleton className="h-8 w-16" />
                                    </div>
                                  </td>
                                </tr>
                              ))
                            : filteredRows.map((r) => (
                                <tr
                                  key={r.id}
                                  className="border-t border-slate-200 dark:border-slate-600/40 hover:bg-white/30 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                                  onClick={() => editRow(r)}
                                  title={`Edit ${r.name}`}
                                  aria-label={`Edit ${r.name}`}
                                >
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {r.name.charAt(0).toUpperCase()}
                                      </div>
                                      <span className="font-medium text-slate-900 dark:text-white">{r.name}</span>
                                      {/* Inline edit button for small screens to avoid horizontal scroll */}
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        aria-label={`Edit faculty ${r.name}`}
                                        className="glass-button lg:hidden ml-2"
                                        onClick={(e: React.MouseEvent) => { e.stopPropagation(); editRow(r) }}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{r.title}</td>
                                  <td className="py-3 px-4">
                                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 text-xs">
                                      {r.department}
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
                                        <Mail className="h-3 w-3" />
                                        <span>{r.email}</span>
                                      </div>
                                      {r.office && (
                                        <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
                                          <MapPin className="h-3 w-3" />
                                          <span>{r.office}</span>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline" onClick={(e: React.MouseEvent) => { e.stopPropagation(); editRow(r) }} aria-label={`Edit faculty ${r.name}`} className="glass-button">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button asChild size="sm" variant="outline" aria-label={`Preview faculty ${r.name}`} className="glass-button" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                        <Link href={`/faculty/${r.id}`} target="_blank" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                          <Eye className="h-4 w-4" />
                                        </Link>
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={(e: React.MouseEvent) => { e.stopPropagation(); deleteRow(r.id) }} aria-label={`Delete faculty ${r.name}`} className="glass-button hover:bg-red-50 dark:hover:bg-red-950/50">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}