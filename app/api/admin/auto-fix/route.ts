import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

/**
 * Auto-fix endpoint to grant admin access
 * This endpoint attempts to automatically add the current user to admin_users table
 * SECURITY: Only works in development mode
 */
export async function POST(req: NextRequest) {
  const isDev = process.env.NODE_ENV !== 'production'
  
  // SECURITY: Only allow in development
  if (!isDev) {
    return NextResponse.json({ 
      error: 'Not available in production',
      details: 'Auto-fix is only available in development mode for security reasons'
    }, { status: 403 })
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
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Not authenticated',
        details: 'You must be signed in to use auto-fix',
        fix: 'Sign in first, then try again'
      }, { status: 401 })
    }

    console.log(`[Auto-Fix] Attempting to grant admin access to ${user.email} (${user.id})`)

    // Check if already admin
    const { data: existingAdmin } = await supabaseAdmin
      .from('admin_users')
      .select('id, role')
      .eq('user_id', user.id)
      .single()

    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Already an admin',
        details: `User ${user.email} already has admin role: ${existingAdmin.role}`,
        role: existingAdmin.role
      })
    }

    // Add user to admin_users table
    const { data: newAdmin, error: insertError } = await supabaseAdmin
      .from('admin_users')
      .insert({
        user_id: user.id,
        role: 'super_admin',
        permissions: ['all']
      })
      .select()
      .single()

    if (insertError) {
      console.error('[Auto-Fix] Failed to insert admin user:', insertError)
      return NextResponse.json({ 
        error: 'Failed to grant admin access',
        details: insertError.message,
        code: insertError.code,
        hint: insertError.hint
      }, { status: 500 })
    }

    console.log(`[Auto-Fix] ✅ Successfully granted admin access to ${user.email}`)

    return NextResponse.json({
      success: true,
      message: 'Admin access granted!',
      details: `User ${user.email} has been added to admin_users table`,
      role: 'super_admin',
      userId: user.id,
      userEmail: user.email
    })

  } catch (e: any) {
    console.error('[Auto-Fix] Unexpected error:', e)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: e.message,
      stack: process.env.NODE_ENV === 'development' ? e.stack : undefined
    }, { status: 500 })
  }
}
