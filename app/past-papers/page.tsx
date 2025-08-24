"use client"

import { jsonLdBreadcrumb } from "@/lib/seo"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { CourseCard } from "@/components/past-papers/course-card"
import { UploadPaperDialog } from "@/components/past-papers/upload-paper-dialog"
import {
  departments,
  examTypes,
  semesters,
  years,
  type CourseWithPapers,
  type PastPaper,
} from "@/lib/past-papers-data"
import { Upload, FileText, Download, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { AdvancedFilterBar } from "@/components/search/advanced-filter-bar"

 

export default function PastPapersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [selectedExamType, setSelectedExamType] = useState("All")
  const [selectedSemester, setSelectedSemester] = useState("All")
  const [selectedYear, setSelectedYear] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [coursesWithPapers, setCoursesWithPapers] = useState<CourseWithPapers[]>([])

  // Fetch approved past papers from API and group by course_code
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        // Server will further filter; we also filter client-side for richer UX
        if (selectedSemester !== "All") params.set("semester", selectedSemester)
        if (selectedYear !== "All") params.set("year", selectedYear)
        if (searchTerm) params.set("q", searchTerm)
        const res = await fetch(`/api/past-papers?${params.toString()}`, { cache: "no-store" })
        const json = await res.json()
        const rows: any[] = Array.isArray(json.data) ? json.data : []

        // Map DB rows to PastPaper-like items
        const papers: PastPaper[] = rows.map((r) => ({
          id: r.id,
          title: r.title,
          course: r.course_name || r.course_code,
          courseCode: r.course_code,
          department: r.department || "",
          semester: r.semester || "",
          year: Number(r.year) || new Date(r.created_at).getFullYear(),
          examType: (r.exam_type === 'Midterm' ? 'Mid-Term' : r.exam_type) || 'Mid-Term',
          uploadedBy: r.uploaded_by || "",
          uploadDate: r.created_at || new Date().toISOString(),
          downloadCount: r.download_count || 0,
          fileSize: r.file_size || "",
          fileType: (r.file_type || "PDF").toUpperCase(),
          downloadUrl: r.public_url || r.external_url || undefined,
          tags: Array.isArray(r.tags) ? r.tags : [],
        }))

        // Group by courseCode
        const map = new Map<string, CourseWithPapers>()
        for (const p of papers) {
          if (!map.has(p.courseCode)) {
            map.set(p.courseCode, {
              id: p.courseCode,
              name: p.course,
              code: p.courseCode,
              creditHours: 3,
              department: p.department || "",
              totalPapers: 0,
              assignments: [],
              quizzes: [],
              midterms: [],
              finals: [],
              lastUpdated: "1970-01-01",
            })
          }
          const c = map.get(p.courseCode)!
          c.totalPapers += 1
          // Normalize exam type buckets
          switch (p.examType) {
            case "Assignment":
              c.assignments.push(p)
              break
            case "Quiz":
              c.quizzes.push(p)
              break
            case "Mid-Term":
              c.midterms.push(p)
              break
            case "Final":
            default:
              c.finals.push(p)
          }
          if (p.uploadDate > c.lastUpdated) c.lastUpdated = p.uploadDate
        }

        setCoursesWithPapers(Array.from(map.values()))
      } catch (e: any) {
        setError(e.message || "Failed to load past papers")
      } finally {
        setLoading(false)
      }
    }
    load()
    // Re-run when top-level filters change; department and examType are applied client-side below
  }, [searchTerm, selectedSemester, selectedYear])

  const filteredCourses = useMemo(() => {
    // Filter courses by search term and department first
    const preliminaryFiltered = coursesWithPapers.filter((course) => {
      const matchesSearch =
        !searchTerm ||
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDepartment = selectedDepartment === "All" || course.department === selectedDepartment
      return matchesSearch && matchesDepartment
    })

    // If no other filters are active, return the preliminary results
    if (selectedExamType === "All" && selectedSemester === "All" && selectedYear === "All") {
      return preliminaryFiltered
    }

    // Otherwise, filter deeper by checking papers within each course
    return preliminaryFiltered
      .map((course) => {
        const papers = [
          ...course.assignments,
          ...course.quizzes,
          ...course.midterms,
          ...course.finals,
        ]

        const filteredPapers = papers.filter(
          (p) =>
            (selectedExamType === "All" || p.examType === selectedExamType) &&
            (selectedSemester === "All" || p.semester === selectedSemester) &&
            (selectedYear === "All" || p.year.toString() === selectedYear)
        )

        // Return a new course object with only the filtered papers
        return {
          ...course,
          totalPapers: filteredPapers.length,
        }
      })
      .filter((course) => course.totalPapers > 0) // Only include courses that still have papers after filtering
  }, [coursesWithPapers, searchTerm, selectedDepartment, selectedExamType, selectedSemester, selectedYear])

  const totalPapers = coursesWithPapers.reduce((sum, course) => sum + course.totalPapers, 0)

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Past Papers</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Browse courses and access organized past papers including assignments, quizzes, midterms, and finals.
            </p>
            <UploadPaperDialog>
              <Button size="lg" className="mb-4">
                <Upload className="h-5 w-5 mr-2" />
                Upload Paper
              </Button>
            </UploadPaperDialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{totalPapers}</div>
                  <div className="text-sm text-muted-foreground">Total Papers</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Download className="h-8 w-8 text-accent" />
                <div>
                  <div className="text-2xl font-bold">{coursesWithPapers.length}</div>
                  <div className="text-sm text-muted-foreground">Courses</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{departments.length}</div>
                  <div className="text-sm text-muted-foreground">Departments</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <FileText className="h-8 w-8 text-accent" />
                <div>
                  <div className="text-2xl font-bold">15</div>
                  <div className="text-sm text-muted-foreground">Contributors</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <AdvancedFilterBar
              search={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Search by course name or code..."
              selects={[
                {
                  id: "department",
                  value: selectedDepartment,
                  onChange: setSelectedDepartment,
                  placeholder: "All Departments",
                  options: [
                    { label: "All Departments", value: "All" },
                    ...departments.map((d) => ({ label: d.name, value: d.name })),
                  ],
                },
                {
                  id: "examType",
                  value: selectedExamType,
                  onChange: setSelectedExamType,
                  placeholder: "All Exam Types",
                  options: examTypes.map((t) => ({ label: t, value: t })),
                },
                {
                  id: "semester",
                  value: selectedSemester,
                  onChange: setSelectedSemester,
                  placeholder: "All Semesters",
                  options: semesters.map((s) => ({ label: s, value: s })),
                },
                {
                  id: "year",
                  value: selectedYear,
                  onChange: setSelectedYear,
                  placeholder: "All Years",
                  options: [
                    { label: "All Years", value: "All" },
                    ...years.map((y) => ({ label: y.toString(), value: y.toString() })),
                  ],
                },
              ]}
            />
          </div>

          {/* Results */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                {filteredCourses.length} Course{filteredCourses.length !== 1 ? "s" : ""} Found
              </h2>
            </div>

            {loading ? (
              <Card className="p-12 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Loading...</h3>
                <p className="text-muted-foreground">Fetching past papers from the database.</p>
              </Card>
            ) : filteredCourses.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Courses Found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search terms or department filter.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedDepartment("All")
                    setSelectedExamType("All")
                    setSelectedSemester("All")
                    setSelectedYear("All")
                  }}
                  className="bg-transparent"
                >
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.code} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: "Home", path: "/" }, { name: "Past Papers", path: "/past-papers" }])) }}
      />
    </div>
  )
}
