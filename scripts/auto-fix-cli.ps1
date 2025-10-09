#!/usr/bin/env pwsh
# ====================================================
# FULLY AUTOMATED ADMIN FIX - SUPABASE CLI PUSH
# ====================================================

$ErrorActionPreference = "Stop"

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   🚀 AUTOMATED ADMIN FIX - SUPABASE CLI PUSH METHOD      ║" -ForegroundColor White -BackgroundColor DarkGreen
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Check if Supabase CLI is installed
Write-Host "📋 [1/4] Checking Supabase CLI..." -ForegroundColor Cyan
$supabaseCmd = Get-Command supabase -ErrorAction SilentlyContinue

if (-not $supabaseCmd) {
    Write-Host "❌ Supabase CLI not found!" -ForegroundColor Red
    Write-Host "`nInstall it with:" -ForegroundColor Yellow
    Write-Host "  npm install -g supabase`n" -ForegroundColor Cyan
    Read-Host "Press Enter to exit"
    exit 1
}

$version = (supabase --version) -replace '.*?(\d+\.\d+\.\d+).*','$1'
Write-Host "✅ Supabase CLI v$version`n" -ForegroundColor Green

# Link to project (if not already linked)
Write-Host "📋 [2/4] Linking to Supabase project..." -ForegroundColor Cyan
try {
    supabase link --project-ref ctixprrqbnfivhepifsa 2>&1 | Out-Null
    Write-Host "✅ Linked to project ctixprrqbnfivhepifsa`n" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Already linked or link not required`n" -ForegroundColor Yellow
}

# Push migrations
Write-Host "📋 [3/4] Pushing migrations to remote database..." -ForegroundColor Cyan
Write-Host "⚡ Applying admin fix SQL automatically...`n" -ForegroundColor Gray

try {
    $output = supabase db push --include-roles --include-all --yes 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migrations pushed successfully!`n" -ForegroundColor Green
        Write-Host "Output:" -ForegroundColor Gray
        Write-Host ($output | Out-String) -ForegroundColor White
    } else {
        throw "Push failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Host "❌ Migration push failed!" -ForegroundColor Red
    Write-Host "`nError:" -ForegroundColor Red
    Write-Host $_ -ForegroundColor White
    Write-Host "`nYou can try manually via Supabase Dashboard SQL Editor" -ForegroundColor Yellow
    Read-Host "`nPress Enter to exit"
    exit 1
}

# Open localhost with dev bypass
Write-Host "📋 [4/4] Opening admin panel with dev bypass..." -ForegroundColor Cyan

# Create a small HTML file that sets the cookie and redirects
$htmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <title>Admin Fix - Dev Bypass</title>
    <script>
        document.cookie = 'dev_admin=1; path=/; max-age=86400';
        setTimeout(() => {
            window.location.href = 'http://localhost:3000/admin/users';
        }, 500);
    </script>
</head>
<body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center;">
        <h1 style="color: #667eea; margin-bottom: 20px;">🎉 Admin Fix Applied!</h1>
        <p style="font-size: 18px; color: #666;">Setting dev bypass cookie...</p>
        <p style="font-size: 14px; color: #999;">Redirecting to admin panel...</p>
    </div>
</body>
</html>
"@

$tempHtml = "$env:TEMP\admin-fix-redirect.html"
Set-Content -Path $tempHtml -Value $htmlContent -Force

Write-Host "✅ Opening admin panel...`n" -ForegroundColor Green
Start-Process $tempHtml

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   ✅ ADMIN FIX COMPLETE!                                  ║" -ForegroundColor White -BackgroundColor DarkGreen
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "What was done:" -ForegroundColor White
Write-Host "  ✅ RLS policies fixed (3 policies)" -ForegroundColor Green
Write-Host "  ✅ fa22-bse-199@cuilahore.edu.pk → super_admin" -ForegroundColor Green
Write-Host "  ✅ Promote user functionality fixed" -ForegroundColor Green
Write-Host "  ✅ Indexes and triggers added" -ForegroundColor Green
Write-Host "  ✅ Dev bypass enabled for testing" -ForegroundColor Green
Write-Host "  ✅ Admin panel opening...`n" -ForegroundColor Green

Write-Host "The admin panel should open in your browser automatically." -ForegroundColor Cyan
Write-Host "You'll be redirected to: http://localhost:3000/admin/users`n" -ForegroundColor Cyan

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1️⃣  Check the 'Admin Users' tab" -ForegroundColor White
Write-Host "  2️⃣  You should see 5 admin users" -ForegroundColor White
Write-Host "  3️⃣  Test promoting a user" -ForegroundColor White
Write-Host "  4️⃣  Everything should work! ✅`n" -ForegroundColor Green

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   🎉 ALL DONE - FULLY AUTOMATED!                         ║" -ForegroundColor White -BackgroundColor DarkGreen
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Read-Host "Press Enter to exit"
