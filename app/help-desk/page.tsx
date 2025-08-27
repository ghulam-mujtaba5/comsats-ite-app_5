"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Ticket {
  id: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  created_at: string
  help_desk_responses?: { count: number }[]
}

export default function HelpDeskPage() {
  const { toast } = useToast()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "medium",
    student_name: "",
    student_id: "",
  })

  const grouped = useMemo(() => {
    const map: Record<string, Ticket[]> = { open: [], "in-progress": [], resolved: [], closed: [] }
    for (const t of tickets) {
      const k = (t.status as keyof typeof map) || "open"
      if (!map[k]) map[k] = []
      map[k].push(t)
    }
    return map
  }, [tickets])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch("/api/help-desk/tickets", { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to load tickets")
      setTickets(json.data || [])
    } catch (e: any) {
      toast({ title: "Error", description: e.message })
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await fetch("/api/help-desk/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to create ticket")
      toast({ title: "Ticket created" })
      setForm({ title: "", description: "", category: "general", priority: "medium", student_name: "", student_id: "" })
      load()
    } catch (e: any) {
      toast({ title: "Error", description: e.message })
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="container max-w-5xl py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Help Desk Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Full name" value={form.student_name} onChange={(e) => setForm({ ...form, student_name: e.target.value })} required />
              <Input placeholder="Student ID" value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })} required />
            </div>
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Category (e.g., it, finance, general)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
              <Input placeholder="Priority (low|medium|high)" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} />
            </div>
            <Textarea placeholder="Describe your issue" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <div>
              <Button type="submit">Submit Ticket</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">My Tickets</h2>
        {loading ? (
          <p>Loading...</p>
        ) : tickets.length === 0 ? (
          <p className="text-muted-foreground">No tickets yet.</p>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([status, list]) => (
              <div key={status}>
                <h3 className="text-lg font-medium capitalize mb-3">{status} ({list.length})</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {list.map((t) => (
                    <Card key={t.id}>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center justify-between">
                          <span>{t.title}</span>
                          <span className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-3">{t.description}</p>
                        <div className="text-xs text-muted-foreground">Category: {t.category} • Priority: {t.priority}</div>
                        <Link className="text-sm underline" href={`/help-desk/${t.id}`}>Open</Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
