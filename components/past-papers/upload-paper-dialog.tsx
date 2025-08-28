"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Plus, X, Loader2 } from "lucide-react"
import { departments, examTypes, semesters, getCoursesByDepartment, type Course, type Department } from "@/lib/past-papers-data"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface UploadPaperDialogProps {
  children: React.ReactNode
  courseCode?: string
}

export function UploadPaperDialog({ children, courseCode }: UploadPaperDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

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
    departmentName: "",
    course: "",
    courseName: "",
    semester: "",
    semesterOther: "",
    examType: "",
    examTypeOther: "",
    year: new Date().getFullYear().toString(),
    tags: [] as string[],
    newTag: "",
    file: null as File | null,
    externalUrl: "",
  })

  const hasValidExternal = !!formData.externalUrl && /^(https?:\/\/).+/.test(formData.externalUrl.trim())
  const canSubmit =
    !!formData.title &&
    !!formData.department &&
    (formData.department !== 'Other' || !!formData.departmentName) &&
    !!formData.course &&
    !!formData.examType &&
    (formData.examType !== 'Other' || !!formData.examTypeOther) &&
    !!formData.semester &&
    (formData.semester !== 'Other' || !!formData.semesterOther) &&
    !!formData.year &&
    (formData.course !== 'Other' || !!formData.courseName) &&
    (!!formData.file || hasValidExternal)

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
        if (value !== 'Other') newState.departmentName = ''
      }
      // If external link is provided, clear file to avoid ambiguity
      if (field === 'externalUrl') {
        if (value && value.trim().length > 0) {
          newState.file = null
        }
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
    if (file) {
      const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
      const maxSizeBytes = 10 * 1024 * 1024 // 10MB
      if (!allowed.includes(file.type)) {
        toast({ title: "Invalid file type", description: "Only PDF, DOC, DOCX are allowed.", variant: "destructive" })
        e.currentTarget.value = ""
        setFormData((prev) => ({ ...prev, file: null }))
        return
      }
      if (file.size > maxSizeBytes) {
        toast({ title: "File too large", description: "Max size is 10MB.", variant: "destructive" })
        e.currentTarget.value = ""
        setFormData((prev) => ({ ...prev, file: null }))
        return
      }
    }
    // If a file is chosen, we can optionally clear externalUrl to avoid confusion
    setFormData((prev) => ({ ...prev, file, externalUrl: file ? "" : prev.externalUrl }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!canSubmit) {
      const msg = !formData.file && !hasValidExternal
        ? "Please attach a file or provide a valid link (https://)."
        : "Please fill all required fields before uploading."
      toast({ title: "Incomplete form", description: msg, variant: "destructive" })
      return
    }

    setIsLoading(true)

    const uploadData = new FormData()
    if (formData.file) {
      uploadData.append("file", formData.file)
    }
    // Build resolved payload (with custom overrides)
    const payload = {
      title: formData.title,
      department: formData.department === 'Other' ? formData.departmentName : formData.department,
      course: (formData.course || '').toUpperCase().trim(),
      courseName: formData.course === 'Other' ? formData.courseName : '',
      semester: formData.semester === 'Other' ? formData.semesterOther : formData.semester,
      examType: formData.examType === 'Other' ? formData.examTypeOther : formData.examType,
      year: formData.year,
      tags: formData.tags,
      externalUrl: formData.externalUrl,
    }
    uploadData.append("paperData", JSON.stringify(payload))

    try {
      const response = await fetch("/api/past-papers/upload", {
        method: "POST",
        body: uploadData,
      })

      if (!response.ok) {
        let message = "Failed to upload past paper"
        try {
          const data = await response.json()
          if (data?.error) message = data.error
        } catch {}
        toast({ title: "Upload failed", description: message, variant: "destructive" })
        return
      }

      toast({
        title: "Submitted",
        description: "Your paper has been submitted to Admin for review.",
      })

      // Reset form and close dialog
      setFormData({
        title: "",
        department: "",
        departmentName: "",
        course: "",
        courseName: "",
        semester: "",
        semesterOther: "",
        examType: "",
        examTypeOther: "",
        year: new Date().getFullYear().toString(),
        tags: [],
        newTag: "",
        file: null,
        externalUrl: "",
      })
      setOpen(false)
      // Notify listeners (e.g., course page) to refetch without full reload
      try {
        window.dispatchEvent(new CustomEvent("pastpaper:uploaded", { detail: { courseCode: formData.course } }))
      } catch {}
      // Also refresh server components if any
      router.refresh()
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

  const handleTriggerClick = () => {
    // Allow anonymous users to open and submit; server enforces rate limits and validation
    setOpen(true)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Manual trigger to fully control gating */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleTriggerClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleTriggerClick()
          }
        }}
        className="interactive"
        aria-label="Open upload past paper dialog"
      >
        {children}
      </div>
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
                  <SelectItem value="Other">Other (Please Specify)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.department === 'Other' && (
              <div className="md:col-span-2">
                <Label htmlFor="departmentName">Department Name *</Label>
                <Input
                  id="departmentName"
                  placeholder="e.g., Mathematics"
                  value={formData.departmentName}
                  onChange={(e) => handleInputChange('departmentName', e.target.value)}
                  required
                />
              </div>
            )}

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
                  <SelectItem value="Other">Other (Please Specify)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.examType === 'Other' && (
              <div>
                <Label htmlFor="examTypeOther">Custom Type *</Label>
                <Input
                  id="examTypeOther"
                  placeholder="e.g., Makeup, Practice Paper"
                  value={formData.examTypeOther}
                  onChange={(e) => handleInputChange('examTypeOther', e.target.value)}
                  required
                />
              </div>
            )}

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
                  <SelectItem value="Other">Other (Please Specify)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.semester === 'Other' && (
              <div>
                <Label htmlFor="semesterOther">Custom Semester *</Label>
                <Input
                  id="semesterOther"
                  placeholder="e.g., Summer 2022"
                  value={formData.semesterOther}
                  onChange={(e) => handleInputChange('semesterOther', e.target.value)}
                  required
                />
              </div>
            )}
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
            <Label htmlFor="file">Upload File {hasValidExternal ? '' : '*'}</Label>
            <Input id="file" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} disabled={!!formData.externalUrl} />
            <p className="text-sm text-muted-foreground mt-1">Accepted formats: PDF, DOC, DOCX (Max size: 10MB)</p>
          </div>

          <div>
            <Label htmlFor="externalUrl">Or paste an External Link</Label>
            <Input
              id="externalUrl"
              type="url"
              placeholder="https://drive.google.com/... or https://..."
              value={formData.externalUrl}
              onChange={(e) => handleInputChange('externalUrl', e.target.value)}
            />
            <p className="text-sm text-muted-foreground mt-1">Provide a public link (Google Drive, OneDrive, etc.). Either upload a file or provide a link.</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !canSubmit}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Upload Paper
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
