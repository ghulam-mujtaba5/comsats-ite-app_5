import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@lib/supabase'

export interface SearchFilters {
  query: string
  campusId?: string
  departmentId?: string
  batch?: string
  category?: string
  tags?: string[]
  dateRange?: {
    from?: string
    to?: string
  }
  sortBy?: 'recent' | 'popular' | 'liked' | 'commented'
  postTypes?: string[]
  author?: string
}

export interface SearchResult {
  id: string
  title: string
  content: string
  type: string
  author: string
  authorAvatar: string
  createdAt: string
  likes: number
  comments: number
  tags: string[]
  campus: string
  department: string
  batch: string
  relevanceScore: number
}

export function useAdvancedSearch() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    sortBy: 'recent'
  })

  const search = useCallback(async (searchFilters: SearchFilters) => {
    setLoading(true)
    setError(null)
    
    try {
      // Build the search query
      let query = supabase
        .from('community_posts')
        .select(`
          *,
          campuses(name),
          departments(name)
        `)

      // Apply text search
      if (searchFilters.query) {
        // Use Supabase full text search if available, otherwise use ILIKE
        query = query.or(
          `content.ilike.%${searchFilters.query}%,tags.cs.{${searchFilters.query}}`
        )
      }

      // Apply campus filter
      if (searchFilters.campusId) {
        query = query.eq('campus_id', searchFilters.campusId)
      }

      // Apply department filter
      if (searchFilters.departmentId) {
        query = query.eq('department_id', searchFilters.departmentId)
      }

      // Apply batch filter
      if (searchFilters.batch && searchFilters.batch !== '__all__') {
        query = query.eq('batch', searchFilters.batch)
      }

      // Apply category filter
      if (searchFilters.category && searchFilters.category !== 'all') {
        query = query.eq('type', searchFilters.category)
      }

      // Apply tags filter
      if (searchFilters.tags && searchFilters.tags.length > 0) {
        // This is a simplified approach - in practice, you might need a more complex query
        searchFilters.tags.forEach(tag => {
          query = query.contains('tags', [tag])
        })
      }

      // Apply date range filter
      if (searchFilters.dateRange?.from) {
        query = query.gte('created_at', searchFilters.dateRange.from)
      }
      if (searchFilters.dateRange?.to) {
        query = query.lte('created_at', searchFilters.dateRange.to)
      }

      // Apply post types filter
      if (searchFilters.postTypes && searchFilters.postTypes.length > 0) {
        query = query.in('type', searchFilters.postTypes)
      }

      // Apply author filter
      if (searchFilters.author) {
        query = query.ilike('author_name', `%${searchFilters.author}%`)
      }

      // Apply sorting
      switch (searchFilters.sortBy) {
        case 'popular':
          query = query.order('likes', { ascending: false })
          break
        case 'liked':
          query = query.order('likes', { ascending: false })
          break
        case 'commented':
          query = query.order('comments_count', { ascending: false })
          break
        case 'recent':
        default:
          query = query.order('created_at', { ascending: false })
          break
      }

      // Limit results
      query = query.limit(50)

      const { data, error } = await query

      if (error) throw error

      // Transform data to match SearchResult interface
      const transformedResults = (data || []).map((post: any) => ({
        id: post.id.toString(),
        title: post.content.split('\n')[0].slice(0, 100) + (post.content.length > 100 ? '...' : ''),
        content: post.content,
        type: post.type || 'general',
        author: post.author_name || 'Anonymous',
        authorAvatar: post.avatar_url || '/student-avatar.png',
        createdAt: post.created_at,
        likes: post.likes || 0,
        comments: post.comments_count || 0,
        tags: Array.isArray(post.tags) ? post.tags : [],
        campus: post.campuses?.name || '',
        department: post.departments?.name || '',
        batch: post.batch || '',
        relevanceScore: calculateRelevanceScore(post, searchFilters.query)
      }))

      setResults(transformedResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to perform search')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Calculate relevance score for sorting when searching by text
  const calculateRelevanceScore = (post: any, query: string): number => {
    if (!query) return 1
    
    const content = (post.content || '').toLowerCase()
    const tags = Array.isArray(post.tags) ? post.tags.join(' ').toLowerCase() : ''
    const author = (post.author_name || '').toLowerCase()
    const queryLower = query.toLowerCase()
    
    let score = 0
    
    // Content matching
    if (content.includes(queryLower)) {
      score += content.split(queryLower).length - 1
      // Bonus for exact phrase match
      if (content.includes(` ${queryLower} `)) {
        score += 2
      }
    }
    
    // Tag matching
    if (tags.includes(queryLower)) {
      score += tags.split(queryLower).length - 1
    }
    
    // Author matching
    if (author.includes(queryLower)) {
      score += 1
    }
    
    return score
  }

  // Debounced search function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.query.length > 2 || 
          filters.campusId || 
          filters.departmentId || 
          filters.batch || 
          filters.category || 
          filters.tags?.length || 
          filters.author) {
        search(filters)
      } else if (!filters.query) {
        // Clear results when query is empty
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [filters, search])

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      sortBy: 'recent'
    })
  }

  return {
    results,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    search
  }
}