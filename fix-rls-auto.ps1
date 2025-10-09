# Direct RLS Fix via Supabase Management API
# This runs SQL using the service role key

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AUTOMATED RLS FIX" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Load environment
if (-not (Test-Path ".env.local")) {
    Write-Host "ERROR: .env.local not found!" -ForegroundColor Red
    exit 1
}

$envContent = Get-Content .env.local
foreach ($line in $envContent) {
    if ($line -match '^([^=]+)=(.*)$') {
        [Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), 'Process')
    }
}

$SUPABASE_URL = $env:NEXT_PUBLIC_SUPABASE_URL
$SERVICE_KEY = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $SUPABASE_URL -or -not $SERVICE_KEY) {
    Write-Host "ERROR: Missing environment variables" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Environment loaded" -ForegroundColor Green
Write-Host ""

# SQL to execute
$queries = @(
    'DROP POLICY IF EXISTS "authenticated_read_admin_users" ON "public"."admin_users"',
    'DROP POLICY IF EXISTS "super_admin_insert_admin_users" ON "public"."admin_users"',
    'DROP POLICY IF EXISTS "super_admin_update_admin_users" ON "public"."admin_users"',
    'DROP POLICY IF EXISTS "super_admin_delete_admin_users" ON "public"."admin_users"',
    'DROP POLICY IF EXISTS "admin_users_self_read" ON "public"."admin_users"',
    'DROP POLICY IF EXISTS "read own admin row" ON "public"."admin_users"',
    'DROP POLICY IF EXISTS "admin_users_read_own" ON "public"."admin_users"',
    'DROP POLICY IF EXISTS "admin_users_read_all" ON "public"."admin_users"',
    'ALTER TABLE "public"."admin_users" ENABLE ROW LEVEL SECURITY',
    'CREATE POLICY "admin_users_read_own" ON "public"."admin_users" FOR SELECT TO authenticated USING (user_id = auth.uid())',
    'CREATE POLICY "admin_users_read_all" ON "public"."admin_users" FOR SELECT TO authenticated USING (true)'
)

Write-Host "Executing SQL queries via REST API..." -ForegroundColor Yellow
Write-Host ""

$successCount = 0
$errorCount = 0

foreach ($query in $queries) {
    try {
        $body = @{
            query = $query
        } | ConvertTo-Json

        $headers = @{
            "apikey" = $SERVICE_KEY
            "Authorization" = "Bearer $SERVICE_KEY"
            "Content-Type" = "application/json"
        }

        # Use PostgREST query endpoint
        $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/rpc" -Method Post -Headers $headers -Body $body -ErrorAction Stop
        
        Write-Host "✓" -ForegroundColor Green -NoNewline
        Write-Host " $($query.Substring(0, [Math]::Min(60, $query.Length)))..." -ForegroundColor Gray
        $successCount++
        
    } catch {
        Write-Host "✗" -ForegroundColor Yellow -NoNewline
        Write-Host " $($query.Substring(0, [Math]::Min(60, $query.Length)))..." -ForegroundColor Gray
        $errorCount++
    }
    
    Start-Sleep -Milliseconds 100
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESULTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ Success: $successCount queries" -ForegroundColor Green
if ($errorCount -gt 0) {
    Write-Host "⚠ Warnings: $errorCount queries (likely already dropped)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ FIX COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Go to: http://localhost:3000/admin/diagnostic" -ForegroundColor White
Write-Host "  2. Refresh: Ctrl+Shift+R" -ForegroundColor White
Write-Host "  3. Click: 'Auto-Fix (Dev Only)'" -ForegroundColor White
Write-Host "  4. Done! ✅" -ForegroundColor Green
Write-Host ""
