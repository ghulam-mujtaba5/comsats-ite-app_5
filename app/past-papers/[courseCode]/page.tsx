"use client"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaperCard } from "@/components/past-papers/paper-card"
import { UploadPaperDialog } from "@/components/past-papers/upload-paper-dialog"
import { useEffect, useState } from "react"
import { CourseWithPapers } from "@/lib/past-papers-data"
import { ArrowLeft, Upload, FileText, BookOpen, Calendar, Download } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import Loading from "../loading"

interface CoursePageProps {
  params: {
    courseCode: string
  }
}

export default function CoursePage({ params }: CoursePageProps) {
  const [course, setCourse] = useState<CourseWithPapers | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/past-papers/${params.courseCode}`)
        if (!res.ok) {
          throw new Error('Course not found')
        }
        const json = await res.json()
        setCourse(json.data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [params.courseCode])

  if (loading) {
    return <Loading />
  }

  if (error || !course) {
    notFound()
  }

  const handleDownload = (paperId: string) => {
    // Find the paper across all paper types
    const allPapers = [...course.assignments, ...course.quizzes, ...course.midterms, ...course.finals]
    const paper = allPapers.find((p) => p.id === paperId)
    if (!paper) return

    // Create a temporary link element to trigger download
    const link = document.createElement("a")
    link.href = paper.downloadUrl || `/placeholder-paper-${paperId}.pdf`
    link.download = `${paper.title}.${paper.fileType?.toLowerCase() || "pdf"}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log(`Downloaded paper: ${paper.title}`)
  }

  const handleView = (paperId: string) => {
    // Find the paper across all paper types
    const allPapers = [...course.assignments, ...course.quizzes, ...course.midterms, ...course.finals]
    const paper = allPapers.find((p) => p.id === paperId)
    if (!paper) return

    // Open paper in new tab for preview
    const previewUrl = paper.downloadUrl || `/placeholder-paper-${paperId}.pdf`
    window.open(previewUrl, "_blank")

    console.log(`Previewing paper: ${paper.title}`)
  }

  const paperTypes = [
    { key: "assignments", label: "Assignments", icon: FileText, papers: course.assignments, color: "text-blue-500" },
    { key: "quizzes", label: "Quizzes", icon: BookOpen, papers: course.quizzes, color: "text-green-500" },
    { key: "midterms", label: "Midterms", icon: Calendar, papers: course.midterms, color: "text-orange-500" },
    { key: "finals", label: "Finals", icon: Download, papers: course.finals, color: "text-blue-500" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Back Button */}
          <Link href="/past-papers">
            <Button variant="outline" className="mb-6 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>

          {/* Course Header */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">{course.name}</CardTitle>
                    <CardDescription className="text-lg">
                      {course.code} • {course.department} • {course.creditHours} Credit Hours
                    </CardDescription>
                  </div>
                  <UploadPaperDialog courseCode={course.code}>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Paper
                    </Button>
                  </UploadPaperDialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {paperTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <div key={type.key} className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${type.color}`} />
                        <span className="font-medium">
                          {type.papers.length} {type.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Papers Tabs */}
          <Tabs defaultValue="assignments" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {paperTypes.map((type) => (
                <TabsTrigger key={type.key} value={type.key} className="flex items-center gap-2">
                  <type.icon className="h-4 w-4" />
                  {type.label} ({type.papers.length})
                </TabsTrigger>
              ))}
            </TabsList>

            {paperTypes.map((type) => (
              <TabsContent key={type.key} value={type.key} className="mt-6">
                {type.papers.length === 0 ? (
                  <Card className="p-12 text-center">
                    <type.icon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No {type.label} Available</h3>
                    <p className="text-muted-foreground mb-4">
                      Be the first to upload {type.label.toLowerCase()} for this course.
                    </p>
                    <UploadPaperDialog courseCode={course.code}>
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload {type.label.slice(0, -1)}
                      </Button>
                    </UploadPaperDialog>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {type.papers.map((paper) => (
                      <PaperCard key={paper.id} paper={paper} onDownload={handleDownload} onView={handleView} />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
