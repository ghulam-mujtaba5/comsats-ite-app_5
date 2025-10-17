"use client"

import { useState, useEffect } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminActionCard } from "@/components/admin/admin-action-card"
import { AdminLoading } from "@/components/admin/admin-loading"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { GlassCard } from "@/components/admin/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  Users,
  FileText
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface TestResource {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  subject: string
  file_url: string | null
  created_at: string
  updated_at: string
}

import styles from "../../admin/admin-shared.module.css"

export default function AdminTestPreparationPage() {
  const [resources, setResources] = useState<TestResource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showDialog, setShowDialog] = useState(false)
  const [editingResource, setEditingResource] = useState<TestResource | null>(null)
  const { toast } = useToast()

  // Mock data for test resources
  const mockResources: TestResource[] = [
    {
      id: "1",
      title: "NTS Practice Test - Mathematics",
      description: "Comprehensive practice test covering algebra, geometry, and calculus concepts for NTS.",
      category: "nts",
      difficulty: "intermediate",
      subject: "Mathematics",
      file_url: "https://example.com/nts-math.pdf",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z"
    },
    {
      id: "2",
      title: "GAT General English Practice",
      description: "Practice questions for GAT General English section including vocabulary and comprehension.",
      category: "gat",
      difficulty: "beginner",
      subject: "English",
      file_url: "https://example.com/gat-english.pdf",
      created_at: "2024-02-01T09:15:00Z",
      updated_at: "2024-02-01T09:15:00Z"
    },
    {
      id: "3",
      title: "Subject GRE - Computer Science",
      description: "Advanced practice questions for GRE Computer Science subject test.",
      category: "gre",
      difficulty: "advanced",
      subject: "Computer Science",
      file_url: "https://example.com/gre-cs.pdf",
      created_at: "2023-12-01T14:20:00Z",
      updated_at: "2023-12-01T14:20:00Z"
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setResources(mockResources)
      setLoading(false)
    }, 1000)
  }, [])

  const handleCreateNew = () => {
    setEditingResource({
      id: "",
      title: "",
      description: "",
      category: "nts",
      difficulty: "beginner",
      subject: "",
      file_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    setShowDialog(true)
  }

  const handleEdit = (resource: TestResource) => {
    setEditingResource(resource)
    setShowDialog(true)
  }

  const handleSave = () => {
    if (!editingResource) return

    if (editingResource.id) {
      // Update existing resource
      setResources(prev => prev.map(r => 
        r.id === editingResource.id ? editingResource : r
      ))
      toast({
        title: "Success",
        description: "Test resource updated successfully"
      })
    } else {
      // Create new resource
      const newResource = {
        ...editingResource,
        id: Math.random().toString(36).substr(2, 9)
      }
      setResources(prev => [...prev, newResource])
      toast({
        title: "Success",
        description: "Test resource created successfully"
      })
    }
    
    setShowDialog(false)
    setEditingResource(null)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this test resource?")) {
      setResources(prev => prev.filter(r => r.id !== id))
      toast({
        title: "Success",
        description: "Test resource deleted successfully"
      })
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "nts":
        return <Badge variant="outline" className="border-blue-200 dark:border-blue-800">NTS</Badge>
      case "gat":
        return <Badge variant="outline" className="border-green-200 dark:border-green-800">GAT</Badge>
      case "gre":
        return <Badge variant="outline" className="border-purple-200 dark:border-purple-800">GRE</Badge>
      default:
        return <Badge variant="outline">{category.toUpperCase()}</Badge>
    }
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Beginner</Badge>
      case "intermediate":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Intermediate</Badge>
      case "advanced":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Advanced</Badge>
      default:
        return <Badge variant="secondary">{difficulty}</Badge>
    }
  }

  return (
    <AdminGuard>
      <AdminPageHeader
        title="Test Preparation Resources"
        description="Manage test preparation materials and practice resources for students"
        icon={BookOpen}
        iconGradient="from-blue-600 to-purple-600"
        badges={[
          {
            label: "Total Resources",
            value: resources.length.toString(),
            icon: FileText,
            color: "border-blue-200 dark:border-blue-800"
          },
          {
            label: "Active Categories",
            value: [...new Set(resources.map(r => r.category))].length.toString(),
            icon: BookOpen,
            color: "border-purple-200 dark:border-purple-800"
          }
        ]}
      />

      <div className={`${styles.section} ${styles.spaceY8} pb-12`}>
        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search test resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="nts">NTS</SelectItem>
                <SelectItem value="gat">GAT</SelectItem>
                <SelectItem value="gre">GRE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                New Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingResource?.id ? "Edit Test Resource" : "Create New Test Resource"}
                </DialogTitle>
                <DialogDescription>
                  {editingResource?.id 
                    ? "Edit the details of this test preparation resource" 
                    : "Create a new test preparation resource for students"}
                </DialogDescription>
              </DialogHeader>
              
              {editingResource && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={editingResource.title}
                      onChange={(e) => setEditingResource({
                        ...editingResource,
                        title: e.target.value
                      })}
                      placeholder="Enter resource title"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={editingResource.description}
                      onChange={(e) => setEditingResource({
                        ...editingResource,
                        description: e.target.value
                      })}
                      placeholder="Describe the test resource"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Select 
                        value={editingResource.category} 
                        onValueChange={(value) => setEditingResource({
                          ...editingResource,
                          category: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nts">NTS</SelectItem>
                          <SelectItem value="gat">GAT</SelectItem>
                          <SelectItem value="gre">GRE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Difficulty</label>
                      <Select 
                        value={editingResource.difficulty} 
                        onValueChange={(value) => setEditingResource({
                          ...editingResource,
                          difficulty: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Input
                      value={editingResource.subject || ""}
                      onChange={(e) => setEditingResource({
                        ...editingResource,
                        subject: e.target.value
                      })}
                      placeholder="e.g., Mathematics, English, Computer Science"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">File URL (Optional)</label>
                    <Input
                      value={editingResource.file_url || ""}
                      onChange={(e) => setEditingResource({
                        ...editingResource,
                        file_url: e.target.value || null
                      })}
                      placeholder="https://example.com/resource.pdf"
                    />
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Resource
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Resources List */}
        <GlassCard 
          title="Test Preparation Resources" 
          description="Manage all test preparation materials and practice resources"
          icon={BookOpen}
          iconGradient="from-blue-600 to-purple-600"
        >
          {loading ? (
            <AdminLoading message="Loading test resources..." />
          ) : filteredResources.length === 0 ? (
            <AdminEmptyState
              title="No Test Resources Found"
              description="Create your first test preparation resource to help students"
              emoji="📚"
              action={
                <Button onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Resource
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredResources.map((resource) => (
                <AdminActionCard
                  key={resource.id}
                  title={resource.title}
                  description={resource.description}
                  icon={BookOpen}
                  badges={[
                    getCategoryBadge(resource.category),
                    getDifficultyBadge(resource.difficulty)
                  ]}
                  actions={[
                    {
                      label: "Edit",
                      icon: Edit,
                      onClick: () => handleEdit(resource),
                      variant: "outline"
                    },
                    {
                      label: "Delete",
                      icon: Trash2,
                      onClick: () => handleDelete(resource.id),
                      variant: "destructive",
                      className: "border-red-200 dark:border-red-800"
                    }
                  ]}
                  metadata={
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{resource.subject}</span>
                      </div>
                      {resource.file_url && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <a href={resource.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                            View File
                          </a>
                        </div>
                      )}
                    </div>
                  }
                />
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </AdminGuard>
  )
}