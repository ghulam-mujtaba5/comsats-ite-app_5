"use client"

import { useEffect, useMemo, useState } from "react"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FacultyCard } from "@/components/faculty/faculty-card"
import { departments, type Faculty, searchFaculty } from "@/lib/faculty-data"
import { standardFilters, sortOptions, filterPresets } from "@/lib/filter-data"
import { Users, Star, MessageSquare, Filter, Award, BookOpen, RotateCcw, GraduationCap } from "lucide-react"
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
        const res = await fetch('/api/faculty', { cache: 'no-store' })
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
  }, [])

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
    if (searchQuery.trim()) {
      faculty = searchFaculty(faculty, searchQuery)
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
  }, [searchQuery, selectedDepartment, selectedSpecialization, minRating, experienceLevel, coursesTaught, currentSort, sortDirection, facultyList])


  return (
    <div className="min-h-screen flex flex-col bg-mesh">
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Enhanced Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary mb-6">
              <Users className="h-4 w-4" />
              Academic Community
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6">
              Faculty <span className="text-gradient">Reviews</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto font-serif leading-relaxed">
              Read reviews and ratings from fellow students to make informed decisions about your courses and faculty
              choices.
            </p>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="card-modern border-0 hover-lift transition-all duration-300 group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 text-primary group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight">{statsLoading ? "..." : stats.facultyCount}</div>
                  <div className="text-sm text-muted-foreground font-medium">Faculty Members</div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-modern border-0 hover-lift transition-all duration-300 group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-500 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight">{statsLoading ? "..." : stats.totalReviews}</div>
                  <div className="text-sm text-muted-foreground font-medium">Total Reviews</div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-modern border-0 hover-lift transition-all duration-300 group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-500 group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight">{statsLoading ? "..." : stats.averageRating.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground font-medium">Average Rating</div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-modern border-0 hover-lift transition-all duration-300 group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                  <Filter className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight">{statsLoading ? "..." : stats.departmentCount}</div>
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
            <h2 className="text-3xl font-bold tracking-tight">
              {filteredFaculty.length} Faculty Member{filteredFaculty.length !== 1 ? "s" : ""} Found
            </h2>
            <p className="text-muted-foreground font-serif mt-2">
              Discover insights from student reviews and ratings
            </p>
          </div>

          {loading ? (
            <CenteredLoader message="Loading faculty members..." />
          ) : error ? (
            <Card className="p-12 text-center text-blue-600">{error}</Card>
          ) : filteredFaculty.length === 0 ? (
            <Card className="p-16 text-center card-modern border-0 backdrop-blur-sm">
              <Users className="h-20 w-20 text-muted-foreground mx-auto mb-6 opacity-50" />
              <h3 className="text-2xl font-bold mb-4">No Faculty Found</h3>
              <p className="text-muted-foreground mb-6 font-serif text-lg max-w-md mx-auto">
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
                className="button-modern bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                size="lg"
              >
                Clear Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFaculty.map((faculty) => (
                <FacultyCard key={faculty.id} faculty={faculty} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

