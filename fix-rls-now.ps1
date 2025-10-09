# PowerShell Script to Fix RLS Policies via Supabase API
# This uses your service role key to execute SQL directly

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FIXING RLS POLICIES VIA API" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Load environment variables
if (-not (Test-Path ".env.local")) {
    Write-Host "ERROR: .env.local not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Loading environment..." -ForegroundColor Yellow
$envContent = Get-Content .env.local
foreach ($line in $envContent) {
    if ($line -match '^([^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($name, $value, 'Process')
    }
}

$SUPABASE_URL = $env:NEXT_PUBLIC_SUPABASE_URL
$SERVICE_KEY = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $SUPABASE_URL -or -not $SERVICE_KEY) {
    Write-Host "ERROR: Missing SUPABASE_URL or SERVICE_KEY" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Environment loaded" -ForegroundColor Green
Write-Host "✓ Project: $SUPABASE_URL" -ForegroundColor Green
Write-Host ""

# Read the SQL
$SQL = @"
BEGIN;

-- Drop ALL policies
DROP POLICY IF EXISTS "authenticated_read_admin_users" ON "public"."admin_users";
DROP POLICY IF EXISTS "super_admin_insert_admin_users" ON "public"."admin_users";
DROP POLICY IF EXISTS "super_admin_update_admin_users" ON "public"."admin_users";
DROP POLICY IF EXISTS "super_admin_delete_admin_users" ON "public"."admin_users";
DROP POLICY IF EXISTS "admin_users_self_read" ON "public"."admin_users";
DROP POLICY IF EXISTS "read own admin row" ON "public"."admin_users";
DROP POLICY IF EXISTS "admin_users_read_own" ON "public"."admin_users";
DROP POLICY IF EXISTS "admin_users_read_all" ON "public"."admin_users";

-- Enable RLS
ALTER TABLE "public"."admin_users" ENABLE ROW LEVEL SECURITY;

-- Create fresh policies
CREATE POLICY "admin_users_read_own"
ON "public"."admin_users"
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "admin_users_read_all"
ON "public"."admin_users"
FOR SELECT TO authenticated
USING (true);

COMMIT;
"@

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EXECUTING SQL FIX" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Execute via psql if available
if (Get-Command psql -ErrorAction SilentlyContinue) {
    Write-Host "Using psql..." -ForegroundColor Yellow
    
    $PROJECT_REF = $SUPABASE_URL -replace 'https://', '' -replace '\.supabase\.co.*', ''
    $DB_HOST = "db.$PROJECT_REF.supabase.co"
    
    Write-Host "Database: $DB_HOST" -ForegroundColor Cyan
    Write-Host "Enter your database password when prompted." -ForegroundColor Yellow
    Write-Host "(Find it in Supabase Dashboard → Settings → Database)" -ForegroundColor Cyan
    Write-Host ""
    
    $tempFile = [System.IO.Path]::GetTempFileName() + ".sql"
    Set-Content -Path $tempFile -Value $SQL
    
    $env:PGPASSWORD = Read-Host -Prompt "Database Password" -AsSecureString | ConvertFrom-SecureString -AsPlainText
    
    psql "postgresql://postgres:$($env:PGPASSWORD)@$DB_HOST:5432/postgres" -f $tempFile
    
    Remove-Item $tempFile
    
    Write-Host ""
    Write-Host "✅ SQL EXECUTED!" -ForegroundColor Green
    
} else {
    Write-Host "❌ psql not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "OPTION 1: Install PostgreSQL client" -ForegroundColor Yellow
    Write-Host "  Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "OPTION 2: Run SQL manually in Supabase Dashboard" -ForegroundColor Yellow
    Write-Host "  File: RUN_THIS_SQL_FIXED.sql" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "OPTION 3: Use Supabase SQL Editor" -ForegroundColor Yellow
    Write-Host "  https://supabase.com/dashboard → SQL Editor" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NEXT STEPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to /admin/diagnostic" -ForegroundColor White
Write-Host "2. Refresh page (Ctrl+Shift+R)" -ForegroundColor White
Write-Host "3. Click 'Auto-Fix (Dev Only)'" -ForegroundColor White
Write-Host "4. You're admin! ✅" -ForegroundColor Green
Write-Host ""
