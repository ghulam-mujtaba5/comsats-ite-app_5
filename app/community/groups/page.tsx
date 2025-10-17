"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useCampus } from "@/contexts/campus-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MessageSquare,
  Users,
  TrendingUp,
  Plus,
  Search,
  Heart,
  MessageCircle,
  Share2,
  Filter,
  Calendar,
  MapPin,
  Bell,
  Pin,
  Award,
  Clock,
  Eye,
  Star,
  BookOpen,
  Zap,
  Activity,
  Sparkles,
  Hash,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  Send,
  Crown,
  Trophy,
  Target,
  Flame,
  Rocket,
  Grid3X3,
  List,
  SlidersHorizontal,
  ChevronDown,
  X,
  HelpCircle,
  Shield,
  Lock,
  Globe,
  UserPlus,
  Settings,
  Edit3,
  Trash2
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { cn } from "@/lib/utils"
import layout from "@/app/styles/common.module.css"
import "../community.light.module.css"
import "../community.dark.module.css"

interface CommunityGroup {
  id: string
  name: string
  description: string
  members: number
  category: string
  isJoined: boolean
  isPrivate: boolean
  createdAt: string
  createdBy: string
  campusId: string
  departmentId: string
  batch: string
  tags: string[]
  avatarUrl: string
  coverUrl: string
  admins: string[]
  rules: string[]
  pinnedPosts: string[]
}

export default function CommunityGroupsPage() {
  const [groups, setGroups] = useState<CommunityGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")
  const [newGroupCategory, setNewGroupCategory] = useState("academic")
  const [newGroupPrivacy, setNewGroupPrivacy] = useState("public")
  const { user } = useAuth()
  const { selectedCampus, selectedDepartment } = useCampus()

  // Load groups
  useEffect(() => {
    const loadGroups = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (selectedCampus?.id) params.set('campus_id', selectedCampus.id)
        if (selectedDepartment?.id) params.set('department_id', selectedDepartment.id)
        
        const res = await fetch(`/api/community/groups?${params.toString()}`)
        if (!res.ok) throw new Error("Failed to load groups")
        const data = await res.json()
        setGroups(data)
      } catch (e: any) {
        setError(e?.message || "Failed to load groups")
      } finally {
        setLoading(false)
      }
    }
    
    loadGroups()
  }, [selectedCampus, selectedDepartment])

  const handleCreateGroup = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a group.",
        variant: "destructive",
      })
      return
    }

    if (newGroupName.trim().length < 3) {
      toast({
        title: "Group name too short",
        description: "Please enter a group name with at least 3 characters.",
        variant: "destructive",
      })
      return
    }

    if (newGroupDescription.trim().length < 10) {
      toast({
        title: "Description too short",
        description: "Please write a description with at least 10 characters.",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch("/api/community/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newGroupName.trim(),
          description: newGroupDescription.trim(),
          category: newGroupCategory,
          isPrivate: newGroupPrivacy === "private",
          campusId: selectedCampus?.id,
          departmentId: selectedDepartment?.id,
        }),
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error?.error || "Failed to create group")
      }
      
      const newGroup = await res.json()
      setGroups(prev => [newGroup, ...prev])
      setNewGroupName("")
      setNewGroupDescription("")
      setIsCreateGroupOpen(false)
      toast({ title: "Group created successfully!", description: "Your group has been created." })
    } catch (err: any) {
      toast({ title: "Failed to create group", description: err.message ?? "Unknown error", variant: "destructive" })
    }
  }

  const handleJoinGroup = async (groupId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join groups.",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch(`/api/community/groups/${groupId}/join`, { method: "POST" })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error?.error || "Failed to join group")
      }
      
      const { isJoined, members } = await res.json()
      setGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { ...group, isJoined, members } 
          : group
      ))
      
      toast({ 
        title: isJoined ? "Joined group" : "Left group", 
        description: isJoined 
          ? `Welcome to ${groups.find(g => g.id === groupId)?.name}!` 
          : `You left ${groups.find(g => g.id === groupId)?.name}` 
      })
    } catch (err: any) {
      toast({ title: "Failed to update group membership", description: err.message ?? "Unknown error", variant: "destructive" })
    }
  }

  const filteredGroups = groups.filter(group => {
    const matchesSearch = 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === "all" || group.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(groups.map(group => group.category)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className={`${layout.section} py-6`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 to-blue-500/15 border border-primary/30 text-sm font-medium text-primary mb-4 backdrop-blur-sm">
            <Users className="h-4 w-4" />
            <span>Community Groups</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Connect with Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Peers</span>
          </h1>
          
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
            Join subject-specific groups, study circles, and interest-based communities to connect with fellow students.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="px-6 py-4 text-base rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md hover:shadow-lg transition-all duration-300 group"
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    Create New Group
                  </DialogTitle>
                  <DialogDescription>
                    Start a new community for students with shared interests.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Group Name
                    </label>
                    <Input
                      placeholder="e.g., Machine Learning Study Group"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Description
                    </label>
                    <textarea
                      placeholder="Describe what this group is about..."
                      value={newGroupDescription}
                      onChange={(e) => setNewGroupDescription(e.target.value)}
                      className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Category
                      </label>
                      <Select value={newGroupCategory} onValueChange={setNewGroupCategory}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="career">Career</SelectItem>
                          <SelectItem value="hobby">Hobby</SelectItem>
                          <SelectItem value="project">Project</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Privacy
                      </label>
                      <Select value={newGroupPrivacy} onValueChange={setNewGroupPrivacy}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select privacy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              Public
                            </div>
                          </SelectItem>
                          <SelectItem value="private">
                            <div className="flex items-center gap-2">
                              <Lock className="h-4 w-4" />
                              Private
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreateGroupOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateGroup}
                      disabled={!newGroupName.trim() || !newGroupDescription.trim()}
                    >
                      Create Group
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              size="lg" 
              variant="outline"
              className="px-6 py-4 text-base rounded-xl border-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Explore Groups
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12 w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-12"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Groups Grid */}
        <div className="space-y-6">
          {loading ? (
            <CenteredLoader message="Loading groups..." />
          ) : error ? (
            <Card className="p-8 text-center text-destructive">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" />
              <h3 className="font-medium text-lg">Error Loading Groups</h3>
              <p className="mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </Card>
          ) : filteredGroups.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <Users className="h-12 w-12 text-gray-400" />
                <h3 className="font-medium text-gray-900 dark:text-white">No groups found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your filters or create a new group
                </p>
                <Button 
                  onClick={() => setIsCreateGroupOpen(true)}
                  className="mt-2"
                >
                  Create Group
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <Card 
                  key={group.id} 
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden"
                >
                  <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
                    {group.isPrivate && (
                      <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm rounded-full p-1.5">
                        <Lock className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3">
                      <Avatar className="h-12 w-12 border-2 border-white">
                        <AvatarImage src={group.avatarUrl || "/group-avatar.png"} />
                        <AvatarFallback className="font-medium">
                          {group.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-1">
                        {group.name}
                      </CardTitle>
                      <Badge 
                        className={cn(
                          "text-xs capitalize",
                          group.category === "academic" && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                          group.category === "career" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                          group.category === "hobby" && "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
                          group.category === "project" && "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
                          group.category === "social" && "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
                        )}
                      >
                        {group.category}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 text-sm">
                      {group.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {group.tags.slice(0, 3).map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="text-xs py-0.5 px-2"
                        >
                          #{tag}
                        </Badge>
                      ))}
                      {group.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs py-0.5 px-2">
                          +{group.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{group.members} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{Math.floor(group.members / 4)} posts</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleJoinGroup(group.id)}
                        variant={group.isJoined ? "default" : "outline"}
                        className="flex-1"
                        size="sm"
                      >
                        {group.isJoined ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Joined
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Join
                          </>
                        )}
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/community/groups/${group.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}