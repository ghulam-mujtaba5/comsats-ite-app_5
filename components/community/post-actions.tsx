"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Smile,
  MoreHorizontal,
  Link,
  Flag,
  Eye,
  EyeOff,
  Pin,
  Trash2,
  Edit3
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Reaction {
  id: string
  postId: string
  userId: string
  reactionType: string
  createdAt: string
  user: {
    id: string
    name: string
    avatar: string
  }
}

interface PostActionsProps {
  postId: string
  likes: number
  comments: number
  shares: number
  bookmarks: number
  isLiked: boolean
  isBookmarked: boolean
  reactionCounts: Record<string, number>
  onLike: (postId: string) => void
  onBookmark: (postId: string) => void
  onShare: (postId: string) => void
  onComment: (postId: string) => void
}

export function PostActions({
  postId,
  likes,
  comments,
  shares,
  bookmarks,
  isLiked,
  isBookmarked,
  reactionCounts,
  onLike,
  onBookmark,
  onShare,
  onComment
}: PostActionsProps) {
  const [showReactions, setShowReactions] = useState(false)
  const [userReaction, setUserReaction] = useState<string | null>(null)
  const [localReactionCounts, setLocalReactionCounts] = useState(reactionCounts)
  const [localBookmarked, setLocalBookmarked] = useState(isBookmarked)

  // Initialize user reaction from reaction counts
  useEffect(() => {
    setLocalReactionCounts(reactionCounts)
    // In a real app, we would fetch the user's specific reaction
    // For now, we'll just use the isLiked prop for the like reaction
    setUserReaction(isLiked ? 'like' : null)
  }, [reactionCounts, isLiked])

  const handleReaction = async (reactionType: string) => {
    try {
      const response = await fetch('/api/community/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, reactionType }),
      })

      if (!response.ok) {
        throw new Error('Failed to update reaction')
      }

      const data = await response.json()
      
      // Update local state
      setLocalReactionCounts(data.reactionCounts)
      
      // Toggle user reaction
      if (userReaction === reactionType) {
        setUserReaction(null)
      } else {
        setUserReaction(reactionType)
      }
      
      toast({
        title: "Reaction updated",
        description: data.message,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reaction",
        variant: "destructive",
      })
    }
  }

  const handleBookmark = async () => {
    try {
      const response = await fetch('/api/community/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      })

      if (!response.ok) {
        throw new Error('Failed to update bookmark')
      }

      const data = await response.json()
      
      // Update local state
      setLocalBookmarked(data.isBookmarked)
      
      toast({
        title: "Bookmark updated",
        description: data.message,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      })
    }
  }

  const reactionTypes = [
    { type: 'like', icon: '👍', label: 'Like' },
    { type: 'love', icon: '❤️', label: 'Love' },
    { type: 'haha', icon: '😂', label: 'Haha' },
    { type: 'wow', icon: '😮', label: 'Wow' },
    { type: 'sad', icon: '😢', label: 'Sad' },
    { type: 'angry', icon: '😠', label: 'Angry' },
  ]

  // Calculate total reactions
  const totalReactions = Object.values(localReactionCounts).reduce((sum, count) => sum + count, 0)

  return (
    <div className="space-y-3">
      {/* Reaction buttons */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-1 ${userReaction ? 'text-blue-500' : 'text-slate-700 dark:text-slate-300'}`}
            onClick={() => handleReaction('like')}
          >
            <Heart className={`h-4 w-4 ${userReaction === 'like' ? 'fill-current' : ''}`} />
            <span className="text-xs">{likes}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground"
            onClick={() => onComment(postId)}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{comments}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground"
            onClick={() => onShare(postId)}
          >
            <Share2 className="h-4 w-4" />
            <span className="text-xs">{shares}</span>
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className={`gap-1 ${localBookmarked ? 'text-blue-500' : 'text-slate-700 dark:text-slate-300'}`}
          onClick={handleBookmark}
        >
          <Bookmark className={`h-4 w-4 ${localBookmarked ? 'fill-current' : ''}`} />
          <span className="text-xs">{bookmarks}</span>
        </Button>
      </div>
      
      {/* Reaction bar */}
      <div className="flex items-center gap-2">
        {totalReactions > 0 && (
          <div className="flex items-center gap-1">
            {reactionTypes.map(({ type, icon }) => {
              const count = localReactionCounts[type] || 0
              return count > 0 ? (
                <span key={type} className="text-xs" title={`${type}: ${count}`}>
                  {icon}
                </span>
              ) : null
            })}
            <span className="text-xs text-muted-foreground">
              {totalReactions} reaction{totalReactions !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
      
      {/* Advanced reactions popup */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => setShowReactions(!showReactions)}
        >
          <Smile className="h-4 w-4" />
        </Button>
        
        {showReactions && (
          <div 
            className="absolute bottom-full left-0 mb-2 bg-background border rounded-lg shadow-lg p-2 flex gap-1"
            onMouseLeave={() => setShowReactions(false)}
          >
            {reactionTypes.map(({ type, icon, label }) => (
              <button
                key={type}
                className="p-2 rounded-lg hover:bg-slate-100 dark:bg-slate-900 transition-colors text-lg"
                title={label}
                onClick={() => {
                  handleReaction(type)
                  setShowReactions(false)
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}