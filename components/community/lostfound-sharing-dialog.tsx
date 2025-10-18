"use client"

import { useState } from "react"
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
  MapPin,
  Search,
  Plus,
  Image as ImageIcon,
  User,
  Calendar,
  Tag,
  X,
  Send,
  Hash,
  Globe,
  Lock,
  Check
} from "lucide-react"
import { useCampus } from "@/contexts/campus-context"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import { MediaUploader } from "@/components/community/media-uploader"
import { MediaItem } from "@/lib/community-data"

interface LostFoundItem {
  id: string
  title: string
  description: string
  category: "lost" | "found"
  item_type: string
  location: string
  contact_info: string
  status: "active" | "resolved" | "closed"
  image_url?: string
  created_at: string
  updated_at: string
  user_id: string
  tags: string[]
  isPublic: boolean
}

interface LostFoundSharingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onShare: (item: LostFoundItem) => Promise<void>
  initialItem?: Partial<LostFoundItem>
}

export function LostFoundSharingDialog({ 
  open, 
  onOpenChange, 
  onShare,
  initialItem = {}
}: LostFoundSharingDialogProps) {
  const [title, setTitle] = useState(initialItem.title || "")
  const [description, setDescription] = useState(initialItem.description || "")
  const [category, setCategory] = useState<"lost" | "found">(initialItem.category || "lost")
  const [itemType, setItemType] = useState(initialItem.item_type || "")
  const [location, setLocation] = useState(initialItem.location || "")
  const [contactInfo, setContactInfo] = useState(initialItem.contact_info || "")
  const [tags, setTags] = useState<string[]>(initialItem.tags || [])
  const [newTag, setNewTag] = useState("")
  const [media, setMedia] = useState<MediaItem[]>([])
  const [isPublic, setIsPublic] = useState(initialItem.isPublic ?? true)
  const { selectedCampus } = useCampus()
  const { user } = useAuth()

  const itemTypes = [
    "Electronics",
    "Personal Items",
    "Bags",
    "Books",
    "Clothing",
    "Documents",
    "Keys",
    "Jewelry",
    "Other"
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

  const handleShareItem = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to report lost/found items.",
        variant: "destructive",
      })
      return
    }

    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for the item.",
        variant: "destructive",
      })
      return
    }

    if (!description.trim()) {
      toast({
        title: "Description Required",
        description: "Please describe the item in detail.",
        variant: "destructive",
      })
      return
    }

    if (!location.trim()) {
      toast({
        title: "Location Required",
        description: "Please specify where the item was lost/found.",
        variant: "destructive",
      })
      return
    }

    try {
      const lostFoundItem: LostFoundItem = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        description,
        category,
        item_type: itemType,
        location,
        contact_info: contactInfo || user.email || "",
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: user.id,
        tags,
        isPublic
      }

      await onShare(lostFoundItem)
      
      // Reset form
      setTitle("")
      setDescription("")
      setCategory("lost")
      setItemType("")
      setLocation("")
      setContactInfo("")
      setTags([])
      setMedia([])
      setIsPublic(true)
      
      toast({ 
        title: "Item reported successfully!", 
        description: `Your ${category} item has been reported to the community.` 
      })
      
      onOpenChange(false)
    } catch (err: any) {
      toast({ 
        title: "Failed to report item", 
        description: err.message ?? "Unknown error", 
        variant: "destructive" 
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Report Lost/Found Item
          </DialogTitle>
          <DialogDescription className="text-base">
            Help your fellow students by reporting lost or found items on campus.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Item Status
              </label>
              <Select value={category} onValueChange={(value) => setCategory(value as "lost" | "found")}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lost">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-red-500" />
                      🔴 Lost Item
                    </div>
                  </SelectItem>
                  <SelectItem value="found">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-500" />
                      🟢 Found Item
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Item Type
              </label>
              <Select value={itemType} onValueChange={setItemType}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent>
                  {itemTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Item Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Black iPhone 14, Blue Backpack, etc."
              className="h-12"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Detailed Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed description including color, size, brand, distinguishing features, serial numbers, etc."
              className="min-h-[120px]"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Location
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Main Library, CS Department, Cafeteria, etc."
              className="h-12"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Contact Information
            </label>
            <Input
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="Your email or phone number for contact"
              className="h-12"
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
                placeholder="Add a tag (e.g., urgent, valuable, fragile)"
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
              Attach Photos (Optional)
            </label>
            <MediaUploader 
              onMediaChange={setMedia}
              maxFiles={3}
              
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-900 rounded-lg">
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
                  ? "Visible to everyone on campus" 
                  : "Only visible to you and admins"}
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
            <Button onClick={handleShareItem}>
              <Send className="h-4 w-4 mr-2" />
              Report Item
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}