"use client"

import { useEffect, useMemo, useState } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminActionCard } from "@/components/admin/admin-action-card"
import { AdminLoading } from "@/components/admin/admin-loading"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { GlassCard } from "@/components/admin/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { FileText, Upload, Download, Eye, Edit3, Trash2, Calendar, Building2, FolderOpen } from "lucide-react"

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

import styles from "../admin-shared.module.css"

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
      <AdminPageHeader
        title="Timetable Documents"
        description="Upload, edit, and delete PDF schedules for comprehensive academic planning"
        icon={FileText}
        iconGradient="from-green-600 to-emerald-600"
        badges={[
          {
            label: "Total Documents",
            value: rows.length,
            icon: FolderOpen,
            color: "border-green-200 dark:border-green-800"
          },
          {
            label: "Total Size",
            value: `${(rows.reduce((acc, r) => acc + r.size_bytes, 0) / 1024 / 1024).toFixed(1)} MB`,
            icon: FileText,
            color: "border-blue-200 dark:border-blue-800"
          }
        ]}
        actions={[
          {
            label: "Upload New Document",
            icon: Upload,
            onClick: () => {},
            gradient: "from-green-600 to-emerald-600"
          }
        ]}
      />
      
      <div className={`${styles.section} ${styles.spaceY8} pb-12`}>
        <GlassCard 
          title="Upload New Document"
          description="Add a new timetable PDF"
          icon={Upload}
          iconGradient="from-green-600 to-emerald-600"
        >
          <form onSubmit={onUpload} className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Title</Label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Fall 2024 - Computer Science Timetable" 
                required 
                className="glass-input"
              />
            </div>
            <div>
              <Label>Department</Label>
              <Input 
                value={department} 
                onChange={(e) => setDepartment(e.target.value)} 
                placeholder="Computer Science" 
                required 
                className="glass-input"
              />
            </div>
            <div>
              <Label>Term</Label>
              <Input 
                value={term} 
                onChange={(e) => setTerm(e.target.value)} 
                placeholder="Fall 2024" 
                required 
                className="glass-input"
              />
            </div>
            <div>
              <Label>File (PDF)</Label>
              <Input 
                type="file" 
                accept="application/pdf" 
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
                required 
                className="glass-input"
              />
            </div>
            <div className="md:col-span-2 flex gap-2 items-center">
              <Button 
                type="submit" 
                disabled={loading}
                className="glass-button bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
              >
                <Upload className="h-4 w-4 mr-2" />
                {loading ? 'Uploading…' : 'Upload Document'}
              </Button>
              {error && (
                <Badge variant="destructive" className="text-sm">
                  {error}
                </Badge>
              )}
            </div>
          </form>
        </GlassCard>

        <GlassCard 
          title="Documents Library"
          description="Existing timetable PDFs"
          icon={FolderOpen}
          iconGradient="from-blue-600 to-indigo-600"
        >
          {loading ? (
            <AdminLoading message="Loading documents..." />
          ) : rowsView.length === 0 ? (
            <AdminEmptyState
              title="No Documents Found"
              description="No timetable documents have been uploaded yet"
              emoji="📄"
            />
          ) : (
            <div className="space-y-4">
              {rowsView.map((r) => (
                <AdminActionCard
                  key={r.id}
                  title={r.title}
                  description={`${r.department} - ${r.term}`}
                  icon={FileText}
                  badges={[
                    {
                      label: `${(r.size_bytes/1024/1024).toFixed(1)} MB`,
                      variant: "outline"
                    },
                    {
                      label: new Date(r.uploaded_at).toLocaleDateString(),
                      variant: "secondary"
                    }
                  ]}
                  actions={[
                    {
                      label: "Preview",
                      icon: Eye,
                      onClick: () => window.open(r.public_url, '_blank'),
                      variant: "outline"
                    },
                    {
                      label: "Download",
                      icon: Download,
                      onClick: () => {
                        // Check if document is available (client-side only)
                        if (typeof document !== 'undefined') {
                          const a = document.createElement('a')
                          a.href = r.public_url
                          a.download = r.title
                          a.click()
                        }
                      },
                      variant: "outline"
                    },
                    {
                      label: "Edit",
                      icon: Edit3,
                      onClick: () => setEditing(r),
                      variant: "outline"
                    },
                    {
                      label: "Delete",
                      icon: Trash2,
                      onClick: () => onDelete(r.id),
                      variant: "destructive"
                    }
                  ]}
                  metadata={`Uploaded ${new Date(r.uploaded_at).toLocaleDateString()}`}
                />
              ))}
            </div>
          )}
        </GlassCard>

        {editing && (
          <GlassCard 
            title="Edit Document"
            description="Update details or replace the file"
            icon={Edit3}
            iconGradient="from-blue-600 to-indigo-600"
          >
            <form onSubmit={onUpdate} className="grid gap-4">
              <div>
                <Label>Title</Label>
                <Input 
                  value={editing.title} 
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })} 
                  className="glass-input"
                />
              </div>
              <div>
                <Label>Department</Label>
                <Input 
                  value={editing.department} 
                  onChange={(e) => setEditing({ ...editing, department: e.target.value })} 
                  className="glass-input"
                />
              </div>
              <div>
                <Label>Term</Label>
                <Input 
                  value={editing.term} 
                  onChange={(e) => setEditing({ ...editing, term: e.target.value })} 
                  className="glass-input"
                />
              </div>
              <div>
                <Label>Replace File (optional)</Label>
                <Input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={(e) => setNewFile(e.target.files?.[0] || null)} 
                  className="glass-input"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  type="submit"
                  className="glass-button bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { setEditing(null); setNewFile(null) }}
                  className="glass-button"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </GlassCard>
        )}
      </div>
    </AdminGuard>
  )
}
