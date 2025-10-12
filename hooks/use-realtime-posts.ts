import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Post } from '@/lib/community-data'

export function useRealtimePosts(campusId?: string | null, departmentId?: string | null, batch?: string | null) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch initial posts
    const fetchPosts = async () => {
      try {
        setLoading(true)
        let query = supabase
          .from('community_posts_enhanced')
          .select(`
            *,
            user:user_id (
              id,
              email
            )
          `)
          .order('created_at', { ascending: false })
          .limit(50)

        // Apply filters
        if (campusId) {
          query = query.eq('campus_id', campusId)
        }
        
        if (departmentId) {
          query = query.eq('department_id', departmentId)
        }
        
        if (batch) {
          query = query.eq('batch', batch)
        }

        const { data, error } = await query

        if (error) throw error

        // Transform data to match Post interface
        const transformedPosts = (data || []).map((post: any) => ({
          id: post.id,
          user_id: post.user_id,
          author: post.user?.email?.split('@')[0] || 'Anonymous',
          avatar: post.avatar_url || '/placeholder.svg',
          department: post.department_id || '',
          departmentCode: '',
          campus: post.campus_id || '',
          campusCode: '',
          semester: '',
          batch: post.batch || '',
          time: new Date(post.created_at).toLocaleDateString(),
          content: post.content || '',
          likes: post.likes_count || 0,
          comments: post.comments_count || 0,
          shares: post.shares_count || 0,
          tags: [],
          liked: false,
          type: post.type || 'general',
          media: post.media || [],
          location: post.location || '',
          feeling: post.feeling || '',
          visibility: post.visibility || 'public',
          is_pinned: post.is_pinned || false,
          is_edited: post.is_edited || false,
          edited_at: post.edited_at || '',
          views_count: post.views_count || 0,
          created_at: post.created_at,
          updated_at: post.updated_at || ''
        }))

        setPosts(transformedPosts)
        setError(null)
      } catch (err) {
        console.error('Error fetching posts:', err)
        setError('Failed to load posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('community-posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_posts_enhanced',
        },
        (payload) => {
          const newPost = payload.new
          // Transform new post to match Post interface
          const transformedPost = {
            id: newPost.id,
            user_id: newPost.user_id,
            author: newPost.user?.email?.split('@')[0] || 'Anonymous',
            avatar: newPost.avatar_url || '/placeholder.svg',
            department: newPost.department_id || '',
            departmentCode: '',
            campus: newPost.campus_id || '',
            campusCode: '',
            semester: '',
            batch: newPost.batch || '',
            time: new Date(newPost.created_at).toLocaleDateString(),
            content: newPost.content || '',
            likes: newPost.likes_count || 0,
            comments: newPost.comments_count || 0,
            shares: newPost.shares_count || 0,
            tags: [],
            liked: false,
            type: newPost.type || 'general',
            media: newPost.media || [],
            location: newPost.location || '',
            feeling: newPost.feeling || '',
            visibility: newPost.visibility || 'public',
            is_pinned: newPost.is_pinned || false,
            is_edited: newPost.is_edited || false,
            edited_at: newPost.edited_at || '',
            views_count: newPost.views_count || 0,
            created_at: newPost.created_at,
            updated_at: newPost.updated_at || ''
          }
          
          setPosts((prev) => [transformedPost, ...prev])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'community_posts_enhanced',
        },
        (payload) => {
          const updatedPost = payload.new
          // Transform updated post to match Post interface
          const transformedPost = {
            id: updatedPost.id,
            user_id: updatedPost.user_id,
            author: updatedPost.user?.email?.split('@')[0] || 'Anonymous',
            avatar: updatedPost.avatar_url || '/placeholder.svg',
            department: updatedPost.department_id || '',
            departmentCode: '',
            campus: updatedPost.campus_id || '',
            campusCode: '',
            semester: '',
            batch: updatedPost.batch || '',
            time: new Date(updatedPost.created_at).toLocaleDateString(),
            content: updatedPost.content || '',
            likes: updatedPost.likes_count || 0,
            comments: updatedPost.comments_count || 0,
            shares: updatedPost.shares_count || 0,
            tags: [],
            liked: false,
            type: updatedPost.type || 'general',
            media: updatedPost.media || [],
            location: updatedPost.location || '',
            feeling: updatedPost.feeling || '',
            visibility: updatedPost.visibility || 'public',
            is_pinned: updatedPost.is_pinned || false,
            is_edited: updatedPost.is_edited || false,
            edited_at: updatedPost.edited_at || '',
            views_count: updatedPost.views_count || 0,
            created_at: updatedPost.created_at,
            updated_at: updatedPost.updated_at || ''
          }
          
          setPosts((prev) => 
            prev.map((post) => 
              post.id === transformedPost.id ? transformedPost : post
            )
          )
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'community_posts_enhanced',
        },
        (payload) => {
          const deletedPostId = payload.old.id
          setPosts((prev) => prev.filter((post) => post.id !== deletedPostId))
        }
      )
      .subscribe()

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel)
    }
  }, [campusId, departmentId, batch])

  return { posts, loading, error }
}