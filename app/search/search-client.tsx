"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
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

function SearchResults({ query }: { query: string }) {
  const q = query.trim()

  // basic scoring: title matches > other fields
  const scoreText = (text: string, term: string) => {
    if (!text) return 0
    const t = term.toLowerCase()
    const s = text.toLowerCase()
    const idx = s.indexOf(t)
    if (idx === -1) return 0
    // proximity to start boosts score; multiple occurrences add small bonus
    const occurrences = s.split(t).length - 1
    let score = 100 - idx + occurrences * 5
    // word-boundary boost
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
    <section className="mt-8" aria-live="polite">
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
                  <li key={r.id} className="rounded-md border p-3">
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
                  <li key={p.id} className="rounded-md border p-3">
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
                  <li key={f.id} className="rounded-md border p-3">
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
    <div>
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
