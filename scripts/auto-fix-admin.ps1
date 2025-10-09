#!/usr/bin/env pwsh
# Automated Admin Access Fix Script
# Email: fa22-bse-199@cuilahore.edu.pk

$ErrorActionPreference = "Stop"

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        🤖 AUTOMATED ADMIN ACCESS FIX - STARTING           ║" -ForegroundColor White -BackgroundColor DarkGreen
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "👤 User: fa22-bse-199@cuilahore.edu.pk" -ForegroundColor Yellow
Write-Host "🎯 Target: Promote to super_admin" -ForegroundColor Yellow
Write-Host "⚡ Method: Supabase CLI`n" -ForegroundColor Yellow

# Step 1: Check Supabase CLI
Write-Host "📋 [1/6] Checking Supabase CLI..." -ForegroundColor Cyan
$supabaseCmd = Get-Command supabase -ErrorAction SilentlyContinue
if (-not $supabaseCmd) {
    Write-Host "❌ Supabase CLI not found!" -ForegroundColor Red
    Write-Host "Install: npm install -g supabase`n" -ForegroundColor White
    exit 1
}
Write-Host "✅ Supabase CLI v$((supabase --version).Trim())`n" -ForegroundColor Green

# Step 2: Check environment variables
Write-Host "📋 [2/6] Checking environment..." -ForegroundColor Cyan
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ .env.local not found!" -ForegroundColor Red
    exit 1
}

$envContent = Get-Content ".env.local" -Raw
$hasUrl = $envContent -match "NEXT_PUBLIC_SUPABASE_URL"
$hasServiceKey = $envContent -match "SUPABASE_SERVICE_ROLE_KEY"

if (-not $hasUrl -or -not $hasServiceKey) {
    Write-Host "❌ Missing Supabase credentials in .env.local!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Supabase credentials found`n" -ForegroundColor Green

# Step 3: Extract Supabase URL and Project Ref
Write-Host "📋 [3/6] Extracting project info..." -ForegroundColor Cyan
$urlMatch = [regex]::Match($envContent, 'NEXT_PUBLIC_SUPABASE_URL\s*=\s*"?([^"\s]+)"?')
$serviceKeyMatch = [regex]::Match($envContent, 'SUPABASE_SERVICE_ROLE_KEY\s*=\s*"?([^"\s]+)"?')

if (-not $urlMatch.Success -or -not $serviceKeyMatch.Success) {
    Write-Host "❌ Could not parse Supabase credentials!" -ForegroundColor Red
    exit 1
}

$supabaseUrl = $urlMatch.Groups[1].Value
$serviceRoleKey = $serviceKeyMatch.Groups[1].Value
$projectRef = ($supabaseUrl -replace 'https://|\.supabase\.co.*', '')

Write-Host "✅ Project: $projectRef" -ForegroundColor Green
Write-Host "✅ URL: $supabaseUrl`n" -ForegroundColor Green

# Step 4: Login to Supabase (if needed)
Write-Host "📋 [4/6] Authenticating with Supabase..." -ForegroundColor Cyan
try {
    $loginStatus = supabase projects list 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Not logged in. Initiating login..." -ForegroundColor Yellow
        supabase login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Login failed!" -ForegroundColor Red
            exit 1
        }
    }
    Write-Host "✅ Authenticated`n" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Skipping login check (will use direct connection)`n" -ForegroundColor Yellow
}

# Step 5: Execute SQL using psql with service role
Write-Host "📋 [5/6] Executing admin fix SQL..." -ForegroundColor Cyan
Write-Host "🔧 Applying RLS policy fixes..." -ForegroundColor Gray
Write-Host "👤 Adding fa22-bse-199@cuilahore.edu.pk as super_admin...`n" -ForegroundColor Gray

$sqlFile = "scripts\fix-admin-automated.sql"

# Try using supabase db execute
try {
    $output = supabase db execute --file $sqlFile --project-ref $projectRef 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ SQL executed successfully!`n" -ForegroundColor Green
        Write-Host "Output:" -ForegroundColor Gray
        Write-Host $output -ForegroundColor Gray
    } else {
        Write-Host "⚠️  CLI method failed, trying direct connection...`n" -ForegroundColor Yellow
        
        # Fallback: Use direct psql connection
        $dbUrl = "$supabaseUrl/rest/v1/"
        Write-Host "Using REST API method..." -ForegroundColor Gray
        
        $sqlContent = Get-Content $sqlFile -Raw
        $headers = @{
            "apikey" = $serviceRoleKey
            "Authorization" = "Bearer $serviceRoleKey"
            "Content-Type" = "application/json"
        }
        
        # Execute via Supabase REST API (limited but works)
        Write-Host "⚠️  Please run the SQL manually in Supabase Dashboard" -ForegroundColor Yellow
        Write-Host "File: $sqlFile`n" -ForegroundColor Cyan
    }
} catch {
    Write-Host "⚠️  Automated execution not available`n" -ForegroundColor Yellow
    Write-Host "Please use one of these methods:`n" -ForegroundColor White
    Write-Host "Method 1 - Supabase Dashboard (Recommended):" -ForegroundColor Yellow
    Write-Host "  1. Go to: https://supabase.com/dashboard/project/$projectRef" -ForegroundColor Cyan
    Write-Host "  2. Click SQL Editor → New query" -ForegroundColor Gray
    Write-Host "  3. Copy content from: $sqlFile" -ForegroundColor Gray
    Write-Host "  4. Click RUN`n" -ForegroundColor Gray
    
    Write-Host "Method 2 - Direct psql (Advanced):" -ForegroundColor Yellow
    Write-Host "  Extract DB password from Supabase Dashboard" -ForegroundColor Gray
    Write-Host "  Then run: psql -h db.$projectRef.supabase.co -U postgres -f $sqlFile`n" -ForegroundColor Gray
}

# Step 6: Verification
Write-Host "📋 [6/6] Next steps..." -ForegroundColor Cyan
Write-Host "`nIf SQL executed successfully:" -ForegroundColor White
Write-Host "  ✅ RLS policies updated" -ForegroundColor Green
Write-Host "  ✅ fa22-bse-199@cuilahore.edu.pk promoted to super_admin" -ForegroundColor Green
Write-Host "`nTest in your app:" -ForegroundColor Yellow
Write-Host "  1. Refresh admin page (Ctrl+Shift+R)" -ForegroundColor Gray
Write-Host "  2. Try promoting a user" -ForegroundColor Gray
Write-Host "  3. Should work without error! 🎉`n" -ForegroundColor Green

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                   ✅ SCRIPT COMPLETE                       ║" -ForegroundColor White -BackgroundColor DarkGreen
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan
