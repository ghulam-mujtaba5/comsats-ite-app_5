"use client"

import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ReviewCard } from "@/components/faculty/review-card"
import { WriteReviewDialog } from "@/components/faculty/write-review-dialog"
import { type Faculty, type Review, calculateReviewStats } from "@/lib/faculty-data"
import { Star, MapPin, Mail, Phone, BookOpen, GraduationCap, Calendar, PenTool, ThumbsUp } from "lucide-react"
import { notFound } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"

interface FacultyProfilePageProps {
  params: { id: string }
}

export default function FacultyProfilePage({ params }: FacultyProfilePageProps) {
  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      const [{ data: fData, error: fErr }, { data: rData, error: rErr }] = await Promise.all([
        supabase.from("faculty").select("*").eq("id", params.id).maybeSingle(),
        supabase
          .from("reviews")
          .select("*")
          .eq("faculty_id", params.id)
          .order("created_at", { ascending: false }),
      ])

      if (fErr) {
        setError(fErr.message)
        setLoading(false)
        return
      }
      if (!fData) {
        setLoading(false)
        setFaculty(null)
        return
      }

      const mappedFaculty: Faculty = {
        id: fData.id,
        name: fData.name,
        title: fData.title || "",
        department: fData.department || "",
        email: fData.email || "",
        office: fData.office || "",
        phone: fData.phone || undefined,
        specialization: fData.specialization || [],
        courses: fData.courses || [],
        education: fData.education || [],
        experience: fData.experience || "",
        profileImage: fData.profile_image || undefined,
        averageRating: Number(fData.rating_avg ?? 0),
        totalReviews: Number(fData.rating_count ?? 0),
        joinDate: fData.created_at || new Date().toISOString(),
      }

      if (rErr) {
        setError(rErr.message)
      }

      const mappedReviews: Review[] = (rData || []).map((row: any) => ({
        id: row.id,
        facultyId: row.faculty_id,
        studentName: row.is_anonymous ? "Anonymous Student" : row.student_name || "Student",
        studentId: "",
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

      setFaculty(mappedFaculty)
      setReviews(mappedReviews)
      setLoading(false)
    }
    load()
  }, [params.id])

  const stats = useMemo(() => calculateReviewStats(reviews), [reviews])

  if (!loading && !faculty) {
    notFound()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {loading && (
            <Card className="mb-8">
              <CardContent className="p-8">Loading...</CardContent>
            </Card>
          )}
          {error && (
            <Card className="mb-8">
              <CardContent className="p-8 text-red-600">{error}</CardContent>
            </Card>
          )}
          {/* Faculty Profile Header */}
          {faculty && (
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-shrink-0">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={faculty.profileImage || "/placeholder.svg"} alt={faculty.name} />
                      <AvatarFallback className="text-2xl">
                        {faculty.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">{faculty.name}</h1>
                      <p className="text-xl text-muted-foreground mb-2">{faculty.title}</p>
                      <Badge className="text-base px-3 py-1 bg-secondary text-secondary-foreground border-transparent">
                        {faculty.department}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {renderStars(faculty.averageRating)}
                        <span className="text-xl font-semibold">{faculty.averageRating}</span>
                        <span className="text-muted-foreground">({faculty.totalReviews} reviews)</span>
                      </div>
                      <Badge className="flex items-center gap-1 border">
                        <ThumbsUp className="h-3 w-3" />
                        {stats.recommendationRate}% recommend
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>Office: {faculty.office}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{faculty.email}</span>
                      </div>
                      {faculty.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{faculty.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Joined: {new Date(faculty.joinDate).getFullYear()}</span>
                      </div>
                    </div>

                    <WriteReviewDialog faculty={faculty}>
                      <Button className="h-10 px-6">
                        <PenTool className="h-5 w-5 mr-2" />
                        Write Review
                      </Button>
                    </WriteReviewDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Faculty Details */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Specialization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {faculty?.specialization.map((spec, index) => (
                      <Badge key={index} className="border">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {faculty?.education.map((edu, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        {edu}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Courses Taught</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {faculty?.courses.map((course, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                        {course}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Rating Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Rating Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-sm w-8">{rating} ★</span>
                      <Progress
                        value={(stats.ratingDistribution[rating] / Math.max(stats.totalReviews, 1)) * 100}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-8">{stats.ratingDistribution[rating]}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Reviews */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Reviews ({reviews.length})</h2>
              </div>

              {reviews.length === 0 ? (
                <Card className="p-8 text-center">
                  <PenTool className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to share your experience with {faculty?.name}
                  </p>
                  {faculty && (
                    <WriteReviewDialog faculty={faculty}>
                      <Button>Write First Review</Button>
                    </WriteReviewDialog>
                  )}
                </Card>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
