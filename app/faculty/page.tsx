"use client"

import { useEffect, useMemo, useState } from "react"
import { jsonLdCollectionPage } from "@/lib/seo"
import { useCampus } from "@/contexts/campus-context"
// Footer is provided by the root layout; avoid importing locally to prevent duplicates
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FacultyCard } from "@/components/faculty/faculty-card"
import { departments, type Faculty, searchFaculty } from "@/lib/faculty-data"
import { standardFilters, sortOptions, filterPresets } from "@/lib/filter-data"
import { Users, Star, MessageSquare, Filter, Award, BookOpen, RotateCcw, GraduationCap, MapPin } from "lucide-react"
import { AdvancedFilterBar } from "@/components/search/advanced-filter-bar"
import { CenteredLoader } from "@/components/ui/loading-spinner"

export default function FacultyPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [selectedSpecialization, setSelectedSpecialization] = useState("All")
  const [minRating, setMinRating] = useState("All")
  const [experienceLevel, setExperienceLevel] = useState("All")
  const [coursesTaught, setCoursesTaught] = useState("All")
  const [currentSort, setCurrentSort] = useState("name-asc")
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [facultyList, setFacultyList] = useState<Faculty[]>([])
  const [stats, setStats] = useState({ facultyCount: 0, totalReviews: 0, averageRating: 0, departmentCount: 0 })
  const [statsLoading, setStatsLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const { selectedCampus, selectedDepartment: campusDepartment } = useCampus()
  
  // Preserve and restore scroll position when navigating to profile and back
  useEffect(() => {
    // Attempt to restore stored scroll position
    const stored = sessionStorage.getItem('facultyScrollY')
    if (stored) {
      const y = parseInt(stored, 10)
      if (!Number.isNaN(y)) {
        // Use rAF to ensure layout painted before scrolling
        requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior }))
      }
      sessionStorage.removeItem('facultyScrollY')
    }

    // Save scroll before navigating to a faculty detail page
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target?.closest && (target.closest('a') as HTMLAnchorElement | null)
      const href = anchor?.getAttribute?.('href') || ''
      if (href && href.startsWith('/faculty/')) {
        sessionStorage.setItem('facultyScrollY', String(window.scrollY))
      }
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
    }
  }, [])

  // Debounce search input for smoother UX
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300)
    return () => clearTimeout(id)
  }, [searchQuery])

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true)
      try {
        const res = await fetch('/api/faculty/stats')
        if (!res.ok) throw new Error('Failed to fetch stats')
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error(error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStats()


    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        // Build URL with campus and department filters
        const params = new URLSearchParams()
        if (selectedCampus?.id) params.set('campus_id', selectedCampus.id)
        if (campusDepartment?.id) params.set('department_id', campusDepartment.id)
        
        const url = `/api/faculty${params.toString() ? `?${params.toString()}` : ''}`
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body?.error || 'Failed to fetch faculty')
        }
        const data = await res.json()
        setFacultyList(Array.isArray(data) ? data : [])
      } catch (e: any) {
        setError(e?.message || 'Failed to load faculty')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [selectedCampus, campusDepartment])

  const filteredFaculty = useMemo(() => {
    let faculty = [...facultyList]
    
    // Apply filters
    if (selectedDepartment !== "All") {
      faculty = faculty.filter((f) => f.department === selectedDepartment)
    }
    
    if (selectedSpecialization !== "All") {
      faculty = faculty.filter((f) => f.specialization?.includes(selectedSpecialization))
    }
    
    if (minRating !== "All") {
      const rating = parseFloat(minRating)
      faculty = faculty.filter((f) => f.averageRating >= rating)
    }
    
    if (experienceLevel !== "All") {
      faculty = faculty.filter((f) => {
        // Extract numeric years from experience string (e.g., "15 years" -> 15)
        const experienceStr = f.experience || "0"
        const years = parseInt(experienceStr.match(/\d+/)?.[0] || "0", 10)
        switch (experienceLevel) {
          case "Junior": return years < 5
          case "Mid-level": return years >= 5 && years < 10
          case "Senior": return years >= 10 && years < 20
          case "Expert": return years >= 20
          default: return true
        }
      })
    }
    
    if (coursesTaught !== "All") {
      faculty = faculty.filter((f) => f.courses?.some((course: string) => course.toLowerCase().includes(coursesTaught.toLowerCase())))
    }
    
    // Apply search
    if (debouncedSearch) {
      faculty = searchFaculty(faculty, debouncedSearch)
    }
    
    // Apply sorting
    faculty = faculty.sort((a, b) => {
      let result = 0
      switch (currentSort) {
        case 'name-asc':
          result = a.name.localeCompare(b.name)
          break
        case 'name-desc':
          result = b.name.localeCompare(a.name)
          break
        case 'rating-desc':
          result = b.averageRating - a.averageRating
          break
        case 'reviews-desc':
          result = b.totalReviews - a.totalReviews
          break
        case 'experience-desc':
          // Extract numeric years from experience strings for comparison
          const aYears = parseInt((a.experience || "0").match(/\d+/)?.[0] || "0", 10)
          const bYears = parseInt((b.experience || "0").match(/\d+/)?.[0] || "0", 10)
          result = bYears - aYears
          break
        case 'department-asc':
          result = a.department.localeCompare(b.department)
          break
        default:
          result = 0
      }
      return sortDirection === 'desc' ? -result : result
    })
    
    return faculty
  }, [debouncedSearch, selectedDepartment, selectedSpecialization, minRating, experienceLevel, coursesTaught, currentSort, sortDirection, facultyList])


  return (
    <div className="min-h-screen bg-mesh overflow-hidden relative">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLdCollectionPage({
              name: 'Faculty Directory',
              description: 'Directory of faculty members with reviews at COMSATS University Islamabad',
              path: '/faculty',
              items: filteredFaculty.slice(0,100).map(f => ({ name: f.name, url: `/faculty/${f.id}` })),
              itemType: 'Person'
            })
          )
        }}
      />
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '4s' }} />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-primary/30 rotate-45 animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-20 w-6 h-6 bg-blue-500/30 rounded-full animate-bounce" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-500/30 rotate-45 animate-bounce" style={{ animationDelay: '5s' }} />
      </div>

      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-blue-500/8" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20" />

      <main className="flex-1 py-24 px-4 relative z-10">
        <div className="container mx-auto max-w-7xl">
          {/* Enhanced Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary mb-6 hover:from-primary/20 hover:to-blue-500/20 transition-all duration-300 hover-lift">
              <Users className="h-4 w-4" />
              Academic Community
            </div>
            <h1 className="text-5xl lg:text-8xl font-bold leading-[0.9] text-balance mb-6">
              Faculty{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Reviews
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-serif max-w-4xl mx-auto mb-4">
              Read reviews and ratings from fellow students to make informed decisions about your courses and faculty
              choices. Connect with COMSATS academic community.
            </p>
            <p className="text-lg text-muted-foreground/80 font-light max-w-xl mx-auto">
              Transparent insights from real student experiences
            </p>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <Card className="card-modern border-0 backdrop-blur-sm hover-lift transition-all duration-300 group shadow-lg hover:shadow-xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 border border-primary/30 text-primary group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight text-foreground">{statsLoading ? "..." : stats.facultyCount}</div>
                  <div className="text-sm text-muted-foreground font-medium">Faculty Members</div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-modern border-0 backdrop-blur-sm hover-lift transition-all duration-300 group shadow-lg hover:shadow-xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-300/30 text-green-500 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight text-foreground">{statsLoading ? "..." : stats.totalReviews}</div>
                  <div className="text-sm text-muted-foreground font-medium">Total Reviews</div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-modern border-0 backdrop-blur-sm hover-lift transition-all duration-300 group shadow-lg hover:shadow-xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-300/30 text-yellow-600 group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight text-foreground">{statsLoading ? "..." : stats.averageRating.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground font-medium">Average Rating</div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-modern border-0 backdrop-blur-sm hover-lift transition-all duration-300 group shadow-lg hover:shadow-xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-300/30 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight text-foreground">{statsLoading ? "..." : stats.departmentCount}</div>
                  <div className="text-sm text-muted-foreground font-medium">Departments</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Search and Filters */}
          <AdvancedFilterBar
            search={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search faculty by name, specialization, courses, or research interests..."
            selects={[
              {
                ...standardFilters.departments,
                value: selectedDepartment,
                onChange: setSelectedDepartment,
                label: "Department",
                description: "Filter by academic department",
                options: departments.map((d) => ({ label: d, value: d }))
              },
              {
                id: "specialization",
                value: selectedSpecialization,
                onChange: setSelectedSpecialization,
                placeholder: "All Specializations",
                label: "Specialization",
                description: "Filter by faculty specialization area",
                options: useMemo(() => {
                  const specializations = Array.from(new Set(
                    facultyList.flatMap(f => f.specialization || [])
                  )).sort()
                  return [
                    { label: "All Specializations", value: "All" },
                    ...specializations.map(s => ({ label: s, value: s }))
                  ]
                }, [facultyList])
              },
              {
                id: "rating",
                value: minRating,
                onChange: setMinRating,
                placeholder: "Any Rating",
                label: "Minimum Rating",
                description: "Filter by minimum rating",
                options: [
                  { label: "Any Rating", value: "All" },
                  { label: "4.5+ Stars", value: "4.5", description: "Excellent" },
                  { label: "4.0+ Stars", value: "4.0", description: "Very Good" },
                  { label: "3.5+ Stars", value: "3.5", description: "Good" },
                  { label: "3.0+ Stars", value: "3.0", description: "Average" }
                ]
              },
              {
                id: "experience",
                value: experienceLevel,
                onChange: setExperienceLevel,
                placeholder: "Any Experience",
                label: "Experience Level",
                description: "Filter by years of experience",
                options: [
                  { label: "Any Experience", value: "All" },
                  { label: "Junior (0-5 years)", value: "Junior", description: "New faculty" },
                  { label: "Mid-level (5-10 years)", value: "Mid-level", description: "Experienced" },
                  { label: "Senior (10-20 years)", value: "Senior", description: "Highly experienced" },
                  { label: "Expert (20+ years)", value: "Expert", description: "Distinguished faculty" }
                ]
              }
            ]}
            sortOptions={sortOptions.faculty}
            currentSort={currentSort}
            onSortChange={setCurrentSort}
            sortDirection={sortDirection}
            onSortDirectionChange={setSortDirection}
            filterPresets={[
              {
                id: 'highly-rated',
                name: 'Highly Rated',
                filters: { rating: '4.0' },
                description: 'Faculty with 4+ star ratings'
              },
              {
                id: 'cs-faculty',
                name: 'CS Faculty',
                filters: { department: 'Computer Science' },
                description: 'Computer Science department faculty'
              },
              {
                id: 'senior-faculty',
                name: 'Senior Faculty',
                filters: { experience: 'Senior' },
                description: 'Experienced faculty members'
              }
            ]}
            showActiveFilterCount={true}
            collapsible={true}
            defaultCollapsed={false}
            className="mb-10"
            right={
              <div className="flex items-center gap-4">
                {/* Quick Clear Filters */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedDepartment("All")
                    setSelectedSpecialization("All")
                    setMinRating("All")
                    setExperienceLevel("All")
                    setCoursesTaught("All")
                  }}
                  className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear All
                </Button>
              </div>
            }
          />

          {/* Enhanced Results */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              {filteredFaculty.length} Faculty Member{filteredFaculty.length !== 1 ? "s" : ""} Found
            </h2>
            <div className="flex items-center gap-4">
              <p className="text-muted-foreground font-serif">
                Discover insights from student reviews and ratings
              </p>
              {filteredFaculty.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200/30">
                  <Star className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Reviews available</span>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <CenteredLoader message="Loading faculty members..." />
          ) : error ? (
            <Card className="card-modern border-0 backdrop-blur-sm p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Error Loading Faculty</h3>
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            </Card>
          ) : filteredFaculty.length === 0 ? (
            <Card className="card-modern border-0 backdrop-blur-sm p-16 text-center shadow-lg">
              <div className="max-w-md mx-auto">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                  <Users className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">No Faculty Found</h3>
                <p className="text-muted-foreground mb-8 font-serif text-lg leading-relaxed">
                  Try adjusting your search terms or department filter to find more faculty members.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedDepartment("All")
                    setSelectedSpecialization("All")
                    setMinRating("All")
                    setExperienceLevel("All")
                    setCoursesTaught("All")
                  }}
                  className="text-lg px-8 py-3 rounded-2xl button-modern bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFaculty.map((faculty) => (
                <FacultyCard key={faculty.id} faculty={faculty} searchTerm={debouncedSearch} />
              ))}
            </div>
          )}
        </div>
      </main>

    </div>
  )
}

