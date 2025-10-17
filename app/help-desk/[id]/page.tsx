"use client"
import "../help-desk.light.module.css"
import "../help-desk.dark.module.css"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface ResponseItem {
  id: string
  ticket_id: string
  message: string
  author_name?: string
  author_role?: string
  user_id: string
  created_at: string
}


interface TicketDetail {
  id: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  created_at: string
  help_desk_responses?: ResponseItem[]
}

export default function TicketDetailPage({ params }: any) {
  const { toast } = useToast()
  const router = useRouter()
  const { id } = params
  const [ticket, setTicket] = useState<TicketDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`/api/help-desk/tickets/${id}`, { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to load ticket")
      setTicket(json.data)
    } catch (e: any) {
      toast({ title: "Error", description: e.message })
    } finally {
      setLoading(false)
    }
  }

  async function sendResponse(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    try {
      const res = await fetch(`/api/help-desk/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: id, message }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to send response")
      setMessage("")
      toast({ title: "Response sent" })
      load()
    } catch (e: any) {
      toast({ title: "Error", description: e.message })
    }
  }

  useEffect(() => { load() }, [id])

  return (
    <div className="container max-w-3xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/help-desk" className="underline">Back to tickets</Link>
        {ticket && (
          <span className="text-sm text-muted-foreground">{new Date(ticket.created_at).toLocaleString()}</span>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : !ticket ? (
        <p className="text-muted-foreground">Ticket not found.</p>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{ticket.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">Category: {ticket.category} • Priority: {ticket.priority} • Status: {ticket.status}</div>
              <p className="whitespace-pre-wrap">{ticket.description}</p>
            </CardContent>
          </Card>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Conversation</h2>
            <div className="space-y-3">
              {(ticket.help_desk_responses || []).length === 0 ? (
                <p className="text-muted-foreground text-sm">No responses yet.</p>
              ) : (
                ticket.help_desk_responses!.map((r) => (
                  <Card key={r.id}>
                    <CardContent className="py-3">
                      <div className="text-xs text-muted-foreground mb-1">
                        {r.author_name || r.author_role || "user"} • {new Date(r.created_at).toLocaleString()}
                      </div>
                      <div className="whitespace-pre-wrap text-sm">{r.message}</div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <form className="grid gap-3" onSubmit={sendResponse}>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write a response" />
              <div>
                <Button type="submit">Send</Button>
              </div>
            </form>
          </section>
        </>
      )}
    </div>
  )
}
