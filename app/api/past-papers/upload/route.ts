import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { rateLimit, RateLimitPresets, getRateLimitHeaders } from "@/lib/rate-limit"
import { pastPaperUploadSchema, validateData, fileUploadSchema } from "@/lib/validation"
import { Errors, formatErrorResponse, logError } from "@/lib/errors"
import { logAudit, AuditAction } from "@/lib/audit"

export async function POST(req: NextRequest) {
  try {
    // Step 1: Authenticate user
    const cookieStore = await cookies()
    const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!publicUrl || !anonKey) {
      return NextResponse.json({ error: 'Service configuration error' }, { status: 500 })
    }

    const authClient = createServerClient(publicUrl, anonKey, {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    })

    const { data: { user } } = await authClient.auth.getUser()
    
    if (!user) {
      throw Errors.authRequired()
    }

    // Step 2: Rate limiting (per user)
    const rateLimitResult = await rateLimit(req, {
      ...RateLimitPresets.upload,
      keyGenerator: () => `upload:user:${user.id}`,
    })

    if (!rateLimitResult.success) {
      const res = NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimitResult.retryAfter },
        { status: 429 }
      )
      Object.entries(getRateLimitHeaders(rateLimitResult)).forEach(([key, value]) => {
        res.headers.set(key, value)
      })
      return res
    }

    // Step 3: Parse and validate form data
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const paperDataRaw = formData.get("paperData") as string

    if (!paperDataRaw) {
      return NextResponse.json({ error: 'Paper data is required' }, { status: 400 })
    }

    let paperData: any
    try {
      paperData = JSON.parse(paperDataRaw)
    } catch {
      return NextResponse.json({ error: 'Invalid paper data format' }, { status: 400 })
    }

    // Validate paper data
    const validation = validateData(pastPaperUploadSchema, paperData)
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.errors 
      }, { status: 400 })
    }

    const validatedData = validation.data
    const externalUrl = validatedData.externalUrl
    const hasExternal = !!externalUrl && /^https?:\/\//.test(externalUrl)

    // Step 4: Validate file if provided
    if (file) {
      const fileValidation = validateData(fileUploadSchema, {
        size: file.size,
        type: file.type,
      })

      if (!fileValidation.success) {
        return NextResponse.json({
          error: 'Invalid file',
          details: fileValidation.errors
        }, { status: 400 })
      }
    }

    // Must provide either file or external URL
    if (!file && !hasExternal) {
      return NextResponse.json({ 
        error: "Provide a file or a valid external link (https://)" 
      }, { status: 400 })
    }
    const required = ["title", "department", "examType", "semester", "year"]
    for (const key of required) {
      if (!paperData?.[key] || String(paperData[key]).trim() === "") {
        return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 })
      }
    }
    if (!paperData?.course) {
      return NextResponse.json({ error: "Missing field: course" }, { status: 400 })
    }
    if (paperData.course === 'Other') {
      if (!paperData.courseName || String(paperData.courseName).trim() === '') {
        return NextResponse.json({ error: "Missing field: courseName (required when course is 'Other')" }, { status: 400 })
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const BUCKET = process.env.SUPABASE_PAST_PAPERS_BUCKET || 'papers'
    const USE_SIGNED_URLS = String(process.env.SUPABASE_USE_SIGNED_URLS || '').toLowerCase() === 'true'

    // Dev fallback: if Supabase env is missing, accept the upload and return a mock response
    if (!supabaseUrl || !supabaseAnonKey || !serviceKey) {
      const mockPublicUrl = file ? `https://example.com/mock/${Date.now()}-${encodeURIComponent(file.name)}` : (externalUrl as string)
      const mockPaper = [{
        id: `mock-${Date.now()}`,
        title: paperData.title,
        course_code: paperData.course === 'Other' ? paperData.courseName?.replace(/\s+/g, '-').toUpperCase() : paperData.course,
        exam_type: paperData.examType,
        semester: paperData.semester,
        year: paperData.year,
        tags: paperData.tags,
        download_url: mockPublicUrl,
        department: paperData.department,
        created_at: new Date().toISOString(),
      }]
      // In dev fallback, proactively revalidate the course page route
      try {
        const code = paperData.course === 'Other' ? paperData.courseName?.replace(/\s+/g, '-').toUpperCase() : paperData.course
        if (code) revalidatePath(`/past-papers/${code}`)
      } catch {}
      return NextResponse.json(
        {
          message: "Paper uploaded (dev mode). File not persisted — configure Supabase to enable storage.",
          paper: mockPaper,
        },
        { status: 200 }
      )
    }

    // With Supabase configured: proceed with real upload + DB insert
    const supabaseAdmin = createClient(supabaseUrl, serviceKey)
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey)

    // Ensure bucket exists
    try {
      const { data: buckets } = await supabaseAdmin.storage.listBuckets()
      const exists = !!buckets?.find((b: any) => b.name === BUCKET)
      if (!exists) {
        await supabaseAdmin.storage.createBucket(BUCKET, { public: !USE_SIGNED_URLS })
      }
    } catch (e) {
      // non-fatal; upload will still attempt
    }

    let publicUrl: string
    let filePath: string | undefined
    if (hasExternal) {
      publicUrl = externalUrl as string
    } else {
      // Upload file to Supabase Storage
      filePath = `past-papers/${Date.now()}-${(file as File).name}`
      const { error: uploadError } = await supabaseAdmin.storage.from(BUCKET).upload(filePath, file as File, {
        contentType: (file as any).type || 'application/pdf',
        upsert: false,
      })
      if (uploadError) {
        console.error("Supabase upload error:", uploadError)
        return NextResponse.json({ error: "Failed to upload file", hint: `Check Storage bucket \"${BUCKET}\" exists and permissions are correct.` }, { status: 500 })
      }
      // Get public or signed URL of the uploaded file
      if (USE_SIGNED_URLS) {
        const { data: signed, error: sErr } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(filePath, 60 * 60 * 24 * 7)
        if (sErr) return NextResponse.json({ error: 'Failed to create signed URL' }, { status: 500 })
        publicUrl = signed.signedUrl
      } else {
        const { data: urlData } = supabaseAnon.storage.from(BUCKET).getPublicUrl(filePath)
        publicUrl = urlData.publicUrl
      }
    }

    // 3. Save paper metadata to the database
    const { data, error: dbError } = await supabaseAdmin
      .from("past_papers")
      .insert([
        {
          title: paperData.title,
          course_code: paperData.course === 'Other' ? paperData.courseName.replace(/\s+/g, '-').toUpperCase() : paperData.course,
          course_name: paperData.course === 'Other' ? paperData.courseName : paperData.course,
          exam_type: paperData.examType,
          semester: paperData.semester,
          year: paperData.year,
          tags: paperData.tags,
          file_url: publicUrl,
          public_url: publicUrl,
          external_url: hasExternal ? publicUrl : null,
          link_url: hasExternal ? publicUrl : null,
          department: paperData.department,
          file_type: file ? (file.type.includes('pdf') ? 'PDF' : file.type.includes('doc') ? 'DOC' : 'DOCX') : 'Link',
          file_size: file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : null,
          uploaded_by: 'Anonymous', // TODO: Get from auth context
          download_count: 0,
          status: 'approved', // Changed from 'pending' to 'approved' so papers show up immediately
        },
      ])
      .select()

    if (dbError) {
      console.error("Supabase DB error:", dbError)
      // If DB insert fails, try to delete the uploaded file
      if (filePath) await supabaseAdmin.storage.from(BUCKET).remove([filePath])
      return NextResponse.json({ error: "Failed to save paper data" }, { status: 500 })
    }

    // Revalidate the specific course page
    try {
      const code = data?.[0]?.course_code || (paperData.course === 'Other' ? paperData.courseName.replace(/\s+/g, '-').toUpperCase() : paperData.course)
      if (code) revalidatePath(`/past-papers/${code}`)
    } catch {}

    // Increment rate bucket on success and return rate headers
    bucket.count += 1
    const res = NextResponse.json({ message: "Paper uploaded successfully", paper: data }, { status: 200 })
    res.headers.set('X-RateLimit-Limit', String(RATE_LIMIT))
    res.headers.set('X-RateLimit-Remaining', String(Math.max(0, RATE_LIMIT - bucket.count)))
    res.headers.set('X-RateLimit-Reset', String(bucket.resetAt))
    return res
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

