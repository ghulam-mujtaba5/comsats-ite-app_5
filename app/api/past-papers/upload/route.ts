import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const paperData = JSON.parse(formData.get("paperData") as string)

    const externalUrl: string | undefined = typeof paperData?.externalUrl === 'string' ? paperData.externalUrl.trim() : undefined
    const hasExternal = !!externalUrl && /^https?:\/\//.test(externalUrl)

    // Validate file if provided
    if (file) {
      const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      const maxSizeBytes = 10 * 1024 * 1024 // 10MB
      if (!(allowed as any).includes((file as any).type)) {
        return NextResponse.json({ error: "Invalid file type. Only PDF, DOC, DOCX are allowed." }, { status: 400 })
      }
      if ((file as any).size > maxSizeBytes) {
        return NextResponse.json({ error: "File too large. Max size is 10MB." }, { status: 400 })
      }
    }
    // Must provide either a file or an external link
    if (!file && !hasExternal) {
      return NextResponse.json({ error: "Provide a file or a valid external link (https://)" }, { status: 400 })
    }

    // Validate required fields
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

    // Dev fallback: if Supabase env is missing, accept the upload and return a mock response
    if (!supabaseUrl || !supabaseAnonKey) {
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
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    let publicUrl: string
    let filePath: string | undefined
    if (hasExternal) {
      publicUrl = externalUrl as string
    } else {
      // Upload file to Supabase Storage
      filePath = `past-papers/${Date.now()}-${(file as File).name}`
      const { error: uploadError } = await supabase.storage.from("papers").upload(filePath, file as File)
      if (uploadError) {
        console.error("Supabase upload error:", uploadError)
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
      }
      // Get public URL of the uploaded file
      const { data: urlData } = supabase.storage.from("papers").getPublicUrl(filePath)
      publicUrl = urlData.publicUrl
    }

    // 3. Save paper metadata to the database
    const { data, error: dbError } = await supabase
      .from("past_papers")
      .insert([
        {
          title: paperData.title,
          course_code: paperData.course === 'Other' ? paperData.courseName.replace(/\s+/g, '-').toUpperCase() : paperData.course,
          exam_type: paperData.examType,
          semester: paperData.semester,
          year: paperData.year,
          tags: paperData.tags,
          download_url: publicUrl,
          department: paperData.department,
        },
      ])
      .select()

    if (dbError) {
      console.error("Supabase DB error:", dbError)
      // If DB insert fails, try to delete the uploaded file
      if (filePath) await supabase.storage.from("papers").remove([filePath])
      return NextResponse.json({ error: "Failed to save paper data" }, { status: 500 })
    }

    // Revalidate the specific course page
    try {
      const code = data?.[0]?.course_code || (paperData.course === 'Other' ? paperData.courseName.replace(/\s+/g, '-').toUpperCase() : paperData.course)
      if (code) revalidatePath(`/past-papers/${code}`)
    } catch {}

    return NextResponse.json({ message: "Paper uploaded successfully", paper: data }, { status: 200 })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

