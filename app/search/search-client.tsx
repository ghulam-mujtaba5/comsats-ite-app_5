"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import {
  mockLearningResources,
  filterResources,
  type LearningResource,
} from "@/lib/resources-data"
import { mockPastPapers, filterPapers, type PastPaper } from "@/lib/past-papers-data"
import { mockFaculty, searchFaculty, type Faculty } from "@/lib/faculty-data"

export function SearchClient() {
  const router = useRouter()
  const params = useSearchParams()
  const [q, setQ] = useState<string>("")
  const [recent, setRecent] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const initial = params.get("q") || ""
    setQ(initial)
    if (!initial) {
      // autofocus when landing on /search without a query
      inputRef.current?.focus()
    }
  }, [params])

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const next = q.trim()
    router.replace(next ? `/search?q=${encodeURIComponent(next)}` : "/search")
    // TODO: hook into your actual search backend or client filtering
    if (next) {
      // persist to recent searches (dedupe, keep last 8)
      setRecent((prev) => {
        const updated = [next, ...prev.filter((x) => x.toLowerCase() !== next.toLowerCase())].slice(0, 8)
        try {
          localStorage.setItem("recentSearches", JSON.stringify(updated))
        } catch {}
        return updated
      })
    }
  }

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Search</h1>
      <p className="text-muted-foreground mb-6">Find past papers, resources, faculty reviews, and more.</p>

      <form onSubmit={onSubmit} className="flex gap-2" role="search" aria-label="Site search">
        <Input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search CampusAxis..."
          aria-label="Search CampusAxis"
          title="Search (Ctrl/⌘ K or /)"
          aria-keyshortcuts="Control+K Meta+K /"
        />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>

      {recent.length > 0 && (
        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">Recent searches</div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => {
                setRecent([])
                try {
                  localStorage.removeItem("recentSearches")
                } catch {}
              }}
              aria-label="Clear recent searches"
            >
              Clear
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recent.map((item) => (
              <Button
                key={item}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setQ(item)
                  router.replace(`/search?q=${encodeURIComponent(item)}`)
                }}
                aria-label={`Search for ${item}`}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <SearchResults query={q} />
    </main>
  )
}

function SearchResults({ query }: { query: string }) {
  const q = query.trim()

  const resourceResults = useMemo<LearningResource[]>(() => {
    if (!q) return []
    return filterResources(mockLearningResources, { search: q })
  }, [q])

  const paperResults = useMemo<PastPaper[]>(() => {
    if (!q) return []
    return filterPapers(mockPastPapers, { search: q })
  }, [q])

  const facultyResults = useMemo<Faculty[]>(() => {
    if (!q) return []
    return searchFaculty(mockFaculty, q)
  }, [q])

  const total = resourceResults.length + paperResults.length + facultyResults.length

  if (!q) return null

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">Results for “{q}”</h2>
      {total === 0 ? (
        <p className="text-muted-foreground mt-2">No results. Try a different term.</p>
      ) : (
        <div className="mt-4 space-y-8">
          {resourceResults.length > 0 && (
            <ResultGroup title="Learning Resources" count={resourceResults.length}>
              <ul className="space-y-2">
                {resourceResults.slice(0, 5).map((r) => (
                  <li key={r.id} className="rounded-md border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium">{r.title}</div>
                      <span className="text-xs text-muted-foreground">{r.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {r.course} • {r.department} • {r.difficulty}
                    </div>
                  </li>
                ))}
              </ul>
            </ResultGroup>
          )}

          {paperResults.length > 0 && (
            <ResultGroup title="Past Papers" count={paperResults.length}>
              <ul className="space-y-2">
                {paperResults.slice(0, 5).map((p) => (
                  <li key={p.id} className="rounded-md border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium">{p.title}</div>
                      <span className="text-xs text-muted-foreground">{p.examType}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {p.course} ({p.courseCode}) • {p.department} • {p.semester}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">Year {p.year} • {p.fileType}</div>
                  </li>
                ))}
              </ul>
            </ResultGroup>
          )}

          {facultyResults.length > 0 && (
            <ResultGroup title="Faculty" count={facultyResults.length}>
              <ul className="space-y-2">
                {facultyResults.slice(0, 5).map((f) => (
                  <li key={f.id} className="rounded-md border p-3">
                    <div className="font-medium">{f.name}</div>
                    <div className="text-sm text-muted-foreground">{f.title} • {f.department}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Specializations: {f.specialization.slice(0, 3).join(", ")}
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
  children,
}: {
  title: string
  count: number
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold">{title}</h3>
        <div className="text-xs text-muted-foreground">{count} result{count === 1 ? "" : "s"}</div>
      </div>
      {children}
    </div>
  )
}
