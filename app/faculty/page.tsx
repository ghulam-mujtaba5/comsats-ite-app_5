"use client"

import { useEffect, useMemo, useState } from "react"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FacultyCard } from "@/components/faculty/faculty-card"
import { departments, type Faculty, searchFaculty } from "@/lib/faculty-data"
import { Users, Star, MessageSquare, Filter } from "lucide-react"
import { AdvancedFilterBar } from "@/components/search/advanced-filter-bar"
import { CenteredLoader } from "@/components/ui/loading-spinner"

export default function FacultyPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")
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
    let faculty = selectedDepartment === "All" ? facultyList : facultyList.filter((f) => f.department === selectedDepartment)
    if (searchQuery.trim()) {
      faculty = searchFaculty(faculty, searchQuery)
    }
    return faculty
  }, [searchQuery, selectedDepartment, facultyList])


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
          <Card className="mb-10 card-modern border-0 backdrop-blur-sm">
            <CardContent className="p-8">
              <AdvancedFilterBar
                search={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search faculty by name, specialization, or courses..."
                selects={[
                  {
                    id: "department",
                    value: selectedDepartment,
                    onChange: setSelectedDepartment,
                    placeholder: "All Departments",
                    options: departments.map((d) => ({ label: d, value: d })),
                  },
                ]}
              />
            </CardContent>
          </Card>

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

