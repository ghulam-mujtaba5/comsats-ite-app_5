#!/usr/bin/env pwsh
# Quick script to restart dev server with environment variables loaded

Write-Host "🔄 Restarting Next.js development server..." -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ .env.local not found!" -ForegroundColor Red
    Write-Host "Create .env.local with your Supabase credentials" -ForegroundColor Yellow
    exit 1
}

# Verify required environment variables
Write-Host "✅ Checking environment variables..." -ForegroundColor Green
$envContent = Get-Content .env.local -Raw

$requiredVars = @(
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY", 
    "SUPABASE_SERVICE_ROLE_KEY"
)

$missing = @()
foreach ($var in $requiredVars) {
    if ($envContent -match "$var=") {
        Write-Host "   ✓ $var" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $var" -ForegroundColor Red
        $missing += $var
    }
}

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ Missing required environment variables:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "   - $_" -ForegroundColor Yellow }
    Write-Host ""
    Write-Host "Add these to .env.local before starting the server" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✅ All required environment variables found!" -ForegroundColor Green
Write-Host ""

# Kill any existing Next.js processes
Write-Host "🔍 Checking for existing Next.js processes..." -ForegroundColor Cyan
$nextProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*next dev*" }
if ($nextProcesses) {
    Write-Host "   Stopping existing processes..." -ForegroundColor Yellow
    $nextProcesses | Stop-Process -Force
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "🚀 Starting Next.js development server..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Start the dev server
npm run dev
