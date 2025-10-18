# Enhanced CSS Module Import Script
# Properly adds import statements to TSX files

Write-Host "🎨 Enhanced CSS Module Import Script" -ForegroundColor Cyan
Write-Host ""

$rootPath = "e:\comsats-ite-app_5"

# List of files to update (using actual paths that exist)
$filesToUpdate = @(
    @{ Path = "contexts\auth-context.tsx"; ModuleName = "auth-context" },
    @{ Path = "contexts\campus-context.tsx"; ModuleName = "campus-context" },
    @{ Path = "contexts\emotion-context.tsx"; ModuleName = "emotion-context" },
    @{ Path = "contexts\emotional-ui-context.tsx"; ModuleName = "emotional-ui-context" },
    @{ Path = "hooks\use-session-tracker.tsx"; ModuleName = "use-session-tracker" },
    @{ Path = "lib\accessibility.tsx"; ModuleName = "accessibility" },
    @{ Path = "lib\performance.tsx"; ModuleName = "performance" },
    @{ Path = "lib\ui-ux-examples.tsx"; ModuleName = "ui-ux-examples" },
    @{ Path = "__tests__\components\enhanced-components.test.tsx"; ModuleName = "enhanced-components.test" }
)

$updated = 0
$skipped = 0
$failed = 0

Write-Host "📊 Processing $($filesToUpdate.Count) files..." -ForegroundColor Yellow
Write-Host ""

foreach ($fileInfo in $filesToUpdate) {
    $fullPath = Join-Path $rootPath $fileInfo.Path
    $moduleName = $fileInfo.ModuleName
    
    Write-Host "Processing: $($fileInfo.Path)" -ForegroundColor Cyan
    
    if (-not (Test-Path $fullPath)) {
        Write-Host "  ❌ File not found" -ForegroundColor Red
        $failed++
        continue
    }
    
    try {
        # Read file content
        $content = Get-Content $fullPath -Raw -Encoding UTF8
        
        # Check if import already exists
        if ($content -match "import\s+styles\s+from") {
            Write-Host "  ℹ️  Import already exists, skipping" -ForegroundColor Gray
            $skipped++
            continue
        }
        
        # Create import statement
        $importStatement = "import styles from './$moduleName.module.css';"
        
        # Find position to insert (after first set of imports)
        $lines = $content -split "`r?`n"
        $insertLine = -1
        $lastImportLine = -1
        
        # Find the last import line
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match "^import\s+") {
                $lastImportLine = $i
            } elseif ($lastImportLine -ge 0 -and $lines[$i].Trim() -eq "") {
                # Found empty line after imports
                $insertLine = $i
                break
            } elseif ($lastImportLine -ge 0 -and $lines[$i] -notmatch "^import\s+" -and $lines[$i].Trim() -ne "") {
                # Found non-import, non-empty line after imports
                $insertLine = $i
                break
            }
        }
        
        if ($insertLine -eq -1 -and $lastImportLine -ge 0) {
            $insertLine = $lastImportLine + 1
        } elseif ($insertLine -eq -1) {
            # No imports found, add at line 2 (after "use client" or first line)
            $insertLine = 1
        }
        
        # Insert the import
        $newLines = @()
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($i -eq $insertLine) {
                $newLines += $importStatement
            }
            $newLines += $lines[$i]
        }
        
        # Write back to file
        $newContent = $newLines -join "`r`n"
        Set-Content -Path $fullPath -Value $newContent -Encoding UTF8 -NoNewline
        
        Write-Host "  ✅ Import added successfully" -ForegroundColor Green
        $updated++
        
    } catch {
        Write-Host "  ❌ Error: $_" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Updated: $updated files" -ForegroundColor Green
Write-Host "  ⏭️  Skipped: $skipped files" -ForegroundColor Gray
Write-Host "  ❌ Failed: $failed files" -ForegroundColor $(if ($failed -eq 0) { 'Green' } else { 'Red' })

Write-Host ""
Write-Host "✨ Import process complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Run verify-css-imports.ps1 to confirm" -ForegroundColor White
Write-Host "  2. Update className attributes in components" -ForegroundColor White
Write-Host "  3. Test in browser: pnpm dev" -ForegroundColor White
