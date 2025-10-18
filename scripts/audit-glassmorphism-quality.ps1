# Glassmorphism Quality Audit Script
# Scans CSS module files for proper glassmorphism implementation

Write-Host "🔍 Glassmorphism Quality Audit" -ForegroundColor Cyan
Write-Host ""

$rootPath = "e:\comsats-ite-app_5"
$cssModules = Get-ChildItem -Path $rootPath -Filter "*.module.css" -Recurse -File |
    Where-Object { 
        $_.FullName -notmatch "node_modules" -and 
        $_.FullName -notmatch "\\.next" 
    }

$totalFiles = $cssModules.Count
$qualityMetrics = @{
    HasBackdropBlur = 0
    HasTransparency = 0
    HasBorderRadius = 0
    HasBoxShadow = 0
    HasTransitions = 0
    HasHoverStates = 0
    FullQuality = 0
}

$detailedResults = @()

Write-Host "📊 Analyzing $totalFiles CSS module files..." -ForegroundColor Yellow
Write-Host ""

foreach ($cssFile in $cssModules) {
    $content = Get-Content $cssFile.FullName -Raw
    $relativePath = $cssFile.FullName.Replace($rootPath, "").TrimStart("\")
    
    $metrics = @{
        File = $relativePath
        HasBackdropBlur = $content -match 'backdrop-filter.*blur'
        HasTransparency = $content -match 'rgba\('
        HasBorderRadius = $content -match 'border-radius'
        HasBoxShadow = $content -match 'box-shadow'
        HasTransitions = $content -match 'transition'
        HasHoverStates = $content -match ':hover'
        Score = 0
    }
    
    # Calculate score
    $score = 0
    if ($metrics.HasBackdropBlur) { $score++; $qualityMetrics.HasBackdropBlur++ }
    if ($metrics.HasTransparency) { $score++; $qualityMetrics.HasTransparency++ }
    if ($metrics.HasBorderRadius) { $score++; $qualityMetrics.HasBorderRadius++ }
    if ($metrics.HasBoxShadow) { $score++; $qualityMetrics.HasBoxShadow++ }
    if ($metrics.HasTransitions) { $score++; $qualityMetrics.HasTransitions++ }
    if ($metrics.HasHoverStates) { $score++; $qualityMetrics.HasHoverStates++ }
    
    $metrics.Score = $score
    
    if ($score -eq 6) {
        $qualityMetrics.FullQuality++
        $metrics.Quality = "✅ Excellent"
    } elseif ($score -ge 4) {
        $metrics.Quality = "🟡 Good"
    } elseif ($score -ge 2) {
        $metrics.Quality = "🟠 Fair"
    } else {
        $metrics.Quality = "❌ Needs Work"
    }
    
    $detailedResults += [PSCustomObject]$metrics
}

Write-Host ""
Write-Host "📈 Quality Metrics Summary" -ForegroundColor Green
Write-Host ""
Write-Host "Feature Implementation:" -ForegroundColor Cyan
Write-Host "  🌫️  Backdrop Blur: $($qualityMetrics.HasBackdropBlur)/$totalFiles ($(($qualityMetrics.HasBackdropBlur/$totalFiles*100).ToString('0.0'))%)" -ForegroundColor $(if ($qualityMetrics.HasBackdropBlur/$totalFiles -gt 0.8) { 'Green' } else { 'Yellow' })
Write-Host "  🎨 Transparency: $($qualityMetrics.HasTransparency)/$totalFiles ($(($qualityMetrics.HasTransparency/$totalFiles*100).ToString('0.0'))%)" -ForegroundColor $(if ($qualityMetrics.HasTransparency/$totalFiles -gt 0.8) { 'Green' } else { 'Yellow' })
Write-Host "  📐 Border Radius: $($qualityMetrics.HasBorderRadius)/$totalFiles ($(($qualityMetrics.HasBorderRadius/$totalFiles*100).ToString('0.0'))%)" -ForegroundColor $(if ($qualityMetrics.HasBorderRadius/$totalFiles -gt 0.8) { 'Green' } else { 'Yellow' })
Write-Host "  💎 Box Shadow: $($qualityMetrics.HasBoxShadow)/$totalFiles ($(($qualityMetrics.HasBoxShadow/$totalFiles*100).ToString('0.0'))%)" -ForegroundColor $(if ($qualityMetrics.HasBoxShadow/$totalFiles -gt 0.8) { 'Green' } else { 'Yellow' })
Write-Host "  ⚡ Transitions: $($qualityMetrics.HasTransitions)/$totalFiles ($(($qualityMetrics.HasTransitions/$totalFiles*100).ToString('0.0'))%)" -ForegroundColor $(if ($qualityMetrics.HasTransitions/$totalFiles -gt 0.8) { 'Green' } else { 'Yellow' })
Write-Host "  🎯 Hover States: $($qualityMetrics.HasHoverStates)/$totalFiles ($(($qualityMetrics.HasHoverStates/$totalFiles*100).ToString('0.0'))%)" -ForegroundColor $(if ($qualityMetrics.HasHoverStates/$totalFiles -gt 0.8) { 'Green' } else { 'Yellow' })
Write-Host ""
Write-Host "Overall Quality:" -ForegroundColor Cyan
Write-Host "  ✅ Excellent (6/6): $($qualityMetrics.FullQuality) files ($(($qualityMetrics.FullQuality/$totalFiles*100).ToString('0.0'))%)" -ForegroundColor Green
Write-Host ""

# Generate detailed report
$report = @"
# Glassmorphism Quality Audit Report
**Generated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Project:** CampusAxis COMSATS ITE App

## Executive Summary

### Overall Statistics
- **Total CSS Modules Analyzed:** $totalFiles
- **Files with Full Quality (6/6):** $($qualityMetrics.FullQuality) ($(($qualityMetrics.FullQuality/$totalFiles*100).ToString('0.0'))%)

### Feature Implementation Rates

| Feature | Count | Percentage | Status |
|---------|-------|------------|--------|
| 🌫️ Backdrop Blur | $($qualityMetrics.HasBackdropBlur) | $(($qualityMetrics.HasBackdropBlur/$totalFiles*100).ToString('0.0'))% | $(if ($qualityMetrics.HasBackdropBlur/$totalFiles -gt 0.8) { '✅ Great' } elseif ($qualityMetrics.HasBackdropBlur/$totalFiles -gt 0.5) { '🟡 Good' } else { '🟠 Needs Work' }) |
| 🎨 Transparency (RGBA) | $($qualityMetrics.HasTransparency) | $(($qualityMetrics.HasTransparency/$totalFiles*100).ToString('0.0'))% | $(if ($qualityMetrics.HasTransparency/$totalFiles -gt 0.8) { '✅ Great' } elseif ($qualityMetrics.HasTransparency/$totalFiles -gt 0.5) { '🟡 Good' } else { '🟠 Needs Work' }) |
| 📐 Border Radius | $($qualityMetrics.HasBorderRadius) | $(($qualityMetrics.HasBorderRadius/$totalFiles*100).ToString('0.0'))% | $(if ($qualityMetrics.HasBorderRadius/$totalFiles -gt 0.8) { '✅ Great' } elseif ($qualityMetrics.HasBorderRadius/$totalFiles -gt 0.5) { '🟡 Good' } else { '🟠 Needs Work' }) |
| 💎 Box Shadow | $($qualityMetrics.HasBoxShadow) | $(($qualityMetrics.HasBoxShadow/$totalFiles*100).ToString('0.0'))% | $(if ($qualityMetrics.HasBoxShadow/$totalFiles -gt 0.8) { '✅ Great' } elseif ($qualityMetrics.HasBoxShadow/$totalFiles -gt 0.5) { '🟡 Good' } else { '🟠 Needs Work' }) |
| ⚡ Smooth Transitions | $($qualityMetrics.HasTransitions) | $(($qualityMetrics.HasTransitions/$totalFiles*100).ToString('0.0'))% | $(if ($qualityMetrics.HasTransitions/$totalFiles -gt 0.8) { '✅ Great' } elseif ($qualityMetrics.HasTransitions/$totalFiles -gt 0.5) { '🟡 Good' } else { '🟠 Needs Work' }) |
| 🎯 Hover States | $($qualityMetrics.HasHoverStates) | $(($qualityMetrics.HasHoverStates/$totalFiles*100).ToString('0.0'))% | $(if ($qualityMetrics.HasHoverStates/$totalFiles -gt 0.8) { '✅ Great' } elseif ($qualityMetrics.HasHoverStates/$totalFiles -gt 0.5) { '🟡 Good' } else { '🟠 Needs Work' }) |

### Quality Distribution

``````
Excellent (6/6): $('█' * [Math]::Min([Math]::Floor($qualityMetrics.FullQuality/$totalFiles*50), 50))$('░' * [Math]::Max(0, 50 - [Math]::Floor($qualityMetrics.FullQuality/$totalFiles*50)))
``````

---

## Top Quality Files (6/6 Score)

"@

# Add excellent files
$excellentFiles = $detailedResults | Where-Object { $_.Score -eq 6 } | Select-Object -First 50
foreach ($file in $excellentFiles) {
    $report += "`n- **$($file.File)** ✅"
}

$report += "`n`n## Files Needing Improvement (Score < 4)`n"

# Add files needing work
$needsWork = $detailedResults | Where-Object { $_.Score -lt 4 } | Sort-Object Score
foreach ($file in $needsWork) {
    $report += "`n### $($file.File) - Score: $($file.Score)/6"
    $report += "`n- Backdrop Blur: $(if ($file.HasBackdropBlur) {'✅'} else {'❌'})"
    $report += "`n- Transparency: $(if ($file.HasTransparency) {'✅'} else {'❌'})"
    $report += "`n- Border Radius: $(if ($file.HasBorderRadius) {'✅'} else {'❌'})"
    $report += "`n- Box Shadow: $(if ($file.HasBoxShadow) {'✅'} else {'❌'})"
    $report += "`n- Transitions: $(if ($file.HasTransitions) {'✅'} else {'❌'})"
    $report += "`n- Hover States: $(if ($file.HasHoverStates) {'✅'} else {'❌'})"
    $report += "`n"
}

$report += @"


---

## Recommendations

### High Priority
1. Add backdrop-filter blur to $(($totalFiles - $qualityMetrics.HasBackdropBlur)) files
2. Implement RGBA transparency in $(($totalFiles - $qualityMetrics.HasTransparency)) files
3. Add hover states to $(($totalFiles - $qualityMetrics.HasHoverStates)) files

### Medium Priority
4. Add smooth transitions to $(($totalFiles - $qualityMetrics.HasTransitions)) files
5. Implement box shadows to $(($totalFiles - $qualityMetrics.HasBoxShadow)) files

### Low Priority
6. Add border radius to $(($totalFiles - $qualityMetrics.HasBorderRadius)) files

---

**Report Generated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
"@

$reportPath = "$rootPath\GLASSMORPHISM_QUALITY_REPORT.md"
$report | Out-File -FilePath $reportPath -Encoding UTF8

Write-Host "📝 Detailed report saved to: $reportPath" -ForegroundColor Green
Write-Host ""

# Export data for further processing
$resultsPath = "$rootPath\glassmorphism-quality-data.json"
$detailedResults | ConvertTo-Json -Depth 10 | Out-File -FilePath $resultsPath -Encoding UTF8

Write-Host "📊 Quality data exported to: $resultsPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ Audit complete!" -ForegroundColor Green
