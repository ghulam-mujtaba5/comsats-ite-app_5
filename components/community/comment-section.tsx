"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Heart, 
  MessageCircle, 
  MoreVertical, 
  Pencil, 
  Trash2,
  ThumbsUp,
  Laugh,
  Frown,
  Angry,
  HeartIcon,
  Star,
  Reply
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Comment } from "@/lib/community-data"
import { cn } from "@/lib/utils"

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    try {
      const res = await fetch(`/api/community/comments?post_id=${postId}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data)
      }
    } catch (error) {
      console.error("Failed to load comments:", error)
      toast({
        title: "Error",
        description: "Failed to load comments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to comment.",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) {
      toast({
        title: "Comment empty",
        description: "Please write something.",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch("/api/community/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          parent_id: replyTo,
          content: newComment,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to post comment")
      }

      const data = await res.json()
      setComments((prev) => [...prev, data])
      setNewComment("")
      setReplyTo(null)
      toast({ title: "Comment posted!" })
    } catch (error: any) {
      toast({
        title: "Failed to post comment",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return

    try {
      const res = await fetch(`/api/community/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      })

      if (!res.ok) throw new Error("Failed to update comment")

      const updated = await res.json()
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? updated : c))
      )
      setEditingId(null)
      setEditContent("")
      toast({ title: "Comment updated!" })
    } catch (error: any) {
      toast({
        title: "Failed to update comment",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return

    try {
      const res = await fetch(`/api/community/comments/${commentId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete comment")

      setComments((prev) => prev.filter((c) => c.id !== commentId))
      toast({ title: "Comment deleted!" })
    } catch (error: any) {
      toast({
        title: "Failed to delete comment",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like comments.",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch(`/api/community/comments/${commentId}/like`, {
        method: "POST",
      })

      if (!res.ok) throw new Error("Failed to like comment")

      const updated = await res.json()
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, likes_count: updated.likes, liked: updated.liked } : c))
      )
    } catch (error: any) {
      toast({
        title: "Failed to like comment",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleReaction = (commentId: string, reactionType: string) => {
    // In a real implementation, this would call an API
    console.log(`Reacted with ${reactionType} to comment ${commentId}`)
  }

  const topLevelComments = comments.filter((c) => !c.parent_id)
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parent_id === parentId)

  const CommentCard = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const isOwner = user?.id === comment.user_id
    const isEditing = editingId === comment.id
    const replies = getReplies(comment.id)

    return (
      <div className={cn("mb-4", isReply && "ml-8 mt-3")}>
        <Card className="border">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {comment.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{comment.author}</h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                  {comment.is_edited && (
                    <span className="text-xs text-muted-foreground">(edited)</span>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="mt-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="mb-2"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleEditComment(comment.id)}>
                        Save
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setEditingId(null)
                          setEditContent("")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{comment.content}</p>
                )}
                
                <div className="flex items-center gap-4 mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-6 px-2 text-xs",
                      comment.liked && "text-red-500"
                    )}
                    onClick={() => handleLikeComment(comment.id)}
                  >
                    <Heart className={cn("h-3 w-3 mr-1", comment.liked ? "fill-current" : "")} />
                    {comment.likes_count}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setReplyTo(comment.id)}
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleReaction(comment.id, 'like')}>
                        <ThumbsUp className="h-3 w-3 mr-2 text-blue-500" />
                        Like
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReaction(comment.id, 'love')}>
                        <HeartIcon className="h-3 w-3 mr-2 text-red-500" />
                        Love
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReaction(comment.id, 'laugh')}>
                        <Laugh className="h-3 w-3 mr-2 text-yellow-500" />
                        Haha
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReaction(comment.id, 'wow')}>
                        <Star className="h-3 w-3 mr-2 text-purple-500" />
                        Wow
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReaction(comment.id, 'sad')}>
                        <Frown className="h-3 w-3 mr-2 text-blue-300" />
                        Sad
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReaction(comment.id, 'angry')}>
                        <Angry className="h-3 w-3 mr-2 text-red-700" />
                        Angry
                      </DropdownMenuItem>
                      {isOwner && (
                        <>
                          <DropdownMenuItem onClick={() => {
                            setEditingId(comment.id)
                            setEditContent(comment.content)
                          }}>
                            <Pencil className="h-3 w-3 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Replies */}
        {replies.map((reply) => (
          <CommentCard key={reply.id} comment={reply} isReply />
        ))}
        
        {/* Reply form */}
        {replyTo === comment.id && (
          <div className="mt-3 ml-8">
            <Card className="border">
              <div className="p-3">
                <Textarea
                  placeholder="Write a reply..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-2"
                />
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleSubmitComment}
                  >
                    Reply
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setReplyTo(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-4">Comments ({comments.length})</h3>
      
      {/* New comment form */}
      <Card className="mb-6 border">
        <div className="p-4">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>
                {user?.user_metadata?.full_name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-2"
              />
              <div className="flex justify-end">
                <Button 
                  size="sm" 
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                >
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Comments list */}
      <div>
        {loading ? (
          <p className="text-center text-muted-foreground">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-center text-muted-foreground">No comments yet. Be the first to comment!</p>
        ) : (
          topLevelComments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  )
}