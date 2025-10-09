# Security Fix Automation Script
# Run this in PowerShell to apply immediate security fixes

Write-Host "🔒 COMSATS ITE Security Fix Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if running in project directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Checking Git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  Warning: You have uncommitted changes. Consider committing them first." -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 0
    }
}

Write-Host "Step 2: Removing .env.local from git tracking..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    git rm --cached .env.local 2>$null
    if ($?) {
        Write-Host "✅ Removed .env.local from git tracking" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  .env.local was not tracked" -ForegroundColor Gray
    }
} else {
    Write-Host "ℹ️  .env.local does not exist" -ForegroundColor Gray
}

Write-Host "Step 3: Checking .gitignore..." -ForegroundColor Yellow
$gitignoreContent = Get-Content ".gitignore" -Raw
if ($gitignoreContent -match "\.env\*") {
    Write-Host "✅ .gitignore already contains .env* pattern" -ForegroundColor Green
} else {
    Write-Host "⚠️  Adding .env* to .gitignore" -ForegroundColor Yellow
    Add-Content ".gitignore" "`n# Environment variables`n.env*`n!.env.example"
    Write-Host "✅ Updated .gitignore" -ForegroundColor Green
}

Write-Host "Step 4: Creating .env.local from example..." -ForegroundColor Yellow
if (-not (Test-Path ".env.local")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.local"
        Write-Host "✅ Created .env.local from .env.example" -ForegroundColor Green
        Write-Host "⚠️  IMPORTANT: Edit .env.local with your actual credentials!" -ForegroundColor Yellow
    } else {
        Write-Host "❌ .env.example not found" -ForegroundColor Red
    }
} else {
    Write-Host "ℹ️  .env.local already exists" -ForegroundColor Gray
}

Write-Host "Step 5: Installing dependencies..." -ForegroundColor Yellow
$hasChanges = $false
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json

# Check if validation package exists
if (-not $packageJson.dependencies.zod) {
    Write-Host "Installing zod for validation..." -ForegroundColor Gray
    npm install zod
    $hasChanges = $true
}

if ($hasChanges) {
    Write-Host "✅ Dependencies updated" -ForegroundColor Green
} else {
    Write-Host "✅ All required dependencies present" -ForegroundColor Green
}

Write-Host "Step 6: Running TypeScript check..." -ForegroundColor Yellow
Write-Host "Note: Some errors are expected until all files are updated" -ForegroundColor Gray
npm run build 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ TypeScript check passed" -ForegroundColor Green
} else {
    Write-Host "⚠️  TypeScript errors found (expected during migration)" -ForegroundColor Yellow
    Write-Host "   Run 'npm run build' to see details" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "✅ Automated fixes complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 NEXT MANUAL STEPS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. REGENERATE CREDENTIALS (CRITICAL):" -ForegroundColor Red
Write-Host "   - Supabase: Dashboard → Settings → API → Reset service role key" -ForegroundColor Gray
Write-Host "   - MongoDB: Atlas → Security → Database Access → Change password" -ForegroundColor Gray
Write-Host ""
Write-Host "2. UPDATE .env.local:" -ForegroundColor Yellow
Write-Host "   - Open .env.local in your editor" -ForegroundColor Gray
Write-Host "   - Replace placeholder values with actual credentials" -ForegroundColor Gray
Write-Host "   - NEVER commit this file to git!" -ForegroundColor Gray
Write-Host ""
Write-Host "3. RESTART DEV SERVER:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4. VERIFY SECURITY:" -ForegroundColor Yellow
Write-Host "   - Test authentication flows" -ForegroundColor Gray
Write-Host "   - Test file upload limits" -ForegroundColor Gray
Write-Host "   - Test rate limiting" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 For detailed instructions, see:" -ForegroundColor Cyan
Write-Host "   - SECURITY_GUIDE.md" -ForegroundColor Gray
Write-Host "   - SECURITY_IMPLEMENTATION.md" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  DO NOT DEPLOY TO PRODUCTION until all steps are complete!" -ForegroundColor Red
Write-Host ""
