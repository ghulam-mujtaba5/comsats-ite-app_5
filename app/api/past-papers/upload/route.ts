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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({ error: 'Service configuration error' }, { status: 500 })
    }

    const authClient = createServerClient(supabaseUrl, anonKey, {
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

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const BUCKET = process.env.SUPABASE_PAST_PAPERS_BUCKET || 'papers'
    const USE_SIGNED_URLS = String(process.env.SUPABASE_USE_SIGNED_URLS || '').toLowerCase() === 'true'

    // Dev fallback: if Supabase env is missing, accept the upload and return a mock response
    if (!supabaseUrl || !anonKey || !serviceKey) {
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
    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Ensure bucket exists
    try {
      const { data: buckets } = await supabaseAdmin.storage.listBuckets()
      const exists = !!buckets?.find((b: any) => b.name === BUCKET)
      if (!exists) {
        await supabaseAdmin.storage.createBucket(BUCKET, { public: !USE_SIGNED_URLS })
      }
    } catch (e) {
      // non-fatal; upload will still attempt
      logError(e as Error, { context: 'bucket_check' })
    }

    let fileUrl: string
    let filePath: string | undefined
    if (hasExternal) {
      fileUrl = externalUrl as string
    } else {
      // Upload file to Supabase Storage
      const sanitizedFilename = (file as File).name.replace(/[^a-zA-Z0-9.-]/g, '_')
      filePath = `past-papers/${Date.now()}-${sanitizedFilename}`
      const { error: uploadError } = await supabaseAdmin.storage.from(BUCKET).upload(filePath, file as File, {
        contentType: (file as any).type || 'application/pdf',
        upsert: false,
      })
      if (uploadError) {
        logError(uploadError, { context: 'file_upload', filePath })
        return NextResponse.json({ error: "Failed to upload file", hint: `Check Storage bucket \"${BUCKET}\" exists and permissions are correct.` }, { status: 500 })
      }
      // Get public or signed URL of the uploaded file
      if (USE_SIGNED_URLS) {
        const { data: signed, error: sErr } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(filePath, 60 * 60 * 24 * 365)
        if (sErr) {
          logError(sErr, { context: 'signed_url', filePath })
          return NextResponse.json({ error: 'Failed to create signed URL' }, { status: 500 })
        }
        fileUrl = signed.signedUrl
      } else {
        const { data: urlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filePath)
        fileUrl = urlData.publicUrl
      }
    }

    // Save paper metadata to the database
    const courseCode = paperData.course === 'Other' 
      ? paperData.courseName?.replace(/\s+/g, '-').toUpperCase() 
      : paperData.course

    const { data, error: dbError } = await supabaseAdmin
      .from("past_papers")
      .insert([{
        title: paperData.title,
        course_code: courseCode,
        course_name: paperData.course === 'Other' ? paperData.courseName : paperData.course,
        exam_type: paperData.examType,
        semester: paperData.semester,
        year: paperData.year || new Date().getFullYear(),
        tags: paperData.tags,
        file_url: fileUrl,
        public_url: fileUrl,
        external_url: hasExternal ? fileUrl : null,
        link_url: hasExternal ? fileUrl : null,
        department: paperData.department,
        file_type: file ? (file.type.includes('pdf') ? 'PDF' : file.type.includes('doc') ? 'DOC' : 'DOCX') : 'Link',
        file_size: file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : null,
        uploaded_by: user.email || user.id,
        user_id: user.id,
        download_count: 0,
        status: 'pending', // Require approval
      }])
      .select()

    if (dbError) {
      logError(dbError, { context: 'database_insert' })
      // If DB insert fails, try to delete the uploaded file
      if (filePath) await supabaseAdmin.storage.from(BUCKET).remove([filePath])
      return NextResponse.json({ error: "Failed to save paper data" }, { status: 500 })
    }

    // Log audit trail
    await logAudit({
      action: AuditAction.CONTENT_APPROVE,
      user_id: user.id,
      user_email: user.email,
      resource_type: 'past_paper',
      resource_id: data?.[0]?.id,
      status: 'success',
      details: {
        title: paperData.title,
        course_code: courseCode,
        exam_type: paperData.examType,
      },
    })

    // Revalidate the specific course page
    try {
      if (courseCode) {
        revalidatePath(`/past-papers/${courseCode}`)
      }
    } catch (e) {
      logError(e as Error, { context: 'revalidate_path' })
    }

    // Return success with rate limit headers
    const res = NextResponse.json({ 
      message: "Paper uploaded successfully and is pending approval", 
      paper: data?.[0] 
    }, { status: 201 })

    Object.entries(getRateLimitHeaders(rateLimitResult)).forEach(([key, value]) => {
      res.headers.set(key, value)
    })

    return res

  } catch (error: any) {
    logError(error, { endpoint: '/api/past-papers/upload' })
    
    if (error?.code || error?.statusCode) {
      const formatted = formatErrorResponse(error)
      return NextResponse.json(formatted, { status: error.statusCode || 500 })
    }

    return NextResponse.json({ 
      error: "An unexpected error occurred. Please try again." 
    }, { status: 500 })
  }
}

