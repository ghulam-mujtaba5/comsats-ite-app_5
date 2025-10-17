import { jsonLdBreadcrumb, createMetadata, jsonLdReviewList } from '@/lib/seo'
import "../faculty.light.module.css"
import "../faculty.dark.module.css"
import { generateFacultyMetadata, generateFacultySchema, generateFacultyFAQSchema } from '@/lib/faculty-seo-advanced'
import { type Faculty, type Review } from '@/lib/faculty-data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import FacultyProfileClient from './faculty-client'

export const revalidate = 3600 // 1 hour (increased from 30 minutes to reduce function invocations)

// Fetch faculty & reviews server-side for SEO
async function fetchFacultyAndReviews(id: string) {
  const hasEnv = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY))
  if (!hasEnv) return { faculty: null, reviews: [] as Review[] }
  try {
    const { supabaseAdmin } = await import('@/lib/supabase-admin')
    // Faculty - select only necessary fields to reduce data transfer and CPU usage
    const { data: fData } = await supabaseAdmin.from('faculty').select(`
      id,
      name,
      title,
      department,
      email,
      office,
      phone,
      specialization,
      courses,
      education,
      experience,
      profile_image,
      rating_avg,
      rating_count,
      created_at
    `).eq('id', id).eq('status', 'approved').maybeSingle()
    if (!fData) return { faculty: null, reviews: [] as Review[] }

    // Reviews (approved only) - limit to 100 to reduce data transfer
    // Select only necessary fields for reviews
    const { data: rData } = await supabaseAdmin
      .from('reviews')
      .select(`
        id,
        faculty_id,
        student_name,
        is_anonymous,
        course,
        semester,
        rating,
        teaching_quality,
        accessibility,
        course_material,
        grading,
        comment,
        pros,
        cons,
        would_recommend,
        created_at,
        helpful,
        reported
      `)
      .eq('faculty_id', id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(100) // Reduced from 500 to 100 to reduce data transfer

    const faculty: Faculty = {
      id: fData.id,
      name: fData.name,
      title: fData.title || '',
      department: fData.department || '',
      email: fData.email || '',
      office: fData.office || '',
      phone: fData.phone || undefined,
      specialization: fData.specialization || [],
      courses: fData.courses || [],
      education: fData.education || [],
      experience: fData.experience || '',
      profileImage: fData.profile_image || undefined,
      averageRating: Number(fData.rating_avg ?? 0),
      totalReviews: Number(fData.rating_count ?? 0),
      joinDate: fData.created_at || new Date().toISOString(),
    }

    const reviews: Review[] = (rData || []).map((row: any) => ({
      id: row.id,
      facultyId: row.faculty_id,
      studentName: row.is_anonymous ? 'Anonymous Student' : row.student_name || 'Student',
      studentId: '',
      course: row.course,
      semester: row.semester,
      rating: Number(row.rating),
      teachingQuality: Number(row.teaching_quality),
      accessibility: Number(row.accessibility),
      courseMaterial: Number(row.course_material),
      grading: Number(row.grading),
      comment: row.comment,
      pros: row.pros || [],
      cons: row.cons || [],
      wouldRecommend: !!row.would_recommend,
      isAnonymous: !!row.is_anonymous,
      createdAt: row.created_at,
      helpful: Number(row.helpful ?? 0),
      reported: Number(row.reported ?? 0),
    }))

    return { faculty, reviews }
  } catch (e) {
    console.warn('[faculty page] fetch failed', e)
    return { faculty: null, reviews: [] as Review[] }
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const { faculty } = await fetchFacultyAndReviews(id)
  if (!faculty) {
    return createMetadata({ title: 'Faculty Profile', description: 'Faculty profile not found.' })
  }
  
  // Extract campus from email for better SEO
  const campus = faculty.email?.includes('lahore') ? 'Lahore' : 
                faculty.email?.includes('attock') ? 'Attock' :
                faculty.email?.includes('wah') ? 'Wah' :
                faculty.email?.includes('abbottabad') ? 'Abbottabad' :
                faculty.email?.includes('sahiwal') ? 'Sahiwal' :
                faculty.email?.includes('vehari') ? 'Vehari' : 'Islamabad'
  
  // Use the ADVANCED SEO function with campus
  return generateFacultyMetadata(faculty, campus)
}

// Optional: pre-generate static params for faster TTFB & guaranteed discoverability
export async function generateStaticParams() {
  const hasEnv = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY))
  if (!hasEnv) return []
  try {
    const { supabaseAdmin } = await import('@/lib/supabase-admin')
    // Limit to 50 faculty members to reduce build time and resource usage
    const { data } = await supabaseAdmin.from('faculty').select('id').eq('status', 'approved').limit(50)
    return (data || []).map((f: any) => ({ id: f.id }))
  } catch {
    return []
  }
}

export default async function FacultyProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { faculty, reviews } = await fetchFacultyAndReviews(id)
  if (!faculty) return notFound()
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
  
  // Extract campus for SEO
  const campus = faculty.email?.includes('lahore') ? 'Lahore' : 
                faculty.email?.includes('attock') ? 'Attock' :
                faculty.email?.includes('wah') ? 'Wah' :
                faculty.email?.includes('abbottabad') ? 'Abbottabad' :
                faculty.email?.includes('sahiwal') ? 'Sahiwal' :
                faculty.email?.includes('vehari') ? 'Vehari' : 'Islamabad'

  // Use the ADVANCED schema function with campus
  const personJsonLd = generateFacultySchema(faculty, reviews, campus)
  
  // Generate FAQ schema for better SEO (rich snippets)
  const faqJsonLd = generateFacultyFAQSchema(faculty)

  // Breadcrumb separate object
  const breadcrumbJsonLd = jsonLdBreadcrumb([
    { name: 'Home', path: '/' },
    { name: 'Faculty', path: '/faculty' },
    { name: faculty.name, path: `/faculty/${faculty.id}` },
  ])

  const reviewListJson = jsonLdReviewList({
    facultyName: faculty.name,
    facultyUrl: `/faculty/${faculty.id}`,
    reviews: reviews.slice(0, 20).map(r => ({ // Limit to 20 reviews for JSON-LD
      author: r.studentName,
      body: r.comment,
      rating: r.rating,
      date: r.createdAt,
    }))
  })

  // Combine all schemas for maximum SEO impact
  const jsonLd = [personJsonLd, faqJsonLd, breadcrumbJsonLd, reviewListJson]

  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FacultyProfileClient initialFaculty={faculty} initialReviews={reviews} />
    </>
  )
}