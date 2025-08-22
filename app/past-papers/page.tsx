"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CourseCard } from "@/components/past-papers/course-card"
import { UploadPaperDialog } from "@/components/past-papers/upload-paper-dialog"
import { getCoursesWithPapers, departments } from "@/lib/past-papers-data"
import { Upload, FileText, Download, Users, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function PastPapersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")

  const coursesWithPapers = useMemo(() => getCoursesWithPapers(), [])

  const filteredCourses = useMemo(() => {
    return coursesWithPapers.filter((course) => {
      const matchesSearch =
        searchTerm === "" ||
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = selectedDepartment === "All" || course.department === selectedDepartment

      return matchesSearch && matchesDepartment
    })
  }, [coursesWithPapers, searchTerm, selectedDepartment])

  const totalPapers = coursesWithPapers.reduce((sum, course) => sum + course.totalPapers, 0)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
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
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                {filteredCourses.length} Course{filteredCourses.length !== 1 ? "s" : ""} Found
              </h2>
            </div>

            {filteredCourses.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Courses Found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search terms or department filter.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedDepartment("All")
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
      <Footer />
    </div>
  )
}
