import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// GET - Fetch user's email addresses
export async function GET(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30', // Cache for 1 minute, stale for 30 sec (optimized for free tier)
    'CDN-Cache-Control': 'public, s-maxage=60',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=60'
  }

  const cookieStore = await (cookies() as any)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    const { data, error } = await supabase
      .from('user_emails')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400, headers })
    }

    // Also include the primary email from auth.users
    const userEmails = [
      {
        id: 'primary',
        user_id: user.id,
        email: user.email,
        email_type: 'primary',
        is_verified: true,
        created_at: user.created_at,
        updated_at: user.updated_at || user.created_at,
      },
      ...data
    ]

    return NextResponse.json(userEmails, { headers })
  } catch (error) {
    console.error('Error fetching user emails:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

// POST - Add a new email address
export async function POST(request: NextRequest) {
  const cookieStore = await (cookies() as any)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate input
    const schema = z.object({
      email: z.string().email(),
      email_type: z.enum(['secondary', 'personal']).optional().default('personal'),
    })
    
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
    }
    
    const { email, email_type } = parsed.data

    // Check if email already exists for this user
    const { data: existingEmails, error: existingError } = await supabase
      .from('user_emails')
      .select('id')
      .eq('user_id', user.id)
      .eq('email', email)
      .maybeSingle()

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 400 })
    }

    if (existingEmails) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    // Check if this is the primary email
    if (email === user.email) {
      return NextResponse.json({ error: 'This is already your primary email' }, { status: 400 })
    }

    // Insert new email
    const { data, error } = await supabase
      .from('user_emails')
      .insert({
        user_id: user.id,
        email,
        email_type,
        is_verified: false, // Will need verification
        verification_token: crypto.randomUUID(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // TODO: Send verification email (would require email service setup)
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error adding user email:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Remove an email address
export async function DELETE(request: NextRequest) {
  const cookieStore = await (cookies() as any)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const emailId = searchParams.get('id')

    if (!emailId) {
      return NextResponse.json({ error: 'Email ID is required' }, { status: 400 })
    }

    // Prevent deletion of primary email
    if (emailId === 'primary') {
      return NextResponse.json({ error: 'Cannot delete primary email' }, { status: 400 })
    }

    // Delete the email
    const { error } = await supabase
      .from('user_emails')
      .delete()
      .eq('id', emailId)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Email deleted successfully' })
  } catch (error) {
    console.error('Error deleting user email:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}