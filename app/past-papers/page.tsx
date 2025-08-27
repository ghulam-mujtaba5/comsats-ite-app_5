"use client"

import { jsonLdBreadcrumb } from "@/lib/seo"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CourseCard } from "@/components/past-papers/course-card"
import { UploadPaperDialog } from "@/components/past-papers/upload-paper-dialog"
import {
  departments,
  examTypes,
  semesters,
  years,
  type CourseWithPapers,
  type PastPaper,
} from "@/lib/past-papers-data"
import { standardFilters, sortOptions, filterPresets } from "@/lib/filter-data"
import { Upload, FileText, Download, Users, TrendingUp, RefreshCw, Filter, BookmarkCheck, Tag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { AdvancedFilterBar } from "@/components/search/advanced-filter-bar"

 

export default function PastPapersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [selectedExamType, setSelectedExamType] = useState("All")
  const [selectedSemester, setSelectedSemester] = useState("All")
  const [selectedYear, setSelectedYear] = useState("All")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [currentSort, setCurrentSort] = useState("date-desc")
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [coursesWithPapers, setCoursesWithPapers] = useState<CourseWithPapers[]>([])
  const [showTagFilter, setShowTagFilter] = useState(false)
  const [availableTags, setAvailableTags] = useState<string[]>([])

  // Fetch approved past papers from API and group by course_code
  const loadPapers = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      // Server will further filter; we also filter client-side for richer UX
      if (selectedSemester !== "All") params.set("semester", selectedSemester)
      if (selectedYear !== "All") params.set("year", selectedYear)
      if (searchTerm) params.set("q", searchTerm)
      const res = await fetch(`/api/past-papers?${params.toString()}`, { cache: "no-store" })
      const json = await res.json()
      
      console.log('API Response:', json) // Debug log
      
      if (!res.ok) {
        throw new Error(json.error || 'Failed to fetch papers')
      }
      
      const rows: any[] = Array.isArray(json.data) ? json.data : []

      // Map DB rows to PastPaper-like items
      const papers: PastPaper[] = rows.map((r) => ({
        id: r.id || `paper-${Math.random().toString(36).slice(2, 9)}`,
        title: r.title || 'Untitled Paper',
        course: r.course_name || r.course_code || 'Unknown Course',
        courseCode: r.course_code || 'UNKNOWN',
        department: r.department || 'Unknown Department',
        semester: r.semester || 'Unknown Semester',
        year: Number(r.year) || new Date(r.created_at).getFullYear(),
        examType: (r.exam_type === 'Midterm' ? 'Mid-Term' : r.exam_type) || 'Mid-Term',
        uploadedBy: r.uploaded_by || 'Anonymous',
        uploadDate: r.created_at || new Date().toISOString(),
        downloadCount: r.download_count || 0,
        fileSize: r.file_size || 'Unknown',
        fileType: (r.file_type || 'PDF').toUpperCase() as 'PDF' | 'DOC' | 'DOCX',
        downloadUrl: r.file_url || r.public_url || r.external_url || r.link_url || undefined,
        tags: Array.isArray(r.tags) ? r.tags : (r.tags ? [r.tags] : []),
      }))

      // Group by courseCode
      const map = new Map<string, CourseWithPapers>()
      for (const p of papers) {
        if (!map.has(p.courseCode)) {
          map.set(p.courseCode, {
            id: p.courseCode,
            name: p.course,
            code: p.courseCode,
            creditHours: 3,
            department: p.department || "",
            totalPapers: 0,
            assignments: [],
            quizzes: [],
            midterms: [],
            finals: [],
            lastUpdated: "1970-01-01",
          })
        }
        const c = map.get(p.courseCode)!
        c.totalPapers += 1
        // Normalize exam type buckets
        switch (p.examType) {
          case "Assignment":
            c.assignments.push(p)
            break
          case "Quiz":
            c.quizzes.push(p)
            break
          case "Mid-Term":
            c.midterms.push(p)
            break
          case "Final":
          default:
            c.finals.push(p)
        }
        if (p.uploadDate > c.lastUpdated) c.lastUpdated = p.uploadDate
      }

      setCoursesWithPapers(Array.from(map.values()))
      
      // Extract all available tags for filtering
      const allTags = new Set<string>()
      papers.forEach(paper => {
        paper.tags.forEach(tag => allTags.add(tag))
      })
      setAvailableTags(Array.from(allTags).sort())
    } catch (e: any) {
      setError(e.message || "Failed to load past papers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPapers()
    // Re-run when top-level filters change; department and examType are applied client-side below
  }, [searchTerm, selectedSemester, selectedYear])

  // Listen for paper upload events to refresh the data
  useEffect(() => {
    const handlePaperUploaded = () => {
      console.log('Paper uploaded, refreshing data...')
      loadPapers()
    }
    
    window.addEventListener('pastpaper:uploaded', handlePaperUploaded)
    return () => window.removeEventListener('pastpaper:uploaded', handlePaperUploaded)
  }, [])

  const filteredCourses = useMemo(() => {
    // Filter courses by search term and department first
    let preliminaryFiltered = coursesWithPapers.filter((course) => {
      const matchesSearch =
        !searchTerm ||
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDepartment = selectedDepartment === "All" || course.department === selectedDepartment
      return matchesSearch && matchesDepartment
    })

    // Apply tag filtering and other filters
    if (selectedExamType !== "All" || selectedSemester !== "All" || selectedYear !== "All" || selectedTags.length > 0) {
      preliminaryFiltered = preliminaryFiltered
        .map((course) => {
          const papers = [
            ...course.assignments,
            ...course.quizzes,
            ...course.midterms,
            ...course.finals,
          ]

          const filteredPapers = papers.filter((p) => {
            const matchesExamType = selectedExamType === "All" || p.examType === selectedExamType
            const matchesSemester = selectedSemester === "All" || p.semester === selectedSemester
            const matchesYear = selectedYear === "All" || p.year.toString() === selectedYear
            const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => p.tags.includes(tag))
            
            return matchesExamType && matchesSemester && matchesYear && matchesTags
          })

          return {
            ...course,
            totalPapers: filteredPapers.length,
            assignments: filteredPapers.filter(p => p.examType === 'Assignment'),
            quizzes: filteredPapers.filter(p => p.examType === 'Quiz'),
            midterms: filteredPapers.filter(p => p.examType === 'Mid-Term'),
            finals: filteredPapers.filter(p => p.examType === 'Final'),
          }
        })
        .filter((course) => course.totalPapers > 0)
    }

    // Apply sorting
    const sorted = [...preliminaryFiltered].sort((a, b) => {
      switch (currentSort) {
        case 'date-desc':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        case 'date-asc':
          return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
        case 'title-asc':
          return a.name.localeCompare(b.name)
        case 'title-desc':
          return b.name.localeCompare(a.name)
        case 'course-asc':
          return a.code.localeCompare(b.code)
        case 'papers-desc':
          return b.totalPapers - a.totalPapers
        case 'papers-asc':
          return a.totalPapers - b.totalPapers
        default:
          return 0
      }
    })

    return sortDirection === 'desc' ? sorted : sorted.reverse()
  }, [coursesWithPapers, searchTerm, selectedDepartment, selectedExamType, selectedSemester, selectedYear, selectedTags, currentSort, sortDirection])

  const totalPapers = coursesWithPapers.reduce((sum, course) => sum + course.totalPapers, 0)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Enhanced Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700/30 text-sm font-medium text-blue-700 dark:text-blue-300 mb-6">
              <FileText className="h-4 w-4" />
              Academic Resources
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              Past <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Papers</span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-8 font-medium leading-relaxed">
              Browse courses and access organized past papers including assignments, quizzes, midterms, and finals.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <UploadPaperDialog>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl text-lg px-8 py-4 rounded-2xl transition-all duration-300 hover:-translate-y-1">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Paper
                </Button>
              </UploadPaperDialog>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={loadPapers}
                disabled={loading}
                className="px-6 py-4 rounded-2xl border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-200/30 dark:border-blue-700/30">
                  <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{totalPapers}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Papers</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-200/30 dark:border-green-700/30">
                  <Download className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{filteredCourses.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Filtered Courses</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-200/30 dark:border-purple-700/30">
                  <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{availableTags.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Available Tags</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-200/30 dark:border-orange-700/30">
                  <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{departments.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Departments</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Search and Filters */}
          <AdvancedFilterBar
            search={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search by course name, code, or tags..."
            selects={[
              {
                ...standardFilters.departments,
                value: selectedDepartment,
                onChange: setSelectedDepartment,
                label: "Department",
                description: "Filter by academic department",
                options: [...standardFilters.departments.options] as Array<{ label: string; value: string; description?: string }>
              },
              {
                ...standardFilters.examTypes,
                value: selectedExamType,
                onChange: setSelectedExamType,
                label: "Exam Type",
                description: "Filter by examination type",
                options: [...standardFilters.examTypes.options] as Array<{ label: string; value: string; description?: string }>
              },
              {
                ...standardFilters.semesters,
                value: selectedSemester,
                onChange: setSelectedSemester,
                label: "Semester",
                description: "Filter by academic semester",
                options: [...standardFilters.semesters.options] as Array<{ label: string; value: string; description?: string }>
              },
              {
                ...standardFilters.academicYears,
                value: selectedYear,
                onChange: setSelectedYear,
                label: "Year",
                description: "Filter by academic year",
                options: [...standardFilters.academicYears.options] as Array<{ label: string; value: string; description?: string }>
              }
            ]}
            sortOptions={sortOptions.pastPapers}
            currentSort={currentSort}
            onSortChange={setCurrentSort}
            sortDirection={sortDirection}
            onSortDirectionChange={setSortDirection}
            filterPresets={[
              {
                id: 'recent-cs',
                name: 'Recent CS Papers',
                filters: { department: 'Computer Science', semester: 'Fall 2024' },
                description: 'Latest Computer Science papers'
              },
              {
                id: 'midterms-all',
                name: 'All Midterms',
                filters: { examType: 'Mid-Term' },
                description: 'Mid-term examinations only'
              },
              {
                id: 'programming-papers',
                name: 'Programming Papers',
                filters: { search: 'programming', department: 'Computer Science' },
                description: 'Programming related papers'
              }
            ]}
            showActiveFilterCount={true}
            collapsible={true}
            defaultCollapsed={false}
            className="mb-10"
            right={
              <div className="flex items-center gap-4">
                {/* Tags Filter Toggle */}
                {availableTags.length > 0 && (
                  <Button
                    variant={showTagFilter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowTagFilter(!showTagFilter)}
                    className="flex items-center gap-2"
                  >
                    <Tag className="h-4 w-4" />
                    Tags ({availableTags.length})
                  </Button>
                )}
                
                {/* Quick Clear Filters */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedDepartment("All")
                    setSelectedExamType("All")
                    setSelectedSemester("All")
                    setSelectedYear("All")
                    setSelectedTags([])
                  }}
                  className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                >
                  <Filter className="h-4 w-4" />
                  Clear All
                </Button>
              </div>
            }
          />

          {/* Tags Filter Section */}
          {showTagFilter && availableTags.length > 0 && (
            <Card className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">Filter by Tags</h3>
                  {selectedTags.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {selectedTags.length} selected
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag)
                    return (
                      <Button
                        key={tag}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedTags(selectedTags.filter(t => t !== tag))
                          } else {
                            setSelectedTags([...selectedTags, tag])
                          }
                        }}
                        className={`text-xs rounded-full transition-all duration-200 ${
                          isSelected 
                            ? 'bg-primary text-primary-foreground shadow-lg' 
                            : 'hover:bg-primary/10 hover:text-primary hover:border-primary/30'
                        }`}
                      >
                        {tag}
                      </Button>
                    )
                  })}
                </div>
                {selectedTags.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTags([])}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      Clear tag selection
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Enhanced Results */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">
              {filteredCourses.length} Course{filteredCourses.length !== 1 ? "s" : ""} <span className="text-blue-600 dark:text-blue-400">Found</span>
            </h2>
            <p className="text-slate-700 dark:text-slate-200 font-medium">
              Discover academic resources shared by your fellow students
            </p>
          </div>

            {loading ? (
              <Card className="p-12 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Loading...</h3>
                <p className="text-muted-foreground">Fetching past papers from the database.</p>
              </Card>
            ) : filteredCourses.length === 0 ? (
              <Card className="p-16 text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg">
                <FileText className="h-20 w-20 text-slate-400 dark:text-slate-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">No Courses Found</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6 font-serif text-lg max-w-md mx-auto">
                  Try adjusting your search terms or department filter to find more courses.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedDepartment("All")
                    setSelectedExamType("All")
                    setSelectedSemester("All")
                    setSelectedYear("All")
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3"
                  size="lg"
                >
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.code} course={course} />
                ))}
              </div>
            )}
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: "Home", path: "/" }, { name: "Past Papers", path: "/past-papers" }])) }}
      />
    </div>
  )
}
