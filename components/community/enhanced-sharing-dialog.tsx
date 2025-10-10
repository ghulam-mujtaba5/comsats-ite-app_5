"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { 
  Input 
} from "@/components/ui/input"
import { 
  Textarea 
} from "@/components/ui/textarea"
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { 
  Badge 
} from "@/components/ui/badge"
import {
  MessageSquare,
  BookOpen,
  Trophy,
  Target,
  HelpCircle,
  Newspaper,
  Users,
  Calendar,
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  Paperclip,
  Send,
  Hash,
  Sparkles,
  Copy,
  Share2,
  ExternalLink,
  Check,
  X,
  Plus,
  Search,
  Filter,
  Globe,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Clock,
  Star,
  Award,
  GraduationCap,
  Building2,
  User,
  Tag,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Flag,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Upload,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileText as FileDocument,
  Link2,
  Globe2,
  Mail,
  Twitter,
  Facebook,
  Linkedin,
  Send as TelegramIcon,
  FileText as RedditIcon,
  CopyIcon
} from "lucide-react"
import { useCampus } from "@/contexts/campus-context"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import { RichTextEditor } from "@/components/community/rich-text-editor"
import { MediaUploader } from "@/components/community/media-uploader"
import { cn } from "@/lib/utils"

export interface SharingContent {
  id: string
  title: string
  description: string
  type: 'news' | 'event' | 'faq' | 'guide' | 'paper' | 'resource' | 'blog' | 'review' | 'faculty' | 'lostfound' | 'other'
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
  isPublic: boolean
}

interface EnhancedSharingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onShare: (content: SharingContent) => Promise<void>
  initialContent?: Partial<SharingContent>
}

export function EnhancedSharingDialog({ 
  open, 
  onOpenChange, 
  onShare,
  initialContent = {}
}: EnhancedSharingDialogProps) {
  const [activeTab, setActiveTab] = useState("create")
  const [content, setContent] = useState(initialContent.description || "")
  const [title, setTitle] = useState(initialContent.title || "")
  const [type, setType] = useState<SharingContent['type']>(initialContent.type || "other")
  const [category, setCategory] = useState(initialContent.category || "")
  const [tags, setTags] = useState<string[]>(initialContent.tags || [])
  const [newTag, setNewTag] = useState("")
  const [media, setMedia] = useState<File[]>([])
  const [url, setUrl] = useState(initialContent.url || "")
  const [isPublic, setIsPublic] = useState(initialContent.isPublic ?? true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContent, setSelectedContent] = useState<SharingContent | null>(null)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [copied, setCopied] = useState(false)
  const { selectedCampus, selectedDepartment } = useCampus()
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Content types with icons and descriptions
  const contentTypes = [
    { 
      value: "news", 
      label: "News Article", 
      icon: <Newspaper className="h-4 w-4" />,
      description: "Share campus news, announcements, or updates"
    },
    { 
      value: "event", 
      label: "Event", 
      icon: <Calendar className="h-4 w-4" />,
      description: "Promote upcoming events, workshops, or activities"
    },
    { 
      value: "faq", 
      label: "FAQ", 
      icon: <HelpCircle className="h-4 w-4" />,
      description: "Share frequently asked questions and answers"
    },
    { 
      value: "guide", 
      label: "Guide/Manual", 
      icon: <BookOpen className="h-4 w-4" />,
      description: "Share how-to guides, manuals, or tutorials"
    },
    { 
      value: "paper", 
      label: "Past Paper", 
      icon: <FileText className="h-4 w-4" />,
      description: "Share academic papers, assignments, or exams"
    },
    { 
      value: "resource", 
      label: "Resource", 
      icon: <Bookmark className="h-4 w-4" />,
      description: "Share useful resources, tools, or materials"
    },
    { 
      value: "blog", 
      label: "Blog Post", 
      icon: <MessageSquare className="h-4 w-4" />,
      description: "Share personal experiences, opinions, or insights"
    },
    { 
      value: "review", 
      label: "Faculty Review", 
      icon: <Star className="h-4 w-4" />,
      description: "Share reviews or feedback about faculty members"
    },
    { 
      value: "faculty", 
      label: "Faculty Profile", 
      icon: <GraduationCap className="h-4 w-4" />,
      description: "Share information about faculty members"
    },
    { 
      value: "lostfound", 
      label: "Lost & Found", 
      icon: <MapPin className="h-4 w-4" />,
      description: "Share lost or found items on campus"
    },
    { 
      value: "other", 
      label: "Other Content", 
      icon: <MoreHorizontal className="h-4 w-4" />,
      description: "Share any other type of content"
    }
  ]

  // Categories for different content types
  const categories = {
    news: ["Announcements", "Achievements", "Campus Life", "Research", "Alumni"],
    event: ["Workshop", "Seminar", "Competition", "Social", "Career"],
    faq: ["Academic", "Admission", "Finance", "Technical", "General"],
    guide: ["Study", "Career", "Technical", "Campus", "Software"],
    paper: ["Midterm", "Final", "Assignment", "Quiz", "Project"],
    resource: ["Book", "Tool", "Website", "Video", "Document"],
    blog: ["Experience", "Opinion", "Tutorial", "Review", "Tips"],
    review: ["Teaching", "Research", "Support", "Communication", "Overall"],
    faculty: ["Profile", "Achievement", "Publication", "Award", "Event"],
    lostfound: ["Lost Item", "Found Item", "Campus Location", "Personal Item", "Electronics", "Documents"],
    other: ["General", "Miscellaneous", "Other"]
  }

  // Mock content library for sharing
  const contentLibrary: SharingContent[] = [
    {
      id: "1",
      title: "New AI Lab Inauguration",
      description: "COMSATS Lahore campus inaugurates state-of-the-art AI research lab with advanced computing facilities.",
      type: "news",
      category: "Campus Life",
      tags: ["AI", "Research", "Inauguration"],
      isPublic: true,
      likes: 42,
      shares: 15,
      views: 210
    },
    {
      id: "2",
      title: "Web Development Workshop",
      description: "Join our hands-on workshop to learn modern web development techniques using React and Next.js.",
      type: "event",
      category: "Workshop",
      tags: ["Web", "React", "Workshop"],
      isPublic: true,
      likes: 28,
      shares: 12,
      views: 156
    },
    {
      id: "3",
      title: "How to Calculate GPA",
      description: "Step-by-step guide on calculating your semester and cumulative GPA at COMSATS.",
      type: "guide",
      category: "Academic",
      tags: ["GPA", "Academic", "Guide"],
      isPublic: true,
      likes: 67,
      shares: 32,
      views: 420
    },
    {
      id: "4",
      title: "Dr. Ahmed's Review",
      description: "Excellent teaching methodology and deep subject knowledge. Highly recommended for advanced courses.",
      type: "review",
      category: "Teaching",
      tags: ["Faculty", "Review", "CS"],
      isPublic: true,
      likes: 15,
      shares: 3,
      views: 89
    }
  ]

  const filteredContent = contentLibrary.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleShareContent = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to share content.",
        variant: "destructive",
      })
      return
    }

    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your content.",
        variant: "destructive",
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter some content to share.",
        variant: "destructive",
      })
      return
    }

    try {
      const sharingContent: SharingContent = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        description: content,
        type,
        category,
        tags,
        isPublic,
        url: url || undefined
      }

      await onShare(sharingContent)
      
      // Reset form
      setTitle("")
      setContent("")
      setType("other")
      setCategory("")
      setTags([])
      setMedia([])
      setUrl("")
      setIsPublic(true)
      
      toast({ 
        title: "Content shared successfully!", 
        description: "Your content has been shared with the community." 
      })
      
      onOpenChange(false)
    } catch (err: any) {
      toast({ 
        title: "Failed to share content", 
        description: err.message ?? "Unknown error", 
        variant: "destructive" 
      })
    }
  }

  const handleShareExistingContent = async () => {
    if (!selectedContent) {
      toast({
        title: "No Content Selected",
        description: "Please select content to share.",
        variant: "destructive",
      })
      return
    }

    try {
      await onShare(selectedContent)
      toast({ 
        title: "Content shared successfully!", 
        description: "The selected content has been shared with the community." 
      })
      onOpenChange(false)
    } catch (err: any) {
      toast({ 
        title: "Failed to share content", 
        description: err.message ?? "Unknown error", 
        variant: "destructive" 
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToSocialMedia = (platform: string) => {
    const url = window.location.href
    const title = selectedContent?.title || "Check this out!"
    
    const socialUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
    }

    if (socialUrls[platform]) {
      window.open(socialUrls[platform], '_blank')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Share2 className="h-6 w-6 text-primary" />
            Share Content
          </DialogTitle>
          <DialogDescription className="text-base">
            Easily share news, events, FAQs, guides, papers, resources, blogs, faculty reviews and more with the community.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="library">Content Library</TabsTrigger>
            <TabsTrigger value="share">Share Link</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Content Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for your content"
                  className="h-12"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Content Type
                  </label>
                  <Select value={type} onValueChange={(value) => setType(value as SharingContent['type'])}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((contentType) => (
                        <SelectItem key={contentType.value} value={contentType.value}>
                          <div className="flex items-center gap-2">
                            {contentType.icon}
                            {contentType.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {(categories[type as keyof typeof categories] || categories.other).map((cat: string) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Content Description
                </label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Describe your content in detail..."
                  className="min-h-[150px]"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Tags
                </label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                      <button 
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
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
                    placeholder="Add a tag"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1"
                  />
                  <Button onClick={handleAddTag} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Attach Media (Optional)
                </label>
                <MediaUploader 
                  onMediaAdded={setMedia}
                  maxFiles={5}
                  maxSize={10}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  External URL (Optional)
                </label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  {isPublic ? (
                    <Globe className="h-4 w-4 text-primary" />
                  ) : (
                    <Lock className="h-4 w-4 text-primary" />
                  )}
                  <span className="font-medium">
                    {isPublic ? "Public" : "Private"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {isPublic 
                      ? "Visible to everyone" 
                      : "Only visible to you and selected groups"}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsPublic(!isPublic)}
                >
                  {isPublic ? "Make Private" : "Make Public"}
                </Button>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleShareContent}>
                  <Send className="h-4 w-4 mr-2" />
                  Share Content
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="library" className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search content to share..."
                  className="pl-10"
                />
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredContent.length > 0 ? (
                  filteredContent.map((item) => (
                    <Card 
                      key={item.id} 
                      className={cn(
                        "cursor-pointer transition-colors",
                        selectedContent?.id === item.id 
                          ? "border-primary bg-primary/5" 
                          : "hover:bg-muted/50"
                      )}
                      onClick={() => setSelectedContent(item)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {contentTypes.find(ct => ct.value === item.type)?.icon}
                            {item.title}
                          </CardTitle>
                          {selectedContent?.id === item.id && (
                            <Check className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <CardDescription className="flex items-center gap-2">
                          <Badge variant="secondary">{item.type}</Badge>
                          <Badge variant="outline">{item.category}</Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              <Hash className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {item.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <Share2 className="h-3 w-3" />
                              {item.shares}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {item.views}
                            </span>
                          </div>
                          <span>{item.date || "Today"}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3" />
                    <p>No content found matching your search</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-muted-foreground">
                  {selectedContent 
                    ? "Selected: " + selectedContent.title 
                    : "Select content to share"}
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleShareExistingContent}
                    disabled={!selectedContent}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Selected
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="share" className="space-y-6 py-4">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="h-5 w-5" />
                    Share Any Link
                  </CardTitle>
                  <CardDescription>
                    Share external links, articles, or resources with the community
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      URL to Share
                    </label>
                    <Input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com/article"
                      type="url"
                      className="h-12"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Custom Title (Optional)
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a custom title for this link"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Description (Optional)
                    </label>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Add a brief description of this link..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      {isPublic ? (
                        <Globe className="h-4 w-4 text-primary" />
                      ) : (
                        <Lock className="h-4 w-4 text-primary" />
                      )}
                      <span className="font-medium">
                        {isPublic ? "Public" : "Private"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {isPublic 
                          ? "Visible to everyone" 
                          : "Only visible to you and selected groups"}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsPublic(!isPublic)}
                    >
                      {isPublic ? "Make Private" : "Make Public"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {url && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe2 className="h-5 w-5" />
                      Share to Social Media
                    </CardTitle>
                    <CardDescription>
                      Share this link directly to your social networks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col gap-1"
                        onClick={() => shareToSocialMedia('twitter')}
                      >
                        <Twitter className="h-5 w-5" />
                        <span className="text-xs">Twitter</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col gap-1"
                        onClick={() => shareToSocialMedia('facebook')}
                      >
                        <Facebook className="h-5 w-5" />
                        <span className="text-xs">Facebook</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col gap-1"
                        onClick={() => shareToSocialMedia('linkedin')}
                      >
                        <Linkedin className="h-5 w-5" />
                        <span className="text-xs">LinkedIn</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col gap-1"
                        onClick={() => shareToSocialMedia('whatsapp')}
                      >
                        <Send className="h-5 w-5" />
                        <span className="text-xs">WhatsApp</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col gap-1"
                        onClick={() => shareToSocialMedia('telegram')}
                      >
                        <Send className="h-5 w-5" />
                        <span className="text-xs">Telegram</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col gap-1"
                        onClick={() => shareToSocialMedia('reddit')}
                      >
                        <FileText className="h-5 w-5" />
                        <span className="text-xs">Reddit</span>
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Input
                        value={url}
                        readOnly
                        className="flex-1"
                      />
                      <Button 
                        onClick={() => copyToClipboard(url)}
                        variant="outline"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <CopyIcon className="h-4 w-4" />
                        )}
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleShareContent}
                  disabled={!url}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Link
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}