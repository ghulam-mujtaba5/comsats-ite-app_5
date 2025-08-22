"use client"

import { useEffect, useMemo, useState } from "react"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { FacultyCard } from "@/components/faculty/faculty-card"
import { departments, type Faculty, searchFaculty } from "@/lib/faculty-data"
import { Search, Users, Star, MessageSquare, Filter } from "lucide-react"
import { supabase } from "@/lib/supabase"

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
      const { data, error } = await supabase.from("faculty").select("*")
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      const mapped: Faculty[] = (data || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        title: row.title || "",
        department: row.department || "",
        email: row.email || "",
        office: row.office || "",
        phone: row.phone || undefined,
        specialization: row.specialization || [],
        courses: row.courses || [],
        education: row.education || [],
        experience: row.experience || "",
        profileImage: row.profile_image || undefined,
        averageRating: Number(row.rating_avg ?? 0),
        totalReviews: Number(row.rating_count ?? 0),
        joinDate: row.created_at || new Date().toISOString(),
      }))
      setFacultyList(mapped)
      setLoading(false)
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
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Faculty Reviews</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Read reviews and ratings from fellow students to make informed decisions about your courses and faculty
              choices.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{statsLoading ? "..." : stats.facultyCount}</div>
                  <div className="text-sm text-muted-foreground">Faculty Members</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <MessageSquare className="h-8 w-8 text-accent" />
                <div>
                  <div className="text-2xl font-bold">{statsLoading ? "..." : stats.totalReviews}</div>
                  <div className="text-sm text-muted-foreground">Total Reviews</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Star className="h-8 w-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{statsLoading ? "..." : stats.averageRating.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Filter className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{statsLoading ? "..." : stats.departmentCount}</div>
                  <div className="text-sm text-muted-foreground">Departments</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search faculty by name, specialization, or courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">
              {filteredFaculty.length} Faculty Member{filteredFaculty.length !== 1 ? "s" : ""} Found
            </h2>
          </div>

          {loading ? (
            <Card className="p-12 text-center">Loading faculty...</Card>
          ) : error ? (
            <Card className="p-12 text-center text-red-600">{error}</Card>
          ) : filteredFaculty.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Faculty Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or department filter to find more faculty members.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedDepartment("All")
                }}
                className="bg-transparent border"
              >
                Clear Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

