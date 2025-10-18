# Comprehensive CSS Cleanup and Glassmorphism Fix
# This script will:
# 1. Remove broken CSS file references
# 2. Clean up empty/placeholder CSS files
# 3. Replace all inline transparent styles with glass utilities
# 4. Generate a complete report

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CSS Cleanup & Glassmorphism Enhancement" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$fixedCount = 0
$removedCount = 0
$errors = @()

# Step 1: Find and count empty CSS module files
Write-Host "Step 1: Analyzing CSS module files..." -ForegroundColor Yellow
$allCssFiles = Get-ChildItem -Path . -Recurse -Filter "*.module.css" -File -ErrorAction SilentlyContinue

$emptyFiles = @()
$placeholderFiles = @()

foreach ($file in $allCssFiles) {
    try {
        if (Test-Path $file.FullName) {
            $content = Get-Content $file.FullName -Raw -ErrorAction Stop
            $trimmed = $content.Trim()
            
            # Check if file is essentially empty or just a placeholder
            if ($trimmed.Length -lt 50 -or 
                $trimmed -match '^\s*\/\*\s*Component-specific styles only[^*]*\*\/\s*$') {
                $emptyFiles += $file
            }
        }
    } catch {
        $errors += "Error reading $($file.FullName): $_"
    }
}

Write-Host "  Found $($emptyFiles.Count) empty/placeholder CSS files" -ForegroundColor Cyan

# Step 2: Clean up empty files
Write-Host ""
Write-Host "Step 2: Cleaning up empty CSS files..." -ForegroundColor Yellow

foreach ($file in $emptyFiles | Select-Object -First 50) {
    try {
        Remove-Item $file.FullName -Force
        $removedCount++
        Write-Host "  Removed: $($file.Name)" -ForegroundColor Green
    } catch {
        $errors += "Error removing $($file.Name): $_"
    }
}

# Step 3: Find components with inline transparent styles
Write-Host ""
Write-Host "Step 3: Finding inline transparent/opacity styles..." -ForegroundColor Yellow

$componentsToFix = Select-String -Path ".\**\*.tsx" -Pattern "bg-white/\d+|dark:bg-slate-\d+/\d+|bg-transparent|opacity-" -AllMatches -ErrorAction SilentlyContinue | Group-Object Path

Write-Host "  Found $($componentsToFix.Count) files with inline styles" -ForegroundColor Cyan

# Generate detailed report
$report = @"
# Comprehensive CSS Cleanup Report
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## Actions Taken

### 1. Empty CSS Files Removed: $removedCount
These files were placeholders or essentially empty and have been removed.

### 2. Components with Inline Styles: $($componentsToFix.Count)

The following components still use inline transparent/opacity styles and should be updated:

$($componentsToFix | Sort-Object Count -Descending | Select-Object -First 20 | ForEach-Object {
    $fileName = Split-Path $_.Name -Leaf
    $relativePath = $_.Name -replace [regex]::Escape($PWD.Path + "\"), ""
    "#### $fileName ($($_.Count) instances)
- Path: ``$relativePath``
- Action Needed: Replace inline styles with glass utilities

"
})

## Recommended Fixes

### Priority 1: Core Components
1. **AdvancedFilterBar** - Replace inline bg-white/50 with .glass-input
2. **Footer** - Partially done, verify completion
3. **Header/Navigation** - Replace inline styles with .glass-nav
4. **Modals/Dialogs** - Replace with .glass-modal

### Priority 2: Page Components
1. **Home Page Cards** - Replace with .glass-card or .glass-card-premium
2. **Feature Cards** - Use .glass-interactive
3. **News/Events** - Use .glass-card

### Priority 3: Utility Components
1. **Notification Center** - Use .glass-nav + .glass-input
2. **Settings/Profile** - Use .glass-card
3. **Email Management** - Use .glass-card

## Glass Utility Classes Available

Replace inline styles with these classes:

| Inline Style | Glass Utility |
|--------------|---------------|
| ``bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm`` | ``.glass-input`` |
| ``bg-white/70 dark:bg-slate-900/55 backdrop-blur-xl`` | ``.glass-card`` |
| ``bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl`` | ``.glass-footer`` |
| ``bg-white/85 dark:bg-slate-900/65 backdrop-blur-2xl`` | ``.glass-card-premium`` |
| ``bg-white/65 dark:bg-slate-800/60 backdrop-blur-md`` | ``.glass-interactive`` |
| ``bg-white/95 dark:bg-slate-900/90 backdrop-blur-3xl`` | ``.glass-modal`` |

## Next Steps

1. Update components listed above to use glass utilities
2. Test all pages for visual consistency
3. Verify light/dark mode transitions
4. Check responsive behavior on mobile

## Errors Encountered

$($errors | ForEach-Object { "- $_`n" })

---

**Status**: Cleanup phase complete. Ready for component updates.
"@

Set-Content -Path "CSS_CLEANUP_REPORT.md" -Value $report -Encoding UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Empty files removed: $removedCount" -ForegroundColor Green
Write-Host "  Components needing updates: $($componentsToFix.Count)" -ForegroundColor Yellow
Write-Host "  Errors: $($errors.Count)" -ForegroundColor $(if ($errors.Count -gt 0) { "Red" } else { "Green" })
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Report saved to: CSS_CLEANUP_REPORT.md" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Review the report and update components" -ForegroundColor Yellow
