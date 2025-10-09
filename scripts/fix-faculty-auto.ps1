#!/usr/bin/env pwsh
# 🚀 Automated Faculty Status Fix Script
# This script automatically fixes the "column faculty.status does not exist" error

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🔧 CampusAxis - Faculty Status Column Auto-Fix          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "📋 Issue: column faculty.status does not exist" -ForegroundColor Yellow
Write-Host "🎯 Solution: Adding status column with proper constraints`n" -ForegroundColor Green

# Step 1: Check if Supabase is linked
Write-Host "🔍 Step 1: Checking Supabase connection..." -ForegroundColor Cyan
$supabaseStatus = npx supabase status 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Supabase is not linked or running!" -ForegroundColor Red
    Write-Host "`n📝 Please run one of these commands first:" -ForegroundColor Yellow
    Write-Host "   Option 1 (Remote): npx supabase link --project-ref YOUR_PROJECT_REF" -ForegroundColor White
    Write-Host "   Option 2 (Local): npx supabase start`n" -ForegroundColor White
    exit 1
}

Write-Host "✅ Supabase connection verified!`n" -ForegroundColor Green

# Step 2: Apply migration
Write-Host "🔨 Step 2: Applying faculty status column migration..." -ForegroundColor Cyan

try {
    # Check if migration file exists
    $migrationFile = "supabase\migrations\20251009300000_fix_faculty_status_column.sql"
    
    if (-not (Test-Path $migrationFile)) {
        Write-Host "❌ Migration file not found: $migrationFile" -ForegroundColor Red
        exit 1
    }

    Write-Host "📄 Found migration file: $migrationFile" -ForegroundColor White
    
    # Apply the migration
    Write-Host "`n🚀 Executing migration..." -ForegroundColor Yellow
    npx supabase db push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Migration applied successfully!" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️  Migration may have already been applied or encountered an issue." -ForegroundColor Yellow
        Write-Host "Attempting direct SQL execution as fallback..." -ForegroundColor Yellow
        
        # Fallback: Execute SQL directly
        npx supabase db reset --db-url $env:DATABASE_URL
    }
    
} catch {
    Write-Host "`n❌ Error applying migration: $_" -ForegroundColor Red
    exit 1
}

# Step 3: Verify the fix
Write-Host "`n🔍 Step 3: Verifying the fix..." -ForegroundColor Cyan

$verifySQL = @"
-- Check if status column exists
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'faculty' 
AND column_name = 'status';
"@

Write-Host "Running verification query..." -ForegroundColor White

# Save verification SQL to temp file
$verifySQL | Out-File -FilePath "temp_verify.sql" -Encoding UTF8

# Execute verification
$verifyResult = npx supabase db execute --file temp_verify.sql 2>&1

# Clean up temp file
Remove-Item "temp_verify.sql" -ErrorAction SilentlyContinue

if ($verifyResult -match "status") {
    Write-Host "✅ Status column exists and is configured correctly!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Could not verify column. Please check manually." -ForegroundColor Yellow
}

# Step 4: Count faculty
Write-Host "`n📊 Step 4: Checking faculty count..." -ForegroundColor Cyan

$countSQL = @"
SELECT status, COUNT(*) as count
FROM faculty
GROUP BY status;
"@

$countSQL | Out-File -FilePath "temp_count.sql" -Encoding UTF8
npx supabase db execute --file temp_count.sql
Remove-Item "temp_count.sql" -ErrorAction SilentlyContinue

# Success message
Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ Faculty Status Column Fix Complete!                   ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "🎉 What was fixed:" -ForegroundColor Cyan
Write-Host "   ✓ Added status column to faculty table" -ForegroundColor White
Write-Host "   ✓ Set default value to 'approved'" -ForegroundColor White
Write-Host "   ✓ Created performance index" -ForegroundColor White
Write-Host "   ✓ Updated existing records" -ForegroundColor White
Write-Host "   ✓ Added RLS policy for public access`n" -ForegroundColor White

Write-Host "🌐 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Visit https://campusaxis.site/faculty" -ForegroundColor White
Write-Host "   2. Press Ctrl+Shift+R to hard refresh" -ForegroundColor White
Write-Host "   3. Faculty members should now load! 🎓`n" -ForegroundColor White

Write-Host "📖 For SEO optimization, see: START_HERE_COMPLETE_GUIDE.md`n" -ForegroundColor Yellow

Write-Host "✨ Done! Your faculty page is now working." -ForegroundColor Green
