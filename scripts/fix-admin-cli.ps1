#!/usr/bin/env pwsh
# Fix admin access using Supabase CLI
# Run this script to apply the RLS policy fix

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🔧 ADMIN ACCESS FIX SCRIPT" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if Supabase CLI is installed
Write-Host "📋 Checking Supabase CLI..." -ForegroundColor Yellow
$supabaseInstalled = Get-Command supabase -ErrorAction SilentlyContinue

if (-not $supabaseInstalled) {
    Write-Host "❌ Supabase CLI not found!" -ForegroundColor Red
    Write-Host "`nInstall it with:" -ForegroundColor White
    Write-Host "  npm install -g supabase" -ForegroundColor Cyan
    Write-Host "  OR" -ForegroundColor White
    Write-Host "  scoop install supabase" -ForegroundColor Cyan
    Write-Host "`nThen run this script again.`n" -ForegroundColor White
    exit 1
}

Write-Host "✅ Supabase CLI found" -ForegroundColor Green

# Check if we're in a Supabase project
Write-Host "`n📋 Checking Supabase project..." -ForegroundColor Yellow
if (-not (Test-Path ".\supabase\config.toml")) {
    Write-Host "❌ Not a Supabase project!" -ForegroundColor Red
    Write-Host "`nRun 'supabase init' first, or run this from project root.`n" -ForegroundColor White
    exit 1
}

Write-Host "✅ Supabase project detected" -ForegroundColor Green

# Ask user which method to use
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Choose fix method:" -ForegroundColor Yellow
Write-Host "  1. Apply migration (recommended)" -ForegroundColor White
Write-Host "  2. Run SQL directly in Supabase dashboard" -ForegroundColor White
Write-Host "  3. Both (migration + verify)" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan

$choice = Read-Host "Enter choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "`n🚀 Applying RLS fix migration..." -ForegroundColor Yellow
        
        # Check if local DB is running
        Write-Host "`n📋 Checking local Supabase..." -ForegroundColor Yellow
        supabase status
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "`n⚠️  Local Supabase not running!" -ForegroundColor Yellow
            Write-Host "Starting local Supabase...`n" -ForegroundColor White
            supabase start
        }
        
        Write-Host "`n📋 Applying migration..." -ForegroundColor Yellow
        supabase db push
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n✅ Migration applied successfully!" -ForegroundColor Green
            Write-Host "`n📋 Next steps:" -ForegroundColor Yellow
            Write-Host "  1. Test admin access locally" -ForegroundColor White
            Write-Host "  2. If it works, push to production:" -ForegroundColor White
            Write-Host "     supabase db push --linked" -ForegroundColor Cyan
        } else {
            Write-Host "`n❌ Migration failed!" -ForegroundColor Red
            Write-Host "Check the error above and fix manually.`n" -ForegroundColor White
        }
    }
    
    "2" {
        Write-Host "`n📋 Opening SQL script..." -ForegroundColor Yellow
        Write-Host "`nSteps:" -ForegroundColor White
        Write-Host "  1. Open your Supabase Dashboard" -ForegroundColor Gray
        Write-Host "  2. Go to SQL Editor" -ForegroundColor Gray
        Write-Host "  3. Copy contents from: scripts\fix-admin-access.sql" -ForegroundColor Gray
        Write-Host "  4. Update YOUR_EMAIL@cuilahore.edu.pk with your actual email" -ForegroundColor Yellow
        Write-Host "  5. Run the SQL" -ForegroundColor Gray
        Write-Host "`nOpening file now...`n" -ForegroundColor White
        
        Start-Process ".\scripts\fix-admin-access.sql"
    }
    
    "3" {
        Write-Host "`n🚀 Applying migration AND opening SQL..." -ForegroundColor Yellow
        
        # Apply migration
        supabase db push
        
        # Open SQL file
        Write-Host "`n📋 Opening verification SQL..." -ForegroundColor Yellow
        Start-Process ".\scripts\fix-admin-access.sql"
        
        Write-Host "`n📋 Complete these steps:" -ForegroundColor Yellow
        Write-Host "  1. Migration applied ✅" -ForegroundColor Green
        Write-Host "  2. Run verification SQL in Supabase Dashboard" -ForegroundColor White
        Write-Host "  3. Add your email as super_admin" -ForegroundColor White
        Write-Host "  4. Test admin access" -ForegroundColor White
    }
    
    default {
        Write-Host "`n❌ Invalid choice!`n" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🔍 TROUBLESHOOTING TIPS" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nIf you're still locked out:" -ForegroundColor White
Write-Host "  1. Go to Supabase Dashboard → SQL Editor" -ForegroundColor Gray
Write-Host "  2. Run this query to check your admin status:" -ForegroundColor Gray
Write-Host "" -ForegroundColor Gray
Write-Host "     SELECT au.*, u.email" -ForegroundColor Cyan
Write-Host "     FROM admin_users au" -ForegroundColor Cyan
Write-Host "     JOIN auth.users u ON u.id = au.user_id" -ForegroundColor Cyan
Write-Host "     WHERE u.email = 'your@email.com';" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Gray
Write-Host "  3. If no row found, manually insert:" -ForegroundColor Gray
Write-Host "" -ForegroundColor Gray
Write-Host "     INSERT INTO admin_users (user_id, role, permissions)" -ForegroundColor Cyan
Write-Host "     SELECT id, 'super_admin', ARRAY['all']" -ForegroundColor Cyan
Write-Host "     FROM auth.users" -ForegroundColor Cyan
Write-Host "     WHERE email = 'your@email.com';" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Gray
Write-Host "  4. Clear browser cache and login again" -ForegroundColor Gray
Write-Host "`n========================================`n" -ForegroundColor Cyan
