"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import layout from "@/app/styles/common.module.css"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, ArrowLeft, FileText, Paperclip } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import { useRealtimeComments } from "@/hooks/use-realtime-comments"
import { useRealtimeLikes } from "@/hooks/use-realtime-likes"
import type { Post, Reply } from "@/lib/community-data"
import type { MediaItem } from "@/lib/community-data"

type PostWithMedia = Omit<Post, 'media'> & {
  media?: string[]
}

export function PostClient() {
  const params = useParams()
  const router = useRouter()
  const postId = useMemo(() => {
    const raw = (params as any)?.id
    if (!raw) return null
    const idStr = Array.isArray(raw) ? String(raw[0]) : String(raw)
    return idStr
  }, [params])

  const [post, setPost] = useState<PostWithMedia | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newReply, setNewReply] = useState("")
  const { user } = useAuth()
  const [replyLimit] = useState(20)
  const [replyOffset, setReplyOffset] = useState(0)
  const [hasMoreReplies, setHasMoreReplies] = useState(true)
  const [loadingMoreReplies, setLoadingMoreReplies] = useState(false)

  useEffect(() => {
    if (postId == null) return
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/community/posts/${postId}`, { cache: "no-store" })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || "Failed to load post")
        setPost(json.data)
      } catch (e: any) {
        setError(e?.message || "Failed to load post")
      } finally {
        setLoading(false)
      }

      try {
        const resR = await fetch(`/api/community/replies?post_id=${postId}&limit=${replyLimit}&offset=0&meta=1`, { cache: "no-store" })
        const jsonR = await resR.json()
        if (!resR.ok) throw new Error(jsonR?.error || "Failed to load replies")
        const rows = (jsonR.data || []) as any[]
        const mapped = rows.map((r) => ({
          id: String(r.id),
          postId: String(r.post_id),
          author: r.author_name || "Anonymous",
            avatar: r.avatar_url || "/student-avatar.png",
          time: r.created_at ? new Date(r.created_at).toLocaleString() : "",
          content: r.content || "",
          likes: Number(r.likes ?? 0),
          liked: !!r.liked,
        }))
        setReplies(mapped)
        const meta = jsonR && jsonR.meta ? jsonR.meta : { hasMore: rows.length === replyLimit, nextOffset: rows.length }
        setHasMoreReplies(!!meta.hasMore)
        setReplyOffset(Number.isFinite(meta.nextOffset) ? meta.nextOffset : rows.length)
      } catch (e: any) {
        setError(e?.message || "Failed to load replies")
      }
    }
    load()
  }, [postId, replyLimit])

  const loadMoreReplies = async () => {
    if (!postId || loadingMoreReplies || !hasMoreReplies) return
    setLoadingMoreReplies(true)
    try {
      const res = await fetch(`/api/community/replies?post_id=${postId}&limit=${replyLimit}&offset=${replyOffset}&meta=1`, { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed to load more replies')
      const rows = (json.data || []) as any[]
      const mapped = rows.map((r) => ({
        id: String(r.id),
        postId: String(r.post_id),
        author: r.author_name || 'Anonymous',
        avatar: r.avatar_url || '/student-avatar.png',
        time: r.created_at ? new Date(r.created_at).toLocaleString() : '',
        content: r.content || '',
        likes: Number(r.likes ?? 0),
        liked: !!r.liked,
      }))
      setReplies((prev) => [...prev, ...mapped])
      const meta = json && json.meta ? json.meta : { hasMore: mapped.length === replyLimit, nextOffset: replyOffset + mapped.length }
      setReplyOffset(Number.isFinite(meta.nextOffset) ? meta.nextOffset : replyOffset + mapped.length)
      setHasMoreReplies(!!meta.hasMore)
    } catch (e: any) {
      toast({ title: 'Failed to load more replies', description: e?.message || 'Please try again.', variant: 'destructive' })
    } finally {
      setLoadingMoreReplies(false)
    }
  }

  // Use real-time comments and likes
  const { comments: realtimeComments, loading: commentsLoading, error: commentsError, addComment } = useRealtimeComments(postId || '')
  const { likes: realtimeLikes, isLiked: realtimeIsLiked, loading: likesLoading, toggleLike: toggleRealtimeLike } = useRealtimeLikes(postId || '')
  
  // Use real-time data when available
  const commentsToDisplay = realtimeComments.length > 0 ? realtimeComments : replies
  const currentLikes = realtimeLikes > 0 ? realtimeLikes : (post?.likes || 0)
  const isPostLiked = realtimeIsLiked || (post?.liked || false)

  const handleLike = async () => {
    if (!post) return
    if (!user) {
      toast({ title: "Sign in required", description: "Please log in to like posts.", variant: "destructive" })
      return
    }
    
    // Use real-time like toggle when available
    if (toggleRealtimeLike) {
      try {
        await toggleRealtimeLike()
        return
      } catch (error) {
        // Fallback to original method if real-time fails
        console.error('Real-time like failed, falling back to original method:', error)
      }
    }
    
    // Original like handling as fallback
    const snapshot = post
    const optimistic = { ...snapshot, liked: !snapshot.liked, likes: snapshot.liked ? snapshot.likes - 1 : snapshot.likes + 1 }
    setPost(optimistic)
    try {
      const res = await fetch(`/api/community/posts/${snapshot.id}/like`, { method: "POST" })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to like")
      const { count, liked } = json as { count: number; liked: boolean }
      setPost((prev) => (prev ? { ...prev, likes: count, liked } : prev))
    } catch (e: any) {
      setPost(snapshot)
      toast({ title: "Failed to update like", description: e?.message || "Please try again.", variant: "destructive" })
    }
  }

  const handleAddReply = async () => {
    if (!newReply.trim() || postId == null) return
    if (!user) {
      toast({ title: "Sign in required", description: "Please log in to reply.", variant: "destructive" })
      return
    }
    
    // Use real-time comment addition when available
    if (addComment) {
      try {
        await addComment(newReply.trim())
        setNewReply("")
        toast({ title: "Reply posted" })
        return
      } catch (error) {
        // Fallback to original method if real-time fails
        console.error('Real-time comment failed, falling back to original method:', error)
      }
    }
    
    // Original reply handling as fallback
    const localId = `local-${Date.now()}`
    const local: Reply = {
      id: localId,
      postId: postId,
      author: user.email?.split("@")[0] || "You",
      avatar: "/student-avatar.png",
      time: new Date().toLocaleString(),
      content: newReply.trim(),
      likes: 0,
      liked: false,
    }
    setReplies((prev) => [...prev, local])
    setPost((prev) => (prev ? { ...prev, comments: prev.comments + 1 } : prev))
    const payload = { post_id: postId, content: local.content, author_name: local.author, avatar_url: local.avatar }
    setNewReply("")
    try {
      const res = await fetch(`/api/community/replies`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to post reply")
      const data = json.data
      setReplies((prev) => prev.map((r) => (r.id === local.id ? { ...local, id: String(data.id), time: data.created_at ? new Date(data.created_at).toLocaleString() : local.time } : r)))
      setPost((prev) => (prev ? { ...prev, comments: prev.comments + 0 } : prev))
      toast({ title: "Reply posted" })
    } catch (e: any) {
      setReplies((prev) => prev.filter((r) => r.id !== local.id))
      setPost((prev) => (prev ? { ...prev, comments: Math.max(0, prev.comments - 1) } : prev))
      toast({ title: "Failed to post reply", description: e?.message || "Please try again.", variant: "destructive" })
    }
  }

  return (
    <div className={`${layout.section} ${layout.max6xl} px-4 py-6`}>
      <div className="mb-4">
        <Button variant="outline" onClick={() => router.push("/community")}> 
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Community
        </Button>
      </div>

      {loading ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="h-4 w-40 bg-muted rounded animate-pulse" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                <div className="h-5 w-20 bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-5 w-32 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-6 w-full bg-muted rounded animate-pulse" />
              <div className="h-6 w-5/6 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
      ) : !post ? (
        <Card className="p-8 text-center text-blue-600">{error || "Post not found"}</Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.avatar} />
                  <AvatarFallback>{post.author.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <span className="font-semibold">{post.author}</span>
                {post.department && (
                  <Badge className="border-transparent bg-secondary text-secondary-foreground">{post.department}</Badge>
                )}
                {post.semester && <Badge className="text-xs border text-foreground">{post.semester}</Badge>}
                <span className="text-sm text-muted-foreground ml-auto">{post.time}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed">{post.content}</p>
              
              {/* Media gallery */}
              {post.media && post.media.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {post.media.map((mediaUrl, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      {typeof mediaUrl === 'string' && mediaUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        // Image
                        <img 
                          src={mediaUrl} 
                          alt={`Post media ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      ) : typeof mediaUrl === 'string' && mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                        // Video
                        <video 
                          src={mediaUrl} 
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : typeof mediaUrl === 'string' && mediaUrl.match(/\.(pdf|doc|docx)$/i) ? (
                        // Document
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                      ) : (
                        // Generic file
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Paperclip className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} className="text-xs border">#{tag}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-6 text-muted-foreground">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 hover:text-blue-500 ${post.liked ? "text-blue-500" : ""}`}
                >
                  <Heart className={`h-4 w-4 ${post.liked ? "fill-current" : ""}`} /> {post.likes}
                </button>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" /> {replies.length}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Replies ({replies.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {replies.length === 0 ? (
                <div className="text-center text-muted-foreground">No replies yet. Be the first to reply.</div>
              ) : (
                replies.map((r) => (
                  <div key={r.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={r.avatar} />
                      <AvatarFallback>{r.author.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{r.author}</span>
                        <span className="text-muted-foreground">{r.time}</span>
                      </div>
                      <p className="mt-1">{r.content}</p>
                    </div>
                  </div>
                ))
              )}

              {hasMoreReplies && (
                <div className="flex justify-center">
                  <Button onClick={loadMoreReplies} disabled={loadingMoreReplies} variant="outline">
                    {loadingMoreReplies ? 'Loading…' : 'Load more replies'}
                  </Button>
                </div>
              )}

              <div className="pt-4 border-t mt-2 space-y-2">
                <Textarea
                  placeholder="Write a reply..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  className="min-h-[90px]"
                />
                <div className="flex justify-end">
                  <Button onClick={handleAddReply} disabled={!newReply.trim()}>Reply</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default PostClient
