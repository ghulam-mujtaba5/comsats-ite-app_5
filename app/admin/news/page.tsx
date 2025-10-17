"use client"

import { useEffect, useState } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

type News = {
  id: string
  title: string
  content: string
  image_url?: string | null
  status: "draft" | "published"
  published_at: string | null
  created_at: string
  updated_at: string
}

import styles from "../admin-shared.module.css"

export default function AdminNewsPage() {
  const [items, setItems] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: "", content: "", image_url: "", status: "draft" as "draft" | "published" })
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    setLoading(true)
    const res = await fetch("/api/news")
    const json = await res.json()
    setItems(json.data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function createItem() {
    setSubmitting(true)
    const payload = { ...form, image_url: form.image_url || null }
    const res = await fetch("/api/news", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    setSubmitting(false)
    if (res.ok) {
      setForm({ title: "", content: "", image_url: "", status: "draft" })
      await load()
    } else {
      alert("Failed to create")
    }
  }

  async function updateItem(id: string, patch: Partial<News>) {
    const res = await fetch(`/api/news/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) })
    if (!res.ok) alert("Failed to update")
    await load()
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this news item?")) return
    const res = await fetch(`/api/news/${id}`, { method: "DELETE" })
    if (!res.ok) alert("Failed to delete")
    await load()
  }

  return (
    <AdminGuard>
      <div className={`${styles.section} ${styles.spaceY6}`}>
        <h1 className="text-2xl font-bold">Manage News</h1>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Create News</CardTitle>
            <CardDescription>Add new announcements and publish when ready.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <Textarea placeholder="Content" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
            <Input placeholder="Image URL (optional)" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} />
            <Select value={form.status} onValueChange={(v: any) => setForm(f => ({ ...f, status: v }))}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={createItem} disabled={submitting || !form.title || !form.content}>Create</Button>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Existing</CardTitle>
            <CardDescription>Review, publish/unpublish, edit or delete news items.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading…</p>
            ) : items.length === 0 ? (
              <Card variant="soft" className="p-8 text-center">
                <div className="text-muted-foreground">No news items yet</div>
              </Card>
            ) : (
              <ul className="space-y-2">
                {items.map(n => (
                  <li key={n.id} className="border rounded p-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="font-medium">{n.title}</div>
                        <div className="text-sm text-muted-foreground">{n.status} {n.published_at ? `• ${new Date(n.published_at).toLocaleString()}` : ""}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => updateItem(n.id, { status: n.status === 'published' ? 'draft' : 'published' })}>
                          {n.status === 'published' ? 'Unpublish' : 'Publish'}
                        </Button>
                        <Button asChild variant="outline"><Link href={`/news/${n.id}`} target="_blank">Preview</Link></Button>
                        <Button variant="destructive" onClick={() => deleteItem(n.id)}>Delete</Button>
                      </div>
                    </div>
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm underline">Edit</summary>
                      <div className="mt-2 space-y-2">
                        <Input defaultValue={n.title} onBlur={e => updateItem(n.id, { title: e.target.value })} />
                        <Textarea defaultValue={n.content} onBlur={e => updateItem(n.id, { content: e.target.value })} />
                        <Input defaultValue={n.image_url ?? ''} placeholder="Image URL" onBlur={e => updateItem(n.id, { image_url: e.target.value || null } as any)} />
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminGuard>
  )
}
