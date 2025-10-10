"use client"

// Metadata imports removed due to "use client" directive
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Upload, ExternalLink, Download, Shield, Star, Filter, RotateCcw, FileText } from "lucide-react"
import { AdvancedFilterBar, type Option } from "@/components/search/advanced-filter-bar"
import { standardFilters, sortOptions, filterPresets } from "@/lib/filter-data"
import { notifyFetch } from "@/lib/notify"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"

 

type Resource = {
  id: string
  title: string
  description: string | null
  department: string | null
  term: string | null
  external_url: string | null
  file_url: string | null
  size_bytes: number | null
  mime_type: string | null
  uploaded_at: string
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  type?: 'Document' | 'Video' | 'Presentation' | 'Tool' | 'Link'
  is_verified?: boolean
  tags?: string[]
  rating?: number
  download_count?: number
}

export default function ResourcesPage() {
  const [items, setItems] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [dept, setDept] = useState("All")
  const [term, setTerm] = useState("All")
  const [difficulty, setDifficulty] = useState("All")
  const [resourceType, setResourceType] = useState("All")
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
  const [currentSort, setCurrentSort] = useState("date-desc")
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    (async () => {
      try {
        // Use force-cache to reduce function invocations on Vercel free tier
        const res = await notifyFetch('/api/resources', { cache: 'force-cache' }, { errorMessage: 'Failed to load resources' })
        const j = await res.json()
        if (!res.ok) throw new Error(j?.error || 'Failed to load resources')
        setItems(j.data || [])
      } catch (e: any) {
        setError(e.message || 'Failed to load resources')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="min-h-screen relative">

      <main className="relative flex-1 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Resources" }]} className="mb-6" />
          
          {/* Enhanced Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card border border-white/20 dark:border-white/10 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur opacity-30 animate-pulse" />
                <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-full">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
              </div>
              Study Materials Hub
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              Learning{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
                Resources
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-8 font-medium leading-relaxed">
              Discover curated study materials, useful documents, and resources shared by departments and faculty members to enhance your learning journey.
            </p>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 group hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{items.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Resources</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 group hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{items.filter(r => r.is_verified).length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Verified</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 group hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600">
                    <Download className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{items.reduce((sum, r) => sum + (r.download_count || 0), 0)}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Downloads</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 group hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{(items.reduce((sum, r) => sum + (r.rating || 0), 0) / items.filter(r => r.rating).length || 0).toFixed(1)}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Avg Rating</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Search and Filters */}
          <AdvancedFilterBar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search resources by title, description, or tags..."
            selects={[
              {
                ...standardFilters.departments,
                value: dept,
                onChange: setDept,
                label: "Department",
                description: "Filter by academic department",
                options: useMemo(() => {
                  const values = Array.from(new Set(items.map((i) => i.department || "General"))).sort()
                  return [{ label: "All Departments", value: "All" }, ...values.map((v) => ({ label: v, value: v }))]
                }, [items])
              },
              {
                ...standardFilters.resourceTypes,
                value: resourceType,
                onChange: setResourceType,
                label: "Resource Type",
                description: "Filter by resource type",
                options: [...standardFilters.resourceTypes.options] as Array<{ label: string; value: string; description?: string }>
              },
              {
                ...standardFilters.difficulty,
                value: difficulty,
                onChange: setDifficulty,
                label: "Difficulty Level",
                description: "Filter by difficulty level",
                options: [...standardFilters.difficulty.options] as Array<{ label: string; value: string; description?: string }>
              },
              {
                id: "term",
                value: term,
                onChange: setTerm,
                placeholder: "All Terms",
                label: "Academic Term",
                description: "Filter by academic term",
                options: useMemo(() => {
                  const values = Array.from(new Set(items.map((i) => i.term || "Unspecified"))).sort()
                  return [{ label: "All Terms", value: "All" }, ...values.map((v) => ({ label: v, value: v }))]
                }, [items])
              }
            ]}
            sortOptions={sortOptions.resources}
            currentSort={currentSort}
            onSortChange={setCurrentSort}
            sortDirection={sortDirection}
            onSortDirectionChange={setSortDirection}
            filterPresets={[
              {
                id: 'verified-docs',
                name: 'Verified Documents',
                filters: { type: 'Document', verified: 'true' },
                description: 'Verified document resources'
              },
              {
                id: 'beginner-videos',
                name: 'Beginner Videos',
                filters: { type: 'Video', difficulty: 'Beginner' },
                description: 'Video tutorials for beginners'
              }
            ]}
            showActiveFilterCount={true}
            collapsible={true}
            defaultCollapsed={false}
            className="mb-10"
            right={
              <div className="flex items-center gap-4">
                {/* Verified Only Toggle */}
                <Button
                  variant={showVerifiedOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                  className="flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Verified Only
                </Button>
                
                {/* Quick Clear Filters */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch("")
                    setDept("All")
                    setTerm("All")
                    setDifficulty("All")
                    setResourceType("All")
                    setShowVerifiedOnly(false)
                  }}
                  className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear All
                </Button>
              </div>
            }
          />

          {loading && (
            <div aria-live="polite">
              <CenteredLoader message="Loading resources..." />
            </div>
          )}
          {error && <p className="text-blue-600" role="alert">{error}</p>}

          {(!loading && items.length === 0) ? (
            <Card className="p-12 text-center slide-up" aria-live="polite">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Resources Yet</h3>
              <p className="text-muted-foreground">Check back later.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" aria-live="polite">
              {useMemo(() => {
                const s = search.toLowerCase().trim()
                return items
                  .filter((r) =>
                    s
                      ? (r.title?.toLowerCase().includes(s) || (r.description || "").toLowerCase().includes(s))
                      : true,
                  )
                  .filter((r) => (dept === "All" ? true : (r.department || "General") === dept))
                  .filter((r) => (term === "All" ? true : (r.term || "Unspecified") === term))
                  .filter((r) => (difficulty === "All" ? true : r.difficulty === difficulty))
                  .filter((r) => (resourceType === "All" ? true : r.type === resourceType))
                  .filter((r) => (!showVerifiedOnly ? true : r.is_verified === true))
              }, [items, search, dept, term, difficulty, resourceType, showVerifiedOnly]).map((r, index) => (
                <Card key={r.id} className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 group hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl overflow-hidden" style={{ animationDelay: `${index * 100}ms` }}>
                  {/* Resource Header */}
                  <div className="relative p-6 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur opacity-30" />
                            <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg">
                              {r.type === 'Video' ? (
                                <Upload className="h-4 w-4 text-white" />
                              ) : r.type === 'Presentation' ? (
                                <FileText className="h-4 w-4 text-white" />
                              ) : (
                                <BookOpen className="h-4 w-4 text-white" />
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {r.is_verified && (
                              <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            {r.type && (
                              <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 text-xs">
                                {r.type}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                          {r.title}
                        </h2>
                      </div>
                      
                      {r.rating && (
                        <div className="flex items-center gap-1 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 px-2 py-1 rounded-lg">
                          <Star className="h-3 w-3 text-amber-500 fill-current" />
                          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">{r.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Resource Content */}
                  <div className="px-6 py-2 space-y-4">
                    {r.description && (
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
                          {r.description}
                        </p>
                      </div>
                    )}
                    
                    {/* Resource Meta */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{r.department || 'General'}</span>
                        {r.term && (
                          <>
                            <span>•</span>
                            <span>{r.term}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {r.download_count && (
                          <div className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            <span>{r.download_count}</span>
                          </div>
                        )}
                        <span>{new Date(r.uploaded_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-6 pt-4">
                    <div className="flex flex-wrap gap-3">
                      {r.external_url && (
                        <Button 
                          asChild 
                          size="sm" 
                          className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 hover:bg-white/70 dark:hover:bg-slate-700/70 flex-1 transition-all duration-300"
                        >
                          <a href={r.external_url} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" /> 
                            Open Link
                          </a>
                        </Button>
                      )}
                      {r.file_url && (
                        <>
                          <Button 
                            asChild 
                            variant="outline" 
                            size="sm" 
                            className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 flex-1 transition-all duration-300"
                          >
                            <a href={r.file_url} target="_blank" rel="noreferrer">
                              <BookOpen className="h-4 w-4 mr-2" /> 
                              Preview
                            </a>
                          </Button>
                          <Button 
                            asChild 
                            size="sm" 
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 flex-1"
                          >
                            <a href={r.file_url} download>
                              <Download className="h-4 w-4 mr-2" /> 
                              Download
                            </a>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
