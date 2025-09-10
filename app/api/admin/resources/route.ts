import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireAdmin } from '@/lib/admin-access'

const BUCKET = process.env['SUPABASE_RESOURCES_BUCKET'] || 'resources'
const USE_SIGNED_URLS = String(process.env['SUPABASE_USE_SIGNED_URLS'] || '').toLowerCase() === 'true'
const MAX_FILE_BYTES = 50 * 1024 * 1024 // 50 MB
const ALLOWED_TYPES = new Set<string>([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'application/zip',
  'image/png',
  'image/jpeg',
])

function normalizeDriveUrl(url: string): string {
  try {
    const u = new URL(url)
    if (u.hostname.includes('drive.google.com')) {
      // Patterns: /file/d/{id}/view, or open?id={id}
      const fileIdMatch = u.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
      const id = fileIdMatch?.[1] || u.searchParams.get('id')
      if (id) {
        // direct download/view link
        return `https://drive.google.com/uc?export=download&id=${id}`
      }
    }
  } catch {}
  return url
}

async function ensureBucket() {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets()
  const exists = !!buckets?.find((b) => b.name === BUCKET)
  if (!exists) {
    await supabaseAdmin.storage.createBucket(BUCKET, { public: true })
  }
}

// List resources
export async function GET(req: NextRequest) {
  const access = await requireAdmin(req)
  if (!access.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  if (searchParams.get('debug') === '1') {
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
    .from('resources')
    .select('id,title,description,department,term,external_url,file_url,size_bytes,mime_type,uploaded_at')
    .order('uploaded_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// Create resource: either external_url OR uploaded file
export async function POST(req: NextRequest) {
  const access = await requireAdmin(req)
  if (!access.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData()
  const title = String(form.get('title') || '')
  const description = String(form.get('description') || '')
  const department = String(form.get('department') || '')
  const term = String(form.get('term') || '')
  let external_url = String(form.get('external_url') || '')
  const file = form.get('file') as File | null

  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  if (!external_url && !file) return NextResponse.json({ error: 'Provide external_url or file' }, { status: 400 })

  let file_url: string | null = null
  let size_bytes: number | null = null
  let mime_type: string | null = null
  let storage_path: string | null = null

  if (external_url) {
    external_url = normalizeDriveUrl(external_url)
  }

  if (file) {
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: `File too large. Max ${(MAX_FILE_BYTES / (1024*1024)).toFixed(0)} MB` }, { status: 400 })
    }
    if (file.type && !ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }
    await ensureBucket()
    const bytes = new Uint8Array(await file.arrayBuffer())
    const safeDept = (department || 'general').replace(/[^a-z0-9-_ ]/gi, '').replace(/\s+/g, '_')
    const safeTerm = (term || 'any').replace(/[^a-z0-9-_ ]/gi, '').replace(/\s+/g, '_')
    const key = `${safeDept}/${safeTerm}/${Date.now()}_${file.name}`
    const { error: upErr } = await supabaseAdmin.storage.from(BUCKET).upload(key, bytes, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    })
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })
    if (USE_SIGNED_URLS) {
      const { data: signed, error: sErr } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(key, 60 * 60 * 24 * 7)
      if (sErr) return NextResponse.json({ error: sErr.message }, { status: 500 })
      file_url = signed.signedUrl
    } else {
      const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(key)
      file_url = pub.publicUrl
    }
    size_bytes = file.size
    mime_type = file.type || 'application/octet-stream'
    storage_path = key
  }

  const { data, error } = await supabaseAdmin
    .from('resources')
    .insert({ title, description, department, term, external_url: external_url || null, file_url, size_bytes, mime_type, storage_path })
    .select('*').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// Update resource; optionally replace file
export async function PUT(req: NextRequest) {
  const access = await requireAdmin(req)
  if (!access.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const form = await req.formData()
  const id = String(form.get('id') || '')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const title = form.get('title') as string | null
  const description = form.get('description') as string | null
  const department = form.get('department') as string | null
  const term = form.get('term') as string | null
  let external_url = form.get('external_url') as string | null
  const file = form.get('file') as File | null

  const { data: existing, error: selErr } = await supabaseAdmin
    .from('resources')
    .select('id,storage_path')
    .eq('id', id)
    .single()
  if (selErr) return NextResponse.json({ error: selErr.message }, { status: 500 })

  let storage_path = existing?.storage_path as string | null
  let file_url: string | undefined
  let size_bytes: number | undefined
  let mime_type: string | undefined

  if (external_url) {
    external_url = normalizeDriveUrl(external_url)
  }

  if (file) {
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: `File too large. Max ${(MAX_FILE_BYTES / (1024*1024)).toFixed(0)} MB` }, { status: 400 })
    }
    if (file.type && !ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }
    await ensureBucket()
    if (storage_path) await supabaseAdmin.storage.from(BUCKET).remove([storage_path])
    const bytes = new Uint8Array(await file.arrayBuffer())
    const key = `updated/${Date.now()}_${file.name}`
    const { error: upErr } = await supabaseAdmin.storage.from(BUCKET).upload(key, bytes, {
      contentType: file.type || 'application/octet-stream', upsert: false,
    })
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })
    if (USE_SIGNED_URLS) {
      const { data: signed, error: sErr } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(key, 60 * 60 * 24 * 7)
      if (sErr) return NextResponse.json({ error: sErr.message }, { status: 500 })
      file_url = signed.signedUrl
    } else {
      const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(key)
      file_url = pub.publicUrl
    }
    storage_path = key
    size_bytes = file.size
    mime_type = file.type || 'application/octet-stream'
  }

  const payload: Record<string, any> = {}
  if (title !== null) payload['title'] = title
  if (description !== null) payload['description'] = description
  if (department !== null) payload['department'] = department
  if (term !== null) payload['term'] = term
  if (external_url !== null) payload['external_url'] = external_url || null
  if (file_url !== undefined) payload['file_url'] = file_url
  if (size_bytes !== undefined) payload['size_bytes'] = size_bytes
  if (mime_type !== undefined) payload['mime_type'] = mime_type
  if (storage_path !== null) payload['storage_path'] = storage_path

  const { data, error } = await supabaseAdmin
    .from('resources')
    .update(payload)
    .eq('id', id)
    .select('*').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// Delete resource + file if any
export async function DELETE(req: NextRequest) {
  const access = await requireAdmin(req)
  if (!access.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { data: row, error: selErr } = await supabaseAdmin
    .from('resources')
    .select('id,storage_path')
    .eq('id', id)
    .single()
  if (selErr) return NextResponse.json({ error: selErr.message }, { status: 500 })
  if (row?.storage_path) {
    await supabaseAdmin.storage.from(BUCKET).remove([row.storage_path])
  }
  const { error: delErr } = await supabaseAdmin.from('resources').delete().eq('id', id)
  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
