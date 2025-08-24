"use client"

import { jsonLdBreadcrumb } from "@/lib/seo"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Upload, ExternalLink, Download } from "lucide-react"
import { AdvancedFilterBar, type Option } from "@/components/search/advanced-filter-bar"
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
}

export default function ResourcesPage() {
  const [items, setItems] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [dept, setDept] = useState("All")
  const [term, setTerm] = useState("All")

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
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Resources" }]} className="mb-4" />
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Resources</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Download study material and useful documents shared by the department.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <AdvancedFilterBar
              searchPlaceholder="Search resources..."
              search={search}
              onSearchChange={setSearch}
              selects={[
                {
                  id: "dept",
                  value: dept,
                  onChange: setDept,
                  placeholder: "All Departments",
                  options: useMemo<Option[]>(() => {
                    const values = Array.from(new Set(items.map((i) => i.department || "General"))).sort()
                    return [{ label: "All Departments", value: "All" }, ...values.map((v) => ({ label: v, value: v }))]
                  }, [items]),
                },
                {
                  id: "term",
                  value: term,
                  onChange: setTerm,
                  placeholder: "All Terms",
                  options: useMemo<Option[]>(() => {
                    const values = Array.from(new Set(items.map((i) => i.term || "Unspecified"))).sort()
                    return [{ label: "All Terms", value: "All" }, ...values.map((v) => ({ label: v, value: v }))]
                  }, [items]),
                },
              ]}
            />
          </div>

          {loading && (
            <div aria-live="polite">
              <CenteredLoader message="Loading resources..." />
            </div>
          )}
          {error && <p className="text-blue-600" role="alert">{error}</p>}

          {(!loading && items.length === 0) ? (
            <Card className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Resources Yet</h3>
              <p className="text-muted-foreground">Check back later.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              }, [items, search, dept, term]).map((r) => (
                <Card key={r.id} className="p-4">
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold">{r.title}</h2>
                    {r.description && <p className="text-sm text-muted-foreground line-clamp-3">{r.description}</p>}
                    <p className="text-xs text-muted-foreground">
                      {(r.department || 'General')}{r.term ? ` • ${r.term}` : ''} • {new Date(r.uploaded_at).toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {r.external_url && (
                        <Button asChild variant="outline" size="sm" className="transition-all hover:-translate-y-0.5">
                          <a href={r.external_url} target="_blank" rel="noreferrer">
                            <ExternalLink className="size-4" /> Open Link
                          </a>
                        </Button>
                      )}
                      {r.file_url && (
                        <>
                          <Button asChild variant="secondary" size="sm" className="transition-all hover:-translate-y-0.5">
                            <a href={r.file_url} target="_blank" rel="noreferrer">
                              <BookOpen className="size-4" /> Preview
                            </a>
                          </Button>
                          <Button asChild variant="default" size="sm" className="transition-all hover:-translate-y-0.5">
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: "Home", path: "/" }, { name: "Resources", path: "/resources" }])) }}
      />
    </div>
  )
}
