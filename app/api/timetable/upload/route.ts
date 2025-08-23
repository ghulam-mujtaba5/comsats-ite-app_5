import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const title = String(formData.get('title') || '').trim()
    const department = String(formData.get('department') || '').trim()
    const term = String(formData.get('term') || '').trim()

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!title) return NextResponse.json({ error: 'Missing field: title' }, { status: 400 })
    if (!department) return NextResponse.json({ error: 'Missing field: department' }, { status: 400 })

    const allowed = ['application/pdf']
    const maxSizeBytes = 15 * 1024 * 1024 // 15 MB
    const anyFile = file as any
    if (!allowed.includes(anyFile.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF allowed.' }, { status: 400 })
    }
    if (anyFile.size > maxSizeBytes) {
      return NextResponse.json({ error: 'File too large. Max size is 15MB.' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // Dev fallback: if env is missing, accept and return a mock response
    if (!url || !anonKey || !serviceKey) {
      const mockUrl = `https://example.com/timetable/${Date.now()}-${encodeURIComponent(anyFile.name)}`
      return NextResponse.json({
        message: 'Timetable uploaded (dev mode). File not persisted — configure Supabase env and a Storage bucket named "timetable".',
        doc: {
          id: `mock-${Date.now()}`,
          title,
          department,
          term,
          size_bytes: anyFile.size,
          mime_type: anyFile.type,
          storage_path: `timetable/mock/${Date.now()}-${anyFile.name}`,
          public_url: mockUrl,
          uploaded_at: new Date().toISOString(),
        },
      })
    }

    const supabase = createClient(url, serviceKey)

    // Upload to Storage bucket "timetable"
    const storagePath = `pdfs/${Date.now()}-${anyFile.name}`
    const { error: uploadErr } = await supabase.storage.from('timetable').upload(storagePath, file, {
      contentType: anyFile.type || 'application/pdf',
      upsert: false,
    })
    if (uploadErr) {
      return NextResponse.json({ error: 'Failed to upload file to Storage', hint: 'Ensure Storage bucket named "timetable" exists and you have permissions.' }, { status: 500 })
    }

    // Public URL
    const anonClient = createClient(url, anonKey)
    const { data: publicUrlData } = anonClient.storage.from('timetable').getPublicUrl(storagePath)
    const publicUrl = publicUrlData.publicUrl

    // Insert row to timetable_docs using service role (bypass RLS for insert)
    const { data, error: dbErr } = await supabase
      .from('timetable_docs')
      .insert([
        {
          title,
          department,
          term: term || null,
          size_bytes: anyFile.size,
          mime_type: anyFile.type || 'application/pdf',
          storage_path: storagePath,
          public_url: publicUrl,
        },
      ])
      .select()

    if (dbErr) {
      // best-effort cleanup: remove file
      try { await supabase.storage.from('timetable').remove([storagePath]) } catch {}
      return NextResponse.json({ error: 'Failed to save document metadata' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Timetable uploaded', doc: data?.[0] }, { status: 200 })
  } catch (e) {
    console.error('Timetable upload error:', e)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
