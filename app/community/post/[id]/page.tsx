"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import type { Post, Reply } from "@/lib/community-data"
// Client now uses API routes, not direct Supabase queries

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const postId = useMemo(() => {
    const raw = (params as any)?.id
    if (!raw) return null
    const idStr = Array.isArray(raw) ? String(raw[0]) : String(raw)
    return idStr
  }, [params])

  const [post, setPost] = useState<Post | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newReply, setNewReply] = useState("")
  const { user } = useAuth()

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
        const resR = await fetch(`/api/community/replies?post_id=${postId}`, { cache: "no-store" })
        const jsonR = await resR.json()
        if (!resR.ok) throw new Error(jsonR?.error || "Failed to load replies")
        const rows = (jsonR.data || []) as any[]
        setReplies(
          rows.map((r) => ({
            id: String(r.id),
            postId: String(r.post_id),
            author: r.author_name || "Anonymous",
            avatar: r.avatar_url || "/student-avatar.png",
            time: r.created_at ? new Date(r.created_at).toLocaleString() : "",
            content: r.content || "",
            likes: Number(r.likes ?? 0),
            liked: !!r.liked,
          }))
        )
      } catch (e: any) {
        setError(e?.message || "Failed to load replies")
      }
    }
    load()
  }, [postId])

  const handleLike = async () => {
    if (!post) return
    if (!user) {
      toast({ title: "Sign in required", description: "Please log in to like posts.", variant: "destructive" })
      return
    }
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
    // optimistic append
    setReplies((prev) => [...prev, local])
    // optimistic comment count increment
    setPost((prev) => (prev ? { ...prev, comments: prev.comments + 1 } : prev))
    const payload = {
      post_id: postId,
      content: local.content,
      author_name: local.author,
      avatar_url: local.avatar,
    }
    setNewReply("")
    try {
      const res = await fetch(`/api/community/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to post reply")
      const data = json.data
      setReplies((prev) => prev.map((r) => (r.id === local.id ? {
        ...local,
        id: String(data.id),
        time: data.created_at ? new Date(data.created_at).toLocaleString() : local.time,
      } : r)))
      // update post comments count to server value if present
      setPost((prev) => (prev ? { ...prev, comments: prev.comments + 0 } : prev))
      toast({ title: "Reply posted" })
    } catch (e: any) {
      // remove optimistic on failure
      setReplies((prev) => prev.filter((r) => r.id !== local.id))
      setPost((prev) => (prev ? { ...prev, comments: Math.max(0, prev.comments - 1) } : prev))
      toast({ title: "Failed to post reply", description: e?.message || "Please try again.", variant: "destructive" })
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
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
