"use client"

import { useEffect, useState } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"



interface ReviewRow {
  id: string
  faculty_id: string
  student_name: string | null
  course: string
  semester: string
  rating: number
  teaching_quality: number
  accessibility: number
  course_material: number
  grading: number
  comment: string
  pros?: string[]
  cons?: string[]
  would_recommend?: boolean
  is_anonymous?: boolean
  created_at?: string
  status?: string
}

export default function AdminReviewsPage() {
  const [rows, setRows] = useState<ReviewRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<'pending'|'approved'|'rejected'>('pending')

  const fetchRows = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/admin/moderation/reviews?status=${statusFilter}`, { cache: 'no-store' })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'Failed to load')
      setRows(j.data || [])
    } catch (e: any) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRows()
  }, [statusFilter])

  const setStatus = async (id: string, status: 'approved'|'rejected'|'pending') => {
    try {
      const res = await fetch('/api/admin/moderation/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j?.error || 'Failed to update')
    } catch (e: any) {
      setError(e.message || 'Failed to update')
      return
    }
    fetchRows()
  }

  return (
    <AdminGuard fallback={<div className="p-6 text-center">Admin access required. <a className="underline" href="/admin/login">Login</a></div>}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Review Moderation</h1>
          <div className="flex items-center gap-2">
            <select
              className="border rounded px-2 py-1 bg-background"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <Button variant="secondary" onClick={fetchRows}>Refresh</Button>
          </div>
        </div>
        <p className="text-muted-foreground">Approve or reject reviews submitted by students.</p>

        {error && <p className="text-sm text-blue-600">{error}</p>}
        {loading && <p className="text-sm">Loading…</p>}

        <div className="border rounded-lg overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 px-3">Rating</th>
                <th className="py-2 px-3">Faculty ID</th>
                <th className="py-2 px-3">Course / Semester</th>
                <th className="py-2 px-3">Comment</th>
                <th className="py-2 px-3">Submitted By</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b align-top">
                  <td className="py-2 px-3 font-medium">{r.rating}/5</td>
                  <td className="py-2 px-3">{r.faculty_id}</td>
                  <td className="py-2 px-3">
                    <div>{r.course}</div>
                    <div className="text-muted-foreground">{r.semester}</div>
                  </td>
                  <td className="py-2 px-3 max-w-xl">
                    <div className="whitespace-pre-wrap">{r.comment}</div>
                    {(r.pros && r.pros.length > 0) && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {r.pros.map((p, i) => <Badge key={i} variant="outline">+ {p}</Badge>)}
                      </div>
                    )}
                    {(r.cons && r.cons.length > 0) && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {r.cons.map((c, i) => <Badge key={i} variant="outline" className="border-blue-200 text-blue-700">- {c}</Badge>)}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-3">{r.is_anonymous ? 'Anonymous' : (r.student_name || 'Student')}</td>
                  <td className="py-2 px-3">
                    <Badge variant={r.status === 'approved' ? 'default' : r.status === 'rejected' ? 'destructive' : 'secondary'}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setStatus(r.id, 'approved')}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => setStatus(r.id, 'rejected')}>Reject</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-muted-foreground">No pending reviews</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminGuard>
  )
}
