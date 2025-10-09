# =====================================================
# QUICK FIX: Apply RLS Policy via Supabase Dashboard
# =====================================================

Write-Host "🔧 Opening Supabase SQL Editor..." -ForegroundColor Cyan
Write-Host ""

# SQL to copy
$sql = @"
-- Fix Admin Access - Apply this in Supabase SQL Editor

-- Drop the existing policy
DROP POLICY IF EXISTS "authenticated_read_admin_users" ON public.admin_users;

-- Create two new policies:

-- 1. Users can check their own admin status
CREATE POLICY "users_read_own_admin"
ON public.admin_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 2. Admins can view all admin users (for admin panel)
CREATE POLICY "admins_read_all"
ON public.admin_users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  )
);

SELECT 'Admin access policies updated!' AS status;
"@

# Copy to clipboard
Set-Clipboard -Value $sql

Write-Host "✅ SQL copied to clipboard!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 INSTRUCTIONS:" -ForegroundColor Yellow
Write-Host "1. Supabase Dashboard will open in your browser"
Write-Host "2. Go to: SQL Editor (left sidebar)"
Write-Host "3. Click 'New Query'"
Write-Host "4. Paste the SQL (Ctrl+V - already in clipboard!)"
Write-Host "5. Click 'Run' or press Ctrl+Enter"
Write-Host "6. You'll see 'Success' message"
Write-Host ""

# Open Supabase dashboard
$url = "https://supabase.com/dashboard/project/ctixprrqbnfivhepifsa/sql/new"
Start-Process $url

Write-Host "🌐 Browser opening..." -ForegroundColor Cyan
Write-Host ""
Write-Host "After running the SQL:" -ForegroundColor Green
Write-Host "1. Go back to http://localhost:3000/admin/auth"
Write-Host "2. Refresh the page"
Write-Host "3. Click 'Continue as Admin'"
Write-Host "4. ✅ Access granted!"
Write-Host ""
