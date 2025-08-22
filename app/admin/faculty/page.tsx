"use client"

import { useEffect, useMemo, useState } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

// Uses secure server API at /api/admin/faculty guarded by HTTP-only admin cookie

// Minimal faculty schema used here must match your Supabase table `faculty`
// Columns: id (uuid), name, title, department, email, office, phone, specialization (text[] or csv), courses (text[] or csv), education (text[] or csv), experience, profile_image

type Row = {
  id: string
  name: string
  title: string
  department: string
  email: string
  office: string
  phone?: string
  specialization?: string[] | null
  courses?: string[] | null
  education?: string[] | null
  experience?: string
  profile_image?: string | null
}

export default function AdminFacultyPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [editingId, setEditingId] = useState<string | null>(null)

  const [form, setForm] = useState<Omit<Row, "id">>({
    name: "",
    title: "",
    department: "",
    email: "",
    office: "",
    phone: "",
    specialization: [],
    courses: [],
    education: [],
    experience: "",
    profile_image: "",
  })

  const resetForm = () => {
    setForm({
      name: "",
      title: "",
      department: "",
      email: "",
      office: "",
      phone: "",
      specialization: [],
      courses: [],
      education: [],
      experience: "",
      profile_image: "",
    })
    setEditingId(null)
  }

  const fetchRows = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch('/api/admin/faculty', { cache: 'no-store' })
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
    const payload: any = {
      ...form,
      specialization: (form.specialization || []) as string[] ,
      courses: (form.courses || []) as string[],
      education: (form.education || []) as string[],
    }
    try {
      const res = await fetch('/api/admin/faculty' + (editingId ? '' : ''), {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
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
      name: r.name,
      title: r.title,
      department: r.department,
      email: r.email,
      office: r.office,
      phone: r.phone || "",
      specialization: r.specialization || [],
      courses: r.courses || [],
      education: r.education || [],
      experience: r.experience || "",
      profile_image: r.profile_image || "",
    })
  }

  const deleteRow = async (id: string) => {
    if (!confirm("Delete this faculty?")) return
    try {
      const res = await fetch(`/api/admin/faculty?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
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
      "name","title","department","email","office","phone","specialization","courses","education","experience","profile_image"
    ]
    const lines = rows.map(r => [
      r.name,
      r.title,
      r.department,
      r.email,
      r.office,
      r.phone || "",
      (r.specialization || []).join(";"),
      (r.courses || []).join(";"),
      (r.education || []).join(";"),
      r.experience || "",
      r.profile_image || "",
    ].map(v => `"${String(v).replaceAll('"','\"')}"`).join(","))
    return [header.join(","), ...lines].join("\n")
  }

  const downloadCSV = () => {
    const csv = toCSV(rows)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "faculty_export.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const importCSV = async (file: File) => {
    const text = await file.text()
    const lines = text.split(/\r?\n/).filter(Boolean)
    if (lines.length < 2) return
    const header = lines[0].split(",").map(h => h.replaceAll('"','').trim())
    const idx = (k: string) => header.indexOf(k)
    const payloads = lines.slice(1).map(line => {
      const cols = line.match(/(?:^|,)(\"(?:.|\n)*?\"|[^,]*)/g)?.map(c => c.replace(/^,?\"?|\"?$/g, "")) || []
      const get = (k: string) => cols[idx(k)] || ""
      return {
        name: get("name"),
        title: get("title"),
        department: get("department"),
        email: get("email"),
        office: get("office"),
        phone: get("phone"),
        specialization: get("specialization").split(";").filter(Boolean),
        courses: get("courses").split(";").filter(Boolean),
        education: get("education").split(";").filter(Boolean),
        experience: get("experience"),
        profile_image: get("profile_image"),
      }
    })
    setLoading(true)
    try {
      const res = await fetch('/api/admin/faculty', {
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
            <h1 className="text-2xl font-bold">Faculty Management</h1>
            <p className="text-muted-foreground">Add/edit faculty, or import/export CSV.</p>
          </div>
          <div className="flex gap-2">
            <input type="file" accept=".csv" onChange={setCsvFile} />
            <Button variant="outline" onClick={downloadCSV}>Export CSV</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border rounded-lg p-4 space-y-3">
            <h2 className="font-semibold">{editingId ? "Edit Faculty" : "Add Faculty"}</h2>
            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="grid gap-3">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <Label>Department</Label>
                <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <Label>Office</Label>
                <Input value={form.office} onChange={(e) => setForm({ ...form, office: e.target.value })} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <Label>Specialization (semicolon ; separated)</Label>
                <Input value={(form.specialization || []).join(";")} onChange={(e) => setForm({ ...form, specialization: e.target.value.split(";").filter(Boolean) })} />
              </div>
              <div>
                <Label>Courses (semicolon ; separated)</Label>
                <Input value={(form.courses || []).join(";")} onChange={(e) => setForm({ ...form, courses: e.target.value.split(";").filter(Boolean) })} />
              </div>
              <div>
                <Label>Education (semicolon ; separated)</Label>
                <Input value={(form.education || []).join(";")} onChange={(e) => setForm({ ...form, education: e.target.value.split(";").filter(Boolean) })} />
              </div>
              <div>
                <Label>Experience</Label>
                <Input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
              </div>
              <div>
                <Label>Profile Image URL</Label>
                                <Input value={form.profile_image || ''} onChange={(e) => setForm({ ...form, profile_image: e.target.value })} />
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
            <h2 className="font-semibold mb-3">Faculty List</h2>
            {loading && <p className="text-sm">Loading…</p>}
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-2">Name</th>
                  <th className="py-2 pr-2">Title</th>
                  <th className="py-2 pr-2">Dept</th>
                  <th className="py-2 pr-2">Email</th>
                  <th className="py-2 pr-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rowsView.map((r) => (
                  <tr key={r.id} className="border-b last:border-none">
                    <td className="py-2 pr-2">{r.name}</td>
                    <td className="py-2 pr-2">{r.title}</td>
                    <td className="py-2 pr-2">{r.department}</td>
                    <td className="py-2 pr-2">{r.email}</td>
                    <td className="py-2 pr-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => editRow(r)}>Edit</Button>
                                                <Button asChild size="sm" variant="outline"><Link href={`/faculty/${r.id}`} target="_blank">Preview</Link></Button>
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
