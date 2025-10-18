/**
 * Template for Securing API Routes
 * 
 * Copy this template and adapt it for each API route that needs security updates.
 * This ensures consistent security implementation across the application.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { rateLimit, RateLimitPresets, getClientIP, getRateLimitHeaders } from '@/lib/rate-limit'
import { validateData } from '@/lib/validation'
import { Errors, formatErrorResponse, logError, CustomError } from '@/lib/errors'
import { logAudit, AuditAction } from '@/lib/audit'
import { z } from 'zod'

// ============================================================================
// STEP 1: Define your validation schema
// ============================================================================
const YourDataSchema = z.object({
  // Add your fields here
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  // ... more fields
})

// ============================================================================
// STEP 2: GET Handler (for fetching data)
// ============================================================================
export async function GET(req: NextRequest) {
  try {
    // Rate limiting (use appropriate preset)
    const rateLimitResult = await rateLimit(req, RateLimitPresets.read)
    if (!rateLimitResult.success) {
      const res = NextResponse.json(
        { error: 'Too many requests', retryAfter: rateLimitResult.retryAfter },
        { status: 429 }
      )
      Object.entries(getRateLimitHeaders(rateLimitResult)).forEach(([key, value]) => {
        res.headers.set(key, value)
      })
      return res
    }

    // Get query parameters (with validation)
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, Number(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') || '20')))
    const search = searchParams.get('q')?.trim().slice(0, 200) || undefined

    // Get Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !anonKey) {
      throw Errors.internalError('Service configuration error')
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(supabaseUrl, anonKey, {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    })

    // Fetch data with proper filtering
    let query = supabase
      .from('your_table')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (search) {
      query = query.ilike('title', `%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      logError(error, { endpoint: req.nextUrl.pathname, method: 'GET' })
      throw Errors.databaseError('fetch')
    }

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })

  } catch (error) {
    logError(error as Error, { endpoint: req.nextUrl.pathname, method: 'GET' })
    
    if (error instanceof CustomError) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }
    
    return NextResponse.json(formatErrorResponse(error as Error), { status: 500 })
  }
}

// ============================================================================
// STEP 3: POST Handler (for creating data)
// ============================================================================
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !anonKey) {
      throw Errors.internalError('Service configuration error')
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(supabaseUrl, anonKey, {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw Errors.authRequired()
    }

    // 2. Rate limiting (per user)
    const rateLimitResult = await rateLimit(req, {
      ...RateLimitPresets.write,
      keyGenerator: () => `write:user:${user.id}`,
    })

    if (!rateLimitResult.success) {
      const res = NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimitResult.retryAfter },
        { status: 429 }
      )
      Object.entries(getRateLimitHeaders(rateLimitResult)).forEach(([key, value]) => {
        res.headers.set(key, value)
      })
      return res
    }

    // 3. Parse and validate input
    const body = await req.json()
    
    // Check for honeypot (bot trap)
    if (body._hp || body.honeypot) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const validation = validateData(YourDataSchema, body)
    if (!validation.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validation.errors,
      }, { status: 400 })
    }

    const validatedData = validation.data

    // 4. Check for duplicates (if applicable)
    const { data: existing } = await supabase
      .from('your_table')
      .select('id')
      .eq('user_id', user.id)
      .eq('title', validatedData.title)
      .single()

    if (existing) {
      throw Errors.duplicateEntry('record with this title')
    }

    // 5. Insert into database
    const { data, error: dbError } = await supabase
      .from('your_table')
      .insert([{
        ...validatedData,
        user_id: user.id,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (dbError) {
      logError(dbError, { endpoint: req.nextUrl.pathname, method: 'POST', user_id: user.id })
      throw Errors.databaseError('insert')
    }

    // 6. Log audit trail
    await logAudit({
      action: AuditAction.CONTENT_APPROVE, // Change to appropriate action
      user_id: user.id,
      user_email: user.email,
      ip_address: getClientIP(req),
      resource_type: 'your_resource',
      resource_id: data.id,
      status: 'success',
      details: {
        title: validatedData.title,
      },
    })

    // 7. Return success
    const res = NextResponse.json({
      success: true,
      data,
    }, { status: 201 })

    Object.entries(getRateLimitHeaders(rateLimitResult)).forEach(([key, value]) => {
      res.headers.set(key, value)
    })

    return res

  } catch (error) {
    logError(error as Error, { endpoint: req.nextUrl.pathname, method: 'POST' })
    
    if (error instanceof CustomError) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }
    
    return NextResponse.json(formatErrorResponse(error as Error), { status: 500 })
  }
}

// ============================================================================
// STEP 4: PUT/PATCH Handler (for updating data)
// ============================================================================
export async function PATCH(req: NextRequest) {
  try {
    // Authenticate
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !anonKey) {
      throw Errors.internalError('Service configuration error')
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(supabaseUrl, anonKey, {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw Errors.authRequired()
    }

    // Rate limiting
    const rateLimitResult = await rateLimit(req, {
      ...RateLimitPresets.write,
      keyGenerator: () => `update:user:${user.id}`,
    })

    if (!rateLimitResult.success) {
      throw Errors.rateLimitExceeded(rateLimitResult.retryAfter)
    }

    // Get resource ID from URL
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Resource ID required' }, { status: 400 })
    }

    // Validate input
    const body = await req.json()
    const validation = validateData(YourDataSchema.partial(), body)
    
    if (!validation.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validation.errors,
      }, { status: 400 })
    }

    // Check ownership
    const { data: existing } = await supabase
      .from('your_table')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!existing) {
      throw Errors.notFound('Resource')
    }

    if (existing.user_id !== user.id) {
      throw Errors.forbidden('You can only update your own resources')
    }

    // Update
    const { data, error: dbError } = await supabase
      .from('your_table')
      .update(validation.data)
      .eq('id', id)
      .select()
      .single()

    if (dbError) {
      logError(dbError, { endpoint: req.nextUrl.pathname, method: 'PATCH' })
      throw Errors.databaseError('update')
    }

    // Audit log
    await logAudit({
      action: AuditAction.CONTENT_APPROVE,
      user_id: user.id,
      user_email: user.email,
      ip_address: getClientIP(req),
      resource_type: 'your_resource',
      resource_id: id,
      status: 'success',
    })

    return NextResponse.json({ success: true, data })

  } catch (error) {
    logError(error as Error, { endpoint: req.nextUrl.pathname, method: 'PATCH' })
    
    if (error instanceof CustomError) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }
    
    return NextResponse.json(formatErrorResponse(error as Error), { status: 500 })
  }
}

// ============================================================================
// STEP 5: DELETE Handler (for deleting data)
// ============================================================================
export async function DELETE(req: NextRequest) {
  try {
    // Authenticate
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !anonKey) {
      throw Errors.internalError('Service configuration error')
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(supabaseUrl, anonKey, {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw Errors.authRequired()
    }

    // Get resource ID
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Resource ID required' }, { status: 400 })
    }

    // Check ownership
    const { data: existing } = await supabase
      .from('your_table')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!existing) {
      throw Errors.notFound('Resource')
    }

    if (existing.user_id !== user.id) {
      throw Errors.forbidden('You can only delete your own resources')
    }

    // Delete
    const { error: dbError } = await supabase
      .from('your_table')
      .delete()
      .eq('id', id)

    if (dbError) {
      logError(dbError, { endpoint: req.nextUrl.pathname, method: 'DELETE' })
      throw Errors.databaseError('delete')
    }

    // Audit log
    await logAudit({
      action: AuditAction.CONTENT_DELETE,
      user_id: user.id,
      user_email: user.email,
      ip_address: getClientIP(req),
      resource_type: 'your_resource',
      resource_id: id,
      status: 'success',
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    logError(error as Error, { endpoint: req.nextUrl.pathname, method: 'DELETE' })
    
    if (error instanceof CustomError) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }
    
    return NextResponse.json(formatErrorResponse(error as Error), { status: 500 })
  }
}

// ============================================================================
// CHECKLIST: Security Items Covered
// ============================================================================
// ✅ Rate limiting (per IP or per user)
// ✅ Authentication required
// ✅ Input validation with Zod
// ✅ Error handling and logging
// ✅ Audit logging
// ✅ Ownership verification (for updates/deletes)
// ✅ Pagination for GET requests
// ✅ SQL injection prevention (via Supabase)
// ✅ Honeypot for bot detection
// ✅ Duplicate prevention
// ✅ Proper HTTP status codes
// ✅ Rate limit headers
// ✅ User-friendly error messages
