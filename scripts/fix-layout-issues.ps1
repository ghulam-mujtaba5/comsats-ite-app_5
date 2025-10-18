# Fix Layout Issues Caused by Glassmorphism CSS Modules
# This script removes problematic generic class names that conflict with component layouts

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fixing Layout Issues" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$fixedFiles = 0
$errors = 0

# Get all .module.css files (not light/dark)
$moduleFiles = Get-ChildItem -Path . -Recurse -Filter "*.module.css" -File | `
    Where-Object { $_.Name -notmatch '\.(light|dark)\.module\.css$' }

Write-Host "Found $($moduleFiles.Count) CSS module files to check..." -ForegroundColor Yellow
Write-Host ""

foreach ($file in $moduleFiles) {
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction Stop
        $originalContent = $content
        
        # Check if file has the problematic pattern
        if ($content -match '\/\* Glass \*\/\.(container|root|wrapper)') {
            Write-Host "Fixing: $($file.Name)" -ForegroundColor Yellow
            
            # Remove the entire problematic line
            $content = $content -replace '\/\* Glass \*\/\.(?:container|root|wrapper)[^}]+\}', ''
            
            # Clean up extra whitespace
            $content = $content.Trim()
            
            # If file is now empty or only has comments, add a placeholder
            if ($content -match '^\s*$' -or $content -match '^\/\*.*\*\/\s*$') {
                $content = "/* Component-specific styles only - generic classes removed */"
            }
            
            # Write the fixed content
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
            $fixedFiles++
            Write-Host "  Fixed generic class conflicts" -ForegroundColor Green
        }
        
    } catch {
        Write-Host "  Error processing $($file.Name): $_" -ForegroundColor Red
        $errors++
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Files Fixed: $fixedFiles" -ForegroundColor Green
Write-Host "  Errors: $errors" -ForegroundColor $(if ($errors -gt 0) { "Red" } else { "Green" })
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Fix globals.css max-width rule" -ForegroundColor Yellow
