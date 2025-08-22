"use client"

import { useEffect, useState } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Card = {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  link_url: string | null
  sort_order: number
  status: "draft" | "published"
  created_at: string
  updated_at: string
}

export default function AdminCommunityPage() {
  const [items, setItems] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: "", subtitle: "", description: "", link_url: "", sort_order: 0, status: "published" as "draft" | "published" })
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    setLoading(true)
    const res = await fetch("/api/community-cards")
    const json = await res.json()
    setItems(json.data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function createItem() {
    setSubmitting(true)
    const payload = { ...form, subtitle: form.subtitle || null, description: form.description || null, link_url: form.link_url || null }
    const res = await fetch("/api/community-cards", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    setSubmitting(false)
    if (res.ok) {
      setForm({ title: "", subtitle: "", description: "", link_url: "", sort_order: 0, status: "published" })
      await load()
    } else {
      alert("Failed to create")
    }
  }

  async function updateItem(id: string, patch: Partial<Card>) {
    const res = await fetch(`/api/community-cards/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) })
    if (!res.ok) alert("Failed to update")
    await load()
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this card?")) return
    const res = await fetch(`/api/community-cards/${id}`, { method: "DELETE" })
    if (!res.ok) alert("Failed to delete")
    await load()
  }

  return (
    <AdminGuard>
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Manage Community Cards</h1>

        <div className="border rounded p-4 space-y-3">
          <h2 className="font-semibold">Create Card</h2>
          <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <Input placeholder="Subtitle (optional)" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
          <Textarea placeholder="Description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <Input placeholder="Link URL (optional)" value={form.link_url} onChange={e => setForm(f => ({ ...f, link_url: e.target.value }))} />
          <div className="flex items-center gap-3">
            <Input type="number" className="w-40" placeholder="Sort Order" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} />
            <Select value={form.status} onValueChange={(v: any) => setForm(f => ({ ...f, status: v }))}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={createItem} disabled={submitting || !form.title}>Create</Button>
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold">Existing</h2>
          {loading ? <p>Loading…</p> : (
            <ul className="space-y-2">
              {items.map(c => (
                <li key={c.id} className="border rounded p-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{c.title} <span className="text-xs text-muted-foreground">(order {c.sort_order})</span></div>
                      {c.subtitle && <div className="text-sm text-muted-foreground">{c.subtitle}</div>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => updateItem(c.id, { status: c.status === 'published' ? 'draft' : 'published' })}>
                        {c.status === 'published' ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button variant="destructive" onClick={() => deleteItem(c.id)}>Delete</Button>
                    </div>
                  </div>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm underline">Edit</summary>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <Input defaultValue={c.title} onBlur={e => updateItem(c.id, { title: e.target.value })} />
                      <Input defaultValue={c.subtitle ?? ''} placeholder="Subtitle" onBlur={e => updateItem(c.id, { subtitle: e.target.value || null })} />
                      <Textarea defaultValue={c.description ?? ''} placeholder="Description" className="sm:col-span-2" onBlur={e => updateItem(c.id, { description: e.target.value || null })} />
                      <Input defaultValue={c.link_url ?? ''} placeholder="Link URL" onBlur={e => updateItem(c.id, { link_url: e.target.value || null })} />
                      <Input type="number" defaultValue={c.sort_order} placeholder="Sort Order" onBlur={e => updateItem(c.id, { sort_order: Number(e.target.value || 0) })} />
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminGuard>
  )
}
