/**
 * Audit Logging System
 * 
 * Tracks important user and admin actions for:
 * - Security monitoring
 * - Compliance (GDPR, etc.)
 * - Debugging
 * - User activity tracking
 */

import { createClient } from '@supabase/supabase-js'

export enum AuditAction {
  // Authentication
  USER_LOGIN = 'user.login',
  USER_LOGOUT = 'user.logout',
  USER_REGISTER = 'user.register',
  PASSWORD_RESET = 'password.reset',
  PASSWORD_CHANGE = 'password.change',
  
  // Admin actions
  ADMIN_LOGIN = 'admin.login',
  ADMIN_GRANT = 'admin.grant',
  ADMIN_REVOKE = 'admin.revoke',
  
  // Content moderation
  CONTENT_APPROVE = 'content.approve',
  CONTENT_REJECT = 'content.reject',
  CONTENT_DELETE = 'content.delete',
  
  // User management
  USER_BAN = 'user.ban',
  USER_UNBAN = 'user.unban',
  USER_DELETE = 'user.delete',
  
  // Data access
  SENSITIVE_DATA_ACCESS = 'data.access.sensitive',
  BULK_EXPORT = 'data.export.bulk',
  
  // Configuration changes
  SETTINGS_UPDATE = 'settings.update',
  PERMISSIONS_CHANGE = 'permissions.change',
}

export interface AuditLog {
  id?: string
  action: AuditAction
  user_id?: string
  user_email?: string
  ip_address?: string
  user_agent?: string
  resource_type?: string
  resource_id?: string
  details?: Record<string, any>
  status: 'success' | 'failure'
  error_message?: string
  timestamp?: string
}

/**
 * Log an audit event
 */
export async function logAudit(log: AuditLog): Promise<void> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceKey) {
      console.warn('[AUDIT] Supabase not configured, audit log not saved:', log)
      return
    }

    const supabase = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Store in database (requires audit_logs table)
    await supabase.from('audit_logs').insert({
      action: log.action,
      user_id: log.user_id,
      user_email: log.user_email,
      ip_address: log.ip_address,
      user_agent: log.user_agent,
      resource_type: log.resource_type,
      resource_id: log.resource_id,
      details: log.details || {},
      status: log.status,
      error_message: log.error_message,
      created_at: new Date().toISOString(),
    })

    // In production, also send critical events to monitoring service
    if (process.env.NODE_ENV === 'production' && isCriticalAction(log.action)) {
      // Send alert for critical actions
      console.warn('[AUDIT:CRITICAL]', {
        action: log.action,
        user: log.user_email || log.user_id,
        resource: `${log.resource_type}:${log.resource_id}`,
        status: log.status,
      })
    }
  } catch (error) {
    // Never fail the main operation due to audit logging failure
    console.error('[AUDIT:ERROR] Failed to log audit event:', error)
  }
}

function isCriticalAction(action: AuditAction): boolean {
  const criticalActions = [
    AuditAction.ADMIN_GRANT,
    AuditAction.ADMIN_REVOKE,
    AuditAction.USER_BAN,
    AuditAction.USER_DELETE,
    AuditAction.CONTENT_DELETE,
    AuditAction.SETTINGS_UPDATE,
    AuditAction.PERMISSIONS_CHANGE,
    AuditAction.BULK_EXPORT,
  ]
  return criticalActions.includes(action)
}

/**
 * Create audit_logs table migration
 * 
 * Run this SQL in Supabase:
 * 
 * CREATE TABLE IF NOT EXISTS audit_logs (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   action TEXT NOT NULL,
 *   user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
 *   user_email TEXT,
 *   ip_address TEXT,
 *   user_agent TEXT,
 *   resource_type TEXT,
 *   resource_id TEXT,
 *   details JSONB DEFAULT '{}',
 *   status TEXT CHECK (status IN ('success', 'failure')),
 *   error_message TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
 * );
 * 
 * CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
 * CREATE INDEX idx_audit_logs_action ON audit_logs(action);
 * CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
 * CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
 * 
 * -- RLS Policies (admins can read all, users can read their own)
 * ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
 * 
 * CREATE POLICY "Admins can view all audit logs"
 *   ON audit_logs FOR SELECT
 *   USING (
 *     EXISTS (
 *       SELECT 1 FROM admin_users
 *       WHERE admin_users.user_id = auth.uid()
 *     )
 *   );
 * 
 * CREATE POLICY "Users can view their own audit logs"
 *   ON audit_logs FOR SELECT
 *   USING (user_id = auth.uid());
 */
