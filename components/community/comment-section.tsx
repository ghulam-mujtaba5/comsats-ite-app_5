"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Comment {
  id: string
  post_id: string
  parent_id?: string | null
  user_id: string
  content: string
  likes: number
  created_at: string
  updated_at: string
  user?: {
    id: string
    email: string
  }
}

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
        prev.map((c) => (c.id === commentId ? { ...c, likes: updated.likes } : c))
      )
    } catch (error: any) {
      toast({
        title: "Failed to like comment",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const topLevelComments = comments.filter((c) => !c.parent_id)
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parent_id === parentId)

  const CommentCard = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const isOwner = user?.id === comment.user_id
    const isEditing = editingId === comment.id
    const replies = getReplies(comment.id)

    return (
      <div className={`${isReply ? "ml-12" : ""}`}>
        <Card className="p-4 mb-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {comment.user?.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">
                    {comment.user?.email || "Anonymous"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                {isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingId(comment.id)
                          setEditContent(comment.content)
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {isEditing ? (
                <div className="mt-2 space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleEditComment(comment.id)}
                    >
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
                <p className="mt-2 text-sm">{comment.content}</p>
              )}

              <div className="flex items-center gap-4 mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLikeComment(comment.id)}
                  className="h-7 px-2"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  {comment.likes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyTo(comment.id)}
                  className="h-7 px-2"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Reply
                </Button>
              </div>

              {replyTo === comment.id && (
                <div className="mt-3 space-y-2">
                  <Textarea
                    placeholder="Write a reply..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSubmitComment}>
                      Reply
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setReplyTo(null)
                        setNewComment("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {replies.map((reply) => (
          <CommentCard key={reply.id} comment={reply} isReply />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">
        Comments ({comments.length})
      </h3>

      {/* New Comment Form */}
      {user && !replyTo && (
        <Card className="p-4">
          <div className="space-y-4">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px]"
            />
            <Button onClick={handleSubmitComment}>Post Comment</Button>
          </div>
        </Card>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading comments...
        </div>
      ) : topLevelComments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        topLevelComments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))
      )}
    </div>
  )
}
