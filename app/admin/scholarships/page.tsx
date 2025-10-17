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
  Award, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  DollarSign,
  Users,
  BookOpen
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

interface Scholarship {
  id: string
  title: string
  description: string
  eligibility: string
  amount: string
  deadline: string | null
  application_url: string | null
  category: string
  department: string | null
  status: string
  requirements: string[]
  contact_email: string | null
  contact_phone: string | null
  created_at: string
  updated_at: string
}

import styles from "../../admin/admin-shared.module.css"

export default function AdminScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showDialog, setShowDialog] = useState(false)
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null)
  const { toast } = useToast()

  // Mock data for scholarships
  const mockScholarships: Scholarship[] = [
    {
      id: "1",
      title: "Merit-Based Scholarship for BSCS",
      description: "Awarded to top-performing students in Computer Science program based on academic excellence.",
      eligibility: "Minimum CGPA of 3.5, must be enrolled in BSCS program",
      amount: "PKR 50,000 per semester",
      deadline: "2024-12-31",
      application_url: "https://example.com/apply",
      category: "merit-based",
      department: "Computer Science",
      status: "active",
      requirements: ["Transcript", "Recommendation Letter", "Personal Statement"],
      contact_email: "scholarships@comsats.edu.pk",
      contact_phone: "+92-51-1234567",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z"
    },
    {
      id: "2",
      title: "Need-Based Financial Aid",
      description: "Financial assistance for students from low-income families to help cover tuition costs.",
      eligibility: "Family income below PKR 100,000 per month, proof of income required",
      amount: "Up to PKR 30,000 per semester",
      deadline: "2024-11-30",
      application_url: null,
      category: "need-based",
      department: "All Departments",
      status: "active",
      requirements: ["Income Certificate", "Bank Statement", "Fee Challan"],
      contact_email: "financialaid@comsats.edu.pk",
      contact_phone: "+92-51-1234568",
      created_at: "2024-02-01T09:15:00Z",
      updated_at: "2024-02-01T09:15:00Z"
    },
    {
      id: "3",
      title: "Research Grant for PhD Students",
      description: "Funding support for PhD students conducting research in emerging technologies.",
      eligibility: "Enrolled in PhD program, research proposal required",
      amount: "PKR 100,000 per project",
      deadline: "2024-10-31",
      application_url: "https://example.com/research-grant",
      category: "research",
      department: "All Departments",
      status: "expired",
      requirements: ["Research Proposal", "Supervisor Recommendation", "Budget Plan"],
      contact_email: "research@comsats.edu.pk",
      contact_phone: "+92-51-1234569",
      created_at: "2023-12-01T14:20:00Z",
      updated_at: "2023-12-01T14:20:00Z"
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setScholarships(mockScholarships)
      setLoading(false)
    }, 1000)
  }, [])

  const handleCreateNew = () => {
    setEditingScholarship({
      id: "",
      title: "",
      description: "",
      eligibility: "",
      amount: "",
      deadline: null,
      application_url: null,
      category: "merit-based",
      department: null,
      status: "active",
      requirements: [],
      contact_email: null,
      contact_phone: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    setShowDialog(true)
  }

  const handleEdit = (scholarship: Scholarship) => {
    setEditingScholarship(scholarship)
    setShowDialog(true)
  }

  const handleSave = () => {
    if (!editingScholarship) return

    if (editingScholarship.id) {
      // Update existing scholarship
      setScholarships(prev => prev.map(s => 
        s.id === editingScholarship.id ? editingScholarship : s
      ))
      toast({
        title: "Success",
        description: "Scholarship updated successfully"
      })
    } else {
      // Create new scholarship
      const newScholarship = {
        ...editingScholarship,
        id: Math.random().toString(36).substr(2, 9)
      }
      setScholarships(prev => [...prev, newScholarship])
      toast({
        title: "Success",
        description: "Scholarship created successfully"
      })
    }
    
    setShowDialog(false)
    setEditingScholarship(null)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this scholarship?")) {
      setScholarships(prev => prev.filter(s => s.id !== id))
      toast({
        title: "Success",
        description: "Scholarship deleted successfully"
      })
    }
  }

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scholarship.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scholarship.department?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || scholarship.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
      case "expired":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Expired</Badge>
      case "closed":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Closed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "merit-based":
        return <Badge variant="outline" className="border-blue-200 dark:border-blue-800">Merit-Based</Badge>
      case "need-based":
        return <Badge variant="outline" className="border-green-200 dark:border-green-800">Need-Based</Badge>
      case "research":
        return <Badge variant="outline" className="border-purple-200 dark:border-purple-800">Research</Badge>
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

  return (
    <AdminGuard>
      <AdminPageHeader
        title="Scholarships Management"
        description="Create, edit, and manage scholarship opportunities for students"
        icon={Award}
        iconGradient="from-yellow-600 to-orange-600"
        badges={[
          {
            label: "Active Scholarships",
            value: scholarships.filter(s => s.status === "active").length.toString(),
            icon: Award,
            color: "border-yellow-200 dark:border-yellow-800"
          },
          {
            label: "Total Scholarships",
            value: scholarships.length.toString(),
            icon: BookOpen,
            color: "border-blue-200 dark:border-blue-800"
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
                placeholder="Search scholarships..."
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
                <SelectItem value="merit-based">Merit-Based</SelectItem>
                <SelectItem value="need-based">Need-Based</SelectItem>
                <SelectItem value="research">Research</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                New Scholarship
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingScholarship?.id ? "Edit Scholarship" : "Create New Scholarship"}
                </DialogTitle>
                <DialogDescription>
                  {editingScholarship?.id 
                    ? "Edit the details of this scholarship opportunity" 
                    : "Create a new scholarship opportunity for students"}
                </DialogDescription>
              </DialogHeader>
              
              {editingScholarship && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={editingScholarship.title}
                      onChange={(e) => setEditingScholarship({
                        ...editingScholarship,
                        title: e.target.value
                      })}
                      placeholder="Enter scholarship title"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={editingScholarship.description}
                      onChange={(e) => setEditingScholarship({
                        ...editingScholarship,
                        description: e.target.value
                      })}
                      placeholder="Describe the scholarship opportunity"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Amount</label>
                      <Input
                        value={editingScholarship.amount}
                        onChange={(e) => setEditingScholarship({
                          ...editingScholarship,
                          amount: e.target.value
                        })}
                        placeholder="e.g., PKR 50,000 per semester"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Deadline</label>
                      <Input
                        type="date"
                        value={editingScholarship.deadline || ""}
                        onChange={(e) => setEditingScholarship({
                          ...editingScholarship,
                          deadline: e.target.value || null
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Select 
                        value={editingScholarship.category} 
                        onValueChange={(value) => setEditingScholarship({
                          ...editingScholarship,
                          category: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="merit-based">Merit-Based</SelectItem>
                          <SelectItem value="need-based">Need-Based</SelectItem>
                          <SelectItem value="research">Research</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Select 
                        value={editingScholarship.status} 
                        onValueChange={(value) => setEditingScholarship({
                          ...editingScholarship,
                          status: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Department (Optional)</label>
                    <Input
                      value={editingScholarship.department || ""}
                      onChange={(e) => setEditingScholarship({
                        ...editingScholarship,
                        department: e.target.value || null
                      })}
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Eligibility Criteria</label>
                    <Textarea
                      value={editingScholarship.eligibility}
                      onChange={(e) => setEditingScholarship({
                        ...editingScholarship,
                        eligibility: e.target.value
                      })}
                      placeholder="List eligibility requirements"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Application URL (Optional)</label>
                    <Input
                      value={editingScholarship.application_url || ""}
                      onChange={(e) => setEditingScholarship({
                        ...editingScholarship,
                        application_url: e.target.value || null
                      })}
                      placeholder="https://example.com/apply"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Contact Email (Optional)</label>
                      <Input
                        value={editingScholarship.contact_email || ""}
                        onChange={(e) => setEditingScholarship({
                          ...editingScholarship,
                          contact_email: e.target.value || null
                        })}
                        placeholder="contact@comsats.edu.pk"
                        type="email"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Contact Phone (Optional)</label>
                      <Input
                        value={editingScholarship.contact_phone || ""}
                        onChange={(e) => setEditingScholarship({
                          ...editingScholarship,
                          contact_phone: e.target.value || null
                        })}
                        placeholder="+92-51-1234567"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Scholarship
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Scholarships List */}
        <GlassCard 
          title="Scholarship Opportunities" 
          description="Manage all scholarship programs and opportunities"
          icon={Award}
          iconGradient="from-yellow-600 to-orange-600"
        >
          {loading ? (
            <AdminLoading message="Loading scholarships..." />
          ) : filteredScholarships.length === 0 ? (
            <div className="space-y-6">
              <AdminEmptyState
                title="No Scholarships Found"
                description="Create your first scholarship opportunity to help students"
                emoji="🎓"
              />
              <div className="flex justify-center">
                <Button onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Scholarship
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredScholarships.map((scholarship) => (
                <AdminActionCard
                  key={scholarship.id}
                  title={scholarship.title}
                  description={scholarship.description}
                  icon={Award}
                  badges={[]}
                  actions={[
                    {
                      label: "Edit",
                      icon: Edit,
                      onClick: () => handleEdit(scholarship),
                      variant: "outline"
                    },
                    {
                      label: "Delete",
                      icon: Trash2,
                      onClick: () => handleDelete(scholarship.id),
                      variant: "destructive",
                      className: "border-red-200 dark:border-red-800"
                    }
                  ]}
                  children={
                    <div className="mt-4 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(scholarship.status)}
                        {getCategoryBadge(scholarship.category)}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{scholarship.amount}</span>
                        </div>
                        {scholarship.deadline && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                        {scholarship.department && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{scholarship.department}</span>
                          </div>
                        )}
                      </div>
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