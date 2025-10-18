# Import CSS Modules into TSX Files
# Adds import statements for CSS modules to their corresponding TSX files

Write-Host "🎨 CSS Module Import Assistant" -ForegroundColor Cyan
Write-Host ""

$rootPath = "e:\comsats-ite-app_5"
$needsWorkPath = "$rootPath\files-needing-css-modules.json"

if (-not (Test-Path $needsWorkPath)) {
    Write-Host "❌ Please run audit-css-modules.ps1 first!" -ForegroundColor Red
    exit 1
}

$files = Get-Content $needsWorkPath | ConvertFrom-Json

# Filter to only the 22 files that had missing modules
$filesToUpdate = $files | Where-Object { 
    $_.Status -like "*Missing*" -or 
    ($_.HasBase -eq $true -and $_.HasDark -eq $true -and $_.HasLight -eq $true)
} | Select-Object -First 22

Write-Host "📊 Found $($filesToUpdate.Count) TSX files needing CSS module imports" -ForegroundColor Yellow
Write-Host ""

$updated = 0
$skipped = 0
$errors = 0

foreach ($file in $filesToUpdate) {
    $tsxPath = $file.Path
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($tsxPath)
    
    Write-Host "Processing: $baseName.tsx" -ForegroundColor Cyan
    
    # Skip if file doesn't exist
    if (-not (Test-Path $tsxPath)) {
        Write-Host "  ⚠️  File not found, skipping..." -ForegroundColor Yellow
        $skipped++
        continue
    }
    
    # Read the TSX file
    $content = Get-Content $tsxPath -Raw
    
    # Check if import already exists
    if ($content -match "import.*from.*['\`"].*$baseName\.module\.css['\`"]") {
        Write-Host "  ℹ️  Import already exists, skipping..." -ForegroundColor Gray
        $skipped++
        continue
    }
    
    # Generate import statement
    $importStatement = "import styles from './$baseName.module.css';"
    
    # Find the right place to insert (after other imports)
    $lines = $content -split "`n"
    $insertIndex = 0
    $foundImports = $false
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match "^import\s") {
            $foundImports = $true
            $insertIndex = $i + 1
        } elseif ($foundImports -and $lines[$i] -notmatch "^import\s" -and $lines[$i].Trim() -ne "") {
            break
        }
    }
    
    # Insert the import
    if ($insertIndex -gt 0) {
        $lines = @($lines[0..($insertIndex-1)]) + @($importStatement) + @($lines[$insertIndex..($lines.Count-1)])
        $newContent = $lines -join "`n"
        
        # Write back to file
        try {
            $newContent | Out-File -FilePath $tsxPath -Encoding UTF8 -NoNewline
            Write-Host "  ✅ Added import statement" -ForegroundColor Green
            $updated++
        } catch {
            Write-Host "  ❌ Error writing file: $_" -ForegroundColor Red
            $errors++
        }
    } else {
        # If no imports found, add at the top
        $newContent = $importStatement + "`n`n" + $content
        try {
            $newContent | Out-File -FilePath $tsxPath -Encoding UTF8 -NoNewline
            Write-Host "  ✅ Added import statement at top" -ForegroundColor Green
            $updated++
        } catch {
            Write-Host "  ❌ Error writing file: $_" -ForegroundColor Red
            $errors++
        }
    }
}

Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Updated: $updated files" -ForegroundColor Green
Write-Host "  ⏭️  Skipped: $skipped files" -ForegroundColor Gray
if ($errors -gt 0) {
    Write-Host "  ❌ Errors: $errors files" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Review the updated files" -ForegroundColor White
Write-Host "  2. Update className attributes to use 'styles.className'" -ForegroundColor White
Write-Host "  3. Test the components in the browser" -ForegroundColor White
Write-Host ""
Write-Host "✨ Import process complete!" -ForegroundColor Green
