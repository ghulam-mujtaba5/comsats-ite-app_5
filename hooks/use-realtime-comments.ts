import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Reply } from '@/lib/community-data'

export function useRealtimeComments(postId: string) {
  const [comments, setComments] = useState<Reply[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!postId) return

    // Fetch initial comments
    const fetchComments = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('community_comments')
          .select(`
            *,
            user:user_id (
              id,
              email
            )
          `)
          .eq('post_id', postId)
          .order('created_at', { ascending: true })

        if (error) throw error

        // Transform data to match frontend interface
        const transformedComments = (data || []).map((comment: any) => ({
          id: comment.id.toString(),
          postId: comment.post_id.toString(),
          author: comment.user?.email?.split('@')[0] || comment.author_name || 'Anonymous',
          avatar: comment.avatar_url || '/student-avatar.png',
          time: new Date(comment.created_at).toLocaleString(),
          content: comment.content,
          likes: comment.likes || 0,
          liked: false, // Will be updated when we get user likes
        }))

        setComments(transformedComments)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch comments')
      } finally {
        setLoading(false)
      }
    }

    fetchComments()

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`comments-post-${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_comments',
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          const newComment = payload.new
          // Transform new comment to match frontend interface
          const transformedComment = {
            id: newComment.id.toString(),
            postId: newComment.post_id.toString(),
            author: newComment.user?.email?.split('@')[0] || newComment.author_name || 'Anonymous',
            avatar: newComment.avatar_url || '/student-avatar.png',
            time: new Date(newComment.created_at).toLocaleString(),
            content: newComment.content,
            likes: newComment.likes || 0,
            liked: false,
          }

          setComments((prevComments) => [...prevComments, transformedComment])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'community_comments',
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          const updatedComment = payload.new
          // Transform updated comment to match frontend interface
          const transformedComment = {
            id: updatedComment.id.toString(),
            postId: updatedComment.post_id.toString(),
            author: updatedComment.user?.email?.split('@')[0] || updatedComment.author_name || 'Anonymous',
            avatar: updatedComment.avatar_url || '/student-avatar.png',
            time: new Date(updatedComment.created_at).toLocaleString(),
            content: updatedComment.content,
            likes: updatedComment.likes || 0,
            liked: false,
          }

          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === transformedComment.id ? transformedComment : comment
            )
          )
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'community_comments',
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          const deletedCommentId = payload.old.id.toString()
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== deletedCommentId)
          )
        }
      )
      .subscribe()

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel)
    }
  }, [postId])

  const addComment = async (content: string) => {
    try {
      const { data, error } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          content,
        })
        .select()
        .single()

      if (error) throw error

      return data
    } catch (err) {
      throw err
    }
  }

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('community_comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error

      return true
    } catch (err) {
      throw err
    }
  }

  return { comments, loading, error, addComment, deleteComment }
}