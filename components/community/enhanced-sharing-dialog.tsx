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
import { MediaUploader, MediaUploaderRef } from "@/components/community/media-uploader"
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
  media?: any[]
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
  const [url, setUrl] = useState(initialContent.url || "")
  const [isPublic, setIsPublic] = useState(initialContent.isPublic ?? true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContent, setSelectedContent] = useState<SharingContent | null>(null)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [copied, setCopied] = useState(false)
  const { selectedCampus, selectedDepartment } = useCampus()
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaUploaderRef = useRef<MediaUploaderRef>(null)

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
      description: "Share personal insights, experiences, or opinions"
    },
    { 
      value: "review", 
      label: "Review", 
      icon: <Star className="h-4 w-4" />,
      description: "Review courses, faculty, books, or services"
    },
    { 
      value: "faculty", 
      label: "Faculty Info", 
      icon: <GraduationCap className="h-4 w-4" />,
      description: "Share information about faculty members"
    },
    { 
      value: "lostfound", 
      label: "Lost & Found", 
      icon: <Search className="h-4 w-4" />,
      description: "Report lost items or found items"
    },
    { 
      value: "other", 
      label: "Other", 
      icon: <MoreHorizontal className="h-4 w-4" />,
      description: "Share anything else with the community"
    }
  ]

  // Categories for content
  const categories = [
    "Academic",
    "Career",
    "Social",
    "Sports",
    "Technology",
    "Arts",
    "Research",
    "Campus Life",
    "Events",
    "Resources"
  ]

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
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter some content to share.",
        variant: "destructive",
      })
      return
    }

    try {
      // Get media from uploader
      const media = mediaUploaderRef.current?.getMedia() || []
      
      await onShare({
        id: Date.now().toString(),
        title: title.trim(),
        description: content.trim(),
        type,
        url: url.trim() || undefined,
        tags,
        category: category || "General",
        isPublic,
        media
      })
      
      // Reset form
      setContent("")
      setTitle("")
      setTags([])
      setUrl("")
      setType("other")
      setCategory("")
      mediaUploaderRef.current?.clearMedia()
      
      onOpenChange(false)
    } catch (error) {
      console.error("Error sharing content:", error)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share with Community
          </DialogTitle>
          <DialogDescription>
            Create and share content with your fellow students
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="share">Share Existing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Content Type Selection */}
              <div className="md:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Content Type</CardTitle>
                    <CardDescription>Select the type of content you're sharing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {contentTypes.map((contentType) => (
                      <Button
                        key={contentType.value}
                        variant={type === contentType.value ? "default" : "outline"}
                        className="w-full justify-start h-auto py-3 px-4 text-left"
                        onClick={() => setType(contentType.value as SharingContent['type'])}
                      >
                        <div className="flex items-center gap-3">
                          {contentType.icon}
                          <div>
                            <div className="font-medium text-sm">{contentType.label}</div>
                            <div className="text-xs text-muted-foreground">{contentType.description}</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
                
                {/* Visibility Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Visibility</CardTitle>
                    <CardDescription>Who can see this post</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>Public</span>
                      </div>
                      <Button
                        variant={isPublic ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsPublic(true)}
                      >
                        {isPublic ? <Check className="h-4 w-4" /> : "Select"}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <span>Private</span>
                      </div>
                      <Button
                        variant={!isPublic ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsPublic(false)}
                      >
                        {!isPublic ? <Check className="h-4 w-4" /> : "Select"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right Column - Content Creation */}
              <div className="md:col-span-2 space-y-6">
                {/* Title Input */}
                {type !== "other" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      placeholder={`Enter a title for your ${type}`}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                )}
                
                {/* Content Editor */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    placeholder="What would you like to share with the community?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                  />
                </div>
                
                {/* Media Uploader */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Media</label>
                  <MediaUploader ref={mediaUploaderRef} maxFiles={5} accept="image/*,video/*,application/pdf" />
                </div>
                
                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tags (press Enter)"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                    />
                    <Button onClick={handleAddTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        #{tag}
                        <button 
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:bg-muted rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Additional Options */}
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between"
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                  >
                    More Options
                    {showMoreOptions ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {showMoreOptions && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">External URL</label>
                        <Input
                          placeholder="https://example.com"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {selectedCampus?.name || "No campus selected"}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {selectedDepartment?.name || "No department selected"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleShareContent}>
                    <Send className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="share" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for content to share..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <Card 
                    key={item} 
                    className={cn(
                      "cursor-pointer hover:border-primary transition-colors",
                      selectedContent?.id === `item-${item}` && "border-primary"
                    )}
                    onClick={() => setSelectedContent({
                      id: `item-${item}`,
                      title: `Sample Content ${item}`,
                      description: "This is a sample content description that would appear in the sharing dialog.",
                      type: "other",
                      tags: ["sample", "content"],
                      category: "General",
                      isPublic: true
                    })}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-muted p-2 rounded-lg">
                          <FileDocument className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">Sample Content {item}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            This is a sample content description that would appear in the sharing dialog.
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              Sample
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              Content
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {selectedContent && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Share Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-background p-2 rounded-lg">
                          <FileDocument className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{selectedContent.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {selectedContent.description.substring(0, 50)}...
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedContent(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        <CopyIcon className="h-4 w-4 mr-2" />
                        Copy Link
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                      <Button variant="outline" size="sm">
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                      </Button>
                      <Button variant="outline" size="sm">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button className="w-full" onClick={handleCopyLink}>
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Shareable Link
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}