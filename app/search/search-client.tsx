"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function SearchClient() {
  const router = useRouter()
  const params = useSearchParams()
  const [q, setQ] = useState<string>("")
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const initial = params.get("q") || ""
    setQ(initial)
    if (!initial) {
      // autofocus when landing on /search without a query
      inputRef.current?.focus()
    }
  }, [params])

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

      {q && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Results for “{q}”</h2>
          <p className="text-muted-foreground">Integrate your search backend to display results here.</p>
        </section>
      )}
    </main>
  )
}
