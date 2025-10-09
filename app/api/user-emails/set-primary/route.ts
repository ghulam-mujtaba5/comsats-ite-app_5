import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

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
    })
    
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
    }
    
    const { email } = parsed.data

    // Check if this email belongs to the user
    if (email === user.email) {
      // Already the primary email
      return NextResponse.json({ message: 'This is already your primary email' })
    }

    // Check if this email exists in user_emails table for this user
    const { data: userEmail, error: emailError } = await supabase
      .from('user_emails')
      .select('id, email, is_verified')
      .eq('user_id', user.id)
      .eq('email', email)
      .maybeSingle()

    if (emailError) {
      return NextResponse.json({ error: emailError.message }, { status: 400 })
    }

    if (!userEmail) {
      return NextResponse.json({ error: 'Email not found in your account' }, { status: 400 })
    }

    if (!userEmail.is_verified) {
      return NextResponse.json({ error: 'Email must be verified before setting as primary' }, { status: 400 })
    }

    // Update the user's primary email
    const { error: updateError } = await supabase.auth.updateUser({
      email: email
    })

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    // Remove the email from user_emails since it's now primary
    const { error: deleteError } = await supabase
      .from('user_emails')
      .delete()
      .eq('id', userEmail.id)

    if (deleteError) {
      console.warn('Failed to remove email from user_emails after setting as primary:', deleteError)
      // Don't return error here as the primary email update was successful
    }

    return NextResponse.json({ 
      message: 'Primary email updated successfully. You may need to verify this email address.',
      requires_verification: true
    })
  } catch (error) {
    console.error('Error setting primary email:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}