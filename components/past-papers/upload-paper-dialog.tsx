"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Plus, X, Loader2 } from "lucide-react"
import { departments, examTypes, semesters, getCoursesByDepartment, type Course, type Department } from "@/lib/past-papers-data"
import { useToast } from "@/hooks/use-toast"

interface UploadPaperDialogProps {
  children: React.ReactNode
  courseCode?: string
}

export function UploadPaperDialog({ children, courseCode }: UploadPaperDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (courseCode) {
      let courseInfo: { course: Course; department: Department } | undefined
      for (const department of departments) {
        const course = department.courses.find((c) => c.code === courseCode)
        if (course) {
          courseInfo = { course, department }
          break
        }
      }

      if (courseInfo) {
        setFormData((prev) => ({
          ...prev,
          department: courseInfo.department.name,
          course: courseInfo.course.code,
        }))
      }
    }
  }, [courseCode])
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    course: "",
    courseName: "",
    semester: "",
    examType: "",
    year: new Date().getFullYear().toString(),
    tags: [] as string[],
    newTag: "",
    file: null as File | null,
  })

  const availableCourses =
    formData.department && formData.department !== "All" ? getCoursesByDepartment(formData.department) : []

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newState = { ...prev, [field]: value }
      // If course is changed, reset courseName unless it's 'Other'
      if (field === 'course' && value !== 'Other') {
        newState.courseName = ''
      }
      // If department is changed, reset course and courseName
      if (field === 'department') {
        newState.course = ''
        newState.courseName = ''
      }
      return newState
    })
  }

  const addTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: "",
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.file) return

    setIsLoading(true)

    const uploadData = new FormData()
    uploadData.append("file", formData.file)
    // Remove file from paperData to avoid sending it twice
    const { file, ...paperData } = formData
    uploadData.append("paperData", JSON.stringify(paperData))

    try {
      const response = await fetch("/api/past-papers/upload", {
        method: "POST",
        body: uploadData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload paper")
      }

      toast({
        title: "Success",
        description: "Past paper uploaded successfully!",
      })

      // Reset form and close dialog
      setFormData({
        title: "",
        department: "",
        course: "",
        courseName: "",
        semester: "",
        examType: "",
        year: new Date().getFullYear().toString(),
        tags: [],
        newTag: "",
        file: null,
      })
      setOpen(false)
      // Refresh the page to show the new paper
      window.location.reload()
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to upload past paper. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTriggerClick = () => setOpen(true)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div onClick={handleTriggerClick}>{children}</div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload Past Paper
          </DialogTitle>
          <DialogDescription>
            Share a past paper with your fellow students. Make sure you have permission to upload the content.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Paper Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Programming Fundamentals Mid-Term Exam"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => handleInputChange("department", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="course">Course *</Label>
              <Select
                value={formData.course}
                onValueChange={(value) => handleInputChange("course", value)}
                disabled={!formData.department}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {availableCourses.map((course) => (
                    <SelectItem key={course.id} value={course.code}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="Other">Other (Please Specify)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.course === 'Other' && (
              <div className="md:col-span-2">
                <Label htmlFor="courseName">Course Name *</Label>
                <Input
                  id="courseName"
                  placeholder="e.g., Introduction to Business"
                  value={formData.courseName}
                  onChange={(e) => handleInputChange('courseName', e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="examType">Exam Type *</Label>
              <Select
                value={formData.examType}
                onValueChange={(value) => handleInputChange("examType", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {examTypes.slice(1).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="semester">Semester *</Label>
              <Select
                value={formData.semester}
                onValueChange={(value) => handleInputChange("semester", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.slice(1).map((semester) => (
                    <SelectItem key={semester} value={semester}>
                      {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add a tag (e.g., Arrays, Functions)"
                value={formData.newTag}
                onChange={(e) => handleInputChange("newTag", e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag} className="bg-transparent">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="file">Upload File *</Label>
            <Input id="file" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
            <p className="text-sm text-muted-foreground mt-1">Accepted formats: PDF, DOC, DOCX (Max size: 10MB)</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Upload Paper
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
