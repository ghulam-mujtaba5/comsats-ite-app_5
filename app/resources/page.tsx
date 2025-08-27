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
        const res = await notifyFetch('/api/resources', { cache: 'no-store' }, { errorMessage: 'Failed to load resources' })
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Resources" }]} className="mb-6" />
          
          {/* Enhanced Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700/30 text-sm font-medium text-green-700 dark:text-green-300 mb-6">
              <BookOpen className="h-4 w-4" />
              Study Materials
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              Learning <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">Resources</span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-8 font-medium leading-relaxed">
              Download study materials, useful documents, and resources shared by departments and faculty members.
            </p>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-200/30 dark:border-green-700/30">
                  <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{items.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Resources</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-200/30 dark:border-blue-700/30">
                  <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{items.filter(r => r.is_verified).length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Verified</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-200/30 dark:border-purple-700/30">
                  <Download className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{items.reduce((sum, r) => sum + (r.download_count || 0), 0)}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Downloads</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-200/30 dark:border-orange-700/30">
                  <Star className="h-8 w-8 text-orange-600 dark:text-orange-400" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-live="polite">
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
              }, [items, search, dept, term, difficulty, resourceType, showVerifiedOnly]).map((r) => (
                <Card key={r.id} className="p-4 slide-up">
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold">{r.title}</h2>
                    {r.description && <p className="text-sm text-muted-foreground line-clamp-3">{r.description}</p>}
                    <p className="text-xs text-muted-foreground">
                      {(r.department || 'General')}{r.term ? ` • ${r.term}` : ''} • {new Date(r.uploaded_at).toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {r.external_url && (
                        <Button asChild variant="outline" size="sm" className="interactive hover-lift">
                          <a href={r.external_url} target="_blank" rel="noreferrer">
                            <ExternalLink className="size-4" /> Open Link
                          </a>
                        </Button>
                      )}
                      {r.file_url && (
                        <>
                          <Button asChild variant="secondary" size="sm" className="interactive hover-lift">
                            <a href={r.file_url} target="_blank" rel="noreferrer">
                              <BookOpen className="size-4" /> Preview
                            </a>
                          </Button>
                          <Button asChild variant="default" size="sm" className="interactive hover-lift">
                            <a href={r.file_url} download>
                              <Download className="size-4" /> Download
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
