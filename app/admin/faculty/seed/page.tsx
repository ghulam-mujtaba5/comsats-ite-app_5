"use client"

import { useState } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Button } from "@/components/ui/button"
import adminStyles from "@/app/admin/admin-shared.module.css"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

export default function SeedFacultyPage() {
  const [ids, setIds] = useState("")
  const [json, setJson] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>("")

  const seed = async () => {
    setLoading(true)
    setMessage("")
    try {
      let payload: any
      if (json.trim()) {
        payload = { faculty: JSON.parse(json) }
      } else {
        const idList = ids.split(/[\n,\s]+/).map(s => s.trim()).filter(Boolean)
        payload = { ids: idList }
      }
      const res = await fetch('/api/admin/faculty/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'Failed to seed')
      setMessage(`Seeded ${j.data?.length || 0} faculty entries`)
    } catch (e: any) {
      setMessage(e.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminGuard fallback={<div className="p-6 text-center">Admin access required.</div>}>
      <div className={`${adminStyles.section} p-6 space-y-6`}>
        <div>
          <h1 className="text-2xl font-bold">Seed Faculty</h1>
          <p className="text-muted-foreground">Paste UUIDs or JSON to quickly upsert faculty rows (by id).</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Faculty IDs (UUIDs)</label>
            <Textarea rows={14} value={ids} onChange={(e) => setIds(e.target.value)} placeholder={`61ddfa5c-0854-4450-a69f-2ecc1dd9d825\n...`} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Or Faculty JSON (array)</label>
            <Textarea rows={14} value={json} onChange={(e) => setJson(e.target.value)} placeholder='[{"id":"...","name":"Dr. Name","department":"CS"}]' />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={seed} disabled={loading}>{loading ? 'Seeding…' : 'Seed/Upsert'}</Button>
          {message && <span className="text-sm text-blue-600">{message}</span>}
        </div>
      </div>
    </AdminGuard>
  )
}
