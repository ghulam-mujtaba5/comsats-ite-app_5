"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import layout from "@/app/styles/common.module.css"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Plus,
  Share2,
  Newspaper,
  Calendar,
  HelpCircle,
  BookOpen,
  FileText,
  Bookmark,
  MessageSquare,
  Star,
  GraduationCap,
  TrendingUp,
  Clock,
  Eye,
  ThumbsUp,
  MessageCircle,
  Hash,
  Globe,
  Lock,
  ChevronDown,
  ChevronUp,
  Users,
  Tag,
  X,
  ExternalLink
} from "lucide-react"
import { SharingButton } from "@/components/community/sharing-button"
import { EnhancedSharingDialog, SharingContent } from "@/components/community/enhanced-sharing-dialog"
import { useCampus } from "@/contexts/campus-context"
import { useAuth } from "@/contexts/auth-context"

interface SharedContent {
  id: string
  title: string
  description: string
  type: 'news' | 'event' | 'faq' | 'guide' | 'paper' | 'resource' | 'blog' | 'review' | 'faculty' | 'other'
  url?: string
  imageUrl?: string
  tags: string[]
  category: string
  author?: string
  date?: string
  department?: string
  campus?: string
  likes?: number
  shares?: number
  views?: number
  comments?: number
  isPublic: boolean
  authorAvatar?: string
}

export default function SharingHubPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "trending">("recent")
  const [isSharingDialogOpen, setIsSharingDialogOpen] = useState(false)
  const [newTag, setNewTag] = useState("")
  const { selectedCampus, selectedDepartment } = useCampus()
  const { user } = useAuth()

  // Content types with icons and descriptions
  const contentTypes = [
    { 
      value: "all", 
      label: "All Content", 
      icon: <Share2 className="h-4 w-4" />
    },
    { 
      value: "news", 
      label: "News", 
      icon: <Newspaper className="h-4 w-4" />
    },
    { 
      value: "event", 
      label: "Events", 
      icon: <Calendar className="h-4 w-4" />
    },
    { 
      value: "faq", 
      label: "FAQs", 
      icon: <HelpCircle className="h-4 w-4" />
    },
    { 
      value: "guide", 
      label: "Guides", 
      icon: <BookOpen className="h-4 w-4" />
    },
    { 
      value: "paper", 
      label: "Past Papers", 
      icon: <FileText className="h-4 w-4" />
    },
    { 
      value: "resource", 
      label: "Resources", 
      icon: <Bookmark className="h-4 w-4" />
    },
    { 
      value: "blog", 
      label: "Blogs", 
      icon: <MessageSquare className="h-4 w-4" />
    },
    { 
      value: "review", 
      label: "Reviews", 
      icon: <Star className="h-4 w-4" />
    },
    { 
      value: "faculty", 
      label: "Faculty", 
      icon: <GraduationCap className="h-4 w-4" />
    }
  ]

  // Mock content data
  const sharedContent: SharedContent[] = [
    {
      id: "1",
      title: "New AI Lab Inauguration at COMSATS Lahore",
      description: "COMSATS Institute of Information Technology Lahore campus inaugurates state-of-the-art AI research lab with advanced computing facilities for student projects and research.",
      type: "news",
      category: "Campus Life",
      tags: ["AI", "Research", "Inauguration", "Lahore"],
      isPublic: true,
      likes: 42,
      shares: 15,
      views: 210,
      comments: 8,
      date: "2023-12-15",
      author: "Admin Team",
      campus: "Lahore"
    },
    {
      id: "2",
      title: "Web Development Workshop - React & Next.js",
      description: "Join our hands-on workshop to learn modern web development techniques using React and Next.js. Perfect for beginners and intermediate developers.",
      type: "event",
      category: "Workshop",
      tags: ["Web", "React", "Workshop", "Programming"],
      isPublic: true,
      likes: 28,
      shares: 12,
      views: 156,
      comments: 5,
      date: "2023-12-20",
      author: "Tech Society",
      campus: "Lahore"
    },
    {
      id: "3",
      title: "How to Calculate GPA at COMSATS",
      description: "Step-by-step guide on calculating your semester and cumulative GPA at COMSATS with examples and common mistakes to avoid.",
      type: "guide",
      category: "Academic",
      tags: ["GPA", "Academic", "Guide", "Students"],
      isPublic: true,
      likes: 67,
      shares: 32,
      views: 420,
      comments: 12,
      date: "2023-12-10",
      author: "Academic Support",
      campus: "All Campuses"
    },
    {
      id: "4",
      title: "Review: Dr. Ahmed's Advanced Programming Course",
      description: "Excellent teaching methodology and deep subject knowledge. Highly recommended for students interested in advanced programming concepts.",
      type: "review",
      category: "Teaching",
      tags: ["Faculty", "Review", "CS", "Programming"],
      isPublic: true,
      likes: 15,
      shares: 3,
      views: 89,
      comments: 4,
      date: "2023-12-05",
      author: "CS Student",
      campus: "Lahore"
    },
    {
      id: "5",
      title: "Final Year Project Resources Collection",
      description: "Comprehensive collection of resources, templates, and guidelines for final year projects in Computer Science and Software Engineering departments.",
      type: "resource",
      category: "Academic",
      tags: ["FYP", "Resources", "Projects", "Guidelines"],
      isPublic: true,
      likes: 89,
      shares: 45,
      views: 312,
      comments: 18,
      date: "2023-12-01",
      author: "Senior Students",
      campus: "All Campuses"
    },
    {
      id: "6",
      title: "My Journey Through COMSATS: A Personal Blog",
      description: "Reflecting on my four years at COMSATS, the challenges, achievements, and lessons learned that shaped my career path.",
      type: "blog",
      category: "Experience",
      tags: ["Experience", "Blog", "Journey", "Reflection"],
      isPublic: true,
      likes: 56,
      shares: 23,
      views: 178,
      comments: 9,
      date: "2023-11-28",
      author: "Alumni",
      campus: "Lahore"
    }
  ]

  // Filter content based on search and filters
  const filteredContent = sharedContent.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesType = selectedType === "all" || item.type === selectedType
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => item.tags.includes(tag))
    
    return matchesSearch && matchesType && matchesCategory && matchesTags
  })

  // Sort content
  const sortedContent = [...filteredContent].sort((a, b) => {
    if (sortBy === "popular") {
      return (b.likes || 0) + (b.shares || 0) - ((a.likes || 0) + (a.shares || 0))
    } else if (sortBy === "trending") {
      return (b.views || 0) - (a.views || 0)
    } else {
      return new Date(b.date || "").getTime() - new Date(a.date || "").getTime()
    }
  })

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove))
  }

  const handleShareContent = async (content: SharingContent) => {
    // In a real implementation, this would send the content to your API
    console.log("Sharing content:", content)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className={`${layout.section} ${layout.max6xl} px-4 py-8`}>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Share2 className="h-4 w-4" />
            <span>Content Sharing Hub</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Share & Discover <span className="text-primary">Knowledge</span>
          </h1>
          
          <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Easily share news, events, FAQs, guides, past papers, resources, blogs, faculty reviews and more with the entire COMSATS community.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg rounded-xl"
              onClick={() => setIsSharingDialogOpen(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Share Content
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-6 text-lg rounded-xl"
              asChild
            >
              <Link href="/community">
                <Users className="h-5 w-5 mr-2" />
                Join Community
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">1,247</div>
              <div className="text-sm text-muted-foreground">Shared Items</div>
            </CardContent>
          </Card>
          
          <Card className="border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">892</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </CardContent>
          </Card>
          
          <Card className="border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">45</div>
              <div className="text-sm text-muted-foreground">Content Types</div>
            </CardContent>
          </Card>
          
          <Card className="border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">12.4K</div>
              <div className="text-sm text-muted-foreground">Total Shares</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search content..."
                      className="pl-10"
                    />
                  </div>
                </div>
                
                {/* Content Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content Type</label>
                  <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
                    <TabsList className="grid grid-cols-2 gap-2">
                      {contentTypes.slice(0, 5).map((type) => (
                        <TabsTrigger 
                          key={type.value} 
                          value={type.value}
                          className="py-2 text-xs"
                        >
                          {type.icon}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {contentTypes.slice(5).map((type) => (
                      <Button
                        key={type.value}
                        variant={selectedType === type.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedType(type.value)}
                        className="text-xs"
                      >
                        {type.icon}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Categories */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    <option value="all">All Categories</option>
                    <option value="Academic">Academic</option>
                    <option value="Campus Life">Campus Life</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Research">Research</option>
                    <option value="Career">Career</option>
                    <option value="Experience">Experience</option>
                    <option value="Teaching">Teaching</option>
                  </select>
                </div>
                
                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        {tag}
                        <button 
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:bg-slate-100 dark:bg-slate-900 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                      className="flex-1 text-sm"
                    />
                    <Button onClick={handleAddTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={sortBy === "recent" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortBy("recent")}
                      className="text-xs"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Recent
                    </Button>
                    <Button
                      variant={sortBy === "popular" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortBy("popular")}
                      className="text-xs"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Popular
                    </Button>
                    <Button
                      variant={sortBy === "trending" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortBy("trending")}
                      className="text-xs"
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Button>
                  </div>
                </div>
                
                {/* Reset Filters */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedType("all")
                    setSelectedCategory("all")
                    setSelectedTags([])
                    setSortBy("recent")
                  }}
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
            
            {/* Popular Tags */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Popular Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["#FinalYearProject", "#Internship", "#Career", "#StudyGroup", "#Programming", "#AI", "#Research", "#Workshop"].map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => {
                        if (!selectedTags.includes(tag.replace('#', ''))) {
                          setSelectedTags([...selectedTags, tag.replace('#', '')])
                        }
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Content Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Shared Content 
                <span className="text-slate-700 dark:text-slate-300 text-lg font-normal ml-2">
                  ({sortedContent.length} items)
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Sorted by: 
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="p-2 border rounded-md bg-background text-sm"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="trending">Trending</option>
                </select>
              </div>
            </div>
            
            {sortedContent.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedContent.map((item) => (
                  <Card key={item.id} className="border hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {contentTypes.find(ct => ct.value === item.type)?.icon}
                          <CardTitle className="text-lg line-clamp-1">
                            {item.title}
                          </CardTitle>
                        </div>
                        <SharingButton
                          title={item.title}
                          description={item.description}
                          type={item.type}
                          category={item.category}
                          tags={item.tags}
                          size="sm"
                          showText={false}
                        />
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Badge variant="secondary">{item.type}</Badge>
                        <Badge variant="outline">{item.category}</Badge>
                        {item.isPublic ? (
                          <Globe className="h-3 w-3 text-muted-foreground" />
                        ) : (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 dark:text-slate-300 line-clamp-2 mb-4">
                        {item.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Hash className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            {item.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="h-4 w-4" />
                            {item.shares}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {item.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {item.comments}
                          </span>
                        </div>
                        <span>{item.date}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 p-1 rounded-full">
                            <GraduationCap className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">{item.author}</span>
                          <span className="text-xs text-muted-foreground">{item.campus}</span>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={item.url || "#"}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Share2 className="h-16 w-16 mx-auto text-slate-700 dark:text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No content found</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-6">
                  Try adjusting your filters or be the first to share content in this category.
                </p>
                <Button onClick={() => setIsSharingDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Share Content
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Enhanced Sharing Dialog */}
      <EnhancedSharingDialog
        open={isSharingDialogOpen}
        onOpenChange={setIsSharingDialogOpen}
        onShare={handleShareContent}
      />
    </div>
  )
}