import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Post } from '@/lib/community-data'

export function useRealtimePosts(campusId?: string, departmentId?: string, batch?: string) {
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
            campuses(name, code),
            departments(name, code)
          `)
          .order('created_at', { ascending: false })
          .limit(50)

        // Apply filters if provided
        if (campusId) {
          query = query.eq('campus_id', campusId)
        }

        if (departmentId) {
          query = query.eq('department_id', departmentId)
        }

        if (batch && batch !== '__all__') {
          query = query.eq('batch', batch)
        }

        const { data, error } = await query

        if (error) throw error

        // Transform data to match frontend interface
        const transformedPosts = (data || []).map((post: any) => ({
          id: post.id.toString(),
          author: post.author_name || 'Anonymous',
          avatar: post.avatar_url || '/student-avatar.png',
          department: post.department || (post.departments ? post.departments.name : ''),
          departmentCode: post.departments ? post.departments.code : '',
          campus: post.campuses ? post.campuses.name : '',
          campusCode: post.campuses ? post.campuses.code : '',
          semester: post.semester || '',
          batch: post.batch || '',
          time: new Date(post.created_at).toLocaleString(),
          content: post.content,
          likes: post.likes_count || 0,
          comments: post.comments_count || 0,
          shares: post.shares_count || 0,
          tags: Array.isArray(post.tags) ? post.tags : [],
          liked: false, // Will be updated when we get user likes
          type: post.type || 'general'
        }))

        setPosts(transformedPosts)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('community-posts-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_posts_enhanced',
        },
        (payload) => {
          const newPost = payload.new
          // Transform new post to match frontend interface
          const transformedPost = {
            id: newPost.id.toString(),
            author: newPost.author_name || 'Anonymous',
            avatar: newPost.avatar_url || '/student-avatar.png',
            department: newPost.department || (newPost.departments ? newPost.departments.name : ''),
            departmentCode: newPost.departments ? newPost.departments.code : '',
            campus: newPost.campuses ? newPost.campuses.name : '',
            campusCode: newPost.campuses ? newPost.campuses.code : '',
            semester: newPost.semester || '',
            batch: newPost.batch || '',
            time: new Date(newPost.created_at).toLocaleString(),
            content: newPost.content,
            likes: newPost.likes_count || 0,
            comments: newPost.comments_count || 0,
            shares: newPost.shares_count || 0,
            tags: Array.isArray(newPost.tags) ? newPost.tags : [],
            liked: false,
            type: newPost.type || 'general'
          }

          // Apply filters to new post
          let shouldInclude = true
          if (campusId && newPost.campus_id !== campusId) {
            shouldInclude = false
          }
          if (departmentId && newPost.department_id !== departmentId) {
            shouldInclude = false
          }
          if (batch && batch !== '__all__' && newPost.batch !== batch) {
            shouldInclude = false
          }

          if (shouldInclude) {
            setPosts((prevPosts) => [transformedPost, ...prevPosts])
          }
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
          // Transform updated post to match frontend interface
          const transformedPost = {
            id: updatedPost.id.toString(),
            author: updatedPost.author_name || 'Anonymous',
            avatar: updatedPost.avatar_url || '/student-avatar.png',
            department: updatedPost.department || (updatedPost.departments ? updatedPost.departments.name : ''),
            departmentCode: updatedPost.departments ? updatedPost.departments.code : '',
            campus: updatedPost.campuses ? updatedPost.campuses.name : '',
            campusCode: updatedPost.campuses ? updatedPost.campuses.code : '',
            semester: updatedPost.semester || '',
            batch: updatedPost.batch || '',
            time: new Date(updatedPost.created_at).toLocaleString(),
            content: updatedPost.content,
            likes: updatedPost.likes_count || 0,
            comments: updatedPost.comments_count || 0,
            shares: updatedPost.shares_count || 0,
            tags: Array.isArray(updatedPost.tags) ? updatedPost.tags : [],
            liked: false,
            type: updatedPost.type || 'general'
          }

          setPosts((prevPosts) =>
            prevPosts.map((post) =>
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
          const deletedPostId = payload.old.id.toString()
          setPosts((prevPosts) =>
            prevPosts.filter((post) => post.id !== deletedPostId)
          )
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