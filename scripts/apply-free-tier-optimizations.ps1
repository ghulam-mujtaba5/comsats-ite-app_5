# Script to apply free tier optimizations to the database
# This script applies the index optimization migrations to improve query performance

Write-Host "Applying free tier database optimizations..." -ForegroundColor Green

# Check if Supabase CLI is installed
$supabaseInstalled = Get-Command npx -ErrorAction SilentlyContinue
if (-not $supabaseInstalled) {
    Write-Host "Error: npx is not installed. Please install Node.js and npm." -ForegroundColor Red
    exit 1
}

# Check if Supabase project is linked
$supabaseStatus = npx supabase link --check
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Supabase project is not linked. Please run 'npx supabase link' first." -ForegroundColor Red
    exit 1
}

# Apply the optimization migrations
Write-Host "Applying faculty indexes optimization..." -ForegroundColor Yellow
npx supabase migration up 20251010010000

Write-Host "Applying reviews indexes optimization..." -ForegroundColor Yellow
npx supabase migration up 20251010020000

Write-Host "Applying community posts indexes optimization..." -ForegroundColor Yellow
npx supabase migration up 20251010030000

Write-Host "Applying post reactions indexes optimization..." -ForegroundColor Yellow
npx supabase migration up 20251010040000

Write-Host "Database optimizations applied successfully!" -ForegroundColor Green
Write-Host "Your application is now optimized for the Vercel free tier." -ForegroundColor Green