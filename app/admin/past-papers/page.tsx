"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PastPaper {
  id: string
  title?: string | null
  course_code?: string | null
  semester?: string | null
  year?: number | null
  file_url?: string | null
  status?: string | null
  created_at?: string | null
  [key: string]: any
}

export default function PastPapersModerationPage() {
  const [items, setItems] = useState<PastPaper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState("pending")

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/past-papers?status=${encodeURIComponent(statusFilter)}`, { cache: "no-store" })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || "Failed to load")
      setItems(j.data || [])
    } catch (e: any) {
      setError(e.message || "Failed to load")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [statusFilter])

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/past-papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'Failed to update')
      await load()
    } catch (e) {
      alert((e as any).message || 'Failed')
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this past paper?')) return
    try {
      const res = await fetch(`/api/admin/past-papers?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'Failed to delete')
      await load()
    } catch (e) {
      alert((e as any).message || 'Failed')
    }
  }

  return (
    <AdminGuard fallback={<div className="p-6 text-center">Admin access required.</div>}>
      <div className="app-container section space-y-6">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Past Papers Moderation</CardTitle>
            <CardDescription>Approve or reject submitted past papers.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">Filter and refresh submissions</div>
              <div className="flex items-center gap-2">
                <select
                  className="border rounded px-2 py-1 bg-background"
                  aria-label="Filter by status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <Button variant="secondary" onClick={load}>Refresh</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Submissions {items.length ? `(${items.length})` : ''}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <div className="py-8">Loading…</div>}
            {error && <div className="text-destructive">{error}</div>}

            {!loading && items.length === 0 ? (
              <Card variant="soft" className="p-8 text-center">
                <div className="text-muted-foreground">No items found.</div>
              </Card>
            ) : (
              <div className="grid gap-4">
                {items.map((p) => (
                  <Card key={p.id} variant="elevated" className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="space-y-1">
                        <div className="font-medium">{p.title || p.course_code || 'Untitled'}</div>
                        <div className="text-sm text-muted-foreground">
                          {p.course_code ? `${p.course_code} · ` : ''}
                          {p.semester ? `${p.semester} · ` : ''}
                          {p.year ? `${p.year}` : ''}
                        </div>
                        {p.file_url && (
                          <Link href={p.file_url} target="_blank" className="text-sm text-primary underline">View file</Link>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => updateStatus(p.id, 'approved')}>Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => updateStatus(p.id, 'rejected')}>Reject</Button>
                        <Button size="sm" variant="secondary" onClick={() => remove(p.id)}>Delete</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminGuard>
  )
}
