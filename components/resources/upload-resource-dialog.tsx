"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, LinkIcon, LogIn } from "lucide-react"
import { resourceTypes, difficulties, departments } from "@/lib/resources-data"
import Link from "next/link"

interface UploadResourceDialogProps {
  children: React.ReactNode
}

export function UploadResourceDialog({ children }: UploadResourceDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    department: "",
    difficulty: "",
    tags: "",
    url: "",
    file: null as File | null,
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    
    // Validate file size and type
    if (file) {
      const maxSize = 50 * 1024 * 1024 // 50MB
      const allowedTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.zip']
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Maximum file size is 50MB",
          variant: "destructive"
        })
        e.target.value = ''
        return
      }
      
      if (!allowedTypes.includes(fileExt)) {
        toast({
          title: "Invalid file type",
          description: "Supported: PDF, DOC, DOCX, PPT, PPTX, TXT, ZIP",
          variant: "destructive"
        })
        e.target.value = ''
        return
      }
    }
    
    setFormData((prev) => ({ ...prev, file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title.trim()) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" })
      return
    }
    if (!formData.description.trim()) {
      toast({ title: "Error", description: "Description is required", variant: "destructive" })
      return
    }
    if (!formData.type) {
      toast({ title: "Error", description: "Resource type is required", variant: "destructive" })
      return
    }
    if (!formData.department) {
      toast({ title: "Error", description: "Department is required", variant: "destructive" })
      return
    }
    if (!formData.file && !formData.url.trim()) {
      toast({ 
        title: "Error", 
        description: "Please provide either a file or URL", 
        variant: "destructive" 
      })
      return
    }

    // Prepare form data for upload
    const uploadData = new FormData()
    uploadData.append('title', formData.title.trim())
    uploadData.append('description', formData.description.trim())
    uploadData.append('type', formData.type)
    uploadData.append('department', formData.department)
    if (formData.difficulty) uploadData.append('difficulty', formData.difficulty)
    if (formData.tags.trim()) uploadData.append('tags', formData.tags.trim())
    if (formData.url.trim()) uploadData.append('url', formData.url.trim())
    if (formData.file) uploadData.append('file', formData.file)

    try {
      const response = await fetch('/api/resources/upload', {
        method: 'POST',
        body: uploadData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      toast({
        title: "Success!",
        description: result.message || "Your resource has been submitted for review.",
      })

      // Reset form and close dialog
      resetForm()
      setOpen(false)
      
    } catch (error: any) {
      console.error('Upload error:', error)
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload resource. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "",
      department: "",
      difficulty: "",
      tags: "",
      url: "",
      file: null,
    })
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Sign In Required
            </DialogTitle>
            <DialogDescription>You need to sign in with your COMSATS email to upload resources.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Why sign in?</CardTitle>
                <CardDescription>
                  We require authentication to ensure quality and prevent spam in our resource library.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li>• Only COMSATS students can upload</li>
                  <li>• Track your contributions</li>
                  <li>• Maintain resource quality</li>
                </ul>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Link href="/auth" className="flex-1">
                <Button className="w-full">Sign In</Button>
              </Link>
              <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Learning Resource
          </DialogTitle>
          <DialogDescription>
            Share educational content with your fellow COMSATS students. All uploads are reviewed before publication.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="space-y-2">
              <Label htmlFor="title">Resource Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Data Structures Complete Notes"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what this resource covers and how it helps students..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Resource Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceTypes
                      .filter((type) => type !== "All")
                      .map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Department *</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleInputChange("department", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments
                      .filter((dept) => dept !== "All")
                      .map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Difficulty Level *</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => handleInputChange("difficulty", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties
                      .filter((diff) => diff !== "All")
                      .map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="e.g., algorithms, sorting, trees, programming"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
              />
            </div>
          </div>

          {/* Upload Method */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Upload Method</h3>
            <p className="text-sm text-muted-foreground">Choose either file upload or provide a URL link.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Upload File</h4>
                </div>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-2">
                  Supported: PDF, DOC, DOCX, PPT, PPTX, TXT, ZIP (Max 50MB)
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <LinkIcon className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">External Link</h4>
                </div>
                <Input
                  placeholder="https://example.com/resource"
                  value={formData.url}
                  onChange={(e) => handleInputChange("url", e.target.value)}
                />
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-2">Link to Google Drive, YouTube, GitHub, etc.</p>
              </Card>
            </div>
          </div>

          {/* Guidelines */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Upload Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <ul className="space-y-1 text-muted-foreground">
                <li>• Ensure content is educational and relevant to COMSATS curriculum</li>
                <li>• Do not upload copyrighted material without permission</li>
                <li>• Use clear, descriptive titles and accurate tags</li>
                <li>• Resources will be reviewed before publication</li>
                <li>• Inappropriate content will be removed</li>
              </ul>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              Upload Resource
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                setOpen(false)
              }}
              className="bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
