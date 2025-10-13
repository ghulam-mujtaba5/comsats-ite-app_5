"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCampus } from "@/contexts/campus-context"
import { RichTextEditor } from "@/components/community/rich-text-editor"
import { MediaUploader } from "@/components/community/media-uploader"
import { Sparkles, Send, Hash, BookOpen, Trophy, Target, MessageSquare, Shield } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import { MediaItem } from "@/lib/community-data"

interface PostCreationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreatePost: (content: string, type: string, tags: string[], media: MediaItem[]) => Promise<void>
}

export function PostCreationDialog({ open, onOpenChange, onCreatePost }: PostCreationDialogProps) {
  const [content, setContent] = useState("")
  const [type, setType] = useState("general")
  const [media, setMedia] = useState<MediaItem[]>([])
  const { selectedCampus, selectedDepartment, departments } = useCampus()
  const { user } = useAuth()

  const handleCreatePost = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a post.",
        variant: "destructive",
      })
      return
    }

    if (content.trim().length < 10) {
      toast({
        title: "Post too short",
        description: "Please write at least 10 characters.",
        variant: "destructive",
      })
      return
    }

    try {
      const tags = extractTags(content)
      await onCreatePost(content, type, tags, media)
      setContent("")
      setMedia([])
      onOpenChange(false)
      toast({ 
        title: "Post created successfully!", 
        description: "Your post has been shared with the community." 
      })
    } catch (err: any) {
      toast({ 
        title: "Failed to create post", 
        description: err.message ?? "Unknown error", 
        variant: "destructive" 
      })
    }
  }

  const extractTags = (content: string) => {
    const hashtags = content.match(/#\w+/g) || []
    return hashtags.map((tag) => tag.substring(1))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Create New Post
          </DialogTitle>
          <DialogDescription className="text-base">
            Share your thoughts, questions, or achievements with the community. 
            Use #hashtags to categorize your post and reach the right audience.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Post Type
              </label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select post type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      General Discussion
                    </div>
                  </SelectItem>
                  <SelectItem value="study">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Study Related
                    </div>
                  </SelectItem>
                  <SelectItem value="achievement">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Achievement
                    </div>
                  </SelectItem>
                  <SelectItem value="opportunity">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Opportunity
                    </div>
                  </SelectItem>
                  <SelectItem value="question">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Question
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Campus
              </label>
              <Select 
                value={selectedCampus?.id || ""} 
                onValueChange={(value) => {
                  const campus = useCampus().campuses.find((c: any) => c.id === value);
                  if (campus) useCampus().setSelectedCampus(campus);
                }}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select campus" />
                </SelectTrigger>
                <SelectContent>
                  {useCampus().campuses.map((campus: any) => (
                    <SelectItem key={campus.id} value={campus.id}>
                      {campus.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Department
            </label>
            <Select 
              value={selectedDepartment?.id || ""} 
              onValueChange={(value) => {
                const department = useCampus().departments.find((d: any) => d.id === value);
                if (department) useCampus().setSelectedDepartment(department);
              }}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {useCampus().departments.map((department: any) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Your Post
            </label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="What's on your mind? Be specific and use #hashtags to categorize your post..."
              className="min-h-[150px]"
            />
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-gray-500">
                {content.length}/1000 characters
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-xs"
                >
                  <Hash className="h-3 w-3 mr-1" />
                  Add Tag
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Attach Media (Optional)
            </label>
            <MediaUploader 
              onMediaChange={setMedia}
              maxFiles={5}
              
            />
          </div>
          
          <div className="flex justify-between items-center pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="h-4 w-4" />
              Posts are reviewed by community guidelines
            </div>
            <Button 
              onClick={handleCreatePost} 
              disabled={!content.trim() || content.length < 10}
              className="px-6 py-2.5"
            >
              <Send className="h-4 w-4 mr-2" />
              Post to Community
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}