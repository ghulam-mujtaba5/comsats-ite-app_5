import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { withSupabaseRetry, RetryableError } from '@/lib/retry-utils'

export const dynamic = 'force-dynamic'

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'past_paper' | 'resource' | 'faculty' | 'community'
  url: string
  metadata: Record<string, any>
  score: number
}

export async function GET(req: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !anon) {
      return NextResponse.json({ 
        error: 'Search service not available', 
        data: { 
          pastPapers: [], 
          resources: [], 
          faculty: [], 
          community: [], 
          total: 0 
        } 
      })
    }

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim()
    const type = searchParams.get('type') // 'all', 'past_papers', 'resources', 'faculty', 'community'
    const limit = Number(searchParams.get('limit') || '20')

    if (!q || q.length < 2) {
      return NextResponse.json({ 
        error: 'Search query must be at least 2 characters',
        data: { 
          pastPapers: [], 
          resources: [], 
          faculty: [], 
          community: [], 
          total: 0 
        } 
      })
    }

    const supabase = serviceKey
      ? createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
      : createClient(url, anon)

    const results: {
      pastPapers: any[]
      resources: any[]
      faculty: any[]
      community: any[]
      total: number
    } = {
      pastPapers: [],
      resources: [],
      faculty: [],
      community: [],
      total: 0
    }

    // Search Past Papers
    if (type === 'all' || type === 'past_papers') {
      try {
        const pastPapers = await withSupabaseRetry(
          async () => {
            const { data, error } = await supabase
              .from('past_papers')
              .select('*')
              .eq('status', 'approved')
              .or(`title.ilike.%${q}%,course_code.ilike.%${q}%,department.ilike.%${q}%,semester.ilike.%${q}%,exam_type.ilike.%${q}%`)
              .order('created_at', { ascending: false })
              .limit(limit)
            
            if (error) throw error
            return data || []
          },
          'Search past papers',
          { maxRetries: 2, timeout: 12000 }
        )

        if (pastPapers) {
          results.pastPapers = pastPapers.map((paper: any) => ({
            id: paper.id,
            title: paper.title,
            description: `${paper.course_code} - ${paper.exam_type} ${paper.semester} ${paper.year}`,
            type: 'past_paper' as const,
            url: `/past-papers/${paper.course_code}`,
            downloadUrl: paper.file_url || paper.link_url,
            metadata: {
              courseCode: paper.course_code,
              department: paper.department,
              semester: paper.semester,
              year: paper.year,
              examType: paper.exam_type,
              fileType: paper.file_url ? 'PDF' : 'Link'
            },
            score: calculateRelevanceScore(q, paper.title, paper.course_code, paper.department)
          }))
        }
      } catch (error) {
        console.error('Error searching past papers:', error)
        // Continue with empty results for this category instead of failing entirely
      }
    }

    // Search Resources
    if (type === 'all' || type === 'resources') {
      try {
        const resources = await withSupabaseRetry(
          async () => {
            const { data, error } = await supabase
              .from('resources')
              .select('*')
              .or(`title.ilike.%${q}%,description.ilike.%${q}%,department.ilike.%${q}%`)
              .order('uploaded_at', { ascending: false })
              .limit(limit)
            
            if (error) throw error
            return data || []
          },
          'Search resources',
          { maxRetries: 2, timeout: 12000 }
        )

        if (resources) {
          results.resources = resources.map((resource: any) => ({
            id: resource.id,
            title: resource.title,
            description: resource.description || 'Learning resource',
            type: 'resource' as const,
            url: `/resources`,
            downloadUrl: resource.external_url || resource.file_url,
            metadata: {
              department: resource.department,
              term: resource.term,
              fileType: resource.mime_type,
              size: resource.size_bytes
            },
            score: calculateRelevanceScore(q, resource.title, resource.description, resource.department)
          }))
        }
      } catch (error) {
        console.error('Error searching resources:', error)
        // Continue with empty results for this category instead of failing entirely
      }
    }

    // Search Faculty
    if (type === 'all' || type === 'faculty') {
      try {
        const faculty = await withSupabaseRetry(
          async () => {
            const { data, error } = await supabase
              .from('faculty')
              .select('*')
              .or(`name.ilike.%${q}%,department.ilike.%${q}%,title.ilike.%${q}%`)
              .order('name', { ascending: true })
              .limit(limit)
            
            if (error) throw error
            return data || []
          },
          'Search faculty',
          { maxRetries: 2, timeout: 12000 }
        )

        if (faculty) {
          results.faculty = faculty.map((member: any) => ({
            id: member.id,
            title: member.name,
            description: `${member.title || 'Faculty'} - ${member.department}`,
            type: 'faculty' as const,
            url: `/faculty/${member.id}`,
            metadata: {
              name: member.name,
              title: member.title,
              department: member.department,
              email: member.email,
              office: member.office,
              specialization: member.specialization,
              averageRating: Number(member.rating_avg ?? 0),
              totalReviews: Number(member.rating_count ?? 0)
            },
            score: calculateRelevanceScore(q, member.name, member.department, member.title)
          }))
        }
      } catch (error) {
        console.error('Error searching faculty:', error)
        // Continue with empty results for this category instead of failing entirely
      }
    }

    // Search Community (if community table exists)
    if (type === 'all' || type === 'community') {
      try {
        const community = await withSupabaseRetry(
          async () => {
            const { data, error } = await supabase
              .from('community_posts')
              .select('*')
              .or(`title.ilike.%${q}%,content.ilike.%${q}%,type.ilike.%${q}%`)
              .eq('status', 'approved')
              .order('created_at', { ascending: false })
              .limit(limit)
            
            if (error) {
              // If community_posts table doesn't exist, ignore the error
              if (error.code === '42P01') {
                return []
              }
              throw error
            }
            return data || []
          },
          'Search community posts',
          { maxRetries: 2, timeout: 12000 }
        )

        if (community) {
          results.community = community.map((post: any) => ({
            id: post.id,
            title: post.title,
            description: post.content?.substring(0, 150) + '...' || 'Community post',
            type: 'community' as const,
            url: `/community/post/${post.id}`,
            metadata: {
              category: post.type,
              author: post.author_name,
              createdAt: post.created_at,
              upvotes: post.likes || 0,
              replies: post.comments_count || 0
            },
            score: calculateRelevanceScore(q, post.title, post.content, post.type)
          }))
        }
      } catch (error) {
        console.error('Error searching community posts:', error)
        // Continue with empty results for this category instead of failing entirely
      }
    }

    // Sort all results by relevance score
    results.pastPapers.sort((a, b) => b.score - a.score)
    results.resources.sort((a, b) => b.score - a.score)
    results.faculty.sort((a, b) => b.score - a.score)
    results.community.sort((a, b) => b.score - a.score)

    results.total = results.pastPapers.length + results.resources.length + results.faculty.length + results.community.length

    return NextResponse.json({ 
      data: results,
      query: q,
      searchTime: Date.now()
    })

  } catch (error: any) {
    console.error('Universal search error:', error)
    return NextResponse.json({ 
      error: error.message || 'Search failed', 
      data: { 
        pastPapers: [], 
        resources: [], 
        faculty: [], 
        community: [], 
        total: 0 
      } 
    }, { status: 500 })
  }
}

// Helper function to calculate relevance score
function calculateRelevanceScore(query: string, ...fields: (string | null | undefined)[]): number {
  const q = query.toLowerCase()
  let score = 0

  fields.forEach((field, index) => {
    if (!field) return
    
    const text = field.toLowerCase()
    
    // Exact match gets highest score
    if (text === q) {
      score += 100 * (fields.length - index)
      return
    }
    
    // Word boundary match
    const wordBoundaryRegex = new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    if (wordBoundaryRegex.test(text)) {
      score += 75 * (fields.length - index)
    }
    
    // Starts with query
    if (text.startsWith(q)) {
      score += 50 * (fields.length - index)
    }
    
    // Contains query
    if (text.includes(q)) {
      score += 25 * (fields.length - index)
    }
    
    // Partial word matches
    const words = q.split(' ')
    words.forEach(word => {
      if (word.length > 2 && text.includes(word)) {
        score += 10 * (fields.length - index)
      }
    })
  })

  return score
}