# CSS Modules Audit Script
# Analyzes all TSX files and their corresponding CSS modules

Write-Host "🔍 Starting CSS Modules Audit..." -ForegroundColor Cyan
Write-Host ""

$rootPath = "e:\comsats-ite-app_5"
$reportPath = "$rootPath\CSS_MODULES_AUDIT.md"

# Find all TSX files
$tsxFiles = Get-ChildItem -Path $rootPath -Filter "*.tsx" -Recurse -File | 
    Where-Object { 
        $_.FullName -notmatch "node_modules" -and 
        $_.FullName -notmatch "\\.next" -and
        $_.FullName -notmatch "\\dist" 
    }

$totalTsx = $tsxFiles.Count
$complete = 0
$partial = 0
$missing = 0
$details = @()

Write-Host "📊 Found $totalTsx TSX files to analyze" -ForegroundColor Yellow
Write-Host ""

foreach ($tsx in $tsxFiles) {
    $dir = $tsx.DirectoryName
    $baseName = $tsx.BaseName
    $relativePath = $tsx.FullName.Replace($rootPath, "").TrimStart("\")
    
    # Check for CSS module files
    $baseModule = Join-Path $dir "$baseName.module.css"
    $darkModule = Join-Path $dir "$baseName.dark.module.css"
    $lightModule = Join-Path $dir "$baseName.light.module.css"
    
    $hasBase = Test-Path $baseModule
    $hasDark = Test-Path $darkModule
    $hasLight = Test-Path $lightModule
    
    $moduleCount = @($hasBase, $hasDark, $hasLight | Where-Object { $_ }).Count
    
    $status = switch ($moduleCount) {
        3 { "✅ Complete"; $complete++; "complete" }
        {$_ -gt 0} { "⚠️ Partial ($moduleCount/3)"; $partial++; "partial" }
        default { "❌ Missing"; $missing++; "missing" }
    }
    
    $details += [PSCustomObject]@{
        File = $relativePath
        Status = $status
        HasBase = $hasBase
        HasDark = $hasDark
        HasLight = $hasLight
        Path = $tsx.FullName
    }
}

Write-Host ""
Write-Host "📈 Analysis Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Complete: $complete files ($(($complete/$totalTsx*100).ToString('0.0'))%)" -ForegroundColor Green
Write-Host "  ⚠️ Partial: $partial files ($(($partial/$totalTsx*100).ToString('0.0'))%)" -ForegroundColor Yellow
Write-Host "  ❌ Missing: $missing files ($(($missing/$totalTsx*100).ToString('0.0'))%)" -ForegroundColor Red
Write-Host ""

# Generate detailed report
$report = @"
# CSS Modules Audit Report
**Generated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Project:** CampusAxis COMSATS ITE App

## Executive Summary

### Statistics
- **Total TSX Files:** $totalTsx
- **✅ Complete (3/3 modules):** $complete ($(($complete/$totalTsx*100).ToString('0.0'))%)
- **⚠️ Partial (1-2/3 modules):** $partial ($(($partial/$totalTsx*100).ToString('0.0'))%)
- **❌ Missing (0/3 modules):** $missing ($(($missing/$totalTsx*100).ToString('0.0'))%)

### Progress Bar
``````
Complete:  $('█' * [Math]::Floor($complete/$totalTsx*50))$('░' * (50 - [Math]::Floor($complete/$totalTsx*50)))
Partial:   $('█' * [Math]::Floor($partial/$totalTsx*50))$('░' * (50 - [Math]::Floor($partial/$totalTsx*50)))
Missing:   $('█' * [Math]::Floor($missing/$totalTsx*50))$('░' * (50 - [Math]::Floor($missing/$totalTsx*50)))
``````

---

## Detailed File Analysis

### ✅ Complete Files (3/3 modules)

"@

# Add complete files
$completeFiles = $details | Where-Object { $_.Status -like "*Complete*" } | Sort-Object File
foreach ($file in $completeFiles) {
    $report += "`n- **$($file.File)**"
}

$report += "`n`n### ⚠️ Partial Files (1-2/3 modules)`n"

# Add partial files with details
$partialFiles = $details | Where-Object { $_.Status -like "*Partial*" } | Sort-Object File
foreach ($file in $partialFiles) {
    $report += "`n#### $($file.File)"
    $report += "`n- Base Module: $(if ($file.HasBase) {'✅'} else {'❌'})"
    $report += "`n- Dark Module: $(if ($file.HasDark) {'✅'} else {'❌'})"
    $report += "`n- Light Module: $(if ($file.HasLight) {'✅'} else {'❌'})"
    $report += "`n"
}

$report += "`n### ❌ Missing Files (0/3 modules)`n"

# Add missing files
$missingFiles = $details | Where-Object { $_.Status -like "*Missing*" } | Sort-Object File
foreach ($file in $missingFiles) {
    $report += "`n- **$($file.File)**"
}

$report += @"


---

## Glassmorphism Quality Standards

Each CSS module should implement:

### Visual Design
- ✅ Backdrop blur: `backdrop-filter: blur(12px) saturate(150%);`
- ✅ Semi-transparent background: `rgba(255, 255, 255, 0.88)` or theme equivalent
- ✅ Subtle borders: `border: 1px solid rgba(255, 255, 255, 0.2);`
- ✅ Layered shadows for depth
- ✅ Smooth transitions (300ms ease)

### Responsive Behavior
- ✅ Hover states with increased blur/opacity
- ✅ Focus states for accessibility
- ✅ Mobile-optimized touch targets
- ✅ Reduced motion support

### Performance
- ✅ Hardware acceleration: `transform: translateZ(0);`
- ✅ Will-change hints for animated properties
- ✅ Optimized blur values (avoid >24px)

---

## Next Steps

### Priority Actions
1. **Create missing CSS modules** for $missing files
2. **Complete partial implementations** for $partial files
3. **Quality audit** of existing $complete complete files
4. **Implement glassmorphism patterns** across all modules
5. **Test visual consistency** across light/dark themes

### Automation Recommendations
- Run this audit script regularly during development
- Integrate into CI/CD pipeline
- Set up pre-commit hooks to verify CSS modules exist
- Create templates for new component CSS modules

---

**Report Generated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
"@

# Save report
$report | Out-File -FilePath $reportPath -Encoding UTF8

Write-Host "📝 Report saved to: $reportPath" -ForegroundColor Green
Write-Host ""

# Export missing and partial files list for batch creation
$needsWork = $details | Where-Object { $_.Status -notlike "*Complete*" }
$needsWorkPath = "$rootPath\files-needing-css-modules.json"
$needsWork | ConvertTo-Json -Depth 10 | Out-File -FilePath $needsWorkPath -Encoding UTF8

Write-Host "📋 Files needing work exported to: $needsWorkPath" -ForegroundColor Cyan
Write-Host "   ($($needsWork.Count) files require attention)" -ForegroundColor Yellow
Write-Host ""
Write-Host "✨ Audit complete! Review $reportPath for details." -ForegroundColor Green
