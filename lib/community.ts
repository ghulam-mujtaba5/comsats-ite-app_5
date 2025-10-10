import { supabase } from "@/lib/supabase"
import type { Post, Reply } from "@/lib/community-data"

export async function fetchPosts(limit = 100): Promise<Post[]> {
  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data || []).map((row: any) => rowToPost(row))
}

export async function fetchGroups() {
  const { data, error } = await supabase.from("community_groups").select("*").order("name")
  if (error) throw error
  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    members: Number(row.members ?? 0),
    description: row.description || "",
    category: row.category || "General",
    isJoined: !!row.is_joined,
    recentActivity: row.recent_activity || "",
    posts: Number(row.posts ?? 0),
  }))
}

export async function fetchPostById(id: string): Promise<Post | null> {
  const { data, error } = await supabase.from("community_posts").select("*").eq("id", id).single()
  if (error) return null
  return rowToPost(data)
}

export async function fetchRepliesByPostId(postId: string): Promise<Reply[]> {
  const { data, error } = await supabase
    .from("community_replies")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
  if (error) throw error
  return (data || []).map((r: any) => ({
    id: String(r.id),
    postId: String(r.post_id),
    author: r.author_name || "Anonymous",
    avatar: r.avatar_url || "/student-avatar.png",
    time: r.created_at ? new Date(r.created_at).toLocaleString() : "",
    content: r.content || "",
    likes: Number(r.likes ?? 0),
    liked: !!r.liked,
  }))
}

export async function toggleLikePost(post: Post) {
  const updated = { liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
  const { error } = await supabase
    .from("community_posts")
    .update({ likes: updated.likes, liked: updated.liked })
    .eq("id", post.id)
  if (error) throw error
  return { ...post, ...updated }
}

// Attempts to toggle like using a per-user likes table (post_reactions).
// If the table or constraint doesn't exist, throws so caller can fallback.
export async function toggleLikePerUser(postId: string, userId: string, currentlyLiked: boolean) {
  try {
    if (currentlyLiked) {
      const { error } = await supabase.from("post_reactions").delete().eq("post_id", postId).eq("user_id", userId).eq("reaction_type", "like")
      if (error) throw error
    } else {
      const { error } = await supabase.from("post_reactions").insert({ post_id: postId, user_id: userId, reaction_type: "like" })
      if (error) throw error
    }
  } catch (e) {
    throw e
  }
}

export async function fetchLikedForUser(postIds: string[], userId: string): Promise<Record<string, boolean>> {
  if (!postIds.length) return {}
  try {
    const { data, error } = await supabase
      .from("post_reactions")
      .select("post_id")
      .eq("user_id", userId)
      .eq("reaction_type", "like")
      .in("post_id", postIds)
    if (error) throw error
    const map: Record<string, boolean> = {}
    for (const row of data || []) map[String(row.post_id)] = true
    return map
  } catch {
    return {}
  }
}

export async function addReply(postId: string, reply: Omit<Reply, "id" | "time">) {
  const toInsert = {
    post_id: postId,
    content: reply.content,
    author_name: reply.author,
    avatar_url: reply.avatar,
  }
  const { data, error } = await supabase.from("post_comments_enhanced").insert(toInsert).select("*").single()
  if (error) throw error
  return {
    id: String(data.id),
    postId,
    author: data.author_name || reply.author,
    avatar: data.avatar_url || reply.avatar,
    time: data.created_at ? new Date(data.created_at).toLocaleString() : "",
    content: data.content,
    likes: Number(data.likes_count ?? 0),
    liked: !!data.liked,
  } as Reply
}

export async function incrementComments(postId: string, by = 1) {
  const { data, error } = await supabase
    .from("community_posts_enhanced")
    .update({ comments_count: supabase.rpc as any }) // placeholder if RPC used later
    .eq("id", postId)
}

function rowToPost(row: any): Post {
  return {
    id: String(row.id),
    author: row.author_name || row.user_name || "Anonymous",
    avatar: row.avatar_url || "/student-avatar.png",
    department: row.department || "",
    departmentCode: row.department_code || "",
    campus: row.campus || "",
    campusCode: row.campus_code || "",
    semester: row.semester || "",
    batch: row.batch || "",
    time: row.created_at ? new Date(row.created_at).toLocaleString() : "",
    content: row.content || "",
    likes: Number(row.likes_count ?? 0),
    comments: Number(row.comments_count ?? 0),
    shares: Number(row.shares_count ?? 0),
    tags: Array.isArray(row.tags) ? row.tags : [],
    liked: !!row.liked,
    type: row.type || "general",
  }
}
