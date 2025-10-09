import { jsonLdBreadcrumb, createMetadata, jsonLdReviewList } from '@/lib/seo'
import { generateFacultyMetadata, generateFacultySchema } from '@/lib/faculty-seo'
import { type Faculty, type Review, calculateReviewStats } from '@/lib/faculty-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { ReviewCard } from '@/components/faculty/review-card'
import { WriteReviewDialog } from '@/components/faculty/write-review-dialog'
import { Button } from '@/components/ui/button'
import { Star, MapPin, Mail, Phone, BookOpen, GraduationCap, Calendar, PenTool, ThumbsUp } from 'lucide-react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 1800 // 30 minutes; adjust as needed

// Fetch faculty & reviews server-side for SEO
async function fetchFacultyAndReviews(id: string) {
  const hasEnv = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY))
  if (!hasEnv) return { faculty: null, reviews: [] as Review[] }
  try {
    const { supabaseAdmin } = await import('@/lib/supabase-admin')
    // Faculty
    const { data: fData } = await supabaseAdmin.from('faculty').select('*').eq('id', id).maybeSingle()
    if (!fData) return { faculty: null, reviews: [] as Review[] }

    // Reviews (approved only)
    const { data: rData } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('faculty_id', id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(500)

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
  
  // Use the enhanced SEO function
  return generateFacultyMetadata(faculty)
}

// Optional: pre-generate static params for faster TTFB & guaranteed discoverability
export async function generateStaticParams() {
  const hasEnv = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY))
  if (!hasEnv) return []
  try {
    const { supabaseAdmin } = await import('@/lib/supabase-admin')
    const { data } = await supabaseAdmin.from('faculty').select('id').limit(1000)
    return (data || []).map((f: any) => ({ id: f.id }))
  } catch {
    return []
  }
}

function Stars({ rating }: { rating: number }) {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`h-5 w-5 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
      ))}
    </>
  )
}

export default async function FacultyProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { faculty, reviews } = await fetchFacultyAndReviews(id)
  if (!faculty) return notFound()
  const stats = calculateReviewStats(reviews)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
  const facultyUrl = new URL(`/faculty/${faculty.id}`, siteUrl).toString()

  // Use the enhanced schema function
  const personJsonLd = generateFacultySchema(faculty, reviews)

  // Breadcrumb separate object
  const breadcrumbJsonLd = jsonLdBreadcrumb([
    { name: 'Home', path: '/' },
    { name: 'Faculty', path: '/faculty' },
    { name: faculty.name, path: `/faculty/${faculty.id}` },
  ])

  const reviewListJson = jsonLdReviewList({
    facultyName: faculty.name,
    facultyUrl: `/faculty/${faculty.id}`,
    reviews: reviews.slice(0, 20).map(r => ({
      author: r.studentName,
      body: r.comment,
      rating: r.rating,
      date: r.createdAt,
    }))
  })

  const jsonLd = [personJsonLd, breadcrumbJsonLd, reviewListJson]

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-shrink-0">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={faculty.profileImage || '/placeholder-user.jpg'} alt={faculty.name} />
                    <AvatarFallback className="text-2xl">{faculty.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{faculty.name}</h1>
                    {faculty.title && <p className="text-xl text-muted-foreground mb-2">{faculty.title}</p>}
                    {!!faculty.department && (
                      <Badge className="text-base px-3 py-1 bg-secondary text-secondary-foreground border-transparent">{faculty.department}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Stars rating={faculty.averageRating} />
                      <span className="text-xl font-semibold">{faculty.averageRating}</span>
                      <span className="text-muted-foreground">({faculty.totalReviews} reviews)</span>
                    </div>
                    <Badge className="flex items-center gap-1 border">
                      <ThumbsUp className="h-3 w-3" />
                      {stats.recommendationRate}% recommend
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><span>Office: {faculty.office}</span></div>
                    <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><span>{faculty.email}</span></div>
                    {faculty.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span>{faculty.phone}</span></div>}
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span>Joined: {new Date(faculty.joinDate).getFullYear()}</span></div>
                  </div>
                  <div className="pt-4">
                    <WriteReviewDialog faculty={faculty}>
                      <Button className="h-10 px-6"><PenTool className="h-5 w-5 mr-2" />Write Review</Button>
                    </WriteReviewDialog>
                    <p className="text-sm text-muted-foreground mt-2">
                      Share your experience with {faculty.name} to help other students
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              {!!faculty.specialization.length && (
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" />Specialization</CardTitle></CardHeader>
                  <CardContent><div className="flex flex-wrap gap-2">{faculty.specialization.map((s, i) => <Badge key={i} className="border">{s}</Badge>)}</div></CardContent>
                </Card>
              )}
              {!!faculty.education.length && (
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5" />Education</CardTitle></CardHeader>
                  <CardContent><ul className="space-y-2 text-sm">{faculty.education.map((e, i) => <li key={i} className="flex items-start gap-2"><div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />{e}</li>)}</ul></CardContent>
                </Card>
              )}
              {!!faculty.courses.length && (
                <Card>
                  <CardHeader><CardTitle>Courses Taught</CardTitle></CardHeader>
                  <CardContent><ul className="space-y-2 text-sm">{faculty.courses.map((c, i) => <li key={i} className="flex items-start gap-2"><div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />{c}</li>)}</ul></CardContent>
                </Card>
              )}
              <Card>
                <CardHeader><CardTitle>Rating Breakdown</CardTitle></CardHeader>
                <CardContent className="space-y-3">{[5,4,3,2,1].map(r => (
                  <div key={r} className="flex items-center gap-3">
                    <span className="text-sm w-8">{r} ★</span>
                    <Progress value={(stats.ratingDistribution[r] / Math.max(stats.totalReviews, 1)) * 100} className="flex-1" />
                    <span className="text-sm text-muted-foreground w-8">{stats.ratingDistribution[r]}</span>
                  </div>
                ))}</CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Reviews ({reviews.length})</h2>
              </div>
              {reviews.length === 0 ? (
                <Card className="p-8 text-center">
                  <PenTool className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                  <p className="text-muted-foreground mb-4">Be the first to share your experience with {faculty.name}</p>
                  <WriteReviewDialog faculty={faculty}>
                    <Button>Write First Review</Button>
                  </WriteReviewDialog>
                </Card>
              ) : (
                <div className="space-y-4">{reviews.map(r => <ReviewCard key={r.id} review={r} />)}</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}