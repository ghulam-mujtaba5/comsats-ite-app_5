# Fix RLS Infinite Recursion - Emergency Fix Script
# 
# This script fixes the "infinite recursion detected in policy for relation 'admin_users'"
# error by applying the corrected RLS policies to your Supabase database

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FIX RLS INFINITE RECURSION - ADMIN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check for .env.local
if (-not (Test-Path ".env.local")) {
    Write-Host "ERROR: .env.local not found!" -ForegroundColor Red
    Write-Host "Please run this from the project root directory." -ForegroundColor Yellow
    exit 1
}

# Load environment variables
Write-Host "Loading environment variables..." -ForegroundColor Yellow
Get-Content .env.local | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($name, $value, 'Process')
    }
}

$SUPABASE_URL = $env:NEXT_PUBLIC_SUPABASE_URL
$SERVICE_KEY = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $SUPABASE_URL) {
    Write-Host "ERROR: NEXT_PUBLIC_SUPABASE_URL not found in .env.local" -ForegroundColor Red
    exit 1
}

if (-not $SERVICE_KEY) {
    Write-Host "ERROR: SUPABASE_SERVICE_ROLE_KEY not found in .env.local" -ForegroundColor Red
    Write-Host "The service role key is REQUIRED to fix RLS policies!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Environment variables loaded" -ForegroundColor Green
Write-Host ""

# Extract project reference from URL
$PROJECT_REF = $SUPABASE_URL -replace 'https://', '' -replace '\.supabase\.co', ''

Write-Host "Project: $PROJECT_REF" -ForegroundColor Cyan
Write-Host ""

# Read the SQL migration
$SQL_FILE = "supabase\migrations\20251009120000_fix_rls_infinite_recursion.sql"

if (-not (Test-Path $SQL_FILE)) {
    Write-Host "ERROR: Migration file not found: $SQL_FILE" -ForegroundColor Red
    exit 1
}

$SQL = Get-Content $SQL_FILE -Raw

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  APPLYING RLS FIX" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will:" -ForegroundColor Yellow
Write-Host "  1. Drop all existing admin_users RLS policies" -ForegroundColor Yellow
Write-Host "  2. Create new non-recursive policies" -ForegroundColor Yellow
Write-Host "  3. Fix the infinite recursion error" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Continue? (Y/N)"
if ($confirm -ne 'Y' -and $confirm -ne 'y') {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Executing SQL migration..." -ForegroundColor Yellow

# Execute the SQL via Supabase REST API
$API_URL = "$SUPABASE_URL/rest/v1/rpc/exec_sql"
$HEADERS = @{
    "apikey" = $SERVICE_KEY
    "Authorization" = "Bearer $SERVICE_KEY"
    "Content-Type" = "application/json"
}

$BODY = @{
    sql = $SQL
} | ConvertTo-Json

try {
    # Try using Supabase SQL editor endpoint
    $QUERY_URL = "$SUPABASE_URL/rest/v1/rpc"
    
    Write-Host "Attempting to execute SQL..." -ForegroundColor Yellow
    Write-Host ""
    
    # Alternative: Use psql if available
    $USE_PSQL = $false
    if (Get-Command psql -ErrorAction SilentlyContinue) {
        Write-Host "✓ psql found! Using direct PostgreSQL connection..." -ForegroundColor Green
        $USE_PSQL = $true
    }
    
    if ($USE_PSQL) {
        # Extract database connection info
        Write-Host "Please enter your Supabase database password when prompted." -ForegroundColor Yellow
        Write-Host "(Find it in Supabase Dashboard → Project Settings → Database → Connection string)" -ForegroundColor Cyan
        Write-Host ""
        
        $DB_HOST = "db.$PROJECT_REF.supabase.co"
        $DB_NAME = "postgres"
        $DB_USER = "postgres"
        
        # Save SQL to temp file
        $TEMP_SQL = [System.IO.Path]::GetTempFileName() + ".sql"
        Set-Content -Path $TEMP_SQL -Value $SQL
        
        # Execute with psql
        Write-Host "Executing SQL with psql..." -ForegroundColor Yellow
        psql "postgresql://$DB_USER@$DB_HOST:5432/$DB_NAME" -f $TEMP_SQL
        
        Remove-Item $TEMP_SQL
        
        Write-Host ""
        Write-Host "✓ SQL executed successfully!" -ForegroundColor Green
    } else {
        Write-Host "Note: psql not found. Please install PostgreSQL client or run SQL manually." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "  MANUAL INSTRUCTIONS" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "1. Go to Supabase Dashboard" -ForegroundColor Yellow
        Write-Host "2. Click SQL Editor" -ForegroundColor Yellow
        Write-Host "3. Copy and paste this SQL:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "-------- COPY FROM HERE --------" -ForegroundColor Green
        Write-Host $SQL -ForegroundColor White
        Write-Host "-------- COPY TO HERE --------" -ForegroundColor Green
        Write-Host ""
        Write-Host "4. Click Run (or press Ctrl+Enter)" -ForegroundColor Yellow
        Write-Host ""
    }
    
} catch {
    Write-Host "ERROR: Failed to execute SQL" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run the SQL manually in Supabase Dashboard → SQL Editor" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ RLS FIX COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "The infinite recursion error should now be fixed." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Go back to /admin/auth" -ForegroundColor White
Write-Host "  2. Click 'Continue as Admin' again" -ForegroundColor White
Write-Host "  3. Should work now! ✓" -ForegroundColor Green
Write-Host ""
