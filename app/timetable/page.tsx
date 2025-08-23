"use client"

import { useEffect, useState } from "react"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye } from "lucide-react"

type TimetableDoc = {
  id: string
  title: string
  department: string
  term: string | null
  size_bytes: number | null
  mime_type: string
  public_url: string
  uploaded_at: string
}

export default function TimetablePage() {
  const [docs, setDocs] = useState<TimetableDoc[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState("")
  const [department, setDepartment] = useState("")
  const [term, setTerm] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(true)

  const loadDocs = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/timetable-docs", { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to load")
      setDocs(json.data || [])
    } catch (e: any) {
      setError(e.message || "Failed to load")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDocs()
    ;(async () => {
      try {
        const res = await fetch('/api/admin/session', { cache: 'no-store' })
        setIsAdmin(res.ok)
      } catch {
        setIsAdmin(false)
      } finally {
        setAdminLoading(false)
      }
    })()
  }, [])

  const handlePreview = (doc: TimetableDoc) => {
    window.open(doc.public_url, "_blank")
  }

  const handleDownload = (doc: TimetableDoc) => {
    const link = document.createElement("a")
    link.href = doc.public_url
    link.download = `${doc.title}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (!file) {
      setError("Select a PDF file")
      return
    }
    const form = new FormData()
    form.append("file", file)
    form.append("title", title)
    form.append("department", department)
    form.append("term", term)
    setUploading(true)
    try {
      const res = await fetch("/api/timetable/upload", { method: "POST", body: form })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Upload failed")
      setMessage("Uploaded successfully")
      setTitle("")
      setDepartment("")
      setTerm("")
      setFile(null)
      await loadDocs()
    } catch (e: any) {
      setError(e.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Timetable PDFs</h1>
            <p className="text-muted-foreground">Upload and preview official timetable PDF files.</p>
          </div>

          {adminLoading ? (
            <Card className="mb-8"><CardContent>Checking permissions...</CardContent></Card>
          ) : isAdmin ? (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Upload Timetable PDF</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="grid gap-3 md:grid-cols-2" onSubmit={onUpload}>
                  <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <Input placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                  <Input placeholder="Term (e.g., Fall 2025)" value={term} onChange={(e) => setTerm(e.target.value)} />
                  <Input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  <div className="md:col-span-2 flex gap-3 items-center">
                    <Button type="submit" disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</Button>
                    {error && <span className="text-red-600 text-sm">{error}</span>}
                    {message && <span className="text-green-600 text-sm">{message}</span>}
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && (
              <Card className="text-center py-12"><CardContent>Loading...</CardContent></Card>
            )}
            {!loading && docs.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <FileText className="h-8 w-8 text-blue-500 flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg leading-tight mb-2">{doc.title}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{doc.department}</Badge>
                        {doc.term && <Badge variant="outline">{doc.term}</Badge>}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex justify-between">
                      <span>Uploaded:</span>
                      <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span>{doc.mime_type || 'application/pdf'}</span>
                    </div>
                    {typeof doc.size_bytes === 'number' && (
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span>{(doc.size_bytes / (1024 * 1024)).toFixed(1)} MB</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handlePreview(doc)} className="flex-1">
                      <Eye className="h-4 w-4 mr-2" /> Preview
                    </Button>
                    <Button size="sm" onClick={() => handleDownload(doc)} className="flex-1">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {!loading && docs.length === 0 && (
            <Card className="text-center py-12 mt-6">
              <CardContent>
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No timetables found</h3>
                <p className="text-muted-foreground">Upload a PDF above to get started.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
