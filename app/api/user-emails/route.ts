import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmailVerification } from '@/lib/resend-email'

// GET - Verify email address
export async function GET(request: NextRequest) {
  // Check if this is a verification request
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // If verification parameters are present, handle verification
  if (token && email) {
    return handleEmailVerification(token, email);
  }

  // Otherwise, handle regular GET request for user emails
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60', // Cache for 2 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
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

    // Handle case where table doesn't exist yet (migration not applied)
    if (error) {
      console.error('Error fetching user emails:', error)
      
      // If table doesn't exist, just return primary email
      if (error.message.includes('relation "public.user_emails" does not exist') || 
          error.message.includes('Could not find the table')) {
        const userEmails = [
          {
            id: 'primary',
            user_id: user.id,
            email: user.email,
            email_type: 'primary',
            is_verified: true,
            created_at: user.created_at,
            updated_at: user.updated_at || user.created_at,
          }
        ]
        return NextResponse.json(userEmails, { headers })
      }
      
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
      ...(data || [])
    ]

    return NextResponse.json(userEmails, { headers })
  } catch (error) {
    console.error('Error fetching user emails:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

// Handle email verification
async function handleEmailVerification(token: string, email: string) {
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
    // Find the email record with the matching token
    const { data, error } = await supabase
      .from('user_emails')
      .select('*')
      .eq('email', email)
      .eq('verification_token', token)
      .maybeSingle()

    if (error) {
      console.error('Error finding email for verification:', error)
      return new Response('Invalid verification request', { status: 400 })
    }

    if (!data) {
      return new Response('Invalid verification token or email', { status: 400 })
    }

    // Update the email record to mark it as verified
    const { error: updateError } = await supabase
      .from('user_emails')
      .update({ 
        is_verified: true,
        verification_token: null
      })
      .eq('id', data.id)

    if (updateError) {
      console.error('Error updating email verification status:', updateError)
      return new Response('Failed to verify email', { status: 500 })
    }

    // Return a success page
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Email Verified</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 50px;
              background-color: #f0f9ff;
            }
            .container {
              max-width: 500px;
              margin: 0 auto;
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .success {
              color: #10b981;
              font-size: 48px;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success">✓</div>
            <h1>Email Verified Successfully!</h1>
            <p>Your email address <strong>${email}</strong> has been verified.</p>
            <p>You can now close this window and return to the application.</p>
          </div>
        </body>
      </html>
    `;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Error during email verification:', error)
    return new Response('Internal server error', { status: 500 })
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

    // Handle case where table doesn't exist
    if (existingError && (existingError.message.includes('relation "public.user_emails" does not exist') || 
        existingError.message.includes('Could not find the table'))) {
      return NextResponse.json({ 
        error: 'Email management feature is not available yet. Please contact administrator to enable this feature.' 
      }, { status: 503 })
    }

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

    // Generate verification token
    const verificationToken = crypto.randomUUID();

    // Insert new email
    const { data, error } = await supabase
      .from('user_emails')
      .insert({
        user_id: user.id,
        email,
        email_type,
        is_verified: false, // Will need verification
        verification_token: verificationToken,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Send verification email
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site';
      const verificationUrl = `${siteUrl}/api/user-emails/verify?token=${verificationToken}&email=${encodeURIComponent(email)}`;
      
      // Send verification email using Resend
      const emailResult = await sendEmailVerification(
        email,
        user.user_metadata?.full_name || 'User',
        verificationUrl
      );
      
      if (!emailResult.success) {
        console.error('Failed to send verification email:', emailResult.error);
        // Don't fail the request if email sending fails, just log it
      }
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the request if email sending fails, just log it
    }
    
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