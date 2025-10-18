# CSS Redundancy Cleanup & Glassmorphism Enhancement
# This script will:
# 1. Create a consolidated glassmorphism utility CSS file
# 2. Generate a report of inline CSS that should be modularized
# 3. List components that need to be updated

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CSS Redundancy Audit & Cleanup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Count inline transparent/opacity usage
Write-Host "Analyzing inline CSS usage..." -ForegroundColor Yellow

$transparentUsage = Select-String -Path ".\**\*.tsx" -Pattern "bg-white/\d+|dark:bg-slate-\d+/\d+|bg-transparent|opacity-\d+" -AllMatches
$totalMatches = $transparentUsage.Matches.Count

Write-Host "  Found $totalMatches instances of inline transparent/opacity styles" -ForegroundColor $(if ($totalMatches -gt 100) { "Red" } else { "Yellow" })

# Group by file
$fileGroups = $transparentUsage | Group-Object Path | Sort-Object Count -Descending

Write-Host ""
Write-Host "Top 10 files with most redundant inline styles:" -ForegroundColor Yellow
$fileGroups | Select-Object -First 10 | ForEach-Object {
    $fileName = Split-Path $_.Name -Leaf
    Write-Host "  $($_.Count.ToString().PadLeft(3)) occurrences in $fileName" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Recommendations:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Replace inline styles with utility classes:" -ForegroundColor White
Write-Host "   bg-white/80 dark:bg-slate-800/80 -> glass-card" -ForegroundColor Gray
Write-Host "   bg-white/90 dark:bg-slate-900/90 -> glass-card-premium" -ForegroundColor Gray
Write-Host "   backdrop-blur-xl -> (included in glass-card)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Use component-specific CSS modules for:" -ForegroundColor White
Write-Host "   - Footer" -ForegroundColor Gray
Write-Host "   - Header" -ForegroundColor Gray
Write-Host "   - Navigation components" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Convert all transparent backgrounds to opaque glassmorphism" -ForegroundColor White
Write-Host ""

# Generate fix report
$reportPath = "CSS_REDUNDANCY_REPORT.md"
$report = @"
# CSS Redundancy Report
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## Summary
- Total inline transparent/opacity usage: $totalMatches
- Files affected: $($fileGroups.Count)

## Top Files Needing Cleanup

$($fileGroups | Select-Object -First 20 | ForEach-Object {
    $fileName = Split-Path $_.Name -Leaf
    $relativePath = $_.Name -replace [regex]::Escape($PWD.Path + "\"), ""
    "### $fileName ($($_.Count) occurrences)
Path: ``$relativePath``
"
})

## Recommended Actions

### 1. Replace Common Inline Patterns

| Current (Inline) | Replacement (Utility Class) |
|------------------|----------------------------|
| ``bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm`` | ``glass-card`` |
| ``bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl`` | ``glass-card-premium`` |
| ``bg-white/60 dark:bg-slate-800/60`` | ``glass-subtle`` |
| ``border border-slate-200 dark:border-slate-700/30`` | ``glass-border-light`` |
| ``hover:bg-white/20 dark:hover:bg-slate-700/30`` | ``glass-hover`` |

### 2. Components Requiring Module CSS

1. **Footer** - \`components/layout/footer.tsx\`
2. **Header** - \`components/layout/header.tsx\`
3. **Navigation** - Various navigation components
4. **Cards** - Home page feature cards
5. **Modals/Dialogs** - Profile, settings dialogs

### 3. Glassmorphism Conversion

Convert all \`bg-transparent\` to proper opaque glassmorphism:

- ✅ Use \`rgba(255, 255, 255, 0.70)\` instead of \`transparent\`
- ✅ Add \`backdrop-filter: blur(16px)\`
- ✅ Apply proper shadows and borders
- ✅ Use theme-specific opacity (light: 60-85%, dark: 40-60%)

## Next Steps

1. Run \`fix-footer-layout.ps1\` to fix footer
2. Run \`consolidate-glass-styles.ps1\` to create utility classes  
3. Update components to use new classes
4. Test light/dark mode thoroughly
"@

Set-Content -Path $reportPath -Value $report -Encoding UTF8
Write-Host "Report saved to: $reportPath" -ForegroundColor Green
Write-Host ""
Write-Host "Run next: .\scripts\fix-footer-layout.ps1" -ForegroundColor Yellow
