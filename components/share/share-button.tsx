'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Mail } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ShareButtonProps {
  title: string
  text?: string
  url: string
  resourceType: 'news' | 'event' | 'blog' | 'guidance' | 'lost_found' | 'post'
  resourceId: string
  className?: string
}

export function ShareButton({
  title,
  text,
  url,
  resourceType,
  resourceId,
  className
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false)
  const { toast } = useToast()

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url

  const trackShare = async (platform: string) => {
    try {
      const token = localStorage.getItem('supabase.auth.token')
      await fetch('/api/share/analytics', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resource_type: resourceType,
          resource_id: resourceId,
          platform
        })
      })
    } catch (error) {
      console.error('Failed to track share:', error)
    }
  }

  const handleNativeShare = async () => {
    if (!navigator.share) {
      toast({
        title: 'Share not supported',
        description: 'Your browser does not support native sharing',
        variant: 'destructive'
      })
      return
    }

    setIsSharing(true)

    try {
      await navigator.share({
        title,
        text: text || title,
        url: shareUrl
      })
      
      await trackShare('native')
      
      toast({
        title: 'Shared successfully!',
        description: 'Content has been shared'
      })
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        toast({
          title: 'Share failed',
          description: 'Could not share content',
          variant: 'destructive'
        })
      }
    } finally {
      setIsSharing(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      await trackShare('copy_link')
      
      toast({
        title: 'Link copied!',
        description: 'Link has been copied to clipboard'
      })
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Could not copy link',
        variant: 'destructive'
      })
    }
  }

  const handleSocialShare = (platform: string) => {
    let shareLink = ''
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedText = encodeURIComponent(text || title)

    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        break
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}%0A%0A${encodedUrl}`
        break
    }

    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400')
      trackShare(platform)
    }
  }

  // Check if native share is available
  const hasNativeShare = typeof navigator !== 'undefined' && navigator.share

  if (hasNativeShare) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleNativeShare}
        disabled={isSharing}
        className={className}
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyLink}>
          <LinkIcon className="h-4 w-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSocialShare('facebook')}>
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSocialShare('twitter')}>
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSocialShare('linkedin')}>
          <Linkedin className="h-4 w-4 mr-2" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSocialShare('email')}>
          <Mail className="h-4 w-4 mr-2" />
          Email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
