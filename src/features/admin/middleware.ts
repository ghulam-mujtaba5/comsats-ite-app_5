/**
 * Admin Authentication & Authorization Middleware
 * Provides consistent admin access control across all admin routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@infrastructure/database/supabase-admin'
import { logAudit, AuditAction } from '@lib/audit'
import { getClientIP } from '@lib/rate-limit'
import { createError } from '@lib/error-handler'
import { authenticateRequest } from '@lib/api-middleware'

export interface AdminContext {
  userId: string
  email?: string
  role: 'admin' | 'super_admin' | 'moderator'
  permissions: string[]
  isDevAdmin?: boolean
}

export interface AdminAuthResult {
  success: boolean
  context?: AdminContext
  error?: string
}

/**
 * Comprehensive admin authentication middleware
 * Use this as the primary method to protect admin routes
 */
export async function authenticateAdmin(
  request: NextRequest
): Promise<AdminContext> {
  // Check for development admin bypass (only in non-production)
  if (process.env.NODE_ENV !== 'production') {
    const devCookie = request.cookies.get('dev_admin')?.value
    const iteCookie = request.cookies.get('ite_admin')?.value
    
    if (devCookie === '1' || iteCookie === '1') {
      console.warn('[SECURITY] Dev admin bypass used - only works in development!')
      return {
        userId: 'dev-admin',
        email: 'dev@admin.local',
        role: 'super_admin',
        permissions: ['*'],
        isDevAdmin: true,
      }
    }
  }

  // Authenticate the user first
  const { user } = await authenticateRequest(request)

  try {
    // Use service role client to check admin status (bypasses RLS)
    const { data: adminUser, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, role, permissions')
      .eq('user_id', user.id)
      .single()

    if (error || !adminUser) {
      // Log failed admin access attempt
      await logAudit({
        action: AuditAction.ADMIN_LOGIN,
        user_id: user.id,
        user_email: user.email,
        ip_address: getClientIP(request),
        status: 'failure',
        error_message: 'User is not an admin',
      })

      throw createError('Admin access required', 'FORBIDDEN', 403)
    }

    // Log successful admin access
    await logAudit({
      action: AuditAction.ADMIN_LOGIN,
      user_id: user.id,
      user_email: user.email,
      ip_address: getClientIP(request),
      status: 'success',
      details: { role: adminUser.role },
    })

    return {
      userId: user.id,
      email: user.email,
      role: adminUser.role as any,
      permissions: adminUser.permissions || [],
      isDevAdmin: false,
    }
  } catch (error) {
    throw error
  }
}

/**
 * Check if admin has a specific permission
 */
export function hasPermission(
  admin: AdminContext,
  permission: string
): boolean {
  // Super admins and wildcard permissions have all access
  if (admin.role === 'super_admin' || admin.permissions.includes('*')) {
    return true
  }

  return admin.permissions.includes(permission)
}

/**
 * Require specific admin role
 */
export function requireRole(
  admin: AdminContext,
  allowedRoles: Array<'admin' | 'super_admin' | 'moderator'>
): void {
  if (!allowedRoles.includes(admin.role)) {
    throw createError(
      `This action requires one of the following roles: ${allowedRoles.join(', ')}`,
      'INSUFFICIENT_ROLE',
      403
    )
  }
}

/**
 * Require specific permission
 */
export function requirePermission(
  admin: AdminContext,
  permission: string
): void {
  if (!hasPermission(admin, permission)) {
    throw createError(
      `This action requires the '${permission}' permission`,
      'INSUFFICIENT_PERMISSIONS',
      403
    )
  }
}

/**
 * Middleware wrapper for admin-only routes
 * Automatically handles authentication and returns typed admin context
 */
export function withAdminAuth<T = any>(
  handler: (
    request: NextRequest,
    admin: AdminContext,
    ...args: any[]
  ) => Promise<NextResponse<T>>
) {
  return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    try {
      const admin = await authenticateAdmin(request)
      return await handler(request, admin, ...args)
    } catch (error: any) {
      // Error handling is done by the outer error handler
      throw error
    }
  }
}

/**
 * Middleware wrapper for super admin only routes
 */
export function withSuperAdminAuth<T = any>(
  handler: (
    request: NextRequest,
    admin: AdminContext,
    ...args: any[]
  ) => Promise<NextResponse<T>>
) {
  return withAdminAuth(async (request, admin, ...args) => {
    requireRole(admin, ['super_admin'])
    return handler(request, admin, ...args)
  })
}

/**
 * Middleware wrapper for routes requiring specific permissions
 */
export function withAdminPermission<T = any>(
  permission: string,
  handler: (
    request: NextRequest,
    admin: AdminContext,
    ...args: any[]
  ) => Promise<NextResponse<T>>
) {
  return withAdminAuth(async (request, admin, ...args) => {
    requirePermission(admin, permission)
    return handler(request, admin, ...args)
  })
}

/**
 * Get admin user details (without throwing errors)
 * Returns null if user is not an admin
 */
export async function getAdminContext(
  userId: string
): Promise<AdminContext | null> {
  try {
    const { data: adminUser, error } = await supabaseAdmin
      .from('admin_users')
      .select('role, permissions')
      .eq('user_id', userId)
      .single()

    if (error || !adminUser) {
      return null
    }

    return {
      userId,
      role: adminUser.role as any,
      permissions: adminUser.permissions || [],
      isDevAdmin: false,
    }
  } catch (error) {
    return null
  }
}

/**
 * Bulk check if multiple users are admins
 */
export async function checkBatchAdminStatus(
  userIds: string[]
): Promise<Map<string, boolean>> {
  const result = new Map<string, boolean>()

  try {
    const { data: adminUsers } = await supabaseAdmin
      .from('admin_users')
      .select('user_id')
      .in('user_id', userIds)

    if (adminUsers) {
      adminUsers.forEach((admin: any) => {
        result.set(admin.user_id, true)
      })
    }

    // Set false for users not found
    userIds.forEach((id) => {
      if (!result.has(id)) {
        result.set(id, false)
      }
    })
  } catch (error) {
    // On error, assume all are not admins
    userIds.forEach((id) => result.set(id, false))
  }

  return result
}
