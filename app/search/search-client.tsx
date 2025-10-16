"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Filter, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  FileText, 
  Users, 
  Star,
  ChevronRight,
  History,
  Zap,
  Target,
  Sparkles,
  Command,
  ArrowRight,
  Calendar,
  Download,
  ExternalLink,
  Globe,
  Hash,
  CheckCircle,
  AlertCircle
} from "lucide-react"
// Remove mock data imports - we'll use real API calls
interface LearningResource {
  id: string
  title: string
  description: string
  type: string
  department: string
  downloadUrl?: string
  metadata?: any
}

interface PastPaper {
  id: string
  title: string
  description: string
  courseCode: string
  department: string
  semester: string
  year: number
  examType: string
  fileType: string
  downloadUrl?: string
  metadata?: any
}

interface Faculty {
  id: string
  title: string
  description: string
  metadata?: {
    name: string
    title: string
    department: string
    email: string
    office: string
    specialization: string[]
    averageRating: number
    totalReviews: number
  }
}
import { cn } from "@/lib/utils"

export function SearchClient() {
  const router = useRouter()
  const params = useSearchParams()
  const [q, setQ] = useState<string>("")
  const [recent, setRecent] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'resources' | 'papers' | 'faculty'>('all')
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'name'>('relevance')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<{
    pastPapers: PastPaper[]
    resources: LearningResource[]
    faculty: Faculty[]
    community: any[]
    total: number
  }>({ pastPapers: [], resources: [], faculty: [], community: [], total: 0 })
  const [searchError, setSearchError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const suggestionsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const initial = params.get("q") || ""
    setQ(initial)
    if (!initial) {
      // autofocus when landing on /search without a query
      inputRef.current?.focus()
    }
  }, [params])

  // Debounced URL sync while typing to preserve shareable/back-forward state
  useEffect(() => {
    const current = params.get("q") || ""
    if (q === current) return
    const h = setTimeout(() => {
      const next = q.trim()
      router.replace(next ? `/search?q=${encodeURIComponent(next)}` : "/search")
    }, 300)
    return () => clearTimeout(h)
  }, [q, params, router])

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("recentSearches")
      if (raw) {
        const parsed = JSON.parse(raw) as string[]
        if (Array.isArray(parsed)) setRecent(parsed.slice(0, 8))
      }
    } catch {}
  }, [])

  // API search function
  const performSearch = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults({ pastPapers: [], resources: [], faculty: [], community: [], total: 0 })
      setSearchError(null)
      return
    }

    setIsSearching(true)
    setSearchError(null)

    try {
      const searchParams = new URLSearchParams({
        q: query.trim(),
        type: activeTab === 'all' ? 'all' : activeTab === 'papers' ? 'past_papers' : activeTab,
        limit: '20'
      })

      const response = await fetch(`/api/search?${searchParams}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Search failed')
      }

      // Transform API response to match our interface
      const transformedResults = {
        pastPapers: result.data.pastPapers.map((paper: any) => ({
          id: paper.id,
          title: paper.title,
          description: paper.description,
          courseCode: paper.metadata.courseCode,
          department: paper.metadata.department,
          semester: paper.metadata.semester,
          year: paper.metadata.year,
          examType: paper.metadata.examType,
          fileType: paper.metadata.fileType,
          downloadUrl: paper.downloadUrl,
          metadata: paper.metadata
        })),
        resources: result.data.resources.map((resource: any) => ({
          id: resource.id,
          title: resource.title,
          description: resource.description,
          type: resource.metadata.fileType || 'Resource',
          department: resource.metadata.department,
          downloadUrl: resource.downloadUrl,
          metadata: resource.metadata
        })),
        faculty: result.data.faculty.map((member: any) => ({
          id: member.id,
          title: member.title,
          description: member.description,
          metadata: member.metadata
        })),
        community: result.data.community || [],
        total: result.data.total
      }

      setSearchResults(transformedResults)
    } catch (error: any) {
      console.error('Search error:', error)
      setSearchError(error.message || 'Search failed')
      setSearchResults({ pastPapers: [], resources: [], faculty: [], community: [], total: 0 })
    } finally {
      setIsSearching(false)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K focuses the search box
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
      // Pressing '/' focuses the search when not typing in an input/textarea/select
      if (e.key === "/") {
        const target = e.target as HTMLElement
        const tag = target?.tagName?.toLowerCase()
        const isTyping = tag === "input" || tag === "textarea" || tag === "select" || target?.isContentEditable
        if (!isTyping) {
          e.preventDefault()
          inputRef.current?.focus()
        }
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  // Trigger search when query changes
  useEffect(() => {
    const currentQuery = params.get("q") || ""
    if (currentQuery !== q) return
    
    const timer = setTimeout(() => {
      performSearch(currentQuery)
    }, 300) // Debounce search
    
    return () => clearTimeout(timer)
  }, [q, activeTab, params])
  const popularSuggestions = [
    "Data Structures", "Machine Learning", "Database Systems", "Web Development",
    "Algorithms", "Software Engineering", "Computer Networks", "Operating Systems",
    "Artificial Intelligence", "Mobile App Development", "Cloud Computing", "Cybersecurity"
  ]

  // Generate suggestions based on current query
  useEffect(() => {
    if (q.length > 0) {
      const filtered = popularSuggestions
        .filter(s => s.toLowerCase().includes(q.toLowerCase()))
        .slice(0, 6)
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [q])

  // Enhanced search submission with analytics
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const next = q.trim()
    
    router.replace(next ? `/search?q=${encodeURIComponent(next)}` : "/search")
    setShowSuggestions(false)
    
    if (next) {
      // Trigger search immediately
      performSearch(next)
      
      // Persist to recent searches (dedupe, keep last 8)
      setRecent((prev) => {
        const updated = [next, ...prev.filter((x) => x.toLowerCase() !== next.toLowerCase())].slice(0, 8)
        try {
          localStorage.setItem("recentSearches", JSON.stringify(updated))
        } catch {}
        return updated
      })
    }
  }

  const selectSuggestion = (suggestion: string) => {
    setQ(suggestion)
    setShowSuggestions(false)
    router.replace(`/search?q=${encodeURIComponent(suggestion)}`)
    performSearch(suggestion) // Trigger search immediately
  }

  return (
    <div className="min-h-screen bg-mesh overflow-hidden relative">
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

      <main className="container mx-auto max-w-6xl px-4 py-24 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary mb-6 hover:from-primary/20 hover:to-blue-500/20 transition-all duration-300 hover-lift">
            <Search className="h-4 w-4" />
            Universal Search
          </div>
          <h1 className="text-5xl lg:text-8xl font-bold leading-[0.9] text-balance mb-6">
            Find{" "}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Anything
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-serif max-w-4xl mx-auto mb-4">
            Search across past papers, learning resources, faculty profiles, and community discussions 
            with our intelligent search engine.
          </p>
          <p className="text-lg text-muted-foreground/80 font-light max-w-xl mx-auto">
            Powered by advanced AI for instant, relevant results
          </p>
        </div>

        {/* Enhanced Search Interface */}
        <Card className="mb-8 bg-white/90 dark:bg-slate-800/90 shadow-xl transition-all duration-500">
          <CardContent className="p-8">
            <form onSubmit={onSubmit} className="relative">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground/70" />
                <Command className="absolute right-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
                <Input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => setShowSuggestions(suggestions.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search for anything... (Ctrl+K or /)"
                  className="pl-16 pr-16 h-20 glass-input glass-interactive glass-border-light focus:border-primary/50 rounded-2xl text-xl font-medium focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  disabled={isSearching}
                />
                
                {/* Enhanced Search Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div 
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 mt-3 glass-modal glass-border-light glass-noise z-50 max-h-60 overflow-y-auto rounded-2xl"
                  >
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectSuggestion(suggestion)}
                        className="w-full px-6 py-4 text-left hover:bg-primary/10 transition-all duration-200 flex items-center gap-4 first:rounded-t-2xl last:rounded-b-2xl group"
                      >
                        <div className="p-2 rounded-xl bg-gradient-to-br from-muted/80 to-muted/40 group-hover:scale-110 transition-transform duration-200">
                          <Search className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground flex-1">{suggestion}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Enhanced Search Controls */}
              <div className="flex items-center justify-between mt-8">
                <div className="flex items-center gap-6">
                  <Button
                    type="submit"
                    disabled={isSearching}
                    className="text-lg px-10 py-4 rounded-2xl button-modern bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300 group h-14"
                  >
                    {isSearching ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Searching...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        Search
                      </div>
                    )}
                  </Button>
                  
                  {/* Enhanced Sort Options */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground font-medium">Sort by:</span>
                    <div className="flex items-center gap-1 p-1 bg-muted/50 backdrop-blur-sm rounded-xl border border-border/30">
                      {[
                        { value: 'relevance', label: 'Relevance', icon: Target },
                        { value: 'date', label: 'Date', icon: Calendar },
                        { value: 'name', label: 'Name', icon: Hash }
                      ].map(({ value, label, icon: Icon }) => (
                        <Button
                          key={value}
                          type="button"
                          variant={sortBy === value ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setSortBy(value as any)}
                          className={cn(
                            "h-9 px-4 rounded-lg transition-all duration-200 font-medium",
                            sortBy === value 
                              ? "bg-primary text-primary-foreground shadow-md" 
                              : "hover:bg-primary/10"
                          )}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Quick Stats */}
                {q && (
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200/30">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Instant search</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200/30">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">AI-powered</span>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Enhanced Recent Searches */}
        {recent.length > 0 && !q && (
          <Card className="mb-8 glass-card glass-border-light glass-hover rounded-2xl transition-all duration-300">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-200/30">
                    <History className="h-5 w-5 text-purple-600" />
                  </div>
                  Recent Searches
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setRecent([])
                    try {
                      localStorage.removeItem("recentSearches")
                    } catch {}
                  }}
                  className="text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/50 transition-all duration-200"
                >
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="flex flex-wrap gap-3">
                {recent.map((item, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setQ(item)
                      router.replace(`/search?q=${encodeURIComponent(item)}`)
                    }}
                    className="glass-input glass-interactive glass-border-subtle rounded-xl transition-all duration-200 group hover-lift"
                  >
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                    {item}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Popular Suggestions */}
        {!q && (
          <Card className="mb-8 glass-card glass-border-light glass-hover rounded-2xl transition-all duration-300">
            <CardHeader className="p-6">
              <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-200/30">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                Popular Searches
              </CardTitle>
              <CardDescription className="text-muted-foreground font-serif text-base mt-2">
                Discover what other students are searching for
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {popularSuggestions.slice(0, 8).map((suggestion, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    onClick={() => selectSuggestion(suggestion)}
                    className="glass-input glass-interactive glass-border-subtle rounded-xl transition-all duration-200 justify-start h-14 group hover-lift"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 mr-3 group-hover:scale-110 transition-transform duration-200">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">{suggestion}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        <SearchResults 
          query={q} 
          activeTab={activeTab} 
          sortBy={sortBy} 
          searchResults={searchResults}
          isSearching={isSearching}
          searchError={searchError}
        />
      </main>
    </div>
  )
}

function highlight(text: string, query: string) {
  if (!text || !query) return text
  try {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const regex = new RegExp(`(${escaped})`, "ig")
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200/60 dark:bg-yellow-300/30 rounded px-0.5">{part}</mark>
      ) : (
        <span key={i}>{part}</span>
      ),
    )
  } catch {
    return text
  }
}

function SearchResults({ 
  query, 
  activeTab, 
  sortBy, 
  searchResults, 
  isSearching, 
  searchError 
}: { 
  query: string
  activeTab: 'all' | 'resources' | 'papers' | 'faculty'
  sortBy: 'relevance' | 'date' | 'name'
  searchResults: {
    pastPapers: PastPaper[]
    resources: LearningResource[]
    faculty: Faculty[]
    community: any[]
    total: number
  }
  isSearching: boolean
  searchError: string | null
}) {
  const q = query.trim()

  if (!q) return null

  // Show loading state
  if (isSearching) {
    return (
      <section className="mt-8 fade-in" aria-live="polite">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-lg font-medium text-muted-foreground">Searching...</span>
          </div>
        </div>
      </section>
    )
  }

  // Show error state
  if (searchError) {
    return (
      <section className="mt-8 fade-in" aria-live="polite">
        <Card className="glass-card glass-border-light rounded-2xl border-red-200/50">
          <CardContent className="p-8 text-center">
            <div className="text-red-600 mb-4">
              <AlertCircle className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Search Error</h3>
            <p className="text-red-600 mb-4">{searchError}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="border-red-200 hover:bg-red-50"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </section>
    )
  }

  const { pastPapers: paperResults, resources: resourceResults, faculty: facultyResults, total } = searchResults

  return (
    <section className="mt-8 fade-in" aria-live="polite">
      <h2 className="text-lg font-semibold">Results for "{q}"</h2>
      <p className="text-xs text-muted-foreground mt-1">{total} total result{total === 1 ? "" : "s"}</p>
      {total === 0 ? (
        <div className="text-muted-foreground mt-2">
          <p>No results. Try a different term, e.g.:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "C++",
              "Data Structures",
              "Database",
              "Circuit",
              "Accounting",
              "Machine Learning",
            ].map((ex) => (
              <Link
                key={ex}
                href={`/search?q=${encodeURIComponent(ex)}`}
                className="text-xs rounded border px-2 py-1 hover:bg-muted"
                aria-label={`Search for ${ex}`}
              >
                {ex}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-8">
          {resourceResults.length > 0 && (
            <ResultGroup
              title="Learning Resources"
              count={resourceResults.length}
              viewAllHref="/resources"
              viewAllAriaLabel={`View all learning resources matching ${q}`}
            >
              <ul className="space-y-2">
                {resourceResults.slice(0, 5).map((r) => (
                  <li key={r.id} className="rounded-md border p-3 interactive hover-lift">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium">
                        <Link href={r.downloadUrl || "/resources"} className="hover:underline" aria-label={`Open ${r.title}`}>
                          {highlight(r.title, q)}
                        </Link>
                      </div>
                      <span className="text-xs text-muted-foreground">{r.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{highlight(r.description, q)}</p>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {r.department} • {r.metadata?.term || 'N/A'}
                    </div>
                  </li>
                ))}
              </ul>
            </ResultGroup>
          )}

          {paperResults.length > 0 && (
            <ResultGroup
              title="Past Papers"
              count={paperResults.length}
              viewAllHref="/past-papers"
              viewAllAriaLabel={`View all past papers matching ${q}`}
            >
              <ul className="space-y-2">
                {paperResults.slice(0, 5).map((p) => (
                  <li key={p.id} className="rounded-md border p-3 interactive hover-lift">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium">
                        <Link href={p.downloadUrl || "/past-papers"} className="hover:underline" aria-label={`Open ${p.title}`}>
                          {highlight(p.title, q)}
                        </Link>
                      </div>
                      <span className="text-xs text-muted-foreground">{p.examType}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {highlight(p.description, q)} • {p.department}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">Year {p.year} • {p.fileType}</div>
                  </li>
                ))}
              </ul>
            </ResultGroup>
          )}

          {facultyResults.length > 0 && (
            <ResultGroup
              title="Faculty"
              count={facultyResults.length}
              viewAllHref="/faculty"
              viewAllAriaLabel={`View all faculty matching ${q}`}
            >
              <ul className="space-y-2">
                {facultyResults.slice(0, 5).map((f) => (
                  <li key={f.id} className="rounded-md border p-3 interactive hover-lift">
                    <div className="font-medium">
                      <Link href={`/faculty/${f.id}`} className="hover:underline" aria-label={`View ${f.title} profile`}>
                        {highlight(f.title, q)}
                      </Link>
                    </div>
                    <div className="text-sm text-muted-foreground">{highlight(f.description, q)}</div>
                    {f.metadata?.specialization && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        Specializations: {highlight(f.metadata.specialization.slice(0, 3).join(", "), q)}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </ResultGroup>
          )}
        </div>
      )}
    </section>
  )
}

function ResultGroup({
  title,
  count,
  viewAllAriaLabel,
  viewAllHref,
  children,
  icon: Icon,
  color,
  bgColor,
  borderColor,
}: {
  title: string
  count: number
  viewAllAriaLabel?: string
  viewAllHref?: string
  children: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  color?: string
  bgColor?: string
  borderColor?: string
}) {
  return (
    <div className="animate-slide-up">
      <Card className="card-modern border-0 backdrop-blur-sm">
        <CardHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              {Icon && (
                <div className={cn(
                  "p-3 rounded-2xl bg-gradient-to-br border",
                  bgColor || "from-muted/80 to-muted/40",
                  borderColor || "border-border/30"
                )}>
                  <Icon className={cn("h-5 w-5", color || "text-primary")} />
                </div>
              )}
              {title}
            </CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm font-medium">
                {count} result{count === 1 ? "" : "s"}
              </Badge>
              {viewAllHref && (
                <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80 hover:bg-primary/10 rounded-xl transition-all duration-200">
                  <Link href={viewAllHref} aria-label={viewAllAriaLabel}>
                    View all
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {children}
        </CardContent>
      </Card>
    </div>
  )
}
