import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Post } from "@/lib/community-data"

interface ThreadCardProps {
  thread: Post
  handleLike: (id: string) => void
}

export function ThreadCard({ thread, handleLike }: ThreadCardProps) {
  return (
    <Card key={thread.id} className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={thread.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {thread.author
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">{thread.author}</h4>
              <Badge className="border-transparent bg-secondary text-secondary-foreground">{thread.department}</Badge>
              <Badge className="text-xs border text-foreground">{thread.semester}</Badge>
              <span className="text-sm text-gray-500">{thread.time}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{thread.content}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {thread.tags.map((tag) => (
                <Badge key={tag} className="text-xs border cursor-pointer hover:bg-blue-50">
                  #{tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-gray-500">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleLike(thread.id)
                  }}
                  className={`flex items-center space-x-1 hover:text-blue-500 transition-colors ${
                    thread.liked ? "text-blue-500" : ""
                  }`}
                >
                  <Heart className={`h-4 w-4 ${thread.liked ? "fill-current" : ""}`} />
                  <span>{thread.likes}</span>
                </button>
                <button
                  className="flex items-center space-x-1 hover:text-green-500 transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{thread.comments}</span>
                </button>
                <button
                  className="flex items-center space-x-1 hover:text-purple-500 transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  <span>{thread.shares}</span>
                </button>
              </div>
              <Badge
                className={`capitalize ${thread.type === "achievement" ? "bg-primary text-primary-foreground border-transparent" : "bg-secondary text-secondary-foreground border-transparent"}`}
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
