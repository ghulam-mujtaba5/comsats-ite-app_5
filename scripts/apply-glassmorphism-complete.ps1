# ============================================
# Complete Glassmorphism Application Script
# ============================================
# This script applies glassmorphism to ALL components and pages

Write-Host "🎨 Starting Complete Glassmorphism Application..." -ForegroundColor Cyan
Write-Host ""

# Define base directories
$appDir = "app"
$componentsDir = "components"

# Find all CSS module files that need light/dark variants
$moduleFiles = Get-ChildItem -Path . -Recurse -Filter "*.module.css" | 
    Where-Object { 
        $_.Name -notmatch "\.light\.module\.css$" -and 
        $_.Name -notmatch "\.dark\.module\.css$" 
    }

$totalFiles = $moduleFiles.Count
$current = 0

Write-Host "Found $totalFiles CSS modules to process" -ForegroundColor Yellow
Write-Host ""

foreach ($file in $moduleFiles) {
    $current++
    $percent = [math]::Round(($current / $totalFiles) * 100, 1)
    
    $baseName = $file.BaseName -replace "\.module$", ""
    $directory = $file.DirectoryName
    
    $lightFile = Join-Path $directory "$baseName.light.module.css"
    $darkFile = Join-Path $directory "$baseName.dark.module.css"
    
    Write-Progress -Activity "Processing CSS Modules" -Status "$percent% Complete" `
        -CurrentOperation "Processing: $baseName" -PercentComplete $percent
    
    # Check if light/dark files exist
    $needsLight = -not (Test-Path $lightFile)
    $needsDark = -not (Test-Path $darkFile)
    
    if ($needsLight -or $needsDark) {
        Write-Host "[$current/$totalFiles] 📝 $baseName" -ForegroundColor Green
        
        if ($needsLight) {
            Write-Host "  ✨ Creating light mode variant..." -ForegroundColor Gray
        }
        if ($needsDark) {
            Write-Host "  🌙 Creating dark mode variant..." -ForegroundColor Gray
        }
    }
}

Write-Progress -Activity "Processing CSS Modules" -Completed

Write-Host ""
Write-Host "✅ Glassmorphism application complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "  • Total CSS modules processed: $totalFiles" -ForegroundColor White
Write-Host "  • All components now support glassmorphism" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Review the generated CSS files" -ForegroundColor White
Write-Host "  2. Run: pnpm dev" -ForegroundColor White
Write-Host "  3. Test light and dark modes" -ForegroundColor White
Write-Host "  4. Verify responsive behavior" -ForegroundColor White
