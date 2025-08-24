import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    // Admin-only: allow if dev admin cookies set OR authenticated admin in DB
    const devCookie = req.cookies.get('dev_admin')?.value
    const iteCookie = req.cookies.get('ite_admin')?.value
    let isAdmin = devCookie === '1' || iteCookie === '1'

    if (!isAdmin) {
      const cookieStore = await (cookies() as any)
      const rhc = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) { return cookieStore.get(name)?.value },
            set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
            remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
          },
        }
      )
      const { data: { user } } = await rhc.auth.getUser()
      if (user) {
        const { data: adminUser } = await rhc
          .from('admin_users')
          .select('id')
          .eq('user_id', user.id)
          .single()
        isAdmin = !!adminUser
      }
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const title = String(formData.get('title') || '').trim()
    const department = String(formData.get('department') || '').trim()
    const term = String(formData.get('term') || '').trim()
    const externalUrlRaw = String(formData.get('externalUrl') || '').trim()
    const hasExternal = !!externalUrlRaw && /^https?:\/\//.test(externalUrlRaw)

    if (!file && !hasExternal) return NextResponse.json({ error: 'Provide a PDF file or a valid external link (https://)' }, { status: 400 })
    if (!title) return NextResponse.json({ error: 'Missing field: title' }, { status: 400 })
    if (!department) return NextResponse.json({ error: 'Missing field: department' }, { status: 400 })

    const allowed = ['application/pdf']
    const maxSizeBytes = 15 * 1024 * 1024 // 15 MB
    const anyFile = file as any
    if (file) {
      if (!allowed.includes(anyFile.type)) {
        return NextResponse.json({ error: 'Invalid file type. Only PDF allowed.' }, { status: 400 })
      }
      if (anyFile.size > maxSizeBytes) {
        return NextResponse.json({ error: 'File too large. Max size is 15MB.' }, { status: 400 })
      }
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const BUCKET = process.env.SUPABASE_TIMETABLES_BUCKET || 'timetables'
    const USE_SIGNED_URLS = String(process.env.SUPABASE_USE_SIGNED_URLS || '').toLowerCase() === 'true'

    // Dev fallback: if env is missing, accept and return a mock response
    if (!url || !anonKey || !serviceKey) {
      const mockUrl = hasExternal ? externalUrlRaw : `https://example.com/timetable/${Date.now()}-${encodeURIComponent(anyFile.name)}`
      return NextResponse.json({
        message: 'Timetable uploaded (dev mode). File not persisted — configure Supabase env and a Storage bucket named "timetable".',
        doc: {
          id: `mock-${Date.now()}`,
          title,
          department,
          term,
          size_bytes: hasExternal ? null : anyFile.size,
          mime_type: hasExternal ? null : anyFile.type,
          storage_path: hasExternal ? null : `timetable/mock/${Date.now()}-${anyFile.name}`,
          public_url: mockUrl,
          uploaded_at: new Date().toISOString(),
        },
      })
    }

    const supabase = createClient(url, serviceKey)

    // Ensure bucket exists (align with admin API behavior)
    try {
      const { data: buckets } = await supabase.storage.listBuckets()
      const exists = !!buckets?.find(b => (b as any).name === BUCKET)
      if (!exists) {
        await supabase.storage.createBucket(BUCKET, { public: !USE_SIGNED_URLS })
      }
    } catch (e) {
      // Non-fatal; upload will still attempt and return a clearer error if it fails
    }

    let publicUrl: string
    let storagePath: string | null = null
    if (hasExternal) {
      publicUrl = externalUrlRaw
    } else {
      // Upload to Storage bucket (standardized)
      storagePath = `pdfs/${Date.now()}-${anyFile.name}`
      const { error: uploadErr } = await supabase.storage.from(BUCKET).upload(storagePath, file as File, {
        contentType: anyFile.type || 'application/pdf',
        upsert: false,
      })
      if (uploadErr) {
        return NextResponse.json({
          error: 'Failed to upload file to Storage',
          hint: `Ensure Storage bucket named "${BUCKET}" exists and that your Service Role key is valid. ${uploadErr.message || ''}`.trim(),
        }, { status: 500 })
      }

      // Public or signed URL
      if (USE_SIGNED_URLS) {
        const { data: signed, error: sErr } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, 60 * 60 * 24 * 7)
        if (sErr) return NextResponse.json({ error: 'Failed to create signed URL' }, { status: 500 })
        publicUrl = signed.signedUrl
      } else {
        const anonClient = createClient(url, anonKey)
        const { data: publicUrlData } = anonClient.storage.from(BUCKET).getPublicUrl(storagePath)
        publicUrl = publicUrlData.publicUrl
      }
    }

    // Insert row to timetable_docs using service role (bypass RLS for insert)
    const { data, error: dbErr } = await supabase
      .from('timetable_docs')
      .insert([
        {
          title,
          department,
          term: term || null,
          size_bytes: hasExternal ? null : anyFile.size,
          mime_type: hasExternal ? null : (anyFile.type || 'application/pdf'),
          storage_path: storagePath,
          public_url: publicUrl,
        },
      ])
      .select()

    if (dbErr) {
      // best-effort cleanup: remove file
      try { if (storagePath) await supabase.storage.from(BUCKET).remove([storagePath]) } catch {}
      return NextResponse.json({ error: 'Failed to save document metadata' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Timetable uploaded', doc: data?.[0] }, { status: 200 })
  } catch (e) {
    console.error('Timetable upload error:', e)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
