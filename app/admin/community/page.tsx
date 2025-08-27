"use client"

import { useEffect, useState } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Users, Plus, Edit, Trash2, Eye, ArrowUp, ArrowDown, Save, Sparkles, Activity, TrendingUp, Crown, Link as LinkIcon } from "lucide-react"

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 backdrop-blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          
          <div className="relative app-container pt-12 pb-8">
            <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
                      <div className="relative bg-gradient-to-r from-cyan-600 to-blue-600 p-3 rounded-2xl">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-cyan-800 to-blue-800 dark:from-white dark:via-cyan-200 dark:to-blue-200 bg-clip-text text-transparent">
                        Community Cards
                      </h1>
                      <p className="text-slate-600 dark:text-slate-300 text-lg">
                        Manage community engagement and feature cards
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-cyan-200 dark:border-cyan-800">
                      <Activity className="h-3 w-3 mr-1" />
                      {items.length} Cards
                    </Badge>
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-blue-200 dark:border-blue-800">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Dynamic Content
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Management Interface */}
        <div className="app-container space-y-6 pb-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Card Management</h2>
              <p className="text-slate-600 dark:text-slate-300">Create and organize community feature cards</p>
            </div>
            <Badge variant="outline" className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
              <TrendingUp className="h-3 w-3 mr-1" />
              Live Updates
            </Badge>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Create Card Form */}
            <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur-lg opacity-30" />
                    <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl">
                      <Plus className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-slate-900 dark:text-white">Create New Card</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-300">Add a new community feature card</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Title</Label>
                  <Input placeholder="Card title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Subtitle (optional)</Label>
                  <Input placeholder="Card subtitle" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Description (optional)</Label>
                  <Textarea placeholder="Card description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Link URL (optional)</Label>
                  <Input placeholder="https://example.com" value={form.link_url} onChange={e => setForm(f => ({ ...f, link_url: e.target.value }))} className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Sort Order</Label>
                    <Input type="number" placeholder="0" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</Label>
                    <Select value={form.status} onValueChange={(v: any) => setForm(f => ({ ...f, status: v }))}>
                      <SelectTrigger className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={createItem} disabled={submitting || !form.title} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {submitting ? "Creating..." : "Create Card"}
                </Button>
              </CardContent>
            </Card>

            {/* Cards List */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-30" />
                      <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-slate-900 dark:text-white">Community Cards</CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-300">Manage existing community feature cards</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-600"></div>
                      <span className="ml-2 text-slate-600 dark:text-slate-300">Loading cards...</span>
                    </div>
                  ) : items.length === 0 ? (
                    <div className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 p-8 text-center">
                      <div className="space-y-4">
                        <div className="text-4xl">🃏</div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No Cards Found</h3>
                          <p className="text-slate-600 dark:text-slate-300">Create your first community card to get started.</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {items.map(c => (
                        <Card key={c.id} className="glass-card border border-white/20 dark:border-white/10 rounded-xl backdrop-blur-xl bg-white/30 dark:bg-slate-800/30 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all duration-300">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-slate-900 dark:text-white">{c.title}</h3>
                                  <Badge variant={c.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                                    {c.status}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    #{c.sort_order}
                                  </Badge>
                                </div>
                                {c.subtitle && <p className="text-sm text-slate-600 dark:text-slate-300">{c.subtitle}</p>}
                                {c.description && <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{c.description}</p>}
                                {c.link_url && (
                                  <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                                    <LinkIcon className="h-3 w-3" />
                                    <span className="truncate">{c.link_url}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-1 ml-4">
                                <Button size="sm" variant="outline" onClick={() => updateItem(c.id, { sort_order: c.sort_order - 1 })} className="glass-button p-2">
                                  <ArrowUp className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => updateItem(c.id, { sort_order: c.sort_order + 1 })} className="glass-button p-2">
                                  <ArrowDown className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => updateItem(c.id, { status: c.status === 'published' ? 'draft' : 'published' })} className="glass-button p-2">
                                  {c.status === 'published' ? '📝' : '📤'}
                                </Button>
                                {c.link_url && (
                                  <Button asChild size="sm" variant="outline" className="glass-button p-2">
                                    <Link href={c.link_url} target="_blank">
                                      <Eye className="h-3 w-3" />
                                    </Link>
                                  </Button>
                                )}
                                <Button size="sm" variant="outline" onClick={() => deleteItem(c.id)} className="glass-button hover:bg-red-50 dark:hover:bg-red-950/50 p-2">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <details className="mt-3">
                              <summary className="cursor-pointer text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Quick Edit</summary>
                              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                <Input defaultValue={c.title} onBlur={e => updateItem(c.id, { title: e.target.value })} className="glass-input bg-white/50 dark:bg-slate-800/50 text-sm" />
                                <Input defaultValue={c.subtitle ?? ''} placeholder="Subtitle" onBlur={e => updateItem(c.id, { subtitle: e.target.value || null })} className="glass-input bg-white/50 dark:bg-slate-800/50 text-sm" />
                                <Textarea defaultValue={c.description ?? ''} placeholder="Description" className="sm:col-span-2 glass-input bg-white/50 dark:bg-slate-800/50 text-sm" onBlur={e => updateItem(c.id, { description: e.target.value || null })} />
                                <Input defaultValue={c.link_url ?? ''} placeholder="Link URL" onBlur={e => updateItem(c.id, { link_url: e.target.value || null })} className="glass-input bg-white/50 dark:bg-slate-800/50 text-sm" />
                                <Input type="number" defaultValue={c.sort_order} placeholder="Sort Order" onBlur={e => updateItem(c.id, { sort_order: Number(e.target.value || 0) })} className="glass-input bg-white/50 dark:bg-slate-800/50 text-sm" />
                              </div>
                            </details>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
