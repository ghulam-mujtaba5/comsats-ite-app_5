import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Agree/Disagree with a review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reviewId, userId, action } = body // action: 'agree' or 'disagree'

    if (!reviewId || !userId || !action) {
      return NextResponse.json({ 
        error: 'Review ID, User ID, and action are required' 
      }, { status: 400 })
    }

    if (action !== 'agree' && action !== 'disagree') {
      return NextResponse.json({ 
        error: 'Action must be "agree" or "disagree"' 
      }, { status: 400 })
    }

    // Check if user already has an opinion on this review
    const { data: existingOpinion } = await supabase
      .from('review_opinions')
      .select('*')
      .eq('review_id', reviewId)
      .eq('user_id', userId)
      .single()

    if (existingOpinion) {
      // Update existing opinion
      if (existingOpinion.opinion === action) {
        // Remove opinion if clicking the same button (toggle off)
        await supabase
          .from('review_opinions')
          .delete()
          .eq('id', existingOpinion.id)

        return NextResponse.json({ 
          message: 'Opinion removed',
          action: 'removed',
          reviewId 
        })
      } else {
        // Change opinion
        await supabase
          .from('review_opinions')
          .update({ opinion: action })
          .eq('id', existingOpinion.id)

        return NextResponse.json({ 
          message: 'Opinion updated',
          action: 'updated',
          opinion: action,
          reviewId 
        })
      }
    } else {
      // Create new opinion
      const { data, error } = await supabase
        .from('review_opinions')
        .insert({
          review_id: reviewId,
          user_id: userId,
          opinion: action,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({ 
        message: 'Opinion added',
        action: 'created',
        opinion: action,
        reviewId,
        data 
      })
    }
  } catch (error) {
    console.error('Error managing review opinion:', error)
    return NextResponse.json({ 
      error: 'Failed to process opinion' 
    }, { status: 500 })
  }
}

// Get opinion stats for a review
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get('reviewId')
    const userId = searchParams.get('userId')

    if (!reviewId) {
      return NextResponse.json({ 
        error: 'Review ID is required' 
      }, { status: 400 })
    }

    // Get counts
    const { data: opinions, error } = await supabase
      .from('review_opinions')
      .select('opinion, user_id')
      .eq('review_id', reviewId)

    if (error) throw error

    const agreeCount = opinions?.filter(o => o.opinion === 'agree').length || 0
    const disagreeCount = opinions?.filter(o => o.opinion === 'disagree').length || 0
    
    let userOpinion = null
    if (userId) {
      const userOp = opinions?.find(o => o.user_id === userId)
      userOpinion = userOp?.opinion || null
    }

    return NextResponse.json({
      reviewId,
      agreeCount,
      disagreeCount,
      totalOpinions: agreeCount + disagreeCount,
      userOpinion
    })
  } catch (error) {
    console.error('Error fetching review opinions:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch opinions' 
    }, { status: 500 })
  }
}
