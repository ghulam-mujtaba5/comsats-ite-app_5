"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Upload, BookOpen, Download, Heart, MessageCircle } from "lucide-react"
import { GlassCard } from "@/components/admin/glass-card"

interface Resource {
  id: string
  title: string
  description: string
  type: string
  department: string
  program: string
  fileSize: string
  downloads: number
  likes: number
  comments: number
  uploadedBy: string
  uploadedAt: Date
}

export function ResourceSharing() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("notes")
  const [department, setDepartment] = useState("")
  const [program, setProgram] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  // Mock resources data
  const mockResources: Resource[] = [
    {
      id: "1",
      title: "NTS Quantitative Reasoning Notes",
      description: "Comprehensive notes covering all topics in the quantitative section of NTS",
      type: "notes",
      department: "All Departments",
      program: "All Programs",
      fileSize: "2.4 MB",
      downloads: 1240,
      likes: 89,
      comments: 12,
      uploadedBy: "Ahmed Raza",
      uploadedAt: new Date("2024-05-15")
    },
    {
      id: "2",
      title: "Past NTS Papers with Solutions",
      description: "Collection of NTS papers from the last 5 years with detailed solutions",
      type: "papers",
      department: "All Departments",
      program: "All Programs",
      fileSize: "5.7 MB",
      downloads: 2100,
      likes: 156,
      comments: 24,
      uploadedBy: "Sarah Khan",
      uploadedAt: new Date("2024-04-22")
    },
    {
      id: "3",
      title: "Computer Science Merit Calculation Guide",
      description: "Step-by-step guide for calculating merit for CS programs",
      type: "guide",
      department: "Computer Science",
      program: "BSCS",
      fileSize: "1.2 MB",
      downloads: 780,
      likes: 64,
      comments: 8,
      uploadedBy: "Bilal Ahmed",
      uploadedAt: new Date("2024-05-01")
    }
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description || !file) return

    setUploading(true)
    try {
      // In a real implementation, this would upload the file to storage
      // and save metadata to the database
      setTimeout(() => {
        setUploading(false)
        // Reset form
        setTitle("")
        setDescription("")
        setType("notes")
        setDepartment("")
        setProgram("")
        setFile(null)
        alert("Resource uploaded successfully!")
      }, 1500)
    } catch (error) {
      console.error("Error uploading resource:", error)
      setUploading(false)
      alert("Error uploading resource. Please try again.")
    }
  }

  return (
    <div className="space-y-8">
      <GlassCard 
        title="Share Study Materials" 
        description="Upload and share resources with fellow students"
        icon={Upload}
      >
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Resource Title</Label>
              <Input
                id="title"
                placeholder="e.g., NTS Quantitative Reasoning Notes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this resource contains and how it can help students"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Resource Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notes">Notes</SelectItem>
                    <SelectItem value="papers">Past Papers</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  required
                />
                {file && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Department (Optional)</Label>
                <Input
                  id="department"
                  placeholder="e.g., Computer Science"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="program">Program (Optional)</Label>
                <Input
                  id="program"
                  placeholder="e.g., BSCS, BBA"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={uploading || !title || !description || !file}
            >
              {uploading ? "Uploading..." : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Share Resource
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </GlassCard>

      <div>
        <h3 className="text-xl font-semibold mb-4">Recently Shared Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{resource.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {resource.description}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs px-2 py-1 bg-primary/10 rounded-full text-primary">
                    {resource.type}
                  </span>
                  {resource.department !== "All Departments" && (
                    <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                      {resource.department}
                    </span>
                  )}
                  {resource.program !== "All Programs" && (
                    <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                      {resource.program}
                    </span>
                  )}
                  <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                    {resource.fileSize}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xs text-muted-foreground">
                    Uploaded by {resource.uploadedBy}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {resource.uploadedAt.toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Download className="h-3 w-3 mr-1" />
                      {resource.downloads}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Heart className="h-3 w-3 mr-1" />
                      {resource.likes}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      {resource.comments}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}