"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import type { Post, Reply } from "@/lib/community-data"
import { mockReplies } from "@/lib/community-data"
import { fetchPostById, fetchRepliesByPostId, toggleLikePerUser } from "@/lib/community"

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
        const p = await fetchPostById(postId)
        if (p) setPost(p)
        else setError("Post not found")
      } catch (e: any) {
        setError(e?.message || "Failed to load post")
      } finally {
        setLoading(false)
      }

      try {
        const r = await fetchRepliesByPostId(postId)
        if (r.length) setReplies(r)
        else setReplies(mockReplies.filter((mr) => mr.postId === postId))
      } catch {
        setReplies(mockReplies.filter((mr) => mr.postId === postId))
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
      // try per-user
      await toggleLikePerUser(snapshot.id, user.id, snapshot.liked)
    } catch (e1: any) {
      try {
        // fallback
        const { error } = await supabase
          .from("community_posts")
          .update({ likes: optimistic.likes, liked: optimistic.liked })
          .eq("id", snapshot.id)
        if (error) throw error
      } catch (e2: any) {
        setPost(snapshot)
        toast({ title: "Failed to update like", description: e2?.message || "Please try again.", variant: "destructive" })
      }
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
    const toInsert = {
      post_id: postId,
      content: local.content,
      author_name: local.author,
      avatar_url: local.avatar,
    }
    setNewReply("")
    try {
      const { data, error } = await supabase.from("community_replies").insert(toInsert).select("*").single()
      if (error) throw error
      // persist comments_count increment on post
      await supabase.from("community_posts").update({ comments_count: (post?.comments ?? 0) + 1 }).eq("id", postId)
      // replace optimistic with actual row (preserve order)
      setReplies((prev) =>
        prev.map((r) =>
          r.id === local.id
            ? { ...local, id: String(data.id), time: new Date(data.created_at).toLocaleString() }
            : r,
        ),
      )
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
