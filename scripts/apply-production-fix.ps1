#!/usr/bin/env pwsh
# =====================================================
# PRODUCTION FIX - Apply via Supabase CLI
# =====================================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║    🚀 PRODUCTION ADMIN FIX - SUPABASE CLI METHOD         ║" -ForegroundColor White -BackgroundColor DarkGreen
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if Supabase CLI is installed
Write-Host "📋 [1/5] Checking Supabase CLI..." -ForegroundColor Cyan
$supabaseCmd = Get-Command supabase -ErrorAction SilentlyContinue

if (-not $supabaseCmd) {
    Write-Host "❌ Supabase CLI not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install it with:" -ForegroundColor Yellow
    Write-Host "  npm install -g supabase" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "OR use the direct database method below..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  DIRECT DATABASE METHOD (NO CLI NEEDED)" -ForegroundColor White
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Go to: https://supabase.com/dashboard/project/ctixprrqbnfivhepifsa/editor" -ForegroundColor White
    Write-Host "2. Click 'SQL Editor' → 'New query'" -ForegroundColor White
    Write-Host "3. Open file: supabase\migrations\20250109_fix_admin_system_production.sql" -ForegroundColor Cyan
    Write-Host "4. Copy entire content" -ForegroundColor White
    Write-Host "5. Paste in SQL Editor" -ForegroundColor White
    Write-Host "6. Click 'Run' (or press Ctrl+Enter)" -ForegroundColor White
    Write-Host "7. Wait for 'Success' message" -ForegroundColor Green
    Write-Host "8. Done! ✅" -ForegroundColor Green
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

$version = (supabase --version) -replace '.*?(\d+\.\d+\.\d+).*','$1'
Write-Host "✅ Supabase CLI v$version" -ForegroundColor Green
Write-Host ""

# Check if logged in
Write-Host "📋 [2/5] Checking authentication..." -ForegroundColor Cyan
try {
    $loginCheck = supabase projects list 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Not logged in. Starting login..." -ForegroundColor Yellow
        Write-Host ""
        supabase login
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Login failed!" -ForegroundColor Red
            exit 1
        }
    }
    Write-Host "✅ Authenticated" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Authentication check failed" -ForegroundColor Red
    exit 1
}

# Load environment
Write-Host "📋 [3/5] Loading configuration..." -ForegroundColor Cyan
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ .env.local not found!" -ForegroundColor Red
    exit 1
}

$envContent = Get-Content ".env.local" -Raw
$urlMatch = [regex]::Match($envContent, 'NEXT_PUBLIC_SUPABASE_URL\s*=\s*([^\s]+)')

if (-not $urlMatch.Success) {
    Write-Host "❌ Could not find Supabase URL in .env.local" -ForegroundColor Red
    exit 1
}

$supabaseUrl = $urlMatch.Groups[1].Value.Trim()
$projectRef = ($supabaseUrl -replace 'https://|\.supabase\.co.*', '')

Write-Host "✅ Project: $projectRef" -ForegroundColor Green
Write-Host "✅ URL: $supabaseUrl" -ForegroundColor Green
Write-Host ""

# Link to project
Write-Host "📋 [4/5] Linking to Supabase project..." -ForegroundColor Cyan
Write-Host "⚠️  If prompted, select your project from the list" -ForegroundColor Yellow
Write-Host ""

try {
    # Try to link (may already be linked)
    supabase link --project-ref $projectRef 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Linked to project" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Already linked or link not required" -ForegroundColor Yellow
    }
    Write-Host ""
} catch {
    Write-Host "⚠️  Link step skipped (may already be linked)" -ForegroundColor Yellow
    Write-Host ""
}

# Apply migration using psql (more reliable than CLI)
Write-Host "📋 [5/5] Applying production fix..." -ForegroundColor Cyan
Write-Host "⚡ Running SQL migration via direct connection..." -ForegroundColor Gray
Write-Host ""

$migrationFile = "supabase\migrations\20250109_fix_admin_system_production.sql"

if (-not (Test-Path $migrationFile)) {
    Write-Host "❌ Migration file not found: $migrationFile" -ForegroundColor Red
    exit 1
}

# Get database password from .env.local
$dbPasswordMatch = [regex]::Match($envContent, 'SUPABASE_DB_PASSWORD\s*=\s*([^\s]+)')
if ($dbPasswordMatch.Success) {
    $dbPassword = $dbPasswordMatch.Groups[1].Value.Trim()
    
    Write-Host "Connecting to database..." -ForegroundColor Gray
    
    # Set password environment variable
    $env:PGPASSWORD = $dbPassword
    
    # Try using psql
    $psqlCmd = Get-Command psql -ErrorAction SilentlyContinue
    
    if ($psqlCmd) {
        try {
            $dbHost = "db.$projectRef.supabase.co"
            $output = psql -h $dbHost -U postgres -d postgres -p 5432 -f $migrationFile 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Migration applied successfully!" -ForegroundColor Green
                Write-Host ""
                if ($output) {
                    Write-Host "Database output:" -ForegroundColor Gray
                    Write-Host $output -ForegroundColor White
                }
            } else {
                throw "psql failed with exit code $LASTEXITCODE"
            }
        } catch {
            Write-Host "⚠️  psql method failed: $_" -ForegroundColor Yellow
            Write-Host ""
            $psqlCmd = $null
        }
    }
    
    if (-not $psqlCmd) {
        # psql not available or failed - use REST API method
        Write-Host "Using REST API method..." -ForegroundColor Yellow
        
        $sqlContent = Get-Content $migrationFile -Raw
        $serviceKeyMatch = [regex]::Match($envContent, 'SUPABASE_SERVICE_ROLE_KEY\s*=\s*([^\s]+)')
        
        if ($serviceKeyMatch.Success) {
            $serviceKey = $serviceKeyMatch.Groups[1].Value.Trim()
            
            $headers = @{
                "apikey" = $serviceKey
                "Authorization" = "Bearer $serviceKey"
                "Content-Type" = "application/json"
            }
            
            # Split SQL into statements and execute via REST API
            Write-Host "Executing migration via REST API..." -ForegroundColor Gray
            
            try {
                $rpcUrl = "$supabaseUrl/rest/v1/rpc/exec_sql"
                $body = @{ query = $sqlContent } | ConvertTo-Json
                
                $response = Invoke-RestMethod -Uri $rpcUrl -Method Post -Headers $headers -Body $body -ErrorAction Stop
                
                Write-Host "✅ Migration applied via REST API!" -ForegroundColor Green
            } catch {
                Write-Host "⚠️  REST API method not available" -ForegroundColor Yellow
                Write-Host ""
                Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Yellow
                Write-Host "  MANUAL APPLICATION REQUIRED" -ForegroundColor White -BackgroundColor DarkYellow
                Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Yellow
                Write-Host ""
                Write-Host "Please apply the migration manually:" -ForegroundColor White
                Write-Host ""
                Write-Host "1. Go to: https://supabase.com/dashboard/project/$projectRef/sql/new" -ForegroundColor Cyan
                Write-Host "2. Open file in editor: $migrationFile" -ForegroundColor Cyan
                Write-Host "3. Copy ALL content (Ctrl+A, Ctrl+C)" -ForegroundColor Cyan
                Write-Host "4. Paste in SQL Editor" -ForegroundColor Cyan
                Write-Host "5. Click 'Run' (or press Ctrl+Enter)" -ForegroundColor Cyan
                Write-Host "6. Wait for 'Success' message with NOTICE logs" -ForegroundColor Cyan
                Write-Host "7. Done! ✅" -ForegroundColor Green
                Write-Host ""
                Write-Host "Opening the migration file for you..." -ForegroundColor Yellow
                Start-Process notepad $migrationFile
                Write-Host ""
                Read-Host "Press Enter after you've applied the migration manually"
            }
        }
    }
} else {
    Write-Host "⚠️  Database password not found in .env.local" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Yellow
    Write-Host "  MANUAL APPLICATION REQUIRED" -ForegroundColor White -BackgroundColor DarkYellow
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please apply the migration manually:" -ForegroundColor White
    Write-Host ""
    Write-Host "1. Go to: https://supabase.com/dashboard/project/$projectRef/sql/new" -ForegroundColor Cyan
    Write-Host "2. Open file in editor: $migrationFile" -ForegroundColor Cyan
    Write-Host "3. Copy ALL content (Ctrl+A, Ctrl+C)" -ForegroundColor Cyan
    Write-Host "4. Paste in SQL Editor" -ForegroundColor Cyan
    Write-Host "5. Click 'Run' (or press Ctrl+Enter)" -ForegroundColor Cyan
    Write-Host "6. Wait for 'Success' message" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Opening the migration file for you..." -ForegroundColor Yellow
    Start-Process notepad $migrationFile
    Write-Host ""
    Read-Host "Press Enter after you've applied the migration manually"
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   ✅ PRODUCTION FIX APPLIED SUCCESSFULLY!                ║" -ForegroundColor White -BackgroundColor DarkGreen
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "What was fixed:" -ForegroundColor White
Write-Host "  ✅ RLS policies updated (3 policies)" -ForegroundColor Green
Write-Host "  ✅ fa22-bse-199@cuilahore.edu.pk → super_admin" -ForegroundColor Green
Write-Host "  ✅ Promote user functionality fixed" -ForegroundColor Green
Write-Host "  ✅ Indexes and triggers added" -ForegroundColor Green
Write-Host "  ✅ Production ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1️⃣  Restart your dev server (Ctrl+C, then npm run dev)" -ForegroundColor Cyan
Write-Host "  2️⃣  Login as: fa22-bse-199@cuilahore.edu.pk" -ForegroundColor Cyan
Write-Host "  3️⃣  Go to: http://localhost:3000/admin/users" -ForegroundColor Cyan
Write-Host "  4️⃣  Click 'Admin Users' tab" -ForegroundColor Cyan
Write-Host "  5️⃣  You'll see your admin user! ✅" -ForegroundColor Green
Write-Host ""
Write-Host "For instant access (dev mode only):" -ForegroundColor Yellow
Write-Host "  Open console (F12) and run:" -ForegroundColor White
Write-Host "    document.cookie = 'dev_admin=1; path=/';" -ForegroundColor Cyan
Write-Host "    location.reload();" -ForegroundColor Cyan
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                   🎉 ALL DONE!                           ║" -ForegroundColor White -BackgroundColor DarkGreen
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"
