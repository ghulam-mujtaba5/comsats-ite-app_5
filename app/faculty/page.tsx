"use client"

import { useEffect, useMemo, useState } from "react"
import { jsonLdCollectionPage } from "@/lib/seo"
import { useCampus } from "@/contexts/campus-context"
import { useAuth } from "@/contexts/auth-context"
// Footer is provided by the root layout; avoid importing locally to prevent duplicates
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FacultyCard } from "@/components/faculty/faculty-card"
import { departments, type Faculty, searchFaculty } from "@/lib/faculty-data"
import { standardFilters, sortOptions, filterPresets } from "@/lib/filter-data"
import { Users, Star, MessageSquare, Filter, Award, BookOpen, RotateCcw, GraduationCap, Plus } from "lucide-react"
import { AdvancedFilterBar } from "@/components/search/advanced-filter-bar"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { AddFacultyDialog } from "@/components/faculty/add-faculty-dialog"
import { getDepartmentFromEmail } from '@/lib/student-department-utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"
import styles from './faculty.module.css'
import './faculty.light.module.css'
import './faculty.dark.module.css'
import commonStyles from '@/app/styles/common.module.css'

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
  const [userDepartment, setUserDepartment] = useState<string | null>(null)
  const [autoFilterApplied, setAutoFilterApplied] = useState(false)
  const { selectedCampus, selectedDepartment: campusDepartment, setSelectedCampus } = useCampus()
  const { user } = useAuth()
  
  // Get user's department from their email and auto-apply it
  useEffect(() => {
    if (user?.email && !autoFilterApplied) {
      const department = getDepartmentFromEmail(user.email)
      setUserDepartment(department)
      
      // Auto-select user's department if valid and no manual selection made yet
      if (department && selectedDepartment === "All") {
        setSelectedDepartment(department)
        setAutoFilterApplied(true)
      }
    }
  }, [user, selectedDepartment, autoFilterApplied])
  
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
        if (!res.ok) {
          console.error("Failed to fetch stats:", res.status, res.statusText)
          // Set default values instead of throwing error
          setStats({ facultyCount: 0, totalReviews: 0, averageRating: 0, departmentCount: 0 })
          return
        }
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
        // Set default values on error
        setStats({ facultyCount: 0, totalReviews: 0, averageRating: 0, departmentCount: 0 })
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
        // Include department from context if available (auto-filtering)
        if (campusDepartment?.id) params.set('department_id', campusDepartment.id)
        
        const url = `/api/faculty${params.toString() ? `?${params.toString()}` : ''}`
        const res = await fetch(url, { cache: 'no-store' }) // Use no-store to prevent caching issues
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          console.error("Failed to fetch faculty:", res.status, res.statusText, body)
          // Don't throw error, just set empty array
          setFacultyList([])
          return
        }
        const data = await res.json()
        setFacultyList(Array.isArray(data) ? data : [])
      } catch (e: any) {
        console.error("Error loading faculty:", e)
        // Don't set error state that would break the page, just set empty array
        setFacultyList([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [selectedCampus, campusDepartment])

  const filteredFaculty = useMemo(() => {
    let faculty = [...facultyList]
    
    // Apply department filter - ONLY if explicitly selected, not auto-filtered
    if (selectedDepartment !== "All") {
      faculty = faculty.filter((f) => f.department === selectedDepartment)
    }
    // Note: We're removing the automatic userDepartment filtering to show all departments by default
    // Users can still manually select their department if they want to filter
    
    // Apply other filters
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
  }, [debouncedSearch, selectedDepartment, selectedSpecialization, minRating, experienceLevel, coursesTaught, currentSort, sortDirection, facultyList, userDepartment])

  function AddFacultyCard() {
    const [open, setOpen] = useState(false)
    
    return (
      <>
        <Card className="border-2 border-dashed border-primary/30 hover:border-primary/60 glass-card-premium glass-hover glass-gradient transition-all duration-300 group cursor-pointer h-full flex flex-col overflow-hidden rounded-2xl"
          onClick={() => setOpen(true)}>
          <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center flex-grow">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative p-4 rounded-full bg-primary/15 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-105">
                <Plus className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Add Faculty Member</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Is a faculty member missing? Help us expand our directory.
            </p>
            <div className="w-full space-y-2">
              <Button 
                variant="default" 
                className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md hover:shadow-lg transition-all duration-300 group-hover:shadow-lg"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  setOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Faculty
              </Button>
              <p className="text-xs text-muted-foreground/70">
                Click anywhere on this card to open
              </p>
            </div>
          </CardContent>
        </Card>
        <AddFacultyDialog open={open} onOpenChange={setOpen} />
      </>
    )
  }

  return (
    <div className={`${styles.page} bg-gradient-to-br from-slate-50 via-white to-blue-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-blue-900/20`}>
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
  <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse float animate-delay-2000" />
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse float animate-delay-4000" />
        
        {/* Floating geometric shapes */}
  <div className="absolute top-20 right-20 w-4 h-4 bg-primary/30 rotate-45 animate-bounce animate-delay-1000" />
  <div className="absolute bottom-32 left-20 w-6 h-6 bg-blue-500/30 rounded-full animate-bounce animate-delay-3000" />
  <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-500/30 rotate-45 animate-bounce animate-delay-5000" />
      </div>

      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-blue-500/15" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/30" />

      <main className={styles.main}>
        <div className={`${commonStyles.section} ${styles.container}`}>
          {/* Enhanced Header Section */}
          <div className={styles.header}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary mb-6 hover:from-primary/20 hover:to-blue-500/20 transition-all duration-300 hover-lift">
              <Users className="h-4 w-4" />
              Academic Community
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Faculty{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Directory
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
              Discover and review faculty members. Share your experiences to help fellow students make informed decisions.
            </p>
            
            {/* Link to dedicated reviews page */}
            <div className="mb-6">
              <Button variant="outline" asChild>
                <Link href="/faculty/reviews">
                  <Star className="h-4 w-4 mr-2" />
                  View All Faculty Reviews
                </Link>
              </Button>
            </div>
            
            {/* Prominent Add Faculty Button - REMOVED to avoid redundancy */}
            <div className="mb-8">
              {/* <AddFacultyDialog /> - Removed to avoid redundancy with the card at the end of the grid */}
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className={styles.statsGrid}>
            <Card className="glass-card glass-border-light glass-hover rounded-2xl hover-lift transition-all duration-300 group">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-300/30 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-foreground">{statsLoading ? "..." : stats.facultyCount}</div>
                  <div className="text-xs text-muted-foreground">Total Faculty</div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card glass-border-light glass-hover rounded-2xl hover-lift transition-all duration-300 group">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-300/30 text-amber-500 group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-foreground">{statsLoading ? "..." : stats.averageRating.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">Average Rating</div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card glass-border-light glass-hover rounded-2xl hover-lift transition-all duration-300 group">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-300/30 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-foreground">{statsLoading ? "..." : stats.departmentCount}</div>
                  <div className="text-xs text-muted-foreground">Departments</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Auto-filter notification banner */}
          {autoFilterApplied && filteredFaculty.length > 0 && selectedDepartment !== "All" && (
            <div className="glass-card border border-blue-200/50 dark:border-blue-800/50 rounded-2xl p-4 bg-blue-50/80 dark:bg-blue-950/80 backdrop-blur-sm mb-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <GraduationCap className="h-4 w-4" />
                  <span className="font-medium">Auto-filtered by your department:</span>
                  <span>{selectedDepartment}</span>
                  <Badge variant="secondary" className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {filteredFaculty.length} found
                  </Badge>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setSelectedDepartment("All")
                    setAutoFilterApplied(false)
                  }}
                  className="shrink-0"
                >
                  Show all departments
                </Button>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                Results filtered to show faculty from your department. Click above to view all faculty.
              </p>
            </div>
          )}

          {/* Suggested department banner (when auto-filter was not applied or returned zero results) */}
          {userDepartment && !autoFilterApplied && selectedDepartment === "All" && (
            <div className="glass-card border border-blue-200/50 dark:border-blue-800/50 rounded-2xl p-4 bg-blue-50/80 dark:bg-blue-950/80 backdrop-blur-sm mb-6">
              <div className="flex items-center justify-between gap-4 text-blue-800 dark:text-blue-200">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span className="font-medium">Your Department:</span>
                  <span>{userDepartment}</span>
                  <Badge variant="secondary" className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    Quick filter
                  </Badge>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setSelectedDepartment(userDepartment!)
                    setAutoFilterApplied(true)
                  }}
                >
                  Filter to {userDepartment}
                </Button>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                Click to quickly filter faculty from your department.
              </p>
            </div>
          )}
          
          {/* Enhanced Search and Filters */}
          <AdvancedFilterBar
            search={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search faculty by name, department, or specialization..."
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
            className="mb-8"
            right={
              <div className="flex items-center gap-2">
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
                  Clear
                </Button>
              </div>
            }
          />

          {/* Results Header */}
          <div className={styles.resultsHeader}>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {filteredFaculty.length} Faculty Member{filteredFaculty.length !== 1 ? "s" : ""}
              </h2>
              <p className="text-muted-foreground">
                {searchQuery ? `Search results for "${searchQuery}"` : "Browse all faculty members"}
              </p>
            </div>
            
            {/* Add Faculty Button for Mobile/Tablet - REMOVED to avoid redundancy */}
            <div className="sm:hidden w-full">
              {/* <AddFacultyDialog /> - Removed to avoid redundancy with the card at the end of the grid */}
            </div>
          </div>

          {loading ? (
            <CenteredLoader message="Loading faculty members..." />
          ) : error ? (
            <Card className="glass-card glass-border-light glass-hover rounded-2xl p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Error Loading Faculty</h3>
                <p className="text-red-600 font-medium mb-6">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </Card>
          ) : filteredFaculty.length === 0 ? (
            <Card className="glass-card glass-border-light glass-hover rounded-2xl p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                  <Users className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">No Faculty Found</h3>
                <div className="text-muted-foreground mb-8 space-y-2">
                  <p>No faculty members match your current filters.</p>
                  {selectedCampus && (
                    <p className="text-sm">
                      Campus filter: <span className="font-medium">{selectedCampus.full_name || selectedCampus.name}</span>
                    </p>
                  )}
                  {selectedDepartment !== "All" && (
                    <p className="text-sm">
                      Department filter: <span className="font-medium">{selectedDepartment}</span>
                    </p>
                  )}
                  {autoFilterApplied && (
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">
                        💡 Auto-filters are active. Try broadening your search below.
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                  {(selectedDepartment !== "All" || autoFilterApplied) && (
                    <Button
                      onClick={() => {
                        setSelectedDepartment("All")
                        setAutoFilterApplied(false)
                      }}
                      className="px-6 py-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Show all departments
                    </Button>
                  )}
                  {selectedCampus && (
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCampus(null)}
                      className="px-6 py-2 rounded-xl"
                    >
                      Show all campuses
                    </Button>
                  )}
                  {selectedDepartment === "All" && !selectedCampus && (
                    <Button
                      onClick={() => {
                        setSearchQuery("")
                        setSelectedSpecialization("All")
                        setMinRating("All")
                        setExperienceLevel("All")
                        setCoursesTaught("All")
                      }}
                      className="px-6 py-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear all filters
                    </Button>
                  )}
                </div>
                <div className="border-t border-border pt-6">
                  <p className="text-muted-foreground mb-4">Don't see a faculty member?</p>
                  {/* Using the new AddFacultyCard component for consistency */}
                  <div className="max-w-sm mx-auto">
                    <AddFacultyCard />
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <div className={styles.cardsGrid}>
              {filteredFaculty.map((faculty) => (
                <FacultyCard key={faculty.id} faculty={faculty} searchTerm={debouncedSearch} />
              ))}
              
              {/* Add Faculty Card at the end */}
              <AddFacultyCard />
            </div>
          )}
        </div>
      </main>

    </div>
  )
}