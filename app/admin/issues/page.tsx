"use client"

import { useEffect, useState } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { notifyFetch } from "@/lib/notify"

type Issue = {
  id: string
  title: string
  description: string
  category: string
  email: string | null
  status: "open" | "in_progress" | "resolved"
  created_at: string
}

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await notifyFetch('/api/issues', undefined, { errorMessage: 'Failed to load issues' })
      if (res.ok) {
        const j = await res.json()
        setIssues(j.issues || [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const setStatus = async (id: string, status: Issue['status']) => {
    const res = await notifyFetch(`/api/issues/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }, { errorMessage: 'Failed to update status', successMessage: 'Status updated', showOnSuccess: true })
    if (res.ok) load()
  }

  return (
    <AdminGuard fallback={<div className="p-6">Unauthorized</div>}>
      <div
        className="app-container section space-y-6"
        role="main"
        aria-labelledby="issues-heading"
        aria-busy={loading ? true : undefined}
     >
        <h1 id="issues-heading" className="text-2xl font-bold">Issue Reports</h1>
        {loading ? (
          <div aria-live="polite">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {issues.map((it) => (
              <Card key={it.id} variant="elevated">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{it.title}</CardTitle>
                    <div className="text-sm text-muted-foreground">{new Date(it.created_at).toLocaleString()} • {it.category}</div>
                  </div>
                  <Badge variant={it.status === 'resolved' ? 'secondary' : it.status === 'in_progress' ? 'default' : 'outline'}>
                    {it.status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="whitespace-pre-wrap text-sm">{it.description}</p>
                  {it.email && (
                    <div className="text-sm text-muted-foreground">Reporter: {it.email}</div>
                  )}
                  <div className="flex items-center gap-2">
                    <Select value={it.status} onValueChange={(v) => setStatus(it.id, v as Issue['status'])}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => setStatus(it.id, 'resolved')}>Mark Resolved</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {issues.length === 0 && (
              <Card variant="soft" className="p-8 text-center">
                <div className="text-muted-foreground">No issues yet.</div>
              </Card>
            )}
          </div>
        )}
      </div>
    </AdminGuard>
  )
}
