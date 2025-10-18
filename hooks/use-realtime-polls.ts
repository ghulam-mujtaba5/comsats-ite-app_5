import { useEffect, useState } from 'react'
import { supabase } from '@lib/supabase'

interface PollOption {
  id: string
  text: string
  votes: number
}

interface CommunityPoll {
  id: string
  question: string
  description: string
  options: PollOption[]
  totalVotes: number
  userHasVoted: boolean
  userVote?: string[]
  createdAt: string
  expiresAt?: string
  createdBy: {
    name: string
    avatar: string
  }
  campusId?: string
  departmentId?: string
  batch?: string
  tags: string[]
  category: string
  isAnonymous: boolean
}

export function useRealtimePolls(campusId?: string, departmentId?: string) {
  const [polls, setPolls] = useState<CommunityPoll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch initial polls
    const fetchPolls = async () => {
      try {
        setLoading(true)
        let query = supabase
          .from('community_polls')
          .select(`
            *,
            creator:user_id (
              id,
              email,
              user_metadata
            ),
            campuses(name, code),
            departments(name, code)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(50)

        // Apply filters if provided
        if (campusId) {
          query = query.eq('campus_id', campusId)
        }

        if (departmentId) {
          query = query.eq('department_id', departmentId)
        }

        const { data, error } = await query

        if (error) throw error

        // Transform data to match frontend interface
        const transformedPolls = (data || []).map((poll: any) => ({
          id: poll.id.toString(),
          question: poll.title,
          description: poll.description,
          options: poll.options.map((option: string, index: number) => ({
            id: index.toString(),
            text: option,
            votes: poll.votes?.[index] || 0
          })),
          totalVotes: poll.votes?.reduce((sum: number, count: number) => sum + count, 0) || 0,
          userHasVoted: false, // Will be updated when we get user votes
          createdAt: new Date(poll.created_at).toLocaleString(),
          expiresAt: poll.expires_at ? new Date(poll.expires_at).toLocaleString() : undefined,
          createdBy: {
            name: poll.creator?.email?.split('@')[0] || 'Anonymous',
            avatar: poll.creator?.user_metadata?.avatar_url || '/student-avatar.png'
          },
          campusId: poll.campus_id,
          departmentId: poll.department_id,
          batch: poll.batch,
          tags: [],
          category: 'general',
          isAnonymous: false
        }))

        setPolls(transformedPolls)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch polls')
      } finally {
        setLoading(false)
      }
    }

    fetchPolls()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('community-polls-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_polls',
        },
        (payload: { new: any }) => {
          const newPoll = payload.new
          // Transform new poll to match frontend interface
          const transformedPoll = {
            id: newPoll.id.toString(),
            question: newPoll.title,
            description: newPoll.description,
            options: newPoll.options.map((option: string, index: number) => ({
              id: index.toString(),
              text: option,
              votes: newPoll.votes?.[index] || 0
            })),
            totalVotes: newPoll.votes?.reduce((sum: number, count: number) => sum + count, 0) || 0,
            userHasVoted: false,
            createdAt: new Date(newPoll.created_at).toLocaleString(),
            expiresAt: newPoll.expires_at ? new Date(newPoll.expires_at).toLocaleString() : undefined,
            createdBy: {
              name: newPoll.creator?.email?.split('@')[0] || 'Anonymous',
              avatar: newPoll.creator?.user_metadata?.avatar_url || '/student-avatar.png'
            },
            campusId: newPoll.campus_id,
            departmentId: newPoll.department_id,
            batch: newPoll.batch,
            tags: [],
            category: 'general',
            isAnonymous: false
          }

          // Apply filters to new poll
          let shouldInclude = true
          if (campusId && newPoll.campus_id !== campusId) {
            shouldInclude = false
          }
          if (departmentId && newPoll.department_id !== departmentId) {
            shouldInclude = false
          }

          if (shouldInclude) {
            setPolls((prevPolls) => [transformedPoll, ...prevPolls])
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'community_polls',
        },
        (payload: { new: any }) => {
          const updatedPoll = payload.new
          // Transform updated poll to match frontend interface
          const transformedPoll = {
            id: updatedPoll.id.toString(),
            question: updatedPoll.title,
            description: updatedPoll.description,
            options: updatedPoll.options.map((option: string, index: number) => ({
              id: index.toString(),
              text: option,
              votes: updatedPoll.votes?.[index] || 0
            })),
            totalVotes: updatedPoll.votes?.reduce((sum: number, count: number) => sum + count, 0) || 0,
            userHasVoted: false,
            createdAt: new Date(updatedPoll.created_at).toLocaleString(),
            expiresAt: updatedPoll.expires_at ? new Date(updatedPoll.expires_at).toLocaleString() : undefined,
            createdBy: {
              name: updatedPoll.creator?.email?.split('@')[0] || 'Anonymous',
              avatar: updatedPoll.creator?.user_metadata?.avatar_url || '/student-avatar.png'
            },
            campusId: updatedPoll.campus_id,
            departmentId: updatedPoll.department_id,
            batch: updatedPoll.batch,
            tags: [],
            category: 'general',
            isAnonymous: false
          }

          setPolls((prevPolls) =>
            prevPolls.map((poll) =>
              poll.id === transformedPoll.id ? transformedPoll : poll
            )
          )
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'community_polls',
        },
        (payload: { old: any }) => {
          const deletedPollId = payload.old.id.toString()
          setPolls((prevPolls) =>
            prevPolls.filter((poll) => poll.id !== deletedPollId)
          )
        }
      )
      .subscribe()

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel)
    }
  }, [campusId, departmentId])

  return { polls, loading, error }
}