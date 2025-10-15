"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, 
  Search, 
  Building2, 
  GraduationCap, 
  MapPin, 
  Briefcase,
  Filter
} from "lucide-react"
import { AnimatedCard, FadeInScroll } from "@/components/animations/enhanced"
import { notifyFetch } from "@/lib/notify"

interface Alumni {
  user_id: string
  full_name: string
  company: string
  position: string
  graduation_year: string
  degree: string
  campus: {
    name: string
    code: string
  } | null
  department: {
    name: string
    code: string
  } | null
}

export default function AlumniDirectory() {
  const { isAuthenticated } = useAuth()
  const [alumni, setAlumni] = useState<Alumni[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [campus, setCampus] = useState("")
  const [department, setDepartment] = useState("")
  const [company, setCompany] = useState("")
  const [graduationYear, setGraduationYear] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  // Fetch alumni directory
  useEffect(() => {
    const fetchAlumni = async () => {
      if (!isAuthenticated) return
      
      try {
        setLoading(true)
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "20",
          search,
          campus,
          department,
          company,
          graduation_year: graduationYear
        })
        
        const response = await notifyFetch(`/api/alumni/directory?${params}`, undefined, {
          errorMessage: "Failed to load alumni directory"
        })
        
        if (!response.ok) {
          throw new Error("Failed to fetch alumni directory")
        }
        
        const data = await response.json()
        setAlumni(data.alumni)
        setHasMore(data.pagination.hasMore)
      } catch (err) {
        setError("Failed to load alumni directory")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAlumni()
  }, [isAuthenticated, page, search, campus, department, company, graduationYear])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-mesh overflow-hidden relative flex flex-col items-center justify-center py-12 px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <AnimatedCard className="card-modern border-0 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl">
            <CardContent className="p-12 lg:p-16 space-y-8">
              <div className="flex flex-col items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-20" />
                  <Users className="h-16 w-16 text-primary relative z-10" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Alumni <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">Directory</span>
                </h1>
              </div>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Connect with fellow COMSATS alumni. Sign in to access the alumni directory.
              </p>

              <div className="pt-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 hover-lift shadow-xl font-semibold text-base h-auto"
                  onClick={() => window.location.href = '/auth'}
                >
                  Sign In to Access Directory
                </Button>
              </div>
            </CardContent>
          </AnimatedCard>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mesh overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '4s' }} />
      </div>

      <main className="flex-1 py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <FadeInScroll className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary mb-6 hover:from-primary/20 hover:to-blue-500/20 transition-all duration-300 hover-lift">
              <Users className="h-4 w-4" />
              Alumni Directory
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Connect with <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">Alumni</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Find and connect with fellow COMSATS graduates
            </p>
          </FadeInScroll>

          {/* Error Message */}
          {error && (
            <FadeInScroll className="mb-8">
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3">
                <div className="h-5 w-5 text-red-500" />
                <span className="text-red-500">{error}</span>
              </div>
            </FadeInScroll>
          )}

          {/* Search and Filters */}
          <AnimatedCard className="glass-card-premium glass-hover glass-gradient border border-white/20 rounded-3xl shadow-xl backdrop-blur-2xl transition-all duration-300 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Search className="h-6 w-6 text-primary" />
                <span>Search Alumni</span>
              </CardTitle>
              <CardDescription>
                Find alumni by name, company, campus, or graduation year
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <Label htmlFor="search">Name or Company</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name or company..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 glass-card border-white/20"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="campus">Campus</Label>
                  <Select value={campus} onValueChange={setCampus}>
                    <SelectTrigger className="glass-card border-white/20 mt-1">
                      <SelectValue placeholder="Select campus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LHR">Lahore</SelectItem>
                      <SelectItem value="ISB">Islamabad</SelectItem>
                      <SelectItem value="ABD">Abbottabad</SelectItem>
                      <SelectItem value="ATK">Attock</SelectItem>
                      <SelectItem value="SWL">Sahiwal</SelectItem>
                      <SelectItem value="VEH">Vehari</SelectItem>
                      <SelectItem value="WAH">Wah</SelectItem>
                      <SelectItem value="VRT">Virtual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="graduation-year">Graduation Year</Label>
                  <Input
                    id="graduation-year"
                    placeholder="2020"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="glass-card border-white/20 mt-1"
                  />
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      setPage(1)
                      // Reset filters
                      setCampus("")
                      setDepartment("")
                      setCompany("")
                      setGraduationYear("")
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </AnimatedCard>

          {/* Alumni List */}
          <div className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <AnimatedCard 
                    key={i} 
                    className="glass-card-premium glass-hover glass-gradient border border-white/20 rounded-3xl shadow-xl backdrop-blur-2xl transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                          <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-3 w-full bg-muted rounded animate-pulse" />
                        <div className="h-3 w-5/6 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
                      </div>
                    </CardContent>
                  </AnimatedCard>
                ))}
              </div>
            ) : alumni.length === 0 ? (
              <AnimatedCard className="glass-card-premium glass-hover glass-gradient border border-white/20 rounded-3xl shadow-xl backdrop-blur-2xl transition-all duration-300">
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Alumni Found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters to find more alumni.
                  </p>
                </CardContent>
              </AnimatedCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {alumni.map((person) => (
                  <AnimatedCard 
                    key={person.user_id} 
                    className="glass-card-premium glass-hover glass-gradient border border-white/20 rounded-3xl shadow-xl backdrop-blur-2xl transition-all duration-300 hover:shadow-2xl"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{person.full_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Class of {person.graduation_year}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Briefcase className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{person.position}</p>
                            <p className="text-xs text-muted-foreground">{person.company}</p>
                          </div>
                        </div>
                        
                        {person.campus && (
                          <div className="flex items-start gap-3">
                            <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm">{person.campus.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {person.department?.name || 'Unknown Department'}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3">
                          <GraduationCap className="h-4 w-4 text-primary flex-shrink-0" />
                          <p className="text-sm">
                            {person.degree || 'Unknown Degree'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button variant="outline" size="sm" className="w-full">
                          Connect
                        </Button>
                      </div>
                    </CardContent>
                  </AnimatedCard>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {!loading && alumni.length > 0 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setPage(p => p + 1)}
                  disabled={!hasMore}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}