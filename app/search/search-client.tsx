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
  Hash
} from "lucide-react"
import {
  mockLearningResources,
  filterResources,
  type LearningResource,
} from "@/lib/resources-data"
import { mockPastPapers, filterPapers, type PastPaper } from "@/lib/past-papers-data"
import { mockFaculty, searchFaculty, type Faculty } from "@/lib/faculty-data"
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

  // Enhanced suggestions based on popular searches
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
    setIsSearching(true)
    
    router.replace(next ? `/search?q=${encodeURIComponent(next)}` : "/search")
    setShowSuggestions(false)
    
    if (next) {
      // Persist to recent searches (dedupe, keep last 8)
      setRecent((prev) => {
        const updated = [next, ...prev.filter((x) => x.toLowerCase() !== next.toLowerCase())].slice(0, 8)
        try {
          localStorage.setItem("recentSearches", JSON.stringify(updated))
        } catch {}
        return updated
      })
    }
    
    setTimeout(() => setIsSearching(false), 500)
  }

  const selectSuggestion = (suggestion: string) => {
    setQ(suggestion)
    setShowSuggestions(false)
    router.replace(`/search?q=${encodeURIComponent(suggestion)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <main className="container mx-auto max-w-6xl px-4 py-12">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            <Search className="h-4 w-4" />
            Universal Search
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            Find <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Anything</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 font-medium leading-relaxed">
            Search across past papers, learning resources, faculty profiles, and community discussions
          </p>
        </div>

        {/* Enhanced Search Interface */}
        <Card className="mb-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-3xl shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={onSubmit} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" />
                <Command className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => setShowSuggestions(suggestions.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search for anything... (Ctrl+K or /)"
                  className="pl-12 pr-12 h-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/30 dark:border-slate-700/30 rounded-2xl text-lg focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  disabled={isSearching}
                />
                
                {/* Search Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div 
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-white/20 dark:border-slate-700/30 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto"
                  >
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectSuggestion(suggestion)}
                        className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors duration-200 flex items-center gap-3 first:rounded-t-2xl last:rounded-b-2xl"
                      >
                        <Search className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-900 dark:text-white">{suggestion}</span>
                        <ArrowRight className="h-4 w-4 text-slate-400 ml-auto" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Search Controls */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-4">
                  <Button
                    type="submit"
                    disabled={isSearching}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-8 h-12"
                  >
                    {isSearching ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Searching...
                      </div>
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                  
                  {/* Sort Options */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Sort by:</span>
                    <div className="flex items-center gap-1 p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl">
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
                          className="h-8 px-3 rounded-lg transition-all duration-200"
                        >
                          <Icon className="h-3 w-3 mr-1" />
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats */}
                {q && (
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Instant search</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      <span>AI-powered</span>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Recent Searches */}
        {recent.length > 0 && !q && (
          <Card className="mb-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-3xl shadow-lg">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-200/30">
                    <History className="h-5 w-5 text-purple-600 dark:text-purple-400" />
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
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl"
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
                    className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/30 dark:border-slate-700/30 hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all duration-200"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {item}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Popular Suggestions when no query */}
        {!q && (
          <Card className="mb-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-3xl shadow-lg">
            <CardHeader className="p-6">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-200/30">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                Popular Searches
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300 font-medium">
                Discover what other students are searching for
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {popularSuggestions.slice(0, 8).map((suggestion, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    onClick={() => selectSuggestion(suggestion)}
                    className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/30 dark:border-slate-700/30 hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all duration-200 justify-start h-12"
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-primary" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        <SearchResults query={q} activeTab={activeTab} sortBy={sortBy} />
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

function SearchResults({ query, activeTab, sortBy }: { 
  query: string
  activeTab: 'all' | 'resources' | 'papers' | 'faculty'
  sortBy: 'relevance' | 'date' | 'name'
}) {
  const q = query.trim()

  // Enhanced scoring with multiple factors
  const scoreText = (text: string, term: string, isTitle = false) => {
    if (!text) return 0
    const t = term.toLowerCase()
    const s = text.toLowerCase()
    const idx = s.indexOf(t)
    if (idx === -1) return 0
    
    const occurrences = s.split(t).length - 1
    let score = 100 - idx + occurrences * 5
    
    // Title matches get higher score
    if (isTitle) score *= 1.5
    
    // Word boundary boost
    try {
      const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const wb = new RegExp(`\\b${escaped}\\b`, "i")
      if (wb.test(text)) score += 50
    } catch {}
    
    return score
  }

  const resourceResults = useMemo<LearningResource[]>(() => {
    if (!q) return []
    const filtered = filterResources(mockLearningResources, { search: q })
    return filtered
      .slice()
      .sort(
        (a, b) =>
          (scoreText(b.title, q) + scoreText(b.description, q)) -
          (scoreText(a.title, q) + scoreText(a.description, q)),
      )
  }, [q])

  const paperResults = useMemo<PastPaper[]>(() => {
    if (!q) return []
    const filtered = filterPapers(mockPastPapers, { search: q })
    return filtered
      .slice()
      .sort(
        (a, b) =>
          (scoreText(b.title, q) + scoreText(b.course, q) + scoreText(b.courseCode, q)) -
          (scoreText(a.title, q) + scoreText(a.course, q) + scoreText(a.courseCode, q)),
      )
  }, [q])

  const facultyResults = useMemo<Faculty[]>(() => {
    if (!q) return []
    const filtered = searchFaculty(mockFaculty, q)
    return filtered
      .slice()
      .sort(
        (a, b) =>
          (scoreText(b.name, q) + scoreText(b.department, q)) -
          (scoreText(a.name, q) + scoreText(a.department, q)),
      )
  }, [q])

  const total = resourceResults.length + paperResults.length + facultyResults.length

  if (!q) return null

  return (
    <section className="mt-8 fade-in" aria-live="polite">
      <h2 className="text-lg font-semibold">Results for “{q}”</h2>
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
                      {highlight(r.course, q)} • {r.department} • {r.difficulty}
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
                      {highlight(p.course, q)} ({highlight(p.courseCode, q)}) • {p.department} • {p.semester}
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
                      <Link href="/faculty" className="hover:underline" aria-label={`Open faculty list for ${f.department}`}>
                        {highlight(f.name, q)}
                      </Link>
                    </div>
                    <div className="text-sm text-muted-foreground">{f.title} • {f.department}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Specializations: {highlight(f.specialization.slice(0, 3).join(", "), q)}
                    </div>
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
}: {
  title: string
  count: number
  viewAllAriaLabel?: string
  viewAllHref?: string
  children: React.ReactNode
}) {
  return (
    <div className="slide-up">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold">{title}</h3>
        <div className="flex items-center gap-3">
          <div className="text-xs text-muted-foreground">{count} result{count === 1 ? "" : "s"}</div>
          {viewAllHref && (
            <Link href={viewAllHref} className="text-xs text-primary hover:underline" aria-label={viewAllAriaLabel}>
              View all
            </Link>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}
