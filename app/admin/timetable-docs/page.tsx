"use client"

import { useEffect, useMemo, useState } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Row = {
  id: string
  title: string
  department: string
  term: string
  size_bytes: number
  mime_type: string
  storage_path: string
  public_url: string
  uploaded_at: string
}

export default function AdminTimetableDocsPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [title, setTitle] = useState("")
  const [department, setDepartment] = useState("")
  const [term, setTerm] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const [editing, setEditing] = useState<Row | null>(null)
  const [newFile, setNewFile] = useState<File | null>(null)

  const fetchRows = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch('/api/admin/timetable-docs', { cache: 'no-store' })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'Failed to load')
      setRows(j.data || [])
    } catch (e: any) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRows() }, [])

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) { setError('Please select a file'); return }
    setLoading(true)
    setError("")
    const form = new FormData()
    form.set('title', title)
    form.set('department', department)
    form.set('term', term)
    form.set('file', file)
    try {
      const res = await fetch('/api/admin/timetable-docs', { method: 'POST', body: form })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'Upload failed')
      setTitle("")
      setDepartment("")
      setTerm("")
      setFile(null)
      await fetchRows()
    } catch (e: any) {
      setError(e.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (id: string) => {
    if (!confirm('Delete this document?')) return
    try {
      const res = await fetch(`/api/admin/timetable-docs?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j?.error || 'Failed to delete')
      await fetchRows()
    } catch (e: any) {
      setError(e.message || 'Failed to delete')
    }
  }

  const onUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setLoading(true)
    setError("")
    const form = new FormData()
    form.set('id', editing.id)
    form.set('title', editing.title)
    form.set('department', editing.department)
    form.set('term', editing.term)
    if (newFile) form.set('file', newFile)
    try {
      const res = await fetch('/api/admin/timetable-docs', { method: 'PUT', body: form })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'Update failed')
      setEditing(null)
      setNewFile(null)
      await fetchRows()
    } catch (e: any) {
      setError(e.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const rowsView = useMemo(() => rows, [rows])

  return (
    <AdminGuard fallback={<div className="p-6 text-center">Admin access required. <a className="underline" href="/admin/login">Login</a></div>}>
      <div className="app-container section space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Timetable Documents</h1>
            <p className="text-muted-foreground">Upload, edit, and delete PDF schedules.</p>
          </div>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Upload New Document</CardTitle>
            <CardDescription>Add a new timetable PDF.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onUpload} className="grid gap-3 md:grid-cols-2">
              <div>
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Fall 2024 - Computer Science Timetable" required />
              </div>
              <div>
                <Label>Department</Label>
                <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Computer Science" required />
              </div>
              <div>
                <Label>Term</Label>
                <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Fall 2024" required />
              </div>
              <div>
                <Label>File (PDF)</Label>
                <Input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit" disabled={loading}>{loading ? 'Uploading…' : 'Upload'}</Button>
                {error && <span className="text-sm text-blue-600 self-center">{error}</span>}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Existing timetable PDFs.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <p className="text-sm">Loading…</p>}
            {rowsView.length === 0 && !loading ? (
              <Card variant="soft" className="p-8 text-center">
                <div className="text-muted-foreground">No documents uploaded yet</div>
              </Card>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-2">Title</th>
                      <th className="py-2 pr-2">Department</th>
                      <th className="py-2 pr-2">Term</th>
                      <th className="py-2 pr-2">Size</th>
                      <th className="py-2 pr-2">Uploaded</th>
                      <th className="py-2 pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowsView.map((r) => (
                      <tr key={r.id} className="border-b last:border-none">
                        <td className="py-2 pr-2">{r.title}</td>
                        <td className="py-2 pr-2">{r.department}</td>
                        <td className="py-2 pr-2">{r.term}</td>
                        <td className="py-2 pr-2">{(r.size_bytes/1024/1024).toFixed(1)} MB</td>
                        <td className="py-2 pr-2">{new Date(r.uploaded_at).toLocaleDateString()}</td>
                        <td className="py-2 pr-2">
                          <div className="flex gap-2">
                            <a className="underline" href={r.public_url} target="_blank" rel="noreferrer">Preview</a>
                            <a className="underline" href={r.public_url} download>Download</a>
                            <Button size="sm" variant="outline" onClick={() => setEditing(r)}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => onDelete(r.id)}>Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {editing && (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Edit Document</CardTitle>
              <CardDescription>Update details or replace the file.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onUpdate} className="grid gap-3">
                <div>
                  <Label>Title</Label>
                  <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </div>
                <div>
                  <Label>Department</Label>
                  <Input value={editing.department} onChange={(e) => setEditing({ ...editing, department: e.target.value })} />
                </div>
                <div>
                  <Label>Term</Label>
                  <Input value={editing.term} onChange={(e) => setEditing({ ...editing, term: e.target.value })} />
                </div>
                <div>
                  <Label>Replace File (optional)</Label>
                  <Input type="file" accept="application/pdf" onChange={(e) => setNewFile(e.target.files?.[0] || null)} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Save</Button>
                  <Button type="button" variant="outline" onClick={() => { setEditing(null); setNewFile(null) }}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminGuard>
  )
}
