"use client"

import { useEffect, useMemo, useState } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Timetable schema expected on Supabase table `timetable`:
// id uuid default gen_random_uuid(), course_code text, course_title text, section text,
// day text, start_time text, end_time text, room text, teacher_name text,
// department text, semester text, created_at timestamp default now()

type Row = {
  id: string
  course_code: string
  course_title: string
  section: string
  day: string
  start_time: string
  end_time: string
  room: string
  teacher_name: string
  department: string
  semester: string
  created_at?: string
}

export default function AdminTimetablePage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  const [form, setForm] = useState<Omit<Row, "id">>({
    course_code: "",
    course_title: "",
    section: "",
    day: "",
    start_time: "",
    end_time: "",
    room: "",
    teacher_name: "",
    department: "",
    semester: "",
  })

  const resetForm = () => {
    setForm({
      course_code: "",
      course_title: "",
      section: "",
      day: "",
      start_time: "",
      end_time: "",
      room: "",
      teacher_name: "",
      department: "",
      semester: "",
    })
    setEditingId(null)
  }

  const fetchRows = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch('/api/admin/timetable', { cache: 'no-store' })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'Failed to load')
      setRows((j.data as Row[]) || [])
    } catch (e: any) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRows()
  }, [])

  const upsertRow = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch('/api/admin/timetable', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'Failed to save')
    } catch (e: any) {
      setError(e.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
    await fetchRows()
    resetForm()
  }

  const editRow = (r: Row) => {
    setEditingId(r.id)
    setForm({
      course_code: r.course_code,
      course_title: r.course_title,
      section: r.section,
      day: r.day,
      start_time: r.start_time,
      end_time: r.end_time,
      room: r.room,
      teacher_name: r.teacher_name,
      department: r.department,
      semester: r.semester,
    })
  }

  const deleteRow = async (id: string) => {
    if (!confirm("Delete this timetable entry?")) return
    try {
      const res = await fetch(`/api/admin/timetable?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j?.error || 'Failed to delete')
    } catch (e: any) {
      setError(e.message || 'Failed to delete')
      return
    }
    await fetchRows()
  }

  // CSV helpers
  const toCSV = (rows: Row[]) => {
    const header = [
      'course_code','course_title','section','day','start_time','end_time','room','teacher_name','department','semester'
    ]
    const lines = rows.map(r => [
      r.course_code,
      r.course_title,
      r.section,
      r.day,
      r.start_time,
      r.end_time,
      r.room,
      r.teacher_name,
      r.department,
      r.semester,
    ].map(v => `"${String(v ?? '').replaceAll('"','\"')}"`).join(','))
    return [header.join(','), ...lines].join('\n')
  }

  const downloadCSV = () => {
    const csv = toCSV(rows)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'timetable_export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importCSV = async (file: File) => {
    const text = await file.text()
    const lines = text.split(/\r?\n/).filter(Boolean)
    if (lines.length < 2) return
    const header = lines[0].split(',').map(h => h.replaceAll('"','').trim())
    const idx = (k: string) => header.indexOf(k)
    const payloads = lines.slice(1).map(line => {
      const cols = line.match(/(?:^|,)(\"(?:.|\n)*?\"|[^,]*)/g)?.map(c => c.replace(/^,?\"?|\"?$/g, "")) || []
      const get = (k: string) => cols[idx(k)] || ""
      return {
        course_code: get('course_code'),
        course_title: get('course_title'),
        section: get('section'),
        day: get('day'),
        start_time: get('start_time'),
        end_time: get('end_time'),
        room: get('room'),
        teacher_name: get('teacher_name'),
        department: get('department'),
        semester: get('semester'),
      }
    })

    setLoading(true)
    try {
      const res = await fetch('/api/admin/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloads),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j?.error || 'Failed to import CSV')
    } catch (e: any) {
      setError(e.message || 'Failed to import CSV')
    } finally {
      setLoading(false)
    }
    await fetchRows()
  }

  const setCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) importCSV(f)
  }

  const rowsView = useMemo(() => rows, [rows])

  return (
    <AdminGuard fallback={<div className="p-6 text-center">Admin access required. <a className="underline" href="/admin/login">Login</a></div>}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Timetable Management</h1>
            <p className="text-muted-foreground">Add/edit timetable, or import/export CSV.</p>
          </div>
          <div className="flex gap-2">
            <input type="file" accept=".csv" onChange={setCsvFile} />
            <Button variant="outline" onClick={downloadCSV}>Export CSV</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border rounded-lg p-4 space-y-3">
            <h2 className="font-semibold">{editingId ? "Edit Entry" : "Add Entry"}</h2>
            {error && <p className="text-sm text-blue-600">{error}</p>}

            <div className="grid gap-3">
              <div>
                <Label>Course Code</Label>
                <Input value={form.course_code} onChange={(e) => setForm({ ...form, course_code: e.target.value })} />
              </div>
              <div>
                <Label>Course Title</Label>
                <Input value={form.course_title} onChange={(e) => setForm({ ...form, course_title: e.target.value })} />
              </div>
              <div>
                <Label>Section</Label>
                <Input value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} />
              </div>
              <div>
                <Label>Day</Label>
                <Input value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} placeholder="Mon/Tue/..." />
              </div>
              <div>
                <Label>Start Time</Label>
                <Input value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} placeholder="09:00" />
              </div>
              <div>
                <Label>End Time</Label>
                <Input value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} placeholder="10:30" />
              </div>
              <div>
                <Label>Room</Label>
                <Input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />
              </div>
              <div>
                <Label>Teacher Name</Label>
                <Input value={form.teacher_name} onChange={(e) => setForm({ ...form, teacher_name: e.target.value })} />
              </div>
              <div>
                <Label>Department</Label>
                <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              </div>
              <div>
                <Label>Semester</Label>
                <Input value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <Button onClick={upsertRow}>{editingId ? "Update" : "Create"}</Button>
                {editingId && (
                  <Button variant="outline" onClick={resetForm}>Cancel</Button>
                )}
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 overflow-auto">
            <h2 className="font-semibold mb-3">Timetable</h2>
            {loading && <p className="text-sm">Loading…</p>}
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-2">Course</th>
                  <th className="py-2 pr-2">Section</th>
                  <th className="py-2 pr-2">Day</th>
                  <th className="py-2 pr-2">Time</th>
                  <th className="py-2 pr-2">Room</th>
                  <th className="py-2 pr-2">Teacher</th>
                  <th className="py-2 pr-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rowsView.map((r) => (
                  <tr key={r.id} className="border-b last:border-none">
                    <td className="py-2 pr-2">{r.course_code} - {r.course_title}</td>
                    <td className="py-2 pr-2">{r.section}</td>
                    <td className="py-2 pr-2">{r.day}</td>
                    <td className="py-2 pr-2">{r.start_time} - {r.end_time}</td>
                    <td className="py-2 pr-2">{r.room}</td>
                    <td className="py-2 pr-2">{r.teacher_name}</td>
                    <td className="py-2 pr-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => editRow(r)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteRow(r.id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
