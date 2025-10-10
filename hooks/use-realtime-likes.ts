import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useRealtimeLikes(postId: string) {
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!postId) return

    // Fetch initial likes count and user like status
    const fetchLikes = async () => {
      try {
        setLoading(true)
        
        // Get likes count
        const { count, error: countError } = await supabase
          .from('post_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', postId)
          .eq('reaction_type', 'like')

        if (countError) throw countError

        setLikes(count || 0)

        // Check if current user has liked the post
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data, error: likeError } = await supabase
            .from('post_reactions')
            .select('id')
            .eq('post_id', postId)
            .eq('user_id', user.id)
            .eq('reaction_type', 'like')
            .maybeSingle()

          if (likeError) throw likeError

          setIsLiked(!!data)
        }
      } catch (err) {
        console.error('Error fetching likes:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLikes()

    // Subscribe to real-time changes in likes
    const channel = supabase
      .channel(`likes-post-${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_reactions',
          filter: `post_id=eq.${postId}`,
        },
        () => {
          // A new like was added
          setLikes((prev) => prev + 1)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'post_reactions',
          filter: `post_id=eq.${postId}`,
        },
        () => {
          // A like was removed
          setLikes((prev) => Math.max(0, prev - 1))
        }
      )
      .subscribe()

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel)
    }
  }, [postId])

  const toggleLike = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from('post_reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .eq('reaction_type', 'like')

        if (error) throw error

        setIsLiked(false)
        setLikes((prev) => Math.max(0, prev - 1))
      } else {
        // Add like
        const { error } = await supabase
          .from('post_reactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            reaction_type: 'like',
          })

        if (error) throw error

        setIsLiked(true)
        setLikes((prev) => prev + 1)
      }
    } catch (err) {
      console.error('Error toggling like:', err)
      throw err
    }
  }

  return { likes, isLiked, loading, toggleLike }
}