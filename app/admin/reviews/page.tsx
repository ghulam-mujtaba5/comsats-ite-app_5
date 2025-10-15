"use client"

import { useEffect, useMemo, useState } from "react"
// Footer is provided by the root layout; avoid importing locally to prevent duplicates
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Star, MessageSquare, ArrowLeft, Filter, Sparkles, CheckCircle, XCircle, Clock, Search, GraduationCap } from "lucide-react"
import Link from "next/link"
import { departments as DEPARTMENTS } from "@/lib/faculty-data"
import { AdminGuard } from "@/components/admin/admin-guard"
import { supabase } from "@/lib/supabase"
import { getDepartmentFromEmail } from '@/lib/student-department-utils'

interface ReviewRow {
  id: string
  faculty_id: string
  student_id: string | null
  student_name: string | null
  course: string
  semester: string
  rating: number
  teaching_quality: number
  accessibility: number
  course_material: number
  grading: number
  comment: string
  pros?: string[]
  cons?: string[]
  would_recommend?: boolean
  is_anonymous?: boolean
  created_at?: string
  status?: string
}

export default function AdminReviewsPage() {
  const [rows, setRows] = useState<ReviewRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<'pending'|'approved'|'rejected'>('pending')
  const [facultyMap, setFacultyMap] = useState<Record<string, { name: string; department: string }>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("All")
  
  // State for user's department
  const [userDepartment, setUserDepartment] = useState<string | null>(null)
  
  const fetchRows = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/admin/moderation/reviews?status=${statusFilter}`, { cache: 'no-store' })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'Failed to load')
      setRows(j.data || [])
    } catch (e: any) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRows()
  }, [statusFilter])

  // Fetch faculty list for mapping ID -> name/department
  useEffect(() => {
    const loadFaculty = async () => {
      try {
        const res = await fetch('/api/faculty', { cache: 'no-store' })
        const data = await res.json().catch(() => [])
        if (Array.isArray(data)) {
          const map: Record<string, { name: string; department: string }> = {}
          for (const f of data) {
            if (f?.id) map[f.id] = { name: f.name || `Faculty ${f.id}`, department: f.department || 'Unknown' }
          }
          setFacultyMap(map)
        }
      } catch {
        // Non-fatal: keep map empty
      }
    }
    loadFaculty()
  }, [])

  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300)
    return () => clearTimeout(id)
  }, [searchQuery])

  useEffect(() => {
    // Get current user's department from their email
    const fetchUserDepartment = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email) {
          const department = getDepartmentFromEmail(user.email)
          setUserDepartment(department)
        }
      } catch (error) {
        console.error('Error fetching user department:', error)
      }
    }
    
    fetchUserDepartment()
  }, [])

  // Apply client-side search and department filter
  const filteredRows = useMemo(() => {
    let filtered = [...rows]
    
    // Apply search filter
    if (debouncedSearch) {
      filtered = filtered.filter((r) => {
        const facultyName = facultyMap[r.faculty_id]?.name?.toLowerCase() || ''
        const studentId = r.student_id?.toLowerCase() || ''
        const course = r.course?.toLowerCase() || ''
        const semester = r.semester?.toLowerCase() || ''
        const comment = r.comment?.toLowerCase() || ''
        const searchLower = debouncedSearch.toLowerCase()
        
        return (
          facultyName.includes(searchLower) ||
          studentId.includes(searchLower) ||
          course.includes(searchLower) ||
          semester.includes(searchLower) ||
          comment.includes(searchLower)
        )
      })
    }
    
    // Apply department filter
    if (departmentFilter && departmentFilter !== 'All') {
      filtered = filtered.filter((r) => {
        const facultyDepartment = facultyMap[r.faculty_id]?.department
        return facultyDepartment === departmentFilter
      })
    }
    
    // Apply user's department filter if available and no other department filter is set
    if (userDepartment && departmentFilter === 'All') {
      filtered = filtered.filter((r) => {
        const facultyDepartment = facultyMap[r.faculty_id]?.department
        return facultyDepartment === userDepartment
      })
    }
    
    return filtered
  }, [rows, debouncedSearch, departmentFilter, facultyMap, userDepartment])

  const setStatus = async (id: string, status: 'approved'|'rejected'|'pending') => {
    try {
      const res = await fetch('/api/admin/moderation/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j?.error || 'Failed to update')
    } catch (e: any) {
      setError(e.message || 'Failed to update')
      return
    }
    fetchRows()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-rose-600/10 backdrop-blur-3xl" />
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
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
                    <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl">
                      <MessageSquare className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
                      Review Moderation
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 text-lg mt-1">
                      Moderate and approve faculty reviews submitted by students
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-purple-200 dark:border-purple-800">
                    <Star className="h-3 w-3 mr-1" />
                    Review Management
                  </Badge>
                  <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-green-200 dark:border-green-800">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Quality Control
                  </Badge>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                  <SelectTrigger className="w-48 glass-button bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border-white/40 dark:border-slate-600/40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>Pending Reviews</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="approved">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        <span>Approved Reviews</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="rejected">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-3 w-3" />
                        <span>Rejected Reviews</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  onClick={fetchRows}
                  className="glass-button bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border-white/40 dark:border-slate-600/40 hover:bg-white/50 dark:hover:bg-slate-700/50"
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <main className="container mx-auto px-4 py-8">
          {error && (
            <Card className="glass-card border border-red-200 dark:border-red-800 rounded-2xl backdrop-blur-xl bg-red-50/40 dark:bg-red-950/40 p-4">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <XCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </Card>
          )}
          
          {/* Filters: Search + Department */}
          <div className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search by faculty name, ID, course, semester, student, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Departments</SelectItem>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(debouncedSearch || (departmentFilter && departmentFilter !== 'All')) && (
                <Button variant="outline" onClick={() => { setSearchQuery(""); setDepartmentFilter("All") }}>Clear</Button>
              )}
            </div>
          </div>
          
          {/* User Department Info */}
          {userDepartment && (
            <div className="glass-card border border-blue-200/50 dark:border-blue-800/50 rounded-2xl p-4 bg-blue-50/80 dark:bg-blue-950/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <GraduationCap className="h-4 w-4" />
                <span className="font-medium">Your Department:</span> 
                <span>{userDepartment}</span>
                <Badge variant="secondary" className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  Auto-filtered
                </Badge>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Showing reviews from your department. Select "All Departments" to view all reviews.
              </p>
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="glass-card border border-white/20 dark:border-white/10 rounded-2xl p-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                  <span className="text-slate-600 dark:text-slate-300">Loading reviews...</span>
                </div>
              </div>
            </div>
          ) : filteredRows.length === 0 ? (
            <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 p-12 text-center">
              <div className="space-y-4">
                <div className="relative mx-auto w-16 h-16">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30" />
                  <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Matching Reviews</h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Try adjusting your search or filters.
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Faculty Reviews ({filteredRows.length})
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Review and moderate faculty evaluations submitted by students.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-slate-200 dark:border-slate-700">
                        <th scope="col" className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">Rating</th>
                        <th scope="col" className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">Faculty</th>
                        <th scope="col" className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">Course / Semester</th>
                        <th scope="col" className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">Review Content</th>
                        <th scope="col" className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">Submitted By</th>
                        <th scope="col" className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">Status</th>
                        <th scope="col" className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRows.map((r, index) => {
                        const getRatingColor = (rating: number) => {
                          if (rating >= 4) return 'text-green-600 dark:text-green-400'
                          if (rating >= 3) return 'text-yellow-600 dark:text-yellow-400'
                          return 'text-red-600 dark:text-red-400'
                        }
                        
                        return (
                          <tr key={r.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors" style={{ animationDelay: `${index * 50}ms` }}>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <Star className={`h-4 w-4 ${getRatingColor(r.rating)}`} fill="currentColor" />
                                <span className={`font-bold ${getRatingColor(r.rating)}`}>{r.rating}/5</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="space-y-1">
                                <div className="font-medium text-slate-900 dark:text-white">{facultyMap[r.faculty_id]?.name || 'Unknown Faculty'}</div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{r.faculty_id}</span>
                                  {facultyMap[r.faculty_id]?.department && (
                                    <Badge variant="outline" className="text-xs">{facultyMap[r.faculty_id]?.department}</Badge>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="space-y-1">
                                <div className="font-medium text-slate-900 dark:text-white">{r.course}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{r.semester}</div>
                              </div>
                            </td>
                            <td className="py-4 px-4 max-w-md">
                              <div className="space-y-2">
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                                  <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{r.comment}</p>
                                </div>
                                {(r.pros && r.pros.length > 0) && (
                                  <div className="flex flex-wrap gap-1">
                                    {r.pros.map((p, i) => (
                                      <Badge key={i} variant="outline" className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-xs">
                                        + {p}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                                {(r.cons && r.cons.length > 0) && (
                                  <div className="flex flex-wrap gap-1">
                                    {r.cons.map((c, i) => (
                                      <Badge key={i} variant="outline" className="bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
                                        - {c}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                {r.is_anonymous ? (
                                  <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                    Anonymous
                                  </Badge>
                                ) : (
                                  <span className="text-sm text-slate-700 dark:text-slate-300">{r.student_name || 'Student'}</span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge 
                                variant="outline" 
                                className={
                                  r.status === 'approved' 
                                    ? 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                                    : r.status === 'rejected' 
                                    ? 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                                    : 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                                }
                              >
                                {r.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                                {r.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                                {r.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                                {r.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => setStatus(r.id, 'approved')}
                                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => setStatus(r.id, 'rejected')}
                                  className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0 shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
