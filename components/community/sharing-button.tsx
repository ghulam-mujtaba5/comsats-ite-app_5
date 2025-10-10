"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Share2, 
  ExternalLink, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Send,
  FileText,
  Copy,
  Check,
  MoreHorizontal,
  MapPin
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { EnhancedSharingDialog, SharingContent } from "@/components/community/enhanced-sharing-dialog"
import { LostFoundSharingDialog } from "@/components/community/lostfound-sharing-dialog"

interface SharingButtonProps {
  title?: string
  description?: string
  url?: string
  type?: 'news' | 'event' | 'faq' | 'guide' | 'paper' | 'resource' | 'blog' | 'review' | 'faculty' | 'other'
  category?: string
  tags?: string[]
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg"
  showText?: boolean
}

export function SharingButton({ 
  title = "",
  description = "",
  url = "",
  type = "other",
  category = "",
  tags = [],
  className = "",
  variant = "outline",
  size = "default",
  showText = true
}: SharingButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url || window.location.href)
    setCopied(true)
    toast({
      title: "Link copied!",
      description: "The link has been copied to your clipboard."
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareToSocial = (platform: string) => {
    const shareUrl = url || window.location.href
    const shareTitle = title || document.title
    
    const socialUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`
    }

    if (socialUrls[platform]) {
      window.open(socialUrls[platform], '_blank')
    }
  }

  const handleShareContent = async (content: SharingContent) => {
    // In a real implementation, this would send the content to your API
    console.log("Sharing content:", content)
    // Simulate API call
    return new Promise<void>((resolve) => setTimeout(() => resolve(), 1000))
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={variant} 
            size={size}
            className={className}
          >
            <Share2 className="h-4 w-4" />
            {showText && <span className="ml-2">Share</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleCopyLink}>
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Copied!" : "Copy Link"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShareToSocial('twitter')}>
            <Twitter className="h-4 w-4 mr-2" />
            Share to Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShareToSocial('facebook')}>
            <Facebook className="h-4 w-4 mr-2" />
            Share to Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShareToSocial('linkedin')}>
            <Linkedin className="h-4 w-4 mr-2" />
            Share to LinkedIn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShareToSocial('whatsapp')}>
            <Send className="h-4 w-4 mr-2" />
            Share to WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShareToSocial('telegram')}>
            <Send className="h-4 w-4 mr-2" />
            Share to Telegram
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShareToSocial('reddit')}>
            <FileText className="h-4 w-4 mr-2" />
            Share to Reddit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            <MoreHorizontal className="h-4 w-4 mr-2" />
            Advanced Sharing
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EnhancedSharingDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        onShare={handleShareContent}
        initialContent={{
          title,
          description,
          url,
          type,
          category,
          tags
        }}
      />
    </>
  )
}