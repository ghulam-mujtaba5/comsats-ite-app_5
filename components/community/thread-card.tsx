import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Award, 
  Flame, 
  Crown, 
  Zap, 
  Star, 
  TrendingUp, 
  UserCheck,
  MoreHorizontal,
  Eye,
  ThumbsUp,
  Laugh,
  Frown,
  Angry,
  HeartIcon,
  Bookmark,
  Flag,
  Pencil,
  Trash2
} from "lucide-react"
import { Post, MediaItem } from "@/lib/community-data"
import { cn } from "@/lib/utils"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { PostMedia } from "@/components/community/post-media"

interface ThreadCardProps {
  post: Post
  onLike: (id: string) => void
  onComment: (id: string) => void
  onShare: (id: string) => void
  currentUser?: any
}

export function ThreadCard({ post, onLike, onComment, onShare, currentUser }: ThreadCardProps) {
  // Determine if post should have special styling
  const isAchievement = post.type === "achievement"
  const isPopular = post.likes > 50
  const isTrending = post.comments > 20
  
  // User badges based on activity level
  const getUserBadges = () => {
    const badges = []
    
    // Top contributor badge
    if (post.likes > 100) {
      badges.push(
        <Badge key="top-contributor" className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-transparent">
          <Crown className="h-3 w-3" />
          <span className="text-xs">Top Contributor</span>
        </Badge>
      )
    }
    
    // Active member badge
    if (post.likes > 25) {
      badges.push(
        <Badge key="active-member" className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-transparent">
          <UserCheck className="h-3 w-3" />
          <span className="text-xs">Active Member</span>
        </Badge>
      )
    }
    
    // Rising star badge
    if (post.likes > 10 && post.comments > 5) {
      badges.push(
        <Badge key="rising-star" className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-transparent">
          <Star className="h-3 w-3" />
          <span className="text-xs">Rising Star</span>
        </Badge>
      )
    }
    
    return badges
  }

  // Get post type badge styling
  const getPostTypeBadge = () => {
    const baseClasses = "capitalize font-medium"
    
    switch (post.type) {
      case "achievement":
        return cn(baseClasses, "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-transparent")
      case "study":
        return cn(baseClasses, "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-transparent")
      case "opportunity":
        return cn(baseClasses, "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-transparent")
      default:
        return cn(baseClasses, "bg-secondary text-secondary-foreground border-transparent")
    }
  }

  // Handle reaction selection
  const handleReaction = (reactionType: string) => {
    // In a real implementation, this would call an API
    console.log(`Reacted with ${reactionType} to post ${post.id}`)
  }

  // Format time for display
  const formatTime = (time: string) => {
    // In a real implementation, this would use a proper date formatting library
    return time
  }

  return (
    <Card className={cn(
      "hover:shadow-md transition-all duration-300 group border",
      isAchievement && "border-l-4 border-l-yellow-500",
      isPopular && "border-r-2 border-r-blue-500",
      isTrending && "border-t-2 border-t-red-500"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* User Avatar with Online Status and Gamification Elements */}
          <div className="relative">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarImage src={post.avatar || "/placeholder.svg"} />
              <AvatarFallback className="font-medium">
                {post.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-900"></div>
            
            {/* User Level Indicator */}
            <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
              5
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            {/* User Info and Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <h4 className="font-semibold text-foreground truncate">
                {post.author}
              </h4>
              
              {/* User Gamification Badges */}
              <div className="flex items-center gap-1">
                {getUserBadges()}
              </div>
              
              {/* Content Badges */}
              <div className="flex items-center gap-1">
                {isAchievement && (
                  <Badge className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800/50">
                    <Award className="h-3 w-3" />
                    <span className="text-xs">Achievement</span>
                  </Badge>
                )}
                
                {isPopular && (
                  <Badge className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border-blue-200 dark:border-blue-800/50">
                    <Flame className="h-3 w-3" />
                    <span className="text-xs">Popular</span>
                  </Badge>
                )}
                
                {isTrending && (
                  <Badge className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 border-red-200 dark:border-red-800/50">
                    <Zap className="h-3 w-3" />
                    <span className="text-xs">Trending</span>
                  </Badge>
                )}
              </div>
              
              {/* Department and Batch Badges */}
              <Badge className="border-transparent bg-secondary text-secondary-foreground text-xs">
                {post.department}
              </Badge>
              
              <Badge className="text-xs border text-foreground">
                {post.semester}
              </Badge>
              
              {post.batch && (
                <Badge className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {post.batch}
                </Badge>
              )}
              
              <span className="text-sm text-muted-foreground whitespace-nowrap">{post.time}</span>
            </div>
            
            {/* Post Content */}
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {post.content}
            </p>
            
            {/* Media Content */}
            {post.media && post.media.length > 0 && (
              <div className="mb-4">
                <PostMedia media={post.media} />
              </div>
            )}
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  className="text-xs border cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                  variant="secondary"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
            
            {/* Engagement Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onLike(post.id)
                  }}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex items-center space-x-2 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors min-h-[44px] min-w-[44px]",
                    post.liked && "text-red-500 hover:text-red-600 dark:hover:text-red-400"
                  )}
                >
                  <Heart className={cn("h-4 w-4", post.liked ? "fill-current" : "")} />
                  <span className="text-sm font-medium">{post.likes}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors min-h-[44px] min-w-[44px]"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onComment(post.id)
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{post.comments}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors min-h-[44px] min-w-[44px]"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onShare(post.id)
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  <span className="text-sm font-medium">{post.shares}</span>
                </Button>
                
                {/* Reactions Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2 hover:bg-muted/50 transition-colors"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="flex gap-1 p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 min-h-[44px] min-w-[44px]"
                      onClick={() => handleReaction('like')}
                    >
                      <ThumbsUp className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 min-h-[44px] min-w-[44px]"
                      onClick={() => handleReaction('love')}
                    >
                      <HeartIcon className="h-4 w-4 text-red-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 min-h-[44px] min-w-[44px]"
                      onClick={() => handleReaction('laugh')}
                    >
                      <Laugh className="h-4 w-4 text-yellow-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 min-h-[44px] min-w-[44px]"
                      onClick={() => handleReaction('wow')}
                    >
                      <Star className="h-4 w-4 text-purple-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 min-h-[44px] min-w-[44px]"
                      onClick={() => handleReaction('sad')}
                    >
                      <Frown className="h-4 w-4 text-blue-300" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 min-h-[44px] min-w-[44px]"
                      onClick={() => handleReaction('angry')}
                    >
                      <Angry className="h-4 w-4 text-red-700" />
                    </Button>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Post Actions Dropdown */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 min-h-[44px] min-w-[44px]"
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 min-h-[44px] min-w-[44px]"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Flag className="h-4 w-4 mr-2" />
                      Report
                    </DropdownMenuItem>
                    {currentUser?.id === post.user_id && (
                      <>
                        <DropdownMenuItem>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Post Type Badge */}
                <Badge className={getPostTypeBadge()}>
                  {post.type}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}