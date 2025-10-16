import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60', // Cache for 2 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }

  const resolvedParams = await params
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            // Handle cookie setting errors
            console.error('Error setting cookie:', error)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.delete(name)
          } catch (error) {
            // Handle cookie removal errors
            console.error('Error removing cookie:', error)
          }
        },
      },
    }
  )

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    const pollId = resolvedParams.id
    const body = await request.json()
    const { optionId } = body

    if (!optionId) {
      return NextResponse.json({ error: 'Option ID is required' }, { status: 400, headers })
    }

    // Get the poll
    const { data: poll, error: pollError } = await supabase
      .from('community_polls')
      .select('options, votes, is_active, expires_at')
      .eq('id', pollId)
      .single()

    if (pollError || !poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404, headers })
    }

    // Check if poll is active
    if (!poll.is_active) {
      return NextResponse.json({ error: 'Poll is closed' }, { status: 400, headers })
    }

    // Check if poll has expired
    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Poll has expired' }, { status: 400, headers })
    }

    // Validate option ID
    const optionIndex = parseInt(optionId)
    if (isNaN(optionIndex) || optionIndex < 0 || optionIndex >= poll.options.length) {
      return NextResponse.json({ error: 'Invalid option ID' }, { status: 400, headers })
    }

    // Check if user has already voted
    const { data: existingVote } = await supabase
      .from('community_poll_votes')
      .select('id')
      .eq('poll_id', pollId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (existingVote) {
      return NextResponse.json({ error: 'You have already voted in this poll' }, { status: 400, headers })
    }

    // Record the vote
    const { error: voteError } = await supabase
      .from('community_poll_votes')
      .insert({
        poll_id: pollId,
        user_id: user.id,
        option_indices: [optionIndex]
      })

    if (voteError) {
      console.error('Error recording vote:', voteError)
      return NextResponse.json({ error: 'Failed to record vote' }, { status: 500, headers })
    }

    // Update poll vote counts
    const updatedVotes = [...poll.votes]
    updatedVotes[optionIndex] = (updatedVotes[optionIndex] || 0) + 1

    const { error: updateError } = await supabase
      .from('community_polls')
      .update({ votes: updatedVotes })
      .eq('id', pollId)

    if (updateError) {
      console.error('Error updating poll votes:', updateError)
      // Don't return error here as the vote was already recorded
    }

    // Get updated poll data
    const { data: updatedPoll } = await supabase
      .from('community_polls')
      .select(`
        *,
        creator:user_id (
          id,
          email
        )
      `)
      .eq('id', pollId)
      .single()

    if (!updatedPoll) {
      return NextResponse.json({ error: 'Failed to fetch updated poll' }, { status: 500, headers })
    }

    // Transform for frontend
    const transformedPoll = {
      id: updatedPoll.id,
      question: updatedPoll.title,
      description: updatedPoll.description,
      options: updatedPoll.options.map((option: string, index: number) => ({
        id: index.toString(),
        text: option,
        votes: updatedPoll.votes?.[index] || 0
      })),
      totalVotes: updatedPoll.votes?.reduce((sum: number, count: number) => sum + count, 0) || 0,
      userHasVoted: true,
      createdAt: updatedPoll.created_at,
      expiresAt: updatedPoll.expires_at,
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

    return NextResponse.json({ updatedPoll: transformedPoll }, { headers })
  } catch (error) {
    console.error('Error in POST /api/community/polls/[id]/vote:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}