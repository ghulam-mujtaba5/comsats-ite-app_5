# Test Supabase Database - Admin Users
# This script queries the production database to check admin_users and RLS policies

$SUPABASE_URL = $env:NEXT_PUBLIC_SUPABASE_URL
$SERVICE_KEY = $env:SUPABASE_SERVICE_ROLE_KEY
$ANON_KEY = $env:NEXT_PUBLIC_SUPABASE_ANON_KEY

Write-Host "🔍 Testing Supabase Database Connection..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Check admin_users table with SERVICE ROLE key
Write-Host "TEST 1: Query admin_users with SERVICE ROLE KEY" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow

if ($SERVICE_KEY) {
    $headers = @{
        "apikey" = $SERVICE_KEY
        "Authorization" = "Bearer $SERVICE_KEY"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/admin_users?select=*" -Headers $headers -Method Get
        Write-Host "✅ SUCCESS - Found $($response.Count) admin users:" -ForegroundColor Green
        $response | Format-Table -AutoSize
    } catch {
        Write-Host "❌ FAILED:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  SKIPPED - SUPABASE_SERVICE_ROLE_KEY not found" -ForegroundColor Yellow
}

Write-Host ""

# Test 2: Check admin_users table with ANON KEY (should fail if RLS enabled)
Write-Host "TEST 2: Query admin_users with ANON KEY (RLS Test)" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow

if ($ANON_KEY) {
    $headers = @{
        "apikey" = $ANON_KEY
        "Authorization" = "Bearer $ANON_KEY"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/admin_users?select=*" -Headers $headers -Method Get
        Write-Host "✅ SUCCESS - RLS allows read (or disabled):" -ForegroundColor Green
        Write-Host "Found $($response.Count) admin users" -ForegroundColor Green
    } catch {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "❌ BLOCKED by RLS:" -ForegroundColor Yellow
        Write-Host "Code: $($errorDetails.code)" -ForegroundColor Yellow
        Write-Host "Message: $($errorDetails.message)" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "💡 This is EXPECTED if RLS is enabled" -ForegroundColor Cyan
    }
} else {
    Write-Host "⚠️  SKIPPED - NEXT_PUBLIC_SUPABASE_ANON_KEY not found" -ForegroundColor Yellow
}

Write-Host ""

# Test 3: Check RLS status on admin_users
Write-Host "TEST 3: Check RLS Policies via SQL" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow

if ($SERVICE_KEY) {
    $headers = @{
        "apikey" = $SERVICE_KEY
        "Authorization" = "Bearer $SERVICE_KEY"
        "Content-Type" = "application/json"
        "Prefer" = "return=representation"
    }
    
    $sqlQuery = @"
SELECT 
    tablename,
    rowsecurity as rls_enabled,
    (SELECT count(*) FROM pg_policies WHERE schemaname = 'public' AND tablename = 'admin_users') as policy_count
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'admin_users'
"@
    
    try {
        $body = @{
            query = $sqlQuery
        } | ConvertTo-Json
        
        # Use RPC to execute raw SQL
        Write-Host "Checking RLS status..." -ForegroundColor Cyan
        
        # Alternative: Check using pg_catalog
        $checkRLS = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/rpc/check_rls" -Headers $headers -Method Post -Body '{}' -ErrorAction SilentlyContinue
        
    } catch {
        Write-Host "⚠️  Could not check RLS status directly" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎯 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. If SERVICE KEY works but ANON KEY fails → RLS is enabled and blocking" -ForegroundColor White
Write-Host "2. If both work → RLS is disabled (migrations applied successfully)" -ForegroundColor White
Write-Host "3. Check production at: https://campusaxis.site/api/admin/db/diagnostic" -ForegroundColor White
Write-Host ""
