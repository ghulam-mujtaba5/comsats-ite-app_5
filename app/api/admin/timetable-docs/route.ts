import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireAdmin } from '@/lib/admin-access'

const BUCKET = process.env.SUPABASE_TIMETABLES_BUCKET || 'timetables'
const USE_SIGNED_URLS = String(process.env.SUPABASE_USE_SIGNED_URLS || '').toLowerCase() === 'true'
const MAX_FILE_BYTES = 15 * 1024 * 1024 // 15 MB
const ALLOWED_MIME = new Set<string>(['application/pdf'])

async function ensureBucket() {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets()
  const exists = !!buckets?.find((b) => b.name === BUCKET)
  if (!exists) {
    // try to create bucket as public to match current public URL usage
    await supabaseAdmin.storage.createBucket(BUCKET, { public: true })
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  if (searchParams.get('debug') === '1') {
    // list buckets and check existence
    const { data: buckets, error: bErr } = await supabaseAdmin.storage.listBuckets()
    const bucketExists = !!buckets?.find(b => b.name === BUCKET)
    return NextResponse.json({
      bucket: BUCKET,
      bucketExists,
      buckets: buckets?.map(b => ({ name: b.name, public: (b as any).public })) || [],
      error: bErr?.message || null,
    })
  }
  const { data, error } = await supabaseAdmin
    .from('timetable_docs')
    .select('id,title,department,term,size_bytes,mime_type,storage_path,public_url,uploaded_at')
    .order('uploaded_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file') as File | null
  const title = String(form.get('title') || '')
  const department = String(form.get('department') || '')
  const term = String(form.get('term') || '')
  if (!file || !title || !department || !term) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // validate file
  if (!ALLOWED_MIME.has(file.type || '')) {
    return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: `File too large. Max ${(MAX_FILE_BYTES / (1024*1024)).toFixed(0)} MB` }, { status: 400 })
  }

  // ensure bucket exists before upload
  await ensureBucket()

  const arrayBuffer = await file.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)
  const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf'
  const safeDept = department.replace(/[^a-z0-9-_ ]/gi, '').replace(/\s+/g, '_')
  const safeTerm = term.replace(/[^a-z0-9-_ ]/gi, '').replace(/\s+/g, '_')
  const key = `${safeDept}/${safeTerm}/${Date.now()}_${file.name}`

  const { error: upErr } = await supabaseAdmin.storage.from(BUCKET).upload(key, bytes, {
    contentType: file.type || 'application/pdf',
    upsert: false,
  })
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })

  let public_url: string
  if (USE_SIGNED_URLS) {
    const { data: signed, error: sErr } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(key, 60 * 60 * 24 * 7) // 7 days
    if (sErr) return NextResponse.json({ error: sErr.message }, { status: 500 })
    public_url = signed.signedUrl
  } else {
    const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(key)
    public_url = pub.publicUrl
  }

  const { data, error } = await supabaseAdmin.from('timetable_docs').insert({
    title,
    department,
    term,
    size_bytes: file.size,
    mime_type: file.type || 'application/pdf',
    storage_path: key,
    public_url,
  }).select('*').single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData()
  const id = String(form.get('id') || '')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const title = form.get('title') as string | null
  const department = form.get('department') as string | null
  const term = form.get('term') as string | null
  const file = form.get('file') as File | null

  // Fetch existing row for storage path if replacing file
  const { data: existing, error: selErr } = await supabaseAdmin
    .from('timetable_docs')
    .select('id,storage_path')
    .eq('id', id)
    .single()
  if (selErr) return NextResponse.json({ error: selErr.message }, { status: 500 })

  let storage_path = existing?.storage_path as string | null
  let public_url: string | undefined
  let size_bytes: number | undefined
  let mime_type: string | undefined

  if (file) {
    // validate file
    if (!ALLOWED_MIME.has(file.type || '')) {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: `File too large. Max ${(MAX_FILE_BYTES / (1024*1024)).toFixed(0)} MB` }, { status: 400 })
    }
    // ensure bucket exists before upload
    await ensureBucket()
    // remove old file if present
    if (storage_path) {
      await supabaseAdmin.storage.from(BUCKET).remove([storage_path])
    }
    const arrayBuffer = await file.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf'
    const safeTitle = (title || 'doc').replace(/[^a-z0-9-_ ]/gi, '').replace(/\s+/g, '_')
    const key = `updated/${Date.now()}_${safeTitle}.${ext}`
    const { error: upErr } = await supabaseAdmin.storage.from(BUCKET).upload(key, bytes, {
      contentType: file.type || 'application/pdf',
      upsert: false,
    })
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })
    storage_path = key
    if (USE_SIGNED_URLS) {
      const { data: signed, error: sErr } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(key, 60 * 60 * 24 * 7)
      if (sErr) return NextResponse.json({ error: sErr.message }, { status: 500 })
      public_url = signed.signedUrl
    } else {
      const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(key)
      public_url = pub.publicUrl
    }
    size_bytes = file.size
    mime_type = file.type || 'application/pdf'
  }

  const payload: Record<string, any> = {}
  if (title !== null) payload.title = title
  if (department !== null) payload.department = department
  if (term !== null) payload.term = term
  if (storage_path) payload.storage_path = storage_path
  if (public_url) payload.public_url = public_url
  if (size_bytes !== undefined) payload.size_bytes = size_bytes
  if (mime_type !== undefined) payload.mime_type = mime_type

  const { data, error } = await supabaseAdmin
    .from('timetable_docs')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { data: row, error: selErr } = await supabaseAdmin
    .from('timetable_docs')
    .select('id,storage_path')
    .eq('id', id)
    .single()
  if (selErr) return NextResponse.json({ error: selErr.message }, { status: 500 })

  if (row?.storage_path) {
    await supabaseAdmin.storage.from(BUCKET).remove([row.storage_path])
  }
  const { error: delErr } = await supabaseAdmin.from('timetable_docs').delete().eq('id', id)
  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
