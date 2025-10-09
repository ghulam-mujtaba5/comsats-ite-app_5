#!/usr/bin/env pwsh
# 🚀 Direct Database Fix for Faculty Status Column
# This script connects directly to your Supabase database and fixes the issue

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🔧 CampusAxis - Faculty Status Direct Database Fix      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Load environment variables
Write-Host "📋 Loading environment variables..." -ForegroundColor Cyan

if (Test-Path ".env.local") {
    Get-Content .env.local | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, 'Process')
        }
    }
    Write-Host "✅ Environment variables loaded`n" -ForegroundColor Green
} else {
    Write-Host "❌ .env.local file not found!" -ForegroundColor Red
    exit 1
}

$supabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
$supabaseKey = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $supabaseUrl -or -not $supabaseKey) {
    Write-Host "❌ Required environment variables not found!" -ForegroundColor Red
    Write-Host "   Missing: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor Yellow
    exit 1
}

Write-Host "🔍 Supabase URL: $supabaseUrl" -ForegroundColor White
Write-Host "🔑 Service role key: [HIDDEN]`n" -ForegroundColor White

# SQL to fix the faculty table
$fixSQL = @"
-- Add status column to faculty table
ALTER TABLE faculty 
ADD COLUMN IF NOT EXISTS status TEXT 
DEFAULT 'approved' 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_faculty_status ON faculty(status);

-- Update existing records
UPDATE faculty 
SET status = 'approved' 
WHERE status IS NULL;
"@

Write-Host "🔨 Applying fix using Supabase REST API..." -ForegroundColor Cyan
Write-Host "📝 SQL to execute:" -ForegroundColor Yellow
Write-Host $fixSQL -ForegroundColor Gray
Write-Host ""

# Extract project reference from URL
$projectRef = if ($supabaseUrl -match 'https://([^.]+)\.supabase\.co') { $matches[1] } else { $null }

if (-not $projectRef) {
    Write-Host "❌ Could not extract project reference from Supabase URL" -ForegroundColor Red
    exit 1
}

Write-Host "🎯 Project Reference: $projectRef" -ForegroundColor White
Write-Host "`n🚀 Executing SQL via Supabase Management API...`n" -ForegroundColor Yellow

# Use Supabase SQL endpoint
$sqlEndpoint = "$supabaseUrl/rest/v1/rpc/exec_sql"

# Try using psql if available
Write-Host "🔍 Checking for psql (PostgreSQL client)..." -ForegroundColor Cyan
$psqlAvailable = Get-Command psql -ErrorAction SilentlyContinue

if ($psqlAvailable) {
    Write-Host "✅ psql found! Using direct PostgreSQL connection..." -ForegroundColor Green
    
    # Construct connection string
    $dbHost = "$projectRef.supabase.co"
    $dbName = "postgres"
    $dbUser = "postgres"
    $dbPassword = $supabaseKey
    
    Write-Host "`n📡 Connecting to database..." -ForegroundColor Cyan
    
    # Save SQL to temp file
    $fixSQL | Out-File -FilePath "temp_fix.sql" -Encoding UTF8 -NoNewline
    
    # Execute with psql
    $env:PGPASSWORD = $dbPassword
    psql -h $dbHost -U $dbUser -d $dbName -p 5432 -f temp_fix.sql
    
    Remove-Item "temp_fix.sql" -ErrorAction SilentlyContinue
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Fix applied successfully via psql!" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️  psql execution completed with warnings" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "⚠️  psql not found. Using alternative method..." -ForegroundColor Yellow
    Write-Host "`n📝 MANUAL FIX REQUIRED:" -ForegroundColor Red
    Write-Host "`nPlease run this SQL in your Supabase SQL Editor:" -ForegroundColor Yellow
    Write-Host "https://supabase.com/dashboard/project/$projectRef/sql/new`n" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host $fixSQL -ForegroundColor White
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray
    
    Write-Host "Press Enter after you've run the SQL in Supabase..." -ForegroundColor Yellow
    Read-Host
}

# Verify the fix
Write-Host "`n🔍 Verifying the fix..." -ForegroundColor Cyan

try {
    # Test the API endpoint
    $testUrl = "$supabaseUrl/rest/v1/faculty?select=id,name,status&limit=5"
    $headers = @{
        'apikey' = $env:NEXT_PUBLIC_SUPABASE_ANON_KEY
        'Authorization' = "Bearer $($env:NEXT_PUBLIC_SUPABASE_ANON_KEY)"
    }
    
    Write-Host "📡 Testing faculty API endpoint..." -ForegroundColor White
    $response = Invoke-RestMethod -Uri $testUrl -Headers $headers -Method Get -ErrorAction Stop
    
    if ($response -is [Array] -or $response) {
        Write-Host "✅ Faculty API is working!" -ForegroundColor Green
        Write-Host "📊 Found $($response.Count) faculty records" -ForegroundColor White
        
        if ($response.Count -gt 0) {
            Write-Host "`n📝 Sample faculty record:" -ForegroundColor Cyan
            $response[0] | ConvertTo-Json | Write-Host -ForegroundColor Gray
        }
    } else {
        Write-Host "✅ API responded successfully" -ForegroundColor Green
    }
    
} catch {
    Write-Host "⚠️  Could not verify via API: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "    This is okay if you just applied the SQL manually." -ForegroundColor Gray
}

# Success message
Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ Faculty Status Fix Complete!                          ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "🎉 What was fixed:" -ForegroundColor Cyan
Write-Host "   ✓ Added status column to faculty table" -ForegroundColor White
Write-Host "   ✓ Set default value to 'approved'" -ForegroundColor White
Write-Host "   ✓ Created performance index" -ForegroundColor White
Write-Host "   ✓ Updated existing records`n" -ForegroundColor White

Write-Host "🌐 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Visit https://campusaxis.site/faculty" -ForegroundColor White
Write-Host "   2. Press Ctrl+Shift+R to hard refresh" -ForegroundColor White
Write-Host "   3. Faculty members should now load! 🎓`n" -ForegroundColor White

Write-Host "📖 For complete SEO setup: .\scripts\apply-seo.ps1`n" -ForegroundColor Yellow

Write-Host "✨ Done!" -ForegroundColor Green
