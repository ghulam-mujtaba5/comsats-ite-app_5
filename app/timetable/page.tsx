"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, Search, Calendar, Clock } from "lucide-react"

// Mock data for timetable files - in real app this would come from Supabase
const mockTimetableFiles = [
  {
    id: "1",
    name: "Fall 2024 - Computer Science Timetable.pdf",
    department: "Computer Science",
    semester: "Fall 2024",
    uploadDate: "2024-01-15",
    fileSize: "2.4 MB",
    fileType: "PDF",
    downloadUrl: "/placeholder-timetable.pdf",
  },
  {
    id: "2",
    name: "Spring 2024 - Electrical Engineering Schedule.pdf",
    department: "Electrical Engineering",
    semester: "Spring 2024",
    uploadDate: "2024-01-10",
    fileSize: "1.8 MB",
    fileType: "PDF",
    downloadUrl: "/placeholder-timetable.pdf",
  },
  {
    id: "3",
    name: "Fall 2024 - Business Administration Timetable.pdf",
    department: "Business Administration",
    semester: "Fall 2024",
    uploadDate: "2024-01-12",
    fileSize: "2.1 MB",
    fileType: "PDF",
    downloadUrl: "/placeholder-timetable.pdf",
  },
  {
    id: "4",
    name: "Summer 2024 - Mathematics Department Schedule.pdf",
    department: "Mathematics",
    semester: "Summer 2024",
    uploadDate: "2024-01-08",
    fileSize: "1.5 MB",
    fileType: "PDF",
    downloadUrl: "/placeholder-timetable.pdf",
  },
]

const departments = ["All", "Computer Science", "Electrical Engineering", "Business Administration", "Mathematics"]
const semesters = ["All", "Fall 2024", "Spring 2024", "Summer 2024"]

export default function TimetablePage() {
  const [files, setFiles] = useState(mockTimetableFiles)
  const [filteredFiles, setFilteredFiles] = useState(mockTimetableFiles)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [selectedSemester, setSelectedSemester] = useState("All")

  useEffect(() => {
    let filtered = files

    if (searchTerm) {
      filtered = filtered.filter(
        (file) =>
          file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          file.department.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedDepartment !== "All") {
      filtered = filtered.filter((file) => file.department === selectedDepartment)
    }

    if (selectedSemester !== "All") {
      filtered = filtered.filter((file) => file.semester === selectedSemester)
    }

    setFilteredFiles(filtered)
  }, [files, searchTerm, selectedDepartment, selectedSemester])

  const handleDownload = (file: (typeof mockTimetableFiles)[0]) => {
    // In real app, this would download from Supabase storage
    const link = document.createElement("a")
    link.href = file.downloadUrl
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePreview = (file: (typeof mockTimetableFiles)[0]) => {
    // In real app, this would open file from Supabase storage
    window.open(file.downloadUrl, "_blank")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Timetable Files</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access and download official timetable files for all departments and semesters.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{files.length}</div>
                  <div className="text-sm text-muted-foreground">Total Files</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Calendar className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{new Set(files.map((f) => f.semester)).size}</div>
                  <div className="text-sm text-muted-foreground">Semesters</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Clock className="h-8 w-8 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">{new Set(files.map((f) => f.department)).size}</div>
                  <div className="text-sm text-muted-foreground">Departments</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search timetables..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((semester) => (
                        <SelectItem key={semester} value={semester}>
                          {semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Files Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <FileText className="h-8 w-8 text-blue-500 flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg leading-tight mb-2">{file.name}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{file.department}</Badge>
                        <Badge variant="outline">{file.semester}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex justify-between">
                      <span>File Size:</span>
                      <span>{file.fileSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Upload Date:</span>
                      <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span>{file.fileType}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handlePreview(file)} className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm" onClick={() => handleDownload(file)} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFiles.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No timetables found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters to find the timetable you're looking for.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
