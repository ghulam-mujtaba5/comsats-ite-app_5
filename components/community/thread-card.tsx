import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, Award, Flame, Crown, Zap, Star, TrendingUp, UserCheck } from "lucide-react"
import { Post } from "@/lib/community-data"
import { cn } from "@/lib/utils"

interface ThreadCardProps {
  thread: Post
  handleLike: (id: string) => void
}

export function ThreadCard({ thread, handleLike }: ThreadCardProps) {
  // Determine if post should have special styling
  const isAchievement = thread.type === "achievement"
  const isPopular = thread.likes > 50
  const isTrending = thread.comments > 20
  
  // User badges based on activity level
  const getUserBadges = () => {
    const badges = []
    
    // Top contributor badge
    if (thread.likes > 100) {
      badges.push(
        <Badge key="top-contributor" className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-transparent">
          <Crown className="h-3 w-3" />
          <span className="text-xs">Top Contributor</span>
        </Badge>
      )
    }
    
    // Active member badge
    if (thread.likes > 25) {
      badges.push(
        <Badge key="active-member" className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-transparent">
          <UserCheck className="h-3 w-3" />
          <span className="text-xs">Active Member</span>
        </Badge>
      )
    }
    
    // Rising star badge
    if (thread.likes > 10 && thread.comments > 5) {
      badges.push(
        <Badge key="rising-star" className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-transparent">
          <Star className="h-3 w-3" />
          <span className="text-xs">Rising Star</span>
        </Badge>
      )
    }
    
    return badges
  }

  return (
    <Card className={cn(
      "hover:shadow-lg transition-all duration-300 group border-border",
      isAchievement && "border-l-4 border-l-yellow-500",
      isPopular && "border-r-2 border-r-blue-500",
      isTrending && "border-t-2 border-t-red-500"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* User Avatar with Online Status and Gamification Elements */}
          <div className="relative">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarImage src={thread.avatar || "/placeholder.svg"} />
              <AvatarFallback className="font-medium">
                {thread.author
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
              <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                {thread.author}
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
                {thread.department}
              </Badge>
              
              <Badge className="text-xs border text-foreground">
                {thread.semester}
              </Badge>
              
              {thread.batch && (
                <Badge className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {thread.batch}
                </Badge>
              )}
              
              <span className="text-sm text-gray-500 whitespace-nowrap">{thread.time}</span>
            </div>
            
            {/* Post Content */}
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {thread.content}
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {thread.tags.map((tag) => (
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
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleLike(thread.id)
                  }}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex items-center space-x-2 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors",
                    thread.liked && "text-red-500 hover:text-red-600 dark:hover:text-red-400"
                  )}
                >
                  <Heart className={cn("h-4 w-4", thread.liked ? "fill-current" : "")} />
                  <span className="text-sm font-medium">{thread.likes}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{thread.comments}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  <span className="text-sm font-medium">{thread.shares}</span>
                </Button>
              </div>
              
              {/* Post Type Badge */}
              <Badge
                className={cn(
                  "capitalize font-medium",
                  thread.type === "achievement" 
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-transparent" 
                    : thread.type === "study"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-transparent"
                    : thread.type === "opportunity"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-transparent"
                    : "bg-secondary text-secondary-foreground border-transparent"
                )}
              >
                {thread.type}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}