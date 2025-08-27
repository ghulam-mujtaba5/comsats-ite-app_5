"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'

// Columns for CSV templates
const facultyColumns = [
  'id','name','department','title','email','office','phone','specialization','courses','education','experience','profile_image','created_at'
]
const reviewColumns = [
  'id','user_id','faculty_id','student_name','course','semester','rating','teaching_quality','accessibility','course_material','grading','comment','pros','cons','would_recommend','is_anonymous','helpful','reported','status','created_at'
]

function parseCSV(text: string): { headers: string[], rows: string[][] } {
  // very small CSV parser (no quotes/escapes). Expect comma-separated, newline rows.
  const lines = text.trim().split(/\r?\n/)
  if (lines.length === 0) return { headers: [], rows: [] }
  const headers = lines[0].split(',').map(s => s.trim())
  const rows = lines.slice(1).map(l => l.split(',').map(s => s.trim()))
  return { headers, rows }
}

function csvToJson(headers: string[], rows: string[][]) {
  return rows.map((r) => {
    const obj: Record<string, any> = {}
    headers.forEach((h, i) => { obj[h] = r[i] ?? '' })
    // Convert list-like fields by splitting on '|'
    if (obj.specialization) obj.specialization = String(obj.specialization).split('|').filter(Boolean)
    if (obj.courses) obj.courses = String(obj.courses).split('|').filter(Boolean)
    if (obj.education) obj.education = String(obj.education).split('|').filter(Boolean)
    if (obj.pros) obj.pros = String(obj.pros).split('|').filter(Boolean)
    if (obj.cons) obj.cons = String(obj.cons).split('|').filter(Boolean)
    // Basic booleans and numbers
    ;['would_recommend','is_anonymous'].forEach(k => obj[k] = obj[k] === '' ? undefined : String(obj[k]).toLowerCase() === 'true')
    ;['rating','teaching_quality','accessibility','course_material','grading','helpful','reported'].forEach(k => {
      if (obj[k] !== undefined && obj[k] !== '') obj[k] = Number(obj[k])
    })
    // Empty strings to undefined
    Object.keys(obj).forEach(k => { if (obj[k] === '') obj[k] = undefined })
    return obj
  })
}

export default function BulkImportPage() {
  const { toast } = useToast()
  const [entity, setEntity] = useState<'faculty' | 'reviews'>('faculty')
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [isCSV, setIsCSV] = useState(false)
  const [dryRun, setDryRun] = useState(true)
  const [upsert, setUpsert] = useState(true)
  const [defaultStatus, setDefaultStatus] = useState<'pending'|'approved'|'rejected'>('approved')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleDownloadTemplate = () => {
    const columns = entity === 'faculty' ? facultyColumns : reviewColumns
    const sample = entity === 'faculty'
      ? {
          id: '',
          name: 'Dr. Jane Doe',
          department: 'Computer Science',
          title: 'Associate Professor',
          email: 'jane.doe@example.edu',
          office: 'Room 123',
          phone: '+92-300-0000000',
          specialization: 'AI|ML|NLP',
          courses: 'CS101|CS201',
          education: 'PhD XYZ|MS ABC',
          experience: '10+ years teaching',
          profile_image: 'https://example.com/jane.jpg',
          created_at: ''
        }
      : {
          id: '',
          user_id: '',
          faculty_id: 'uuid-of-faculty',
          student_name: 'student123',
          course: 'CS101',
          semester: 'Fall 2024',
          rating: 5,
          teaching_quality: 5,
          accessibility: 4,
          course_material: 5,
          grading: 4,
          comment: 'Great instructor',
          pros: 'Clear|Helpful',
          cons: 'Fast pace',
          would_recommend: true,
          is_anonymous: false,
          helpful: 0,
          reported: 0,
          status: 'approved',
          created_at: ''
        }
    const csv = [columns.join(','), columns.map((c) => sample[c as keyof typeof sample] ?? '').join(',')].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${entity}-template.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const loadFile = async (f: File) => {
    const content = await f.text()
    setIsCSV(f.name.toLowerCase().endsWith('.csv'))
    setText(content)
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      setResult(null)
      let rows: any[] = []
      if (isCSV) {
        const { headers, rows: raw } = parseCSV(text)
        const required = entity === 'faculty' ? ['name','department'] : ['faculty_id','course','semester','rating','teaching_quality','accessibility','course_material','grading','comment']
        const missing = required.filter(r => !headers.includes(r))
        if (missing.length) {
          toast({ title: 'Invalid CSV', description: `Missing required columns: ${missing.join(', ')}`, variant: 'destructive' })
          return
        }
        rows = csvToJson(headers, raw)
      } else {
        const parsed = JSON.parse(text)
        rows = Array.isArray(parsed) ? parsed : parsed.rows
      }

      if (!rows || rows.length === 0) {
        toast({ title: 'No rows', description: 'Provide at least one row' })
        return
      }

      const payload: any = { rows, upsert, dry_run: dryRun }
      const endpoint = entity === 'faculty' ? '/api/admin/import/faculty' : '/api/admin/import/reviews'
      if (entity === 'reviews') payload.default_status = defaultStatus

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || `Failed with status ${res.status}`)
      setResult(data)
      toast({ title: 'Import processed', description: dryRun ? 'Dry run completed.' : 'Import completed.' })
    } catch (e: any) {
      toast({ title: 'Import failed', description: e.message ?? 'Unknown error', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Bulk Import</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Entity</Label>
          <Select value={entity} onValueChange={(v: any) => setEntity(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="faculty">Faculty</SelectItem>
              <SelectItem value="reviews">Reviews</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {entity === 'reviews' && (
          <div>
            <Label>Default Review Status</Label>
            <Select value={defaultStatus} onValueChange={(v: any) => setDefaultStatus(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">approved</SelectItem>
                <SelectItem value="pending">pending</SelectItem>
                <SelectItem value="rejected">rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="dry" checked={dryRun} onCheckedChange={(v) => setDryRun(!!v)} />
          <Label htmlFor="dry">Dry run</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="upsert" checked={upsert} onCheckedChange={(v) => setUpsert(!!v)} />
          <Label htmlFor="upsert">Upsert by id</Label>
        </div>
        <Button variant="outline" onClick={handleDownloadTemplate}>Download CSV template</Button>
      </div>

      <div className="space-y-2">
        <Label>Upload JSON/CSV file</Label>
        <Input type="file" accept=".json,.csv" onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) { setFile(f); loadFile(f) }
        }} />
      </div>

      <div className="space-y-2">
        <Label>Or paste JSON/CSV</Label>
        <Textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder="[ { ... }, ... ] or CSV rows" />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'Processing...' : (dryRun ? 'Validate (Dry Run)' : 'Import')}</Button>
      </div>

      {result && (
        <div className="rounded-md border p-4 text-sm">
          <pre className="whitespace-pre-wrap break-all">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <section className="prose max-w-none">
        <h2 className="text-xl font-semibold">Validation Rules</h2>
        <ul className="list-disc pl-6">
          <li><b>Faculty required</b>: name, department. Arrays use | in CSV (e.g., specialization, courses, education).</li>
          <li><b>Review required</b>: faculty_id, course, semester, rating, teaching_quality, accessibility, course_material, grading, comment.</li>
          <li><b>Ratings</b>: integers 1-5. Booleans: true/false. Empty cells treated as missing.</li>
          <li><b>Upsert</b>: if checked, rows with existing id update; otherwise insert new rows.</li>
          <li><b>Dry run</b>: validates and shows counts without writing to DB.</li>
        </ul>
      </section>
    </div>
  )
}
