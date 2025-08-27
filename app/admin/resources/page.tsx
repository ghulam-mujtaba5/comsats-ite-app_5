"use client"

import { useEffect, useMemo, useState } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Row = {
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

export default function AdminResourcesPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [department, setDepartment] = useState("")
  const [term, setTerm] = useState("")
  const [externalUrl, setExternalUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const [editing, setEditing] = useState<Row | null>(null)
  const [newFile, setNewFile] = useState<File | null>(null)

  const fetchRows = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch('/api/admin/resources', { cache: 'no-store' })
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

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) { setError('Title is required'); return }
    if (!externalUrl && !file) { setError('Provide a link or a file'); return }
    setLoading(true)
    setError("")
    const form = new FormData()
    form.set('title', title)
    form.set('description', description)
    form.set('department', department)
    form.set('term', term)
    if (externalUrl) form.set('external_url', externalUrl)
    if (file) form.set('file', file)
    try {
      const res = await fetch('/api/admin/resources', { method: 'POST', body: form })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'Create failed')
      setTitle("")
      setDescription("")
      setDepartment("")
      setTerm("")
      setExternalUrl("")
      setFile(null)
      await fetchRows()
    } catch (e: any) {
      setError(e.message || 'Create failed')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (id: string) => {
    if (!confirm('Delete this resource?')) return
    try {
      const res = await fetch(`/api/admin/resources?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
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
    form.set('description', editing.description || '')
    form.set('department', editing.department || '')
    form.set('term', editing.term || '')
    if (editing.external_url) form.set('external_url', editing.external_url)
    if (newFile) form.set('file', newFile)
    try {
      const res = await fetch('/api/admin/resources', { method: 'PUT', body: form })
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
        <div>
          <h1 className="text-2xl font-bold">Resources</h1>
          <p className="text-muted-foreground">Add/edit/delete cards with Google Drive link or upload a file.</p>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Create Resource</CardTitle>
            <CardDescription>Provide a title and either a Drive link or upload a file.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onCreate} className="grid gap-3 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Fall 2024 - Computer Science Timetable" required />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description (optional)" />
              </div>
              <div>
                <Label>Department</Label>
                <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Computer Science" />
              </div>
              <div>
                <Label>Term</Label>
                <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Fall 2024" />
              </div>
              <div className="md:col-span-2">
                <Label>External Link (Google Drive preferred)</Label>
                <Input value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} placeholder="https://drive.google.com/..." />
              </div>
              <div className="md:col-span-2">
                <Label>Or Upload File</Label>
                <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit" disabled={loading}>{loading ? 'Saving…' : 'Create'}</Button>
                {error && <span className="text-sm text-blue-600 self-center">{error}</span>}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Existing Resources</CardTitle>
            <CardDescription>Manage, preview, or delete uploaded resources.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <p className="text-sm" aria-live="polite">Loading…</p>}
            {rowsView.length === 0 && !loading ? (
              <Card variant="soft" className="p-8 text-center">
                <div className="text-muted-foreground">No resources yet. Create one above.</div>
              </Card>
            ) : (
              <div className="overflow-auto" aria-busy={!!loading}>
                <table className="w-full text-sm">
                  <caption className="sr-only">Resources table</caption>
                  <thead>
                    <tr className="text-left border-b">
                      <th scope="col" className="py-2 pr-2">Title</th>
                      <th scope="col" className="py-2 pr-2">Department</th>
                      <th scope="col" className="py-2 pr-2">Term</th>
                      <th scope="col" className="py-2 pr-2">Link/File</th>
                      <th scope="col" className="py-2 pr-2">Size</th>
                      <th scope="col" className="py-2 pr-2">Uploaded</th>
                      <th scope="col" className="py-2 pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowsView.map((r) => (
                      <tr key={r.id} className="border-b last:border-none">
                        <td className="py-2 pr-2">{r.title}</td>
                        <td className="py-2 pr-2">{r.department}</td>
                        <td className="py-2 pr-2">{r.term}</td>
                        <td className="py-2 pr-2 max-w-[280px] truncate">{r.external_url ? r.external_url : r.file_url}</td>
                        <td className="py-2 pr-2">{r.size_bytes ? (r.size_bytes/1024/1024).toFixed(1) + ' MB' : '-'}</td>
                        <td className="py-2 pr-2">{new Date(r.uploaded_at).toLocaleDateString()}</td>
                        <td className="py-2 pr-2">
                          <div className="flex gap-2">
                            {r.external_url && <a className="underline" href={r.external_url} target="_blank" rel="noreferrer">Open</a>}
                            {r.file_url && <a className="underline" href={r.file_url} target="_blank" rel="noreferrer">Preview</a>}
                            {r.file_url && <a className="underline" href={r.file_url} download>Download</a>}
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
              <CardTitle>Edit Resource</CardTitle>
              <CardDescription>Update metadata or replace the file.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onUpdate} className="grid gap-3">
                <div>
                  <Label>Title</Label>
                  <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                </div>
                <div>
                  <Label>Department</Label>
                  <Input value={editing.department || ''} onChange={(e) => setEditing({ ...editing, department: e.target.value })} />
                </div>
                <div>
                  <Label>Term</Label>
                  <Input value={editing.term || ''} onChange={(e) => setEditing({ ...editing, term: e.target.value })} />
                </div>
                <div>
                  <Label>External Link (Google Drive preferred)</Label>
                  <Input value={editing.external_url || ''} onChange={(e) => setEditing({ ...editing, external_url: e.target.value })} />
                </div>
                <div>
                  <Label>Replace File (optional)</Label>
                  <Input type="file" onChange={(e) => setNewFile(e.target.files?.[0] || null)} />
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
