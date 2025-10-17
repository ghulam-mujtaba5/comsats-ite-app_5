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
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  Hash,
  User
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

interface StudyGroup {
  id: string
  name: string
  description: string
  subject: string
  program: string
  member_count: number
  status: string
  created_at: string
  updated_at: string
}

import styles from "../../admin/admin-shared.module.css"

export default function AdminStudyGroupsPage() {
  const [groups, setGroups] = useState<StudyGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProgram, setSelectedProgram] = useState("all")
  const [showDialog, setShowDialog] = useState(false)
  const [editingGroup, setEditingGroup] = useState<StudyGroup | null>(null)
  const { toast } = useToast()

  // Mock data for study groups
  const mockGroups: StudyGroup[] = [
    {
      id: "1",
      name: "Data Structures & Algorithms",
      description: "Study group for BSCS students focusing on DSA concepts and problem-solving.",
      subject: "CS201",
      program: "BSCS",
      member_count: 15,
      status: "active",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z"
    },
    {
      id: "2",
      name: "Calculus Study Group",
      description: "Group for students preparing for Calculus exams with weekly problem sessions.",
      subject: "MTH101",
      program: "All Programs",
      member_count: 22,
      status: "active",
      created_at: "2024-02-01T09:15:00Z",
      updated_at: "2024-02-01T09:15:00Z"
    },
    {
      id: "3",
      name: "OOP Concepts Discussion",
      description: "Advanced Object-Oriented Programming concepts discussion for senior students.",
      subject: "CS301",
      program: "BSCS",
      member_count: 8,
      status: "inactive",
      created_at: "2023-12-01T14:20:00Z",
      updated_at: "2023-12-01T14:20:00Z"
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setGroups(mockGroups)
      setLoading(false)
    }, 1000)
  }, [])

  const handleCreateNew = () => {
    setEditingGroup({
      id: "",
      name: "",
      description: "",
      subject: "",
      program: "BSCS",
      member_count: 0,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    setShowDialog(true)
  }

  const handleEdit = (group: StudyGroup) => {
    setEditingGroup(group)
    setShowDialog(true)
  }

  const handleSave = () => {
    if (!editingGroup) return

    if (editingGroup.id) {
      // Update existing group
      setGroups(prev => prev.map(g => 
        g.id === editingGroup.id ? editingGroup : g
      ))
      toast({
        title: "Success",
        description: "Study group updated successfully"
      })
    } else {
      // Create new group
      const newGroup = {
        ...editingGroup,
        id: Math.random().toString(36).substr(2, 9)
      }
      setGroups(prev => [...prev, newGroup])
      toast({
        title: "Success",
        description: "Study group created successfully"
      })
    }
    
    setShowDialog(false)
    setEditingGroup(null)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this study group?")) {
      setGroups(prev => prev.filter(g => g.id !== id))
      toast({
        title: "Success",
        description: "Study group deleted successfully"
      })
    }
  }

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProgram = selectedProgram === "all" || group.program === selectedProgram
    return matchesSearch && matchesProgram
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <AdminGuard>
      <AdminPageHeader
        title="Study Groups Management"
        description="Manage student study groups and collaboration tools"
        icon={Users}
        iconGradient="from-purple-600 to-pink-600"
        badges={[
          {
            label: "Total Groups",
            value: groups.length.toString(),
            icon: Users,
            color: "border-purple-200 dark:border-purple-800"
          },
          {
            label: "Active Groups",
            value: groups.filter(g => g.status === "active").length.toString(),
            icon: Hash,
            color: "border-green-200 dark:border-green-800"
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
                placeholder="Search study groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                <SelectItem value="BSCS">BSCS</SelectItem>
                <SelectItem value="BSSE">BSSE</SelectItem>
                <SelectItem value="BSEE">BSEE</SelectItem>
                <SelectItem value="All Programs">All Programs</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                New Group
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingGroup?.id ? "Edit Study Group" : "Create New Study Group"}
                </DialogTitle>
                <DialogDescription>
                  {editingGroup?.id 
                    ? "Edit the details of this study group" 
                    : "Create a new study group for students"}
                </DialogDescription>
              </DialogHeader>
              
              {editingGroup && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Group Name</label>
                    <Input
                      value={editingGroup.name}
                      onChange={(e) => setEditingGroup({
                        ...editingGroup,
                        name: e.target.value
                      })}
                      placeholder="Enter group name"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={editingGroup.description}
                      onChange={(e) => setEditingGroup({
                        ...editingGroup,
                        description: e.target.value
                      })}
                      placeholder="Describe the study group"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Subject/Course</label>
                      <Input
                        value={editingGroup.subject}
                        onChange={(e) => setEditingGroup({
                          ...editingGroup,
                          subject: e.target.value
                        })}
                        placeholder="e.g., CS201, MTH101"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Program</label>
                      <Select 
                        value={editingGroup.program} 
                        onValueChange={(value) => setEditingGroup({
                          ...editingGroup,
                          program: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BSCS">BSCS</SelectItem>
                          <SelectItem value="BSSE">BSSE</SelectItem>
                          <SelectItem value="BSEE">BSEE</SelectItem>
                          <SelectItem value="All Programs">All Programs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Select 
                        value={editingGroup.status} 
                        onValueChange={(value) => setEditingGroup({
                          ...editingGroup,
                          status: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Member Count</label>
                      <Input
                        type="number"
                        value={editingGroup.member_count}
                        onChange={(e) => setEditingGroup({
                          ...editingGroup,
                          member_count: parseInt(e.target.value) || 0
                        })}
                        min="0"
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
                  Save Group
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Groups List */}
        <GlassCard 
          title="Study Groups" 
          description="Manage all student study groups and collaboration tools"
          icon={Users}
          iconGradient="from-purple-600 to-pink-600"
        >
          {loading ? (
            <AdminLoading message="Loading study groups..." />
          ) : filteredGroups.length === 0 ? (
            <div className="space-y-6">
              <AdminEmptyState
                title="No Study Groups Found"
                description="Create your first study group to help students collaborate"
                emoji="👥"
              />
              <div className="flex justify-center">
                <Button onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGroups.map((group) => (
                <AdminActionCard
                  key={group.id}
                  title={group.name}
                  description={group.description}
                  icon={Users}
                  badges={[]}
                  actions={[
                    {
                      label: "Edit",
                      icon: Edit,
                      onClick: () => handleEdit(group),
                      variant: "outline"
                    },
                    {
                      label: "Delete",
                      icon: Trash2,
                      onClick: () => handleDelete(group.id),
                      variant: "destructive",
                      className: "border-red-200 dark:border-red-800"
                    }
                  ]}
                  children={
                    <div className="mt-4 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge key="program" variant="outline" className="border-purple-200 dark:border-purple-800">{group.program}</Badge>
                        {getStatusBadge(group.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Hash className="h-4 w-4" />
                          <span>{group.subject}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{group.member_count} members</span>
                        </div>
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