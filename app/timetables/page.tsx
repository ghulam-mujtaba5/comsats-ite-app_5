"use client"
import "./timetables.light.module.css"
import "./timetables.dark.module.css"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import layout from "@/app/styles/common.module.css"

type Doc = {
  id: string
  title: string
  department: string
  term: string
  size_bytes: number
  mime_type: string
  public_url: string
  uploaded_at: string
}

export default function TimetablesPage() {
  const [items, setItems] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/timetable-docs', { cache: 'no-store' })
        const j = await res.json()
        if (!res.ok) throw new Error(j?.error || 'Failed to load timetables')
        setItems(j.data || [])
      } catch (e: any) {
        setError(e.message || 'Failed to load timetables')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className={`${layout.section} p-6`}>
      <h1 className="text-3xl font-bold mb-4">Department Timetables</h1>
      {loading && <p>Loading…</p>}
      {error && <p className="text-blue-600">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((d) => (
          <div key={d.id} className="border rounded-lg p-4 space-y-2">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">{d.title}</h2>
              <p className="text-sm text-muted-foreground">{d.department}{d.term ? ` • ${d.term}` : ''}</p>
              <p className="text-xs text-muted-foreground">
                File Size: {(d.size_bytes/1024/1024).toFixed(1)} MB • Upload Date: {new Date(d.uploaded_at).toLocaleDateString()} • Format: {d.mime_type?.toUpperCase()?.includes('PDF') ? 'PDF' : d.mime_type}
              </p>
            </div>
            <div className="flex gap-2">
              <a href={d.public_url} target="_blank" rel="noreferrer" className="underline">Preview</a>
              <a href={d.public_url} download className="underline">Download</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
